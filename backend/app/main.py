from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api import auth, profile, projects, experiences, skills, education, messages

app = FastAPI(
    title=settings.APP_NAME,
    description="API untuk Manajemen Portofolio Raihan Agil Maulana",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(profile.router, prefix="/api/v1")
app.include_router(projects.router, prefix="/api/v1")
app.include_router(experiences.router, prefix="/api/v1")
app.include_router(skills.router, prefix="/api/v1")
app.include_router(education.router, prefix="/api/v1")
app.include_router(messages.router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
