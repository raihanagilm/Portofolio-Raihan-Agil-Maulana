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

        file_name = getattr(file_storage, 'filename', None)
        content_type = getattr(file_storage, 'content_type', None)
        
        # Cloudinary Python SDK expects a .name attribute to read the filename
        # Werkzeug's FileStorage uses .filename
        if file_name and hasattr(file_storage, 'name'):
            file_storage.name = file_name
            
        if hasattr(file_storage, "seek"):
            file_storage.seek(0)

        if hasattr(file_storage, "read"):
            file_bytes = file_storage.read()
            # Reset pointer after reading so Cloudinary can read it again
            file_storage.seek(0)
            upload_target = file_storage
        else:
            file_bytes = file_storage
            upload_target = file_bytes

        if not file_bytes:
            print(f"[CLOUDINARY] Error: file is empty (name={file_name}, content_type={content_type})")
            return None

        print(f"[CLOUDINARY] Upload file={file_name} content_type={content_type} folder={folder} size={len(file_bytes)} bytes")

        result = cloudinary.uploader.upload(
            upload_target,
            folder=folder,
            resource_type="auto",
            type="upload",
            use_filename=True,
            unique_filename=True,
            access_mode="public"
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

def delete_media(secure_url):
    """Delete file from Cloudinary based on secure_url."""
    if not secure_url:
        return False
        
    cloud_name = Config.CLOUDINARY_CLOUD_NAME
    api_key = Config.CLOUDINARY_API_KEY
    api_secret = Config.CLOUDINARY_API_SECRET

    if not (cloud_name and api_key and api_secret):
        return False

    try:
        import cloudinary
        import cloudinary.uploader

        cloudinary.config(
            cloud_name=cloud_name,
            api_key=api_key,
            api_secret=api_secret,
            secure=True
        )

        # Extract public_id from url
        # Example url: https://res.cloudinary.com/dxyz/image/upload/v1234/portofolio/avatar/abc1234.jpg
        # public_id: portofolio/avatar/abc1234
        parts = secure_url.split('/upload/')
        if len(parts) > 1:
            path = parts[1]
            # Remove version like 'v1234/' if present
            if path.startswith('v') and '/' in path:
                v_part, rest = path.split('/', 1)
                if v_part[1:].isdigit():
                    path = rest
            
            # Remove file extension
            public_id = path.rsplit('.', 1)[0]
            
            print(f"[CLOUDINARY] Menghapus: {public_id}")
            result = cloudinary.uploader.destroy(public_id)
            return result.get('result') == 'ok'
            
    except Exception as e:
        print(f"[CLOUDINARY] Error delete {type(e).__name__}: {e}")
    
    return False

