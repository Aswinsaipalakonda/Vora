from rest_framework import serializers
from .models import MembershipPlan, Subscription
from customers.models import Customer

class MembershipPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MembershipPlan
        fields = ['id', 'name', 'price', 'period', 'description', 'features', 'color', 'gradient', 'icon_name']

class SubscriptionSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    
    class Meta:
        model = Subscription
        fields = ['id', 'customer', 'customer_name', 'plan', 'plan_name', 'start_date', 'expiry_date', 'status']
