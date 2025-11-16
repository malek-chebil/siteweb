# Debug White Page Issue

## Common Causes

### 1. Missing Environment Variables
**Symptoms:** White page, console shows "Missing Supabase environment variables"

**Solution:**
- Check that `frontend/.env` exists
- Verify all variables are set:
  ```
  VITE_SUPABASE_URL=https://cvtrghsdfkrwgasvnflb.supabase.co
  VITE_SUPABASE_ANON_KEY=your-key-here
  VITE_API_URL=http://localhost:8000/api/v1
  ```
- **Restart the frontend server** after creating/updating .env

### 2. JavaScript Errors
**Symptoms:** White page, errors in browser console

**How to Check:**
1. Open browser (F12)
2. Go to Console tab
3. Look for red errors

**Common Errors:**
- `Cannot read property 'X' of undefined`
- `Module not found`
- `Failed to fetch`

### 3. Backend Not Running
**Symptoms:** White page, network errors in console

**Solution:**
- Start backend server: `cd backend && venv\Scripts\activate && uvicorn app.main:app --reload`
- Verify: http://localhost:8000/health returns `{"status":"ok"}`

### 4. CORS Issues
**Symptoms:** Network errors in console, "CORS policy" errors

**Solution:**
- Check backend `.env` has: `CORS_ORIGINS=http://localhost:5173,http://localhost:3000`
- Restart backend after changing CORS settings

### 5. Missing Dependencies
**Symptoms:** Module not found errors

**Solution:**
```bash
cd frontend
npm install
```

### 6. Router Issues
**Symptoms:** White page, no errors in console

**Solution:**
- Check browser URL is correct
- Verify all route components exist
- Check router.jsx for syntax errors

## Step-by-Step Debugging

### Step 1: Check Browser Console
1. Open browser (where you see white page)
2. Press F12
3. Go to Console tab
4. Copy any red errors
5. Share the error message

### Step 2: Check Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Refresh the page
4. Look for failed requests (red)
5. Check if API calls are being made

### Step 3: Verify Environment
1. Check `.env` file exists in `frontend/` folder
2. Verify all variables are set
3. Restart frontend server

### Step 4: Test Backend
1. Open: http://localhost:8000/docs
2. Should see Swagger UI
3. If not, start backend server

### Step 5: Check React DevTools
1. Install React DevTools extension
2. Check if components are rendering
3. Look for component errors

## Quick Fixes

### Fix 1: Restart Everything
```bash
# Stop both servers (Ctrl+C)
# Then restart:

# Terminal 1 - Backend
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Fix 2: Clear Browser Cache
1. Press Ctrl+Shift+R (hard refresh)
2. Or clear browser cache manually

### Fix 3: Reinstall Dependencies
```bash
cd frontend
rm -rf node_modules
npm install
```

### Fix 4: Check Port Conflicts
- Backend should be on port 8000
- Frontend should be on port 5173
- If ports are taken, change them

## Still Not Working?

1. **Check the exact error message** in browser console
2. **Verify backend is running** and accessible
3. **Check .env file** has all required variables
4. **Restart both servers** after any changes
5. **Clear browser cache** and hard refresh

## Need More Help?

Share:
1. Browser console errors (screenshot or copy/paste)
2. Network tab errors
3. Backend server logs
4. Frontend server logs

This will help identify the exact issue!


