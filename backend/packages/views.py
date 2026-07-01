from rest_framework import permissions
from .models import Package, PackageSubscription
from .serializers import PackageSerializer, PackageSubscriptionSerializer
from inventory.views import InventoryBaseViewSet
from vora_backend.feature_permissions import HasFeaturePermission

class PackageViewSet(InventoryBaseViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    permission_classes = [permissions.IsAuthenticated, HasFeaturePermission]
    required_feature = 'packages'

class PackageSubscriptionViewSet(InventoryBaseViewSet):
    queryset = PackageSubscription.objects.all()
    serializer_class = PackageSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated, HasFeaturePermission]
    required_feature = 'packages'
