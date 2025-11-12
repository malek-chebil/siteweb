# 🔐 Configurer les Variables d'Environnement pour le Déploiement

## 📋 Vue d'Ensemble

Ce guide vous explique comment utiliser votre fichier `.env` local pour configurer les variables d'environnement sur **Vercel** (frontend) et **Render** (backend).

---

## 📁 Structure des Fichiers .env

### Backend (`backend/.env`)

Votre fichier `backend/.env` devrait contenir quelque chose comme :

```env
# Database
DATABASE_URL=postgresql+asyncpg://postgres:VOTRE_MOT_DE_PASSE@db.xxx.supabase.co:5432/postgres

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=votre-jwt-secret-ici

# CORS
CORS_ORIGINS=http://localhost:5174,http://localhost:5173

# App
DEBUG=True
```

### Frontend (`frontend/.env`)

Votre fichier `frontend/.env` devrait contenir quelque chose comme :

```env
# API
VITE_API_URL=http://localhost:8000/api/v1

# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎨 Frontend - Vercel

### Étape 1: Ouvrir Vercel Dashboard

1. **Allez sur**: https://vercel.com
2. **Connectez-vous** avec GitHub
3. **Sélectionnez votre projet** (ex: `siteweb`)
4. **Cliquez sur "Settings"** → **"Environment Variables"**

### Étape 2: Ajouter les Variables depuis votre .env

**Copiez les valeurs de votre fichier `frontend/.env` et ajoutez-les dans Vercel :**

#### 1. VITE_API_URL

- **Dans votre `.env` local** : `VITE_API_URL=http://localhost:8000/api/v1`
- **Dans Vercel** : 
  - **Key**: `VITE_API_URL`
  - **Value**: `https://votre-backend.onrender.com/api/v1`
    - ⚠️ **Remplacez `http://localhost:8000` par l'URL de votre backend Render**
    - Exemple: `https://carthage-wellness-backend.onrender.com/api/v1`
  - **Environments**: ✅ Production, ✅ Preview, ✅ Development
  - **Cliquez sur "Add"**

#### 2. VITE_SUPABASE_URL

- **Dans votre `.env` local** : `VITE_SUPABASE_URL=https://xxx.supabase.co`
- **Dans Vercel** :
  - **Key**: `VITE_SUPABASE_URL`
  - **Value**: **Copiez exactement la même valeur** de votre `.env` local
  - **Environments**: ✅ Production, ✅ Preview, ✅ Development
  - **Cliquez sur "Add"**

#### 3. VITE_SUPABASE_ANON_KEY

- **Dans votre `.env` local** : `VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Dans Vercel** :
  - **Key**: `VITE_SUPABASE_ANON_KEY`
  - **Value**: **Copiez exactement la même valeur** de votre `.env` local
  - **Environments**: ✅ Production, ✅ Preview, ✅ Development
  - **Cliquez sur "Add"**

### Étape 3: Redéployer

1. **Allez dans "Deployments"**
2. **Cliquez sur les trois points** (⋯) à côté du dernier déploiement
3. **Cliquez sur "Redeploy"**

---

## 🚀 Backend - Render

### Étape 1: Ouvrir Render Dashboard

1. **Allez sur**: https://render.com
2. **Connectez-vous** avec GitHub
3. **Sélectionnez votre service** (ex: `carthage-wellness-backend`)
4. **Cliquez sur "Environment"** (dans le menu de gauche)

### Étape 2: Ajouter les Variables depuis votre .env

**Copiez les valeurs de votre fichier `backend/.env` et ajoutez-les dans Render :**

#### 1. DATABASE_URL

- **Dans votre `.env` local** : `DATABASE_URL=postgresql+asyncpg://postgres:password@db.xxx.supabase.co:5432/postgres`
- **Dans Render** :
  - **Key**: `DATABASE_URL`
  - **Value**: **Copiez exactement la même valeur** de votre `.env` local
  - **Cliquez sur "Save Changes"**

#### 2. SUPABASE_URL

- **Dans votre `.env` local** : `SUPABASE_URL=https://xxx.supabase.co`
- **Dans Render** :
  - **Key**: `SUPABASE_URL`
  - **Value**: **Copiez exactement la même valeur** de votre `.env` local
  - **Cliquez sur "Save Changes"**

#### 3. SUPABASE_ANON_KEY

- **Dans votre `.env` local** : `SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Dans Render** :
  - **Key**: `SUPABASE_ANON_KEY`
  - **Value**: **Copiez exactement la même valeur** de votre `.env` local
  - **Cliquez sur "Save Changes"**

#### 4. SUPABASE_JWT_SECRET

- **Dans votre `.env` local** : `SUPABASE_JWT_SECRET=votre-jwt-secret-ici`
- **Dans Render** :
  - **Key**: `SUPABASE_JWT_SECRET`
  - **Value**: **Copiez exactement la même valeur** de votre `.env` local
  - **Cliquez sur "Save Changes"**

#### 5. CORS_ORIGINS

- **Dans votre `.env` local** : `CORS_ORIGINS=http://localhost:5174,http://localhost:5173`
- **Dans Render** :
  - **Key**: `CORS_ORIGINS`
  - **Value**: `https://votre-app.vercel.app,http://localhost:5174`
    - ⚠️ **Remplacez `http://localhost:5174` par l'URL de votre frontend Vercel**
    - ⚠️ **Ajoutez aussi `http://localhost:5174` pour le développement local**
    - Exemple: `https://siteweb.vercel.app,http://localhost:5174`
  - **Cliquez sur "Save Changes"**

