# 🧘 Carthage Wellness Spa

Plateforme complète de petites annonces dédiée aux services de bien-être et massage en Tunisie.

## 🌟 Description

Carthage Wellness Spa est une plateforme web full-stack permettant aux utilisateurs de publier, rechercher et gérer des annonces de services de bien-être, massage, spa, et esthétique. La plateforme inclut un système d'authentification, de gestion d'images, de modération admin, et de recherche avancée.

**🌐 Site Web**: [En cours de déploiement](https://vercel.com)
**📱 Responsive**: Optimisé pour mobile et desktop
**🌍 Langues**: Français (par défaut), Arabe

## 🚀 Features

### User Features
- ✅ User authentication (Supabase Auth)
- ✅ Create, edit, and delete listings
- ✅ Upload up to 10 images per listing
- ✅ Search and filter listings (city, category, price, keyword)
- ✅ Click-to-WhatsApp and click-to-call
- ✅ Favorite listings (localStorage)
- ✅ Report listings
- ✅ Multi-language support (French, Arabic RTL)

### Admin Features
- ✅ Admin dashboard with statistics
- ✅ Moderate listings (approve/reject)
- ✅ View moderation logs
- ✅ View all listings with status filters

## 🛠️ Technology Stack

### Backend
- **FastAPI** (Python) - REST API
- **PostgreSQL** (Supabase) - Database
- **SQLAlchemy** - ORM
- **Alembic** - Database migrations
- **JWT Auth** - Supabase-compatible authentication

### Frontend
- **React** (Vite) - UI Framework
- **Mantine UI** - Component library
- **React Router** - Routing
- **Supabase Auth** - Authentication
- **Supabase Storage** - Image storage
- **React Query** - Data fetching
- **i18next** - Internationalization

## 📁 Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app
│   │   ├── config.py            # Configuration
│   │   ├── database.py          # Database setup
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── dependencies.py      # Auth dependencies
│   │   ├── routers/             # API routers
│   │   │   ├── listings.py
│   │   │   ├── admin.py
│   │   │   └── media.py
│   │   └── utils/
│   │       └── supabase_jwt.py  # JWT verification
│   ├── alembic/                 # Database migrations
│   ├── requirements.txt
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── layouts/             # Layout components
│   │   ├── context/             # React context
│   │   ├── lib/                 # API clients
│   │   ├── i18n/                # Translations
│   │   └── styles/              # Theme
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL database (Supabase)
- Supabase account

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Create `.env` file:**
```bash
cp .env.example .env
```

5. **Update `.env` with your credentials:**
```env
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_JWT_SECRET=your-jwt-secret
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
DEBUG=True
```

6. **Run database migrations:**
```bash
alembic upgrade head
```

7. **Start the server:**
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

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
```bash
cp .env.example .env
```

4. **Update `.env` with your credentials:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:8000/api/v1
```

5. **Start the development server:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🔧 Supabase Setup

### 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Configure Database

1. Get your database connection string from Supabase
2. Update `DATABASE_URL` in backend `.env`
3. Run migrations to create tables

### 3. Configure Storage

1. Go to Storage in Supabase dashboard
2. Create a bucket named `listing-images`
3. Set bucket to **Public** (or configure RLS policies)
4. Enable CORS for your frontend domain

### 4. Configure Authentication

1. Go to Authentication > Settings
2. Enable Email provider
3. Configure email templates (optional)
4. Get JWT secret from Settings > API

### 5. Set Admin Users

To make a user admin, update the `users` table in Supabase:

```sql
UPDATE users SET is_admin = true WHERE email = 'admin@example.com';
```

## 🚀 Deployment

### Backend Deployment (Render/Railway)

1. **Create a new service:**
   - Connect your GitHub repository
   - Select the `backend` directory as root

2. **Set environment variables:**
   - `DATABASE_URL` - Your Supabase PostgreSQL connection string
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_ANON_KEY` - Your Supabase anon key
   - `SUPABASE_JWT_SECRET` - Your Supabase JWT secret
   - `CORS_ORIGINS` - Your frontend URL (e.g., `https://your-app.vercel.app`)
   - `DEBUG` - Set to `False` for production

3. **Build command:**
```bash
pip install -r requirements.txt
```

4. **Start command:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

5. **Run migrations:**
   - Add a post-deploy script or run manually:
```bash
alembic upgrade head
```

### Frontend Deployment (Vercel)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
cd frontend
vercel
```

3. **Set environment variables in Vercel dashboard:**
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `VITE_API_URL` - Your backend API URL (e.g., `https://your-api.render.com/api/v1`)

4. **Configure build settings:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Alternative: Railway Deployment

1. **Create a new project on Railway**
2. **Connect GitHub repository**
3. **Add backend service:**
   - Root directory: `backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. **Add frontend service:**
   - Root directory: `frontend`
   - Build command: `npm install && npm run build`
   - Start command: `npm run preview`

## 📝 API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `GET /api/v1/listings` - Get listings (approved only)
- `GET /api/v1/listings/{id}` - Get single listing

### Authenticated Endpoints
- `POST /api/v1/listings` - Create listing
- `PUT /api/v1/listings/{id}` - Update listing (owner only)
- `DELETE /api/v1/listings/{id}` - Delete listing (owner only)
- `POST /api/v1/media/signed-url` - Get file path for upload

### Admin Endpoints
- `GET /api/v1/admin/listings` - Get all listings with status filter
- `POST /api/v1/admin/listings/{id}/approve` - Approve listing
- `POST /api/v1/admin/listings/{id}/reject` - Reject listing
- `GET /api/v1/admin/listings/{id}/logs` - Get moderation logs
- `GET /api/v1/admin/stats` - Get admin statistics

## 🔒 Security

- JWT token verification for all authenticated endpoints
- Admin route protection
- Input validation with Pydantic
- CORS configuration
- Rate limiting (optional)
- Image upload validation

## 🌍 Internationalization

The platform supports:
- **French** (default)
- **Arabic** (RTL support)

To add more languages, edit `frontend/src/i18n/locales/` and add translation files.

## 🎨 Styling

The platform uses **Mantine UI** with a custom yellow theme:
- Primary color: `#FFC300` (McDonald's style yellow)
- Modern card design with rounded corners
- Mobile-responsive layout
- Dark mode support (can be enabled)

## 📊 Database Schema

### Users
- `id` (UUID) - Primary key
- `email` - User email
- `is_admin` - Admin flag
- `created_at` - Creation timestamp

### Listings
- `id` - Primary key
- `title` - Listing title
- `description` - Listing description
- `city` - City name
- `price` - Price (optional)
- `phone` - Phone number
- `whatsapp` - WhatsApp number
- `category` - Category
- `status` - Status (pending/approved/rejected)
- `user_id` - Foreign key to users
- `created_at` - Creation timestamp
- `updated_at` - Update timestamp

### ListingMedia
- `id` - Primary key
- `listing_id` - Foreign key to listings
- `url` - Image URL
- `created_at` - Creation timestamp

### ModerationLogs
- `id` - Primary key
- `listing_id` - Foreign key to listings
- `action` - Action (approve/reject)
- `reason` - Reason (optional)
- `moderator_id` - Moderator user ID
- `created_at` - Creation timestamp

## 🐛 Troubleshooting

### Backend Issues

**Database connection error:**
- Check `DATABASE_URL` format: `postgresql+asyncpg://user:password@host:port/database`
- Ensure database is accessible
- Check firewall settings

**JWT verification error:**
- Verify `SUPABASE_JWT_SECRET` is correct
- Check token expiration
- Ensure token is being sent in Authorization header

### Frontend Issues

**Supabase connection error:**
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Check browser console for errors
- Ensure Supabase project is active

**Image upload error:**
- Verify Supabase Storage bucket exists and is public
- Check CORS settings
- Verify file size limits (5MB per image)

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Mantine UI Documentation](https://mantine.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Query Documentation](https://react-query.tanstack.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Future Features

- [ ] Premium boost (featured listings)
- [ ] Payment gateway integration
- [ ] Reviews & ratings
- [ ] Blog SEO pages
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Map integration
- [ ] User profiles
- [ ] Messaging system

## 💡 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using FastAPI, React, and Supabase

