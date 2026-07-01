from rest_framework import serializers
from .models import Staff, ReviewTag, Review

class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = '__all__'

class ReviewTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewTag
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source='staff.name', read_only=True)
    tags_list = serializers.StringRelatedField(source='tags', many=True, read_only=True)
    
    class Meta:
        model = Review
        fields = '__all__'
