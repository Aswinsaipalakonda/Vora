from rest_framework import serializers
from .models import Invoice, InvoiceItem
from customers.serializers import CustomerSerializer
from experience.models import Staff

class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ['id', 'description', 'quantity', 'unit_price', 'original_price', 'gst_rate']

class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True)
    customer_name = serializers.ReadOnlyField(source='customer.name')
    customer_phone = serializers.ReadOnlyField(source='customer.phone')
    staff_name = serializers.ReadOnlyField(source='assigned_staff.name')
    staff_id = serializers.PrimaryKeyRelatedField(
        source='assigned_staff', 
        queryset=Staff.objects.all(), 
        required=False, 
        allow_null=True
    )
    
    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_number', 'customer', 'customer_name', 'customer_phone', 
            'date', 'status', 'payment_method', 'subtotal', 'gst_total', 
            'discount_amount', 'total_amount', 'items', 'staff_name', 'staff_id',
            'created_at', 'service_start_time', 'service_end_time'
        ]
        read_only_fields = ['invoice_number', 'total_amount', 'subtotal', 'gst_total', 'created_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        invoice = Invoice.objects.create(**validated_data)
        
        subtotal = 0
        gst_total = 0
        
        for item_data in items_data:
            item = InvoiceItem.objects.create(invoice=invoice, **item_data)
            item_total = item.unit_price * item.quantity
            subtotal += item_total
            gst_total += item_total * (item.gst_rate / 100)
            
        invoice.subtotal = subtotal
        invoice.gst_total = gst_total
        invoice.discount_amount = validated_data.get('discount_amount', 0)
        invoice.total_amount = (subtotal + gst_total) - invoice.discount_amount
        invoice.save()
        
        return invoice

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        
        # Update invoice fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if items_data is not None:
            # Delete existing items and recreate
            # This is simpler than trying to match IDs for a POS draft
            instance.items.all().delete()
            
            subtotal = 0
            gst_total = 0
            
            for item_data in items_data:
                item = InvoiceItem.objects.create(invoice=instance, **item_data)
                item_total = item.unit_price * item.quantity
                subtotal += item_total
                gst_total += item_total * (item.gst_rate / 100)
                
            instance.subtotal = subtotal
            instance.gst_total = gst_total
            instance.discount_amount = validated_data.get('discount_amount', instance.discount_amount)
            instance.total_amount = (subtotal + gst_total) - instance.discount_amount
            instance.save()
            
        return instance
