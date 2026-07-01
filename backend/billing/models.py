from django.db import models
from django.utils import timezone
from tenant.models import TenantAwareModel
from customers.models import Customer
import uuid

class Invoice(TenantAwareModel):
    STATUS_CHOICES = [
        ('DUE', 'Due'),
        ('PAID', 'Paid'),
        ('PENDING', 'Pending'),
        ('DRAFT', 'Draft'),
    ]
    
    invoice_number = models.CharField(max_length=50, unique=True, editable=False)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='invoices')
    date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='DUE')
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    assigned_staff = models.ForeignKey('experience.Staff', on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_invoices')
    
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    gst_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    service_start_time = models.DateTimeField(null=True, blank=True, help_text="Time when service/session started")
    service_end_time = models.DateTimeField(null=True, blank=True, help_text="Time when service/session ended (on finalising invoice)")

    def save(self, *args, **kwargs):
        is_new = self.pk is None

        if not self.invoice_number:
            # Generate a unique invoice number like V-XXXX
            last_invoice = Invoice.objects.filter(tenant=self.tenant).order_by('-created_at').first()
            if last_invoice and last_invoice.invoice_number.startswith('V-'):
                try:
                    num = int(last_invoice.invoice_number.split('-')[1]) + 1
                except:
                    num = 8000
            else:
                num = 8000
            self.invoice_number = f"V-{num}"

        # Auto-set service_start_time when a DRAFT walk-in is created
        if is_new and self.status == 'DRAFT' and not self.service_start_time:
            self.service_start_time = timezone.now()

        # Auto-set service_end_time when the bill is finalized (DRAFT → any other status)
        if not is_new and self.status != 'DRAFT' and not self.service_end_time:
            try:
                prev = Invoice.objects.get(pk=self.pk)
                if prev.status == 'DRAFT':
                    self.service_end_time = timezone.now()
            except Invoice.DoesNotExist:
                pass

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.customer.name}"

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    original_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    gst_rate = models.DecimalField(max_digits=5, decimal_places=2, default=18.0)
    
    def __str__(self):
        return f"{self.description} x {self.quantity}"
