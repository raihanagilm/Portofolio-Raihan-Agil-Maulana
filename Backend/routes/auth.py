from datetime import datetime, timedelta
from flask import Blueprint, render_template, request, redirect, url_for, flash, session, jsonify
from werkzeug.security import check_password_hash
from Backend.database import db, User, EmergencyOtp
from Backend.utils.auth_helper import generate_otp_code, can_request_emergency_otp
from Backend.utils.resend_email import send_emergency_otp_email
from Backend.config import Config

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login_page():
    if request.method == 'POST':
        # Bisa dari JSON (AJAX) atau Form post biasa
        data = request.get_json() if request.is_json else request.form
        email = data.get('username', '').strip()
        password = data.get('password', '').strip()

        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password_hash, password):
            session['user_id'] = user.id
            session['email'] = user.email
            session['role'] = user.role

            if request.is_json:
                return jsonify({'success': True, 'redirect': url_for('dashboard.index')})
            flash('Berhasil masuk!', 'success')
            return redirect(url_for('dashboard.index'))
        else:
            msg = 'Email/Username atau Kata Sandi salah.'
            if request.is_json:
                return jsonify({'success': False, 'message': msg}), 400
            flash(msg, 'danger')

    return render_template('login.html')

@auth_bp.route('/request-emergency-otp', methods=['POST'])
def request_emergency_otp():
    target_email = Config.PERSONAL_EMAIL

    can_request, remaining_seconds = can_request_emergency_otp(target_email)
    if not can_request:
        minutes = round(remaining_seconds / 60)
        return jsonify({
            'success': False,
            'message': f'Login darurat hanya dapat digunakan 1 jam sekali. Silakan tunggu {minutes} menit lagi ({remaining_seconds} detik).',
            'remaining_seconds': remaining_seconds
        }), 429

    otp_code = generate_otp_code()
    expires_at = datetime.utcnow() + timedelta(minutes=10)

    new_otp = EmergencyOtp(
        email=target_email,
        otp_code=otp_code,
        requested_at=datetime.utcnow(),
        expires_at=expires_at,
        is_used=False
    )
    db.session.add(new_otp)
    db.session.commit()

    success, email_msg = send_emergency_otp_email(target_email, otp_code)
    return jsonify({
        'success': True,
        'message': f'Kode OTP darurat telah dikirim ke {target_email}. {email_msg}',
        'remaining_seconds': 3600
    })

@auth_bp.route('/verify-emergency-otp', methods=['POST'])
def verify_emergency_otp():
    data = request.get_json() if request.is_json else request.form
    otp_input = data.get('otp', '').strip()
    target_email = Config.PERSONAL_EMAIL

    valid_otp = EmergencyOtp.query.filter(
        EmergencyOtp.email == target_email,
        EmergencyOtp.otp_code == otp_input,
        EmergencyOtp.is_used == False,
        EmergencyOtp.expires_at >= datetime.utcnow()
    ).order_by(EmergencyOtp.requested_at.desc()).first()

    if valid_otp:
        valid_otp.is_used = True
        db.session.commit()

        user = User.query.filter_by(email=target_email).first()
        if user:
            session['user_id'] = user.id
            session['email'] = user.email
            session['role'] = user.role

        return jsonify({'success': True, 'redirect': url_for('dashboard.index')})
    else:
        return jsonify({'success': False, 'message': 'Kode OTP tidak valid atau telah kadaluarsa.'}), 400

@auth_bp.route('/logout')
def logout():
    session.clear()
    flash('Anda telah keluar.', 'info')
    return redirect(url_for('auth.login_page'))
