import jwt
from typing import Optional
from fastapi import HTTPException, status
from app.config import settings


def verify_supabase_token(token: str) -> dict:
    """
    Verify and decode Supabase JWT token.
    Returns the payload if valid, raises HTTPException if invalid.
    """
    try:
        # Remove 'Bearer ' prefix if present
        if token.startswith("Bearer "):
            token = token[7:]
        
        # Decode JWT using Supabase JWT secret
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )


def get_user_id_from_token(token: str) -> str:
    """Extract user ID from Supabase JWT token."""
    payload = verify_supabase_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing user ID"
        )
    return user_id

