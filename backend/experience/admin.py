from django.contrib import admin
from .models import Staff, ReviewTag, Review

@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'rating', 'is_active', 'tenant')
    list_filter = ('role', 'is_active', 'tenant')
    search_fields = ('name',)

@admin.register(ReviewTag)
class ReviewTagAdmin(admin.ModelAdmin):
    list_display = ('name', 'tenant')
    search_fields = ('name',)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('customer_name', 'rating', 'sentiment', 'staff', 'is_replied', 'tenant')
    list_filter = ('rating', 'sentiment', 'is_replied', 'tenant')
    search_fields = ('customer_name', 'text')
