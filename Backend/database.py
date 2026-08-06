# pyrefly: ignore [missing-import]
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='admin')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class EmergencyOtp(db.Model):
    __tablename__ = 'emergency_otps'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    otp_code = db.Column(db.String(6), nullable=False)
    requested_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    is_used = db.Column(db.Boolean, default=False)

class VisitorLog(db.Model):
    __tablename__ = 'visitor_logs'
    id = db.Column(db.Integer, primary_key=True)
    ip_address = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.String(255), nullable=True)
    path = db.Column(db.String(100), default="/")
    visited_at = db.Column(db.DateTime, default=datetime.utcnow)

class Profile(db.Model):
    __tablename__ = 'profiles'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False, default="Full Name")
    title = db.Column(db.String(150), default="Full-Stack Developer & UI/UX Designer")
    bio = db.Column(db.Text, default="Pengembang perangkat lunak berbakat dengan fokus pada estetika dan efisiensi.")
    avatar_url = db.Column(db.String(255), default="")
    resume_url = db.Column(db.String(255), default="")
    github = db.Column(db.String(150), default="")
    linkedin = db.Column(db.String(150), default="")
    instagram = db.Column(db.String(150), default="")
    facebook = db.Column(db.String(150), default="")
    twitter = db.Column(db.String(150), default="")
    show_twitter = db.Column(db.Boolean, default=True)
    youtube = db.Column(db.String(150), default="")
    website = db.Column(db.String(150), default="")
    show_website = db.Column(db.Boolean, default=True)
    show_email = db.Column(db.Boolean, default=True)
    show_phone = db.Column(db.Boolean, default=True)
    show_location = db.Column(db.Boolean, default=True)
    show_github = db.Column(db.Boolean, default=True)
    show_linkedin = db.Column(db.Boolean, default=True)
    show_instagram = db.Column(db.Boolean, default=True)
    show_facebook = db.Column(db.Boolean, default=True)
    show_youtube = db.Column(db.Boolean, default=True)
    show_resume = db.Column(db.Boolean, default=True)
    email = db.Column(db.String(120), default="")
    phone = db.Column(db.String(30), default="")
    location = db.Column(db.String(100), default="")

class Experience(db.Model):
    __tablename__ = 'experiences'
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), default="Kerja") # Kerja, Magang, Organisasi, Asdos, Lainnya
    period = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=True)
    order_index = db.Column(db.Integer, default=0)
    is_visible = db.Column(db.Boolean, default=True)

class Education(db.Model):
    __tablename__ = 'educations'
    id = db.Column(db.Integer, primary_key=True)
    institution = db.Column(db.String(120), nullable=False)
    degree = db.Column(db.String(100), nullable=False)
    major = db.Column(db.String(100), nullable=True)
    period = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=True)
    type = db.Column(db.String(20), default="education") # 'education' or 'certificate'
    credential_url = db.Column(db.String(255), default="")
    is_visible = db.Column(db.Boolean, default=True)

class Skill(db.Model):
    __tablename__ = 'skills'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    category = db.Column(db.String(50), default="Technical") # Technical, Soft Skill / Kepemimpinan, Bahasa, Tools
    icon = db.Column(db.String(50), default="code")
    is_visible = db.Column(db.Boolean, default=True)

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=True) # Detailed content for project detail page
    image_url = db.Column(db.String(255), nullable=True) # Main thumbnail
    demo_url = db.Column(db.String(255), nullable=True)
    github_url = db.Column(db.String(255), nullable=True)
    category = db.Column(db.String(50), default="Web App")
    tags = db.Column(db.String(200), default="Flask, Tailwind, MySQL")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_visible = db.Column(db.Boolean, default=True)

class ProjectImage(db.Model):
    __tablename__ = 'project_images'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    
    project = db.relationship('Project', backref=db.backref('images', lazy=True, cascade="all, delete-orphan"))

class Message(db.Model):
    __tablename__ = 'messages'
    id = db.Column(db.Integer, primary_key=True)
    sender_name = db.Column(db.String(100), nullable=False)
    sender_email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_read = db.Column(db.Boolean, default=False)
