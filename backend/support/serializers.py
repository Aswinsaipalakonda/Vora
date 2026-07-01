from rest_framework import serializers
from .models import FAQCategory, FAQ, SupportTicket, TicketMessage

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'order', 'is_popular']

class FAQCategorySerializer(serializers.ModelSerializer):
    faqs = FAQSerializer(many=True, read_only=True)
    articles_count = serializers.SerializerMethodField()

    class Meta:
        model = FAQCategory
        fields = ['id', 'name', 'icon', 'color', 'bg_color', 'order', 'faqs', 'articles_count']

    def get_articles_count(self, obj):
        return obj.faqs.count()

class TicketMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)

    class Meta:
        model = TicketMessage
        fields = ['id', 'sender', 'sender_name', 'body', 'is_staff_reply', 'created_at']
        read_only_fields = ['sender', 'is_staff_reply']

class SupportTicketSerializer(serializers.ModelSerializer):
    messages = TicketMessageSerializer(many=True, read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)

    class Meta:
        model = SupportTicket
        fields = ['id', 'subject', 'description', 'status', 'created_by', 'created_by_name', 'created_at', 'updated_at', 'messages']
        read_only_fields = ['created_by', 'status']
