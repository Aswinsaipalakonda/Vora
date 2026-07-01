from django.contrib import admin
from .models import FAQCategory, FAQ, SupportTicket, TicketMessage

@admin.register(FAQCategory)
class FAQCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'order')
    search_fields = ('name',)

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'category', 'order', 'is_popular')
    list_filter = ('category', 'is_popular')
    search_fields = ('question', 'answer')

class TicketMessageInline(admin.TabularInline):
    model = TicketMessage
    extra = 1

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ('subject', 'status', 'created_by', 'tenant', 'created_at')
    list_filter = ('status', 'tenant')
    search_fields = ('subject', 'description')
    inlines = [TicketMessageInline]
