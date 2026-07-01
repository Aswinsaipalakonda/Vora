from rest_framework import viewsets, permissions
from .models import Category, Supplier, Product, StockTransaction
from .serializers import (
    CategorySerializer, SupplierSerializer, 
    ProductSerializer, StockTransactionSerializer
)
from vora_backend.feature_permissions import HasFeaturePermission

class InventoryBaseViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filtering by tenants where the user is a member/owner.
        return self.queryset.filter(tenant__in=self.request.user.tenants.all() | self.request.user.owned_tenants.all()).distinct()

    def perform_create(self, serializer):
        # Automatically set the tenant based on the user's first tenant (for simplicity)
        tenant = self.request.user.owned_tenants.first() or self.request.user.tenants.first()
        serializer.save(tenant=tenant)

class CategoryViewSet(InventoryBaseViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated, HasFeaturePermission]
    required_feature = 'inventory'

class SupplierViewSet(InventoryBaseViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [permissions.IsAuthenticated, HasFeaturePermission]
    required_feature = 'inventory'

class ProductViewSet(InventoryBaseViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated, HasFeaturePermission]
    required_feature = 'inventory'

class StockTransactionViewSet(InventoryBaseViewSet):
    queryset = StockTransaction.objects.all()
    serializer_class = StockTransactionSerializer
    permission_classes = [permissions.IsAuthenticated, HasFeaturePermission]
    required_feature = 'inventory'

    def perform_create(self, serializer):
        tenant = self.request.user.owned_tenants.first() or self.request.user.tenants.first()
        serializer.save(tenant=tenant, user=self.request.user)
