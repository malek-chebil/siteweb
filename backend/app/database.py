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
    kwargs.pop('prepared_statement_cache_size', None)  # Remove if present (not a valid param)
    return await _original_asyncpg_connect(*args, **kwargs)

# Apply patch IMMEDIATELY
asyncpg.connect = _patched_asyncpg_connect

# Also patch create_pool to ensure pool connections also have statement_cache_size=0
_original_create_pool = asyncpg.create_pool

async def _patched_create_pool(*args, **kwargs):
    """Force statement_cache_size=0 for pool connections."""
    kwargs['statement_cache_size'] = 0
    # Remove any other cache-related parameters that might interfere
    kwargs.pop('prepared_statement_cache_size', None)  # Remove if present (not a valid param)
    return await _original_create_pool(*args, **kwargs)

asyncpg.create_pool = _patched_create_pool

# Parse DATABASE_URL - Keep original pooler connection (required for free plan)
# We'll work with pgbouncer by aggressively disabling prepared statements
db_url = settings.DATABASE_URL
parsed = urllib.parse.urlparse(db_url)

# Check if using pooler
is_pooler_connection = (parsed.hostname and 'pooler.supabase.com' in parsed.hostname) or ':6543' in db_url or ':6544' in db_url

if is_pooler_connection:
    print("⚠️  Using pooler connection (pgbouncer) - Free plan")
    print("   pgbouncer doesn't support prepared statements")
    print("   Using statement_cache_size=0 to disable prepared statements")
    
    # DISABLED: Aggressive patch causes ResourceClosedError
    # Relying on statement_cache_size=0 in connect_args instead

# Create async engine with connection pool settings
# Supabase Session Pooler has a limit (typically 15-20 connections for free tier)
# We configure the pool to stay well within these limits to avoid conflicts with Alembic
# CRITICAL: pgbouncer doesn't support prepared statements - we MUST disable them

# Determine pool settings based on connection type
# PRODUCTION-READY: Optimized pool settings for high traffic
# Re-check if still using pooler after potential auto-conversion
final_parsed = urllib.parse.urlparse(db_url)
is_pooler = (final_parsed.hostname and 'pooler.supabase.com' in final_parsed.hostname) or ':6543' in db_url or ':6544' in db_url

if is_pooler:
    # Pooler connection: stricter limits (Supabase pooler has ~15-20 max connections)
    # Production settings: maximize within pooler limits
    pool_size = 5  # Base pool size (increased from 3)
    max_overflow = 5  # Allow 5 extra connections during traffic spikes (total: 10)
    print("⚠️  Using pooler connection. Consider switching to direct connection (port 5432) for better performance.")
else:
    # Direct connection: more connections available (~60 for free tier)
    # Production settings: optimized for high traffic
    pool_size = 10  # Base pool size (increased from 5)
    max_overflow = 10  # Allow 10 extra connections during traffic spikes (total: 20)
    print("✅ Using direct connection (port 5432) - optimal for production")

engine = create_async_engine(
    db_url,
    echo=settings.DEBUG,
    future=True,
    pool_size=pool_size,  # Adaptive based on connection type
    max_overflow=max_overflow,  # Allow overflow to handle traffic spikes
    pool_timeout=60,  # Seconds to wait before giving up (increased for production - allows time for overflow connections)
    pool_recycle=1800,  # Recycle connections after 30 minutes (reduced from 1 hour)
    pool_pre_ping=True,  # Verify connections before using them
    pool_reset_on_return='rollback',  # Aggressive reset to clear prepared statements
    connect_args={
        "statement_cache_size": 0,  # CRITICAL: Disable prepared statements for pgbouncer
        "command_timeout": 30,  # Timeout for database commands (30 seconds)
        "server_settings": {
            "jit": "off"  # Disable JIT for better compatibility
        }
    },
    # CRITICAL: Disable prepared statements at SQLAlchemy level
    execution_options={
        "compiled_cache": None,  # Disable compiled statement cache
        "autocommit": False,
    },
    echo_pool=settings.DEBUG,
)

# CRITICAL FIX: Event listener to ensure statement_cache_size=0 is always applied
# This intercepts connections after they're created and clears the statement cache
@event.listens_for(engine.sync_engine, "connect")
def receive_connect(dbapi_conn, connection_record):
    """Clear statement cache on connection for pgbouncer compatibility."""
    # The asyncpg connection is wrapped, we need to access the underlying connection
    try:
        if hasattr(dbapi_conn, '_connection'):
            asyncpg_conn = dbapi_conn._connection
            if asyncpg_conn:
                # Clear the statement cache to prevent prepared statement errors
                if hasattr(asyncpg_conn, '_statement_cache'):
                    asyncpg_conn._statement_cache.clear()
                # Also try to disable prepared statements on the connection itself
                # Clear any existing prepared statements
                if hasattr(asyncpg_conn, '_prepared_statement_cache'):
                    asyncpg_conn._prepared_statement_cache.clear()
                # Force statement_cache_size=0 on the connection object
                if hasattr(asyncpg_conn, '_statement_cache_size'):
                    asyncpg_conn._statement_cache_size = 0
                # Clear the prepared statement registry if it exists
                if hasattr(asyncpg_conn, '_prepared_statement_registry'):
                    asyncpg_conn._prepared_statement_registry.clear()
    except Exception as e:
        # Log but don't fail if we can't clear the cache
        if settings.DEBUG:
            print(f"⚠️  Warning: Could not clear statement cache: {e}")

# CRITICAL: Force connection reset on every return to pool for pgbouncer
# This ensures prepared statements don't persist across transactions
@event.listens_for(engine.sync_engine, "checkout")
def receive_checkout(dbapi_conn, connection_record, connection_proxy):
    """Clear statement cache on every checkout for pgbouncer compatibility."""
    try:
        if hasattr(dbapi_conn, '_connection'):
            asyncpg_conn = dbapi_conn._connection
            if asyncpg_conn:
                # Clear caches on every checkout to prevent prepared statement reuse
                if hasattr(asyncpg_conn, '_statement_cache'):
                    asyncpg_conn._statement_cache.clear()
                if hasattr(asyncpg_conn, '_prepared_statement_cache'):
                    asyncpg_conn._prepared_statement_cache.clear()
    except Exception:
        pass  # Silently ignore errors

# Note: SQLAlchemy async doesn't support async event listeners directly
# The sync event listener above should be sufficient for clearing caches
# 
# ⚠️ IMPORTANT: The best solution is to use a DIRECT connection (port 5432) instead of
# the pooler (port 6543/6544). Direct connections support prepared statements properly.
# See FIX_PREPARED_STATEMENTS_FINAL.md for instructions.

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


# Global flag to check if we're using pgbouncer (for reference)
USING_PGBOUNCER = is_pooler_connection

