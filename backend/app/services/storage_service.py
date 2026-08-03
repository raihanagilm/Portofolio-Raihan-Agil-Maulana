import uuid
import httpx
from app.core.config import settings
from app.services.supabase_client import get_supabase


async def upload_file(file_bytes: bytes, content_type: str, folder: str = "general") -> str:
    """
    Upload file bytes to Supabase Storage and return the public URL.
    folder: 'avatars' | 'projects' | 'general'
    """
    supabase = get_supabase()
    file_ext = _ext_from_content_type(content_type)
    file_path = f"{folder}/{uuid.uuid4()}{file_ext}"

    supabase.storage.from_(settings.SUPABASE_STORAGE_BUCKET).upload(
        path=file_path,
        file=file_bytes,
        file_options={"content-type": content_type, "upsert": "false"},
    )

    # Get public URL
    url_response = supabase.storage.from_(settings.SUPABASE_STORAGE_BUCKET).get_public_url(file_path)
    return url_response


async def delete_file_by_url(public_url: str) -> bool:
    """Delete a file from Supabase Storage by its public URL."""
    try:
        supabase = get_supabase()
        # Extract the path portion after the bucket name
        bucket_path = f"/storage/v1/object/public/{settings.SUPABASE_STORAGE_BUCKET}/"
        if bucket_path in public_url:
            file_path = public_url.split(bucket_path)[-1]
            supabase.storage.from_(settings.SUPABASE_STORAGE_BUCKET).remove([file_path])
            return True
    except Exception as e:
        print(f"[STORAGE ERROR] delete_file: {e}")
    return False


def _ext_from_content_type(content_type: str) -> str:
    mapping = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/gif": ".gif",
        "image/webp": ".webp",
        "image/svg+xml": ".svg",
        "application/pdf": ".pdf",
    }
    return mapping.get(content_type, ".bin")
