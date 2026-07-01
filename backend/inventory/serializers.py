from rest_framework import serializers
from .models import Category, Supplier, Product, StockTransaction

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'tenant']
        read_only_fields = ['tenant']

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['id', 'name', 'contact_name', 'phone', 'email', 'address', 'tenant']
        read_only_fields = ['tenant']

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    supplier_name = serializers.ReadOnlyField(source='supplier.name')

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'sku', 'category', 'category_name', 
            'supplier', 'supplier_name', 'description', 
            'stock_quantity', 'reorder_level', 'unit_price', 
            'cost_price', 'tenant'
        ]
        read_only_fields = ['tenant', 'stock_quantity']

class StockTransactionSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    user_name = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = StockTransaction
        fields = [
            'id', 'product', 'product_name', 'transaction_type', 
            'quantity', 'date', 'notes', 'user', 'user_name', 'tenant'
        ]
        read_only_fields = ['tenant', 'date', 'user']
