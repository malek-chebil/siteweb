# 📝 Exemple de Configuration Complète

## 🎯 Configuration Actuelle

### Frontend (Vercel)
- **URL**: https://frontend-mocha-seven-19.vercel.app/

### Backend (Render)
- **URL**: `https://votre-backend.onrender.com` (remplacez par votre URL)

---

## 📋 Configuration dans Vercel

### Variables d'Environnement

| Variable | Valeur | Environnements |
|----------|--------|----------------|
| `VITE_SUPABASE_URL` | `https://cvtrghsdfkrwgasvnflb.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development |
| `VITE_API_URL` | `https://votre-backend.onrender.com/api/v1` ⚠️ **À METTRE À JOUR** | Production, Preview, Development |

⚠️ **IMPORTANT**: Remplacez `votre-backend.onrender.com` par l'URL de votre backend Render!

---

## 📋 Configuration dans Render

### Variables d'Environnement

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | `postgresql+asyncpg://postgres.cvtrghsdfkrwgasvnflb:Malouka33%40%40@aws-1-eu-west-1.pooler.supabase.com:5432/postgres` |
| `SUPABASE_URL` | `https://cvtrghsdfkrwgasvnflb.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_JWT_SECRET` | `O6fBsOp9AMwPpfnSN1cj1TH0Ivzs0BFAZgiFlU+zJEiPsFyH22SR7+2e9BAdq/ENHgUycs2gpRvN5lKqGUISEg==` |
| `CORS_ORIGINS` | `https://frontend-mocha-seven-19.vercel.app,http://localhost:5174,http://localhost:5173,http://localhost:3000` |
| `DEBUG` | `false` |

---

## 🔍 Exemple Concret

### Si votre backend Render est:
```
https://carthage-wellness-backend.onrender.com
```

### Configuration dans Vercel:

**Variable**: `VITE_API_URL`
**Valeur**: `https://carthage-wellness-backend.onrender.com/api/v1`

### Configuration dans Render:

**Variable**: `CORS_ORIGINS`
**Valeur**: `https://frontend-mocha-seven-19.vercel.app,http://localhost:5174,http://localhost:5173,http://localhost:3000`

---

## ✅ Vérification

### 1. Backend Accessible

1. **Testez**: `https://votre-backend.onrender.com/health`
2. **Réponse attendue**: `{"status":"ok"}`

### 2. Frontend Fonctionnel

1. **Visitez**: https://frontend-mocha-seven-19.vercel.app/
2. **Ouvrez la console** (F12)
3. **Vérifiez que les requêtes vont vers**: `https://votre-backend.onrender.com/api/v1/...`
4. **Pas d'erreurs `localhost:8000`**

---

## 🆘 Problèmes Courants

### Erreur: "localhost:8000"

**Cause**: `VITE_API_URL` dans Vercel est toujours `http://localhost:8000/api/v1`

**Solution**: Mettre à jour `VITE_API_URL` avec l'URL du backend Render

### Erreur: "CORS policy"

**Cause**: `CORS_ORIGINS` dans Render ne contient pas l'URL du frontend Vercel

**Solution**: Mettre à jour `CORS_ORIGINS` avec: `https://frontend-mocha-seven-19.vercel.app`

---

## 📚 Ressources

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com
- **Frontend URL**: https://frontend-mocha-seven-19.vercel.app/
- **Backend URL**: `https://votre-backend.onrender.com`

---

**Configuration complète! 🚀**

