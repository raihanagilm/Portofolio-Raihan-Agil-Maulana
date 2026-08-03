import resend
from app.core.config import settings

resend.api_key = settings.RESEND_API_KEY


def send_otp_email(to_email: str, otp_code: str, owner_name: str = "Raihan Agil Maulana") -> bool:
    """Send OTP code email for login verification."""
    try:
        resend.Emails.send({
            "from": settings.EMAIL_FROM,
            "to": [to_email],
            "subject": f"Kode OTP Login - {settings.APP_NAME}",
            "html": f"""
            <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #faf8ff; border-radius: 12px; border: 1px solid #c3c5d9;">
                <h1 style="color: #003ec7; font-size: 24px; margin-bottom: 8px;">Portfolio Manager</h1>
                <p style="color: #505f76; font-size: 14px; margin-bottom: 24px;">Halo, {owner_name}!</p>
                <p style="color: #131b2e; font-size: 16px; margin-bottom: 16px;">Gunakan kode OTP berikut untuk verifikasi login Anda:</p>
                <div style="background: #003ec7; color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: 12px; text-align: center; padding: 24px; border-radius: 8px; margin: 24px 0;">
                    {otp_code}
                </div>
                <p style="color: #737688; font-size: 12px;">Kode ini berlaku selama <strong>10 menit</strong>. Jangan bagikan kode ini kepada siapapun.</p>
                <p style="color: #737688; font-size: 12px; margin-top: 16px;">Jika Anda tidak merasa melakukan login, abaikan email ini.</p>
            </div>
            """
        })
        return True
    except Exception as e:
        print(f"[EMAIL ERROR] send_otp_email: {e}")
        return False


def send_forgot_password_email(to_email: str, reset_token: str) -> bool:
    """Send password reset link email."""
    try:
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
        resend.Emails.send({
            "from": settings.EMAIL_FROM,
            "to": [to_email],
            "subject": f"Reset Password - {settings.APP_NAME}",
            "html": f"""
            <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #faf8ff; border-radius: 12px; border: 1px solid #c3c5d9;">
                <h1 style="color: #003ec7; font-size: 24px; margin-bottom: 8px;">Portfolio Manager</h1>
                <p style="color: #131b2e; font-size: 16px; margin-bottom: 16px;">Klik tombol di bawah untuk mereset password Anda:</p>
                <a href="{reset_url}" style="display: inline-block; background: #003ec7; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 16px 0;">
                    Reset Password
                </a>
                <p style="color: #737688; font-size: 12px; margin-top: 16px;">Link ini berlaku selama <strong>1 jam</strong>. Jika Anda tidak meminta reset password, abaikan email ini.</p>
            </div>
            """
        })
        return True
    except Exception as e:
        print(f"[EMAIL ERROR] send_forgot_password_email: {e}")
        return False


def send_message_notification(sender_name: str, sender_email: str, subject: str, message: str) -> bool:
    """Notify owner when a new message arrives."""
    try:
        resend.Emails.send({
            "from": settings.EMAIL_FROM,
            "to": [settings.EMAIL_OWNER],
            "subject": f"Pesan Baru: {subject}",
            "html": f"""
            <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #faf8ff; border-radius: 12px; border: 1px solid #c3c5d9;">
                <h1 style="color: #003ec7; font-size: 20px; margin-bottom: 16px;">📬 Pesan Baru Masuk</h1>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <tr><td style="color: #737688; padding: 6px 0; width: 80px;">Dari</td><td style="color: #131b2e; font-weight: 600;">{sender_name}</td></tr>
                    <tr><td style="color: #737688; padding: 6px 0;">Email</td><td style="color: #131b2e;">{sender_email}</td></tr>
                    <tr><td style="color: #737688; padding: 6px 0;">Subjek</td><td style="color: #131b2e;">{subject}</td></tr>
                </table>
                <div style="background: #f2f3ff; border-left: 4px solid #003ec7; padding: 16px; margin-top: 16px; border-radius: 4px; font-size: 14px; color: #131b2e; line-height: 1.6;">
                    {message}
                </div>
                <p style="color: #737688; font-size: 12px; margin-top: 16px;">Buka dashboard untuk membalas pesan ini.</p>
            </div>
            """
        })
        return True
    except Exception as e:
        print(f"[EMAIL ERROR] send_message_notification: {e}")
        return False
