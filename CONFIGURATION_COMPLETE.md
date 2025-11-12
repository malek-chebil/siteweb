# ✅ Configuration Complète - Frontend Déployé sur Vercel

## 🌐 URL du Frontend

**Frontend Vercel**: https://frontend-mocha-seven-19.vercel.app/

---

## 📋 Checklist de Configuration

### ✅ Frontend (Vercel) - À Configurer

1. **Variables d'environnement dans Vercel**:
   - [ ] `VITE_API_URL` = URL de votre backend Render
   - [ ] `VITE_SUPABASE_URL` = URL de votre projet Supabase
   - [ ] `VITE_SUPABASE_ANON_KEY` = Clé anonyme Supabase

2. **Redéployer le frontend** après avoir ajouté les variables

### ✅ Backend (Render) - À Configurer

1. **Backend déployé sur Render**:
   - [ ] Backend déployé sur Render
   - [ ] URL du backend notée (ex: `https://carthage-wellness-backend.onrender.com`)

2. **Variables d'environnement dans Render**:
   - [ ] `DATABASE_URL` = URL de connexion PostgreSQL
   - [ ] `SUPABASE_URL` = URL de votre projet Supabase
   - [ ] `SUPABASE_ANON_KEY` = Clé anonyme Supabase
   - [ ] `SUPABASE_JWT_SECRET` = Secret JWT Supabase
   - [ ] `CORS_ORIGINS` = `https://frontend-mocha-seven-19.vercel.app,http://localhost:5174`
   - [ ] `DEBUG` = `false`

---

## 🎨 Étape 1: Configurer Vercel (Frontend)

### 1.1. Ouvrir les Paramètres Vercel

1. **Allez sur**: https://vercel.com/dashboard
2. **Connectez-vous** avec GitHub
3. **Sélectionnez votre projet** (probablement `frontend` ou `siteweb`)
4. **Cliquez sur "Settings"** (en haut)
5. **Cliquez sur "Environment Variables"** (dans le menu de gauche)

### 1.2. Ajouter les Variables

#### Variable 1: VITE_API_URL

- **Key**: `VITE_API_URL`
- **Value**: `https://votre-backend.onrender.com/api/v1`
  - ⚠️ **Remplacez `votre-backend.onrender.com` par l'URL de votre backend Render**
  - Si vous n'avez pas encore déployé le backend, utilisez temporairement: `http://localhost:8000/api/v1`
- **Environments**: 
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- **Cliquez sur "Add"**

#### Variable 2: VITE_SUPABASE_URL

- **Key**: `VITE_SUPABASE_URL`
- **Value**: Votre URL Supabase (ex: `https://xxx.supabase.co`)
  - ⚠️ **Copiez depuis votre fichier `.env` local**
- **Environments**: 
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- **Cliquez sur "Add"**

#### Variable 3: VITE_SUPABASE_ANON_KEY

- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: Votre clé anonyme Supabase
  - ⚠️ **Copiez depuis votre fichier `.env` local**
- **Environments**: 
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- **Cliquez sur "Add"**

### 1.3. Redéployer

1. **Allez dans "Deployments"** (dans le menu de gauche)
2. **Cliquez sur les trois points** (⋯) à côté du dernier déploiement
3. **Cliquez sur "Redeploy"**
4. **Sélectionnez "Use existing Build Cache"** ou **"Redeploy"**
5. **Attendez que le déploiement soit terminé**

---

## 🚀 Étape 2: Configurer Render (Backend)

### 2.1. Déployer le Backend (si pas encore fait)

1. **Allez sur**: https://render.com
2. **Connectez-vous** avec GitHub
3. **Cliquez sur "New +"** → **"Web Service"**
4. **Sélectionnez votre repository** `malek-chebil/siteweb`
5. **Configurez**:
   - **Name**: `carthage-wellness-backend`
   - **Region**: `Frankfurt` (ou le plus proche)
   - **Branch**: `main`
   - **Root Directory**: `backend` ⚠️ **IMPORTANT**
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: **Free**
6. **Cliquez sur "Create Web Service"**

### 2.2. Ajouter les Variables d'Environnement

1. **Dans votre service Render**, cliquez sur **"Environment"** (dans le menu de gauche)
2. **Dans la section "Environment Variables"**, ajoutez:

#### Variable 1: DATABASE_URL

- **Key**: `DATABASE_URL`
- **Value**: `postgresql+asyncpg://postgres:VOTRE_MOT_DE_PASSE@db.xxx.supabase.co:5432/postgres`
  - ⚠️ **Copiez depuis votre fichier `backend/.env` local**
  - ⚠️ **Format**: `postgresql+asyncpg://...` (pas `postgresql://...`)

#### Variable 2: SUPABASE_URL

- **Key**: `SUPABASE_URL`
- **Value**: `https://xxx.supabase.co`
  - ⚠️ **Copiez depuis votre fichier `backend/.env` local**

#### Variable 3: SUPABASE_ANON_KEY

- **Key**: `SUPABASE_ANON_KEY`
- **Value**: Votre clé anonyme Supabase
  - ⚠️ **Copiez depuis votre fichier `backend/.env` local**

#### Variable 4: SUPABASE_JWT_SECRET

- **Key**: `SUPABASE_JWT_SECRET`
- **Value**: Votre secret JWT Supabase
  - ⚠️ **Copiez depuis votre fichier `backend/.env` local**

#### Variable 5: CORS_ORIGINS ⚠️ **IMPORTANT**

