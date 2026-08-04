import random
from datetime import datetime, timedelta
from functools import wraps
from flask import session, redirect, url_for, flash
from Backend.database import db, EmergencyOtp

def generate_otp_code():
    return str(random.randint(100000, 999999))

def can_request_emergency_otp(email):
    """
    Memeriksa apakah email ini sudah pernah meminta OTP dalam 1 jam (3600 detik) terakhir.
    Returns: (can_request: bool, seconds_remaining: int)
    """
    one_hour_ago = datetime.utcnow() - timedelta(hours=1)
    last_otp = EmergencyOtp.query.filter(
        EmergencyOtp.email == email,
        EmergencyOtp.requested_at >= one_hour_ago
    ).order_by(EmergencyOtp.requested_at.desc()).first()

    if not last_otp:
        return True, 0

    elapsed = (datetime.utcnow() - last_otp.requested_at).total_seconds()
    time_limit = 3600 # 1 hour in seconds
    if elapsed < time_limit:
        seconds_remaining = int(time_limit - elapsed)
        return False, seconds_remaining

    return True, 0

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Silakan masuk terlebih dahulu untuk mengakses menu ini.', 'warning')
            return redirect(url_for('auth.login_page'))
        return f(*args, **kwargs)
    return decorated_function
