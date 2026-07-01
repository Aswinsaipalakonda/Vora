from django.contrib import admin
from .models import MembershipPlan, Subscription

@admin.register(MembershipPlan)
class MembershipPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'period', 'tenant')
    list_filter = ('period', 'tenant')
    search_fields = ('name',)

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('customer', 'plan', 'start_date', 'expiry_date', 'status', 'tenant')
    list_filter = ('status', 'tenant')
    search_fields = ('customer__name', 'plan__name')
