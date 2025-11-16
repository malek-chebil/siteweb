from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
from datetime import datetime, date
from app.models import ListingStatus, ListingType
from app.utils.sanitizer import sanitize_html, sanitize_text, sanitize_phone, sanitize_url


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: Optional[str] = None
    is_admin: bool = False


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)

    @field_validator('username')
    @classmethod
    def validate_username(cls, v: Optional[str]) -> Optional[str]:
        """Sanitize username to prevent XSS."""
        if not v:
            return None
        return sanitize_text(v, max_length=50)


class UserResponse(UserBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# Listing Media Schemas
class ListingMediaBase(BaseModel):
    url: str


class ListingMediaCreate(ListingMediaBase):
    listing_id: int


class ListingMediaResponse(ListingMediaBase):
    id: int
    listing_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Listing Schemas
class ListingBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: str = Field(..., min_length=10)
    city: str = Field(..., min_length=2, max_length=100)
    price: Optional[float] = Field(None, ge=0)
    phone: Optional[str] = Field(None, max_length=20)
    whatsapp: Optional[str] = Field(None, max_length=20)
    category: str = Field(..., min_length=2, max_length=100)
    listing_type: ListingType = Field(default=ListingType.PERSONAL)
    is_featured: bool = False

    @field_validator('title')
    @classmethod
    def validate_title(cls, v: str) -> str:
        """Sanitize title to prevent XSS."""
        return sanitize_text(v, max_length=255)

    @field_validator('description')
    @classmethod
    def validate_description(cls, v: str) -> str:
        """Sanitize description to prevent XSS."""
        # Allow basic HTML formatting
        return sanitize_html(v, strip=False)

    @field_validator('city')
    @classmethod
    def validate_city(cls, v: str) -> str:
        """Sanitize city to prevent XSS."""
        return sanitize_text(v, max_length=100)

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        """Sanitize phone number."""
        if not v:
            return None
        return sanitize_phone(v)

    @field_validator('whatsapp')
    @classmethod
    def validate_whatsapp(cls, v: Optional[str]) -> Optional[str]:
        """Sanitize WhatsApp number."""
        if not v:
            return None
        return sanitize_phone(v)

    @field_validator('category')
    @classmethod
    def validate_category(cls, v: str) -> str:
        """Sanitize category to prevent XSS."""
        return sanitize_text(v, max_length=100)


class ListingCreate(ListingBase):
    media_urls: Optional[List[str]] = []

    @field_validator('media_urls')
    @classmethod
    def validate_media_urls(cls, v: Optional[List[str]]) -> Optional[List[str]]:
        """Sanitize media URLs."""
        if not v:
            return []
        # Limit to 10 URLs
        v = v[:10]
        # Sanitize each URL
        sanitized_urls = []
        for url in v:
            sanitized_url = sanitize_url(url)
            if sanitized_url:
                sanitized_urls.append(sanitized_url)
        return sanitized_urls


class ListingUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=255)
    description: Optional[str] = Field(None, min_length=10)
    city: Optional[str] = Field(None, min_length=2, max_length=100)
    price: Optional[float] = Field(None, ge=0)
    phone: Optional[str] = Field(None, max_length=20)
    whatsapp: Optional[str] = Field(None, max_length=20)
    category: Optional[str] = Field(None, min_length=2, max_length=100)
    listing_type: Optional[ListingType] = None
    media_urls: Optional[List[str]] = None
    is_featured: Optional[bool] = None

    @field_validator('title')
    @classmethod
    def validate_title(cls, v: Optional[str]) -> Optional[str]:
        """Sanitize title to prevent XSS."""
        if not v:
            return None
        return sanitize_text(v, max_length=255)

    @field_validator('description')
    @classmethod
    def validate_description(cls, v: Optional[str]) -> Optional[str]:
        """Sanitize description to prevent XSS."""
        if not v:
            return None
        return sanitize_html(v, strip=False)

    @field_validator('city')
    @classmethod
    def validate_city(cls, v: Optional[str]) -> Optional[str]:
        """Sanitize city to prevent XSS."""
        if not v:
            return None
        return sanitize_text(v, max_length=100)

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        """Sanitize phone number."""
        if not v:
            return None
        return sanitize_phone(v)

    @field_validator('whatsapp')
    @classmethod
    def validate_whatsapp(cls, v: Optional[str]) -> Optional[str]:
        """Sanitize WhatsApp number."""
        if not v:
            return None
        return sanitize_phone(v)

    @field_validator('category')
    @classmethod
    def validate_category(cls, v: Optional[str]) -> Optional[str]:
        """Sanitize category to prevent XSS."""
        if not v:
            return None
        return sanitize_text(v, max_length=100)

    @field_validator('media_urls')
    @classmethod
    def validate_media_urls(cls, v: Optional[List[str]]) -> Optional[List[str]]:
        """Sanitize media URLs."""
        if not v:
            return None
        # Limit to 10 URLs
        v = v[:10]
        # Sanitize each URL
        sanitized_urls = []
        for url in v:
            sanitized_url = sanitize_url(url)
            if sanitized_url:
                sanitized_urls.append(sanitized_url)
        return sanitized_urls if sanitized_urls else None


class ListingResponse(ListingBase):
    id: int
    status: ListingStatus
    user_id: str
    views_count: int = 0
    expires_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime]
    media: List[ListingMediaResponse] = []
    user: Optional["UserResponse"] = None
    # is_favorited: Temporarily removed - Favorite system disabled
    
    class Config:
        from_attributes = True


class ListingListResponse(BaseModel):
    items: List[ListingResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


# Moderation Schemas
class ModerationLogResponse(BaseModel):
    id: int
    listing_id: int
    action: str
    reason: Optional[str]
    moderator_id: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


class ApproveListingRequest(BaseModel):
    reason: Optional[str] = None
    expires_at: Optional[datetime] = None
    is_featured: Optional[bool] = None  # Expiration date for the listing


class RejectListingRequest(BaseModel):
    reason: str = Field(..., min_length=5)


# Media Upload Schemas
class SignedUrlRequest(BaseModel):
    filename: str = Field(..., min_length=1)
    content_type: str = Field(default="image/jpeg")

    @field_validator('filename')
    @classmethod
    def validate_filename(cls, v: str) -> str:
        """Sanitize filename to prevent directory traversal."""
        from app.utils.sanitizer import sanitize_filename
        return sanitize_filename(v)

    @field_validator('content_type')
    @classmethod
    def validate_content_type(cls, v: str) -> str:
        """Validate content type."""
        allowed_types = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
        if v not in allowed_types:
            raise ValueError(f"Content type must be one of {allowed_types}")
        return v


class SignedUrlResponse(BaseModel):
    url: str
    path: str


# Search/Filter Schemas
class ListingFilters(BaseModel):
    city: Optional[str] = None
    category: Optional[str] = None
    min_price: Optional[float] = Field(None, ge=0)
    max_price: Optional[float] = Field(None, ge=0)
    search: Optional[str] = None
    status: Optional[ListingStatus] = None  # For admin only
    is_featured: Optional[bool] = None
    period: Optional[str] = None  # all, yesterday, last_week, last_month
    listing_type: Optional[ListingType] = None  # personal, company
    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=100)


# Favorite Schemas
class FavoriteResponse(BaseModel):
    id: int
    user_id: str
    listing_id: int
    created_at: datetime
    listing: Optional[ListingResponse] = None
    
    class Config:
        from_attributes = True


class FavoriteListResponse(BaseModel):
    items: List[FavoriteResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class FavoriteBatchCheckRequest(BaseModel):
    listing_ids: List[int] = Field(..., min_items=1, max_items=100)

