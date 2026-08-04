from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from Backend.utils.auth_helper import login_required
from Backend.database import db, Message

messages_bp = Blueprint('messages', __name__, url_prefix='/dashboard/messages')

@messages_bp.route('/')
@login_required
def index():
    messages = Message.query.order_by(Message.created_at.desc()).all()
    return render_template('dashboard/messages.html', messages=messages, active_page='pesan')

@messages_bp.route('/read/<int:msg_id>', methods=['POST'])
@login_required
def mark_read(msg_id):
    msg = Message.query.get_or_404(msg_id)
    msg.is_read = True
    db.session.commit()
    return jsonify({'success': True})

@messages_bp.route('/delete/<int:msg_id>', methods=['POST'])
@login_required
def delete(msg_id):
    msg = Message.query.get_or_404(msg_id)
    db.session.delete(msg)
    db.session.commit()
    flash('Pesan berhasil dihapus.', 'info')
    return redirect(url_for('messages.index'))

@messages_bp.route('/send-public', methods=['POST'])
def send_public():
    data = request.get_json() if request.is_json else request.form
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    subject = data.get('subject', '').strip()
    content = data.get('message', '').strip()

    if not name or not email or not content:
        if request.is_json:
            return jsonify({'success': False, 'message': 'Mohon isi nama, email, dan pesan Anda.'}), 400
        flash('Mohon lengkapi semua kolom form.', 'danger')
        return redirect(url_for('public.index'))

    new_msg = Message(sender_name=name, sender_email=email, subject=subject or 'Contact Portfolio', content=content)
    db.session.add(new_msg)
    db.session.commit()

    if request.is_json:
        return jsonify({'success': True, 'message': 'Pesan Anda telah berhasil dikirim! Terima kasih.'})
    flash('Pesan Anda telah berhasil dikirim! Terima kasih.', 'success')
    return redirect(url_for('public.index'))
