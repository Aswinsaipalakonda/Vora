from django.contrib import admin
from .models import Package, PackageSubscription

@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'validity_days', 'is_popular', 'tenant')
    list_filter = ('is_popular', 'tenant')
    search_fields = ('name',)

@admin.register(PackageSubscription)
class PackageSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('customer', 'package', 'purchase_date', 'expiry_date', 'status', 'tenant')
    list_filter = ('status', 'tenant')
    search_fields = ('customer__name', 'package__name')
