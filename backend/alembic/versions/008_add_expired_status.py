"""Add EXPIRED status to ListingStatus enum

Revision ID: 008_add_expired_status
Revises: 007_add_performance_indexes
Create Date: 2025-01-15 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '008_add_expired_status'
down_revision = '007_add_performance_indexes'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add EXPIRED value to the listingstatus enum
    # PostgreSQL requires using ALTER TYPE to add enum values
    op.execute("ALTER TYPE listingstatus ADD VALUE IF NOT EXISTS 'EXPIRED'")


def downgrade() -> None:
    # Note: PostgreSQL doesn't support removing enum values directly
    # This would require recreating the enum type, which is complex
    # For now, we'll leave it as a no-op
    # In production, you might want to:
    # 1. Update all EXPIRED listings to REJECTED
    # 2. Recreate the enum without EXPIRED
    pass


