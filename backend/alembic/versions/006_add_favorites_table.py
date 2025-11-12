"""Add favorites table

Revision ID: 006_add_favorites
Revises: 005_add_is_featured
Create Date: 2025-01-15 16:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '006_add_favorites'
down_revision = '005_add_is_featured'
branch_labels = None
depends_on = None


def upgrade():
    # Create favorites table
    op.create_table(
        'favorites',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('listing_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_favorites_user_id'), 'favorites', ['user_id'], unique=False)
    op.create_index(op.f('ix_favorites_listing_id'), 'favorites', ['listing_id'], unique=False)
    # Create unique constraint: user can only favorite a listing once
    op.create_unique_constraint('uq_favorites_user_listing', 'favorites', ['user_id', 'listing_id'], deferrable=True, initially='DEFERRED')


def downgrade():
    # Remove unique constraint
    op.drop_constraint('uq_favorites_user_listing', 'favorites', type_='unique')
    # Remove indexes
    op.drop_index(op.f('ix_favorites_listing_id'), table_name='favorites')
    op.drop_index(op.f('ix_favorites_user_id'), table_name='favorites')
    # Remove table
    op.drop_table('favorites')

