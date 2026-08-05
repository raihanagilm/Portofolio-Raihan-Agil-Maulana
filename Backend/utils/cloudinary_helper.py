from Backend.config import Config

def upload_media(file_storage, folder="portfolio"):
    """Upload file ke Cloudinary. Mengembalikan secure_url atau None."""
    
    if not folder.startswith("portofolio"):
        folder = f"portofolio/{folder}"
        
    cloud_name = Config.CLOUDINARY_CLOUD_NAME
    api_key = Config.CLOUDINARY_API_KEY
    api_secret = Config.CLOUDINARY_API_SECRET

    if not (cloud_name and api_key and api_secret):
        print("[CLOUDINARY] Kredensial belum diset di .env")
        return None

    try:
        import cloudinary
        import cloudinary.uploader

        cloudinary.config(
            cloud_name=cloud_name,
            api_key=api_key,
            api_secret=api_secret,
            secure=True
        )

        if hasattr(file_storage, "seek"):
            file_storage.seek(0)

        if hasattr(file_storage, "read"):
            file_bytes = file_storage.read()
        else:
            file_bytes = file_storage

        print(f"[CLOUDINARY] Upload folder={folder}, size={len(file_bytes)} bytes")

        result = cloudinary.uploader.upload(
            file_bytes,
            folder=folder,
            resource_type="auto"
        )
        url = result.get("secure_url")
        print(f"[CLOUDINARY] Berhasil: {url}")
        return url

    except ImportError:
        print("[CLOUDINARY] SDK tidak terpasang. pip install cloudinary")
        return None
    except Exception as e:
        print(f"[CLOUDINARY] Error {type(e).__name__}: {e}")
        return None
