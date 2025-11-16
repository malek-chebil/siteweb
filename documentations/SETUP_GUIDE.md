# Quick Setup Guide

## Prerequisites

1. **Python 3.9+** installed
2. **Node.js 18+** installed
3. **Supabase account** (free tier works)
4. **PostgreSQL database** (included with Supabase)

## Step 1: Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned (2-3 minutes)
3. Note down:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - Anon key (from Settings > API > anon/public key) - See FIND_SUPABASE_KEYS.md for help
   - JWT Secret (from Settings > API > JWT Secret) - See FIND_SUPABASE_KEYS.md for help
   - Database connection string (from Settings > Database)

### Create Storage Bucket

1. Go to Storage in Supabase dashboard
2. Click "New bucket"
3. Name it: `listing-images`
4. Make it **Public**
5. Click "Create bucket"

### Configure Database Connection

1. Go to **Settings > Database** in your Supabase dashboard
2. Look for the **"Connection string"** section (it may be at the top of the page or in a separate tab)
3. If you don't see it directly, look for:
   - A **"Connection string"** or **"Connection info"** section
   - A **"URI"** tab or button
   - Sometimes you need to click **"Show"** or **"Reveal"** to see it
4. You'll see connection strings in different formats:
   - **URI format**: `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
   - **Direct connection**: `postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres`
5. **Use the Direct connection** (port 5432) for your backend
6. Copy the connection string and convert it to asyncpg format:
   - Original: `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
   - **Convert to**: `postgresql+asyncpg://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
   - **Important**: Replace `[PASSWORD]` with your actual database password (you can find it or reset it in the "Database password" section)

**Alternative method if connection string is not visible:**
- Look for **"Connection pooling"** section
- Use the **"Direct connection"** string (not the pooler)
- Or construct it manually: `postgresql+asyncpg://postgres:[YOUR_PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres`
- Replace `[YOUR_PASSWORD]` with your database password
- Replace `[PROJECT_REF]` with your project reference (found in your project URL)

## Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
# On Windows (PowerShell):
Copy-Item .env.example .env
# On Mac/Linux:
# cp .env.example .env

# Edit .env file and replace the placeholder values:
# 1. DATABASE_URL - Your database connection string (asyncpg format)
# 2. SUPABASE_URL - Your Supabase project URL
# 3. SUPABASE_ANON_KEY - From Settings > API > anon key
# 4. SUPABASE_JWT_SECRET - From Settings > API > JWT Secret
#
# See backend/CONFIG_SETUP.md for detailed instructions

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

Backend should be running at `http://localhost:8000`

## Step 3: Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - VITE_API_URL (http://localhost:8000/api/v1)

# Start development server
npm run dev
```

Frontend should be running at `http://localhost:5173`

## Step 4: Create Admin User

1. Register a user through the frontend
2. Go to Supabase SQL Editor
3. Run this query:

```sql
UPDATE users 
SET is_admin = true 
WHERE email = 'your-email@example.com';
```

4. Log in with that email to access the admin panel

## Step 5: Test the Application

1. **Create a listing:**
   - Log in
   - Click "Add Listing"
   - Fill in the form
   - Upload images
   - Submit

2. **Moderate listing:**
   - Log in as admin
   - Go to `/admin/moderation`
   - Approve or reject the listing

3. **View listing:**
   - Go to home page
   - You should see approved listings
   - Click on a listing to view details
   - Test WhatsApp and call buttons

## Troubleshooting

### Backend won't start
- Check that `.env` file exists and has correct values
- Verify database connection string format
- Check that all dependencies are installed

### Frontend won't start
- Check that `.env` file exists
- Verify Supabase credentials
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Images won't upload
- Verify storage bucket exists and is public
- Check CORS settings in Supabase
- Verify file size (max 5MB per image)

### Database connection error
- Check DATABASE_URL format (must be asyncpg format)
- Verify database is accessible
- Check firewall settings

### Authentication not working
- Verify SUPABASE_JWT_SECRET is correct
- Check that Supabase Auth is enabled
- Verify email provider is enabled in Supabase

## Next Steps

1. Customize categories and cities in `FiltersBar.jsx`
2. Add more translations in `frontend/src/i18n/locales/`
3. Customize the theme in `frontend/src/styles/theme.js`
4. Deploy to production (see README.md)

## Deployment

See the main README.md for deployment instructions to:
- **Backend:** Render or Railway
- **Frontend:** Vercel

## Support

If you encounter issues:
1. Check the error messages in browser console (F12)
2. Check backend logs
3. Verify all environment variables are set correctly
4. Check Supabase dashboard for errors

---

Happy coding! 🚀

