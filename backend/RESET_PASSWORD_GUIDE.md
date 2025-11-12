# Reset Database Password - Step by Step

## Current Issue
Password authentication is failing. The password in your `.env` file might not match the actual database password.

## Solution: Reset Password in Supabase

### Step 1: Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard
2. Select your project: `cvtrghsdfkrwgasvnflb`

### Step 2: Navigate to Database Settings
1. Click on **"Settings"** in the left sidebar
2. Click on **"Database"**

### Step 3: Reset Database Password
1. Find the **"Database password"** section
2. If you see your password, verify it matches `Malouka33@@`
3. If password is hidden or you're not sure, click **"Reset database password"**
4. **Copy the new password** (you won't be able to see it again!)

### Step 4: Update Your .env File

Once you have the password, update your `.env` file:

**If password is `Malouka33@@`:**
```env
DATABASE_URL=postgresql+asyncpg://postgres.cvtrghsdfkrwgasvnflb:Malouka33%40%40@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
```

**If password is different (e.g., `NewPassword123`):**
```env
DATABASE_URL=postgresql+asyncpg://postgres.cvtrghsdfkrwgasvnflb:NewPassword123@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
```

**If password has special characters (e.g., `Pass@123`):**
- URL-encode: `Pass@123` → `Pass%40123`
```env
DATABASE_URL=postgresql+asyncpg://postgres.cvtrghsdfkrwgasvnflb:Pass%40123@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
```

### Step 5: Test Connection
```bash
python test_connection.py
```

### Step 6: Run Migrations
Once connection works:
```bash
alembic upgrade head
```

## Quick Password Encoding Reference

| Character | URL-encoded |
|-----------|-------------|
| `@` | `%40` |
| `#` | `%23` |
| `%` | `%25` |
| `&` | `%26` |
| `+` | `%2B` |
| `=` | `%3D` |
| `?` | `%3F` |
| `/` | `%2F` |
| ` ` (space) | `%20` |

## Example: Update .env File

If your new password is `MyNew@Pass#123`:

1. URL-encode it: `MyNew@Pass#123` → `MyNew%40Pass%23123`
2. Update `.env`:
   ```env
   DATABASE_URL=postgresql+asyncpg://postgres.cvtrghsdfkrwgasvnflb:MyNew%40Pass%23123@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
   ```

## Need Help?

If you reset the password and still have issues:
1. Make sure you copied the password exactly (no extra spaces)
2. Verify URL encoding is correct
3. Test the connection again
4. Check if the password has any special characters that need encoding

---

**After you reset the password in Supabase and update the .env file, run the test again!**

