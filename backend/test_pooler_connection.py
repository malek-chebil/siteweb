"""Test pooler connection with different password formats"""
import asyncio
import asyncpg
from urllib.parse import quote, unquote

async def test_pooler_connection():
    """Test connection with pooler format"""
    password = "Malouka33@@"
    project_ref = "cvtrghsdfkrwgasvnflb"
    host = "aws-1-eu-west-1.pooler.supabase.com"
    port = 5432
    database = "postgres"
    
    # Try different user formats
    user_formats = [
        f"postgres.{project_ref}",  # Pooler format
        "postgres",  # Standard format
    ]
    
    # Try different password encodings
    password_variants = [
        password,  # Plain
        quote(password),  # URL-encoded
    ]
    
    print("Testing pooler connection...")
    print(f"Host: {host}:{port}")
    print(f"Database: {database}")
    print(f"Password: {password}")
    print()
    
    for user_format in user_formats:
        for pwd_variant in password_variants:
            try:
                print(f"Trying: user={user_format}, password={pwd_variant[:10]}...")
                conn = await asyncpg.connect(
                    host=host,
                    port=port,
                    user=user_format,
                    password=pwd_variant,
                    database=database,
                    timeout=5
                )
                print(f"✅ SUCCESS with user={user_format}, password={pwd_variant[:10]}")
                await conn.close()
                return True
            except asyncpg.exceptions.InvalidPasswordError:
                print(f"❌ Invalid password with user={user_format}")
            except Exception as e:
                print(f"❌ Error with user={user_format}: {type(e).__name__}")
            print()
    
    print("❌ All connection attempts failed")
    print()
    print("Possible issues:")
    print("1. Password might be incorrect in Supabase")
    print("2. User format might be wrong")
    print("3. Database might not be accessible")
    print()
    print("Please verify:")
    print("- Password in Supabase Dashboard > Settings > Database")
    print("- Try resetting the database password")
    return False

if __name__ == "__main__":
    asyncio.run(test_pooler_connection())

