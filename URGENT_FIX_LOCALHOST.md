# 🚨 URGENT: Fix Erreur localhost dans le Frontend

## ❌ Problème Actuel

Le frontend essaie d'accéder à `http://localhost:8000` au lieu de l'URL du backend Render.

**Erreurs dans la console**:
```
Access to XMLHttpRequest at 'http://localhost:8000/api/v1/...' from origin 'https://frontend-mocha-seven-19.vercel.app' has been blocked by CORS policy
GET http://localhost:8000/api/v1/listings net::ERR_FAILED
```

---

## ✅ Solution Immédiate (2 minutes)

### Étape 1: Trouver l'URL du Backend Render

1. **Allez sur**: https://dashboard.render.com
2. **Sélectionnez votre service backend**
3. **Notez l'URL** (ex: `https://carthage-wellness-backend.onrender.com`)
4. **L'URL complète de l'API sera**: `https://carthage-wellness-backend.onrender.com/api/v1`

### Étape 2: Mettre à Jour VITE_API_URL dans Vercel

1. **Allez sur**: https://vercel.com/dashboard
2. **Sélectionnez votre projet** → **Settings** → **Environment Variables**
3. **Trouvez `VITE_API_URL`**
4. **Cliquez sur "Edit"** ou **"..."** → **"Edit"**
5. **Mettez à jour la valeur**:
   - **Ancienne**: `http://localhost:8000/api/v1` ❌
   - **Nouvelle**: `https://votre-backend.onrender.com/api/v1` ✅
     - Remplacez `votre-backend.onrender.com` par votre URL Render
6. **Cliquez sur "Save"**

### Étape 3: Redéployer le Frontend

1. **Allez dans "Deployments"**
2. **Cliquez sur "..."** → **"Redeploy"**
3. **Attendez 1-2 minutes**
4. **Testez**: https://frontend-mocha-seven-19.vercel.app/

---

## 🔍 Vérification

### Dans Vercel:
- [ ] `VITE_API_URL` = `https://votre-backend.onrender.com/api/v1` (pas `http://localhost:8000/api/v1`)
- [ ] Frontend redéployé

### Dans le Navigateur:
- [ ] Visitez: https://frontend-mocha-seven-19.vercel.app/
- [ ] Ouvrez la console (F12)
- [ ] Vérifiez que les requêtes vont vers: `https://votre-backend.onrender.com/api/v1/...`
- [ ] Pas d'erreurs `localhost:8000`

---

## ⚠️ Important

**NE PAS utiliser `http://localhost:8000/api/v1` en production!**

- ❌ `localhost` n'est pas accessible depuis Internet
- ❌ Le frontend Vercel est sur Internet, pas sur votre machine
- ❌ Les navigateurs bloquent les requêtes HTTPS vers localhost
- ✅ Utilisez l'URL publique du backend Render

---

**Après avoir mis à jour `VITE_API_URL` et redéployé, le problème sera résolu! 🚀**

