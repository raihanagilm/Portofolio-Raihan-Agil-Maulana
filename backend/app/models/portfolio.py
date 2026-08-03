from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from datetime import datetime


# ─── Profile ────────────────────────────────────────────────────────────────

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    instagram: Optional[str] = None
    twitter: Optional[str] = None
    avatar_url: Optional[str] = None


class ProfileResponse(BaseModel):
    id: Optional[str] = None
    full_name: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    instagram: Optional[str] = None
    twitter: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


# ─── Project ─────────────────────────────────────────────────────────────────

class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    tech_stack: Optional[List[str]] = []
    image_url: Optional[str] = None
    demo_url: Optional[str] = None
    repo_url: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_featured: bool = False


class ProjectUpdate(ProjectCreate):
    title: Optional[str] = None


class ProjectResponse(ProjectCreate):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


# ─── Experience ───────────────────────────────────────────────────────────────

class ExperienceCreate(BaseModel):
    company: str
    position: str
    description: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: bool = False
    location: Optional[str] = None
    company_logo_url: Optional[str] = None


class ExperienceUpdate(ExperienceCreate):
    company: Optional[str] = None
    position: Optional[str] = None


class ExperienceResponse(ExperienceCreate):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


# ─── Skill ───────────────────────────────────────────────────────────────────

class SkillCreate(BaseModel):
    name: str
    category: str  # e.g. Frontend, Backend, Database, Tools
    level: int = 80  # 0-100
    icon_url: Optional[str] = None


class SkillUpdate(SkillCreate):
    name: Optional[str] = None
    category: Optional[str] = None


class SkillResponse(SkillCreate):
    id: str
    created_at: Optional[datetime] = None


# ─── Education ───────────────────────────────────────────────────────────────

class EducationCreate(BaseModel):
    institution: str
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: bool = False
    gpa: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None


class EducationUpdate(EducationCreate):
    institution: Optional[str] = None


class EducationResponse(EducationCreate):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


# ─── Message ─────────────────────────────────────────────────────────────────

class MessageCreate(BaseModel):
    sender_name: str
    sender_email: str
    subject: str
    message: str


class MessageResponse(BaseModel):
    id: str
    sender_name: str
    sender_email: str
    subject: str
    message: str
    is_read: bool = False
    created_at: Optional[datetime] = None
