# Update to Session Pooler Connection (IPv4 Fix)

## Quick Instructions

### 1. Get Session Pooler Connection String from Supabase

In your Supabase dashboard:
1. Click **"Connect to your project"** or go to **Settings > Database**
2. Change **Method** to **"Session pooler"**
3. Copy the connection string

It should look like:
```
postgresql://postgres.cvtrghsdfkrwgasvnflb:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

### 2. Update Your .env File

Replace the `DATABASE_URL` line in `backend/.env`:

**Current (Direct - IPv6 only, not working):**
```env
DATABASE_URL=postgresql+asyncpg://postgres:Malouka33%40%40@db.cvtrghsdfkrwgasvnflb.supabase.co:5432/postgres
```

**New (Pooler - IPv4 compatible):**
```env
DATABASE_URL=postgresql+asyncpg://postgres.cvtrghsdfkrwgasvnflb:Malouka33%40%40@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Important:**
- Replace `[REGION]` with your actual region (e.g., `eu-west-1`, `us-east-1`)
- Keep password URL-encoded: `Malouka33%40%40`
- User format: `postgres.cvtrghsdfkrwgasvnflb` (includes project ref)
- Port: `6543` (not `5432`)
- Keep `+asyncpg` after `postgresql`

### 3. Test the Connection

After updating, test:
```bash
python test_connection.py
```

### 4. Run Migrations

```bash
alembic upgrade head
```

## What Changed?

- **User:** `postgres` → `postgres.cvtrghsdfkrwgasvnflb`
- **Hostname:** `db.cvtrghsdfkrwgasvnflb.supabase.co` → `aws-0-[REGION].pooler.supabase.com`
- **Port:** `5432` → `6543`
- **IPv4:** Now supported! ✅

## Example

If your region is `eu-west-1`, your connection string would be:
```env
DATABASE_URL=postgresql+asyncpg://postgres.cvtrghsdfkrwgasvnflb:Malouka33%40%40@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
```

## Need Help Finding Your Region?

The region is usually shown in:
- The connection string in Supabase dashboard
- Your project settings
- Or try common regions: `eu-west-1`, `us-east-1`, `ap-southeast-1`

---

**Once you update the .env file with the pooler connection string, the IPv4 issue will be resolved!**

