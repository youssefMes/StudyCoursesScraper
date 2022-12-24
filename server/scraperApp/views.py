import math
from pickle import FALSE
from rest_framework import viewsets, status
from .models import Bookmark, Course                 
from .serializers import CourseSerializer, BookmarkSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response


class CourseView(viewsets.ModelViewSet):  
    serializer_class = CourseSerializer
    queryset = Course.objects.all()
    permission_classes = [IsAuthenticated]
    
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
        if name:
            queryset=queryset.filter(information__study_form__icontains=name)
        if portal:
            queryset=queryset.filter(portal__name=portal)

        return queryset


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
