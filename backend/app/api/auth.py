from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status

from app.core.security import (
    verify_password, create_access_token, create_refresh_token,
    generate_otp, get_otp_expiry, decode_token, hash_password
)
from app.models.auth import (
    LoginRequest, OTPVerifyRequest, ForgotPasswordRequest,
    ResetPasswordRequest, TokenResponse, MessageResponse
)
from app.services.supabase_client import get_supabase
from app.services.email_service import send_otp_email, send_forgot_password_email

router = APIRouter(prefix="/auth", tags=["Auth"])

OWNER_EMAIL = "raihan@yourdomain.com"  # Will be overridden by env


@router.post("/login", response_model=dict)
async def login(payload: LoginRequest):
    """Step 1: Verify email + password, then send OTP."""
    supabase = get_supabase()

    # Fetch user by email
    result = supabase.table("users").select("*").eq("email", payload.email).single().execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email atau password salah")

    user = result.data
    if not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email atau password salah")

    if not user.get("is_active", True):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Akun tidak aktif")

    # Generate OTP and store it
    otp = generate_otp()
    expiry = get_otp_expiry()

    supabase.table("users").update({
        "otp_code": otp,
        "otp_expires_at": expiry.isoformat()
    }).eq("id", user["id"]).execute()

    # Send OTP via email
    email_sent = send_otp_email(user["email"], otp)
    if not email_sent:
        raise HTTPException(status_code=500, detail="Gagal mengirim kode OTP. Coba lagi.")

    return {
        "message": "Kode OTP telah dikirim ke email Anda",
        "requires_otp": True,
        "email": user["email"]
    }


@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp(payload: OTPVerifyRequest):
    """Step 2: Verify OTP and return JWT tokens."""
    supabase = get_supabase()

    result = supabase.table("users").select("*").eq("email", payload.email).single().execute()
    if not result.data:
        raise HTTPException(status_code=400, detail="Pengguna tidak ditemukan")

    user = result.data
    now = datetime.now(timezone.utc)
    otp_expires = user.get("otp_expires_at")

    if not otp_expires:
        raise HTTPException(status_code=400, detail="OTP tidak valid")

    # Parse expiry
    if isinstance(otp_expires, str):
        from datetime import datetime
        otp_expires_dt = datetime.fromisoformat(otp_expires.replace("Z", "+00:00"))
    else:
        otp_expires_dt = otp_expires

    if now > otp_expires_dt:
        raise HTTPException(status_code=400, detail="Kode OTP sudah kadaluarsa")

    if user.get("otp_code") != payload.otp_code:
        raise HTTPException(status_code=400, detail="Kode OTP tidak valid")

    # Clear OTP after successful verify
    supabase.table("users").update({
        "otp_code": None,
        "otp_expires_at": None,
        "last_login_at": now.isoformat()
    }).eq("id", user["id"]).execute()

    token_data = {"sub": user["id"], "email": user["email"]}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(body: dict):
    """Refresh access token using refresh token."""
    token = body.get("refresh_token")
    if not token:
        raise HTTPException(status_code=400, detail="Refresh token diperlukan")

    payload = decode_token(token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Refresh token tidak valid")

    token_data = {"sub": payload["sub"], "email": payload["email"]}
    access_token = create_access_token(token_data)
    new_refresh = create_refresh_token(token_data)

    return TokenResponse(access_token=access_token, refresh_token=new_refresh)


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(payload: ForgotPasswordRequest):
    """Send password reset link."""
    supabase = get_supabase()
    result = supabase.table("users").select("id,email").eq("email", payload.email).execute()

    # Don't reveal if email exists for security
    if result.data:
        import secrets
        reset_token = secrets.token_urlsafe(32)
        from datetime import timedelta
        expiry = (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat()

        supabase.table("users").update({
            "reset_token": reset_token,
            "reset_token_expires_at": expiry
        }).eq("email", payload.email).execute()

        send_forgot_password_email(payload.email, reset_token)

    return MessageResponse(message="Jika email terdaftar, link reset password telah dikirim")


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(payload: ResetPasswordRequest):
    """Reset password using token from email."""
    supabase = get_supabase()
    result = supabase.table("users").select("*").eq("reset_token", payload.token).single().execute()

    if not result.data:
        raise HTTPException(status_code=400, detail="Token tidak valid atau sudah kadaluarsa")

    user = result.data
    now = datetime.now(timezone.utc)
    expiry_str = user.get("reset_token_expires_at", "")

    if expiry_str:
        expiry_dt = datetime.fromisoformat(expiry_str.replace("Z", "+00:00"))
        if now > expiry_dt:
            raise HTTPException(status_code=400, detail="Token sudah kadaluarsa")

    new_hash = hash_password(payload.new_password)
    supabase.table("users").update({
        "hashed_password": new_hash,
        "reset_token": None,
        "reset_token_expires_at": None
    }).eq("id", user["id"]).execute()

    return MessageResponse(message="Password berhasil direset. Silakan login kembali.")
