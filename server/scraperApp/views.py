from rest_framework import viewsets, status
from .models import Bookmark, Course                
from .serializers import CourseSerializer, BookmarkSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import filters, generics
from rest_framework.pagination import LimitOffsetPagination

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
        city =  self.request.GET.get('city')
        degree =  self.request.GET.get('degree')
        study_form =  self.request.GET.get('study_form')
        name =  self.request.GET.get('name')
        portal =  self.request.GET.get('portal')

        if city:
            queryset=queryset.filter(information__city__icontains=city)
        if degree:
            queryset=queryset.filter(information__degree__icontains=degree)
        if study_form:
            queryset=queryset.filter(information__study_form__icontains=study_form)
        if portal:
            queryset=queryset.filter(portal__name=portal)

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
        'portal__name', 'information__city', 'information__degree', 'information__study_form'
    ).distinct()
    
    def list(self, request):
        queryset = self.get_queryset()
        cities = []
        degrees = []
        ##todo make study_form an array field
        study_forms = []
        portals = []
        for item in queryset:
            print('item', item)
            if item['portal__name'] not in portals:
                portals.append(item['portal__name'])
            if item['information__degree'] not in degrees:
                degrees.append(item['information__degree'])
            for form in item['information__study_form'].split(','):
                if form not in study_forms:
                    study_forms.append(form)
                
            for location in item['information__city']:
                if  location not in cities:
                    cities.append(location)
        return Response({'cities': cities, 'degrees': degrees, 'study_form': study_forms, 'portals': portals })