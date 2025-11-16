# 🚀 Deploy to Vercel from Command Line

## Quick Deploy Commands

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Login to Vercel (if not already logged in)

```bash
vercel login
```

This will open your browser to authenticate.

### Step 3: Link to Existing Project (if project already exists on Vercel)

```bash
vercel link
```

- Select your existing project
- Choose the scope (your username or team)
- Confirm settings

### Step 4: Deploy to Production

```bash
# Deploy to production
vercel --prod

# Or deploy to preview
vercel
```

---

## Alternative: Deploy Without Linking (First Time)

If this is the first time deploying this project:

```bash
cd frontend
vercel login
vercel --prod
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (Select your account)
- Link to existing project? **No** (for new project) or **Yes** (to link existing)
- Project name? (Enter or use default)
- Directory? **.** (current directory)
- Override settings? **No**

---

## Full Deployment Flow

### From Root Directory:

```bash
# From root directory
cd "C:\Users\Malek\Desktop\site Web"
cd frontend

# Login (first time only)
vercel login

# Deploy to production
vercel --prod
```

### From Frontend Directory:

```bash
# Navigate to frontend
cd frontend

# Deploy
vercel --prod
```

---

## Useful Vercel CLI Commands

### Check Status

```bash
# Check if logged in
vercel whoami

# List projects
vercel projects ls

# Check deployment status
vercel ls
```

### Environment Variables

```bash
# Add environment variable
vercel env add VITE_API_URL production

# List environment variables
vercel env ls
```

### Inspect Deployments

```bash
# View deployment logs
vercel inspect [deployment-url]

# View logs in real-time
vercel logs [deployment-url] --follow
```

---

## Common Issues & Solutions

### Issue: "Not logged in"

**Solution:**
```bash
vercel login
```

### Issue: "Project not found"

**Solution:**
```bash
# Link to existing project
vercel link

# Or create new project
vercel --prod
```

### Issue: "Build failed"

**Solution:**
1. Check that you're in the `frontend` directory
2. Make sure `package.json` exists
3. Check build logs: `vercel logs [deployment-url]`

---

## Quick Reference

```bash
# Login
vercel login

# Deploy to production
vercel --prod

# Deploy to preview
vercel

# Link to project
vercel link

# View deployments
vercel ls

# View logs
vercel logs [url]
```

---

## Notes

- **Production deployment** (`--prod`): Deploys to your production domain
- **Preview deployment** (without `--prod`): Creates a preview URL for testing
- **Environment variables**: Set them in Vercel dashboard or via CLI
- **Build settings**: Configured in `vercel.json` or Vercel dashboard

---

**Happy Deploying! 🚀**

