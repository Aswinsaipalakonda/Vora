from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AppointmentViewSet, ServiceViewSet, ServiceCategoryViewSet

router = DefaultRouter()
router.register(r'appointments', AppointmentViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'service-categories', ServiceCategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
