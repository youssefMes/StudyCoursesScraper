from rest_framework import viewsets
from .models import Course                 
from .serializers import CourseSerializer 

class CourseView(viewsets.ModelViewSet):  
    serializer_class = CourseSerializer
    queryset = Course.objects.all()
    def get_queryset(self):
        '''
        List all the courses
        '''
        queryset = super().get_queryset()
        city =  self.request.GET.get('city')
        degree =  self.request.GET.get('degree')
        study_form =  self.request.GET.get('study_form')
        name =  self.request.GET.get('name')
          
        if city:
            queryset=queryset.filter(information__city__icontains=city)
        if degree:
            queryset=queryset.filter(information__degree__icontains=degree)
        if study_form:
            queryset=queryset.filter(information__study_form__icontains=study_form)
        if name:
            queryset=queryset.filter(information__study_form__icontains=name)

        return queryset
    