"""
Query builder utilities for optimizing database queries.
Centralizes filter logic to avoid code duplication.
"""
from sqlalchemy import select, and_, or_, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from typing import Optional
from datetime import datetime, timezone, timedelta
from app.models import Listing, ListingStatus, User
from app.schemas import ListingFilters


def build_listing_filters_query(
    base_query,
    filters: ListingFilters,
    user_id: Optional[str] = None,
    is_admin: bool = False,
    include_expired_check: bool = True
):
    """
    Build a filtered query for listings.
    
    Args:
        base_query: SQLAlchemy select query to build upon
        filters: ListingFilters object containing filter criteria
        user_id: Optional user ID to filter by (for /my listings)
        is_admin: Whether the user is an admin (affects status filtering)
        include_expired_check: Whether to check for expired listings (public listings only)
    
    Returns:
        Modified query with all filters applied
    """
    # Filter by user if provided
    if user_id:
        base_query = base_query.where(Listing.user_id == user_id)
    
    # Apply status and expiration filters
    if user_id:
        # For user's own listings, optionally filter by status if provided
        if filters.status:
            base_query = base_query.where(Listing.status == filters.status)
    elif is_admin:
        # Admins can see all listings, optionally filtered by status
        if filters.status:
            base_query = base_query.where(Listing.status == filters.status)
    else:
        # Public listings: only approved and not expired
        now = datetime.now(timezone.utc)
        base_query = base_query.where(
            and_(
                Listing.status == ListingStatus.APPROVED,
                or_(
                    Listing.expires_at.is_(None),
                    Listing.expires_at > now
                )
            ) if include_expired_check else (Listing.status == ListingStatus.APPROVED)
        )
    
    # Apply search filter
    if filters.search:
        search_term = f"%{filters.search}%"
        base_query = base_query.where(
            or_(
                Listing.title.ilike(search_term),
                Listing.description.ilike(search_term)
            )
        )
    
    # Apply location filter
    if filters.city:
        base_query = base_query.where(Listing.city.ilike(f"%{filters.city}%"))
    
    # Apply category filter
    if filters.category:
        base_query = base_query.where(Listing.category == filters.category)
    
    # Apply price filters
    if filters.min_price is not None:
        base_query = base_query.where(Listing.price >= filters.min_price)
    
    if filters.max_price is not None:
        base_query = base_query.where(Listing.price <= filters.max_price)
    
    # Apply featured filter
    if filters.is_featured is not None:
        base_query = base_query.where(Listing.is_featured == filters.is_featured)
    
    # Apply listing type filter
    if filters.listing_type:
        base_query = base_query.where(Listing.listing_type == filters.listing_type)
    
    # Apply period filter
    if filters.period:
        now = datetime.now(timezone.utc)
        if filters.period == 'yesterday':
            yesterday_start = (now - timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
            yesterday_end = yesterday_start + timedelta(days=1)
            base_query = base_query.where(
                and_(
                    Listing.created_at >= yesterday_start,
                    Listing.created_at < yesterday_end
                )
            )
        elif filters.period == 'last_week':
            week_ago = now - timedelta(days=7)
            base_query = base_query.where(Listing.created_at >= week_ago)
        elif filters.period == 'last_month':
            month_ago = now - timedelta(days=30)
            base_query = base_query.where(Listing.created_at >= month_ago)
        # 'all' means no filter, so we don't add any condition
    
    return base_query


async def get_user_admin_status(
    db: AsyncSession,
    user_id: Optional[str]
) -> bool:
    """
    Get admin status for a user (optimized to avoid full User fetch).
    
    Args:
        db: Database session
        user_id: User ID to check
    
    Returns:
        True if user is admin, False otherwise
    """
    if not user_id:
        return False
    
    # Simple query - statement_cache_size=0 in connect_args handles pgbouncer
    result = await db.execute(select(User.is_admin).where(User.id == user_id))
    is_admin = result.scalar_one_or_none()
    return is_admin is True

