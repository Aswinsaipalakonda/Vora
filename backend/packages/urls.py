from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PackageViewSet, PackageSubscriptionViewSet

router = DefaultRouter()
router.register(r'packages', PackageViewSet)
router.register(r'subscriptions', PackageSubscriptionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
