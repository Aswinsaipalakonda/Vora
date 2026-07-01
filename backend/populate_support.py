import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vora_backend.settings')
django.setup()

from support.models import FAQCategory, FAQ

def populate_support():
    print("Clearing old support data...")
    FAQCategory.objects.all().delete()
    
    categories = [
        { 
            'name': 'Getting Started', 
            'icon': 'Zap', 
            'color': 'text-amber-500', 
            'bg_color': 'bg-amber-50',
            'order': 1,
            'faqs': [
                ('How do I set up my shop profile?', 'You can update your business details like name, logo, and address by navigating to the "Configuration" menu and clicking on "Business Profile".', True),
                ('How do I add services?', 'Go to Configuration > Services & Menu. From there, you can define categories, specify services, duration, and prices.', False)
            ]
        },
        { 
            'name': 'Bookings & Calendar', 
            'icon': 'Book', 
            'color': 'text-blue-500', 
            'bg_color': 'bg-blue-50',
            'order': 2,
            'faqs': [
                ('How do customers book appointments online?', 'Customers can book via your dedicated booking link found in the Marketing section. Ensure "Allow Online Booking" is enabled.', True),
                ('Can I block out personal time on the calendar?', 'Yes! You can right-click any time slot on the Calendar and select "Block Time" to make it unavailable for online bookings.', False)
            ]
        },
        { 
            'name': 'Billing & Payments', 
            'icon': 'FileText', 
            'color': 'text-emerald-500', 
            'bg_color': 'bg-emerald-50',
            'order': 3,
            'faqs': [
                ('How are tax rates calculated?', 'Tax rates are configured in the "Tax Configuration" section. You can set standard rates for services/products as either Inclusive or Exclusive.', True),
                ('Can I process refunds?', 'Yes, go to Billing > Payment Transactions, find the relevant payment, and click the "Issue Refund" button.', False)
            ]
        },
        { 
            'name': 'Staff Management', 
            'icon': 'Shield', 
            'color': 'text-rose-500', 
            'bg_color': 'bg-rose-50',
            'order': 4,
            'faqs': [
                ('Can I add multiple staff members?', 'Yes! Go to Configuration > Staff Configuration to add new team members with specific roles like Stylist or Manager.', True),
                ('How do I manage commission payouts?', 'You can view the Commission Report under the Reports tab to see automatically calculated commissions based on staff sales history.', True)
            ]
        },
    ]

    for cat_data in categories:
        cat = FAQCategory.objects.create(
            name=cat_data['name'],
            icon=cat_data['icon'],
            color=cat_data['color'],
            bg_color=cat_data['bg_color'],
            order=cat_data['order']
        )
        print(f"Created Category: {cat.name}")

        faq_order = 1
        for q, a, is_pop in cat_data['faqs']:
            FAQ.objects.create(
                category=cat,
                question=q,
                answer=a,
                order=faq_order,
                is_popular=is_pop
            )
            faq_order += 1
            print(f"  - Added FAQ: {q}")

    print("Success! Help Center data populated.")

if __name__ == '__main__':
    populate_support()
