"""
Security Logging Middleware for FastAPI.
Logs security-related events for monitoring and audit purposes.
"""

from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
from typing import Callable
from app.utils.security_logger import (
    log_security_event,
    SecurityEvent,
    get_client_ip,
)


class SecurityLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware to log security-related events.
    Logs authentication attempts, rate limit violations, and suspicious activity.
    """

    def __init__(self, app: ASGIApp):
        super().__init__(app)
        # Endpoints to exclude from logging
        self.excluded_paths = [
            "/health",
            "/",
            "/docs",
            "/redoc",
            "/openapi.json",
        ]

    def _should_log(self, path: str) -> bool:
        """Check if path should be logged."""
        return not any(path.startswith(excluded) for excluded in self.excluded_paths)

    async def dispatch(self, request: Request, call_next: Callable):
        """
        Log security events before and after request processing.
        """
        # Skip logging for excluded paths
        if not self._should_log(request.url.path):
            return await call_next(request)

        # Log request start
        start_time = request.state.start_time = None
        
        try:
            # Process request
            response = await call_next(request)
            
            # Log successful request (if needed)
            # Note: We log specific events in routers, not all requests
            
            return response
            
        except HTTPException as e:
            # Log HTTP exceptions (auth failures, rate limits, etc.)
            if e.status_code == status.HTTP_401_UNAUTHORIZED:
                log_security_event(
                    event_type=SecurityEvent.AUTH_FAILURE,
                    message=f"Unauthorized access attempt: {e.detail}",
                    request=request,
                    severity="WARNING"
                )
            elif e.status_code == status.HTTP_403_FORBIDDEN:
                log_security_event(
                    event_type=SecurityEvent.AUTH_FAILURE,
                    message=f"Forbidden access attempt: {e.detail}",
                    request=request,
                    severity="WARNING"
                )
            elif e.status_code == status.HTTP_429_TOO_MANY_REQUESTS:
                # Rate limit logging is handled in rate_limiter middleware
                pass
            elif e.status_code == status.HTTP_413_REQUEST_ENTITY_TOO_LARGE:
                log_security_event(
                    event_type=SecurityEvent.SUSPICIOUS_ACTIVITY,
                    message=f"Large request detected: {e.detail}",
                    request=request,
                    details={"status_code": e.status_code, "detail": e.detail},
                    severity="WARNING"
                )
            else:
                # Log other HTTP exceptions
                log_security_event(
                    event_type=SecurityEvent.SECURITY_ERROR,
                    message=f"HTTP exception: {e.status_code} - {e.detail}",
                    request=request,
                    details={"status_code": e.status_code, "detail": e.detail},
                    severity="ERROR" if e.status_code >= 500 else "WARNING"
                )
            
            raise
            
        except Exception as e:
            # Log unexpected errors
            log_security_event(
                event_type=SecurityEvent.SECURITY_ERROR,
                message=f"Unexpected error: {str(e)}",
                request=request,
                details={"error": str(e), "error_type": type(e).__name__},
                severity="ERROR"
            )
            raise

