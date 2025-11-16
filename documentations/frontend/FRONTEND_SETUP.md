# Frontend Setup - Fix White Page Issue

## Problem
White page in the frontend is usually caused by:
1. Missing `.env` file or environment variables
2. JavaScript errors in the browser console
3. CORS issues between frontend and backend
4. Supabase configuration errors

## Solution

### Step 1: Create/Update .env File

The `.env` file in the `frontend` folder should contain:

```env
VITE_SUPABASE_URL=https://cvtrghsdfkrwgasvnflb.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_URL=http://localhost:8000/api/v1
```

### Step 2: Verify Backend CORS Settings

Make sure your backend `.env` includes the frontend URL:

```env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Step 3: Check Browser Console

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Look for any error messages
4. Common errors:
   - "Missing Supabase environment variables"
   - CORS errors
   - Network errors

### Step 4: Restart Frontend Server

After updating `.env`:
1. Stop the frontend server (Ctrl+C)
2. Restart it: `npm run dev`
3. Clear browser cache (Ctrl+Shift+R)

## Quick Fix Checklist

- [ ] `.env` file exists in `frontend/` folder
- [ ] `VITE_SUPABASE_URL` is set
- [ ] `VITE_SUPABASE_ANON_KEY` is set
- [ ] `VITE_API_URL` is set to `http://localhost:8000/api/v1`
- [ ] Backend CORS includes `http://localhost:5173`
- [ ] Backend server is running on port 8000
- [ ] Frontend server is running on port 5173
- [ ] No errors in browser console

## Testing Connection

1. Open browser console (F12)
2. Check for any errors
3. Try accessing: http://localhost:8000/api/v1/listings
4. Should return JSON (empty array if no listings)

## Common Issues

### Issue 1: "Missing Supabase environment variables"
**Solution:** Check that `.env` file exists and has correct values

### Issue 2: CORS Error
**Solution:** Verify backend CORS_ORIGINS includes frontend URL

### Issue 3: Network Error
**Solution:** Make sure backend is running on port 8000

### Issue 4: Blank Page
**Solution:** Check browser console for JavaScript errors

