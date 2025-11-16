"""add listing_type to listings

Revision ID: 009_add_listing_type
Revises: 008_add_expired_status
Create Date: 2024-01-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '009_add_listing_type'
down_revision = '008_add_expired_status'
branch_labels = None
depends_on = None


def upgrade():
    # Create enum type for listing_type (only if it doesn't exist)
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE listingtype AS ENUM ('personal', 'company');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    """)
    
    # Add listing_type column with default value
    op.add_column('listings', sa.Column('listing_type', postgresql.ENUM('personal', 'company', name='listingtype', create_type=False), server_default='personal', nullable=False))
    
    # Create index for listing_type
    op.create_index(op.f('ix_listings_listing_type'), 'listings', ['listing_type'], unique=False)


def downgrade():
    # Drop index
    op.drop_index(op.f('ix_listings_listing_type'), table_name='listings')
    
    # Drop column
    op.drop_column('listings', 'listing_type')
    
    # Drop enum type
    op.execute("DROP TYPE listingtype")

