from Backend.config import Config

def send_emergency_otp_email(recipient_email, otp_code):
    """
    Mengirimkan email OTP Login Darurat menggunakan Resend API.
    Memiliki fallback jika package `resend` belum diinstall.
    """
    if not Config.RESEND_API_KEY:
        print(f"[DEVELOPMENT MODE] Mock Send OTP {otp_code} to {recipient_email}")
        return True, "API Key belum diatur. Kode OTP simulasi telah dibuat."

    try:
        import resend
        resend.api_key = Config.RESEND_API_KEY
        params = {
            "from": Config.SENDER_EMAIL,
            "to": [recipient_email],
            "subject": f"Kode OTP Login Darurat Portofolio: {otp_code}",
            "html": f"""
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #FAF0E6; padding: 24px; border-radius: 12px; border: 3px solid #A67C52;">
                <h2 style="color: #3E2723; margin-top: 0;">Kode Akses Darurat Portofolio</h2>
                <p style="color: #6B4423; font-size: 15px;">Halo Raihan, berikut adalah kode OTP untuk login darurat ke sistem Manajemen Portofolio Anda:</p>
                <div style="background: #FFF8F0; border: 2px dashed #D2691E; padding: 16px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #D2691E;">{otp_code}</span>
                </div>
                <p style="color: #8B6F47; font-size: 13px;">Kode ini berlaku selama 10 menit dan hanya dapat digunakan 1 kali setiap 1 jam.</p>
            </div>
            """
        }
        resend.Emails.send(params)
        return True, "Email OTP berhasil dikirim."
    except ImportError:
        print(f"[RESEND SDK NOT INSTALLED] OTP code generated: {otp_code}")
        return True, f"Library `resend` belum diinstall. Kode OTP: {otp_code}"
    except Exception as e:
        print(f"[RESEND ERROR] Failed to send email: {str(e)}")
        return True, f"Catatan email: {str(e)}"
