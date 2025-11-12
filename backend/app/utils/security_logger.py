"""
Security Logging Utilities.
Logs security-related events for monitoring and audit purposes.
"""

import logging
import json
import os
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from fastapi import Request
from app.config import settings


# Configure security logger
security_logger = logging.getLogger("security")
security_logger.setLevel(logging.INFO)

# Create logs directory if it doesn't exist
# Get the backend directory (parent of app directory)
try:
    # Calculate the backend directory path
    # __file__ is: backend/app/utils/security_logger.py
    # We need: backend/logs/
    current_file = os.path.abspath(__file__)
    backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(current_file)))
    logs_dir = os.path.join(backend_dir, "logs")
    
    # Create logs directory
    os.makedirs(logs_dir, exist_ok=True)
except Exception as e:
    # If directory creation fails, we'll handle it in the handler creation
    logs_dir = "logs"  # Fallback to relative path
    try:
        os.makedirs(logs_dir, exist_ok=True)
    except Exception:
        pass  # Will use console handler as fallback

# Create file handler for security logs
if not security_logger.handlers:
    log_file = os.path.join(logs_dir, "security.log")
    try:
        handler = logging.FileHandler(log_file)
        handler.setLevel(logging.INFO)
        
        # Create formatter
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        handler.setFormatter(formatter)
        security_logger.addHandler(handler)
    except (OSError, IOError) as e:
        # Fallback to console handler if file handler fails
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        console_handler.setFormatter(formatter)
        security_logger.addHandler(console_handler)
        security_logger.warning(f"Failed to create file handler for security logs: {e}. Using console handler instead.")


class SecurityEvent:
    """Security event types."""
    AUTH_SUCCESS = "auth_success"
    AUTH_FAILURE = "auth_failure"
    AUTH_TOKEN_EXPIRED = "auth_token_expired"
    AUTH_TOKEN_INVALID = "auth_token_invalid"
    ADMIN_ACTION = "admin_action"
    RATE_LIMIT_EXCEEDED = "rate_limit_exceeded"
    FILE_UPLOAD = "file_upload"
    FILE_UPLOAD_REJECTED = "file_upload_rejected"
    SUSPICIOUS_ACTIVITY = "suspicious_activity"
    DATA_ACCESS = "data_access"
    SECURITY_ERROR = "security_error"
    CSRF_ATTEMPT = "csrf_attempt"
    SQL_INJECTION_ATTEMPT = "sql_injection_attempt"
    XSS_ATTEMPT = "xss_attempt"
    DIRECTORY_TRAVERSAL_ATTEMPT = "directory_traversal_attempt"


def get_client_ip(request: Request) -> str:
    """
    Get client IP address from request.
    Considers X-Forwarded-For header for proxy/load balancer scenarios.
    """
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        # Take the first IP in the chain
        ip = forwarded_for.split(",")[0].strip()
    else:
        ip = request.client.host if request.client else "unknown"
    
    return ip


def get_user_agent(request: Request) -> str:
    """Get user agent from request."""
    return request.headers.get("User-Agent", "unknown")


def log_security_event(
    event_type: str,
    message: str,
    request: Optional[Request] = None,
    user_id: Optional[str] = None,
    details: Optional[Dict[str, Any]] = None,
    severity: str = "INFO"
):
    """
    Log a security event.
    
    Args:
        event_type: Type of security event (from SecurityEvent)
        message: Event message
        request: FastAPI request object (optional)
        user_id: User ID (optional)
        details: Additional details (optional)
        severity: Log severity (INFO, WARNING, ERROR, CRITICAL)
    """
    event_data = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "event_type": event_type,
        "message": message,
        "severity": severity,
    }
    
    # Add request information
    if request:
        event_data["ip_address"] = get_client_ip(request)
        event_data["user_agent"] = get_user_agent(request)
        event_data["method"] = request.method
        event_data["path"] = request.url.path
        event_data["query_params"] = str(request.query_params)
    
    # Add user information
    if user_id:
        event_data["user_id"] = user_id
    
    # Add additional details
    if details:
        event_data["details"] = details
    
    # Log event
    log_message = json.dumps(event_data, default=str)
    
    if severity == "CRITICAL":
        security_logger.critical(log_message)
    elif severity == "ERROR":
        security_logger.error(log_message)
    elif severity == "WARNING":
        security_logger.warning(log_message)
    else:
        security_logger.info(log_message)
    
    # Monitor security event for alerting
    try:
        from app.utils.monitoring import monitor_security_event
        monitor_security_event(event_type, event_data)
    except Exception as e:
        # Don't fail if monitoring is not available
        security_logger.warning(f"Failed to monitor security event: {e}")


def log_auth_success(request: Request, user_id: str):
    """Log successful authentication."""
    log_security_event(
        event_type=SecurityEvent.AUTH_SUCCESS,
        message=f"User {user_id} authenticated successfully",
        request=request,
        user_id=user_id,
        severity="INFO"
    )


