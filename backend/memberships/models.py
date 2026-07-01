from django.db import models
from tenant.models import TenantAwareModel
from customers.models import Customer

class MembershipPlan(TenantAwareModel):
    PERIOD_CHOICES = [
        ('Month', 'Month'),
        ('Year', 'Year'),
        ('Custom', 'Custom'),
    ]
    
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    period = models.CharField(max_length=20, choices=PERIOD_CHOICES, default='Month')
    description = models.TextField(blank=True)
    features = models.JSONField(default=list)
    color = models.CharField(max_length=50, help_text="Tailwind color class (e.g., bg-amber-400)")
    gradient = models.CharField(max_length=100, help_text="Tailwind gradient classes")
    icon_name = models.CharField(max_length=50, help_text="Lucide icon name")
    
    def __str__(self):
        return f"{self.name} - {self.tenant.name}"

class Subscription(TenantAwareModel):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Pending', 'Pending'),
        ('Expired', 'Expired'),
    ]
    
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(MembershipPlan, on_delete=models.CASCADE, related_name='subscriptions')
    start_date = models.DateField()
    expiry_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    
    def __str__(self):
        return f"{self.customer.name} - {self.plan.name} ({self.status})"
