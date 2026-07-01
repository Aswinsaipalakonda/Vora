import os
import django
from django.urls import reverse
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vora_backend.settings')
django.setup()

try:
    print(f"Tenant URL: {reverse('admin:tenant_tenant_changelist')}")
    print(f"User URL: {reverse('admin:auth_user_changelist')}")
except Exception as e:
    print(f"Error reversing URLs: {e}")
