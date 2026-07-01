import requests
import json
import logging
from .pdf_utils import generate_invoice_pdf

logger = logging.getLogger(__name__)

class WhatsAppService:
    def __init__(self, tenant):
        self.tenant = tenant
        self.access_token = tenant.whatsapp_access_token
        self.phone_number_id = tenant.whatsapp_phone_number_id
        self.base_url = f"https://graph.facebook.com/v20.0/{self.phone_number_id}"
        self.headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }

    def upload_media(self, media_content, filename, mime_type="application/pdf"):
        """
        Uploads media to WhatsApp and returns the media ID.
        """
        url = f"https://graph.facebook.com/v20.0/{self.phone_number_id}/media"
        files = {
            'file': (filename, media_content, mime_type),
        }
        data = {
            'messaging_product': 'whatsapp',
            'type': mime_type
        }
        headers = {
            "Authorization": f"Bearer {self.access_token}"
        }
        
        response = requests.post(url, headers=headers, files=files, data=data)
        
        if response.status_code != 200:
            logger.error(f"WhatsApp Media Upload Error: {response.text}")
            raise Exception(f"Failed to upload media to WhatsApp: {response.text}")
        
        return response.json().get('id')

    def send_template_message(self, recipient_phone, template_name, components):
        """
        Sends a template-based message.
        """
        url = f"{self.base_url}/messages"
        payload = {
            "messaging_product": "whatsapp",
            "to": recipient_phone,
            "type": "template",
            "template": {
                "name": template_name,
                "language": {
                    "code": "en_US"
                },
                "components": components
            }
        }
        
        response = requests.post(url, headers=self.headers, data=json.dumps(payload))
        
        if response.status_code not in [200, 201]:
            logger.error(f"WhatsApp Send Error: {response.text}")
            raise Exception(f"Failed to send WhatsApp message: {response.text}")
        
        return response.json()

    def send_invoice_via_whatsapp(self, invoice):
        """
        Orchestrates PDF generation, upload, and sending the WhatsApp notification.
        """
        if not self.access_token or not self.phone_number_id:
            raise Exception("WhatsApp Configuration missing for this tenant.")

        # 1. Generate PDF
        pdf_content = generate_invoice_pdf(invoice)
        filename = f"Invoice_{invoice.invoice_number}.pdf"

        # 2. Upload PDF
        media_id = self.upload_media(pdf_content, filename)

        # 3. Prepare Template Components
        # Template: invoice_notification
        # Header: Document
        # Body: Thank you for your purchase of {{1}} from {{2}}. Your {{3}} PDF is attached.
        
        components = [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "document",
                        "document": {
                            "id": media_id,
                            "filename": filename
                        }
                    }
                ]
            }
        ]

        # 4. Send Message
        recipient_phone = invoice.customer_phone
        # Ensure phone number is in international format without '+'
        clean_phone = ''.join(filter(str.isdigit, recipient_phone))
        # If it doesn't have a country code, you might need to add one. 
        # For India (91), let's assume if it's 10 digits, add 91.
        if len(clean_phone) == 10:
            clean_phone = f"91{clean_phone}"
            
        return self.send_template_message(
            clean_phone, 
            self.tenant.whatsapp_invoice_template, 
            components
        )
