from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_, func
from sqlalchemy.orm import selectinload
from typing import Optional
from datetime import datetime, timezone, timedelta
from app.database import get_db
from app.models import Listing, ListingMedia, ListingStatus, ListingType, User
from app.schemas import (
    ListingCreate,
    ListingUpdate,
    ListingResponse,
    ListingListResponse,
    ListingFilters,
)
from app.dependencies import get_current_user, get_optional_user
from app.utils.query_builder import build_listing_filters_query, get_user_admin_status
# Favorite system temporarily removed

router = APIRouter(prefix="/listings", tags=["listings"])


@router.get("/my", response_model=ListingListResponse)
async def get_my_listings(
    filters: ListingFilters = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get current user's listings only - OPTIMIZED."""
    # Build base query with filters using centralized helper
    query = select(Listing)
    query = build_listing_filters_query(
        query, 
        filters, 
        user_id=current_user.id,
        is_admin=current_user.is_admin,
        include_expired_check=False  # Users can see all their listings
    )
    
    # Build count query using the same filters
    count_query = select(func.count(Listing.id))
    count_query = build_listing_filters_query(
        count_query,
        filters,
        user_id=current_user.id,
        is_admin=current_user.is_admin,
        include_expired_check=False
    )
    
    # Execute count query
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
    """Get listings with filtering, search, and pagination - OPTIMIZED."""
    # OPTIMIZED: Get admin status efficiently (single field query)
    is_admin = await get_user_admin_status(db, current_user_id)
    
    # Build base query with filters using centralized helper
    query = select(Listing)
    query = build_listing_filters_query(
        query,
        filters,
        user_id=None,  # Public listings, not user-specific
        is_admin=is_admin,
        include_expired_check=True  # Check expiration for public listings
    )
    
    # Build count query using the same filters
    count_query = select(func.count(Listing.id))
    count_query = build_listing_filters_query(
        count_query,
        filters,
        user_id=None,
        is_admin=is_admin,
        include_expired_check=True
    )
    
    # Execute count query
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
    
    # OPTIMIZED: Get admin status efficiently (single field query)
    is_admin = await get_user_admin_status(db, current_user_id)
    
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

