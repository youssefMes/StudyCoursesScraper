from rest_framework import serializers
from .models import Bookmark, User, Course, Comment
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(source='comment_set', many=True)
    class Meta:
        model = Course
        fields = ('id' ,'name' , 'evaluation_count', 'information', 'link', 'portal', 'comments')
        depth=2

class BookmarkSerializer(serializers.ModelSerializer):
    course_name = serializers.ReadOnlyField(source='course.name')
    university = serializers.ReadOnlyField(source='course.information.university')
    class Meta:
        model = Bookmark
        fields = ('user' ,'course_name','university', 'course')
        extra_kwargs = {
            'user': {'write_only': True},
        }

class UserCreateSerializer(BaseUserCreateSerializer):
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ('password','first_name', 'last_name', 'email')