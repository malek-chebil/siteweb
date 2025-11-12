from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import event
from app.config import settings
import urllib.parse

# CRITICAL FIX: Patch asyncpg.connect BEFORE any SQLAlchemy imports
# This MUST happen before SQLAlchemy imports asyncpg
import asyncpg

# Store original asyncpg.connect
_original_asyncpg_connect = asyncpg.connect

# Patch to ALWAYS force statement_cache_size=0
async def _patched_asyncpg_connect(*args, **kwargs):
    """Force statement_cache_size=0 for ALL asyncpg connections."""
    # CRITICAL: Always set this, even if already set
    kwargs['statement_cache_size'] = 0
    # Remove any other cache-related parameters that might interfere
    kwargs.pop('prepared_statement_cache_size', None)
    return await _original_asyncpg_connect(*args, **kwargs)

# Apply patch IMMEDIATELY
asyncpg.connect = _patched_asyncpg_connect

# Also patch create_pool to ensure pool connections also have statement_cache_size=0
_original_create_pool = asyncpg.create_pool

async def _patched_create_pool(*args, **kwargs):
    """Force statement_cache_size=0 for pool connections."""
    kwargs['statement_cache_size'] = 0
    kwargs.pop('prepared_statement_cache_size', None)
    return await _original_create_pool(*args, **kwargs)

asyncpg.create_pool = _patched_create_pool

# Parse DATABASE_URL and switch to DIRECT connection (port 5432) instead of pooler
# Direct connection avoids pgbouncer prepared statement issues completely
db_url = settings.DATABASE_URL
parsed = urllib.parse.urlparse(db_url)

# Extract the base connection info (user, password, host)
# Replace pooler host with direct database host
if 'pooler.supabase.com' in parsed.hostname or ':6543' in db_url or ':6544' in db_url:
    # Extract project ref from pooler hostname (e.g., cvtrghsdfkrwgasvnflb from aws-1-eu-west-1.pooler.supabase.com)
    # Or use the direct database hostname format
    if 'pooler.supabase.com' in parsed.hostname:
        # Try to extract project ref and construct direct hostname
        # Format: db.{project_ref}.supabase.co
        # For now, let's try to use the direct connection string format
        # The user should provide the direct connection string in .env
        print("⚠️  WARNING: Using pooler connection. For best results, use direct connection (port 5432) in DATABASE_URL")
    else:
        # Switch from pooler port to direct port 5432
        db_url = db_url.replace(':6543', ':5432').replace(':6544', ':5432')
        print("✅ Switched to direct connection (port 5432) to avoid pgbouncer prepared statement issues")

# Create async engine with connection pool settings
# Supabase Session Pooler has a limit (typically 15-20 connections for free tier)
# We configure the pool to stay well within these limits to avoid conflicts with Alembic
# CRITICAL: pgbouncer doesn't support prepared statements - we MUST disable them
engine = create_async_engine(
    db_url,
    echo=settings.DEBUG,
    future=True,
    pool_size=3,  # Reduced: Number of connections to maintain in the pool
    max_overflow=5,  # Reduced: Maximum number of connections beyond pool_size (max 8 total)
    pool_timeout=20,  # Seconds to wait before giving up on getting a connection
    pool_recycle=1800,  # Recycle connections after 30 minutes (reduced from 1 hour)
    pool_pre_ping=True,  # Verify connections before using them
    pool_reset_on_return='commit',  # Reset connections on return to pool
    connect_args={
        "statement_cache_size": 0,  # CRITICAL: Disable prepared statements for pgbouncer
        "server_settings": {
            "jit": "off"  # Disable JIT for better compatibility
        }
    }
)

# CRITICAL FIX: Event listener to ensure statement_cache_size=0 is always applied
# This intercepts connections after they're created and clears the statement cache
@event.listens_for(engine.sync_engine, "connect")
def receive_connect(dbapi_conn, connection_record):
    """Clear statement cache on connection for pgbouncer compatibility."""
    # The asyncpg connection is wrapped, we need to access the underlying connection
    if hasattr(dbapi_conn, '_connection'):
        asyncpg_conn = dbapi_conn._connection
        if asyncpg_conn and hasattr(asyncpg_conn, '_statement_cache'):
            # Clear the statement cache to prevent prepared statement errors
            asyncpg_conn._statement_cache.clear()

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Base class for models
Base = declarative_base()


# Dependency to get database session
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

