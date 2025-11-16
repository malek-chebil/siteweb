# Fix IPv4 Compatibility Issue

## Problem

Your Supabase database is **not IPv4 compatible**. The direct connection only supports IPv6, but your system/network is trying to connect via IPv4.

## Solution: Use Session Pooler

Supabase provides a **Session Pooler** that supports IPv4 connections. This is what you need to use.

## Steps to Fix

### 1. Get the Session Pooler Connection String

1. In Supabase Dashboard, go to **Settings > Database**
2. Look for **"Connection pooling"** section
3. Or in the "Connect to your project" dialog, switch:
   - **Method:** Change from "Direct connection" to **"Session pooler"**
4. Copy the connection string shown

### 2. Session Pooler Connection String Format

The pooler connection string looks like:
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Key differences:**
- User format: `postgres.[PROJECT_REF]` (not just `postgres`)
- Hostname: `aws-0-[REGION].pooler.supabase.com` (not `db.[REF].supabase.co`)
- Port: `6543` (not `5432`)

### 3. Update Your .env File

Replace your current `DATABASE_URL` with the pooler connection string:

```env
DATABASE_URL=postgresql+asyncpg://postgres.cvtrghsdfkrwgasvnflb:Malouka33%40%40@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Important:**
- Replace `[REGION]` with your actual region (e.g., `eu-west-1`, `us-east-1`, etc.)
- Keep the password URL-encoded (`%40` for `@`)
- Add `+asyncpg` after `postgresql`

### 4. Alternative: Purchase IPv4 Add-on

If you prefer to use the direct connection, you can purchase an IPv4 add-on from Supabase, but using the pooler is free and recommended.

## Quick Fix

1. Go to Supabase Dashboard
2. Click "Connect to your project" or go to Settings > Database
3. Change **Method** to **"Session pooler"**
4. Copy the connection string
5. Update your `.env` file
6. Replace `postgresql://` with `postgresql+asyncpg://`
7. URL-encode any special characters in the password

## Notes

- The Session Pooler is free and works with IPv4 networks
- It's recommended for most applications
- The pooler connection is slightly different format but works the same way
- You may need to update your Alembic configuration if the pooler format differs

