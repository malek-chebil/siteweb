# How to Find Your Supabase Database Connection String

## Quick Method

If you can't find the connection string in the UI, you can construct it manually:

### Step 1: Get Your Project Reference
1. Look at your Supabase project URL in the browser
2. It will look like: `https://[PROJECT_REF].supabase.co`
3. Copy the `[PROJECT_REF]` part (the random string before `.supabase.co`)

### Step 2: Get Your Database Password
1. In the **Database Settings** page you're currently on
2. Look at the **"Database password"** section
3. If you see a password displayed, copy it
4. If not, click **"Reset database password"** to create a new one
5. **Save this password** - you'll need it!

### Step 3: Construct the Connection String

Use this format:
```
postgresql+asyncpg://postgres:[YOUR_PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
```

**Example:**
- Project URL: `https://abcdefghijklmnop.supabase.co`
- Project Ref: `abcdefghijklmnop`
- Password: `my-secure-password-123`

**Connection String:**
```
postgresql+asyncpg://postgres:my-secure-password-123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

## Where to Look in Supabase Dashboard

### Method 1: Connection String Section
1. Go to **Settings > Database**
2. Scroll to the top of the page
3. Look for a section called:
   - **"Connection string"**
   - **"Connection info"**
   - **"Database URL"**
4. You might see tabs like:
   - **URI** (this is what you need!)
   - JDBC
   - Connection pooling
5. Click on **"URI"** tab if available
6. Copy the connection string

### Method 2: Connection Pooling Section
1. In **Settings > Database**
2. Find the **"Connection pooling configuration"** section
3. Look for connection strings there
4. Use the **"Direct connection"** (port 5432), NOT the pooler (port 6543)

### Method 3: Project Settings
1. Go to **Settings > General**
2. Look for database connection info
3. Sometimes it's listed under "Project details"

## Important Notes

- **Use port 5432** (direct connection), not 6543 (pooler)
- **Replace `[PASSWORD]`** with your actual database password
- **Add `+asyncpg`** after `postgresql` for Python async connections
- **Keep your password secure** - don't commit it to Git!

## Testing Your Connection String

After creating your `.env` file with the connection string, test it:

```bash
cd backend
python -c "from app.database import engine; print('Connection OK!')"
```

Or start the server:
```bash
uvicorn app.main:app --reload
```

If you see errors, double-check:
- Password is correct
- Project reference is correct
- You added `+asyncpg` to the connection string
- Port is 5432 (not 6543)

## Still Can't Find It?

1. **Check your email** - Supabase sometimes sends connection details via email when you create a project
2. **Reset your database password** - This might reveal the connection string
3. **Contact Supabase support** - They can help you locate it
4. **Use the manual method above** - It works just as well!

