import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, HTTPException, Depends

from app.models.portfolio import MessageCreate, MessageResponse
from app.services.supabase_client import get_supabase
from app.services.email_service import send_message_notification
from app.core.deps import get_current_user

router = APIRouter(prefix="/messages", tags=["Messages"])


@router.get("", response_model=List[MessageResponse])
async def list_messages(
    current_user: dict = Depends(get_current_user)
):
    """List all messages (authenticated only)."""
    supabase = get_supabase()
    result = supabase.table("messages").select("*").order("created_at", desc=True).execute()
    return result.data or []


@router.post("", response_model=dict)
async def send_message(payload: MessageCreate):
    """Submit a new message from visitors (public). Sends email notification to owner."""
    supabase = get_supabase()
    now = datetime.now(timezone.utc).isoformat()

    data = payload.model_dump()
    data["id"] = str(uuid.uuid4())
    data["is_read"] = False
    data["created_at"] = now

    supabase.table("messages").insert(data).execute()

    # Send email notification to owner
    send_message_notification(
        sender_name=payload.sender_name,
        sender_email=payload.sender_email,
        subject=payload.subject,
        message=payload.message
    )

    return {"message": "Pesan Anda berhasil dikirim. Terima kasih telah menghubungi kami!"}


@router.patch("/{message_id}/read")
async def mark_as_read(
    message_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Mark message as read (authenticated)."""
    supabase = get_supabase()
    result = supabase.table("messages").update({"is_read": True}).eq("id", message_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Pesan tidak ditemukan")
    return {"message": "Pesan ditandai sudah dibaca"}


@router.delete("/{message_id}")
async def delete_message(
    message_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete message (authenticated)."""
    supabase = get_supabase()
    supabase.table("messages").delete().eq("id", message_id).execute()
    return {"message": "Pesan berhasil dihapus"}


@router.get("/stats/unread-count")
async def get_unread_count(current_user: dict = Depends(get_current_user)):
    """Get count of unread messages."""
    supabase = get_supabase()
    result = supabase.table("messages").select("id", count="exact").eq("is_read", False).execute()
    return {"unread_count": result.count or 0}
