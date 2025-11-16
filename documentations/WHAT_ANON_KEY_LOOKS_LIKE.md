# What Does the Supabase Anon Key Look Like?

## Visual Appearance

The anon key is a **JWT (JSON Web Token)** that looks like a long string of characters separated by dots. Here's what it looks like:

### Format:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.abcdefghijklmnopqrstuvwxyz1234567890
```

### Characteristics:
- **Starts with:** `eyJ` (this is the base64 encoded header)
- **Contains:** Three parts separated by dots (`.`)
- **Length:** Usually 150-200+ characters long
- **Looks like:** Random letters, numbers, and sometimes dashes/underscores

## Real Example Structure

A typical anon key has this structure:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Breakdown:**
- **Part 1** (header): `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9` - Algorithm info
- **Part 2** (payload): `eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ` - Contains project info
- **Part 3** (signature): `SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c` - Cryptographic signature

## How It Appears in Supabase Dashboard

### In Settings > API Page:

```
┌─────────────────────────────────────────────────────────┐
│ Project API keys                                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ anon                          public                │ │
│ │                                                      │ │
│ │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...  │ │
│ │                                                      │ │
│ │ [Copy]  [Reveal]                                    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ service_role                  secret                │ │
│ │                                                      │ │
│ │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...  │ │
│ │                                                      │ │
│ │ [Copy]  [Reveal]                                    │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### What You'll See:

1. **Label:** "anon" or "public" 
2. **Type:** "public" (safe to use in frontend)
3. **The Key:** Long string starting with `eyJ...`
4. **Buttons:** "Copy" and "Reveal" buttons
5. **Note:** It might be partially hidden (showing `...`) - click "Reveal" to see full key

## How to Identify It

### ✅ This is the anon key:
- Label says "anon" or "public"
- Type says "public"
- Safe to use in frontend code
- Starts with `eyJ`
- Long string with dots

### ❌ This is NOT the anon key:
- Label says "service_role" or "secret"
- Type says "secret"
- **NEVER use this in frontend!**
- Also starts with `eyJ` but is different

## Complete Example

Here's what a complete anon key might look like:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

Or:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.your-actual-signature-here
```

## In Your .env File

When you copy it to your `.env` file, it should look like:

```env
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.your-actual-key-here
```

**Important:**
- No quotes around it
- No spaces
- Copy the entire string (all three parts separated by dots)
- It should be on one line

## How to Verify You Have the Right Key

1. **Check the label:** Should say "anon" or "public"
2. **Check the type:** Should say "public" (not "secret")
3. **Check the format:** Should start with `eyJ` and have dots
4. **Check the length:** Should be 150+ characters long
5. **Check the role:** When decoded, it should contain `"role":"anon"`

## Visual Comparison

### Anon Key (✅ Use This):
```
Label: anon
Type: public
Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxx
```

### Service Role Key (❌ Don't Use This):
```
Label: service_role
Type: secret
Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE5MzE4MTUwMjJ9.xxxxx
```

## Still Can't Find It?

If you're looking at the Supabase dashboard and don't see a key that looks like this:

1. **Click "Reveal"** - The key might be hidden
2. **Check if it's truncated** - Look for `...` and click to expand
3. **Look for "Copy" button** - Click it to copy the full key
4. **Check different sections** - Might be in "Project API keys" or "API Keys" tab

## Quick Test

Once you have the key, you can verify it's correct by checking if it:
- Starts with `eyJ`
- Has exactly 2 dots (`.`)
- Is very long (150+ characters)
- When you use it, your app can connect to Supabase

## Summary

The anon key:
- 🔑 Looks like: `eyJ...long-string-with-dots...`
- 📍 Found in: Settings > API > anon/public key
- ✅ Safe to use: In frontend code
- 🏷️ Label: "anon" or "public"
- 📏 Length: 150-200+ characters
- 🔤 Format: Three parts separated by dots

