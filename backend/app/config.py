from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # Supabase
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_JWT_SECRET: str
    
    # CORS - parse from comma-separated string
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:5174,http://localhost:3000"
    
    @property
    def cors_origins_list(self) -> list[str]:
        """Parse CORS_ORIGINS from comma-separated string to list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]
    
    # App
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = False
    
    # Security
    MAX_REQUEST_SIZE: int = 10 * 1024 * 1024  # 10MB
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5MB per file
    MAX_FILES_PER_UPLOAD: int = 10
    
    # Rate limiting (optional)
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 60  # seconds
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

