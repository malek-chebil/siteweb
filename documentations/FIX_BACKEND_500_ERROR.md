# 🔧 Fix Backend 500 Internal Server Error

## Problem

The API endpoint `/api/v1/listings?page=1&page_size=20` is returning **500 Internal Server Error**.

This means the request reaches the backend, but the backend crashes when processing it.

## Common Causes

### 1. Database Connection Issue ⚠️ **MOST LIKELY**

The backend can't connect to the database or the connection is failing.

**Check in Render**:
1. Go to: https://dashboard.render.com
2. Select your backend service
3. Go to **Logs** tab
4. Look for errors like:
   - `Connection refused`
   - `Database connection failed`
   - `Could not connect to database`
   - `DATABASE_URL not found`

**Fix**:
- Verify `DATABASE_URL` environment variable is set in Render
- Check that the DATABASE_URL is correct (should be Supabase direct connection)
- Verify Supabase database is active (not paused)

### 2. Missing Database Tables (Migrations Not Run)

The tables might not exist in the database.

**Check**:
- Look in Render logs for errors like:
  - `relation "listings" does not exist`
  - `table does not exist`
  - `column does not exist`

**Fix**:
1. **SSH into Render** or use Render shell
2. **Run migrations**:
   ```bash
   cd backend
   alembic upgrade head
   ```

   Or add this to Render's **Start Command** (temporary):
   ```bash
   alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

### 3. Missing Environment Variables

Some required environment variables might be missing.

**Required variables in Render**:
- ✅ `DATABASE_URL` - PostgreSQL connection string
- ✅ `SUPABASE_URL` - Supabase project URL
- ✅ `SUPABASE_ANON_KEY` - Supabase anon key
- ✅ `SUPABASE_JWT_SECRET` - Supabase JWT secret
- ✅ `CORS_ORIGINS` - Comma-separated list of allowed origins

**Fix**:
1. Go to Render → Your Service → **Environment**
2. Verify all required variables are set
2. Check for typos or missing values

### 4. Database Query Error

The query itself might be failing due to data issues.

**Possible issues**:
- Null values where not expected
- Invalid enum values
- Foreign key constraint violations

## How to Debug

### Step 1: Check Render Logs

1. Go to: https://dashboard.render.com
2. Select your backend service
3. Click **Logs** tab
4. Look for the **error message** and **stack trace**
5. The error message will tell you exactly what's wrong

### Step 2: Test Database Connection

Test if the database is accessible:

1. **In Render Dashboard**:
   - Go to your backend service
   - Click **Shell** tab (or use SSH)
   - Run:
     ```bash
     python -c "from app.database import engine; print('Database connection OK')"
     ```

2. **Test Health Endpoint**:
   - Visit: `https://carthage-wellness-backend.onrender.com/health`
   - Should return: `{"status":"ok"}`
   - If this fails, the backend isn't running at all

### Step 3: Check Specific Endpoint

1. **Test the endpoint directly**:
   ```bash
   curl https://carthage-wellness-backend.onrender.com/api/v1/listings?page=1&page_size=20
   ```

2. **Check response**:
   - If you get JSON with error details, that's helpful
   - If you get HTML error page, check Render logs

### Step 4: Verify Database Tables Exist

1. **Connect to Supabase**:
   - Go to: https://supabase.com/dashboard
   - Select your project
   - Go to **SQL Editor**

2. **Run this query**:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

3. **You should see**:
   - `users`
   - `listings`
   - `listing_media`
   - `moderation_logs`
   - `alembic_version` (if migrations ran)

## Quick Fixes

### Fix 1: Add Error Logging

Add better error handling to see what's happening. But first, **check Render logs** - they should show the error.

### Fix 2: Restart Backend

1. Go to Render Dashboard
2. Select your backend service
3. Click **Manual Deploy** → **Deploy latest commit**
4. Wait for deployment to complete
5. Test again

### Fix 3: Verify Environment Variables

Make sure all these are set in Render:

```
DATABASE_URL=postgresql+asyncpg://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT_REF].supabase.co
SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_JWT_SECRET=[YOUR_JWT_SECRET]
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,https://frontend-mocha-seven-19.vercel.app
DEBUG=False
API_V1_PREFIX=/api/v1
```

## Next Steps

1. ✅ **Check Render logs** - This will show you the exact error
2. ✅ **Verify database connection** - Test if DATABASE_URL is correct
3. ✅ **Run migrations** - Make sure tables exist
4. ✅ **Test health endpoint** - Make sure backend is running
5. ✅ **Check environment variables** - Make sure all are set

---

**The Render logs will tell you exactly what's wrong! Check them first! 📋**

