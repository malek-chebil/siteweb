# 🔍 How to Check Render Logs and Fix 500 Error

## Step 1: Access Render Logs

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Login** with your account
3. **Click on your backend service** (should be named something like `carthage-wellness-backend`)
4. **Click on "Logs" tab** at the top
5. **Scroll to the bottom** to see the most recent logs

## Step 2: Look for Error Messages

In the logs, look for:
- ❌ **Red error messages**
- 🔴 **Stack traces** (lines that show `Traceback` or `Exception`)
- ⚠️ **Warnings** about missing variables or connections

## Common Errors and Fixes

### Error 1: "DATABASE_URL not found"
```
Error: DATABASE_URL environment variable is required
```

**Fix**:
1. In Render Dashboard → Your Service → **Environment** tab
2. Click **"Add Environment Variable"**
3. Key: `DATABASE_URL`
4. Value: `postgresql+asyncpg://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres`
5. Click **Save** - Render will redeploy automatically

### Error 2: "relation 'listings' does not exist"
```
sqlalchemy.exc.ProgrammingError: relation "listings" does not exist
```

**Fix** - Run migrations:
1. In Render Dashboard → Your Service
2. Click **"Shell"** tab (or use SSH)
3. Run:
   ```bash
   cd backend
   alembic upgrade head
   ```

Or add to **Start Command** in Render:
```bash
alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Error 3: "Connection refused" or "Could not connect"
```
asyncpg.exc.InvalidPasswordError: password authentication failed
```

**Fix**:
- Check `DATABASE_URL` is correct
- Verify database password in Supabase Dashboard
- Make sure you're using **direct connection** (port 5432), not pooler (port 6543)

### Error 4: "SUPABASE_JWT_SECRET not found"
```
Error: SUPABASE_JWT_SECRET environment variable is required
```

**Fix**:
1. Go to Supabase Dashboard → Settings → API
2. Click **"Reveal"** next to JWT Secret
3. Copy the secret
4. In Render → Environment → Add `SUPABASE_JWT_SECRET` with the copied value

### Error 5: Import errors
```
ModuleNotFoundError: No module named 'xxx'
```

**Fix**:
- Check `requirements.txt` includes all dependencies
- Render should install automatically, but you can force reinstall by redeploying

## Step 3: Test the Backend Locally

If you want to test locally before fixing Render:

1. **Activate virtual environment**:
   ```bash
   cd backend
   venv\Scripts\activate  # Windows
   # or
   source venv/bin/activate  # Mac/Linux
   ```

2. **Run diagnostic script**:
   ```bash
   python test_backend_connection.py
   ```

3. **This will check**:
   - ✅ Environment variables are set
   - ✅ Database connection works
   - ✅ Tables exist
   - ✅ Listings query works

## Step 4: Verify Render Environment Variables

Make sure these are ALL set in Render → Environment:

### Required Variables:

1. **DATABASE_URL**
   ```
   postgresql+asyncpg://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
   ```

2. **SUPABASE_URL**
   ```
   https://[PROJECT_REF].supabase.co
   ```

3. **SUPABASE_ANON_KEY**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   (Get from Supabase Dashboard → Settings → API)

4. **SUPABASE_JWT_SECRET**
   ```
   your-jwt-secret-here
   ```
   (Get from Supabase Dashboard → Settings → API → Reveal JWT Secret)

5. **CORS_ORIGINS** (optional but recommended)
   ```
   http://localhost:5173,http://localhost:5174,https://frontend-mocha-seven-19.vercel.app
   ```

6. **DEBUG** (optional)
   ```
   False
   ```

7. **API_V1_PREFIX** (optional, defaults to `/api/v1`)
   ```
   /api/v1
   ```

## Step 5: Force Redeploy

After fixing environment variables:

1. In Render Dashboard → Your Service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Wait for deployment to complete (1-2 minutes)
4. Test the endpoint again:
   ```
   https://carthage-wellness-backend.onrender.com/api/v1/listings?page=1&page_size=20
   ```

## Step 6: Test Health Endpoint

Test if backend is running at all:

```
https://carthage-wellness-backend.onrender.com/health
```

Should return:
```json
{"status":"ok"}
```

If this fails, the backend isn't running at all.

---

**Next Step**: Check Render logs and share the error message with me, or run the diagnostic script locally!

