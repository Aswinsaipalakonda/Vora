from rest_framework import viewsets
from inventory.views import InventoryBaseViewSet # Reusing the tenant-isolation logic
from .models import Customer
from .serializers import CustomerSerializer

class CustomerViewSet(InventoryBaseViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    search_fields = ['name', 'phone', 'email']