#### 6. DEBUG

- **Dans votre `.env` local** : `DEBUG=True`
- **Dans Render** :
  - **Key**: `DEBUG`
  - **Value**: `false` ⚠️ **Utilisez `false` en production (pas `True`)**
  - **Cliquez sur "Save Changes"**

### Étape 3: Le Service Redéploie Automatiquement

1. **Après avoir ajouté chaque variable**, Render redéploie automatiquement
2. **Attendez que le déploiement soit terminé** (vous verrez "Live" en vert)
3. **Vérifiez les logs** pour vous assurer qu'il n'y a pas d'erreurs

---

## 📝 Tableau de Correspondance

### Frontend (Vercel)

| Variable dans .env local | Variable dans Vercel | Valeur dans Vercel |
|--------------------------|---------------------|-------------------|
| `VITE_API_URL=http://localhost:8000/api/v1` | `VITE_API_URL` | `https://votre-backend.onrender.com/api/v1` |
| `VITE_SUPABASE_URL=https://xxx.supabase.co` | `VITE_SUPABASE_URL` | `https://xxx.supabase.co` (identique) |
| `VITE_SUPABASE_ANON_KEY=...` | `VITE_SUPABASE_ANON_KEY` | `...` (identique) |

### Backend (Render)

| Variable dans .env local | Variable dans Render | Valeur dans Render |
|--------------------------|---------------------|-------------------|
| `DATABASE_URL=postgresql+asyncpg://...` | `DATABASE_URL` | `postgresql+asyncpg://...` (identique) |
| `SUPABASE_URL=https://xxx.supabase.co` | `SUPABASE_URL` | `https://xxx.supabase.co` (identique) |
| `SUPABASE_ANON_KEY=...` | `SUPABASE_ANON_KEY` | `...` (identique) |
| `SUPABASE_JWT_SECRET=...` | `SUPABASE_JWT_SECRET` | `...` (identique) |
| `CORS_ORIGINS=http://localhost:5174,...` | `CORS_ORIGINS` | `https://votre-app.vercel.app,http://localhost:5174` |
| `DEBUG=True` | `DEBUG` | `false` (production) |

---

## 🔄 Ordre Recommandé

### 1. Déployer le Backend d'abord

1. **Configurez les variables sur Render** (copiez depuis `backend/.env`)
2. **Modifiez `CORS_ORIGINS`** : Ajoutez `http://localhost:5174` temporairement
3. **Modifiez `DEBUG`** : Utilisez `false` en production
4. **Attendez que le backend soit déployé**
5. **Notez l'URL du backend** (ex: `https://carthage-wellness-backend.onrender.com`)

### 2. Déployer le Frontend ensuite

1. **Configurez les variables sur Vercel** (copiez depuis `frontend/.env`)
2. **Modifiez `VITE_API_URL`** : Remplacez `http://localhost:8000` par l'URL de votre backend Render
3. **Déployez le frontend**
4. **Notez l'URL du frontend** (ex: `https://siteweb.vercel.app`)

### 3. Mettre à jour CORS_ORIGINS

1. **Dans Render**, mettez à jour `CORS_ORIGINS` :
   - `CORS_ORIGINS` = `https://siteweb.vercel.app,http://localhost:5174`
2. **Le backend redéploiera automatiquement**

---

## ✅ Checklist

### Frontend (Vercel)

- [ ] `VITE_API_URL` ajouté (avec l'URL du backend Render)
- [ ] `VITE_SUPABASE_URL` ajouté (identique au .env local)
- [ ] `VITE_SUPABASE_ANON_KEY` ajouté (identique au .env local)
- [ ] Variables configurées pour Production, Preview, Development
- [ ] Frontend redéployé

### Backend (Render)

- [ ] `DATABASE_URL` ajouté (identique au .env local)
- [ ] `SUPABASE_URL` ajouté (identique au .env local)
- [ ] `SUPABASE_ANON_KEY` ajouté (identique au .env local)
- [ ] `SUPABASE_JWT_SECRET` ajouté (identique au .env local)
- [ ] `CORS_ORIGINS` ajouté (avec l'URL du frontend Vercel)
- [ ] `DEBUG` ajouté (avec la valeur `false`)
- [ ] Backend déployé et fonctionnel

---

## 🆘 Problèmes Courants

### Erreur: "Variable not found"

**Solution**: Vérifiez que vous avez bien ajouté la variable dans Vercel/Render et redéployé.

### Erreur: "CORS policy"

**Solution**: Vérifiez que `CORS_ORIGINS` dans Render inclut l'URL de votre frontend Vercel.

### Erreur: "Database connection failed"

**Solution**: Vérifiez que `DATABASE_URL` est correct et que le format est `postgresql+asyncpg://...`.

### Erreur: "JWT verification failed"

**Solution**: Vérifiez que `SUPABASE_JWT_SECRET` est correct dans Render.

---

## 🔒 Sécurité

⚠️ **Important**: 

- ✅ Ne partagez JAMAIS votre fichier `.env` publiquement
- ✅ Ne commitez JAMAIS votre fichier `.env` dans Git (déjà dans `.gitignore`)
- ✅ Utilisez des mots de passe forts pour votre base de données
- ✅ Régénérez vos secrets Supabase si vous pensez qu'ils ont été compromis

---

## 📚 Ressources

- **Vercel Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables
- **Render Environment Variables**: https://render.com/docs/environment-variables
- **Supabase Settings**: https://supabase.com/dashboard/project/_/settings/api

---

**Bon déploiement ! 🚀**

