# Fix CORS Error - Step by Step

## Problem
```
Access to XMLHttpRequest at 'http://localhost:8000/api/v1/listings' 
from origin 'http://localhost:5174' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Cause:** Frontend is running on port 5174, but backend CORS only allows port 5173.

## Solution

### ✅ Step 1: Update Backend .env (DONE)
The `.env` file has been updated to include port 5174:
```env
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

### ⚠️ Step 2: Restart Backend Server (REQUIRED)
**You must restart the backend server for the changes to take effect!**

1. **Stop the backend server:**
   - Press `Ctrl+C` in the terminal where the backend is running

2. **Restart the backend server:**
   ```bash
   cd backend
   venv\Scripts\activate
   uvicorn app.main:app --reload
   ```

3. **Verify backend is running:**
   - Open: http://localhost:8000/health
   - Should return: `{"status":"ok"}`

### ✅ Step 3: Test Frontend
After restarting the backend:
1. Refresh your browser (Ctrl+Shift+R)
2. The CORS error should be gone
3. The frontend should load listings from the backend

## Alternative Solution: Use Port 5173

If you prefer to use the default Vite port (5173):

1. **Stop the frontend server** (Ctrl+C)
2. **Make sure port 5173 is free**
3. **Restart the frontend server:**
   ```bash
   cd frontend
   npm run dev
   ```
4. Frontend should start on port 5173

## Troubleshooting

### Backend Not Running
- Make sure backend server is running on port 8000
- Check: http://localhost:8000/docs
- If not running, start it using the commands above

### CORS Still Not Working After Restart
1. Verify `.env` file was updated correctly
2. Check that backend server was restarted
3. Clear browser cache (Ctrl+Shift+R)
4. Check browser console for specific errors

### Port Conflicts
- **Frontend:** Usually 5173 or 5174 (Vite auto-selects available port)
- **Backend:** Usually 8000
- Make sure ports are not in use by other applications

## Quick Checklist

- [x] Backend `.env` updated to include port 5174
- [ ] Backend server restarted
- [ ] Backend accessible at http://localhost:8000/health
- [ ] Frontend refreshed (Ctrl+Shift+R)
- [ ] CORS error resolved

## After Fix

Once the backend is restarted, the frontend should be able to:
- Load listings from the backend
- Make API requests without CORS errors
- Display the home page with listings

---

**Next Step: Restart the backend server to apply the CORS changes!**


