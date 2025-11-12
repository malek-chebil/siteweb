# Project Summary - Classifieds Web Platform

## Project Overview

This is a full-stack classifieds web platform similar to afribaba.com, specifically focused on "Massage à domicile et Plus" (Home Massage and More) services in Morocco. The platform allows users to create listings with photos, search/filter functionality, and includes admin moderation capabilities.

## Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL (via Supabase)
- **ORM**: SQLAlchemy (async)
- **Migrations**: Alembic
- **Authentication**: Supabase Auth (JWT)
- **Storage**: Supabase Storage (for images)
- **Validation**: Pydantic
- **API Documentation**: Swagger/OpenAPI (auto-generated)

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **UI Library**: Mantine v7
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Authentication**: Supabase Auth
- **HTTP Client**: Axios
- **Internationalization**: react-i18next (French & Arabic with RTL support)
- **Date Handling**: dayjs

### Infrastructure
- **Database Hosting**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Deployment**: Vercel (frontend), Render/Railway (backend)

## Project Structure

```
site Web/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI application entry point
│   │   ├── config.py               # Environment variables and settings
│   │   ├── database.py             # SQLAlchemy database setup
│   │   ├── models.py               # SQLAlchemy database models
│   │   ├── schemas.py              # Pydantic schemas for validation
│   │   ├── dependencies.py         # FastAPI dependencies (auth, etc.)
│   │   ├── routers/
│   │   │   ├── listings.py         # Listing CRUD operations
│   │   │   ├── admin.py            # Admin moderation endpoints
│   │   │   └── media.py            # Media upload endpoints
│   │   └── utils/
│   │       └── supabase_jwt.py     # JWT verification utility
│   ├── alembic/                    # Database migrations
│   ├── venv/                       # Python virtual environment
│   ├── .env                        # Environment variables (NOT in git)
│   ├── requirements.txt            # Python dependencies
│   ├── alembic.ini                 # Alembic configuration
│   └── start-server.bat            # Windows script to start server
│
└── frontend/
    ├── src/
    │   ├── main.jsx                # React entry point
    │   ├── App.jsx                 # Main React component
    │   ├── index.css               # Global CSS styles
    │   ├── router.jsx              # React Router configuration
    │   ├── lib/
    │   │   ├── supabase.js         # Supabase client
    │   │   └── api.js              # Axios API client
    │   ├── context/
    │   │   └── AuthContext.jsx     # Authentication context
    │   ├── components/
    │   │   ├── ListingCard.jsx     # Listing card component
    │   │   ├── FiltersBar.jsx      # Search/filter component
    │   │   ├── ImageUploader.jsx   # Image upload component
    │   │   ├── LanguageSwitcher.jsx # Language switcher
    │   │   ├── ProtectedRoute.jsx  # Protected route wrapper
    │   │   └── AdminRoute.jsx      # Admin route wrapper
    │   ├── layouts/
    │   │   ├── Layout.jsx          # Main public layout
    │   │   └── AdminLayout.jsx     # Admin panel layout
    │   ├── pages/
    │   │   ├── HomePage.jsx        # Home page with listings
    │   │   ├── ListingDetailPage.jsx # Listing detail page
    │   │   ├── ListingEditorPage.jsx # Create/edit listing page
    │   │   ├── LoginPage.jsx       # Login page
    │   │   ├── RegisterPage.jsx    # Registration page
    │   │   ├── MyListingsPage.jsx  # User's listings page
    │   │   ├── AdminDashboard.jsx  # Admin dashboard
    │   │   └── AdminModerationPage.jsx # Admin moderation page
    │   ├── styles/
    │   │   └── theme.js            # Mantine theme configuration
    │   └── i18n/
    │       ├── index.js            # i18n configuration
    │       └── locales/
    │           ├── fr.json         # French translations
    │           └── ar.json         # Arabic translations
    ├── .env                        # Environment variables (NOT in git)
    ├── package.json                # Node.js dependencies
    └── vite.config.js              # Vite configuration
```

## Database Models

### User Model
- `id` (UUID, primary key)
- `email` (string, unique)
- `is_admin` (boolean, default: false)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Listing Model
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to User)
- `title` (string)
- `description` (text)
- `city` (string)
- `category` (string)
- `price` (decimal, nullable)
- `phone` (string, nullable)
- `whatsapp` (string, nullable)
- `status` (enum: pending, approved, rejected)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### ListingMedia Model
- `id` (UUID, primary key)
- `listing_id` (UUID, foreign key to Listing)
- `url` (string)
- `created_at` (timestamp)

### ModerationLog Model
- `id` (UUID, primary key)
- `listing_id` (UUID, foreign key to Listing)
- `admin_id` (UUID, foreign key to User)
- `action` (enum: approved, rejected)
- `reason` (text, nullable)
- `created_at` (timestamp)

## API Endpoints

