# 🚀 Options de Déploiement - Avec ou Sans GitHub

## 📋 Vue d'Ensemble

Vous avez **2 options** pour déployer votre application:

### ✅ Option 1: **SANS GitHub** (Plus Rapide - ~15 minutes)
- Frontend: Vercel CLI (déploiement direct)
- Backend: Render avec upload manuel

### ✅ Option 2: **AVEC GitHub** (Recommandé - ~25 minutes)
- Frontend: Vercel connecté à GitHub
- Backend: Render connecté à GitHub
- Avantage: Déploiements automatiques à chaque commit

---

## 🎯 Option 1: SANS GitHub (Plus Rapide)

### Frontend sur Vercel (5 min)

1. **Installez Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Connectez-vous**:
   ```bash
   vercel login
   ```

3. **Déployez**:
   ```bash
   cd frontend
   vercel
   ```
   - Appuyez sur `Entrée` pour toutes les questions (valeurs par défaut)
   - **Résultat**: URL comme `https://votre-app.vercel.app`

### Backend sur Render (10 min)

1. **Allez sur**: https://render.com
2. **Créez un compte** (gratuit)
3. **New +** → **Web Service**
4. **Choisissez "Public Git repository"** ou **"Manual Deploy"**
5. Si **Manual Deploy**:
   - Créez un fichier ZIP de votre dossier `backend`
   - Uploadez-le sur Render
6. **Configurez**:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: **Free**
7. **Ajoutez les variables d'environnement** (depuis votre `.env`)
8. **Create Web Service**

---

## 🎯 Option 2: AVEC GitHub (Recommandé)

### Étape 1: Créer un Repository GitHub (5 min)

1. **Allez sur**: https://github.com
2. **Créez un compte** (si vous n'en avez pas)
3. **Cliquez sur "+"** → **"New repository"**
4. **Nommez le repo**: `carthage-wellness-spa` (ou autre)
5. **Choisissez**: Public ou Private
6. **Ne cochez PAS** "Initialize with README" (on a déjà du code)
7. **Créez le repository**

### Étape 2: Uploader votre Code (5 min)

1. **Dans votre terminal** (dans le dossier du projet):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/VOTRE-USERNAME/carthage-wellness-spa.git
   git push -u origin main
   ```

2. **Remplacez** `VOTRE-USERNAME` par votre nom d'utilisateur GitHub

### Étape 3: Déployer le Frontend (5 min)

1. **Allez sur**: https://vercel.com
2. **Connectez votre compte GitHub**
3. **"Add New"** → **"Project"**
4. **Importez votre repository**
5. **Configurez**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. **Ajoutez les variables d'environnement**:
   - `VITE_API_URL` = `https://votre-backend.onrender.com/api/v1` (vous l'ajouterez après le déploiement du backend)
7. **Deploy**

### Étape 4: Déployer le Backend (10 min)

1. **Allez sur**: https://render.com
2. **Connectez votre compte GitHub**
3. **New +** → **Web Service**
4. **Connectez votre repository**
5. **Configurez**:
   - **Name**: `carthage-wellness-backend`
   - **Root Directory**: `backend` ⚠️ **IMPORTANT**
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: **Free**
6. **Ajoutez les variables d'environnement** (depuis votre `.env`)
7. **Create Web Service**

### Étape 5: Connecter Frontend et Backend (5 min)

1. **Dans Vercel**:
   - Allez dans **Settings** → **Environment Variables**
   - Ajoutez: `VITE_API_URL` = `https://votre-backend.onrender.com/api/v1`
   - **Redeploy** le frontend

2. **Dans Render**:
   - Allez dans **Environment** → **Environment Variables**
   - Ajoutez: `CORS_ORIGINS` = `https://votre-app.vercel.app,http://localhost:5174`

---

## 🆚 Comparaison

| Critère | Sans GitHub | Avec GitHub |
|---------|-------------|-------------|
| **Temps** | ~15 minutes | ~25 minutes |
| **Déploiements auto** | ❌ Non | ✅ Oui |
| **Facilité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Maintenance** | Manuel | Automatique |
| **Recommandé pour** | Démo rapide | Production |

---

## 💡 Recommandation

**Pour une démo rapide**: Utilisez **Option 1** (Sans GitHub)
**Pour la production**: Utilisez **Option 2** (Avec GitHub)

---

## 🔒 Fichiers à NE PAS Uploader sur GitHub

Assurez-vous de créer un fichier `.gitignore` avant de pusher:

```gitignore
# Environment variables
.env
.env.local
.env.*.local

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
ENV/

# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Database
*.db
*.sqlite
```

---

## 🆘 Besoin d'Aide?

- **Option 1**: Suivez `DEPLOIEMENT_ETAPES_RAPIDES.md`
- **Option 2**: Suivez `GUIDE_DEPLOIEMENT_GRATUIT.md`

