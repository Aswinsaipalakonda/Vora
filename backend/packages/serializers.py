from rest_framework import serializers
from .models import Package, PackageSubscription

class PackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = ['id', 'name', 'price', 'validity_days', 'services', 'color', 'icon_name', 'is_popular']

class PackageSubscriptionSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    package_name = serializers.CharField(source='package.name', read_only=True)
    
    class Meta:
        model = PackageSubscription
        fields = ['id', 'customer', 'customer_name', 'package', 'package_name', 'purchase_date', 'expiry_date', 'status']
