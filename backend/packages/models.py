from django.db import models
from tenant.models import TenantAwareModel
from customers.models import Customer

class Package(TenantAwareModel):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    validity_days = models.IntegerField(default=30)
    services = models.JSONField(default=list, help_text="List of service names included in the package")
    color = models.CharField(max_length=50, default="bg-rose-500", help_text="Tailwind color class")
    icon_name = models.CharField(max_length=50, default="Zap", help_text="Lucide icon name")
    is_popular = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.name} - {self.tenant.name}"

class PackageSubscription(TenantAwareModel):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Exhausted', 'Exhausted'),
        ('Expired', 'Expired'),
    ]
    
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='package_subscriptions')
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='subscriptions')
    purchase_date = models.DateField(auto_now_add=True)
    expiry_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    
    def __str__(self):
        return f"{self.customer.name} - {self.package.name} ({self.status})"
