# How to Start the Backend Server

## Quick Start

### Step 1: Navigate to Backend Folder
```bash
cd backend
```

### Step 2: Activate Virtual Environment
```bash
# On Windows (PowerShell):
venv\Scripts\activate

# On Mac/Linux:
source venv/bin/activate
```

### Step 3: Start the Server
```bash
uvicorn app.main:app --reload
```

The server will start on: **http://localhost:8000**

## Alternative: Start with Specific Host/Port

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Verify Server is Running

1. Open your browser
2. Go to: http://localhost:8000/docs
3. You should see the Swagger API documentation

Or test the health endpoint:
- http://localhost:8000/health
- Should return: `{"status":"ok"}`

## Stop the Server

Press **Ctrl+C** in the terminal where the server is running

## Troubleshooting

### Error: "uvicorn: command not found"
**Solution:** Make sure virtual environment is activated and uvicorn is installed
```bash
pip install uvicorn
```

### Error: "Module not found"
**Solution:** Install dependencies
```bash
pip install -r requirements.txt
```

### Error: "Port already in use"
**Solution:** 
- Stop any other process using port 8000
- Or use a different port: `uvicorn app.main:app --reload --port 8001`

### Error: "DATABASE_URL not found"
**Solution:** Make sure `.env` file exists in the backend folder with all required variables

## Running in Background (Optional)

### Windows (PowerShell):
```powershell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; venv\Scripts\activate; uvicorn app.main:app --reload"
```

### Mac/Linux:
```bash
nohup uvicorn app.main:app --reload > server.log 2>&1 &
```

## Production Mode (No Auto-reload)

For production, remove `--reload`:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

