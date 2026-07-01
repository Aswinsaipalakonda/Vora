from rest_framework import permissions
from inventory.views import InventoryBaseViewSet
from .models import Appointment, Service, ServiceCategory
from .serializers import AppointmentSerializer, ServiceSerializer, ServiceCategorySerializer
from vora_backend.feature_permissions import HasFeaturePermission

class ServiceCategoryViewSet(InventoryBaseViewSet):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    permission_classes = [permissions.IsAuthenticated, HasFeaturePermission]
    required_feature = 'inventory'   # Service categories = service menu = inventory gate

class ServiceViewSet(InventoryBaseViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated, HasFeaturePermission]
    required_feature = 'inventory'

class AppointmentViewSet(InventoryBaseViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated, HasFeaturePermission]
    required_feature = 'advanced_scheduling'