### Public Endpoints
- `GET /api/v1/listings` - Get all listings (with search, filter, pagination)
- `GET /api/v1/listings/{id}` - Get single listing
- `GET /health` - Health check
- `GET /` - API info

### Protected Endpoints (Require Authentication)
- `POST /api/v1/listings` - Create new listing
- `PUT /api/v1/listings/{id}` - Update listing (own or admin)
- `DELETE /api/v1/listings/{id}` - Delete listing (own or admin)
- `GET /api/v1/media/upload-url` - Get signed URL for image upload

### Admin Endpoints (Require Admin Role)
- `GET /api/v1/admin/stats` - Get admin statistics
- `GET /api/v1/admin/listings` - Get listings for moderation
- `POST /api/v1/admin/listings/{id}/approve` - Approve listing
- `POST /api/v1/admin/listings/{id}/reject` - Reject listing

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL database (via Supabase)
- Supabase account

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Create `.env` file:**
   ```env
   DATABASE_URL=postgresql+asyncpg://postgres:password@host:port/database
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_JWT_SECRET=your-jwt-secret
   CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
   API_V1_PREFIX=/api/v1
   DEBUG=False
   ```

6. **Run database migrations:**
   ```bash
   alembic upgrade head
   ```

7. **Start the server:**
   ```bash
   uvicorn app.main:app --reload
   ```

   Or use the batch file (Windows):
   ```bash
   start-server.bat
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_API_URL=http://localhost:8000/api/v1
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Key Features Implemented

### ✅ Completed Features

1. **Authentication**
   - User registration and login via Supabase
   - JWT token verification
   - Protected routes
   - Admin role checking

2. **Listings Management**
   - Create, read, update, delete listings
   - Image upload to Supabase Storage
   - Search and filter functionality
   - Pagination
   - Status management (pending, approved, rejected)

3. **Admin Panel**
   - Dashboard with statistics
   - Listing moderation (approve/reject)
   - Filter by status
   - Admin-only routes

4. **User Interface**
   - Responsive design (mobile, tablet, desktop)
   - Modern UI with Mantine v7
   - Listing cards with hover effects
   - Search and filter bar
   - Image carousel on listing details
   - WhatsApp and phone contact buttons

5. **Internationalization**
   - French (default)
   - Arabic (RTL support)
   - Language switcher
   - Translation files for all text

6. **API Features**
   - RESTful API design
   - CORS configuration
   - Error handling
   - Input validation with Pydantic
   - Pagination support
   - Search and filter support

## Important Fixes Applied

### 1. CORS Configuration
- **Issue**: Frontend running on port 5174, backend only allowed 5173
- **Fix**: Updated `CORS_ORIGINS` in backend `.env` to include both ports
- **File**: `backend/.env`, `backend/app/config.py`

### 2. Mantine v7 Compatibility
- **Issue**: Header and Navbar components not exported in v7
- **Fix**: Updated to use `AppShell.Header` and `AppShell.Navbar`
- **Files**: `frontend/src/layouts/Layout.jsx`, `frontend/src/layouts/AdminLayout.jsx`

### 3. Mantine CSS Not Loading
- **Issue**: Styles not applying - page looked unstyled
- **Fix**: Added explicit CSS imports in `main.jsx`
- **Files**: `frontend/src/main.jsx`
- **Changes**:
  ```javascript
  import '@mantine/core/styles.css'
  import '@mantine/notifications/styles.css'
  import '@mantine/dropzone/styles.css'
  import '@mantine/carousel/styles.css'
  ```

### 4. Database Connection
- **Issue**: IPv4/IPv6 connectivity issues with Supabase
- **Fix**: Used Supabase Session Pooler connection string
- **File**: `backend/.env`

### 5. Alembic Migrations
- **Issue**: Async SQLAlchemy with synchronous Alembic
- **Fix**: Modified `alembic/env.py` to use synchronous connection for migrations
- **Files**: `backend/alembic/env.py`, `backend/requirements.txt`

### 6. Environment Variables
- **Issue**: CORS_ORIGINS parsing error with pydantic-settings
- **Fix**: Changed to string type with property method to parse
- **File**: `backend/app/config.py`

### 7. CSS Styling Improvements
- Enhanced theme with better colors and typography
- Improved layout with better spacing and shadows
- Enhanced listing cards with hover effects
- Better filters bar design
- Improved auth pages styling
- Custom scrollbar
- Better responsive design

## Current State

### ✅ Working
- Backend API server running on port 8000
- Frontend development server running on port 5173/5174
- Database connected and migrations applied
- Authentication working with Supabase
- Listings CRUD operations
- Search and filter functionality
- Admin moderation panel
- Image upload to Supabase Storage
- Multilingual support (French/Arabic)
- Responsive design

### ⚠️ Known Issues
- None currently - all major issues have been resolved

### 📝 Next Steps

1. **Testing**
   - Write unit tests for backend
   - Write integration tests for API
   - Write component tests for frontend
   - E2E testing with Playwright/Cypress

2. **Features to Add**
   - User favorites/bookmarks
   - Listing reports functionality
   - Email notifications
   - User profiles
   - Reviews and ratings
   - Advanced search filters
   - Map integration (location-based search)
   - Payment integration (if needed)

3. **Optimization**
   - Image optimization and compression
   - Lazy loading for images
   - Code splitting
   - API response caching
   - Database query optimization
   - CDN for static assets

4. **Security**
   - Rate limiting (partially implemented)
   - Input sanitization
   - SQL injection prevention (SQLAlchemy handles this)
   - XSS prevention
   - CSRF protection
   - Content Security Policy (CSP)

5. **Deployment**
   - Set up CI/CD pipeline
   - Deploy backend to Render/Railway
   - Deploy frontend to Vercel
   - Set up production environment variables
   - Configure domain and SSL
   - Set up monitoring and logging

6. **Documentation**
   - API documentation (Swagger is auto-generated)
   - User guide
   - Admin guide
   - Developer documentation
   - Deployment guide

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql+asyncpg://postgres:password@host:port/database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_JWT_SECRET=your-jwt-secret
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
API_V1_PREFIX=/api/v1
DEBUG=False
RATE_LIMIT_ENABLED=True
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60
```

