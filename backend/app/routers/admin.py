from fastapi import APIRouter, Depends, HTTPException, status, Query, Body, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_, cast, Date
from sqlalchemy.orm import selectinload
from typing import Optional, List
from datetime import datetime, timezone, timedelta
from app.database import get_db
from app.models import Listing, ListingStatus, ModerationLog, User
from app.schemas import (
    ListingListResponse,
    ListingResponse,
    ApproveListingRequest,
    RejectListingRequest,
    ModerationLogResponse,
    ListingFilters,
)
from app.dependencies import get_current_admin_user
from app.models import User as UserModel
from app.utils.security_logger import log_admin_action
from pydantic import BaseModel

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/listings/mark-expired")
async def mark_expired_listings(
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_admin_user),
):
    """Mark listings as expired if their expiration date has passed."""
    now = datetime.now(timezone.utc)
    
    # Find all approved listings that have expired
    result = await db.execute(
        select(Listing).where(
            and_(
                Listing.status == ListingStatus.APPROVED,
                Listing.expires_at.isnot(None),
                Listing.expires_at <= now
            )
        )
    )
    expired_listings = result.scalars().all()
    
    # Update status to EXPIRED
    count = 0
    for listing in expired_listings:
        listing.status = ListingStatus.EXPIRED
        count += 1
    
    await db.commit()
    
    return {
        "message": f"Marked {count} listing(s) as expired",
        "count": count
    }


@router.get("/listings", response_model=ListingListResponse)
async def get_admin_listings(
    status_filter: Optional[ListingStatus] = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_admin_user),
):
    """Get listings for admin moderation."""
    filters = ListingFilters(
        status=status_filter,
        page=page,
        page_size=page_size,
    )
    
    query = select(Listing)
    
    if filters.status:
        query = query.where(Listing.status == filters.status)
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()
    
    # Apply pagination
    query = query.order_by(Listing.created_at.asc())  # Oldest first for moderation
    query = query.offset((filters.page - 1) * filters.page_size)
    query = query.limit(filters.page_size)
    
    # Execute query with eager loading
    result = await db.execute(
        query.options(selectinload(Listing.media), selectinload(Listing.user))
    )
    listings = result.scalars().unique().all()
    
    total_pages = (total + filters.page_size - 1) // filters.page_size
    
    return ListingListResponse(
        items=listings,
        total=total,
        page=filters.page,
        page_size=filters.page_size,
        total_pages=total_pages,
    )


@router.post("/listings/{listing_id}/approve", response_model=ListingResponse)
async def approve_listing(
    listing_id: int,
    request: ApproveListingRequest,
    http_request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_admin_user),
):
    """Approve a listing."""
    result = await db.execute(
        select(Listing).where(Listing.id == listing_id)
    )
    listing = result.scalar_one_or_none()
    
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    
    listing.status = ListingStatus.APPROVED
    
    # Set expiration date if provided
    if request.expires_at:
        listing.expires_at = request.expires_at
    
    # Set featured status if provided
    if request.is_featured is not None:
        listing.is_featured = request.is_featured
    
    # Create moderation log
    log = ModerationLog(
        listing_id=listing.id,
        action="approve",
        reason=request.reason,
        moderator_id=current_user.id,
    )
    db.add(log)
    
    await db.commit()
    
    # Log admin action
    log_admin_action(
        request=http_request,
        user_id=current_user.id,
        action="approve_listing",
        details={
            "listing_id": listing_id,
            "reason": request.reason,
            "expires_at": request.expires_at.isoformat() if request.expires_at else None,
            "is_featured": request.is_featured,
        }
    )
    
    # Reload listing with relationships eagerly loaded
    result = await db.execute(
        select(Listing)
        .options(selectinload(Listing.media), selectinload(Listing.user))
        .where(Listing.id == listing.id)
    )
    listing = result.scalar_one()
    
    return listing


@router.patch("/listings/{listing_id}/premium", response_model=ListingResponse)
async def toggle_premium_listing(
    listing_id: int,
    is_featured: bool = Query(...),
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_admin_user),
):
    """Toggle premium status of an approved listing."""
    result = await db.execute(
        select(Listing).where(Listing.id == listing_id)
    )
    listing = result.scalar_one_or_none()
    
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    
    if listing.status != ListingStatus.APPROVED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only change premium status for approved listings"
        )
    
    listing.is_featured = is_featured
    
    await db.commit()
    
    # Reload listing with relationships eagerly loaded
    result = await db.execute(
        select(Listing)
        .options(selectinload(Listing.media), selectinload(Listing.user))
        .where(Listing.id == listing.id)
    )
    listing = result.scalar_one()
    
    return listing


