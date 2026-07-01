import uuid
from django.db import models
from django.conf import settings

class Tenant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    subdomain = models.SlugField(max_length=100, unique=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owned_tenants')
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='tenants', blank=True)
    
    # Contact & Address
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    
    # Branding
    logo = models.ImageField(upload_to='tenant_logos/', blank=True, null=True)
    
    # Legal Documents
    gst_file = models.FileField(upload_to='tenant_docs/gst/', blank=True, null=True)
    pan_file = models.FileField(upload_to='tenant_docs/pan/', blank=True, null=True)
    business_proof = models.FileField(upload_to='tenant_docs/proof/', blank=True, null=True)

    # Business Details
    INDUSTRY_CHOICES = [
        ('SALON', 'Hair Salon'),
        ('BARBER', 'Barber Shop'),
        ('NAIL', 'Nail Salon'),
        ('SPA', 'Spa & Wellness'),
        ('CLINIC', 'Aesthetic Clinic'),
        ('MEDSPA', 'Medical Spa'),
        ('MAKEUP', 'Makeup Studio'),
        ('LASH', 'Lash & Brow Studio'),
        ('OTHER', 'Other'),
    ]
    CLIENTELE_CHOICES = [
        ('UNISEX', 'Unisex'),
        ('MEN', 'Men Only'),
        ('WOMEN', 'Women Only'),
        ('KIDS', 'Kids Only'),
    ]
    industry_type = models.JSONField(default=list, blank=True)
    clientele_type = models.CharField(max_length=20, choices=CLIENTELE_CHOICES, default='UNISEX')

    # Status
    STATUS_CHOICES = [
        ('PENDING', 'Pending Approval'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    
    PLAN_CHOICES = [
        ('FREE', 'Free'),
        ('PROFESSIONAL', 'Professional'),
        ('BUSINESS', 'Business'),
        ('ENTERPRISE', 'Enterprise'),
    ]
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default='FREE')

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    sms_credits = models.PositiveIntegerField(default=100)

    # WhatsApp Integration
    whatsapp_access_token = models.TextField(blank=True, null=True)
    whatsapp_phone_number_id = models.CharField(max_length=50, blank=True, null=True)
    whatsapp_business_account_id = models.CharField(max_length=50, blank=True, null=True)
    whatsapp_invoice_template = models.CharField(max_length=100, default='invoice_notification')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.subdomain and self.name:
            from django.utils.text import slugify
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Tenant.objects.filter(subdomain=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.subdomain = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class TenantAwareModel(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='%(class)s_set')

    class Meta:
        abstract = True
