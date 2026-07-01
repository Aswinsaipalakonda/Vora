from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    birthday = models.DateField(blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    
    # Permission Overrides (allows bypassing plan restrictions)
    can_access_inventory = models.BooleanField(default=False)
    can_access_marketing = models.BooleanField(default=False)
    can_access_memberships = models.BooleanField(default=False)
    can_access_packages = models.BooleanField(default=False)
    can_access_advanced_scheduling = models.BooleanField(default=False)
    can_access_staff_mgmt = models.BooleanField(default=False)
    can_access_whatsapp = models.BooleanField(default=False)
    
    # Newly added from pricing tiers
    can_access_notifications = models.BooleanField(default=False)
    can_access_ai_assistant = models.BooleanField(default=False)
    can_access_promo_campaigns = models.BooleanField(default=False)
    can_access_sponsored_ads = models.BooleanField(default=False)
    can_access_loyalty = models.BooleanField(default=False)
    can_access_analytics = models.BooleanField(default=False)
    can_access_staff_performance = models.BooleanField(default=False)
    can_access_priority_support = models.BooleanField(default=False)
    can_access_whitelabel = models.BooleanField(default=False)
    can_access_multi_center = models.BooleanField(default=False)
    can_access_api = models.BooleanField(default=False)
    can_access_dedicated_manager = models.BooleanField(default=False)
    can_access_advanced_security = models.BooleanField(default=False)
    can_access_custom_reporting = models.BooleanField(default=False)
    can_access_onboarding = models.BooleanField(default=False)

    is_super_admin = models.BooleanField(default=False, help_text="Bypass all plan restrictions")

    def __str__(self):
        return f"Profile for {self.user.username}"
