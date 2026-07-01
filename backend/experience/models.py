from django.db import models
from tenant.models import TenantAwareModel
from customers.models import Customer

class Staff(TenantAwareModel):
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.0)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name

class ReviewTag(TenantAwareModel):
    name = models.CharField(max_length=50)
    
    def __str__(self):
        return self.name

class Review(TenantAwareModel):
    SENTIMENT_CHOICES = [
        ('positive', 'Positive'),
        ('neutral', 'Neutral'),
        ('negative', 'Negative'),
    ]
    
    customer_name = models.CharField(max_length=255)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    rating = models.IntegerField(default=5)
    text = models.TextField()
    sentiment = models.CharField(max_length=10, choices=SENTIMENT_CHOICES, default='positive')
    tags = models.ManyToManyField(ReviewTag, blank=True)
    staff = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, blank=True)
    
    is_replied = models.BooleanField(default=False)
    reply_text = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.customer_name} - {self.rating}*"
