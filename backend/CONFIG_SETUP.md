# Backend Configuration Setup

## Step 1: Create `.env` File

In the `backend` folder, create a file named `.env` (not `.env.example`).

### On Windows (PowerShell):
```powershell
cd backend
Copy-Item .env.example .env
```

### On Mac/Linux:
```bash
cd backend
cp .env.example .env
```

### Or create it manually:
1. Navigate to the `backend` folder
2. Create a new file named `.env`
3. Copy the content from `.env.example`

## Step 2: Fill in Your Values

Open the `.env` file and replace the placeholder values:

### 1. DATABASE_URL

Replace this line:
```
DATABASE_URL=postgresql+asyncpg://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
```

With your actual connection string:
```
DATABASE_URL=postgresql+asyncpg://postgres:my-actual-password@db.abcdefghijklmnop.supabase.co:5432/postgres
```

**Important:**
- Replace `YOUR_PASSWORD` with your database password
- Replace `YOUR_PROJECT_REF` with your Supabase project reference
- Make sure `+asyncpg` is included after `postgresql`

### 2. SUPABASE_URL

Replace this line:
```
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
```

With your actual Supabase URL:
```
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
```

### 3. SUPABASE_ANON_KEY

1. Go to Supabase Dashboard
2. Click **Settings > API**
3. Find **"anon"** or **"public"** key
4. Copy it and replace:
```
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.your-actual-key-here
```

### 4. SUPABASE_JWT_SECRET

1. Go to Supabase Dashboard
2. Click **Settings > API**
3. Scroll down to **"JWT Secret"**
4. Click **"Reveal"** or **"Show"** to see it
5. Copy it and replace:
```
SUPABASE_JWT_SECRET=your-jwt-secret-key-here
```

## Step 3: Verify Your Configuration

Your final `.env` file should look something like this:

```env
# Database Connection
DATABASE_URL=postgresql+asyncpg://postgres:MySecurePassword123@db.abcdefghijklmnop.supabase.co:5432/postgres

# Supabase Configuration
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.actual-key-here
SUPABASE_JWT_SECRET=your-actual-jwt-secret-here

# CORS Origins
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# App Configuration
DEBUG=True
API_V1_PREFIX=/api/v1

# Rate Limiting
RATE_LIMIT_ENABLED=True
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60
```

## Step 4: Test Your Configuration

1. Make sure you're in the `backend` folder
2. Activate your virtual environment
3. Try importing the config:

```bash
python -c "from app.config import settings; print('Config loaded successfully!')"
```

If you see "Config loaded successfully!", your configuration is correct!

## Important Notes

- **Never commit `.env` to Git** - it contains sensitive information
- The `.env` file is already in `.gitignore`
- Keep your passwords secure
- Don't share your `.env` file with anyone

## Troubleshooting

### Error: "DATABASE_URL not found"
- Make sure `.env` file exists in the `backend` folder
- Check that the file is named exactly `.env` (not `.env.txt` or `.env.example`)
- Verify the file is in the same folder as `app/config.py`

### Error: "Invalid connection string"
- Check that you have `+asyncpg` in the connection string
- Verify the password doesn't contain special characters that need URL encoding
- Make sure the port is `5432` (not `6543`)

### Error: "Connection refused"
- Verify your Supabase project is active
- Check that the database password is correct
- Make sure you're using the direct connection (port 5432), not the pooler

