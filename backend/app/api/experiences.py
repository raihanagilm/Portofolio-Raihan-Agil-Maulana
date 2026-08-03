import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, HTTPException, Depends

from app.models.portfolio import ExperienceCreate, ExperienceUpdate, ExperienceResponse
from app.services.supabase_client import get_supabase
from app.core.deps import get_current_user

router = APIRouter(prefix="/experiences", tags=["Experiences"])


@router.get("", response_model=List[ExperienceResponse])
async def list_experiences():
    supabase = get_supabase()
    result = supabase.table("experiences").select("*").order("start_date", desc=True).execute()
    return result.data or []


@router.get("/{exp_id}", response_model=ExperienceResponse)
async def get_experience(exp_id: str):
    supabase = get_supabase()
    result = supabase.table("experiences").select("*").eq("id", exp_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Pengalaman tidak ditemukan")
    return result.data


@router.post("", response_model=ExperienceResponse)
async def create_experience(
    payload: ExperienceCreate,
    current_user: dict = Depends(get_current_user)
):
    supabase = get_supabase()
    now = datetime.now(timezone.utc).isoformat()
    data = payload.model_dump()
    data["id"] = str(uuid.uuid4())
    data["created_at"] = now
    data["updated_at"] = now
    result = supabase.table("experiences").insert(data).execute()
    return result.data[0]


@router.put("/{exp_id}", response_model=ExperienceResponse)
async def update_experience(
    exp_id: str,
    payload: ExperienceUpdate,
    current_user: dict = Depends(get_current_user)
):
    supabase = get_supabase()
    update_data = payload.model_dump(exclude_none=True)
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = supabase.table("experiences").update(update_data).eq("id", exp_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Pengalaman tidak ditemukan")
    return result.data[0]


@router.delete("/{exp_id}")
async def delete_experience(
    exp_id: str,
    current_user: dict = Depends(get_current_user)
):
    supabase = get_supabase()
    supabase.table("experiences").delete().eq("id", exp_id).execute()
    return {"message": "Pengalaman berhasil dihapus"}
