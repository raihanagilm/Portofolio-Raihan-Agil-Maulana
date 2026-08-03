from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Portfolio Manager - Raihan Agil Maulana"
    FRONTEND_URL: str = "http://localhost:5173"
    CORS_ORIGINS: str = '["http://localhost:5173","http://localhost:3000"]'

    # Supabase
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_KEY: str
    SUPABASE_STORAGE_BUCKET: str = "portfolio-assets"

    # Resend
    RESEND_API_KEY: str
    EMAIL_FROM: str = "noreply@yourdomain.com"
    EMAIL_OWNER: str = "raihan@yourdomain.com"

    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # OTP
    OTP_EXPIRE_MINUTES: int = 10

    class Config:
        env_file = ".env"
        case_sensitive = True

    @property
    def cors_origins_list(self) -> List[str]:
        try:
            return json.loads(self.CORS_ORIGINS)
        except Exception:
            return [self.FRONTEND_URL]


settings = Settings()
