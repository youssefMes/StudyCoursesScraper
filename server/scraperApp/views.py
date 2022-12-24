from rest_framework import viewsets
from .models import Course                 
from .serializers import CourseSerializer 
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework import generics, permissions, mixins
from rest_framework.response import Response
from .serializers import UserSerializer
from django.contrib.auth.models import User



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