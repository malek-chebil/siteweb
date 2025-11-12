"""initial migration

Revision ID: 001_initial
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('is_admin', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    
    # Create listings table
    op.create_table(
        'listings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('city', sa.String(length=100), nullable=False),
        sa.Column('price', sa.Numeric(10, 2), nullable=True),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('whatsapp', sa.String(length=20), nullable=True),
        sa.Column('category', sa.String(length=100), nullable=False),
        sa.Column('status', sa.Enum('PENDING', 'APPROVED', 'REJECTED', name='listingstatus'), nullable=False, server_default='PENDING'),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_listings_id'), 'listings', ['id'], unique=False)
    op.create_index(op.f('ix_listings_title'), 'listings', ['title'], unique=False)
    op.create_index(op.f('ix_listings_city'), 'listings', ['city'], unique=False)
    op.create_index(op.f('ix_listings_category'), 'listings', ['category'], unique=False)
    op.create_index(op.f('ix_listings_status'), 'listings', ['status'], unique=False)
    op.create_index(op.f('ix_listings_user_id'), 'listings', ['user_id'], unique=False)
    
    # Create listing_media table
    op.create_table(
        'listing_media',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('listing_id', sa.Integer(), nullable=False),
        sa.Column('url', sa.String(length=500), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['listing_id'], ['listings.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_listing_media_id'), 'listing_media', ['id'], unique=False)
    op.create_index(op.f('ix_listing_media_listing_id'), 'listing_media', ['listing_id'], unique=False)
    
    # Create moderation_logs table
    op.create_table(
        'moderation_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('listing_id', sa.Integer(), nullable=False),
        sa.Column('action', sa.String(length=50), nullable=False),
        sa.Column('reason', sa.Text(), nullable=True),
        sa.Column('moderator_id', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['listing_id'], ['listings.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_moderation_logs_id'), 'moderation_logs', ['id'], unique=False)
    op.create_index(op.f('ix_moderation_logs_listing_id'), 'moderation_logs', ['listing_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_moderation_logs_listing_id'), table_name='moderation_logs')
    op.drop_index(op.f('ix_moderation_logs_id'), table_name='moderation_logs')
    op.drop_table('moderation_logs')
    op.drop_index(op.f('ix_listing_media_listing_id'), table_name='listing_media')
    op.drop_index(op.f('ix_listing_media_id'), table_name='listing_media')
    op.drop_table('listing_media')
    op.drop_index(op.f('ix_listings_user_id'), table_name='listings')
    op.drop_index(op.f('ix_listings_status'), table_name='listings')
    op.drop_index(op.f('ix_listings_category'), table_name='listings')
    op.drop_index(op.f('ix_listings_city'), table_name='listings')
    op.drop_index(op.f('ix_listings_title'), table_name='listings')
    op.drop_index(op.f('ix_listings_id'), table_name='listings')
    op.drop_table('listings')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
    op.execute('DROP TYPE listingstatus')

