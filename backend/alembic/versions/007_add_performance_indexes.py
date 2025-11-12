"""add performance indexes

Revision ID: 007
Revises: 006
Create Date: 2024-01-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '007_add_performance_indexes'
down_revision = '006_add_favorites'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Composite index for common listing queries (status + featured + created_at)
    op.create_index(
        'idx_listings_status_featured_created',
        'listings',
        ['status', 'is_featured', 'created_at'],
        unique=False
    )
    
    # Composite index for expired listings filtering
    op.create_index(
        'idx_listings_status_expires',
        'listings',
        ['status', 'expires_at'],
        unique=False,
        postgresql_where=sa.text("expires_at IS NOT NULL")
    )
    
    # Composite index for user listings queries
    op.create_index(
        'idx_listings_user_status',
        'listings',
        ['user_id', 'status'],
        unique=False
    )
    
    # Index for city searches (case-insensitive searches benefit from this)
    # Note: PostgreSQL already has index on city, but we add a composite for city+status
    op.create_index(
        'idx_listings_city_status',
        'listings',
        ['city', 'status'],
        unique=False
    )
    
    # Index for category + status queries
    op.create_index(
        'idx_listings_category_status',
        'listings',
        ['category', 'status'],
        unique=False
    )
    
    # Index for price range queries
    op.create_index(
        'idx_listings_price_status',
        'listings',
        ['price', 'status'],
        unique=False
    )
    
    # Full-text search index for title and description (using GIN for better performance)
    op.execute("""
        CREATE INDEX IF NOT EXISTS idx_listings_title_gin 
        ON listings USING gin(to_tsvector('french', title));
    """)
    
    op.execute("""
        CREATE INDEX IF NOT EXISTS idx_listings_description_gin 
        ON listings USING gin(to_tsvector('french', description));
    """)


def downgrade() -> None:
    op.drop_index('idx_listings_price_status', table_name='listings')
    op.drop_index('idx_listings_category_status', table_name='listings')
    op.drop_index('idx_listings_city_status', table_name='listings')
    op.drop_index('idx_listings_user_status', table_name='listings')
    op.drop_index('idx_listings_status_expires', table_name='listings')
    op.drop_index('idx_listings_status_featured_created', table_name='listings')
    op.execute("DROP INDEX IF EXISTS idx_listings_description_gin")
    op.execute("DROP INDEX IF EXISTS idx_listings_title_gin")

