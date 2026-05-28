from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import os
from django.conf import settings
import qrcode 

def generate_certificate(lesson):
        file_path = os.path.join(settings.MEDIA_ROOT, f"certificates/{lesson.plan_id}.pdf")

        template_path = os.path.join(settings.BASE_DIR, "private/certificate_template.png")

        print("Template",template_path)

        page_width, page_height = letter
        c = canvas.Canvas(file_path, pagesize=letter)

        img_width = 2000
        img_height = 1414

        scale = min(page_width / img_width, page_height / img_height)

        new_width = img_width * scale
        new_height = img_height * scale

        x = (page_width - new_width) / 2
        y = (page_height - new_height) / 2

        c.drawImage(template_path, x, y, width=new_width, height=new_height)

        c.setFont("Helvetica-Bold", 20)
        c.drawCentredString(page_width / 2, page_height / 2, lesson.teacher.first_name + " " + lesson.teacher.middle_initial + " " +  lesson.teacher.last_name)

        c.save()

        lesson.certificate = f"certificates/{lesson.plan_id}.pdf"
        lesson.save(update_fields=["certificate"])  # ✅ important

def generate_qr(lesson):
        #url from urls.py which connect to views
        url = f"{settings.BACKEND_URL}api/verify/certificate/{lesson.verification_code}"

        img = qrcode.make(url)

        qr_dir = os.path.join(settings.MEDIA_ROOT, "qr")
        os.makedirs(qr_dir, exist_ok=True)

        qr_path = os.path.join(qr_dir, f"{lesson.verification_code}.png")
        img.save(qr_path)

        return qr_path


