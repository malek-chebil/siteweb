# 🔐 Comment Ajouter les Variables d'Environnement

## 📋 Variables Nécessaires

### Frontend (Vercel)
- `VITE_API_URL` - URL de l'API backend
- `VITE_SUPABASE_URL` - URL du projet Supabase
- `VITE_SUPABASE_ANON_KEY` - Clé anonyme Supabase

### Backend (Render)
- `DATABASE_URL` - URL de connexion PostgreSQL
- `SUPABASE_URL` - URL du projet Supabase
- `SUPABASE_ANON_KEY` - Clé anonyme Supabase
- `SUPABASE_JWT_SECRET` - Secret JWT Supabase
- `CORS_ORIGINS` - Origines CORS autorisées
- `DEBUG` - Mode debug (false en production)

---

## 🎨 Frontend - Vercel

### Étape 1: Ouvrir les Paramètres du Projet

1. **Allez sur**: https://vercel.com
2. **Connectez-vous** avec votre compte GitHub
3. **Sélectionnez votre projet** (ex: `siteweb`)
4. **Cliquez sur "Settings"** (en haut de la page)

### Étape 2: Ajouter les Variables d'Environnement

1. **Cliquez sur "Environment Variables"** (dans le menu de gauche)
2. **Vous verrez une section "Environment Variables"**

### Étape 3: Ajouter chaque Variable

#### Variable 1: VITE_API_URL

1. **Dans "Key"**, tapez: `VITE_API_URL`
2. **Dans "Value"**, tapez: `https://votre-backend.onrender.com/api/v1`
   - ⚠️ **Remplacez `votre-backend.onrender.com`** par l'URL de votre backend Render
   - Exemple: `https://carthage-wellness-backend.onrender.com/api/v1`
3. **Cochez les environnements**: 
   - ✅ Production
   - ✅ Preview
   - ✅ Development (optionnel)
4. **Cliquez sur "Add"**

#### Variable 2: VITE_SUPABASE_URL

1. **Dans "Key"**, tapez: `VITE_SUPABASE_URL`
2. **Dans "Value"**, tapez: `https://votre-projet.supabase.co`
   - ⚠️ **Remplacez `votre-projet.supabase.co`** par l'URL de votre projet Supabase
   - Exemple: `https://abcdefghijklmnop.supabase.co`
3. **Cochez les environnements**: Production, Preview, Development
4. **Cliquez sur "Add"**

#### Variable 3: VITE_SUPABASE_ANON_KEY

1. **Dans "Key"**, tapez: `VITE_SUPABASE_ANON_KEY`
2. **Dans "Value"**, tapez: votre clé anonyme Supabase
   - ⚠️ **Copiez la clé depuis Supabase** (voir section "Comment récupérer les variables")
   - Exemple: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. **Cochez les environnements**: Production, Preview, Development
4. **Cliquez sur "Add"**

### Étape 4: Redéployer

1. **Après avoir ajouté toutes les variables**, allez dans "Deployments"
2. **Cliquez sur les trois points** (⋯) à côté du dernier déploiement
3. **Cliquez sur "Redeploy"**
4. **Ou attendez le prochain déploiement automatique** (si vous avez configuré GitHub)

---

## 🚀 Backend - Render

### Étape 1: Ouvrir les Paramètres du Service

1. **Allez sur**: https://render.com
2. **Connectez-vous** avec votre compte GitHub
3. **Sélectionnez votre service** (ex: `carthage-wellness-backend`)
4. **Cliquez sur "Environment"** (dans le menu de gauche)

### Étape 2: Ajouter les Variables d'Environnement

1. **Vous verrez une section "Environment Variables"**
2. **Il y a un tableau avec "Key" et "Value"**

### Étape 3: Ajouter chaque Variable

#### Variable 1: DATABASE_URL

1. **Dans "Key"**, tapez: `DATABASE_URL`
2. **Dans "Value"**, tapez: votre URL de base de données
   - ⚠️ **Format**: `postgresql+asyncpg://postgres:VOTRE_MOT_DE_PASSE@db.xxx.supabase.co:5432/postgres`
   - ⚠️ **Remplacez `VOTRE_MOT_DE_PASSE`** par votre mot de passe Supabase
   - ⚠️ **Remplacez `xxx`** par votre référence de projet Supabase
3. **Cliquez sur "Save Changes"**

#### Variable 2: SUPABASE_URL

1. **Dans "Key"**, tapez: `SUPABASE_URL`
2. **Dans "Value"**, tapez: `https://votre-projet.supabase.co`
   - ⚠️ **Remplacez `votre-projet.supabase.co`** par l'URL de votre projet Supabase
3. **Cliquez sur "Save Changes"**

#### Variable 3: SUPABASE_ANON_KEY

1. **Dans "Key"**, tapez: `SUPABASE_ANON_KEY`
2. **Dans "Value"**, tapez: votre clé anonyme Supabase
   - ⚠️ **Copiez la clé depuis Supabase**
3. **Cliquez sur "Save Changes"**

#### Variable 4: SUPABASE_JWT_SECRET

1. **Dans "Key"**, tapez: `SUPABASE_JWT_SECRET`
2. **Dans "Value"**, tapez: votre secret JWT Supabase
   - ⚠️ **Copiez le secret depuis Supabase** (voir section "Comment récupérer les variables")
3. **Cliquez sur "Save Changes"**

