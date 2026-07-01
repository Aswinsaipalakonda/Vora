from django.core.management.base import BaseCommand
from datetime import date, timedelta
from memberships.models import MembershipPlan, Subscription
from packages.models import Package, PackageSubscription
from customers.models import Customer
from tenant.models import Tenant

class Command(BaseCommand):
    help = 'Load dummy data for memberships and packages'

    def handle(self, *args, **options):
        # Get any existing tenant
        tenant = Tenant.objects.first()
        if not tenant:
            self.stdout.write(self.style.ERROR("No tenant found. Please create a tenant first."))
            return

        # 1. Membership Plans
        plans_data = [
            {
                'name': 'Gold Tier',
                'price': 2999.00,
                'period': 'Month',
                'description': 'Priority booking and 10% service discount.',
                'features': ['Priority Booking', '10% Service Discount', 'Free Style Consultation'],
                'color': 'bg-amber-400',
                'gradient': 'from-amber-400 to-amber-600',
                'icon_name': 'Crown'
            },
            {
                'name': 'Platinum Elite',
                'price': 5999.00,
                'period': 'Month',
                'description': 'Unlimited haircuts and VIP lounge access.',
                'features': ['Unlimited Haircuts', '20% Product Discount', 'VIP Lounge Access', 'Gift Vouchers'],
                'color': 'bg-slate-300',
                'gradient': 'from-slate-300 to-slate-500',
                'icon_name': 'Star'
            },
            {
                'name': 'Silver Starter',
                'price': 999.00,
                'period': 'Month',
                'description': 'Essential discounts for regular clients.',
                'features': ['5% Service Discount', 'Birthday Special'],
                'color': 'bg-gray-400',
                'gradient': 'from-gray-300 to-gray-500',
                'icon_name': 'Shield'
            }
        ]

        for data in plans_data:
            plan, created = MembershipPlan.objects.get_or_create(
                tenant=tenant, 
                name=data['name'], 
                defaults=data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created Plan: {plan.name}"))

        # 2. Service Packages
        packages_data = [
            {
                'name': 'Essential Glow',
                'price': 1999.00,
                'validity_days': 30,
                'services': ['Basic Haircut', 'Fruit Facial', 'Threading'],
                'color': 'bg-rose-500',
                'icon_name': 'Zap',
                'is_popular': False
            },
            {
                'name': 'Bridal Royal',
                'price': 15999.00,
                'validity_days': 90,
                'services': ['Hair Spa', 'Premium Facial', 'Mehendi', 'Bridal Styling', 'Pedicure'],
                'color': 'bg-gray-900',
                'icon_name': 'Crown',
                'is_popular': True
            },
            {
                'name': 'Skin Renew',
                'price': 4999.00,
                'validity_days': 60,
                'services': ['Hydra Facial', 'Skin Polishing', 'De-Tan'],
                'color': 'bg-emerald-600',
                'icon_name': 'Sparkles',
                'is_popular': False
            }
        ]

        for data in packages_data:
            pkg, created = Package.objects.get_or_create(
                tenant=tenant, 
                name=data['name'], 
                defaults=data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created Package: {pkg.name}"))

        # 3. Dummy Subscriptions for Metrics
        customers = Customer.objects.filter(tenant=tenant)
        if customers.exists():
            customer = customers.first()
            plan = MembershipPlan.objects.filter(tenant=tenant).first()
            pkg = Package.objects.filter(tenant=tenant).first()

            if plan:
                Subscription.objects.get_or_create(
                    tenant=tenant,
                    customer=customer,
                    plan=plan,
                    start_date=date.today(),
                    expiry_date=date.today() + timedelta(days=30),
                    status='Active'
                )
                self.stdout.write(self.style.SUCCESS(f"Subscribed {customer.name} to {plan.name}"))

            if pkg:
                PackageSubscription.objects.get_or_create(
                    tenant=tenant,
                    customer=customer,
                    package=pkg,
                    expiry_date=date.today() + timedelta(days=pkg.validity_days),
                    status='Active'
                )
                self.stdout.write(self.style.SUCCESS(f"Subscribed {customer.name} to {pkg.name}"))
