"""Add expires_at to listings

Revision ID: 003_add_expires_at
Revises: 002_add_views_count
Create Date: 2025-01-10 14:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '003_add_expires_at'
down_revision = '002_add_views_count'
branch_labels = None
depends_on = None


def upgrade():
    # Add expires_at column to listings table
    op.add_column('listings', sa.Column('expires_at', sa.DateTime(timezone=True), nullable=True))
    # Create index on expires_at for better query performance
    op.create_index('ix_listings_expires_at', 'listings', ['expires_at'])


def downgrade():
    # Remove index
    op.drop_index('ix_listings_expires_at', table_name='listings')
    # Remove column
    op.drop_column('listings', 'expires_at')


