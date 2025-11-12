# 🚀 Connecter votre Code à GitHub - Instructions Rapides

## ✅ Étape 1: Créer un Repository sur GitHub

1. **Allez sur**: https://github.com
2. **Connectez-vous** (ou créez un compte)
3. **Cliquez sur "+"** (en haut à droite) → **"New repository"**
4. **Remplissez le formulaire**:
   - **Repository name**: `carthage-wellness-spa` (ou un nom de votre choix)
   - **Description**: `Plateforme d'annonces de massage et bien-être en Tunisie`
   - **Visibility**: 
     - ✅ **Public** (recommandé pour le déploiement gratuit)
     - ⚠️ **Private** (si vous voulez garder le code privé)
   - **NE COCHEZ PAS** "Initialize with README" (on a déjà du code)
   - **NE COCHEZ PAS** "Add .gitignore" (on en a déjà un)
   - **NE COCHEZ PAS** "Choose a license"
5. **Cliquez sur "Create repository"**

---

## ✅ Étape 2: Connecter votre Code Local au Repository GitHub

**Remplacez `VOTRE-USERNAME` par votre nom d'utilisateur GitHub et `carthage-wellness-spa` par le nom de votre repo**

### Option A: Via HTTPS (Recommandé pour débutants)

```bash
cd "C:\Users\Malek\Desktop\site Web"
git remote add origin https://github.com/VOTRE-USERNAME/carthage-wellness-spa.git
git branch -M main
git push -u origin main
```

**Si vous êtes demandé de vous connecter**:
- Utilisez votre **nom d'utilisateur GitHub**
- Utilisez un **Personal Access Token** (pas votre mot de passe)
  - Pour créer un token: https://github.com/settings/tokens
  - Cliquez sur "Generate new token (classic)"
  - Donnez-lui un nom (ex: "Vercel Deploy")
  - Cochez "repo" (accès complet aux repositories)
  - Cliquez sur "Generate token"
  - **COPIEZ LE TOKEN** (vous ne pourrez plus le voir après!)
  - Utilisez ce token comme mot de passe lors du `git push`

### Option B: Via SSH (Recommandé pour utilisateurs avancés)

```bash
cd "C:\Users\Malek\Desktop\site Web"
git remote add origin git@github.com:VOTRE-USERNAME/carthage-wellness-spa.git
git branch -M main
git push -u origin main
```

**Pour configurer SSH**:
1. Générez une clé SSH: `ssh-keygen -t ed25519 -C "votre_email@example.com"`
2. Ajoutez la clé à GitHub: https://github.com/settings/keys
3. Testez la connexion: `ssh -T git@github.com`

---

## ✅ Étape 3: Vérifier que le Code est sur GitHub

1. **Allez sur**: https://github.com/VOTRE-USERNAME/carthage-wellness-spa
2. **Vérifiez** que tous vos fichiers sont là
3. **Vérifiez** que le `.gitignore` est présent
4. **Vérifiez** que le `README.md` est présent

---

## ✅ Étape 4: Configurer Vercel avec GitHub (Optionnel mais Recommandé)

### Méthode A: Via le Dashboard Vercel (Recommandé)

1. **Allez sur**: https://vercel.com
2. **Dashboard** → **"Add New"** → **"Project"**
3. **"Import Git Repository"**
4. **Sélectionnez votre repository** `carthage-wellness-spa`
5. **Configurez**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. **Environment Variables**:
   - `VITE_API_URL` = `https://votre-backend.onrender.com/api/v1` (vous l'ajouterez après le déploiement du backend)
7. **Deploy**

### Méthode B: Garder le Déploiement CLI

Vous pouvez continuer à utiliser `vercel --prod` depuis votre terminal. Le repo GitHub sera utile pour Render (backend).

---

## ✅ Étape 5: Configurer Render avec GitHub

1. **Allez sur**: https://render.com
2. **Connectez votre compte GitHub** (si ce n'est pas déjà fait)
3. **New +** → **Web Service**
4. **"Connect GitHub"** → **Sélectionnez votre repository** `carthage-wellness-spa`
5. **Configurez**:
   - **Name**: `carthage-wellness-backend`
   - **Region**: `Frankfurt` (ou le plus proche de vous)
   - **Branch**: `main`
   - **Root Directory**: `backend` ⚠️ **IMPORTANT**
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: **Free**
6. **Environment Variables** (ajoutez depuis votre `.env`):
   ```
   DATABASE_URL=...
   SUPABASE_URL=...
   SUPABASE_ANON_KEY=...
   SUPABASE_JWT_SECRET=...
   CORS_ORIGINS=https://votre-app.vercel.app,http://localhost:5174
   DEBUG=false
   ```
7. **Create Web Service**

---

## ✅ Étape 6: Connecter Frontend et Backend

1. **Dans Vercel**:
   - Allez dans **Settings** → **Environment Variables**
   - Ajoutez: `VITE_API_URL` = `https://votre-backend.onrender.com/api/v1`
   - **Redeploy** le frontend

2. **Dans Render**:
   - Allez dans **Environment** → **Environment Variables**
   - Ajoutez: `CORS_ORIGINS` = `https://votre-app.vercel.app,http://localhost:5174`

---

## 📋 Checklist

- [ ] Repository GitHub créé
- [ ] Code poussé sur GitHub
- [ ] Vercel connecté à GitHub (optionnel)
- [ ] Render connecté à GitHub
- [ ] Variables d'environnement configurées
- [ ] Frontend déployé
- [ ] Backend déployé
- [ ] Frontend et Backend connectés
- [ ] Site testé

---

## 🆘 Problèmes Courants

### Erreur: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/VOTRE-USERNAME/carthage-wellness-spa.git
```

### Erreur: "authentication failed"
- Utilisez un **Personal Access Token** au lieu d'un mot de passe
- Créez un token: https://github.com/settings/tokens

### Erreur: "branch main does not exist"
```bash
git branch -M main
git push -u origin main
```

### Erreur: "refusing to merge unrelated histories"
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## 🎉 Félicitations!

Une fois tout configuré, chaque fois que vous pousserez du code sur GitHub:
- **Vercel** déploiera automatiquement le frontend (si configuré)
- **Render** déploiera automatiquement le backend (si configuré)

---

## 📝 Commandes Git Utiles

### Voir l'état du repository
```bash
git status
```

### Voir l'historique des commits
```bash
git log --oneline
```

### Ajouter des fichiers
```bash
git add .
git commit -m "Description de vos changements"
git push
```

### Créer une nouvelle branche
```bash
git checkout -b nom-de-la-branche
git push -u origin nom-de-la-branche
```

### Revenir à la branche principale
```bash
git checkout main
```

---

## 🔗 Liens Utiles

- **GitHub**: https://github.com
- **Vercel**: https://vercel.com
- **Render**: https://render.com
- **Personal Access Token**: https://github.com/settings/tokens
- **SSH Keys**: https://github.com/settings/keys