#### Variable 5: CORS_ORIGINS

1. **Dans "Key"**, tapez: `CORS_ORIGINS`
2. **Dans "Value"**, tapez: `https://votre-app.vercel.app,http://localhost:5174`
   - ⚠️ **Remplacez `votre-app.vercel.app`** par l'URL de votre frontend Vercel
   - Exemple: `https://siteweb.vercel.app,http://localhost:5174`
3. **Cliquez sur "Save Changes"**

#### Variable 6: DEBUG

1. **Dans "Key"**, tapez: `DEBUG`
2. **Dans "Value"**, tapez: `false`
   - ⚠️ **Pour la production, utilisez `false`**
3. **Cliquez sur "Save Changes"**

### Étape 4: Le Service Redéploie Automatiquement

1. **Après avoir ajouté chaque variable**, Render redéploie automatiquement le service
2. **Attendez que le déploiement soit terminé** (vous verrez "Live" en vert)
3. **Vérifiez les logs** pour vous assurer qu'il n'y a pas d'erreurs

---

## 🔑 Comment Récupérer les Variables depuis Supabase

### 1. SUPABASE_URL et SUPABASE_ANON_KEY

1. **Allez sur**: https://supabase.com
2. **Connectez-vous** et sélectionnez votre projet
3. **Cliquez sur "Settings"** (icône d'engrenage en bas à gauche)
4. **Cliquez sur "API"** (dans le menu Settings)
5. **Vous verrez**:
   - **Project URL**: C'est votre `SUPABASE_URL`
     - Exemple: `https://abcdefghijklmnop.supabase.co`
   - **anon/public key**: C'est votre `SUPABASE_ANON_KEY`
     - Exemple: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
6. **Copiez ces valeurs** et utilisez-les dans Vercel et Render

### 2. SUPABASE_JWT_SECRET

1. **Dans la même page "API"** (Settings > API)
2. **Faites défiler jusqu'à la section "JWT Settings"**
3. **Vous verrez "JWT Secret"**
4. **Cliquez sur "Reveal"** (pour révéler le secret)
5. **Copiez le secret**: C'est votre `SUPABASE_JWT_SECRET`
6. **⚠️ Ne partagez JAMAIS ce secret!**

### 3. DATABASE_URL

1. **Dans Supabase**, allez sur **Settings** > **Database**
2. **Dans la section "Connection string"**
3. **Sélectionnez "URI"** (pas "Session mode" ou "Transaction mode")
4. **Vous verrez une URL comme**:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
5. **Remplacez `[YOUR-PASSWORD]`** par votre mot de passe de base de données
   - Si vous ne le connaissez pas, allez dans **Settings** > **Database** > **Database password**
   - Cliquez sur "Reset database password" si nécessaire
6. **Remplacez `postgresql://` par `postgresql+asyncpg://`** (pour asyncpg)
7. **Format final**:
   ```
   postgresql+asyncpg://postgres:VOTRE_MOT_DE_PASSE@db.xxx.supabase.co:5432/postgres
   ```
8. **Copiez cette URL** et utilisez-la dans Render comme `DATABASE_URL`

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

## 🔄 Ordre Recommandé

### 1. Déployer le Backend d'abord

1. **Configurez les variables sur Render**:
   - `DATABASE_URL`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_JWT_SECRET`
   - `CORS_ORIGINS` = `http://localhost:5174` (temporairement)
   - `DEBUG` = `false`
2. **Attendez que le backend soit déployé**
3. **Notez l'URL du backend** (ex: `https://carthage-wellness-backend.onrender.com`)

### 2. Déployer le Frontend ensuite

1. **Configurez les variables sur Vercel**:
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

**Solution**: 
- Vérifiez que la variable est bien définie dans Vercel
- Vérifiez que vous avez redéployé après avoir ajouté la variable
- Vérifiez que la variable commence par `VITE_` (nécessaire pour Vite)

### Erreur: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution**: 
- Vérifiez que `CORS_ORIGINS` dans Render inclut l'URL de votre frontend Vercel
- Vérifiez que l'URL est correcte (avec `https://`)
- Vérifiez que les URLs sont séparées par des virgules

### Erreur: "Database connection failed"

**Solution**: 
- Vérifiez que `DATABASE_URL` est correct
- Vérifiez que le format est `postgresql+asyncpg://...` (pas `postgresql://...`)
- Vérifiez que le mot de passe est correct
- Vérifiez que la base de données Supabase est accessible

### Erreur: "JWT verification failed"

**Solution**: 
- Vérifiez que `SUPABASE_JWT_SECRET` est correct dans Render
- Vérifiez que vous avez copié le secret complet (sans espaces)

---

## 🔒 Sécurité

⚠️ **Important**: Ne commitez **JAMAIS** vos variables d'environnement dans Git!

- ✅ Les variables d'environnement sont déjà dans `.gitignore`
- ✅ Utilisez toujours les variables d'environnement dans Vercel et Render
- ✅ Ne partagez jamais vos secrets (JWT, mots de passe, etc.)
- ✅ Utilisez des mots de passe forts pour votre base de données

---

## 📚 Ressources

- **Vercel Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables
- **Render Environment Variables**: https://render.com/docs/environment-variables
- **Supabase Settings**: https://supabase.com/dashboard/project/_/settings/api

---

**Bon déploiement ! 🚀**

