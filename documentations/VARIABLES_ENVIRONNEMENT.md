# 🔐 Guide des Variables d'Environnement

## 📋 Vue d'Ensemble

Ce guide explique comment ajouter les variables d'environnement pour le déploiement sur **Vercel** (frontend) et **Render** (backend).

---

## 🎨 Frontend (Vercel)

### Variables Nécessaires

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_API_URL` | URL de l'API backend | `https://carthage-wellness-backend.onrender.com/api/v1` |
| `VITE_SUPABASE_URL` | URL du projet Supabase | `https://abcdefghijklmnop.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Clé anonyme Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### Comment Ajouter les Variables sur Vercel

#### Méthode 1: Via le Dashboard (Recommandé)

1. **Allez sur**: https://vercel.com
2. **Sélectionnez votre projet** (ex: `siteweb`)
3. **Cliquez sur "Settings"** (en haut)
4. **Cliquez sur "Environment Variables"** (dans le menu de gauche)
5. **Ajoutez chaque variable**:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://votre-backend.onrender.com/api/v1`
   - **Environment**: Sélectionnez `Production`, `Preview`, et `Development` (ou seulement `Production`)
   - **Cliquez sur "Add"**
6. **Répétez pour chaque variable**
7. **Redéployez** le projet (ou attendez le prochain déploiement automatique)

#### Méthode 2: Via Vercel CLI

```bash
cd frontend
vercel env add VITE_API_URL
# Entrez la valeur quand demandé
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

---

## 🚀 Backend (Render)

### Variables Nécessaires

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de connexion PostgreSQL | `postgresql+asyncpg://postgres:password@db.xxx.supabase.co:5432/postgres` |
| `SUPABASE_URL` | URL du projet Supabase | `https://abcdefghijklmnop.supabase.co` |
| `SUPABASE_ANON_KEY` | Clé anonyme Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_JWT_SECRET` | Secret JWT Supabase | `your-jwt-secret-here` |
| `CORS_ORIGINS` | Origines CORS autorisées | `https://votre-app.vercel.app,http://localhost:5174` |
| `DEBUG` | Mode debug | `false` (production) |

### Comment Ajouter les Variables sur Render

1. **Allez sur**: https://render.com
2. **Sélectionnez votre service** (ex: `carthage-wellness-backend`)
3. **Cliquez sur "Environment"** (dans le menu de gauche)
4. **Dans la section "Environment Variables"**:
   - **Key**: `DATABASE_URL`
   - **Value**: Collez votre URL de base de données
   - **Cliquez sur "Add"**
5. **Répétez pour chaque variable**
6. **Le service redéploiera automatiquement** après l'ajout des variables

---

## 🔑 Comment Récupérer les Variables depuis Supabase

### 1. SUPABASE_URL et SUPABASE_ANON_KEY

1. **Allez sur**: https://supabase.com
2. **Connectez-vous** et sélectionnez votre projet
3. **Cliquez sur "Settings"** (en bas à gauche)
4. **Cliquez sur "API"** (dans le menu Settings)
5. **Vous verrez**:
   - **Project URL**: C'est votre `SUPABASE_URL`
   - **anon/public key**: C'est votre `SUPABASE_ANON_KEY`

### 2. SUPABASE_JWT_SECRET

1. **Dans la même page "API"** (Settings > API)
2. **Dans la section "JWT Settings"**
3. **Cliquez sur "Reveal"** à côté de "JWT Secret"
4. **Copiez le secret**: C'est votre `SUPABASE_JWT_SECRET`

### 3. DATABASE_URL

1. **Dans Supabase**, allez sur **Settings** > **Database**
2. **Dans la section "Connection string"**
3. **Sélectionnez "URI"** (pas "Session mode" ou "Transaction mode")
4. **Copiez la chaîne de connexion**
5. **Remplacez `postgresql://` par `postgresql+asyncpg://`** (pour asyncpg)
6. **Format attendu**: `postgresql+asyncpg://postgres:VOTRE_MOT_DE_PASSE@db.xxx.supabase.co:5432/postgres`
7. **Remplacez `VOTRE_MOT_DE_PASSE`** par votre mot de passe de base de données
   - Si vous ne le connaissez pas, allez dans **Settings** > **Database** > **Database password**
   - Cliquez sur "Reset database password" si nécessaire

