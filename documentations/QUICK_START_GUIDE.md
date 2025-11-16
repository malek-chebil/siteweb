# Quick Start Guide - Classifieds Platform

## What Is This Project?

A full-stack classifieds web platform for "Massage à domicile et Plus" services in Morocco. Built with FastAPI (backend) and React + Mantine (frontend).

## Quick Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
# Create .env file (see below)
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
# Create .env file (see below)
npm run dev
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql+asyncpg://postgres:password@host:port/database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_JWT_SECRET=your-jwt-secret
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

### Frontend (.env)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:8000/api/v1
```

## Key Files

- `backend/app/main.py` - API server
- `backend/app/config.py` - Configuration
- `frontend/src/main.jsx` - React entry (has CSS imports!)
- `frontend/src/router.jsx` - Routes
- `frontend/src/styles/theme.js` - Theme config

## Important Notes

1. **Mantine CSS**: Must import CSS files in `main.jsx` (already done)
2. **CORS**: Backend must allow frontend ports (5173, 5174)
3. **Database**: Use Session Pooler connection string for Supabase
4. **Migrations**: Use synchronous connection in Alembic
5. **Restart servers** after .env changes

## Current Status

✅ Backend running on port 8000
✅ Frontend running on port 5173/5174
✅ Database connected
✅ Authentication working
✅ All features implemented
✅ Styling fixed and working

## Next Steps

1. Testing
2. Deployment
3. Additional features (see PROJECT_SUMMARY_COMPLETE.md)

## Troubleshooting

- **Styles not loading**: Restart frontend server
- **CORS errors**: Update CORS_ORIGINS in backend .env and restart
- **Database errors**: Check connection string format
- **Auth errors**: Verify Supabase credentials

For detailed information, see `PROJECT_SUMMARY_COMPLETE.md`


