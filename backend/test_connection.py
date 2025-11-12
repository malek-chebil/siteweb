"""Test database connection"""
import asyncio
import asyncpg
from app.config import settings

async def test_connection():
    """Test database connection"""
    print("Testing database connection...")
    print(f"Connection string: {settings.DATABASE_URL[:50]}...")
    
    try:
        # Parse the connection string
        # Format: postgresql+asyncpg://user:password@host:port/database
        url = settings.DATABASE_URL.replace("postgresql+asyncpg://", "")
        
        # Extract components
        if "@" in url:
            auth, rest = url.split("@", 1)
            user, password = auth.split(":", 1)
            if "/" in rest:
                host_port, database = rest.split("/", 1)
                if ":" in host_port:
                    host, port = host_port.split(":")
                    port = int(port)
                else:
                    host = host_port
                    port = 5432
            else:
                host = rest
                port = 5432
                database = "postgres"
        else:
            print("❌ Invalid connection string format")
            return
        
        print(f"Connecting to: {host}:{port}")
        print(f"Database: {database}")
        print(f"User: {user}")
        
        # Try to connect - use connection string directly for better compatibility
        # For pooler, the password in connection string should be URL-encoded
        # But when passing as parameters, use plain password
        try:
            # First try with connection string (URL-encoded password)
            conn = await asyncpg.connect(settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://"), timeout=10)
        except:
            # Fallback to individual parameters (plain password)
            conn = await asyncpg.connect(
                host=host,
                port=port,
                user=user,
                password=password,
                database=database,
                timeout=10
            )
        
        print("✅ Connection successful!")
        
        # Test a simple query
        result = await conn.fetchval("SELECT version()")
        print(f"PostgreSQL version: {result[:50]}...")
        
        await conn.close()
        print("✅ Connection test passed!")
        
    except asyncpg.exceptions.InvalidPasswordError as e:
        print(f"❌ Invalid password: {e}")
        print("💡 Check your password in the .env file")
    except asyncpg.exceptions.ConnectionDoesNotExistError as e:
        print(f"❌ Connection failed: {e}")
        print("💡 Check if the hostname is correct and the database is accessible")
    except Exception as e:
        print(f"❌ Connection error: {type(e).__name__}: {e}")
        print("💡 Check your network connection and Supabase project status")

if __name__ == "__main__":
    asyncio.run(test_connection())

