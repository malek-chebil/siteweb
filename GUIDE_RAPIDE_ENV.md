# 🚀 Guide Rapide - Variables d'Environnement

## 📋 Résumé

Ce guide rapide vous montre comment copier vos variables d'environnement depuis vos fichiers `.env` locaux vers **Vercel** et **Render**.

---

## 🎨 Frontend (Vercel)

### Variables à Ajouter

1. **Allez sur**: https://vercel.com → Projet → Settings → Environment Variables

2. **Ajoutez ces 3 variables**:

```
VITE_API_URL=https://votre-backend.onrender.com/api/v1
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Important**:
- `VITE_API_URL` : Remplacez `http://localhost:8000` par l'URL de votre backend Render
- `VITE_SUPABASE_URL` : Copiez exactement depuis votre `.env` local
- `VITE_SUPABASE_ANON_KEY` : Copiez exactement depuis votre `.env` local

3. **Cochez**: Production, Preview, Development

4. **Redéployez** le frontend

---

## 🚀 Backend (Render)

### Variables à Ajouter

1. **Allez sur**: https://render.com → Service → Environment

2. **Ajoutez ces 6 variables**:

```
DATABASE_URL=postgresql+asyncpg://postgres:password@db.xxx.supabase.co:5432/postgres
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=votre-jwt-secret-ici
CORS_ORIGINS=https://votre-app.vercel.app,http://localhost:5174
DEBUG=false
```

**⚠️ Important**:
- `DATABASE_URL` : Copiez exactement depuis votre `.env` local
- `SUPABASE_URL` : Copiez exactement depuis votre `.env` local
- `SUPABASE_ANON_KEY` : Copiez exactement depuis votre `.env` local
- `SUPABASE_JWT_SECRET` : Copiez exactement depuis votre `.env` local
- `CORS_ORIGINS` : Remplacez `http://localhost:5174` par l'URL de votre frontend Vercel
- `DEBUG` : Utilisez `false` en production (pas `True`)

3. **Le backend redéploiera automatiquement**

---

## 📝 Ordre d'Exécution

1. ✅ **Déployer le backend sur Render** (avec les variables)
2. ✅ **Noter l'URL du backend** (ex: `https://carthage-wellness-backend.onrender.com`)
3. ✅ **Déployer le frontend sur Vercel** (avec `VITE_API_URL` = URL du backend)
4. ✅ **Noter l'URL du frontend** (ex: `https://siteweb.vercel.app`)
5. ✅ **Mettre à jour `CORS_ORIGINS` dans Render** (avec l'URL du frontend)

---

## ✅ Vérification

### Frontend

1. Visitez votre site Vercel
2. Ouvrez la console (F12)
3. Vérifiez qu'il n'y a pas d'erreurs

### Backend

1. Visitez `https://votre-backend.onrender.com/health`
2. Vous devriez voir: `{"status":"ok"}`

---

## 🆘 Aide

Si vous avez des problèmes, consultez:
- `CONFIGURER_ENV_DEPLOIEMENT.md` - Guide détaillé
- `AJOUTER_VARIABLES_ENV.md` - Instructions étape par étape
- `VARIABLES_ENVIRONNEMENT.md` - Documentation complète

---

**Bon déploiement ! 🚀**

