from rest_framework import permissions
from .models import MembershipPlan, Subscription
from .serializers import MembershipPlanSerializer, SubscriptionSerializer
from inventory.views import InventoryBaseViewSet
from vora_backend.feature_permissions import HasFeaturePermission

class MembershipPlanViewSet(InventoryBaseViewSet):
    queryset = MembershipPlan.objects.all()
    serializer_class = MembershipPlanSerializer
    permission_classes = [permissions.IsAuthenticated, HasFeaturePermission]
    required_feature = 'memberships'

class SubscriptionViewSet(InventoryBaseViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated, HasFeaturePermission]
    required_feature = 'memberships'
