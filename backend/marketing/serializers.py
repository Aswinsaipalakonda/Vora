from rest_framework import serializers
from .models import Campaign, Segment, Template

class SegmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Segment
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at')

class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at')

class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at')
