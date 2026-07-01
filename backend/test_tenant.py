
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vora_backend.settings')
django.setup()

from django.contrib.auth.models import User
from tenant.models import Tenant

# Create a user
user, created = User.objects.get_or_create(username='test_owner', email='owner@example.com')
if created:
    user.set_password('password')
    user.save()
    print(f"Created user: {user.username}")
else:
    print(f"User already exists: {user.username}")

# Create Tenants
tenant1, t1_created = Tenant.objects.get_or_create(
    name="Salon A",
    subdomain="salon-a",
    defaults={'owner': user}
)
if t1_created:
    print(f"Created Tenant: {tenant1.name}")

tenant2, t2_created = Tenant.objects.get_or_create(
    name="Salon B",
    subdomain="salon-b",
    defaults={'owner': user}
)
if t2_created:
    print(f"Created Tenant: {tenant2.name}")

# Add user to tenants (as member)
tenant1.members.add(user)
tenant2.members.add(user)
print(f"Added {user.username} to both tenants.")

# Verify
user_tenants = user.tenants.all()
print(f"User {user.username} is a member of: {[t.name for t in user_tenants]}")

assert tenant1 in user_tenants
assert tenant2 in user_tenants
print("Verification Successful!")
