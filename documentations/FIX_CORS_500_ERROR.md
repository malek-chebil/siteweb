# 🔧 Fix CORS 500 Error - Production Deployment

## Problem

The API is returning CORS 500 error because:
1. **Backend CORS_ORIGINS** doesn't include your production frontend URL
2. The backend on Render needs to be updated with the correct frontend URL

## Solution

### Step 1: Get Your Frontend Production URL ✅

Your frontend is deployed at:
- **Main URL**: `https://frontend-mocha-seven-19.vercel.app/`
- **Latest deployment**: `https://frontend-3fr3ggwxx-malekchebils-projects.vercel.app`

### Step 2: Get Your Backend URL

Based on your docs, your backend should be on Render:
- **Backend URL**: `https://carthage-wellness-backend.onrender.com`
- **Health check**: `https://carthage-wellness-backend.onrender.com/health`
- **API base**: `https://carthage-wellness-backend.onrender.com/api/v1`

### Step 3: Update Backend CORS in Render ⚠️ **CRITICAL**

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Select your backend service** (should be named something like "carthage-wellness-backend")
3. **Go to Environment tab**
4. **Find `CORS_ORIGINS` variable**
5. **Update it to include your production frontend URL**:

```
http://localhost:5173,http://localhost:5174,http://localhost:3000,https://frontend-mocha-seven-19.vercel.app,https://frontend-*.vercel.app
```

Or if you want to be more specific:
```
http://localhost:5173,http://localhost:5174,http://localhost:3000,https://frontend-mocha-seven-19.vercel.app
```

**⚠️ IMPORTANT**: Vercel generates deployment URLs with wildcards like `*-*.vercel.app`. To allow all Vercel preview URLs, you can use:
```
http://localhost:5173,http://localhost:5174,http://localhost:3000,https://frontend-*.vercel.app,https://frontend-mocha-seven-19.vercel.app
```

6. **Click "Save Changes"**
7. **Render will automatically redeploy** (this takes 1-2 minutes)

### Step 4: Verify VITE_API_URL in Vercel ✅

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your `frontend` project**
3. **Go to Settings → Environment Variables**
4. **Verify `VITE_API_URL` is set to**:
   ```
   https://carthage-wellness-backend.onrender.com/api/v1
   ```
   (NOT `http://localhost:8000/api/v1`)

5. **If it's wrong, update it**:
   - Click the three dots (⋯) next to `VITE_API_URL`
   - Click "Edit"
   - Update value to: `https://carthage-wellness-backend.onrender.com/api/v1`
   - Select environments: **Production**, **Preview**, **Development**
   - Click "Save"
6. **Redeploy** your frontend after updating (or wait for auto-deploy if connected to GitHub)

### Step 5: Test the Fix

1. **Wait for Render to redeploy** (1-2 minutes)
2. **Wait for Vercel to redeploy** (if you updated VITE_API_URL)
3. **Test backend health**: https://carthage-wellness-backend.onrender.com/health
   - Should return: `{"status":"ok"}`
4. **Open your frontend**: https://frontend-mocha-seven-19.vercel.app
5. **Open browser console** (F12)
6. **Try to use the app** - CORS errors should be gone!

## Alternative: Allow All Vercel URLs

If you want to allow ALL Vercel preview deployments, you can update CORS_ORIGINS to:

```
http://localhost:5173,http://localhost:5174,http://localhost:3000,https://*.vercel.app
```

**⚠️ Security Note**: This is less secure but more flexible for development.

## Quick Checklist

- [ ] Found backend URL in Render dashboard
- [ ] Updated `CORS_ORIGINS` in Render to include production frontend URL
- [ ] Render redeployed successfully
- [ ] Verified `VITE_API_URL` in Vercel is correct
- [ ] Frontend redeployed (if VITE_API_URL was updated)
- [ ] Tested backend health endpoint
- [ ] Tested frontend - no CORS errors

## Troubleshooting

### Backend not found in Render
- Check if backend is deployed: https://dashboard.render.com
- Look for a service with name like "carthage-wellness-backend"
- If not deployed, deploy it first!

### CORS still not working after update
1. **Clear browser cache**
2. **Wait 2-3 minutes** for both services to redeploy
3. **Check Render logs** for errors
4. **Verify CORS_ORIGINS** format (no spaces, comma-separated)
5. **Test backend directly**: `curl -I https://carthage-wellness-backend.onrender.com/health`

### Backend returning 500 errors
- Check **Render logs** for error messages
- Verify database connection is working
- Check if migrations ran successfully
- Verify all environment variables are set in Render

---

**After fixing CORS, your app should work! 🚀**

