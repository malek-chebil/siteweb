"""add username to users

Revision ID: 004_add_username
Revises: 003_add_expires_at
Create Date: 2024-01-15 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '004_add_username'
down_revision: Union[str, None] = '003_add_expires_at'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add username column to users table
    op.add_column('users', sa.Column('username', sa.String(length=50), nullable=True))
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=False)


def downgrade() -> None:
    # Remove username column
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_column('users', 'username')


