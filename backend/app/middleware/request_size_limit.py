"""
Request Size Limit Middleware for FastAPI.
Implements request size limits to protect against DoS attacks.
"""

from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
from typing import Callable
from app.config import settings


class RequestSizeLimitMiddleware(BaseHTTPMiddleware):
    """
    Middleware to limit request body size.
    Prevents DoS attacks from large request bodies.
    """

    def __init__(self, app: ASGIApp, max_request_size: int = 10 * 1024 * 1024):
        """
        Initialize middleware with maximum request size.
        
        Args:
            app: ASGI application
            max_request_size: Maximum request size in bytes (default: 10MB)
        """
        super().__init__(app)
        self.max_request_size = max_request_size

    async def dispatch(self, request: Request, call_next: Callable):
        """
        Check request size before processing.
        """
        # Get content length from headers
        content_length = request.headers.get("content-length")
        
        if content_length:
            try:
                content_length_int = int(content_length)
                
                # Check if request size exceeds limit
                if content_length_int > self.max_request_size:
                    from fastapi.responses import JSONResponse
                    return JSONResponse(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        content={
                            "detail": f"Request body too large. Maximum size: {self.max_request_size / (1024 * 1024):.1f}MB"
                        }
                    )
            except ValueError:
                # Invalid content-length header, ignore
                pass

        # Process request
        response = await call_next(request)

        return response

