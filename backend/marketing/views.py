from rest_framework import viewsets, permissions
from .models import Campaign, Segment, Template
from .serializers import CampaignSerializer, SegmentSerializer, TemplateSerializer
from vora_backend.feature_permissions import HasFeaturePermission

class MarketingBaseViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(tenant__in=self.request.user.tenants.all() | self.request.user.owned_tenants.all()).distinct()

    def perform_create(self, serializer):
        tenant = self.request.user.owned_tenants.first() or self.request.user.tenants.first()
        serializer.save(tenant=tenant)

class CampaignViewSet(MarketingBaseViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [permissions.IsAuthenticated, HasFeaturePermission]
    required_feature = 'marketing'

class SegmentViewSet(MarketingBaseViewSet):
    queryset = Segment.objects.all()
    serializer_class = SegmentSerializer
    permission_classes = [permissions.IsAuthenticated, HasFeaturePermission]
    required_feature = 'marketing'

class TemplateViewSet(MarketingBaseViewSet):
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer
    permission_classes = [permissions.IsAuthenticated, HasFeaturePermission]
    required_feature = 'marketing'
