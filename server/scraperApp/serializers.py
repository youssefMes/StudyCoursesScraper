from rest_framework import serializers
from .models import User, Course

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id' ,'name', 'information', 'link', 'portal')
        depth=2


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('password','first_name', 'last_name', 'type', 'email')
        extra_kwargs = {
            'password':{'write_only': True},
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
        

# User serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'