import os
import django
import random
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vora_backend.settings')
django.setup()

from experience.models import Staff, ReviewTag, Review
from tenant.models import Tenant

def populate_demo_data():
    tenant = Tenant.objects.first()
    if not tenant:
        print("No tenant found. Please create one first.")
        return

    # Clear existing data to avoid duplicates if re-running
    Review.objects.filter(tenant=tenant).delete()
    # Staff.objects.filter(tenant=tenant).delete() # Keep staff if they exist
    # ReviewTag.objects.filter(tenant=tenant).delete()

    # Create Tags
    tags_names = ["Haircut", "Staff", "Ambiance", "Wait Time", "Service", "Facial", "Grooming", "Quality", "Cleanliness", "Price", "Vibe"]
    tags = []
    for name in tags_names:
        tag, _ = ReviewTag.objects.get_or_create(name=name, tenant=tenant)
        tags.append(tag)

    # Create Staff
    staff_data = [
        {'name': 'Alice Cooper', 'role': 'Senior Stylist', 'rating': 4.9},
        {'name': 'John Doe', 'role': 'Colorist', 'rating': 4.8},
        {'name': 'Emma Watson', 'role': 'Esthetician', 'rating': 4.7},
        {'name': 'Rahul Nair', 'role': 'Senior Barber', 'rating': 4.6},
        {'name': 'Priya Patel', 'role': 'Massage Therapist', 'rating': 4.9},
    ]
    staff_objs = []
    for s in staff_data:
        st, _ = Staff.objects.get_or_create(name=s['name'], role=s['role'], tenant=tenant)
        st.rating = s['rating']
        st.save()
        staff_objs.append(st)

    customers = ["Sarah Jenkins", "Michael Chen", "Priya Sharma", "David Miller", "Ananya Rao", "Kevin V", "Jessica L", "Sam K", "Linda W", "Tom H", "Zoe C", "Aaron P"]
    reviews_texts = [
        "Absolutely loved the service! Best hair day ever.",
        "Wait time was a bit much, but the result was worth it.",
        "Polite staff and very clean environment.",
        "Rushed job on the beard. Not happy.",
        "The facial was so relaxing, I almost fell asleep!",
        "Great vibe and great prices. Coming back for sure.",
        "Staff was indifferent. Service was just okay.",
        "Incredible attention to detail.",
        "The ambiance is unmatched in the city.",
        "Decent haircut, but too expensive for what it is.",
        "My favorite place for a quick grooming session.",
        "Highly recommended for keratin treatment."
    ]

    # Generate 40 reviews over the last 30 days
    now = timezone.now()
    for i in range(40):
        customer = random.choice(customers)
        text = random.choice(reviews_texts)
        rating = random.randint(1, 5)
        
        # Determine sentiment based on rating
        if rating >= 4:
            sentiment = 'positive'
        elif rating == 3:
            sentiment = 'neutral'
        else:
            sentiment = 'negative'
            
        days_ago = random.randint(0, 30)
        created_at = now - timedelta(days=days_ago)
        
        is_replied = random.choice([True, False])
        reply_text = "Thank you for the feedback! We appreciate your business." if is_replied else ""
        
        review = Review.objects.create(
            customer_name=customer,
            rating=rating,
            text=text,
            sentiment=sentiment,
            is_replied=is_replied,
            reply_text=reply_text,
            staff=random.choice(staff_objs),
            tenant=tenant
        )
        # Update created_at (auto_now_add makes it tricky, so we use .update() or a manual override if possible)
        Review.objects.filter(id=review.id).update(created_at=created_at)
        
        # Add 1-3 random tags
        num_tags = random.randint(1, 3)
        selected_tags = random.sample(tags, num_tags)
        for t in selected_tags:
            review.tags.add(t)

    print(f"Successfully populated 40 reviews for tenant: {tenant.name}")

if __name__ == "__main__":
    populate_demo_data()
