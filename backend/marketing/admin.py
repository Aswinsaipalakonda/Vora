from django.contrib import admin
from .models import Segment, Campaign, Template

@admin.register(Segment)
class SegmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'member_count', 'tenant')
    search_fields = ('name',)

@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ('name', 'channel', 'status', 'scheduled_date', 'recipient_count', 'tenant')
    list_filter = ('channel', 'status', 'tenant')
    search_fields = ('name',)

@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'template_type', 'tenant')
    list_filter = ('template_type', 'tenant')
    search_fields = ('name',)
