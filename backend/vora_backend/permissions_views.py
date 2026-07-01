"""
permissions_api app
Provides a simple endpoint to check feature access server-side.

GET /api/permissions/check/?feature=inventory
→ { "allowed": true, "feature": "inventory" }

POST /api/permissions/check/ with { "features": ["inventory","marketing"] }
→ { "inventory": true, "marketing": false }
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from vora_backend.feature_permissions import user_has_feature_access, FEATURE_PLAN_MAP


class CheckPermissionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Single feature check via query param."""
        feature = request.query_params.get('feature', '')
        allowed = user_has_feature_access(request.user, feature)
        return Response({
            'allowed': allowed,
            'feature': feature,
        })

    def post(self, request):
        """Bulk feature check."""
        features = request.data.get('features', [])
        result = {}
        for f in features:
            result[f] = user_has_feature_access(request.user, f)
        return Response(result)


class AllPermissionsView(APIView):
    """
    Returns the full permission state for the current user:
    - tenant_plan
    - profile overrides
    - effective access per feature
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        tenant = user.owned_tenants.first() or user.tenants.first()
        profile = getattr(user, 'profile', None)

        effective = {
            feature: user_has_feature_access(user, feature)
            for feature in FEATURE_PLAN_MAP
        }

        profile_overrides = {}
        if profile:
            for attr in [
                'can_access_inventory', 'can_access_marketing', 'can_access_memberships',
                'can_access_packages', 'can_access_advanced_scheduling', 'can_access_staff_mgmt',
                'can_access_whatsapp', 'can_access_notifications', 'can_access_ai_assistant',
                'can_access_promo_campaigns', 'can_access_sponsored_ads', 'can_access_loyalty',
                'can_access_analytics', 'can_access_staff_performance', 'can_access_priority_support',
                'can_access_whitelabel', 'can_access_multi_center', 'can_access_api',
                'can_access_dedicated_manager', 'can_access_advanced_security',
                'can_access_custom_reporting', 'can_access_onboarding', 'is_super_admin',
            ]:
                profile_overrides[attr] = getattr(profile, attr, False)

        return Response({
            'tenant_plan': getattr(tenant, 'plan', 'FREE') if tenant else 'FREE',
            'profile_overrides': profile_overrides,
            'effective_permissions': effective,
        })
