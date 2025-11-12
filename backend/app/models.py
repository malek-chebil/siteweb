from sqlalchemy import Column, Integer, String, Text, Numeric, ForeignKey, DateTime, Boolean, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class ListingStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXPIRED = "expired"


class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)  # Supabase UUID
    email = Column(String, unique=True, nullable=False, index=True)
    username = Column(String(50), nullable=True, index=True)
    is_admin = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    listings = relationship("Listing", back_populates="user", cascade="all, delete-orphan")


class Listing(Base):
    __tablename__ = "listings"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False)
    city = Column(String(100), nullable=False, index=True)
    price = Column(Numeric(10, 2), nullable=True)
    phone = Column(String(20), nullable=True)
    whatsapp = Column(String(20), nullable=True)
    category = Column(String(100), nullable=False, index=True)
    status = Column(Enum(ListingStatus), default=ListingStatus.PENDING, nullable=False, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    views_count = Column(Integer, default=0, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=True, index=True)  # Expiration date for paid ads
    is_featured = Column(Boolean, default=False, nullable=False, index=True)  # Featured/premium listing
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="listings")
    media = relationship("ListingMedia", back_populates="listing", cascade="all, delete-orphan")
    moderation_logs = relationship("ModerationLog", back_populates="listing", cascade="all, delete-orphan")


class ListingMedia(Base):
    __tablename__ = "listing_media"
    
    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False, index=True)
    url = Column(String(500), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    listing = relationship("Listing", back_populates="media")


class ModerationLog(Base):
    __tablename__ = "moderation_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False, index=True)
    action = Column(String(50), nullable=False)  # approve, reject
    reason = Column(Text, nullable=True)
    moderator_id = Column(String, nullable=True)  # Supabase user ID
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    listing = relationship("Listing", back_populates="moderation_logs")


class Favorite(Base):
    __tablename__ = "favorites"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User")
    listing = relationship("Listing")
    
    # Unique constraint will be added in migration

