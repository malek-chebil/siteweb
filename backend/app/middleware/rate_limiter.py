"""
Rate Limiting Middleware for FastAPI.
Implements rate limiting to protect against abuse and DoS attacks.
"""

from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
from typing import Callable, Dict, Tuple
import time
from collections import defaultdict
from app.config import settings


class RateLimiterMiddleware(BaseHTTPMiddleware):
    """
    Rate limiting middleware using in-memory storage.
    For production, consider using Redis for distributed rate limiting.
    """

    def __init__(self, app: ASGIApp):
        super().__init__(app)
        # In-memory storage: {key: [(timestamp, count), ...]}
        self.requests: Dict[str, list] = defaultdict(list)
        # Cleanup old entries every N requests
        self.cleanup_counter = 0
        self.cleanup_interval = 1000

    def _get_client_identifier(self, request: Request) -> str:
        """
        Get client identifier for rate limiting.
        Uses IP address by default. Can be extended to use user ID for authenticated users.
        """
        # Get real IP (considering proxies)
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            # Take the first IP in the chain
            ip = forwarded_for.split(",")[0].strip()
        else:
            ip = request.client.host if request.client else "unknown"
        
        return ip

    def _cleanup_old_entries(self):
        """
        Clean up old rate limit entries to prevent memory leaks.
        """
        current_time = time.time()
        keys_to_remove = []
        
        for key, timestamps in self.requests.items():
            # Remove timestamps older than the rate limit window
            self.requests[key] = [
                ts for ts in timestamps
                if current_time - ts < settings.RATE_LIMIT_WINDOW
            ]
            
            # Remove empty entries
            if not self.requests[key]:
                keys_to_remove.append(key)
        
        for key in keys_to_remove:
            del self.requests[key]

    def _check_rate_limit(
        self,
        identifier: str,
        limit: int = None,
        window: int = None
    ) -> Tuple[bool, int, int]:
        """
        Check if request exceeds rate limit.
        Returns (allowed, remaining, reset_time)
        """
        if not settings.RATE_LIMIT_ENABLED:
            return True, limit or settings.RATE_LIMIT_REQUESTS, 0

        limit = limit or settings.RATE_LIMIT_REQUESTS
        window = window or settings.RATE_LIMIT_WINDOW
        current_time = time.time()

        # Get timestamps for this identifier
        timestamps = self.requests[identifier]

        # Remove timestamps outside the window
        timestamps = [
            ts for ts in timestamps
            if current_time - ts < window
        ]
        self.requests[identifier] = timestamps

        # Check if limit exceeded
        if len(timestamps) >= limit:
            # Calculate reset time (oldest timestamp + window)
            oldest_timestamp = min(timestamps) if timestamps else current_time
            reset_time = int(oldest_timestamp + window - current_time)
            return False, 0, reset_time

        # Add current request
        timestamps.append(current_time)
        self.requests[identifier] = timestamps

        # Calculate remaining requests
        remaining = max(0, limit - len(timestamps))
        reset_time = int(window - (current_time - min(timestamps)) if timestamps else window)

        return True, remaining, reset_time

    def _get_rate_limit_for_endpoint(self, path: str) -> Tuple[int, int]:
        """
        Get rate limit configuration for specific endpoint.
        Returns (limit, window) tuple.
        """
        # Stricter limits for authentication endpoints
        if "/api/v1/auth" in path or "/api/v1/users" in path:
            return 10, 60  # 10 requests per minute

        # Stricter limits for admin endpoints
        if "/api/v1/admin" in path:
            return 50, 60  # 50 requests per minute

        # Default limits
        return settings.RATE_LIMIT_REQUESTS, settings.RATE_LIMIT_WINDOW

    async def dispatch(self, request: Request, call_next: Callable):
        """
        Check rate limit before processing request.
        """
        # Skip rate limiting for health checks
        if request.url.path in ["/health", "/"]:
            return await call_next(request)

        # Get client identifier
        identifier = self._get_client_identifier(request)

        # Get rate limit configuration for endpoint
        limit, window = self._get_rate_limit_for_endpoint(request.url.path)

        # Check rate limit
        allowed, remaining, reset_time = self._check_rate_limit(
            identifier, limit, window
        )

        if not allowed:
            # Rate limit exceeded - log security event
            from fastapi.responses import JSONResponse
            from app.utils.security_logger import log_rate_limit_exceeded
            
            # Log rate limit violation
            log_rate_limit_exceeded(
                request=request,
                ip_address=identifier,
                limit=limit,
                window=window
            )
            
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "detail": f"Rate limit exceeded. Try again in {reset_time} seconds."
                },
                headers={
                    "X-RateLimit-Limit": str(limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(int(time.time()) + reset_time),
                    "Retry-After": str(reset_time),
                },
            )

        # Process request
        response = await call_next(request)

        # Add rate limit headers to response
        response.headers["X-RateLimit-Limit"] = str(limit)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Reset"] = str(int(time.time()) + reset_time)

        # Periodic cleanup
        self.cleanup_counter += 1
        if self.cleanup_counter >= self.cleanup_interval:
            self._cleanup_old_entries()
            self.cleanup_counter = 0

        return response

