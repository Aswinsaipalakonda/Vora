from django.contrib import admin
from .models import Category, Supplier, Product, StockTransaction

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'tenant')
    search_fields = ('name',)

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ('name', 'contact_name', 'phone', 'email', 'tenant')
    search_fields = ('name', 'contact_name')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'category', 'stock_quantity', 'unit_price', 'tenant')
    list_filter = ('category', 'tenant')
    search_fields = ('name', 'sku')

@admin.register(StockTransaction)
class StockTransactionAdmin(admin.ModelAdmin):
    list_display = ('product', 'transaction_type', 'quantity', 'date', 'tenant')
    list_filter = ('transaction_type', 'date', 'tenant')
    search_fields = ('product__name',)
