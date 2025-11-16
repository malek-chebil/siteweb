"""
Script to test database connection and diagnose timeout issues.
"""
import asyncio
import asyncpg
import os
import sys
from urllib.parse import urlparse

# Add parent directory to path to import settings
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("⚠️  python-dotenv not installed. Using environment variables directly.")

async def test_connection():
    """Test database connection with detailed diagnostics."""
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("❌ ERROR: DATABASE_URL environment variable not set")
        print("\nPlease set DATABASE_URL in your .env file or environment variables")
        return False
    
    print("🔍 Testing database connection...")
    print(f"📋 DATABASE_URL: {db_url[:50]}..." if len(db_url) > 50 else f"📋 DATABASE_URL: {db_url}")
    
    # Parse DATABASE_URL
    # Handle postgresql+asyncpg:// format
    clean_url = db_url.replace("postgresql+asyncpg://", "postgresql://")
    parsed = urlparse(clean_url)
    
    host = parsed.hostname
    port = int(parsed.port or 5432)
    user = parsed.username
    password = parsed.password
    database = parsed.path[1:] if parsed.path and parsed.path != "/" else "postgres"
    
    print(f"\n📊 Connection Details:")
    print(f"   Host: {host}")
    print(f"   Port: {port}")
    print(f"   User: {user}")
    print(f"   Database: {database}")
    print(f"   Password: {'***' if password else 'NOT SET'}")
    
    # Test connection
    print(f"\n🔄 Attempting connection (timeout: 15 seconds)...")
    try:
        conn = await asyncio.wait_for(
            asyncpg.connect(
                host=host,
                port=port,
                user=user,
                password=password,
                database=database,
                timeout=10,  # Connection timeout
                command_timeout=30  # Command timeout
            ),
            timeout=15  # Total timeout
        )
        print("✅ Connection successful!")
        
        # Test a simple query
        print("\n🔄 Testing query...")
        result = await conn.fetchval("SELECT version()")
        print(f"✅ Query successful!")
        print(f"   PostgreSQL version: {result[:50]}...")
        
        await conn.close()
        print("\n✅ All tests passed!")
        return True
        
    except asyncio.TimeoutError:
        print("❌ Connection timeout - Supabase is not reachable")
        print("\n💡 Possible causes:")
        print("   - Firewall blocking the connection")
        print("   - VPN interfering")
        print("   - Internet connection unstable")
        print("   - Supabase server down")
        print("   - Wrong port (try 6543 for pooler instead of 5432)")
        return False
        
    except asyncpg.InvalidPasswordError:
        print("❌ Invalid password")
        print("\n💡 Check your DATABASE_URL password")
        return False
        
    except asyncpg.InvalidCatalogNameError:
        print("❌ Database does not exist")
        print(f"\n💡 Database '{database}' not found. Check DATABASE_URL")
        return False
        
    except Exception as e:
        print(f"❌ Connection failed: {type(e).__name__}: {e}")
        print("\n💡 Check:")
        print("   - DATABASE_URL format is correct")
        print("   - Host, port, user, password are correct")
        print("   - Internet connection is stable")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_connection())
    sys.exit(0 if success else 1)

