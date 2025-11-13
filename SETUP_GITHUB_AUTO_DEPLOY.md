# 🚀 Setup Automatic GitHub Deployment to Vercel

## Overview

When you push to GitHub, Vercel will automatically detect the changes and deploy your application. No need to run deployment commands manually!

---

## ✅ Step-by-Step Setup

### Step 1: Verify GitHub Repository

1. **Check your repository**:
   - Go to: https://github.com/malek-chebil/siteweb
   - Make sure it exists and you have access

2. **Verify your current setup**:
   ```bash
   git remote -v
   ```
   Should show:
   ```
   origin  https://github.com/malek-chebil/siteweb.git (fetch)
   origin  https://github.com/malek-chebil/siteweb.git (push)
   ```

### Step 2: Connect Project to GitHub in Vercel

1. **Go to Vercel Dashboard**:
   - Visit: https://vercel.com/dashboard
   - Sign in with your account

2. **Find or Create Project**:
   - If project exists: Click on your project
   - If new project: Click "Add New" → "Project"

3. **Import from GitHub**:
   - Click "Import Git Repository"
   - Select: `malek-chebil/siteweb`
   - Click "Import"

### Step 3: Configure Project Settings

1. **Root Directory**:
   - Set **Root Directory** to: `frontend`
   - Or leave blank if using root-level `vercel.json`

2. **Framework Preset**:
   - Select: **Vite**
   - Or leave as auto-detect

3. **Build Settings**:
   - **Build Command**: `npm install && npm run build`
     - Or leave blank (will use `vercel.json`)
   - **Output Directory**: `dist`
     - Or leave blank (will use `vercel.json`)
   - **Install Command**: `npm install`
     - Or leave blank (default)

4. **Environment Variables**:
   - Click "Add" for each variable:
     - `VITE_API_URL` = Your backend API URL
     - `VITE_SUPABASE_URL` = Your Supabase URL
     - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
   - Select environments: **Production**, **Preview**, **Development**

### Step 4: Deploy

1. **Click "Deploy"**
2. **Wait for deployment** (usually 2-3 minutes)
3. **Get your deployment URL** (e.g., `https://your-project.vercel.app`)

---

## ✅ Verify Auto-Deploy is Enabled

### Check Git Integration

1. **Go to Project Settings**:
   - In Vercel Dashboard → Your Project → **Settings** → **Git**

2. **Verify Settings**:
   - ✅ **Production Branch**: `main`
   - ✅ **Auto-deploy on push**: Enabled
   - ✅ **Git Repository**: Connected to `malek-chebil/siteweb`

3. **Deployment Settings**:
   - ✅ **Production deployments** trigger on push to `main`
   - ✅ **Preview deployments** trigger on pull requests

---

## 🔄 How It Works

### Automatic Deployment Flow

```
1. You make changes locally
   ↓
2. You run: git add . && git commit -m "message" && git push
   ↓
3. GitHub receives the push
   ↓
4. Vercel detects the push (via webhook)
   ↓
5. Vercel automatically:
   - Clones the repository
   - Installs dependencies (npm install)
   - Builds the project (npm run build)
   - Deploys to production
   ↓
6. Your site is live!
```

### Deployment Triggers

- **Production**: Every push to `main` branch
- **Preview**: Every pull request to `main`
- **Manual**: You can also trigger manually from Vercel dashboard

---

## 📋 Your Daily Workflow

### Making Changes and Deploying

```bash
# 1. Navigate to project root
cd "C:\Users\Malek\Desktop\site Web"

# 2. Make your changes
# (edit files in your editor...)

# 3. Check what changed
git status

# 4. Add all changes
git add .

# 5. Commit with message
git commit -m "Update footer and fix padding"

# 6. Push to GitHub
git push

# 7. Done! Vercel will automatically deploy
```

That's it! After `git push`, Vercel automatically:
- ✅ Detects the push
- ✅ Builds your frontend
- ✅ Deploys to production
- ✅ Updates your live site

---

## 🔍 Monitor Deployments

### View Deployment Status

1. **In Vercel Dashboard**:
   - Go to: https://vercel.com/dashboard
   - Click on your project
   - See "Deployments" tab

2. **Deployment Status**:
   - 🟢 **Ready**: Deployment successful
   - 🟡 **Building**: Currently deploying
   - 🔴 **Error**: Build failed (check logs)

### View Build Logs

