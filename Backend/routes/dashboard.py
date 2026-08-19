from datetime import datetime, timedelta
# pyrefly: ignore [missing-import]
from flask import Blueprint, render_template
from Backend.utils.auth_helper import login_required
from Backend.database import db, Project, Message, Skill, Experience, Profile, VisitorLog

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/dashboard')

@dashboard_bp.route('/')
@login_required
def index():
    total_projects = Project.query.count()
    unread_messages = Message.query.filter_by(is_read=False).count()
    total_skills = Skill.query.count()
    total_experiences = Experience.query.count()
    profile = Profile.query.first()

    # Database Cleanup: Delete logs older than 7 days
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    VisitorLog.query.filter(VisitorLog.visited_at < seven_days_ago).delete()
    db.session.commit()

    # Real-Time Visitor Analytics (Last 7 Days)
    total_views = VisitorLog.query.filter(VisitorLog.visited_at >= seven_days_ago).count()
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_views = VisitorLog.query.filter(VisitorLog.visited_at >= today_start).count()
    
    # Unique visitors count (Last 7 Days)
    unique_visitors = db.session.query(VisitorLog.ip_address).filter(VisitorLog.visited_at >= seven_days_ago).distinct().count()
    
    # Recent visitors list
    recent_visitors = VisitorLog.query.order_by(VisitorLog.visited_at.desc()).limit(8).all()

    return render_template(
        'dashboard/index.html',
        total_projects=total_projects,
        unread_messages=unread_messages,
        total_skills=total_skills,
        total_experiences=total_experiences,
        total_views=total_views,
        today_views=today_views,
        unique_visitors=unique_visitors,
        recent_visitors=recent_visitors,
        profile=profile,
        active_page='beranda'
    )
