# How to Get Session Pooler Connection String

## Step-by-Step Guide

### Option 1: From "Connect to your project" Dialog

1. In your Supabase project dashboard
2. Look for a **"Connect"** button or **"Connect to your project"** link
3. Click it to open the connection dialog
4. In the dialog:
   - **Type:** Keep as "URI"
   - **Source:** Keep as "Primary Database"
   - **Method:** Change to **"Session pooler"** (this is important!)
5. Copy the connection string shown

### Option 2: From Database Settings

1. Go to **Settings > Database**
2. Scroll down to **"Connection pooling"** section
3. Look for **"Session mode"** connection string
4. Copy it

### Option 3: From Connection Pooling Page

1. Go to **Settings > Database**
2. Click on **"Connection pooling"** tab or section
3. Find the **"Session pooler"** connection string
4. It should show something like:
   ```
   postgresql://postgres.cvtrghsdfkrwgasvnflb:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

## What to Look For

The pooler connection string will have:
- ✅ User: `postgres.[PROJECT_REF]` (with your project ref)
- ✅ Hostname: `aws-0-[REGION].pooler.supabase.com`
- ✅ Port: `6543`
- ✅ Format: Similar to direct connection but with pooler hostname

## After You Get It

1. Copy the connection string
2. Update your `.env` file
3. Change `postgresql://` to `postgresql+asyncpg://`
4. URL-encode the password if it has special characters
5. Run migrations again: `alembic upgrade head`

## Example

If Supabase shows:
```
postgresql://postgres.cvtrghsdfkrwgasvnflb:Malouka33@@@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
```

Your `.env` should have:
```
DATABASE_URL=postgresql+asyncpg://postgres.cvtrghsdfkrwgasvnflb:Malouka33%40%40@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
```

Note: Replace `eu-west-1` with your actual region!

