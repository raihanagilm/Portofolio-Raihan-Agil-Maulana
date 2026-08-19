# pyrefly: ignore [missing-import]
from flask import Blueprint, render_template, request, redirect, url_for, flash
from Backend.utils.auth_helper import login_required
from Backend.database import db, Profile
from Backend.utils.cloudinary_helper import upload_media, delete_media

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

        # Toggles
        profile.show_email = request.form.get('show_email') == 'on'
        profile.show_phone = request.form.get('show_phone') == 'on'
        profile.show_location = request.form.get('show_location') == 'on'
        profile.show_github = request.form.get('show_github') == 'on'
        profile.show_linkedin = request.form.get('show_linkedin') == 'on'
        profile.show_instagram = request.form.get('show_instagram') == 'on'
        profile.show_facebook = request.form.get('show_facebook') == 'on'
        profile.show_twitter = request.form.get('show_twitter') == 'on'
        profile.show_youtube = request.form.get('show_youtube') == 'on'
        profile.show_website = request.form.get('show_website') == 'on'
        profile.show_resume = request.form.get('show_resume') == 'on'

        upload_failed = False

        if 'avatar' in request.files and request.files['avatar'].filename != '':
            uploaded_url = upload_media(request.files['avatar'], folder="avatar")
            if uploaded_url:
                if profile.avatar_url:
                    delete_media(profile.avatar_url)
                profile.avatar_url = uploaded_url
            else:
                upload_failed = True
                flash('Gagal upload foto profil. Mohon periksa file dan coba lagi.', 'danger')

        if 'resume' in request.files and request.files['resume'].filename != '':
            resume_url = upload_media(request.files['resume'], folder="documents")
            if resume_url:
                if profile.resume_url:
                    delete_media(profile.resume_url)
                profile.resume_url = resume_url
            else:
                upload_failed = True
                flash('Gagal upload CV/Resume. Mohon periksa file dan coba lagi.', 'danger')

        db.session.commit()
        if upload_failed:
            flash('Profil diperbarui, tetapi beberapa media gagal diunggah.', 'warning')
        else:
            flash('Profil berhasil diperbarui!', 'success')
        return redirect(url_for('profile.index'))

    return render_template('dashboard/profile.html', profile=profile, active_page='profil')

@profile_bp.route('/delete-avatar', methods=['POST'])
@login_required
def delete_avatar():
    profile = Profile.query.first()
    if profile and profile.avatar_url:
        delete_media(profile.avatar_url)
        profile.avatar_url = None
        db.session.commit()
        flash('Foto profil berhasil dihapus.', 'success')
    return redirect(url_for('profile.index'))

@profile_bp.route('/delete-resume', methods=['POST'])
@login_required
def delete_resume():
    profile = Profile.query.first()
    if profile and profile.resume_url:
        delete_media(profile.resume_url)
        profile.resume_url = None
        db.session.commit()
        flash('CV/Resume berhasil dihapus.', 'success')
    return redirect(url_for('profile.index'))
