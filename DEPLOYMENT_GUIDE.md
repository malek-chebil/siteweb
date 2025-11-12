# 🚀 Guide de Déploiement - Envoyer la Démo au Client

## Option 1: Solution Rapide (ngrok) - Pour une démo immédiate ⚡

### Étapes:
1. **Installer ngrok** (si pas déjà installé):
   ```bash
   # Télécharger depuis https://ngrok.com/download
   # Ou via npm:
   npm install -g ngrok
   ```

2. **Démarrer votre backend** (dans un terminal):
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Démarrer votre frontend** (dans un autre terminal):
   ```bash
   cd frontend
   npm run dev
   ```

4. **Créer un tunnel ngrok pour le backend**:
   ```bash
   ngrok http 8000
   ```
   - Copiez l'URL HTTPS (ex: `https://abc123.ngrok.io`)

5. **Mettre à jour l'URL API dans le frontend**:
   - Ouvrez `frontend/src/lib/api.js`
   - Changez `baseURL` vers votre URL ngrok
   ```javascript
   baseURL: 'https://abc123.ngrok.io'
   ```

6. **Créer un tunnel ngrok pour le frontend**:
   ```bash
   ngrok http 5174
   ```
   - Copiez l'URL HTTPS (ex: `https://xyz789.ngrok.io`)

7. **Envoyer l'URL frontend à votre client**: `https://xyz789.ngrok.io`

⚠️ **Note**: Les URLs ngrok changent à chaque redémarrage (sauf avec compte payant)

---

## Option 2: Déploiement Gratuit (Recommandé) 🎯

### Frontend sur Vercel (Gratuit)

1. **Installer Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Se connecter**:
   ```bash
   vercel login
   ```

3. **Déployer le frontend**:
   ```bash
   cd frontend
   vercel
   ```
   - Suivez les instructions
   - Vercel détectera automatiquement Vite

4. **Configurer les variables d'environnement** (si nécessaire):
   - Allez sur https://vercel.com/dashboard
   - Sélectionnez votre projet
   - Settings → Environment Variables
   - Ajoutez `VITE_API_URL` avec l'URL de votre backend

### Backend sur Railway (Gratuit avec limite)

1. **Créer un compte sur Railway**: https://railway.app

2. **Créer un nouveau projet**:
   - Cliquez sur "New Project"
   - Sélectionnez "Deploy from GitHub repo" (recommandé)
   - Ou "Empty Project" puis uploader les fichiers

3. **Configurer le backend**:
   - Ajoutez un service "Python"
   - Railway détectera automatiquement FastAPI
   - Ajoutez les variables d'environnement:
     - `DATABASE_URL`
     - `SUPABASE_URL`
     - `SUPABASE_KEY`
     - `JWT_SECRET`
     - etc.

4. **Créer un fichier `railway.json`** dans le dossier `backend`:
   ```json
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

5. **Créer un fichier `Procfile`** dans `backend`:
   ```
   web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

6. **Déployer**:
   - Railway déploiera automatiquement
   - Copiez l'URL du backend (ex: `https://your-app.railway.app`)

7. **Mettre à jour le frontend**:
   - Dans Vercel, ajoutez la variable `VITE_API_URL` avec l'URL Railway

---

## Option 3: Déploiement Backend sur Render (Alternative Gratuite)

1. **Créer un compte**: https://render.com

2. **Créer un nouveau "Web Service"**:
   - Connectez votre repo GitHub
   - Ou uploader les fichiers

3. **Configuration**:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Python 3

4. **Variables d'environnement**:
   - Ajoutez toutes vos variables d'env dans l'interface Render

5. **Déployer**:
   - Render déploiera automatiquement
   - URL: `https://your-app.onrender.com`

---

## Option 4: Déploiement Complet (Frontend + Backend)

### Structure Recommandée:

```
Frontend: Vercel (https://your-app.vercel.app)
Backend: Railway ou Render (https://your-api.railway.app)
Database: Supabase (déjà configuré)
Storage: Supabase Storage (déjà configuré)
```

### Fichiers à Créer:

#### 1. `frontend/vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
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

#### 2. `backend/Procfile`:
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

#### 3. `backend/runtime.txt` (pour Render):
```
python-3.11.0
```

---

## Configuration CORS pour Production

Assurez-vous que votre backend autorise les requêtes depuis votre frontend:

Dans `backend/app/main.py`, vérifiez:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-app.vercel.app",  # URL de votre frontend
        "http://localhost:5174",  # Pour développement local
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Checklist Avant de Partager avec le Client ✅

- [ ] Backend déployé et accessible
- [ ] Frontend déployé et accessible
- [ ] CORS configuré correctement
- [ ] Variables d'environnement configurées
- [ ] Base de données connectée
- [ ] Images/assets accessibles
- [ ] Testez toutes les fonctionnalités:
  - [ ] Inscription/Connexion
  - [ ] Création d'annonce
  - [ ] Upload d'images
  - [ ] Recherche
  - [ ] Admin panel

---

## URLs à Partager avec le Client

**URL Frontend**: `https://your-app.vercel.app`
**URL Admin**: `https://your-app.vercel.app/admin`

**Comptes de test** (créez-les avant):
- Email: `admin@test.com` / Password: `admin123`
- Email: `user@test.com` / Password: `user123`

---

## Support

Si vous rencontrez des problèmes:
1. Vérifiez les logs dans Vercel/Railway/Render
2. Vérifiez la console du navigateur (F12)
3. Vérifiez que toutes les variables d'environnement sont configurées
4. Vérifiez que CORS est correctement configuré

---

## Note Importante

Pour un déploiement permanent, considérez:
- Un domaine personnalisé (ex: `www.votresite.com`)
- SSL/HTTPS (automatique avec Vercel/Railway/Render)
- Monitoring et logs
- Backup de la base de données