def log_auth_failure(request: Request, reason: str, user_id: Optional[str] = None):
    """Log failed authentication."""
    log_security_event(
        event_type=SecurityEvent.AUTH_FAILURE,
        message=f"Authentication failed: {reason}",
        request=request,
        user_id=user_id,
        details={"reason": reason},
        severity="WARNING"
    )


def log_auth_token_expired(request: Request, user_id: Optional[str] = None):
    """Log expired authentication token."""
    log_security_event(
        event_type=SecurityEvent.AUTH_TOKEN_EXPIRED,
        message="Authentication token expired",
        request=request,
        user_id=user_id,
        severity="WARNING"
    )


def log_auth_token_invalid(request: Request, reason: str):
    """Log invalid authentication token."""
    log_security_event(
        event_type=SecurityEvent.AUTH_TOKEN_INVALID,
        message=f"Invalid authentication token: {reason}",
        request=request,
        details={"reason": reason},
        severity="WARNING"
    )


def log_admin_action(request: Request, user_id: str, action: str, details: Optional[Dict[str, Any]] = None):
    """Log admin action."""
    log_security_event(
        event_type=SecurityEvent.ADMIN_ACTION,
        message=f"Admin {user_id} performed action: {action}",
        request=request,
        user_id=user_id,
        details={"action": action, **(details or {})},
        severity="INFO"
    )


def log_rate_limit_exceeded(request: Request, ip_address: str, limit: int, window: int):
    """Log rate limit exceeded."""
    log_security_event(
        event_type=SecurityEvent.RATE_LIMIT_EXCEEDED,
        message=f"Rate limit exceeded for IP {ip_address}",
        request=request,
        details={
            "ip_address": ip_address,
            "limit": limit,
            "window": window,
        },
        severity="WARNING"
    )


def log_file_upload(request: Request, user_id: str, filename: str, file_size: int, success: bool = True):
    """Log file upload."""
    event_type = SecurityEvent.FILE_UPLOAD if success else SecurityEvent.FILE_UPLOAD_REJECTED
    message = f"File upload {'success' if success else 'rejected'}: {filename}"
    
    log_security_event(
        event_type=event_type,
        message=message,
        request=request,
        user_id=user_id,
        details={
            "filename": filename,
            "file_size": file_size,
            "success": success,
        },
        severity="INFO" if success else "WARNING"
    )


def log_suspicious_activity(request: Request, activity_type: str, details: Optional[Dict[str, Any]] = None):
    """Log suspicious activity."""
    log_security_event(
        event_type=SecurityEvent.SUSPICIOUS_ACTIVITY,
        message=f"Suspicious activity detected: {activity_type}",
        request=request,
        details={"activity_type": activity_type, **(details or {})},
        severity="WARNING"
    )


def log_data_access(request: Request, user_id: str, resource_type: str, resource_id: str, action: str):
    """Log data access."""
    log_security_event(
        event_type=SecurityEvent.DATA_ACCESS,
        message=f"User {user_id} accessed {resource_type} {resource_id}",
        request=request,
        user_id=user_id,
        details={
            "resource_type": resource_type,
            "resource_id": resource_id,
            "action": action,
        },
        severity="INFO"
    )


def log_security_error(request: Request, error_type: str, error_message: str, details: Optional[Dict[str, Any]] = None):
    """Log security error."""
    log_security_event(
        event_type=SecurityEvent.SECURITY_ERROR,
        message=f"Security error: {error_type} - {error_message}",
        request=request,
        details={"error_type": error_type, "error_message": error_message, **(details or {})},
        severity="ERROR"
    )


def log_csrf_attempt(request: Request, details: Optional[Dict[str, Any]] = None):
    """Log CSRF attempt."""
    log_security_event(
        event_type=SecurityEvent.CSRF_ATTEMPT,
        message="CSRF attack attempt detected",
        request=request,
        details=details,
        severity="WARNING"
    )


def log_sql_injection_attempt(request: Request, payload: str):
    """Log SQL injection attempt."""
    log_security_event(
        event_type=SecurityEvent.SQL_INJECTION_ATTEMPT,
        message=f"SQL injection attempt detected: {payload[:100]}",
        request=request,
        details={"payload": payload[:100]},  # Limit payload length
        severity="WARNING"
    )


def log_xss_attempt(request: Request, payload: str):
    """Log XSS attempt."""
    log_security_event(
        event_type=SecurityEvent.XSS_ATTEMPT,
        message=f"XSS attempt detected: {payload[:100]}",
        request=request,
        details={"payload": payload[:100]},  # Limit payload length
        severity="WARNING"
    )


def log_directory_traversal_attempt(request: Request, filename: str):
    """Log directory traversal attempt."""
    log_security_event(
        event_type=SecurityEvent.DIRECTORY_TRAVERSAL_ATTEMPT,
        message=f"Directory traversal attempt detected: {filename}",
        request=request,
        details={"filename": filename},
        severity="WARNING"
    )

