import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, HTTPException, Depends

from app.models.portfolio import EducationCreate, EducationUpdate, EducationResponse
from app.services.supabase_client import get_supabase
from app.core.deps import get_current_user

router = APIRouter(prefix="/education", tags=["Education"])


@router.get("", response_model=List[EducationResponse])
async def list_education():
    supabase = get_supabase()
    result = supabase.table("education").select("*").order("start_date", desc=True).execute()
    return result.data or []


@router.post("", response_model=EducationResponse)
async def create_education(
    payload: EducationCreate,
    current_user: dict = Depends(get_current_user)
):
    supabase = get_supabase()
    now = datetime.now(timezone.utc).isoformat()
    data = payload.model_dump()
    data["id"] = str(uuid.uuid4())
    data["created_at"] = now
    data["updated_at"] = now
    result = supabase.table("education").insert(data).execute()
    return result.data[0]


@router.put("/{edu_id}", response_model=EducationResponse)
async def update_education(
    edu_id: str,
    payload: EducationUpdate,
    current_user: dict = Depends(get_current_user)
):
    supabase = get_supabase()
    update_data = payload.model_dump(exclude_none=True)
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = supabase.table("education").update(update_data).eq("id", edu_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Pendidikan tidak ditemukan")
    return result.data[0]


@router.delete("/{edu_id}")
async def delete_education(
    edu_id: str,
    current_user: dict = Depends(get_current_user)
):
    supabase = get_supabase()
    supabase.table("education").delete().eq("id", edu_id).execute()
    return {"message": "Pendidikan berhasil dihapus"}
