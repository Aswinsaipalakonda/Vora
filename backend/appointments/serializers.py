from rest_framework import serializers
from .models import Appointment, Service, ServiceCategory

class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    
    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'price', 'duration_minutes', 'category', 'category_name', 'is_active', 'tenant']

class AppointmentSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.name')
    service_name = serializers.ReadOnlyField(source='service.name')
    
    class Meta:
        model = Appointment
        fields = '__all__'
