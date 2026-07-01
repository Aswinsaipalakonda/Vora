import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vora_backend.settings')
django.setup()

with connection.cursor() as cursor:
    # 1. Clear migration history for tenant app
    print("Clearing tenant migrations from history...")
    cursor.execute("DELETE FROM django_migrations WHERE app = 'tenant';")
    
    # 2. Drop tenant tables to force re-creation
    # Note: Order matters for foreign keys
    tables = ['tenant_tenant_members', 'tenant_tenant']
    for table in tables:
        print(f"Dropping table {table}...")
        try:
            cursor.execute(f"DROP TABLE IF EXISTS {table};")
        except Exception as e:
            print(f"Error dropping {table}: {e}")

print("Database cleanup complete. Now run 'python manage.py migrate'.")