### Frontend (.env)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:8000/api/v1
```

## Supabase Setup

### Required Supabase Resources

1. **Database**
   - PostgreSQL database (automatically created)
   - Tables created via Alembic migrations

2. **Authentication**
   - Email/password authentication enabled
   - JWT secret for token verification

3. **Storage**
   - Bucket: `listing-images`
   - Public access for reading
   - Authenticated users can upload

### Supabase Configuration Steps

1. Create a new Supabase project
2. Get database connection string (use Session Pooler for IPv4 compatibility)
3. Get API keys (anon key and JWT secret)
4. Create storage bucket: `listing-images`
5. Set bucket policies:
   - Public read access
   - Authenticated users can upload
   - Users can only delete their own files

## Deployment Notes

### Backend Deployment (Render/Railway)

1. **Requirements:**
   - Python 3.10+
   - PostgreSQL database
   - Environment variables set

2. **Steps:**
   - Connect GitHub repository
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Set environment variables
   - Run migrations: `alembic upgrade head`

### Frontend Deployment (Vercel)

1. **Requirements:**
   - Node.js 18+
   - Environment variables set

2. **Steps:**
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Set environment variables
   - Deploy

## Troubleshooting

### Common Issues

1. **Styles not loading**
   - Solution: Restart frontend server after adding CSS imports
   - Check: `main.jsx` has all Mantine CSS imports

2. **CORS errors**
   - Solution: Update `CORS_ORIGINS` in backend `.env`
   - Restart backend server after changes

3. **Database connection errors**
   - Solution: Use Session Pooler connection string
   - Check: Database credentials are correct

4. **Migrations failing**
   - Solution: Check `alembic/env.py` uses synchronous connection
   - Verify: `DATABASE_URL` is correctly formatted

5. **Authentication not working**
   - Solution: Verify Supabase credentials in `.env`
   - Check: JWT secret matches Supabase project

## Important Files to Review

1. **Backend:**
   - `backend/app/config.py` - Configuration and environment variables
   - `backend/app/models.py` - Database models
   - `backend/app/routers/listings.py` - Listing API endpoints
   - `backend/app/dependencies.py` - Authentication dependencies

2. **Frontend:**
   - `frontend/src/main.jsx` - Entry point with CSS imports
   - `frontend/src/router.jsx` - Route configuration
   - `frontend/src/context/AuthContext.jsx` - Authentication context
   - `frontend/src/styles/theme.js` - Mantine theme configuration

## Development Workflow

1. **Start Backend:**
   ```bash
   cd backend
   venv\Scripts\activate
   uvicorn app.main:app --reload
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Run Migrations:**
   ```bash
   cd backend
   alembic upgrade head
   ```

4. **Create New Migration:**
   ```bash
   cd backend
   alembic revision --autogenerate -m "description"
   ```

## Contact & Support

For issues or questions:
- Check the troubleshooting section
- Review the fix documents in the project
- Check browser console for errors
- Check backend logs for API errors

## Notes for Next Developer/AI Agent

1. **Always restart servers** after changing environment variables or configuration
2. **Check browser console** for frontend errors
3. **Check backend logs** for API errors
4. **Verify Supabase credentials** if authentication fails
5. **Use Session Pooler** connection string for database (IPv4 compatibility)
6. **Mantine v7** requires explicit CSS imports - don't forget them
7. **CORS origins** must include all frontend URLs (ports 5173, 5174, 3000)
8. **Database migrations** use synchronous connection in Alembic
9. **All fixes** are documented in separate markdown files
10. **Theme customization** is in `frontend/src/styles/theme.js`

---

**Last Updated**: 2025-01-11
**Project Status**: ✅ Functional - Ready for testing and deployment
**Next Priority**: Testing, then deployment preparation


