from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models import User, Listing, ListingStatus
from app.schemas import UserUpdate, UserResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update current user's profile (username)."""
    if user_data.username:
        # Check if username is already taken by another user
        existing_user = await db.execute(
            select(User).where(
                User.username == user_data.username,
                User.id != current_user.id
            )
        )
        if existing_user.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        
        current_user.username = user_data.username
    
    await db.commit()
    await db.refresh(current_user)
    
    return current_user


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user),
):
    """Get current user's profile."""
    return current_user


@router.get("/me/stats")
async def get_user_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get current user's profile with listing statistics - OPTIMIZED with single query."""
    # OPTIMIZED: Single query with GROUP BY instead of 4 separate queries
    from sqlalchemy import case
    
    stats_query = select(
        func.sum(case((Listing.status == ListingStatus.PENDING, 1), else_=0)).label("pending"),
        func.sum(case((Listing.status == ListingStatus.APPROVED, 1), else_=0)).label("approved"),
        func.sum(case((Listing.status == ListingStatus.REJECTED, 1), else_=0)).label("rejected"),
        func.sum(case((Listing.status == ListingStatus.EXPIRED, 1), else_=0)).label("expired"),
        func.count(Listing.id).label("total"),
    ).where(Listing.user_id == current_user.id)
    
    stats_result = await db.execute(stats_query)
    stats = stats_result.first()
    
    return {
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "username": current_user.username,
            "is_admin": current_user.is_admin,
            "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
        },
        "stats": {
            "total_listings": stats.total or 0,
            "pending": stats.pending or 0,
            "approved": stats.approved or 0,
            "rejected": stats.rejected or 0,
            "expired": stats.expired or 0,
        }
    }

