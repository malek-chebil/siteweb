# Troubleshooting Database Connection Issues

## Current Error

```
could not translate host name "db.cvtrghsdfkrwgasvnflb.supabase.co" to address: Name or service not known
```

This is a **DNS/network connectivity issue**, not a password or configuration problem.

## Possible Causes

### 1. Supabase Project Not Fully Provisioned
- **Solution:** Check your Supabase dashboard
- Go to your project and verify it shows "Active" status
- Wait a few minutes if the project was just created

### 2. Incorrect Hostname
- **Solution:** Verify the connection string in Supabase
- Go to: **Settings > Database > Connection string**
- Make sure you're using the correct hostname
- The format should be: `db.[PROJECT_REF].supabase.co`

### 3. Network/Firewall Issue
- **Solution:** Check your internet connection
- Try accessing Supabase dashboard in your browser
- Check if your firewall is blocking PostgreSQL connections (port 5432)

### 4. DNS Resolution Problem
- **Solution:** Try using a different DNS server
- Or wait a few minutes and try again
- DNS changes can take time to propagate

## Steps to Fix

### Step 1: Verify Supabase Project
1. Go to https://supabase.com/dashboard
2. Check if your project is active
3. Go to **Settings > Database**
4. Verify the connection string format

### Step 2: Get the Correct Connection String
1. In Supabase Dashboard > Settings > Database
2. Look for **"Connection string"** or **"Connection info"**
3. Make sure you're copying the **direct connection** (not pooler)
4. It should look like: `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres`

### Step 3: Test Connection
Try connecting with a PostgreSQL client:
- Use pgAdmin, DBeaver, or psql
- Or use Supabase's built-in SQL Editor to verify the database is accessible

### Step 4: Check Network Connectivity
```bash
# Test if hostname resolves
ping db.cvtrghsdfkrwgasvnflb.supabase.co

# Test DNS resolution
nslookup db.cvtrghsdfkrwgasvnflb.supabase.co

# Test port connectivity (if you have telnet)
telnet db.cvtrghsdfkrwgasvnflb.supabase.co 5432
```

### Step 5: Verify Your Connection String
Your current connection string format:
```
DATABASE_URL=postgresql+asyncpg://postgres:Malouka33%40%40@db.cvtrghsdfkrwgasvnflb.supabase.co:5432/postgres
```

**Things to verify:**
- ✅ Password encoding is correct (`%40` for `@`)
- ✅ Hostname format is correct (`db.[REF].supabase.co`)
- ✅ Port is correct (`5432`)
- ✅ Database name is correct (`postgres`)

## Alternative: Use Connection Pooling

If direct connection doesn't work, try using Supabase's connection pooler:

1. Go to **Settings > Database > Connection pooling**
2. Use the **pooler connection string** (port 6543)
3. Format: `postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`

**Note:** For migrations, you might still need the direct connection.

## Quick Test

Try this Python script to test the connection:

```python
import asyncpg
import asyncio

async def test_connection():
    try:
        conn = await asyncpg.connect(
            host='db.cvtrghsdfkrwgasvnflb.supabase.co',
            port=5432,
            user='postgres',
            password='Malouka33@@',
            database='postgres'
        )
        print("✅ Connection successful!")
        await conn.close()
    except Exception as e:
        print(f"❌ Connection failed: {e}")

asyncio.run(test_connection())
```

## Still Having Issues?

1. **Double-check your Supabase project reference:**
   - Your project URL: `https://cvtrghsdfkrwgasvnflb.supabase.co`
   - Project ref: `cvtrghsdfkrwgasvnflb`
   - Database hostname should be: `db.cvtrghsdfkrwgasvnflb.supabase.co`

2. **Reset database password:**
   - Go to Settings > Database > Database password
   - Click "Reset database password"
   - Update your `.env` file with the new password
   - Make sure to URL-encode any special characters

3. **Contact Supabase support:**
   - If the project is active but you still can't connect
   - They can verify if there are any issues on their end

## Summary

The password encoding is now correct. The issue is network/DNS related. Once you can resolve the hostname, the migrations should work.

