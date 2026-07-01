from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Tenant
from user_auth.serializers import TenantSummarySerializer

class TenantViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TenantSummarySerializer

    def get_queryset(self):
        return Tenant.objects.filter(owner=self.request.user) | Tenant.objects.filter(members=self.request.user)

    @action(detail=False, methods=['get'])
    def me(self, request):
        tenant = request.user.owned_tenants.first() or request.user.tenants.first()
        if not tenant:
            return Response({"error": "No tenant associated with user"}, status=404)
        serializer = TenantSummarySerializer(tenant)
        return Response(serializer.data)
