# PowerShell script to start the backend server
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
Set-Location $PSScriptRoot
& .\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

