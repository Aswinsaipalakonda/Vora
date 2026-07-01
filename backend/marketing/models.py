from django.db import models
from tenant.models import TenantAwareModel

class Segment(TenantAwareModel):
    name = models.CharField(max_length=255)
    criteria = models.TextField(help_text="Human readable criteria description")
    rules = models.JSONField(default=dict, help_text="Structured rules for the segment")
    member_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Campaign(TenantAwareModel):
    CHANNEL_CHOICES = [
        ('SMS', 'SMS'),
        ('Email', 'Email'),
    ]
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Scheduled', 'Scheduled'),
        ('Sent', 'Sent'),
    ]
    
    name = models.CharField(max_length=255)
    channel = models.CharField(max_length=10, choices=CHANNEL_CHOICES, default='SMS')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')
    scheduled_date = models.DateField(null=True, blank=True)
    recipient_count = models.IntegerField(default=0)
    
    # Metrics
    open_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    click_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    conversion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    
    segment = models.ForeignKey(Segment, on_delete=models.SET_NULL, null=True, blank=True, related_name='campaigns')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Template(TenantAwareModel):
    TYPE_CHOICES = [
        ('SMS', 'SMS'),
        ('Email', 'Email'),
    ]
    name = models.CharField(max_length=255)
    content = models.TextField()
    template_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='SMS')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
