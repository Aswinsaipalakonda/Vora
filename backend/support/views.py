from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import FAQCategory, FAQ, SupportTicket, TicketMessage
from .serializers import FAQCategorySerializer, FAQSerializer, SupportTicketSerializer, TicketMessageSerializer
from inventory.views import InventoryBaseViewSet

class FAQCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQCategory.objects.all()
    serializer_class = FAQCategorySerializer
    permission_classes = [permissions.IsAuthenticated]

class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def popular(self, request):
        popular_faqs = self.queryset.filter(is_popular=True)
        serializer = self.get_serializer(popular_faqs, many=True)
        return Response(serializer.data)

class SupportTicketViewSet(InventoryBaseViewSet):
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer

    def perform_create(self, serializer):
        # InventoryBaseViewSet handles setting the tenant_id. 
        # We also want to set the created_by user.
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        ticket = self.get_object()
        body = request.data.get('body')
        
        if not body:
            return Response({"error": "Message body is required."}, status=status.HTTP_400_BAD_REQUEST)
            
        message = TicketMessage.objects.create(
            ticket=ticket,
            sender=request.user,
            body=body,
            is_staff_reply=request.user.is_staff
        )
        
        serializer = TicketMessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