@router.patch("/listings/{listing_id}/expiration", response_model=ListingResponse)
async def update_listing_expiration(
    listing_id: int,
    request_data: dict = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_admin_user),
):
    """Update the expiration date of an approved listing."""
    result = await db.execute(
        select(Listing).where(Listing.id == listing_id)
    )
    listing = result.scalar_one_or_none()
    
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    
    if listing.status != ListingStatus.APPROVED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only approved listings can have their expiration date updated"
        )
    
    # Parse expires_at from request body
    expires_at_str = request_data.get('expires_at')
    if expires_at_str:
        # Parse ISO format datetime string
        listing.expires_at = datetime.fromisoformat(expires_at_str.replace('Z', '+00:00'))
    else:
        listing.expires_at = None
    
    await db.commit()
    
    # Reload listing with relationships eagerly loaded
    result = await db.execute(
        select(Listing)
        .options(selectinload(Listing.media), selectinload(Listing.user))
        .where(Listing.id == listing.id)
    )
    listing = result.scalar_one()
    
    return listing


@router.post("/listings/{listing_id}/reject", response_model=ListingResponse)
async def reject_listing(
    listing_id: int,
    request: RejectListingRequest,
    http_request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_admin_user),
):
    """Reject a listing."""
    result = await db.execute(
        select(Listing).where(Listing.id == listing_id)
    )
    listing = result.scalar_one_or_none()
    
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    
    listing.status = ListingStatus.REJECTED
    
    # Create moderation log
    log = ModerationLog(
        listing_id=listing.id,
        action="reject",
        reason=request.reason,
        moderator_id=current_user.id,
    )
    db.add(log)
    
    await db.commit()
    
    # Log admin action
    log_admin_action(
        request=http_request,
        user_id=current_user.id,
        action="reject_listing",
        details={
            "listing_id": listing_id,
            "reason": request.reason,
        }
    )
    
    # Reload listing with relationships eagerly loaded
    result = await db.execute(
        select(Listing)
        .options(selectinload(Listing.media), selectinload(Listing.user))
        .where(Listing.id == listing.id)
    )
    listing = result.scalar_one()
    
    return listing


@router.get("/listings/{listing_id}/logs", response_model=list[ModerationLogResponse])
async def get_listing_moderation_logs(
    listing_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_admin_user),
):
    """Get moderation logs for a listing."""
    result = await db.execute(
        select(ModerationLog)
        .where(ModerationLog.listing_id == listing_id)
        .order_by(ModerationLog.created_at.desc())
    )
    logs = result.scalars().all()
    
    return logs


@router.get("/stats")
async def get_admin_stats(
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_admin_user),
):
    """Get admin dashboard statistics - OPTIMIZED with single query."""
    # OPTIMIZED: Single query with GROUP BY instead of 4 separate queries
    from sqlalchemy import case
    
    # Get listing counts by status in one query
    stats_query = select(
        func.sum(case((Listing.status == ListingStatus.PENDING, 1), else_=0)).label("pending"),
        func.sum(case((Listing.status == ListingStatus.APPROVED, 1), else_=0)).label("approved"),
        func.sum(case((Listing.status == ListingStatus.REJECTED, 1), else_=0)).label("rejected"),
        func.sum(case((Listing.status == ListingStatus.EXPIRED, 1), else_=0)).label("expired"),
        func.count(Listing.id).label("total_listings"),
        func.sum(Listing.views_count).label("total_views"),
        func.avg(Listing.views_count).label("avg_views"),
    )
    stats_result = await db.execute(stats_query)
    stats = stats_result.first()
    
    # Get total users count
    total_users = await db.execute(select(func.count(User.id)))
    
    # Get most viewed listing with user relationship
    most_viewed_query = select(Listing).where(
        Listing.status == ListingStatus.APPROVED
    ).options(
        selectinload(Listing.user)
    ).order_by(Listing.views_count.desc()).limit(1)
    most_viewed_result = await db.execute(most_viewed_query)
    most_viewed = most_viewed_result.scalar_one_or_none()
    
    return {
        "pending_listings": stats.pending or 0,
        "approved_listings": stats.approved or 0,
        "rejected_listings": stats.rejected or 0,
        "expired_listings": stats.expired or 0,
        "total_users": total_users.scalar_one(),
        "total_listings": stats.total_listings or 0,
        "total_views": int(stats.total_views or 0),
        "avg_views": float(stats.avg_views or 0),
        "most_viewed_listing": {
            "id": most_viewed.id if most_viewed else None,
            "title": most_viewed.title if most_viewed else None,
            "views_count": most_viewed.views_count if most_viewed else 0,
            "username": most_viewed.user.username if most_viewed and most_viewed.user else None,
            "user_email": most_viewed.user.email if most_viewed and most_viewed.user else None,
        } if most_viewed else None,
    }


