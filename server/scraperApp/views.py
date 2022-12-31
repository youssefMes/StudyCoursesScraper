from rest_framework import viewsets, status
from .models import Bookmark, Course                
from .serializers import CourseSerializer, BookmarkSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import filters, generics
from rest_framework.pagination import LimitOffsetPagination
from operator import or_
from functools import reduce
from django.db.models import Q

class Pagination(LimitOffsetPagination):
    page_size = 50
    max_page_size = 500
    offset_query_param = 'page'



class CourseView(viewsets.ModelViewSet):  
    serializer_class = CourseSerializer
    queryset = Course.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['@name']
    pagination_class = Pagination
    def get_queryset(self):
        '''
        List all the courses
        '''
        queryset = super().get_queryset()
        cities =  self.request.GET.getlist('cities')
        degrees =  self.request.GET.getlist('degrees')
        study_forms =  self.request.GET.getlist('study_forms')
        portals =  self.request.GET.getlist('portals')        
        languages =  self.request.GET.getlist('languages')        
        
        if cities:
            queryset=queryset.filter(reduce(or_, [Q(information__city__icontains=city) for city in cities]))
        if degrees:
            queryset=queryset.filter(reduce(or_, [Q(information__degree__icontains=degree) for degree in degrees]))
        if study_forms:
            queryset=queryset.filter(reduce(or_, [Q(information__study_form__icontains=study_form) for study_form in study_forms]))
        if portals:
            queryset=queryset.filter(reduce(or_, [Q(portal__name=portal) for portal in portals]))
        if languages:
            queryset=queryset.filter(reduce(or_, [Q(information__languages__icontains=language) for language in languages]))

        return queryset

class BookmarkView(viewsets.ViewSet):  
    serializer_class = BookmarkSerializer
    queryset = Bookmark.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination

    def list(self, request):
        bookmarks = self.queryset.filter(user__email=request.user)
        paginator = Pagination()
        page = paginator.paginate_queryset(bookmarks, self.request)
        if page is not None:
            serializer = BookmarkSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = BookmarkSerializer(self.queryset, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk):
        to_delete =  Bookmark.objects.get(pk=pk)
        to_delete.delete()

        return Response({
            'message': 'Bookmark deleted Successfully'
        })


class FiltersView(generics.ListCreateAPIView):  
    queryset = Course.objects.values(
        'portal__name', 'information__city', 'information__degree', 'information__study_form', 'information__languages'
    ).distinct()
    
    def list(self, request):
        queryset = self.get_queryset()
        cities = []
        degrees = ['Master', 'Bachelor']
        study_forms = []
        portals = []
        languages = []
        for item in queryset:
            if item['portal__name'] not in portals:
                portals.append(item['portal__name'])
            if not any(deg in item['information__degree'] for deg in degrees):
                degrees.append(item['information__degree'])
            if item['information__languages']:
                for l in item['information__languages'].split(','):
                    if l not in languages:
                        languages.append(l)
            for form in item['information__study_form'].split(','):
                if not any(form in item for item in study_forms):
                    study_forms.append(form)
            
            for location in item['information__city'].split(','):
                if  location not in cities:
                    cities.append(location)
        return Response(
                    {
                        'cities': sorted(cities),
                        'degrees': degrees,
                        'study_form': sorted(study_forms),
                        'portals': sorted(portals),
                        'languages': sorted(languages)
                    }
                )