import os
from io import BytesIO
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.conf import settings

def generate_invoice_pdf(invoice):
    """
    Generates a PDF invoice using xhtml2pdf.
    Returns the PDF content as bytes.
    """
    template = get_template('billing/invoice_template.html')
    
    # Context for the template
    context = {
        'invoice': invoice,
        'tenant': invoice.tenant,
        'items': invoice.items.all(),
    }
    
    html = template.render(context)
    result = BytesIO()
    
    # Generate PDF
    pisa_status = pisa.CreatePDF(html, dest=result)
    
    if pisa_status.err:
        raise Exception(f"PDF generation failed: {pisa_status.err}")
    
    return result.getvalue()
