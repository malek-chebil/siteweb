# 📋 Liste Complète des Variables d'Environnement

## 🎯 Vue d'Ensemble

Ce guide liste **toutes les variables d'environnement** que vous devez ajouter dans **Vercel** (frontend) et **Render** (backend).

---

## 🎨 Frontend - Vercel (3 variables)

### Configuration dans Vercel

1. **Allez sur**: https://vercel.com/dashboard
2. **Sélectionnez votre projet** → **Settings** → **Environment Variables**
3. **Ajoutez ces 3 variables**:

---

### Variable 1: VITE_SUPABASE_URL

- **Key**: `VITE_SUPABASE_URL`
- **Value**: `https://cvtrghsdfkrwgasvnflb.supabase.co`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- **Description**: URL de votre projet Supabase

---

### Variable 2: VITE_SUPABASE_ANON_KEY

- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2dHJnaHNkZmtyd2dhc3ZuZmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Mjc3NDQsImV4cCI6MjA3ODIwMzc0NH0.EKRO_aOfDQs9EiuSyiJvl-n4n4_6zncokZJ1d4GpqiU`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- **Description**: Clé anonyme Supabase pour l'authentification

---

### Variable 3: VITE_API_URL ⚠️ **IMPORTANT**

- **Key**: `VITE_API_URL`
- **Value**: `https://carthage-wellness-backend.onrender.com/api/v1`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- **Description**: URL de l'API backend (votre backend Render)
- ⚠️ **IMPORTANT**: Utilisez cette valeur exacte (pas `http://localhost:8000/api/v1`!)

---

## 🚀 Backend - Render (6 variables)

### Configuration dans Render

1. **Allez sur**: https://dashboard.render.com
2. **Sélectionnez votre service backend** (`carthage-wellness-backend`)
3. **Cliquez sur "Environment"** → **"Environment Variables"**
4. **Ajoutez ces 6 variables**:

---

### Variable 1: DATABASE_URL

- **Key**: `DATABASE_URL`
- **Value**: `postgresql+asyncpg://postgres.cvtrghsdfkrwgasvnflb:Malouka33%40%40@aws-1-eu-west-1.pooler.supabase.com:5432/postgres`
- **Description**: URL de connexion à la base de données PostgreSQL (Supabase)

---

### Variable 2: SUPABASE_URL

- **Key**: `SUPABASE_URL`
- **Value**: `https://cvtrghsdfkrwgasvnflb.supabase.co`
- **Description**: URL de votre projet Supabase

---

### Variable 3: SUPABASE_ANON_KEY

- **Key**: `SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2dHJnaHNkZmtyd2dhc3ZuZmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Mjc3NDQsImV4cCI6MjA3ODIwMzc0NH0.EKRO_aOfDQs9EiuSyiJvl-n4n4_6zncokZJ1d4GpqiU`
- **Description**: Clé anonyme Supabase

---

### Variable 4: SUPABASE_JWT_SECRET

- **Key**: `SUPABASE_JWT_SECRET`
- **Value**: `O6fBsOp9AMwPpfnSN1cj1TH0Ivzs0BFAZgiFlU+zJEiPsFyH22SR7+2e9BAdq/ENHgUycs2gpRvN5lKqGUISEg==`
- **Description**: Secret JWT Supabase pour la vérification des tokens

---

### Variable 5: CORS_ORIGINS ⚠️ **IMPORTANT**

