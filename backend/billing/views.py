from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
from inventory.views import InventoryBaseViewSet
from .models import Invoice
from .serializers import InvoiceSerializer
from .whatsapp import WhatsAppService
from .pdf_utils import generate_invoice_pdf

class InvoiceViewSet(InventoryBaseViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    search_fields = ['invoice_number', 'customer__name', 'customer__phone']
    filterset_fields = ['status', 'payment_method', 'date']

    @action(detail=True, methods=['post'])
    def whatsapp(self, request, pk=None):
        """
        Action to send the invoice via WhatsApp.
        """
        invoice = self.get_object()
        tenant = invoice.tenant
        
        try:
            ws = WhatsAppService(tenant)
            result = ws.send_invoice_via_whatsapp(invoice)
            return Response({
                "status": "success",
                "message": "WhatsApp message sent successfully!",
                "whatsapp_response": result
            })
        except Exception as e:
            return Response({
                "status": "error",
                "message": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def pdf(self, request, pk=None):
        """
        Action to download the invoice as PDF.
        """
        invoice = self.get_object()
        try:
            pdf_content = generate_invoice_pdf(invoice)
            response = HttpResponse(pdf_content, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="Invoice_{invoice.invoice_number}.pdf"'
            return response
        except Exception as e:
            return Response({
                "status": "error",
                "message": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
