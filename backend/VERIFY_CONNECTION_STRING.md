# Verify Your Supabase Connection String

## Issue Found

The DNS lookup shows an IPv6 address, which might cause connection issues. Let's verify your connection string is correct.

## Steps to Verify

### 1. Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings > Database**

### 2. Check Connection String Format

Look for the **"Connection string"** section. You should see something like:

**Option 1: Direct Connection (what we need)**
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Option 2: Session Mode (alternative)**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
```

### 3. Verify Your Project Reference

Your project URL is: `https://cvtrghsdfkrwgasvnflb.supabase.co`

So your project reference is: `cvtrghsdfkrwgasvnflb`

### 4. Check the Actual Hostname

In Supabase Dashboard > Settings > Database, check:
- What hostname is shown in the connection string?
- Is it `db.cvtrghsdfkrwgasvnflb.supabase.co`?
- Or is it something else like `aws-0-[region].pooler.supabase.com`?

## Common Issues

### Issue 1: Using Pooler Instead of Direct Connection

**Wrong (Pooler - port 6543):**
```
postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Correct (Direct - port 5432):**
```
postgresql://postgres:[PASS]@db.[REF].supabase.co:5432/postgres
```

### Issue 2: Wrong Project Reference

Make sure you're using the correct project reference from your Supabase URL.

### Issue 3: Password Not URL-Encoded

If your password has special characters like `@`, they must be URL-encoded:
- `@` → `%40`
- `#` → `%23`
- etc.

## What to Do Next

1. **Check your Supabase Dashboard:**
   - Go to Settings > Database
   - Copy the exact connection string shown there
   - Verify the hostname format

2. **Update your .env file:**
   - Use the connection string from Supabase
   - Add `+asyncpg` after `postgresql`
   - URL-encode any special characters in the password

3. **Try the connection again:**
   ```bash
   alembic upgrade head
   ```

## Alternative: Use Supabase SQL Editor

If you can't connect from your local machine, you can:
1. Use Supabase's SQL Editor (in the dashboard)
2. Run the migration SQL manually
3. Or use Supabase's migration feature

Let me know what connection string format you see in your Supabase dashboard, and I can help you configure it correctly!