---

## 📝 Exemple de Configuration Complète

### Frontend (Vercel)

```
VITE_API_URL=https://carthage-wellness-backend.onrender.com/api/v1
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzQ1Njc4OSwiZXhwIjoxOTM5MDMyNzg5fQ.xxxxx
```

### Backend (Render)

```
DATABASE_URL=postgresql+asyncpg://postgres:VOTRE_MOT_DE_PASSE@db.abcdefghijklmnop.supabase.co:5432/postgres
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzQ1Njc4OSwiZXhwIjoxOTM5MDMyNzg5fQ.xxxxx
SUPABASE_JWT_SECRET=votre-jwt-secret-ici
CORS_ORIGINS=https://siteweb.vercel.app,http://localhost:5174
DEBUG=false
```

---

## 🔄 Ordre de Configuration Recommandé

### 1. Déployer le Backend d'abord

1. **Configurez les variables d'environnement sur Render**:
   - `DATABASE_URL`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_JWT_SECRET`
   - `CORS_ORIGINS` = `http://localhost:5174` (temporairement)
   - `DEBUG` = `false`
2. **Attendez que le backend soit déployé**
3. **Notez l'URL du backend** (ex: `https://carthage-wellness-backend.onrender.com`)

### 2. Déployer le Frontend ensuite

1. **Configurez les variables d'environnement sur Vercel**:
   - `VITE_API_URL` = `https://carthage-wellness-backend.onrender.com/api/v1`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. **Déployez le frontend**
3. **Notez l'URL du frontend** (ex: `https://siteweb.vercel.app`)

### 3. Mettre à jour CORS_ORIGINS

1. **Dans Render**, mettez à jour `CORS_ORIGINS`:
   - `CORS_ORIGINS` = `https://siteweb.vercel.app,http://localhost:5174`
2. **Le backend redéploiera automatiquement**

---

## ✅ Vérification

### Frontend

1. **Visitez votre site Vercel** (ex: `https://siteweb.vercel.app`)
2. **Ouvrez la console du navigateur** (F12)
3. **Vérifiez qu'il n'y a pas d'erreurs** liées aux variables d'environnement
4. **Testez l'authentification**: Créez un compte ou connectez-vous

### Backend

1. **Visitez votre API Render** (ex: `https://carthage-wellness-backend.onrender.com/health`)
2. **Vous devriez voir**: `{"status":"ok"}`
3. **Testez l'API**: `https://carthage-wellness-backend.onrender.com/api/v1/listings`

---

## 🆘 Problèmes Courants

### Erreur: "VITE_API_URL is not defined"

**Solution**: Vérifiez que la variable est bien définie dans Vercel et que vous avez redéployé.

### Erreur: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution**: Vérifiez que `CORS_ORIGINS` dans Render inclut l'URL de votre frontend Vercel.

### Erreur: "Database connection failed"

**Solution**: 
- Vérifiez que `DATABASE_URL` est correct
- Vérifiez que le format est `postgresql+asyncpg://...` (pas `postgresql://...`)
- Vérifiez que le mot de passe est correct

### Erreur: "JWT verification failed"

**Solution**: Vérifiez que `SUPABASE_JWT_SECRET` est correct dans Render.

---

## 📚 Ressources

- **Vercel Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables
- **Render Environment Variables**: https://render.com/docs/environment-variables
- **Supabase Settings**: https://supabase.com/dashboard/project/_/settings/api

---

## 🔒 Sécurité

⚠️ **Important**: Ne commitez **JAMAIS** vos variables d'environnement dans Git!

- ✅ Les variables d'environnement sont déjà dans `.gitignore`
- ✅ Utilisez toujours les variables d'environnement dans Vercel et Render
- ✅ Ne partagez jamais vos secrets (JWT, mots de passe, etc.)

---

**Bon déploiement ! 🚀**

