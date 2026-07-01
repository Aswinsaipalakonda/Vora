import os
import django
import random
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vora_backend.settings")
django.setup()

from tenant.models import Tenant
from customers.models import Customer
from billing.models import Invoice, InvoiceItem
from appointments.models import Appointment, Service

def populate():
    tenant = Tenant.objects.first()
    if not tenant:
        print("No tenant found. Run create_tenant first.")
        return

    # Delete existing to prevent bloat
    Invoice.objects.all().delete()
    Appointment.objects.all().delete()
    Service.objects.all().delete()
    
    # 1. Create Services
    services = [
        Service.objects.create(tenant=tenant, name="Men's Haircut", price=1200, duration_minutes=45),
        Service.objects.create(tenant=tenant, name="Women's Haircut", price=2500, duration_minutes=60),
        Service.objects.create(tenant=tenant, name="Balayage Coloring", price=8500, duration_minutes=180),
        Service.objects.create(tenant=tenant, name="Root Touchup", price=3000, duration_minutes=90),
        Service.objects.create(tenant=tenant, name="Deep Tissue Facial", price=4500, duration_minutes=60),
        Service.objects.create(tenant=tenant, name="Bridal Makeup", price=15000, duration_minutes=120),
        Service.objects.create(tenant=tenant, name="Keratin Treatment", price=6000, duration_minutes=120),
        Service.objects.create(tenant=tenant, name="Premium Spa Wax", price=2000, duration_minutes=45),
    ]

    customers = list(Customer.objects.filter(tenant=tenant))
    if not customers:
        customers = [Customer.objects.create(tenant=tenant, name=f"Customer {i}", phone=f"9876543{i:03d}") for i in range(10)]

    now = timezone.now()

    # Create 60 random invoices over the last 14 days
    print("Generating Invoices & Appointments...")
    for _ in range(60):
        c = random.choice(customers)
        s = random.choice(services)
        
        # Random date in last 14 days
        days_ago = random.randint(0, 14)
        item_date = now - timedelta(days=days_ago)
        
        # 1. Create Appointment
        status = random.choices(['COMPLETED', 'SCHEDULED', 'CANCELLED'], weights=[70, 20, 10])[0]
        Appointment.objects.create(
            tenant=tenant,
            customer=c,
            service=s,
            date=item_date.date(),
            time=item_date.time(),
            service_description=s.name,
            status=status
        )
        
        # 2. Create Invoice
        if status == 'COMPLETED':
            inv = Invoice.objects.create(
                tenant=tenant,
                customer=c,
                status='PAID',
                payment_method=random.choice(['Card', 'UPI', 'Cash']),
            )
            # Hack created_at for historical trends
            Invoice.objects.filter(id=inv.id).update(created_at=item_date)
            
            # Add item
            quantity = random.randint(1, 2)
            unit_price = s.price
            gst = float(unit_price) * 0.18 * quantity
            total = (float(unit_price) * quantity) + gst
            
            InvoiceItem.objects.create(
                invoice=inv,
                description=s.name,
                quantity=quantity,
                unit_price=unit_price
            )
            
            inv.subtotal = float(unit_price) * quantity
            inv.gst_total = gst
            inv.total_amount = total
            inv.save()

    print("Successfully populated invoices and appointments for Reports API!")

if __name__ == "__main__":
    populate()