1. **Click on a deployment**
2. **See build logs**:
   - Installation logs
   - Build logs
   - Error messages (if any)

---

## ⚙️ Configuration Files

### Root Level: `vercel.json`

Located at: `C:\Users\Malek\Desktop\site Web\vercel.json`

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Frontend Level: `frontend/vercel.json`

Located at: `C:\Users\Malek\Desktop\site Web\frontend\vercel.json`

```json
{
  "buildCommand": "npm install && npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Note**: If Vercel root directory is set to `frontend`, it will use `frontend/vercel.json`. Otherwise, it uses root `vercel.json`.

---

## 🔐 Environment Variables Setup

### Required Variables

In Vercel Dashboard → Settings → Environment Variables:

1. **VITE_API_URL**
   - Value: `https://your-backend.onrender.com/api/v1`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

2. **VITE_SUPABASE_URL**
   - Value: `https://xxx.supabase.co`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

3. **VITE_SUPABASE_ANON_KEY**
   - Value: `eyJ...` (your anon key)
   - Environments: ✅ Production, ✅ Preview, ✅ Development

### How to Add Variables

1. Go to: Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Click **"Add"**
3. Enter:
   - **Key**: `VITE_API_URL`
   - **Value**: Your value
   - **Environments**: Select all (Production, Preview, Development)
4. Click **"Save"**
5. Repeat for other variables
6. **Important**: After adding variables, trigger a new deployment

---

## ✅ Verification Checklist

Before relying on automatic deployment, verify:

- [ ] GitHub repository is connected to Vercel
- [ ] Root directory is set correctly (`frontend` or root)
- [ ] Build settings are configured
- [ ] Environment variables are set
- [ ] Auto-deploy is enabled
- [ ] Production branch is set to `main`
- [ ] You can push to GitHub successfully

---

## 🧪 Test Automatic Deployment

### Test It Now:

```bash
# 1. Make a small change
echo "# Test deployment" >> README.md

# 2. Add and commit
git add README.md
git commit -m "Test automatic deployment"

# 3. Push
git push

# 4. Go to Vercel dashboard
# 5. Watch the deployment start automatically!
```

---

## 🚨 Troubleshooting

### Issue: Deployment not triggering

**Check**:
1. Git integration in Vercel → Settings → Git
2. Repository is connected
3. Auto-deploy is enabled
4. You're pushing to `main` branch

**Solution**:
1. Go to Vercel → Settings → Git
2. Verify repository connection
3. Enable "Auto-deploy on push"
4. Save settings

### Issue: Build failing

**Check**:
1. Build logs in Vercel dashboard
2. Root directory is correct
3. Build command is correct
4. Dependencies can be installed

**Common Solutions**:
- Verify root directory is `frontend`
- Check `package.json` exists
- Verify build command: `npm install && npm run build`
- Check for missing dependencies

### Issue: Environment variables not working

**Check**:
1. Variables start with `VITE_` (required for Vite)
2. Variables are set for correct environments
3. You've redeployed after adding variables

**Solution**:
1. Add variables with `VITE_` prefix
2. Select all environments (Production, Preview, Development)
3. Trigger new deployment after adding variables

---

## 📊 Deployment Status

### Check Deployment Status

```bash
# Via Vercel CLI (if logged in)
vercel ls

# Or check dashboard:
https://vercel.com/dashboard
```

### Deployment URLs

- **Production**: `https://your-project.vercel.app`
- **Preview**: `https://your-project-git-branch.vercel.app`
- **Custom Domain**: If configured

---

## 🎯 Quick Reference

### Your Workflow:

```bash
# 1. Make changes
# (edit files...)

# 2. Check status
git status

# 3. Add changes
git add .

# 4. Commit
git commit -m "Description of changes"

# 5. Push (triggers automatic deployment)
git push
```

### Monitor Deployment:

1. **Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**
3. **See "Deployments" tab**
4. **Watch deployment progress**

---

## ✅ You're All Set!

Once configured, your workflow is:

1. ✅ Make changes locally
2. ✅ Commit: `git commit -m "message"`
3. ✅ Push: `git push`
4. ✅ Vercel automatically deploys
5. ✅ Site is live in 2-3 minutes

**No manual deployment needed!** 🎉

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **GitHub Repository**: https://github.com/malek-chebil/siteweb
- **Project Settings**: Vercel Dashboard → Your Project → Settings

---

**Happy Auto-Deploying! 🚀**

