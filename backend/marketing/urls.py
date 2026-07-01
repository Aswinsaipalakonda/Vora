from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CampaignViewSet, SegmentViewSet, TemplateViewSet

router = DefaultRouter()
router.register(r'campaigns', CampaignViewSet)
router.register(r'segments', SegmentViewSet)
router.register(r'templates', TemplateViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
