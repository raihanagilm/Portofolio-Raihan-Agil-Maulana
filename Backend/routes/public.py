# pyrefly: ignore [missing-import]
from flask import Blueprint, render_template, request, redirect, url_for
from Backend.database import db, Profile, Project, Skill, Experience, Education, VisitorLog

public_bp = Blueprint('public', __name__)

@public_bp.route('/admin')
def admin_redirect():
    return redirect(url_for('auth.login_page'))

@public_bp.route('/')
def index():
    # Log visitor for real-time analytics
    try:
        ip = request.headers.get('X-Forwarded-For', request.remote_addr)
        if ip and ',' in ip:
            ip = ip.split(',')[0].strip()
        ua = request.user_agent.string[:250] if request.user_agent else ''
        vlog = VisitorLog(ip_address=ip, user_agent=ua, path=request.path)
        db.session.add(vlog)
        db.session.commit()
    except Exception as e:
        db.session.rollback()

    profile = Profile.query.first()
    if not profile:
        profile = Profile()

    projects = Project.query.filter_by(is_visible=True).order_by(Project.created_at.desc()).all()
    skills = Skill.query.filter_by(is_visible=True).all()
    experiences = Experience.query.filter_by(is_visible=True).order_by(Experience.order_index.asc(), Experience.id.desc()).all()
    educations = Education.query.filter_by(is_visible=True, type='education').all()
    certificates = Education.query.filter_by(is_visible=True, type='certificate').all()

    return render_template(
        'public.html',
        profile=profile,
        projects=projects,
        skills=skills,
        experiences=experiences,
        educations=educations,
        certificates=certificates
    )
