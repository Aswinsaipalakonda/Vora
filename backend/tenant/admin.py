from django.contrib import admin
from .models import Tenant

@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ('name', 'subdomain', 'owner', 'status', 'sms_credits')
    list_filter = ('status',)
    search_fields = ('name', 'subdomain', 'owner__username')
    filter_horizontal = ('members',)

def dashboard_callback(request, context):
    """
    Callback for Unfold dashboard.
    """
    return context
