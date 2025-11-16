from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload
from typing import List
from app.database import get_db
from app.models import Favorite, Listing, User
from app.schemas import FavoriteResponse, FavoriteListResponse, FavoriteBatchCheckRequest
from app.dependencies import get_current_user

router = APIRouter(prefix="/favorites", tags=["favorites"])


@router.get("", response_model=FavoriteListResponse)
async def get_favorites(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get current user's favorite listings."""
    # Get total count
    count_query = select(func.count(Favorite.id)).where(Favorite.user_id == current_user.id)
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()
    
    # Get paginated favorites with listings
    query = (
        select(Favorite)
        .where(Favorite.user_id == current_user.id)
        .options(selectinload(Favorite.listing).selectinload(Listing.media))
        .options(selectinload(Favorite.listing).selectinload(Listing.user))
        .order_by(Favorite.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    
    result = await db.execute(query)
    favorites = result.scalars().unique().all()
    
    total_pages = (total + page_size - 1) // page_size
    
    return FavoriteListResponse(
        items=[FavoriteResponse(
            id=fav.id,
            user_id=fav.user_id,
            listing_id=fav.listing_id,
            created_at=fav.created_at,
            listing=fav.listing,
        ) for fav in favorites],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.post("/{listing_id}", response_model=FavoriteResponse, status_code=status.HTTP_201_CREATED)
async def add_favorite(
    listing_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Add a listing to favorites."""
    # Check if listing exists
    listing_result = await db.execute(select(Listing).where(Listing.id == listing_id))
    listing = listing_result.scalar_one_or_none()
    
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    
    # Check if already favorited
    existing_result = await db.execute(
        select(Favorite).where(
            and_(
                Favorite.user_id == current_user.id,
                Favorite.listing_id == listing_id
            )
        )
    )
    existing = existing_result.scalar_one_or_none()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Listing already in favorites"
        )
    
    # Create favorite
    favorite = Favorite(
        user_id=current_user.id,
        listing_id=listing_id,
    )
    db.add(favorite)
    await db.commit()
    await db.refresh(favorite)
    
    # Reload with listing
    result = await db.execute(
        select(Favorite)
        .options(selectinload(Favorite.listing).selectinload(Listing.media))
        .options(selectinload(Favorite.listing).selectinload(Listing.user))
        .where(Favorite.id == favorite.id)
    )
    favorite = result.scalar_one()
    
    return FavoriteResponse(
        id=favorite.id,
        user_id=favorite.user_id,
        listing_id=favorite.listing_id,
        created_at=favorite.created_at,
        listing=favorite.listing,
    )


@router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_favorite(
    listing_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Remove a listing from favorites."""
    result = await db.execute(
        select(Favorite).where(
            and_(
                Favorite.user_id == current_user.id,
                Favorite.listing_id == listing_id
            )
        )
    )
    favorite = result.scalar_one_or_none()
    
    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorite not found"
        )
    
    await db.delete(favorite)
    await db.commit()
    
    return None


# REMOVED: /check-batch endpoint - favorites are now included directly in listings API
# Use /listings endpoint which includes is_favorited for each listing

@router.get("/check/{listing_id}")
async def check_favorite(
    listing_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Check if a listing is favorited by current user."""
    result = await db.execute(
        select(Favorite).where(
            and_(
                Favorite.user_id == current_user.id,
                Favorite.listing_id == listing_id
            )
        )
    )
    favorite = result.scalar_one_or_none()
    
    return {"is_favorited": favorite is not None}


