"""
Vora Feature Permission Framework
===================================
A reusable DRF permission layer that enforces feature access based on:
1. The tenant's subscription plan (plan-based access)
2. The user's explicit permission overrides in UserProfile (admin bypasses)

Usage on a ViewSet:
    from vora_backend.feature_permissions import require_feature

    class ProductViewSet(InventoryBaseViewSet):
        required_feature = 'inventory'

    # Or override per-action with the mixin:
    class ProductViewSet(FeaturePermissionMixin, InventoryBaseViewSet):
        required_feature = 'inventory'

The permission is enforced on ALL write operations (create, update, partial_update, destroy).
Read operations (list, retrieve) are always allowed for tenants on any plan.
"""
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied

# Plan hierarchy: index = rank (higher = more access)
PLAN_RANK = {
    'FREE': 0,
    'PROFESSIONAL': 1,
    'BUSINESS': 2,
    'ENTERPRISE': 3,
}

# Feature → minimum plan required (by default, without an override)
FEATURE_PLAN_MAP = {
    # Business features
    'inventory':         'BUSINESS',
    'marketing':         'BUSINESS',
    'memberships':       'BUSINESS',
    'packages':          'BUSINESS',
    'ai_assistant':      'BUSINESS',
    'promo_campaigns':   'BUSINESS',
    'loyalty':           'BUSINESS',
    'analytics':         'BUSINESS',
    'staff_performance': 'BUSINESS',
    'priority_support':  'BUSINESS',

    # Professional features
    'advanced_scheduling':  'PROFESSIONAL',
    'staff_mgmt':           'PROFESSIONAL',
    'whatsapp':             'PROFESSIONAL',
    'notifications':        'PROFESSIONAL',

    # Enterprise features
    'sponsored_ads':        'ENTERPRISE',
    'whitelabel':           'ENTERPRISE',
    'multi_center':         'ENTERPRISE',
    'api':                  'ENTERPRISE',
    'dedicated_manager':    'ENTERPRISE',
    'advanced_security':    'ENTERPRISE',
    'custom_reporting':     'ENTERPRISE',
    'onboarding':           'ENTERPRISE',
}

# Feature → UserProfile attribute name for the override
FEATURE_OVERRIDE_ATTR = {
    'inventory':            'can_access_inventory',
    'marketing':            'can_access_marketing',
    'memberships':          'can_access_memberships',
    'packages':             'can_access_packages',
    'advanced_scheduling':  'can_access_advanced_scheduling',
    'staff_mgmt':           'can_access_staff_mgmt',
    'whatsapp':             'can_access_whatsapp',
    'notifications':        'can_access_notifications',
    'ai_assistant':         'can_access_ai_assistant',
    'promo_campaigns':      'can_access_promo_campaigns',
    'sponsored_ads':        'can_access_sponsored_ads',
    'loyalty':              'can_access_loyalty',
    'analytics':            'can_access_analytics',
    'staff_performance':    'can_access_staff_performance',
    'priority_support':     'can_access_priority_support',
    'whitelabel':           'can_access_whitelabel',
    'multi_center':         'can_access_multi_center',
    'api':                  'can_access_api',
    'dedicated_manager':    'can_access_dedicated_manager',
    'advanced_security':    'can_access_advanced_security',
    'custom_reporting':     'can_access_custom_reporting',
    'onboarding':           'can_access_onboarding',
}

WRITE_ACTIONS = {'create', 'update', 'partial_update', 'destroy'}


def user_has_feature_access(user, feature: str) -> bool:
    """
    Core logic: returns True if the user can access the given feature.
    Checks in order:
      1. Super-admin override on UserProfile
      2. Feature-specific override on UserProfile
      3. Tenant plan vs. required plan from FEATURE_PLAN_MAP
    """
    # Unknown features are always allowed
    if feature not in FEATURE_PLAN_MAP:
        return True

    profile = getattr(user, 'profile', None)

    if profile:
        # 1. Super admin bypasses everything
        if getattr(profile, 'is_super_admin', False):
            return True

        # 2. Feature-specific override
        override_attr = FEATURE_OVERRIDE_ATTR.get(feature)
        if override_attr and getattr(profile, override_attr, False):
            return True

    # 3. Fall back to plan-based check
    tenant = user.owned_tenants.first() or user.tenants.first()
    if not tenant:
        return False

    plan = getattr(tenant, 'plan', 'FREE')
    required_plan = FEATURE_PLAN_MAP.get(feature, 'FREE')

    return PLAN_RANK.get(plan, 0) >= PLAN_RANK.get(required_plan, 0)


class HasFeaturePermission(BasePermission):
    """
    DRF Permission class.
    Add `required_feature = 'xxx'` to any ViewSet to gate write operations.
    Read operations (list/retrieve) are always permitted.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        # Allow all read operations
        if view.action not in WRITE_ACTIONS:
            return True

        feature = getattr(view, 'required_feature', None)
        if not feature:
            return True  # No feature gate declared on this viewset

        if not user_has_feature_access(request.user, feature):
            feature_label = feature.replace('_', ' ').title()
            raise PermissionDenied(
                detail={
                    'error': 'feature_locked',
                    'message': f"Your current plan does not include access to {feature_label}. "
                               f"Please upgrade your subscription.",
                    'feature': feature,
                    'required_plan': FEATURE_PLAN_MAP.get(feature, 'FREE'),
                }
            )
        return True
