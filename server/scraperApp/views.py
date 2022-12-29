import math
from rest_framework import viewsets, status
from .models import Bookmark, Course, Information                
from .serializers import CourseSerializer, BookmarkSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import filters, generics
from django_filters.rest_framework import DjangoFilterBackend


class CourseView(generics.ListCreateAPIView):  
    serializer_class = CourseSerializer
    queryset = Course.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = ['information__city', 'information__degree', 'information__study_form', 'portal__name']
    search_fields = ['@name']

    

class BookmarkView(viewsets.ViewSet):  
    serializer_class = BookmarkSerializer
    queryset = Bookmark.objects.all()
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        page = int(request.GET.get('page', 1))
        limit = int(request.GET.get('limit', 10))
        start = (page - 1) * limit
        end = limit * page
        bookmarks = self.queryset.filter(user__email=request.user)
        serializer = self.serializer_class(bookmarks[start:end], many=True)
        return Response({'count': bookmarks.count(), 'bookmarks': serializer.data}, status.HTTP_200_OK)
    
    
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