"""Add is_featured to listings

Revision ID: 005_add_is_featured
Revises: 004_add_username
Create Date: 2025-01-15 15:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '005_add_is_featured'
down_revision = '004_add_username'
branch_labels = None
depends_on = None


def upgrade():
    # Add is_featured column to listings table
    op.add_column('listings', sa.Column('is_featured', sa.Boolean(), nullable=False, server_default='false'))
    # Create index on is_featured for better query performance
    op.create_index('ix_listings_is_featured', 'listings', ['is_featured'])


def downgrade():
    # Remove index
    op.drop_index('ix_listings_is_featured', table_name='listings')
    # Remove column
    op.drop_column('listings', 'is_featured')


