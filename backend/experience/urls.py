from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StaffViewSet, ReviewTagViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r'staff', StaffViewSet, basename='staff')
router.register(r'tags', ReviewTagViewSet, basename='tags')
router.register(r'reviews', ReviewViewSet, basename='reviews')

urlpatterns = [
    path('', include(router.urls)),
]
