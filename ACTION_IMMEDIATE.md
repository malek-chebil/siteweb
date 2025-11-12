# 🚀 Actions Immédiates - Configuration Frontend Vercel

## ✅ Frontend Déployé

**URL**: https://frontend-mocha-seven-19.vercel.app/

---

## 📋 Action 1: Configurer les Variables dans Vercel (5 minutes)

### Étape 1: Ouvrir Vercel

1. **Allez sur**: https://vercel.com/dashboard
2. **Sélectionnez votre projet** (probablement `frontend` ou `siteweb`)
3. **Settings** → **Environment Variables**

### Étape 2: Ajouter 3 Variables

#### 1. VITE_API_URL
- **Key**: `VITE_API_URL`
- **Value**: `https://votre-backend.onrender.com/api/v1`
  - ⚠️ Remplacez par l'URL de votre backend Render
  - Si backend pas encore déployé: `http://localhost:8000/api/v1` (temporaire)

#### 2. VITE_SUPABASE_URL
- **Key**: `VITE_SUPABASE_URL`
- **Value**: Copiez depuis votre fichier `frontend/.env` local

#### 3. VITE_SUPABASE_ANON_KEY
- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: Copiez depuis votre fichier `frontend/.env` local

### Étape 3: Redéployer

1. **Deployments** → **⋯** → **Redeploy**

---

## 🚀 Action 2: Déployer le Backend sur Render (10 minutes)

### Si le backend n'est pas encore déployé:

1. **Allez sur**: https://render.com
2. **New +** → **Web Service**
3. **Connectez votre repository**: `malek-chebil/siteweb`
4. **Configurez**:
   - **Name**: `carthage-wellness-backend`
   - **Root Directory**: `backend` ⚠️ **IMPORTANT**
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: **Free**

### Ajouter les Variables dans Render:

1. **Environment** → **Environment Variables**
2. **Ajoutez** (copiez depuis votre `backend/.env`):
   - `DATABASE_URL`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_JWT_SECRET`
   - `CORS_ORIGINS` = `https://frontend-mocha-seven-19.vercel.app,http://localhost:5174` ⚠️ **IMPORTANT**
   - `DEBUG` = `false`

### Noter l'URL du Backend:

- Exemple: `https://carthage-wellness-backend.onrender.com`
- ⚠️ **Notez cette URL**, vous en aurez besoin pour mettre à jour `VITE_API_URL` dans Vercel

---

## 🔄 Action 3: Mettre à Jour VITE_API_URL dans Vercel (2 minutes)

Une fois le backend déployé:

1. **Retournez dans Vercel** → **Settings** → **Environment Variables**
2. **Mettez à jour `VITE_API_URL`** avec l'URL de votre backend Render
   - Exemple: `https://carthage-wellness-backend.onrender.com/api/v1`
3. **Redéployez le frontend**

---

## ✅ Vérification

### 1. Vérifier le Frontend

1. **Visitez**: https://frontend-mocha-seven-19.vercel.app/
2. **Ouvrez la console** (F12)
3. **Vérifiez qu'il n'y a pas d'erreurs**

### 2. Vérifier le Backend

1. **Testez**: `https://votre-backend.onrender.com/health`
2. **Vous devriez voir**: `{"status":"ok"}`

### 3. Tester l'Application

1. **Testez l'authentification**
2. **Testez les annonces**
3. **Vérifiez qu'il n'y a pas d'erreurs CORS**

---

## 🆘 Problèmes Courants

### Erreur CORS

**Solution**: Vérifiez que `CORS_ORIGINS` dans Render inclut:
```
https://frontend-mocha-seven-19.vercel.app,http://localhost:5174
```

### Erreur: "VITE_API_URL is not defined"

**Solution**: Vérifiez que la variable est ajoutée dans Vercel et que vous avez redéployé.

### Erreur: "Failed to fetch"

**Solution**: Vérifiez que le backend est déployé et que `VITE_API_URL` pointe vers le bon backend.

---

## 📚 Guides Détaillés

- **`CONFIGURATION_COMPLETE.md`** - Guide complet étape par étape
- **`CONFIGURATION_VERCEL.md`** - Guide spécifique Vercel
- **`AJOUTER_VARIABLES_ENV.md`** - Guide pour ajouter les variables

---

**Bon déploiement ! 🚀**

