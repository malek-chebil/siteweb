from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import ListingMedia, Listing
from app.dependencies import get_current_admin_user, get_current_user
from app.models import User as UserModel
from app.utils.security_logger import log_file_upload

router = APIRouter(prefix="/media", tags=["media"])


@router.get("/upload-url")
async def get_upload_url(
    filename: str,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    """Get a signed URL for uploading media to Supabase Storage."""
    from app.lib.supabase_storage import get_upload_url
    from app.utils.sanitizer import sanitize_filename
    
    # Validate filename
    if not filename:
        # Log rejected file upload
        log_file_upload(
            request=request,
            user_id=current_user.id,
            filename=filename or "unknown",
            file_size=0,
            success=False
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename is required"
        )
    
    # Sanitize filename
    original_filename = filename
    filename = sanitize_filename(filename)
    
    # Validate file extension
    allowed_extensions = ['.jpg', '.jpeg', '.png', '.webp']
    if not any(filename.lower().endswith(ext) for ext in allowed_extensions):
        # Log rejected file upload
        log_file_upload(
            request=request,
            user_id=current_user.id,
            filename=original_filename,
            file_size=0,
            success=False
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed extensions: {', '.join(allowed_extensions)}"
        )
    
    try:
        upload_url = await get_upload_url(filename, current_user.id)
        
        # Log successful file upload request
        log_file_upload(
            request=request,
            user_id=current_user.id,
            filename=filename,
            file_size=0,  # Size unknown at this point
            success=True
        )
        
        return {"upload_url": upload_url, "path": filename}
    except Exception as e:
        # Log failed file upload
        log_file_upload(
            request=request,
            user_id=current_user.id,
            filename=filename,
            file_size=0,
            success=False
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate upload URL: {str(e)}"
        )


@router.delete("/{media_id}")
async def delete_media(
    media_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    """Delete a media item. Users can delete their own media, admins can delete any media."""
    # Get the media item with its listing
    result = await db.execute(
        select(ListingMedia)
        .join(Listing)
        .where(ListingMedia.id == media_id)
    )
    media = result.scalar_one_or_none()
    
    if not media:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media not found"
        )
    
    # Check permissions: user must own the listing OR be admin
    if media.listing.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this media"
        )
    
    # Delete from Supabase Storage if URL is a Supabase URL
    # Note: We'll delete from DB only - frontend can handle storage deletion if needed
    # Or we can use Supabase Admin API if available
    try:
        if media.url and 'supabase' in media.url:
            # Extract file path from URL for potential future use
            # URL format: https://xxx.supabase.co/storage/v1/object/public/listing-images/path/to/file.jpg
            if '/object/public/' in media.url:
                # For now, we just delete from DB
                # Storage deletion can be handled by frontend or admin API
                pass
    except Exception as e:
        print(f"Warning: Error processing storage deletion: {e}")
    
    # Delete from database
    await db.delete(media)
    await db.commit()
    
    return {"message": "Media deleted successfully"}


@router.delete("/admin/{media_id}")
async def admin_delete_media(
    media_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_admin_user),
):
    """Admin endpoint to delete any media item."""
    # Get the media item
    result = await db.execute(
        select(ListingMedia).where(ListingMedia.id == media_id)
    )
    media = result.scalar_one_or_none()
    
    if not media:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media not found"
        )
    
    # Delete from Supabase Storage if URL is a Supabase URL
    try:
        from app.lib.supabase_storage import delete_file_from_storage
        if media.url and 'supabase' in media.url:
            if '/object/public/' in media.url:
                file_path = media.url.split('/object/public/')[-1]
                await delete_file_from_storage(file_path)
    except Exception as e:
        print(f"Warning: Failed to delete file from storage: {e}")
    
    # Delete from database
    await db.delete(media)
    await db.commit()
    
    return {"message": "Media deleted successfully"}
