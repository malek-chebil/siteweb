# Fix White Page Issue - Step by Step

## Problem
White page in the frontend usually means:
1. JavaScript error preventing the app from loading
2. Missing environment variables
3. Backend not connected properly
4. CORS issues

## Solution Steps

### Step 1: Verify .env File

Make sure `frontend/.env` file exists and contains:
```env
VITE_SUPABASE_URL=https://cvtrghsdfkrwgasvnflb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2dHJnaHNkZmtyd2dhc3ZuZmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Mjc3NDQsImV4cCI6MjA3ODIwMzc0NH0.EKRO_aOfDQs9EiuSyiJvl-n4n4_6zncokZJ1d4GpqiU
VITE_API_URL=http://localhost:8000/api/v1
```

### Step 2: Check Browser Console

1. Open your browser (where you see the white page)
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab
4. Look for any red error messages
5. Common errors:
   - "Missing Supabase environment variables"
   - CORS errors
   - Network errors
   - React errors

### Step 3: Verify Backend is Running

1. Check if backend is running on port 8000
2. Open: http://localhost:8000/health
3. Should return: `{"status":"ok"}`

### Step 4: Check Backend CORS

Make sure backend `.env` has:
```env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Step 5: Restart Frontend Server

After updating `.env`:
1. Stop the frontend server (Ctrl+C in terminal)
2. Restart it: `npm run dev`
3. **Important:** Clear browser cache (Ctrl+Shift+R)

### Step 6: Check Network Tab

1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Refresh the page
4. Look for failed requests (red)
5. Check if API calls are being made

## Quick Fix Checklist

- [ ] `.env` file exists in `frontend/` folder
- [ ] `VITE_SUPABASE_URL` is set correctly
- [ ] `VITE_SUPABASE_ANON_KEY` is set correctly
- [ ] `VITE_API_URL` is set to `http://localhost:8000/api/v1`
- [ ] Backend server is running on port 8000
- [ ] Backend CORS includes `http://localhost:5173`
- [ ] Frontend server restarted after .env changes
- [ ] Browser cache cleared (Ctrl+Shift+R)
- [ ] No errors in browser console

## Common Errors and Solutions

### Error 1: "Missing Supabase environment variables"
**Solution:** 
- Check that `.env` file exists
- Verify all variables are set
- Restart the frontend server

### Error 2: CORS Error
**Solution:**
- Check backend CORS_ORIGINS includes frontend URL
- Restart backend server after changing CORS

### Error 3: Network Error / Failed to fetch
**Solution:**
- Make sure backend is running
- Check backend is accessible at http://localhost:8000
- Verify API_URL in frontend .env

### Error 4: White Page with No Errors
**Solution:**
- Check React components are rendering
- Look for infinite loops in useEffect
- Check if AuthContext is causing issues

## Testing the Connection

1. **Test Backend:**
   - Open: http://localhost:8000/docs
   - Should see Swagger UI

2. **Test Frontend API Call:**
   - Open browser console (F12)
   - Go to Network tab
   - Refresh page
   - Look for request to `/api/v1/listings`
   - Should return 200 OK

3. **Test Supabase:**
   - Check browser console for Supabase errors
   - Should see no errors related to Supabase

## Debug Steps

1. Open browser console (F12)
2. Check for any red errors
3. Copy the error message
4. Check Network tab for failed requests
5. Verify backend is running
6. Verify .env file is correct
7. Restart both frontend and backend

## Still Having Issues?

If you still see a white page:
1. Check the browser console for specific errors
2. Share the error message
3. Check if the backend is responding
4. Verify all environment variables are set

---

**After fixing the .env file and restarting the frontend server, the white page should be resolved!**