@router.get("/stats/charts")
async def get_admin_charts(
    days: int = Query(30, ge=7, le=365, description="Number of days to retrieve data for"),
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_admin_user),
):
    """Get chart data for views and listings over time."""
    # Calculate date range
    end_date = datetime.now(timezone.utc)
    start_date = end_date - timedelta(days=days)
    
    # Get views over time (grouped by creation date of listings)
    # Since we don't track views per day, we'll use the listing creation date
    # and sum views_count for listings created on each day
    views_query = select(
        cast(Listing.created_at, Date).label("date"),
        func.sum(Listing.views_count).label("total_views"),
    ).where(
        Listing.created_at >= start_date
    ).group_by(
        cast(Listing.created_at, Date)
    ).order_by(
        cast(Listing.created_at, Date)
    )
    
    views_result = await db.execute(views_query)
    views_data = views_result.all()
    
    # Get listings count over time (grouped by creation date)
    listings_query = select(
        cast(Listing.created_at, Date).label("date"),
        func.count(Listing.id).label("count"),
    ).where(
        Listing.created_at >= start_date
    ).group_by(
        cast(Listing.created_at, Date)
    ).order_by(
        cast(Listing.created_at, Date)
    )
    
    listings_result = await db.execute(listings_query)
    listings_data = listings_result.all()
    
    # Format data for charts
    views_chart = [
        {
            "date": row.date.isoformat() if row.date else None,
            "views": int(row.total_views or 0),
        }
        for row in views_data
    ]
    
    listings_chart = [
        {
            "date": row.date.isoformat() if row.date else None,
            "count": int(row.count or 0),
        }
        for row in listings_data
    ]
    
    return {
        "views_over_time": views_chart,
        "listings_over_time": listings_chart,
        "period_days": days,
    }


class UserListingStats(BaseModel):
    pending: int = 0
    approved: int = 0
    rejected: int = 0
    expired: int = 0
    total: int = 0


class UserResponse(BaseModel):
    id: str
    email: str
    username: Optional[str] = None
    is_admin: bool
    created_at: str
    listings_count: UserListingStats

    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    items: List[UserResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


@router.get("/users", response_model=UserListResponse)
async def get_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_admin_user),
):
    """Get all users with their listings statistics."""
    # Get total count
    total_result = await db.execute(select(func.count(User.id)))
    total = total_result.scalar_one()
    
    # Get paginated users
    query = select(User).order_by(User.created_at.desc())
    query = query.offset((page - 1) * page_size)
    query = query.limit(page_size)
    
    result = await db.execute(query)
    users = result.scalars().unique().all()
    
    # OPTIMIZED: Batch query for all user stats instead of N+1 queries
    from sqlalchemy import case
    
    user_ids = [user.id for user in users]
    
    # Single query to get all stats for all users
    stats_query = select(
        Listing.user_id,
        func.sum(case((Listing.status == ListingStatus.PENDING, 1), else_=0)).label("pending"),
        func.sum(case((Listing.status == ListingStatus.APPROVED, 1), else_=0)).label("approved"),
        func.sum(case((Listing.status == ListingStatus.REJECTED, 1), else_=0)).label("rejected"),
        func.sum(case((Listing.status == ListingStatus.EXPIRED, 1), else_=0)).label("expired"),
        func.count(Listing.id).label("total"),
    ).where(
        Listing.user_id.in_(user_ids)
    ).group_by(Listing.user_id)
    
    stats_result = await db.execute(stats_query)
    stats_dict = {row.user_id: row for row in stats_result.all()}
    
    # Build user responses with cached stats
    user_responses = []
    for user in users:
        user_stats = stats_dict.get(user.id)
        stats = UserListingStats(
            pending=user_stats.pending if user_stats else 0,
            approved=user_stats.approved if user_stats else 0,
            rejected=user_stats.rejected if user_stats else 0,
            expired=user_stats.expired if user_stats else 0,
            total=user_stats.total if user_stats else 0,
        )
        
        user_responses.append(
            UserResponse(
                id=user.id,
                email=user.email,
                username=user.username,
                is_admin=user.is_admin,
                created_at=user.created_at.isoformat(),
                listings_count=stats,
            )
        )
    
    total_pages = (total + page_size - 1) // page_size
    
    return UserListResponse(
        items=user_responses,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/users/{user_id}", response_model=dict)
async def get_user_details(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_admin_user),
):
    """Get detailed user information including all listings."""
    # Get user
    user_result = await db.execute(select(User).where(User.id == user_id))
    user = user_result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get all listings for this user with eager loading
    listings_result = await db.execute(
        select(Listing)
        .where(Listing.user_id == user_id)
        .options(selectinload(Listing.media))
        .order_by(Listing.created_at.desc())
    )
    listings = listings_result.scalars().unique().all()
    
    # Format listings
    listings_data = []
    for listing in listings:
        listings_data.append({
            "id": listing.id,
            "title": listing.title,
            "description": listing.description,
            "city": listing.city,
            "category": listing.category,
            "price": listing.price,
            "status": listing.status.value,
            "created_at": listing.created_at.isoformat(),
            "expires_at": listing.expires_at.isoformat() if listing.expires_at else None,
            "views_count": listing.views_count,
            "media_count": len(listing.media),
        })
    
    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "is_admin": user.is_admin,
            "created_at": user.created_at.isoformat(),
        },
        "listings": listings_data,
        "statistics": {
            "total_listings": len(listings),
            "pending": len([l for l in listings if l.status == ListingStatus.PENDING]),
            "approved": len([l for l in listings if l.status == ListingStatus.APPROVED]),
            "rejected": len([l for l in listings if l.status == ListingStatus.REJECTED]),
            "expired": len([l for l in listings if l.status == ListingStatus.EXPIRED]),
        }
    }

