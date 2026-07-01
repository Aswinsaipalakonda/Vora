from rest_framework import serializers
from django.contrib.auth.models import User
from tenant.models import Tenant
from django.db import transaction
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'phone', 'bio', 'location', 'birthday', 'avatar',
            'can_access_inventory', 'can_access_marketing', 'can_access_memberships',
            'can_access_packages', 'can_access_advanced_scheduling', 'can_access_staff_mgmt',
            'can_access_whatsapp', 'can_access_notifications', 'can_access_ai_assistant',
            'can_access_promo_campaigns', 'can_access_sponsored_ads', 'can_access_loyalty',
            'can_access_analytics', 'can_access_staff_performance', 'can_access_priority_support',
            'can_access_whitelabel', 'can_access_multi_center', 'can_access_api',
            'can_access_dedicated_manager', 'can_access_advanced_security',
            'can_access_custom_reporting', 'can_access_onboarding', 'is_super_admin'
        ]

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']

class TenantSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = ['id', 'name', 'subdomain', 'status', 'sms_credits', 'plan']

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class RegisterSerializer(serializers.Serializer):
    # User fields
    fullName = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    # Tenant/Salon fields
    salonName = serializers.CharField()
    phone = serializers.CharField()
    address = serializers.CharField()
    industryType = serializers.ListField(child=serializers.CharField(), required=False)
    clienteleType = serializers.CharField()
    
    # Files are handled via request.FILES in the view, but we can define them here if needed
    # panFile = serializers.FileField(required=False)
    # businessProof = serializers.FileField(required=False)

    def create(self, validated_data):
        with transaction.atomic():
            # Create User
            full_name = validated_data.pop('fullName')
            first_name = full_name.split()[0] if full_name else ""
            last_name = " ".join(full_name.split()[1:]) if len(full_name.split()) > 1 else ""
            
            user = User.objects.create_user(
                username=validated_data['email'],
                email=validated_data['email'],
                password=validated_data['password'],
                first_name=first_name,
                last_name=last_name
            )
            
            # Create Tenant
            tenant = Tenant.objects.create(
                owner=user,
                name=validated_data['salonName'],
                phone=validated_data['phone'],
                address=validated_data['address'],
                industry_type=validated_data.get('industryType', []),
                clientele_type=validated_data['clienteleType']
            )
            
            return user, tenant
