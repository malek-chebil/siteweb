# ⚡ Déploiement Rapide - Guide Express

## Solution la Plus Rapide: Vercel + Railway/Render (15 minutes)

### ⚠️ Note sur les Plans Gratuits:

**Vercel (Frontend)**:
- ✅ **100% Gratuit** pour les projets personnels
- ✅ 100GB bandwidth/mois
- ✅ Déploiements illimités
- ✅ Domaine gratuit `.vercel.app`
- ✅ SSL automatique

**Railway (Backend)**:
- ⚠️ **$5 de crédit gratuit/mois** (peut s'épuiser rapidement)
- ⚠️ Après épuisement, nécessite un plan payant ($5-20/mois)
- ✅ Suffisant pour des démos/test

**Render (Backend - Alternative)**:
- ✅ **100% Gratuit** avec limitations:
  - Service peut "s'endormir" après 15 min d'inactivité
  - Premier démarrage peut prendre 30-60 secondes
  - Parfait pour les démos et projets personnels

### Étape 1: Déployer le Frontend sur Vercel (5 min)

1. **Installer Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Se connecter**:
   ```bash
   vercel login
   ```

3. **Déployer**:
   ```bash
   cd frontend
   vercel
   ```
   - Appuyez sur Entrée pour toutes les questions par défaut
   - Notez l'URL générée (ex: `https://your-app.vercel.app`)

### Étape 2: Déployer le Backend sur Railway OU Render (10 min)

#### Option A: Railway (Plus Rapide, mais crédit limité)

1. **Aller sur**: https://railway.app
2. **Créer un compte** (avec GitHub)
3. **Nouveau Projet** → **Empty Project**
4. **Ajouter un service** → **GitHub Repo** (ou uploader les fichiers)
5. **Sélectionner le dossier `backend`**
6. **Configurer**:
   - Railway détectera automatiquement Python
   - Ajoutez ces variables d'environnement dans Settings → Variables:
     ```
     DATABASE_URL=votre_url_supabase
     SUPABASE_URL=votre_url_supabase
     SUPABASE_KEY=votre_cle_supabase
     JWT_SECRET=votre_secret_jwt
     DEBUG=false
     ```
7. **Déployer**: Railway déploiera automatiquement
8. **Copier l'URL** (ex: `https://your-app.railway.app`)

#### Option B: Render (100% Gratuit, mais peut être lent)
1. **Aller sur**: https://render.com
2. **Créer un compte gratuit**
3. **Nouveau** → **Web Service**
4. **Connecter votre repo GitHub** (ou uploader les fichiers)
5. **Configurer**:
   - **Name**: `your-backend-name`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `backend`
6. **Variables d'environnement** (Advanced → Environment Variables):
   ```
   DATABASE_URL=votre_url_supabase
   SUPABASE_URL=votre_url_supabase
   SUPABASE_ANON_KEY=votre_cle_supabase
   SUPABASE_JWT_SECRET=votre_secret_jwt
   CORS_ORIGINS=https://your-app.vercel.app,http://localhost:5174
   DEBUG=false
   ```
7. **Créer le service** (gratuit)
8. **Attendre le déploiement** (5-10 minutes la première fois)
9. **Copier l'URL** (ex: `https://your-app.onrender.com`)

### Étape 3: Connecter Frontend et Backend

1. **Dans Vercel Dashboard**:
   - Allez sur votre projet
   - Settings → Environment Variables
   - Ajoutez: `VITE_API_URL` = `https://your-app.railway.app/api/v1`
   - Redéployez (Settings → Deployments → Redeploy)

2. **Mettre à jour CORS dans le backend**:
   - Dans Railway, ajoutez la variable:
     ```
     ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:5174
     ```

### Étape 4: Tester et Partager

1. **Tester l'URL**: `https://your-app.vercel.app`
2. **Partager avec le client**: Envoyez simplement l'URL Vercel

---

## Alternative: ngrok (Démo Immédiate - 2 minutes)

Si vous voulez juste montrer rapidement sans déployer:

1. **Démarrer le backend**:
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Démarrer le frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Installer ngrok**:
   - Télécharger: https://ngrok.com/download
   - Ou: `npm install -g ngrok`

4. **Créer un tunnel** (dans un nouveau terminal):
   ```bash
   ngrok http 5174
   ```

5. **Copier l'URL HTTPS** (ex: `https://abc123.ngrok.io`)

6. **Mettre à jour l'API**:
   - Dans `frontend/src/lib/api.js`, changez temporairement:
   ```javascript
   const API_URL = 'http://localhost:8000/api/v1'  // Gardez localhost pour ngrok
   ```
   - Ou créez un autre tunnel ngrok pour le backend (port 8000)

7. **Partager l'URL ngrok** avec le client

⚠️ **Note**: L'URL ngrok change à chaque redémarrage (sauf compte payant)

---

## Fichiers à Créer (si nécessaire)

### `frontend/vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### `backend/Procfile`:
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

## URLs Finales

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`
- **Admin Panel**: `https://your-app.vercel.app/admin`

---

## Problèmes Courants

### CORS Error
- Vérifiez que l'URL frontend est dans `ALLOWED_ORIGINS` du backend

### API Not Found
- Vérifiez que `VITE_API_URL` est configuré dans Vercel
- Vérifiez que l'URL se termine par `/api/v1`

### Images Not Loading
- Vérifiez que Supabase Storage est configuré
- Vérifiez les permissions des buckets

---

## Support

Pour plus de détails, voir `DEPLOYMENT_GUIDE.md`

