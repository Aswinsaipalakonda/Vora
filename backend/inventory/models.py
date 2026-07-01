import uuid
from django.db import models
from django.conf import settings
from tenant.models import TenantAwareModel

class Category(TenantAwareModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class Supplier(TenantAwareModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    contact_name = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Product(TenantAwareModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=100, help_text="Stock Keeping Unit / Barcode")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    description = models.TextField(blank=True, null=True)
    
    stock_quantity = models.IntegerField(default=0)
    reorder_level = models.IntegerField(default=5, help_text="Alert when stock falls below this level")
    
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Selling price")
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Purchase price")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('tenant', 'sku')

    def __str__(self):
        return f"{self.name} ({self.sku})"

class StockTransaction(TenantAwareModel):
    TRANSACTION_TYPES = [
        ('IN', 'Stock In (Purchase/Return)'),
        ('OUT', 'Stock Out (Sale/Usage)'),
        ('ADJUST', 'Adjustment (Damage/Loss/Count)'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    quantity = models.IntegerField(help_text="Use positive numbers for IN, negative for OUT")
    date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)
        
        # Automatically update product stock quantity when a transaction is created
        if is_new:
            if self.transaction_type == 'IN':
                self.product.stock_quantity += self.quantity
            elif self.transaction_type == 'OUT':
                self.product.stock_quantity -= abs(self.quantity)
            elif self.transaction_type == 'ADJUST':
                # For adjust, we assume 'quantity' is the direct change to apply (+ or -)
                self.product.stock_quantity += self.quantity
            self.product.save()

    def __str__(self):
        return f"{self.get_transaction_type_display()} - {self.product.name} ({self.quantity})"
