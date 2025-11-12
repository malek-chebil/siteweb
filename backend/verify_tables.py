"""Verify database tables were created"""
import asyncio
import asyncpg
from app.config import settings

async def verify_tables():
    """Check if all tables were created"""
    try:
        conn = await asyncpg.connect(settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://"))
        
        # Get all tables
        tables = await conn.fetch("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        """)
        
        print("✅ Database tables:")
        for table in tables:
            print(f"  - {table['table_name']}")
        
        # Check for required tables
        required_tables = ['users', 'listings', 'listing_media', 'moderation_logs']
        existing_tables = [t['table_name'] for t in tables]
        
        print("\n✅ Required tables check:")
        for table in required_tables:
            if table in existing_tables:
                print(f"  ✅ {table}")
            else:
                print(f"  ❌ {table} - MISSING")
        
        await conn.close()
        print("\n✅ Database setup complete!")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(verify_tables())

