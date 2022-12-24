from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from .models import User, Course
from django.http import HttpResponse
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id' ,'name', 'information', 'link', 'portal')
        depth=2


class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ('password','first_name', 'last_name', 'email')
        extra_kwargs = {
            'password':{'write_only': True},
        }

