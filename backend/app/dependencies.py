from fastapi import Depends, HTTPException, status, Header, Request
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import User
from app.utils.supabase_jwt import get_user_id_from_token, verify_supabase_token
from app.utils.security_logger import (
    log_auth_success,
    log_auth_failure,
    log_auth_token_expired,
    log_auth_token_invalid,
)
from sqlalchemy import select


async def get_current_user(
    request: Request,
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Get current authenticated user from JWT token."""
    if not authorization:
        log_auth_failure(request, "Authorization header missing")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing"
        )
    
    try:
        user_id = get_user_id_from_token(authorization)
    except HTTPException as e:
        # Log authentication failure
        if "expired" in str(e.detail).lower():
            log_auth_token_expired(request)
        else:
            log_auth_token_invalid(request, str(e.detail))
        raise
    
    # Get or create user in database
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        # Create user if doesn't exist (first login)
        # Extract email and username from token if available
        try:
            payload = verify_supabase_token(authorization)
            email = payload.get("email", "")
            username = payload.get("user_metadata", {}).get("username") or payload.get("username")
            
            user = User(id=user_id, email=email, username=username, is_admin=False)
            db.add(user)
            await db.commit()
            await db.refresh(user)
            
            # Log successful authentication (new user)
            log_auth_success(request, user_id)
        except HTTPException as e:
            log_auth_token_invalid(request, str(e.detail))
            raise
    else:
        # Log successful authentication (existing user)
        log_auth_success(request, user_id)
    
    return user


async def get_current_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current user and verify admin status."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


def get_optional_user(
    authorization: Optional[str] = Header(None)
) -> Optional[str]:
    """Get user ID from token if present, otherwise return None."""
    if not authorization:
        return None
    try:
        return get_user_id_from_token(authorization)
    except HTTPException:
        return None

