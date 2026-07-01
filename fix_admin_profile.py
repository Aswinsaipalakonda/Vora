import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vora_backend.settings')
django.setup()

from django.contrib.auth.models import User
from user_auth.models import UserProfile

try:
    u = User.objects.get(username='admin')
    p, created = UserProfile.objects.get_or_create(user=u)
    
    # Set all flags to True to match "Super Admin" role defaults
    p.is_super_admin = True
    p.can_access_inventory = True
    p.can_access_marketing = True
    p.can_access_memberships = True
    p.can_access_packages = True
    p.can_access_advanced_scheduling = True
    p.can_access_staff_mgmt = True
    p.can_access_whatsapp = True
    p.can_access_notifications = True
    p.can_access_ai_assistant = True
    p.can_access_promo_campaigns = True
    p.can_access_sponsored_ads = True
    p.can_access_loyalty = True
    p.can_access_analytics = True
    p.can_access_staff_performance = True
    p.can_access_priority_support = True
    p.can_access_whitelabel = True
    p.can_access_multi_center = True
    p.can_access_api = True
    p.can_access_dedicated_manager = True
    p.can_access_advanced_security = True
    p.can_access_custom_reporting = True
    p.can_access_onboarding = True
    
    p.save()
    print("Successfully updated admin profile with all superadmin permissions.")
except User.DoesNotExist:
    print("User 'admin' does not exist.")
except Exception as e:
    print(f"Error: {e}")
