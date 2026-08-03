import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, HTTPException, Depends

from app.models.portfolio import SkillCreate, SkillUpdate, SkillResponse
from app.services.supabase_client import get_supabase
from app.core.deps import get_current_user

router = APIRouter(prefix="/skills", tags=["Skills"])


@router.get("", response_model=List[SkillResponse])
async def list_skills():
    supabase = get_supabase()
    result = supabase.table("skills").select("*").order("category").execute()
    return result.data or []


@router.post("", response_model=SkillResponse)
async def create_skill(
    payload: SkillCreate,
    current_user: dict = Depends(get_current_user)
):
    supabase = get_supabase()
    now = datetime.now(timezone.utc).isoformat()
    data = payload.model_dump()
    data["id"] = str(uuid.uuid4())
    data["created_at"] = now
    result = supabase.table("skills").insert(data).execute()
    return result.data[0]


@router.put("/{skill_id}", response_model=SkillResponse)
async def update_skill(
    skill_id: str,
    payload: SkillUpdate,
    current_user: dict = Depends(get_current_user)
):
    supabase = get_supabase()
    update_data = payload.model_dump(exclude_none=True)
    result = supabase.table("skills").update(update_data).eq("id", skill_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Keahlian tidak ditemukan")
    return result.data[0]


@router.delete("/{skill_id}")
async def delete_skill(
    skill_id: str,
    current_user: dict = Depends(get_current_user)
):
    supabase = get_supabase()
    supabase.table("skills").delete().eq("id", skill_id).execute()
    return {"message": "Keahlian berhasil dihapus"}
