from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import listings, admin, media, users, favorites
from app.middleware import (
    SecurityHeadersMiddleware,
    RateLimiterMiddleware,
    RequestSizeLimitMiddleware,
    SecurityLoggingMiddleware,
)
import os
import logging
from datetime import datetime, timezone

app = FastAPI(
    title="Classifieds API",
    description="API for classifieds web platform",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,  # Disable docs in production
    redoc_url="/redoc" if settings.DEBUG else None,  # Disable redoc in production
)

# Configure logging
# Note: logs directory is created by security_logger.py
# We'll use the same directory for app.log
try:
    import os
    # Get the backend directory
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    logs_dir = os.path.join(backend_dir, "logs")
    os.makedirs(logs_dir, exist_ok=True)
    
    logging.basicConfig(
        level=logging.INFO if not settings.DEBUG else logging.DEBUG,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(os.path.join(logs_dir, "app.log")),
            logging.StreamHandler()
        ]
    )
except Exception as e:
    # Fallback to console-only logging if file handler fails
    logging.basicConfig(
        level=logging.INFO if not settings.DEBUG else logging.DEBUG,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[logging.StreamHandler()]
    )
    logging.warning(f"Failed to create file handler for app logs: {e}. Using console handler only.")

# Security middleware (order matters - apply in reverse order)
# Security logging (first - logs all requests)
app.add_middleware(SecurityLoggingMiddleware)

# Request size limit (second - checks request before processing)
app.add_middleware(
    RequestSizeLimitMiddleware,
    max_request_size=10 * 1024 * 1024,  # 10MB
)

# Rate limiting (third - checks rate limits)
app.add_middleware(RateLimiterMiddleware)

# Security headers (fourth - adds headers to response)
app.add_middleware(SecurityHeadersMiddleware)

# CORS middleware (last - handles CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],  # Specify methods explicitly
    allow_headers=[
        "Authorization",
        "Content-Type",
        "Accept",
        "Origin",
        "X-Requested-With",
    ],  # Specify headers explicitly
    expose_headers=[
        "X-RateLimit-Limit",
        "X-RateLimit-Remaining",
        "X-RateLimit-Reset",
    ],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Include routers
app.include_router(listings.router, prefix=settings.API_V1_PREFIX)
app.include_router(admin.router, prefix=settings.API_V1_PREFIX)
app.include_router(media.router, prefix=settings.API_V1_PREFIX)
app.include_router(users.router, prefix=settings.API_V1_PREFIX)
app.include_router(favorites.router, prefix=settings.API_V1_PREFIX)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


@app.get("/security/status")
async def get_security_status():
    """Get security status and statistics."""
    from app.utils.monitoring import get_security_stats
    from app.utils.api_key_rotation import get_all_api_key_rotation_status, get_keys_due_for_rotation
    from app.utils.database_security import get_database_security_status
    
    # Get security statistics
    security_stats = get_security_stats()
    
    # Get API key rotation status
    api_key_status = get_all_api_key_rotation_status()
    keys_due = get_keys_due_for_rotation()
    
    # Get database security status
    db_security_status = get_database_security_status()
    
    return {
        "security_stats": security_stats,
        "api_key_rotation": {
            "status": api_key_status,
            "keys_due": keys_due,
        },
        "database_security": db_security_status,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Classifieds API",
        "version": "1.0.0",
        "docs": "/docs",
    }

