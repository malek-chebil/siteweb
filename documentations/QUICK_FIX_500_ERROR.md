# ⚡ Quick Fix: Backend 500 Error

## The Problem

Your API endpoint returns **500 Internal Server Error**:
```
GET https://carthage-wellness-backend.onrender.com/api/v1/listings?page=1&page_size=20
Status: 500 Internal Server Error
```

## 🔍 Most Likely Causes (in order)

### 1. Database Connection Issue (90% likely) ⚠️

**Symptoms**:
- Error in logs: `Connection refused`, `Could not connect`, or `DATABASE_URL not found`

**Quick Fix**:
1. Go to: https://dashboard.render.com
2. Select your backend service
3. Go to **Environment** tab
4. Check if `DATABASE_URL` is set
5. If missing or wrong, update it:
   ```
   postgresql+asyncpg://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
   ```
6. Click **Save** - Render redeploys automatically
7. Wait 1-2 minutes
8. Test again

### 2. Missing Database Tables (70% likely) ⚠️

**Symptoms**:
- Error: `relation "listings" does not exist`

**Quick Fix**:
1. Go to Render Dashboard → Your Service → **Shell** tab
2. Run:
   ```bash
   cd backend
   alembic upgrade head
   ```
3. Or add to **Start Command** in Render:
   ```bash
   alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
4. Redeploy

### 3. Missing Environment Variables (60% likely) ⚠️

**Symptoms**:
- Error: `SUPABASE_URL not found` or `SUPABASE_JWT_SECRET not found`

**Quick Fix**:
1. In Render → Environment, verify these are ALL set:
   - ✅ `DATABASE_URL`
   - ✅ `SUPABASE_URL`
   - ✅ `SUPABASE_ANON_KEY`
   - ✅ `SUPABASE_JWT_SECRET`
   - ✅ `CORS_ORIGINS` (optional but recommended)
2. If any are missing, add them
3. Redeploy

## 🎯 Step-by-Step Diagnostic

### Step 1: Check if Backend is Running

Test the health endpoint:
```
https://carthage-wellness-backend.onrender.com/health
```

**Expected**: `{"status":"ok"}`

**If this fails**: Backend isn't running at all. Check Render service status.

### Step 2: Check Render Logs

1. Go to: https://dashboard.render.com
2. Select your backend service
3. Click **Logs** tab
4. Scroll to bottom (most recent)
5. Look for **red error messages**
6. **Copy the error** and share it with me

### Step 3: Check Environment Variables

In Render Dashboard → Your Service → **Environment**:

Verify these exist:
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `SUPABASE_URL` - Your Supabase project URL
- [ ] `SUPABASE_ANON_KEY` - Supabase anon key
- [ ] `SUPABASE_JWT_SECRET` - Supabase JWT secret

### Step 4: Test Locally (Optional)

If you want to test locally:

1. **Activate virtual environment**:
   ```bash
   cd backend
   venv\Scripts\activate
   ```

2. **Run diagnostic script**:
   ```bash
   python test_backend_connection.py
   ```

3. **This will check**:
   - Environment variables
   - Database connection
   - Table existence
   - Query functionality

## 🚀 Quick Fix Checklist

- [ ] Check Render logs for error message
- [ ] Verify all environment variables are set in Render
- [ ] Test health endpoint: `/health` returns `{"status":"ok"}`
- [ ] Run migrations if tables are missing: `alembic upgrade head`
- [ ] Restart backend service in Render
- [ ] Test listings endpoint again

## 📋 What to Share

If you need help, share:
1. **Error message from Render logs** (most important!)
2. **Health endpoint status** (`/health` working?)
3. **Environment variables status** (which ones are set?)
4. **Database connection** (does it work?)

---

**The Render logs will show the exact error - check them first!** 📋

