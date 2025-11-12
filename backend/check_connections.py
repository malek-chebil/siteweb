"""
Script to check database connection status.
Run this to verify if you can connect before running migrations.
"""
import asyncio
import asyncpg
from urllib.parse import unquote, urlparse
from app.config import settings

async def check_connection():
    """Test database connection."""
    try:
        # Parse the DATABASE_URL properly
        db_url = settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
        
        # Use urlparse to properly parse the URL
        parsed = urlparse(db_url)
        
        # Extract components
        user = parsed.username or "postgres"
        password = unquote(parsed.password) if parsed.password else ""
        host = parsed.hostname or "localhost"
        port = parsed.port or 5432
        database = parsed.path.lstrip("/") or "postgres"
        
        print(f"🔍 Attempting to connect to: {host}:{port}/{database}")
        print(f"   User: {user}")
        
        # Try to connect
        # Disable prepared statements for pgbouncer (Session Pooler)
        conn = await asyncpg.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=database,
            timeout=10,
            statement_cache_size=0  # Disable prepared statements for pgbouncer
        )
        
        # Check active connections
        result = await conn.fetchval("""
            SELECT count(*) 
            FROM pg_stat_activity 
            WHERE datname = $1
        """, database)
        
        print(f"✅ Connection successful!")
        print(f"📊 Active connections to database: {result}")
        
        if result > 10:
            print(f"⚠️  WARNING: {result} active connections detected!")
            print("   You should stop the FastAPI server and wait before running migrations.")
        else:
            print("✅ Connection count looks good. You can run migrations.")
        
        await conn.close()
        
    except Exception as e:
        error_msg = str(e)
        error_type = type(e).__name__
        print(f"❌ Connection failed!")
        print(f"   Error type: {error_type}")
        print(f"   Error message: {error_msg}")
        
        # Show parsed connection details (without password)
        print(f"\n📋 Connection details:")
        print(f"   Host: {host}")
        print(f"   Port: {port}")
        print(f"   User: {user}")
        print(f"   Database: {database}")
        print(f"   Password: {'*' * len(password) if password else '(empty)'}")
        
        print("\n💡 Tips:")
        print("   - Verify DATABASE_URL in .env file")
        print("   - Check if password is correctly URL-encoded (%40 for @)")
        print("   - For Session Pooler, use port 6543, not 5432")
        print("   - Make sure FastAPI server is stopped")
        
        # Check if it's a port issue
        if port == 5432:
            print("\n⚠️  NOTE: You're using port 5432.")
            print("   Session Pooler typically uses port 6543.")
            print("   Check your DATABASE_URL - it should be:")
            print("   postgresql+asyncpg://user:pass@host:6543/db")

if __name__ == "__main__":
    asyncio.run(check_connection())

