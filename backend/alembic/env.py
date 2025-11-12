from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
from app.config import settings
from app.database import Base
from app.models import User, Listing, ListingMedia, ModerationLog

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
target_metadata = Base.metadata

# Convert asyncpg URL to psycopg2 for Alembic (Alembic needs sync driver)
# Replace postgresql+asyncpg:// with postgresql+psycopg2://
# Note: Session pooler works with psycopg2, but for migrations we might need direct connection
# However, if using pooler for IPv4 compatibility, we'll use it here too
database_url = settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql+psycopg2://")

# Set the database URL from settings
# Escape % signs for configparser by doubling them, then set the option
# ConfigParser uses % for interpolation, so we need to escape it
escaped_url = database_url.replace('%', '%%')
config.set_main_option("sqlalchemy.url", escaped_url)


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    # Use NullPool to avoid connection pooling issues with Supabase Session Pooler
    # This ensures we only use one connection at a time for migrations
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,  # No connection pooling - use one connection and close it
        pool_pre_ping=False,  # Don't ping connections
    )

    # Use a single connection and ensure it's properly closed
    connection = connectable.connect()
    try:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()
    finally:
        connection.close()
        connectable.dispose()  # Dispose of the engine to free resources


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

