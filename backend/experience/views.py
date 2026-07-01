from rest_framework import viewsets, permissions
from .models import Staff, ReviewTag, Review
from .serializers import StaffSerializer, ReviewTagSerializer, ReviewSerializer
from inventory.views import InventoryBaseViewSet

class StaffViewSet(InventoryBaseViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer

class ReviewTagViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewTagSerializer
    
    def get_queryset(self):
        tenant_id = self.request.headers.get('X-Tenant-Id')
        return ReviewTag.objects.filter(tenant_id=tenant_id)

    def perform_create(self, serializer):
        tenant_id = self.request.headers.get('X-Tenant-Id')
        serializer.save(tenant_id=tenant_id)

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    
    def get_queryset(self):
        tenant_id = self.request.headers.get('X-Tenant-Id')
        return Review.objects.filter(tenant_id=tenant_id).order_by('-created_at')

    def perform_create(self, serializer):
        tenant_id = self.request.headers.get('X-Tenant-Id')
        serializer.save(tenant_id=tenant_id)
