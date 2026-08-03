import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends

from app.models.portfolio import ProjectCreate, ProjectUpdate, ProjectResponse
from app.services.supabase_client import get_supabase
from app.services.storage_service import upload_file, delete_file_by_url
from app.core.deps import get_current_user

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("", response_model=List[ProjectResponse])
async def list_projects():
    """List all projects (public)."""
    supabase = get_supabase()
    result = supabase.table("projects").select("*").order("created_at", desc=True).execute()
    return result.data or []


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str):
    """Get single project by ID (public)."""
    supabase = get_supabase()
    result = supabase.table("projects").select("*").eq("id", project_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Proyek tidak ditemukan")
    return result.data


@router.post("", response_model=ProjectResponse)
async def create_project(
    payload: ProjectCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create new project (authenticated)."""
    supabase = get_supabase()
    now = datetime.now(timezone.utc).isoformat()
    data = payload.model_dump()
    data["id"] = str(uuid.uuid4())
    data["created_at"] = now
    data["updated_at"] = now

    result = supabase.table("projects").insert(data).execute()
    return result.data[0]


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    payload: ProjectUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update project (authenticated)."""
    supabase = get_supabase()
    update_data = payload.model_dump(exclude_none=True)
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    result = supabase.table("projects").update(update_data).eq("id", project_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Proyek tidak ditemukan")
    return result.data[0]


@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete project and its image from storage (authenticated)."""
    supabase = get_supabase()

    # Delete image from storage first
    existing = supabase.table("projects").select("image_url").eq("id", project_id).single().execute()
    if existing.data and existing.data.get("image_url"):
        await delete_file_by_url(existing.data["image_url"])

    supabase.table("projects").delete().eq("id", project_id).execute()
    return {"message": "Proyek berhasil dihapus"}


@router.post("/{project_id}/image")
async def upload_project_image(
    project_id: str,
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload project image to Supabase Storage blob."""
    if file.content_type not in ["image/jpeg", "image/png", "image/webp", "image/gif"]:
        raise HTTPException(status_code=400, detail="Format file tidak didukung")

    supabase = get_supabase()
    # Delete old image if exists
    existing = supabase.table("projects").select("image_url").eq("id", project_id).single().execute()
    if existing.data and existing.data.get("image_url"):
        await delete_file_by_url(existing.data["image_url"])

    file_bytes = await file.read()
    public_url = await upload_file(file_bytes, file.content_type, folder="projects")

    supabase.table("projects").update({
        "image_url": public_url,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }).eq("id", project_id).execute()

    return {"image_url": public_url, "message": "Gambar proyek berhasil diupload"}
