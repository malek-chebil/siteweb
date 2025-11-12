"""
Security Headers Middleware for FastAPI.
Implements security headers to protect against common web vulnerabilities.
"""

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
from typing import Callable


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware to add security headers to all responses.
    Implements OWASP recommended security headers.
    """

    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Add security headers to response.
        """
        response = await call_next(request)

        # Content Security Policy
        # Restrict resource loading to same origin and trusted sources
        csp = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "  # unsafe-inline for React
            "style-src 'self' 'unsafe-inline'; "  # unsafe-inline for inline styles
            "img-src 'self' data: https:; "  # Allow images from same origin, data URIs, and HTTPS
            "font-src 'self' data:; "  # Allow fonts from same origin and data URIs
            "connect-src 'self' https://*.supabase.co; "  # Allow API calls to Supabase
            "frame-ancestors 'none'; "  # Prevent framing (same as X-Frame-Options: DENY)
            "base-uri 'self'; "  # Restrict base tag URLs
            "form-action 'self'; "  # Restrict form submissions
            "upgrade-insecure-requests"  # Upgrade HTTP to HTTPS
        )
        response.headers["Content-Security-Policy"] = csp

        # Strict Transport Security (HSTS)
        # Force HTTPS connections for 1 year
        response.headers["Strict-Transport-Security"] = (
            "max-age=31536000; includeSubDomains; preload"
        )

        # X-Content-Type-Options
        # Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # X-Frame-Options
        # Prevent clickjacking attacks
        response.headers["X-Frame-Options"] = "DENY"

        # X-XSS-Protection (legacy, but still useful for older browsers)
        # Enable XSS filtering
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Referrer-Policy
        # Control referrer information
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Permissions-Policy (formerly Feature-Policy)
        # Restrict browser features
        permissions_policy = (
            "geolocation=(), "
            "microphone=(), "
            "camera=(), "
            "payment=(), "
            "usb=(), "
            "magnetometer=(), "
            "gyroscope=(), "
            "accelerometer=()"
        )
        response.headers["Permissions-Policy"] = permissions_policy

        # Remove server header (hide server information)
        if "server" in response.headers:
            del response.headers["server"]
        if "x-powered-by" in response.headers:
            del response.headers["x-powered-by"]

        return response

