from django.contrib import admin
from .models import Invoice, InvoiceItem

class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 0

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'customer', 'date', 'status', 'total_amount', 'tenant')
    list_filter = ('status', 'date', 'tenant')
    search_fields = ('invoice_number', 'customer__name')
    inlines = [InvoiceItemInline]

@admin.register(InvoiceItem)
class InvoiceItemAdmin(admin.ModelAdmin):
    list_display = ('description', 'invoice', 'quantity', 'unit_price')
    search_fields = ('description', 'invoice__invoice_number')
