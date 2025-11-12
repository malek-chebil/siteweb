# Next Steps After Configuration Setup

Great! You've set up your `.env` file. Now let's verify everything and get your application running!

## ✅ Quick Verification

### 1. Check Your DATABASE_URL Format

Your `DATABASE_URL` should include `+asyncpg` after `postgresql`:

**✅ Correct:**
```
DATABASE_URL=postgresql+asyncpg://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

**❌ Incorrect (missing +asyncpg):**
```
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

**Fix:** Add `+asyncpg` after `postgresql`:
```
postgresql:// → postgresql+asyncpg://
```

### 2. Verify All Required Variables

Make sure your `.env` file has all these variables filled in:

- [x] `DATABASE_URL` - Should start with `postgresql+asyncpg://`
- [x] `SUPABASE_URL` - Should be `https://xxxxx.supabase.co`
- [x] `SUPABASE_ANON_KEY` - Should start with `eyJ...`
- [x] `SUPABASE_JWT_SECRET` - Should be a long string
- [x] `CORS_ORIGINS` - Should include your frontend URL

## 🚀 Next Steps

### Step 1: Install Backend Dependencies

```bash
# Make sure you're in the backend folder
cd backend

# Activate virtual environment (if not already activated)
# On Windows:
venv\Scripts\activate

# Install Python packages
pip install -r requirements.txt
```

### Step 2: Run Database Migrations

This will create all the necessary database tables:

```bash
alembic upgrade head
```

**Expected output:**
```
INFO  [alembic.runtime.migration] Running upgrade  -> 001_initial, initial migration
```

### Step 3: Test Backend Connection

Try to start the server:

```bash
uvicorn app.main:app --reload
```

**If successful, you should see:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

**If you see errors:**
- Check that your `DATABASE_URL` has `+asyncpg`
- Verify your database password is correct
- Make sure your Supabase project is active

### Step 4: Test the API

1. Open your browser and go to: `http://localhost:8000/docs`
2. You should see the Swagger API documentation
3. Try the health check: `GET /health`

### Step 5: Set Up Frontend

1. **Navigate to frontend folder:**
```bash
cd ../frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
```bash
# On Windows PowerShell:
Copy-Item .env.example .env
```

4. **Edit frontend/.env and add:**
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_URL=http://localhost:8000/api/v1
```

5. **Start frontend:**
```bash
npm run dev
```

## 🔍 Troubleshooting

### Error: "DATABASE_URL not found"
- Make sure `.env` file is in the `backend` folder
- Check file is named exactly `.env` (not `.env.txt`)

### Error: "Invalid connection string"
- Verify `+asyncpg` is in the connection string
- Check password doesn't have special characters that need encoding
- Make sure port is `5432` (not `6543`)

### Error: "Connection refused"
- Verify Supabase project is active
- Check database password is correct
- Try resetting database password in Supabase

### Error: "Module not found"
- Run: `pip install -r requirements.txt`
- Make sure virtual environment is activated

## ✅ Success Checklist

- [ ] Backend dependencies installed
- [ ] Database migrations run successfully
- [ ] Backend server starts without errors
- [ ] Can access `http://localhost:8000/docs`
- [ ] Frontend dependencies installed
- [ ] Frontend `.env` file created
- [ ] Frontend server starts successfully
- [ ] Can access `http://localhost:5173`

## 🎯 What to Do Next

Once both servers are running:

1. **Test the application:**
   - Go to `http://localhost:5173`
   - Try to register a new user
   - Create a listing
   - Test the admin panel

2. **Create an admin user:**
   - Register through the frontend
   - Go to Supabase SQL Editor
   - Run: `UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';`

3. **Test admin features:**
   - Log in as admin
   - Go to `/admin`
   - Approve/reject listings

## 📚 Need Help?

- Check `SETUP_GUIDE.md` for detailed setup instructions
- Check `FIND_SUPABASE_KEYS.md` if you need help finding keys
- Check `WHAT_ANON_KEY_LOOKS_LIKE.md` for key format reference

---

**You're almost there! 🚀**

