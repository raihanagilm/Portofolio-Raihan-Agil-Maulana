from Backend.config import Config

def upload_media(file_storage, folder="portfolio"):
    """
    Upload file gambar ke Cloudinary. Fallback jika package / credentials belum siap.
    """
    if not (Config.CLOUDINARY_CLOUD_NAME and Config.CLOUDINARY_API_KEY):
        return None

    try:
        import cloudinary
        import cloudinary.uploader
        cloudinary.config(
            cloud_name=Config.CLOUDINARY_CLOUD_NAME,
            api_key=Config.CLOUDINARY_API_KEY,
            api_secret=Config.CLOUDINARY_API_SECRET
        )
        upload_result = cloudinary.uploader.upload(file_storage, folder=folder)
        return upload_result.get('secure_url')
    except ImportError:
        print("[CLOUDINARY SDK NOT INSTALLED]")
        return None
    except Exception as e:
        print(f"[CLOUDINARY ERROR] {str(e)}")
        return None
