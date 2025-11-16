# Fix CORS Error

## Problem
Frontend is running on port 5174, but backend CORS only allows port 5173.

## Solution

### Step 1: Update Backend .env File

Add port 5174 to CORS_ORIGINS in `backend/.env`:

```env
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

### Step 2: Restart Backend Server

After updating the .env file, restart the backend server:

```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

### Step 3: Verify Backend is Running

Check if backend is accessible:
- http://localhost:8000/health
- Should return: `{"status":"ok"}`

### Step 4: Test CORS

After restarting, the frontend should be able to make requests to the backend.

## Alternative: Use Port 5173 for Frontend

If you prefer to use port 5173 (the default Vite port):

1. Stop the frontend server
2. Make sure nothing else is using port 5173
3. Restart the frontend server
4. It should start on port 5173 by default

## Troubleshooting

### Backend Not Running
- Make sure backend server is running on port 8000
- Check: http://localhost:8000/docs

### CORS Still Not Working
- Verify `.env` file was updated
- Restart backend server after changing `.env`
- Check browser console for specific CORS errors

### Port Conflicts
- Frontend: Usually 5173 or 5174
- Backend: Usually 8000
- Make sure ports are not in use by other applications


