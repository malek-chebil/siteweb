# Backend API - Classifieds Platform

FastAPI backend for the classifieds web platform.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your Supabase credentials and database URL.

4. Run Alembic migrations:
```bash
alembic upgrade head
```

5. Run the server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string (asyncpg format)
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_JWT_SECRET`: Supabase JWT secret for token verification
- `CORS_ORIGINS`: Comma-separated list of allowed CORS origins

## Project Structure

```
backend/
├── app/
│   ├── main.py          # FastAPI app
│   ├── config.py        # Configuration
│   ├── database.py      # Database setup
│   ├── models.py        # SQLAlchemy models
│   ├── schemas.py       # Pydantic schemas
│   ├── dependencies.py  # Auth dependencies
│   ├── routers/         # API routers
│   │   ├── listings.py
│   │   ├── admin.py
│   │   └── media.py
│   └── utils/
│       └── supabase_jwt.py
├── alembic/             # Database migrations
└── requirements.txt
```

## Deployment

### Render/Railway

1. Set environment variables in your deployment platform
2. The platform will automatically run migrations on deploy
3. Ensure `DATABASE_URL` points to your Supabase PostgreSQL database

### Database Migrations

```bash
# Create a new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `GET /api/v1/listings` - Get listings (approved only)
- `GET /api/v1/listings/{id}` - Get single listing

### Authenticated Endpoints
- `POST /api/v1/listings` - Create listing
- `PUT /api/v1/listings/{id}` - Update listing (owner only)
- `DELETE /api/v1/listings/{id}` - Delete listing (owner only)
- `POST /api/v1/media/signed-url` - Get signed URL for image upload

### Admin Endpoints
- `GET /api/v1/admin/listings` - Get all listings with status filter
- `POST /api/v1/admin/listings/{id}/approve` - Approve listing
- `POST /api/v1/admin/listings/{id}/reject` - Reject listing
- `GET /api/v1/admin/listings/{id}/logs` - Get moderation logs
- `GET /api/v1/admin/stats` - Get admin statistics

