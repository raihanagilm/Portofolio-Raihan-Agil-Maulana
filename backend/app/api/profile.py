from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from app.models.portfolio import ProfileUpdate, ProfileResponse
from app.services.supabase_client import get_supabase
from app.services.storage_service import upload_file, delete_file_by_url
from app.core.deps import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])

PROFILE_ID = "raihan-agil-maulana"  # Single-user fixed ID


@router.get("", response_model=ProfileResponse)
async def get_profile():
    """Get portfolio owner profile (public endpoint)."""
    supabase = get_supabase()
    result = supabase.table("profiles").select("*").eq("id", PROFILE_ID).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Profil tidak ditemukan")
    return result.data


@router.put("", response_model=ProfileResponse)
async def update_profile(
    payload: ProfileUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update profile (authenticated)."""
    supabase = get_supabase()
    update_data = payload.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="Tidak ada data untuk diupdate")

    from datetime import datetime, timezone
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    result = supabase.table("profiles").update(update_data).eq("id", PROFILE_ID).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Profil tidak ditemukan")
    return result.data[0]


@router.post("/avatar", response_model=dict)
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload profile avatar to Supabase Storage (blob)."""
    if file.content_type not in ["image/jpeg", "image/png", "image/webp", "image/gif"]:
        raise HTTPException(status_code=400, detail="Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.")

    if file.size and file.size > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Ukuran file maksimal 5MB")

    file_bytes = await file.read()

    # Delete old avatar if exists
    supabase = get_supabase()
    existing = supabase.table("profiles").select("avatar_url").eq("id", PROFILE_ID).single().execute()
    if existing.data and existing.data.get("avatar_url"):
        await delete_file_by_url(existing.data["avatar_url"])

    public_url = await upload_file(file_bytes, file.content_type, folder="avatars")

    # Update profile with new avatar URL
    from datetime import datetime, timezone
    supabase.table("profiles").update({
        "avatar_url": public_url,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }).eq("id", PROFILE_ID).execute()

    return {"avatar_url": public_url, "message": "Avatar berhasil diupload"}
