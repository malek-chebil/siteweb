"""
Test script to diagnose backend connection issues.
Run this to check if your backend can connect to the database.
"""
import asyncio
import os
from app.database import engine, AsyncSessionLocal
from app.config import settings
from sqlalchemy import text

async def test_connection():
    """Test database connection."""
    print("=" * 60)
    print("BACKEND CONNECTION DIAGNOSTIC")
    print("=" * 60)
    
    # Check environment variables
    print("\n1. Checking Environment Variables...")
    required_vars = [
        "DATABASE_URL",
        "SUPABASE_URL",
        "SUPABASE_ANON_KEY",
        "SUPABASE_JWT_SECRET",
    ]
    
    missing_vars = []
    for var in required_vars:
        value = getattr(settings, var, None)
        if not value:
            print(f"   ❌ {var}: NOT SET")
            missing_vars.append(var)
        else:
            # Mask sensitive values
            if "URL" in var:
                print(f"   ✅ {var}: {value[:30]}...")
            elif "KEY" in var or "SECRET" in var:
                print(f"   ✅ {var}: {value[:10]}...***")
            else:
                print(f"   ✅ {var}: SET")
    
    if missing_vars:
        print(f"\n⚠️  WARNING: Missing environment variables: {', '.join(missing_vars)}")
        return False
    
    # Test database connection
    print("\n2. Testing Database Connection...")
    try:
        async with engine.begin() as conn:
            result = await conn.execute(text("SELECT 1"))
            row = result.fetchone()
            if row and row[0] == 1:
                print("   ✅ Database connection successful!")
            else:
                print("   ❌ Database connection failed - unexpected result")
                return False
    except Exception as e:
        print(f"   ❌ Database connection failed: {str(e)}")
        print(f"   Error type: {type(e).__name__}")
        return False
    
    # Test if tables exist
    print("\n3. Checking Database Tables...")
    required_tables = ["users", "listings", "listing_media", "alembic_version"]
    try:
        async with engine.begin() as conn:
            result = await conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """))
            existing_tables = [row[0] for row in result.fetchall()]
            
            missing_tables = []
            for table in required_tables:
                if table in existing_tables:
                    print(f"   ✅ Table '{table}' exists")
                else:
                    print(f"   ❌ Table '{table}' MISSING")
                    missing_tables.append(table)
            
            if missing_tables:
                print(f"\n⚠️  WARNING: Missing tables: {', '.join(missing_tables)}")
                print("   Solution: Run 'alembic upgrade head' to create tables")
                return False
    except Exception as e:
        print(f"   ❌ Error checking tables: {str(e)}")
        return False
    
    # Test listings query
    print("\n4. Testing Listings Query...")
    try:
        from app.models import Listing
        from sqlalchemy import select
        
        async with AsyncSessionLocal() as session:
            # Try to count listings
            result = await session.execute(select(Listing))
            listings = result.scalars().all()
            print(f"   ✅ Query successful! Found {len(listings)} listings")
    except Exception as e:
        print(f"   ❌ Listings query failed: {str(e)}")
        print(f"   Error type: {type(e).__name__}")
        import traceback
        print("\n   Full traceback:")
        traceback.print_exc()
        return False
    
    print("\n" + "=" * 60)
    print("✅ ALL CHECKS PASSED! Backend should work correctly.")
    print("=" * 60)
    return True

if __name__ == "__main__":
    success = asyncio.run(test_connection())
    exit(0 if success else 1)