- **Key**: `CORS_ORIGINS`
- **Value**: `https://frontend-mocha-seven-19.vercel.app,http://localhost:5174`
  - ⚠️ **Cette variable doit inclure l'URL de votre frontend Vercel**
  - ⚠️ **Format**: URLs séparées par des virgules (pas d'espaces)
  - ⚠️ **Utilisez `https://` pour la production**

#### Variable 6: DEBUG

- **Key**: `DEBUG`
- **Value**: `false`
  - ⚠️ **Utilisez `false` en production (pas `True`)**

### 2.3. Le Backend Redéploie Automatiquement

1. **Après avoir ajouté chaque variable**, Render redéploie automatiquement
2. **Attendez que le déploiement soit terminé** (vous verrez "Live" en vert)
3. **Notez l'URL du backend** (ex: `https://carthage-wellness-backend.onrender.com`)

---

## 🔄 Étape 3: Mettre à Jour VITE_API_URL dans Vercel

Une fois que votre backend est déployé sur Render:

1. **Retournez dans Vercel** → **Settings** → **Environment Variables**
2. **Trouvez `VITE_API_URL`**
3. **Mettez à jour la valeur** avec l'URL de votre backend Render:
   - Exemple: `https://carthage-wellness-backend.onrender.com/api/v1`
4. **Cliquez sur "Save"**
5. **Redéployez le frontend**

---

## ✅ Étape 4: Vérification

### 4.1. Vérifier le Frontend

1. **Visitez**: https://frontend-mocha-seven-19.vercel.app/
2. **Ouvrez la console du navigateur** (F12)
3. **Vérifiez qu'il n'y a pas d'erreurs**:
   - ❌ Si vous voyez: `VITE_API_URL is not defined` → Les variables d'environnement ne sont pas configurées
   - ❌ Si vous voyez: `Failed to fetch` ou `CORS policy` → Le backend n'est pas accessible ou CORS n'est pas configuré
   - ✅ Si tout fonctionne: Vous devriez voir la page d'accueil

### 4.2. Vérifier le Backend

1. **Testez l'endpoint de santé**: `https://votre-backend.onrender.com/health`
2. **Vous devriez voir**: `{"status":"ok"}`
3. **Testez l'API**: `https://votre-backend.onrender.com/api/v1/listings`

### 4.3. Tester l'Application

1. **Testez l'authentification**: Créez un compte ou connectez-vous
2. **Testez les annonces**: Créez, modifiez, supprimez des annonces
3. **Testez l'admin**: Si vous êtes admin, testez le panneau d'administration

---

## 🆘 Problèmes Courants

### Erreur: "VITE_API_URL is not defined"

**Solution**: 
1. Vérifiez que `VITE_API_URL` est bien définie dans Vercel
2. Vérifiez que vous avez redéployé après avoir ajouté la variable
3. Vérifiez que la variable commence par `VITE_` (nécessaire pour Vite)

### Erreur: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution**: 
1. Vérifiez que `CORS_ORIGINS` dans Render inclut: `https://frontend-mocha-seven-19.vercel.app`
2. Vérifiez que l'URL est correcte (avec `https://`)
3. Vérifiez que les URLs sont séparées par des virgules (pas d'espaces)
4. Vérifiez que le backend a redéployé après avoir ajouté la variable

### Erreur: "Failed to fetch" ou "Network error"

**Solution**: 
1. Vérifiez que le backend est déployé et fonctionne
2. Vérifiez que `VITE_API_URL` dans Vercel pointe vers le bon backend
3. Vérifiez que le backend est accessible (testez l'URL dans votre navigateur)

### Erreur: "Supabase connection failed"

**Solution**: 
1. Vérifiez que `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont corrects dans Vercel
2. Vérifiez que les valeurs sont identiques à celles de votre fichier `.env` local

---

## 📝 Résumé des URLs

### Frontend
- **URL Vercel**: https://frontend-mocha-seven-19.vercel.app/

### Backend
- **URL Render**: `https://votre-backend.onrender.com` (remplacez par votre URL)
- **Health Check**: `https://votre-backend.onrender.com/health`
- **API Base**: `https://votre-backend.onrender.com/api/v1`

### Supabase
- **URL**: `https://xxx.supabase.co` (remplacez par votre URL)

---

## 🔒 Sécurité

⚠️ **Important**: 

- ✅ Ne partagez JAMAIS vos variables d'environnement publiquement
- ✅ Ne commitez JAMAIS votre fichier `.env` dans Git
- ✅ Utilisez des mots de passe forts pour votre base de données
- ✅ Régénérez vos secrets Supabase si vous pensez qu'ils ont été compromis

---

## 📚 Ressources

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com
- **Frontend URL**: https://frontend-mocha-seven-19.vercel.app/
- **Supabase Dashboard**: https://supabase.com/dashboard

---

## ✅ Checklist Finale

### Frontend (Vercel)
- [ ] `VITE_API_URL` ajouté (avec l'URL du backend Render)
- [ ] `VITE_SUPABASE_URL` ajouté
- [ ] `VITE_SUPABASE_ANON_KEY` ajouté
- [ ] Variables configurées pour Production, Preview, Development
- [ ] Frontend redéployé
- [ ] Site accessible: https://frontend-mocha-seven-19.vercel.app/

### Backend (Render)
- [ ] Backend déployé sur Render
- [ ] `DATABASE_URL` ajouté
- [ ] `SUPABASE_URL` ajouté
- [ ] `SUPABASE_ANON_KEY` ajouté
- [ ] `SUPABASE_JWT_SECRET` ajouté
- [ ] `CORS_ORIGINS` inclut: `https://frontend-mocha-seven-19.vercel.app`
- [ ] `DEBUG` = `false`
- [ ] Backend accessible (testez `/health`)

### Test
- [ ] Frontend fonctionne
- [ ] Backend fonctionne
- [ ] Authentification fonctionne
- [ ] API fonctionne
- [ ] Pas d'erreurs CORS

---

**Bon déploiement ! 🚀**

