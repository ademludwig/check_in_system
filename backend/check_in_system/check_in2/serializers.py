# serializers.py
from rest_framework import serializers
from .models import teacher

class TeacherMinimalSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.EmailField(source='user.email')

    class Meta:
        model = teacher
        fields = ['first_name', 'last_name', 'email','code','department','phone']
        
