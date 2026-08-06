import os
from dotenv import load_dotenv

load_dotenv()

db_url = os.environ.get('DATABASE_URL')

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'kardus_secret_key_portofolio_2026')
    SQLALCHEMY_DATABASE_URI = db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Standard SSL settings for TiDB MySQL connection
    if db_url.startswith('mysql'):
        SQLALCHEMY_ENGINE_OPTIONS = {
            "connect_args": {
                "ssl": {
                    "ssl_mode": "VERIFY_IDENTITY"
                }
            }
        }
    else:
        SQLALCHEMY_ENGINE_OPTIONS = {}

    # Resend API Key
    RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
    SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
    PERSONAL_EMAIL = os.environ.get('PERSONAL_EMAIL', '')

    # Cloudinary Config
    CLOUDINARY_CLOUD_NAME = os.environ.get('CLOUDINARY_CLOUD_NAME', '')
    CLOUDINARY_API_KEY = os.environ.get('CLOUDINARY_API_KEY', '')
    CLOUDINARY_API_SECRET = os.environ.get('CLOUDINARY_API_SECRET', '')
