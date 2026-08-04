# pyrefly: ignore [missing-import]
from flask import Blueprint, render_template, request, redirect, url_for, flash
from Backend.utils.auth_helper import login_required
from Backend.database import db, Profile
from Backend.utils.cloudinary_helper import upload_media

profile_bp = Blueprint('profile', __name__, url_prefix='/dashboard/profile')

@profile_bp.route('/', methods=['GET', 'POST'])
@login_required
def index():
    profile = Profile.query.first()
    if not profile:
        profile = Profile()
        db.session.add(profile)
        db.session.commit()

    if request.method == 'POST':
        profile.full_name = request.form.get('full_name', profile.full_name)
        profile.title = request.form.get('title', profile.title)
        profile.bio = request.form.get('bio', profile.bio)
        profile.email = request.form.get('email', profile.email)
        profile.phone = request.form.get('phone', profile.phone)
        profile.location = request.form.get('location', profile.location)

        # Social Media Links
        profile.github = request.form.get('github', '')
        profile.linkedin = request.form.get('linkedin', '')
        profile.instagram = request.form.get('instagram', '')
        profile.facebook = request.form.get('facebook', '')
        profile.twitter = request.form.get('twitter', '')
        profile.youtube = request.form.get('youtube', '')
        profile.website = request.form.get('website', '')

        if 'avatar' in request.files and request.files['avatar'].filename != '':
            uploaded_url = upload_media(request.files['avatar'], folder="avatar")
            if uploaded_url:
                profile.avatar_url = uploaded_url

        db.session.commit()
        flash('Profil berhasil diperbarui!', 'success')
        return redirect(url_for('profile.index'))

    return render_template('dashboard/profile.html', profile=profile, active_page='profil')
