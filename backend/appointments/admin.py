from django.contrib import admin
from .models import ServiceCategory, Service, Appointment

@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'tenant')
    search_fields = ('name',)

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'duration_minutes', 'is_active', 'tenant')
    list_filter = ('category', 'is_active', 'tenant')
    search_fields = ('name',)

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('customer', 'service', 'date', 'time', 'status', 'tenant')
    list_filter = ('status', 'date', 'tenant')
    search_fields = ('customer__name', 'service__name')
