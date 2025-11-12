"""add views_count to listings

Revision ID: 002_add_views_count
Revises: 001_initial
Create Date: 2025-01-11 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '002_add_views_count'
down_revision = '001_initial'
branch_labels = None
depends_on = None


def upgrade():
    # Add views_count column to listings table
    op.add_column('listings', sa.Column('views_count', sa.Integer(), nullable=False, server_default='0'))


def downgrade():
    # Remove views_count column from listings table
    op.drop_column('listings', 'views_count')


