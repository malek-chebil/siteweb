from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_, func
from sqlalchemy.orm import selectinload
from typing import Optional
from datetime import datetime, timezone, timedelta
from app.database import get_db
from app.models import Listing, ListingMedia, ListingStatus, User
from app.schemas import (
    ListingCreate,
    ListingUpdate,
    ListingResponse,
    ListingListResponse,
    ListingFilters,
)
from app.dependencies import get_current_user, get_optional_user

router = APIRouter(prefix="/listings", tags=["listings"])


@router.get("/my", response_model=ListingListResponse)
async def get_my_listings(
    filters: ListingFilters = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get current user's listings only."""
    # Only show listings belonging to the current user
    query = select(Listing).where(Listing.user_id == current_user.id)
    
    # Apply filters (but user_id filter is already applied above)
    if filters.city:
        query = query.where(Listing.city.ilike(f"%{filters.city}%"))
    
    if filters.category:
        query = query.where(Listing.category == filters.category)
    
    if filters.min_price is not None:
        query = query.where(Listing.price >= filters.min_price)
    
    if filters.max_price is not None:
        query = query.where(Listing.price <= filters.max_price)
    
    if filters.search:
        search_term = f"%{filters.search}%"
        query = query.where(
            or_(
                Listing.title.ilike(search_term),
                Listing.description.ilike(search_term)
            )
        )
    
    # Filter by period (based on created_at)
    if filters.period:
        now = datetime.now(timezone.utc)
        if filters.period == 'yesterday':
            yesterday_start = (now - timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
            yesterday_end = yesterday_start + timedelta(days=1)
            query = query.where(
                and_(
                    Listing.created_at >= yesterday_start,
                    Listing.created_at < yesterday_end
                )
            )
        elif filters.period == 'last_week':
            week_ago = now - timedelta(days=7)
            query = query.where(Listing.created_at >= week_ago)
        elif filters.period == 'last_month':
            month_ago = now - timedelta(days=30)
            query = query.where(Listing.created_at >= month_ago)
        # 'all' means no filter, so we don't add any condition
    
    # Optionally filter by status (user can see all their listings regardless of status)
    if filters.status:
        query = query.where(Listing.status == filters.status)
    
    # OPTIMIZED: Use direct COUNT instead of subquery for better performance
    count_query = select(func.count(Listing.id))
    # Apply same filters to count query (user_id is already filtered above)
    count_query = count_query.where(Listing.user_id == current_user.id)
    if filters.city:
        count_query = count_query.where(Listing.city.ilike(f"%{filters.city}%"))
    if filters.category:
        count_query = count_query.where(Listing.category == filters.category)
    if filters.min_price is not None:
        count_query = count_query.where(Listing.price >= filters.min_price)
    if filters.max_price is not None:
        count_query = count_query.where(Listing.price <= filters.max_price)
    if filters.search:
        search_term = f"%{filters.search}%"
        count_query = count_query.where(
            or_(
                Listing.title.ilike(search_term),
                Listing.description.ilike(search_term)
            )
        )
    
    # Filter by period (based on created_at) for count query
    if filters.period:
        now = datetime.now(timezone.utc)
        if filters.period == 'yesterday':
            yesterday_start = (now - timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
            yesterday_end = yesterday_start + timedelta(days=1)
            count_query = count_query.where(
                and_(
                    Listing.created_at >= yesterday_start,
                    Listing.created_at < yesterday_end
                )
            )
        elif filters.period == 'last_week':
            week_ago = now - timedelta(days=7)
            count_query = count_query.where(Listing.created_at >= week_ago)
        elif filters.period == 'last_month':
            month_ago = now - timedelta(days=30)
            count_query = count_query.where(Listing.created_at >= month_ago)
        # 'all' means no filter, so we don't add any condition
    
    if filters.status:
        count_query = count_query.where(Listing.status == filters.status)
    
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()
    
    # Apply ordering, relationships, and pagination
    fetch_query = (
        query.options(
            selectinload(Listing.media),
            selectinload(Listing.user),
        )
        .order_by(Listing.is_featured.desc(), Listing.created_at.desc())
        .offset((filters.page - 1) * filters.page_size)
        .limit(filters.page_size)
    )
    
    # Execute query
    result = await db.execute(fetch_query)
    listings = result.scalars().unique().all()
    
    total_pages = (total + filters.page_size - 1) // filters.page_size
    
    return ListingListResponse(
        items=listings,
        total=total,
        page=filters.page,
        page_size=filters.page_size,
        total_pages=total_pages,
    )


@router.get("", response_model=ListingListResponse)
async def get_listings(
    filters: ListingFilters = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user_id: Optional[str] = Depends(get_optional_user),
):
    """Get listings with filtering, search, and pagination."""
    # Start building query - only show approved listings to non-admins
    query = select(Listing)
    
    # Check if user is admin (only if authenticated)
    is_admin = False
    if current_user_id:
        admin_check = await db.execute(
            select(User.is_admin).where(User.id == current_user_id)
        )
        is_admin = admin_check.scalar_one_or_none() or False
    
    if is_admin:
        # Admins can see all listings (filtered by status if provided)
        if filters.status:
            query = query.where(Listing.status == filters.status)
    else:
        # All users (authenticated or not) only see approved listings that are not expired
        # Users can see their own non-approved listings in /listings/my endpoint, not here
        now = datetime.now(timezone.utc)
        query = query.where(
            and_(
                Listing.status == ListingStatus.APPROVED,
                or_(
                    Listing.expires_at.is_(None),
                    Listing.expires_at > now
                )
            )
        )
    
    # Apply filters
    if filters.city:
        query = query.where(Listing.city.ilike(f"%{filters.city}%"))
    
    if filters.category:
        query = query.where(Listing.category == filters.category)
    
    if filters.min_price is not None:
        query = query.where(Listing.price >= filters.min_price)
    
    if filters.max_price is not None:
        query = query.where(Listing.price <= filters.max_price)
    
    if filters.is_featured is not None:
        query = query.where(Listing.is_featured == filters.is_featured)
    
    # Filter by period (based on created_at)
    if filters.period:
        now = datetime.now(timezone.utc)
        if filters.period == 'yesterday':
            yesterday_start = (now - timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
            yesterday_end = yesterday_start + timedelta(days=1)
            query = query.where(
                and_(
                    Listing.created_at >= yesterday_start,
                    Listing.created_at < yesterday_end
                )
            )
        elif filters.period == 'last_week':
            week_ago = now - timedelta(days=7)
            query = query.where(Listing.created_at >= week_ago)
        elif filters.period == 'last_month':
            month_ago = now - timedelta(days=30)
            query = query.where(Listing.created_at >= month_ago)
        # 'all' means no filter, so we don't add any condition
    
    if filters.search:
        search_term = f"%{filters.search}%"
        query = query.where(
            or_(
                Listing.title.ilike(search_term),
                Listing.description.ilike(search_term)
            )
        )
    
    # OPTIMIZED: Use direct COUNT instead of subquery for better performance
    count_query = select(func.count(Listing.id))
    # Apply same base filters to count query
    if is_admin:
        # Admins can see all listings (filtered by status if provided)
        if filters.status:
            count_query = count_query.where(Listing.status == filters.status)
    else:
        # All users (authenticated or not) only see approved listings that are not expired
        now = datetime.now(timezone.utc)
        count_query = count_query.where(
            and_(
                Listing.status == ListingStatus.APPROVED,
                or_(
                    Listing.expires_at.is_(None),
                    Listing.expires_at > now
                )
            )
        )
    
    # Apply same filters to count
    if filters.city:
        count_query = count_query.where(Listing.city.ilike(f"%{filters.city}%"))
    if filters.category:
        count_query = count_query.where(Listing.category == filters.category)
    if filters.min_price is not None:
        count_query = count_query.where(Listing.price >= filters.min_price)
    if filters.max_price is not None:
        count_query = count_query.where(Listing.price <= filters.max_price)
    if filters.is_featured is not None:
        count_query = count_query.where(Listing.is_featured == filters.is_featured)
    
    # Filter by period (based on created_at) for count query
    if filters.period:
        now = datetime.now(timezone.utc)
        if filters.period == 'yesterday':
            yesterday_start = (now - timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
            yesterday_end = yesterday_start + timedelta(days=1)
            count_query = count_query.where(
                and_(
                    Listing.created_at >= yesterday_start,
                    Listing.created_at < yesterday_end
                )
            )
        elif filters.period == 'last_week':
            week_ago = now - timedelta(days=7)
            count_query = count_query.where(Listing.created_at >= week_ago)
        elif filters.period == 'last_month':
            month_ago = now - timedelta(days=30)
            count_query = count_query.where(Listing.created_at >= month_ago)
        # 'all' means no filter, so we don't add any condition
    
    if filters.search:
        search_term = f"%{filters.search}%"
        count_query = count_query.where(
            or_(
                Listing.title.ilike(search_term),
                Listing.description.ilike(search_term)
            )
        )
    
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()
    
    # Apply ordering, relationships, and pagination
    fetch_query = (
        query.options(
            selectinload(Listing.media),
            selectinload(Listing.user),
        )
        .order_by(Listing.is_featured.desc(), Listing.created_at.desc())
        .offset((filters.page - 1) * filters.page_size)
        .limit(filters.page_size)
    )
    
    # Execute query
    result = await db.execute(fetch_query)
    listings = result.scalars().unique().all()
    
    total_pages = (total + filters.page_size - 1) // filters.page_size
    
    return ListingListResponse(
        items=listings,
        total=total,
        page=filters.page,
        page_size=filters.page_size,
        total_pages=total_pages,
    )


@router.get("/{listing_id}", response_model=ListingResponse)
async def get_listing(
    listing_id: int,
    db: AsyncSession = Depends(get_db),
    current_user_id: Optional[str] = Depends(get_optional_user),
):
    """Get a single listing by ID."""
    result = await db.execute(
        select(Listing)
        .options(
            selectinload(Listing.media),
            selectinload(Listing.user),
        )
        .where(Listing.id == listing_id)
    )
    listing = result.scalar_one_or_none()
    
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    
    # Check if user is admin (only if authenticated)
    is_admin = False
    if current_user_id:
        user_result = await db.execute(
            select(User.is_admin).where(User.id == current_user_id)
        )
        is_admin = user_result.scalar_one_or_none() or False
    
    # Only show approved and non-expired listings to non-owners/non-admins
    # Owners and admins can see their own/pending/rejected/expired listings
    is_owner = current_user_id and listing.user_id == current_user_id
    
    if not is_admin and not is_owner:
        # For non-owners and non-admins, only show approved and non-expired listings
        if listing.status != ListingStatus.APPROVED:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Listing not available"
            )
        
        # Check if listing is expired
        now = datetime.now(timezone.utc)
        if listing.expires_at and listing.expires_at <= now:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Listing has expired"
            )
    
    # OPTIMIZED: Increment view count only for approved, non-expired listings viewed by non-owners
    if listing.status == ListingStatus.APPROVED:
        now = datetime.now(timezone.utc)
        is_not_expired = not listing.expires_at or listing.expires_at > now
        if is_not_expired and (not current_user_id or listing.user_id != current_user_id):
            listing.views_count = (listing.views_count or 0) + 1
            await db.commit()
            # Reload listing with relationships eagerly loaded to avoid MissingGreenlet error
            # This ensures all attributes (including updated_at) are properly loaded
            result = await db.execute(
                select(Listing)
                .options(
                    selectinload(Listing.media),
                    selectinload(Listing.user),
                )
                .where(Listing.id == listing.id)
            )
            listing = result.scalar_one()
    
    return listing


@router.post("", response_model=ListingResponse, status_code=status.HTTP_201_CREATED)
async def create_listing(
    listing_data: ListingCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new listing."""
    # Create listing
    listing = Listing(
        title=listing_data.title,
        description=listing_data.description,
        city=listing_data.city,
        price=listing_data.price,
        phone=listing_data.phone,
        whatsapp=listing_data.whatsapp,
        category=listing_data.category,
        status=ListingStatus.PENDING,
        user_id=current_user.id,
        is_featured=listing_data.is_featured or False,
    )
    
    db.add(listing)
    await db.flush()
    
    # Add media
    if listing_data.media_urls:
        for media_url in listing_data.media_urls[:10]:  # Max 10 images
            media = ListingMedia(
                listing_id=listing.id,
                url=media_url,
            )
            db.add(media)
    
    await db.commit()
    
    # Reload listing with relationships eagerly loaded (required for async SQLAlchemy)
    # This avoids the MissingGreenlet error when accessing lazy-loaded relationships
    result = await db.execute(
        select(Listing)
        .options(selectinload(Listing.media), selectinload(Listing.user))
        .where(Listing.id == listing.id)
    )
    listing = result.scalar_one()
    
    return listing


@router.put("/{listing_id}", response_model=ListingResponse)
async def update_listing(
    listing_id: int,
    listing_data: ListingUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a listing (owner only)."""
    result = await db.execute(
        select(Listing).where(Listing.id == listing_id)
    )
    listing = result.scalar_one_or_none()
    
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    
    # Check ownership (or admin)
    if listing.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this listing"
        )
    
    # Prevent editing approved listings (unless admin)
    if listing.status == ListingStatus.APPROVED and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot edit approved listings. Please contact support if you need to make changes."
        )
    
    # Update fields
    update_data = listing_data.model_dump(exclude_unset=True, exclude={"media_urls"})
    for key, value in update_data.items():
        setattr(listing, key, value)
    
    # Update media if provided
    if listing_data.media_urls is not None:
        # Delete existing media
        result_media = await db.execute(
            select(ListingMedia).where(ListingMedia.listing_id == listing_id)
        )
        existing_media = result_media.scalars().all()
        for media in existing_media:
            await db.delete(media)
        
        await db.flush()  # Flush deletes before adding new ones
        
        # Add new media
        for media_url in listing_data.media_urls[:10]:
            media = ListingMedia(
                listing_id=listing.id,
                url=media_url,
            )
            db.add(media)
    
    await db.commit()
    
    # Reload listing with relationships eagerly loaded (required for async SQLAlchemy)
    # This avoids the MissingGreenlet error when accessing lazy-loaded relationships
    result = await db.execute(
        select(Listing)
        .options(selectinload(Listing.media), selectinload(Listing.user))
        .where(Listing.id == listing.id)
    )
    listing = result.scalar_one()
    
    return listing


@router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_listing(
    listing_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a listing (owner only)."""
    result = await db.execute(
        select(Listing).where(Listing.id == listing_id)
    )
    listing = result.scalar_one_or_none()
    
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    
    # Check ownership (or admin)
    if listing.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this listing"
        )
    
    await db.delete(listing)
    await db.commit()
    
    return None

