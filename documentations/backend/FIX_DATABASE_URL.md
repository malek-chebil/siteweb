# Fix Database URL with Special Characters in Password

If your database password contains special characters like `@`, `#`, `%`, etc., they need to be URL-encoded in the connection string.

## Common Special Characters and Their Encoding

- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `?` → `%3F`
- `/` → `%2F`
- ` ` (space) → `%20`

## Your Current Issue

Your password appears to have `@@` which is being interpreted as part of the URL structure instead of the password.

## Solution

1. **Check your password in Supabase:**
   - Go to Settings > Database
   - If needed, reset your database password
   - Choose a password without special characters, OR

2. **URL-encode your password:**
   - If your password is `Malouka33@@`, it should be `Malouka33%40%40`
   - Use an online URL encoder: https://www.urlencoder.org/

3. **Update your .env file:**
   ```
   DATABASE_URL=postgresql+asyncpg://postgres:Malouka33%40%40@db.cvtrghsdfkrwgasvnflb.supabase.co:5432/postgres
   ```

## Quick Fix: Reset Password

The easiest solution is to reset your database password to one without special characters:

1. Go to Supabase Dashboard > Settings > Database
2. Click "Reset database password"
3. Choose a password with only letters, numbers, and basic symbols (no `@`, `#`, etc.)
4. Update your `.env` file with the new password

## Example

**Original password:** `My@Pass#123`
**URL-encoded:** `My%40Pass%23123`
**Connection string:**
```
DATABASE_URL=postgresql+asyncpg://postgres:My%40Pass%23123@db.xxxxx.supabase.co:5432/postgres
```

## Test Your Connection

After fixing, test with:
```bash
python -c "from app.config import settings; print('Config OK')"
```