- **Key**: `CORS_ORIGINS`
- **Value**: `https://frontend-mocha-seven-19.vercel.app,http://localhost:5174,http://localhost:5173,http://localhost:3000`
- **Description**: Origines CORS autorisées (URLs du frontend)
- ⚠️ **IMPORTANT**: 
  - Inclut l'URL de votre frontend Vercel: `https://frontend-mocha-seven-19.vercel.app`
  - Format: URLs séparées par des virgules (pas d'espaces)
  - Utilisez `https://` pour la production

---

### Variable 6: DEBUG

- **Key**: `DEBUG`
- **Value**: `false`
- **Description**: Mode debug (utilisez `false` en production)
- ⚠️ **IMPORTANT**: Utilisez `false` en production (pas `True` ou `true`!)

---

## 📋 Tableau Récapitulatif

### Frontend (Vercel)

| Variable | Valeur | Environnements |
|----------|--------|----------------|
| `VITE_SUPABASE_URL` | `https://cvtrghsdfkrwgasvnflb.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development |
| `VITE_API_URL` | `https://carthage-wellness-backend.onrender.com/api/v1` | Production, Preview, Development |

### Backend (Render)

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | `postgresql+asyncpg://postgres.cvtrghsdfkrwgasvnflb:Malouka33%40%40@aws-1-eu-west-1.pooler.supabase.com:5432/postgres` |
| `SUPABASE_URL` | `https://cvtrghsdfkrwgasvnflb.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_JWT_SECRET` | `O6fBsOp9AMwPpfnSN1cj1TH0Ivzs0BFAZgiFlU+zJEiPsFyH22SR7+2e9BAdq/ENHgUycs2gpRvN5lKqGUISEg==` |
| `CORS_ORIGINS` | `https://frontend-mocha-seven-19.vercel.app,http://localhost:5174,http://localhost:5173,http://localhost:3000` |
| `DEBUG` | `false` |

---

## ✅ Checklist

### Frontend (Vercel)

- [ ] `VITE_SUPABASE_URL` ajouté
- [ ] `VITE_SUPABASE_ANON_KEY` ajouté
- [ ] `VITE_API_URL` ajouté: `https://carthage-wellness-backend.onrender.com/api/v1`
- [ ] Variables configurées pour Production, Preview, Development
- [ ] Frontend redéployé

### Backend (Render)

- [ ] `DATABASE_URL` ajouté
- [ ] `SUPABASE_URL` ajouté
- [ ] `SUPABASE_ANON_KEY` ajouté
- [ ] `SUPABASE_JWT_SECRET` ajouté
- [ ] `CORS_ORIGINS` ajouté: `https://frontend-mocha-seven-19.vercel.app,http://localhost:5174,http://localhost:5173,http://localhost:3000`
- [ ] `DEBUG` ajouté: `false`
- [ ] Backend déployé et fonctionnel

---

## 🔍 Comment Ajouter les Variables

### Dans Vercel

1. **Allez sur**: https://vercel.com/dashboard
2. **Sélectionnez votre projet** → **Settings** → **Environment Variables**
3. **Cliquez sur "Add New"** ou **"Add"**
4. **Remplissez**:
   - **Key**: Nom de la variable (ex: `VITE_API_URL`)
   - **Value**: Valeur de la variable (ex: `https://carthage-wellness-backend.onrender.com/api/v1`)
   - **Environments**: Cochez Production, Preview, Development
5. **Cliquez sur "Add"** ou **"Save"**
6. **Répétez pour chaque variable**

### Dans Render

1. **Allez sur**: https://dashboard.render.com
2. **Sélectionnez votre service backend** → **Environment** → **"Environment Variables"**
3. **Dans le tableau**, ajoutez:
   - **Key**: Nom de la variable (ex: `DATABASE_URL`)
   - **Value**: Valeur de la variable (ex: `postgresql+asyncpg://...`)
4. **Cliquez sur "Save Changes"**
5. **Render redéploiera automatiquement** après chaque sauvegarde
6. **Répétez pour chaque variable**

---

## 📝 Notes Importantes

### Format des Variables

- ✅ **Pas d'espaces** après les virgules dans `CORS_ORIGINS`
- ✅ **Utilisez `https://`** pour la production
- ✅ **Pas de slash final** (`/`) à la fin des URLs
- ✅ **Case-sensitive**: Les noms de variables sont sensibles à la casse

### Valeurs Importantes

- ✅ `VITE_API_URL` = `https://carthage-wellness-backend.onrender.com/api/v1` (pas `http://localhost:8000/api/v1`)
- ✅ `CORS_ORIGINS` = `https://frontend-mocha-seven-19.vercel.app,http://localhost:5174,http://localhost:5173,http://localhost:3000`
- ✅ `DEBUG` = `false` (pas `True` ou `true`)

---

## 🔗 URLs

### Frontend
- **URL Vercel**: https://frontend-mocha-seven-19.vercel.app/

### Backend
- **URL Render**: https://carthage-wellness-backend.onrender.com
- **Health Check**: https://carthage-wellness-backend.onrender.com/health
- **API Base**: https://carthage-wellness-backend.onrender.com/api/v1

---

## 🆘 Vérification

### Frontend (Vercel)

1. **Allez sur**: https://vercel.com/dashboard
2. **Projet** → **Settings** → **Environment Variables**
3. **Vérifiez que toutes les variables sont présentes**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` = `https://carthage-wellness-backend.onrender.com/api/v1`

### Backend (Render)

1. **Allez sur**: https://dashboard.render.com
2. **Service backend** → **Environment** → **Environment Variables**
3. **Vérifiez que toutes les variables sont présentes**:
   - `DATABASE_URL`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_JWT_SECRET`
   - `CORS_ORIGINS` = `https://frontend-mocha-seven-19.vercel.app,http://localhost:5174,http://localhost:5173,http://localhost:3000`
   - `DEBUG` = `false`

---

## 📚 Ressources

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com
- **Supabase Dashboard**: https://supabase.com/dashboard/project/cvtrghsdfkrwgasvnflb
- **Frontend URL**: https://frontend-mocha-seven-19.vercel.app/
- **Backend URL**: https://carthage-wellness-backend.onrender.com

---

## ✅ Résumé

### Frontend (Vercel) - 3 variables

1. `VITE_SUPABASE_URL` = `https://cvtrghsdfkrwgasvnflb.supabase.co`
2. `VITE_SUPABASE_ANON_KEY` = (votre clé)
3. `VITE_API_URL` = `https://carthage-wellness-backend.onrender.com/api/v1`

### Backend (Render) - 6 variables

1. `DATABASE_URL` = (votre URL de base de données)
2. `SUPABASE_URL` = `https://cvtrghsdfkrwgasvnflb.supabase.co`
3. `SUPABASE_ANON_KEY` = (votre clé)
4. `SUPABASE_JWT_SECRET` = (votre secret)
5. `CORS_ORIGINS` = `https://frontend-mocha-seven-19.vercel.app,http://localhost:5174,http://localhost:5173,http://localhost:3000`
6. `DEBUG` = `false`

---

**Toutes les variables nécessaires! 🚀**

