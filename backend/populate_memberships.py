
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vora_backend.settings')
django.setup()

from memberships.models import Membership

MEMBERSHIPS = [
    {
        'name': 'Gold',
        'slug': 'gold',
        'price': 2999.00,
        'period': '/mo',
        'category': 'Memberships',
        'image': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=300&q=80',
        'features': ['Unlimited Haircuts', '10% off products', 'Priority Booking']
    },
    {
        'name': 'Platinum',
        'slug': 'platinum',
        'price': 5999.00,
        'period': '/mo',
        'category': 'Memberships',
        'image': 'https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?auto=format&fit=crop&w=300&q=80',
        'features': ['All Gold Benefits', '2 Free Facials', '20% off products']
    },
]

for data in MEMBERSHIPS:
    Membership.objects.get_or_create(slug=data['slug'], defaults=data)
    print(f"Created/Updated {data['name']}")
