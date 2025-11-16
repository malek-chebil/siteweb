# How to Find Your Supabase API Keys

## Finding the Anon Key (Public Key)

### Step 1: Navigate to API Settings
1. Go to your **Supabase Dashboard**
2. Click on **"Settings"** in the left sidebar (gear icon at the bottom)
3. Click on **"API"** in the settings menu

### Step 2: Locate the API Keys Section
You should see a section called **"Project API keys"** with several keys:

1. **`anon` `public`** - This is what you need! (The anon/public key)
2. **`service_role` `secret`** - Don't use this one (it's for server-side only)
3. **`project_api_keys`** - Additional keys if you have them

### Step 3: Copy the Anon Key
- Look for the key labeled **"anon"** or **"public"**
- It will look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxx`
- Click the **"Copy"** button or **"Reveal"** button next to it
- This is your `SUPABASE_ANON_KEY`

## Finding the JWT Secret

### Step 1: Still in API Settings
1. Stay in **Settings > API**
2. Scroll down past the API keys section

### Step 2: Find JWT Settings
Look for a section called:
- **"JWT Settings"**
- **"JWT Secret"**
- Or **"Project API keys"** section might have a JWT Secret field

### Step 3: Reveal and Copy
- Click **"Reveal"** or **"Show"** button next to JWT Secret
- Copy the secret (it's a long random string)
- This is your `SUPABASE_JWT_SECRET`

## Alternative Locations

If you can't find it in Settings > API, try:

### Option 1: Project Settings
1. Click on your **project name** at the top
2. Look for **"API Keys"** or **"Settings"**
3. Navigate to API section from there

### Option 2: General Settings
1. Go to **Settings > General**
2. Look for API information or project details
3. Sometimes keys are shown here

### Option 3: Use the URL Structure
If you can see your project URL, the keys might be in:
- The project overview page
- Under "Project API" or "Integration" sections

## Visual Guide to API Settings Page

The API settings page should show:

```
┌─────────────────────────────────────┐
│ Settings > API                      │
├─────────────────────────────────────┤
│                                     │
│ Project API keys                    │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ anon        public              │ │
│ │ [Copy] [Reveal]                 │ │
│ │ eyJhbGciOiJIUzI1NiIsInR5cCI... │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ service_role  secret            │ │
│ │ [Copy] [Reveal]                 │ │
│ │ (Don't use this one!)           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ JWT Settings                        │
│                                     │
│ JWT Secret: [Reveal] [Copy]        │
│ your-jwt-secret-here               │
│                                     │
└─────────────────────────────────────┘
```

## What Each Key Is Used For

### `anon` / `public` Key (SUPABASE_ANON_KEY)
- **Used in:** Frontend application
- **Purpose:** Public API access (safe to expose in client-side code)
- **Security:** Protected by Row Level Security (RLS) policies
- **Location:** `frontend/.env` as `VITE_SUPABASE_ANON_KEY`
- **Also used in:** Backend `.env` as `SUPABASE_ANON_KEY` (for storage operations)

### `service_role` Key
- **DO NOT USE** in frontend
- **Purpose:** Full database access (bypasses RLS)
- **Security:** Keep this secret! Only use server-side
- **Location:** Never put this in frontend code

### JWT Secret (SUPABASE_JWT_SECRET)
- **Used in:** Backend only
- **Purpose:** Verify JWT tokens from Supabase Auth
- **Security:** Keep this secret!
- **Location:** `backend/.env` as `SUPABASE_JWT_SECRET`

## Quick Checklist

- [ ] Found Settings > API page
- [ ] Located "anon" or "public" key
- [ ] Copied the anon key (starts with `eyJ...`)
- [ ] Found JWT Secret section
- [ ] Revealed and copied JWT Secret
- [ ] Added both to `backend/.env` file
- [ ] Added anon key to `frontend/.env` file (as `VITE_SUPABASE_ANON_KEY`)

## Still Can't Find It?

1. **Check your Supabase plan** - Some features might be in different locations
2. **Try the search bar** - Search for "API" or "keys" in the dashboard
3. **Check project status** - Make sure your project is fully provisioned
4. **Look in the URL** - The keys might be in the project overview URL
5. **Contact Supabase support** - They can guide you to the exact location

## Example .env Entry

Once you find the keys, your `.env` should look like:

```env
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.your-actual-key-here
SUPABASE_JWT_SECRET=your-jwt-secret-here
```

## Need Help?

If you're still having trouble:
1. Take a screenshot of your Settings > API page
2. Check if you see any of these sections:
   - "Project API keys"
   - "API Keys"
   - "Authentication"
   - "JWT Settings"
3. The key might be hidden behind a "Reveal" button - click it!

