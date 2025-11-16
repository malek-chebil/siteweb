# 🔧 Guide Détaillé - Configuration Supabase avec Valeurs

## 📋 Vue d'Ensemble

Ce guide liste **TOUTES** les valeurs de configuration nécessaires pour le nouveau compte Supabase, avec des instructions précises sur où trouver chaque valeur dans l'ancien compte.

---

## 🔑 Section 1 : Clés API et URLs

### 1.1 SUPABASE_URL

**Valeur dans le nouveau compte** :
```
https://[NEW_PROJECT_REF].supabase.co
```

**Où trouver dans l'ancien compte** :
1. Aller dans **Settings → API**
2. Copier la valeur de **"Project URL"**
3. Format : `https://[OLD_PROJECT_REF].supabase.co`

**Exemple** :
- Ancien : `https://cvtrghsdfkrwgasvnflb.supabase.co`
- Nouveau : `https://[nouveau_ref].supabase.co`

**Où utiliser** :
- ✅ Backend `.env` : `SUPABASE_URL`
- ✅ Frontend `.env` : `VITE_SUPABASE_URL`
- ✅ `docker-compose.yml` : Variable d'environnement

---

### 1.2 SUPABASE_ANON_KEY

**Valeur dans le nouveau compte** :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IltyZWZdIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Mjc3NDQsImV4cCI6MjA3ODIwMzc0NH0.[hash]
```

**Où trouver dans l'ancien compte** :
1. Aller dans **Settings → API**
2. Section **"Project API keys"**
3. Copier la valeur de **"anon public"** (clé publique)
4. Format : `eyJhbGc...` (longue chaîne JWT)

**⚠️ IMPORTANT** :
- C'est la clé **publique** (safe à exposer dans le frontend)
- Ne jamais utiliser la `service_role` key dans le frontend

**Où utiliser** :
- ✅ Backend `.env` : `SUPABASE_ANON_KEY`
- ✅ Frontend `.env` : `VITE_SUPABASE_ANON_KEY`
- ✅ `docker-compose.yml` : Variable d'environnement

---

### 1.3 SUPABASE_JWT_SECRET

**Valeur dans le nouveau compte** :
```
[long-secret-string-generated-by-supabase]
```

**Où trouver dans l'ancien compte** :
1. Aller dans **Settings → API**
2. Section **"JWT Settings"**
3. Cliquer sur **"Reveal"** à côté de **"JWT Secret"**
4. Copier la valeur complète

**⚠️ IMPORTANT** :
- Cette clé est **secrète** (ne jamais exposer)
- Utilisée uniquement dans le backend
- Nécessaire pour vérifier les tokens JWT

**Où utiliser** :
- ✅ Backend `.env` : `SUPABASE_JWT_SECRET`
- ❌ **NE PAS** mettre dans le frontend

---

### 1.4 SUPABASE_SERVICE_ROLE_KEY (Optionnel)

**Valeur dans le nouveau compte** :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IltyZWZdIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjYyNzc0NCwiZXhwIjoyMDc4MjAzNzQ0fQ.[hash]
```

**Où trouver dans l'ancien compte** :
1. Aller dans **Settings → API**
2. Section **"Project API keys"**
3. Copier la valeur de **"service_role"** (clé secrète)
4. ⚠️ Cliquer sur **"Reveal"** si nécessaire

**⚠️ TRÈS IMPORTANT** :
- Cette clé a **tous les droits** (bypass RLS)
- **JAMAIS** dans le frontend
- Utilisée uniquement pour les scripts d'admin/migration

**Où utiliser** :
- ✅ Scripts Python de migration
- ✅ Scripts d'export/import Storage
- ❌ **NE JAMAIS** mettre dans le frontend ou backend public

---

## 🗄️ Section 2 : Configuration Base de Données

### 2.1 DATABASE_URL

**Valeur dans le nouveau compte** :
```
postgresql+asyncpg://postgres:[NEW_PASSWORD]@db.[NEW_PROJECT_REF].supabase.co:5432/postgres
```

**Où trouver dans l'ancien compte** :
1. Aller dans **Settings → Database**
2. Section **"Connection string"**
3. Choisir **"URI"** (pas "Session mode")
4. Format : `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres`

**⚠️ IMPORTANT** :
- Pour FastAPI/async, utiliser `postgresql+asyncpg://` au lieu de `postgresql://`
- Le mot de passe est celui que vous avez créé lors de la création du projet
- Si vous avez oublié le mot de passe, vous pouvez le réinitialiser dans **Settings → Database → Reset database password**

**Exemple** :
```
# Ancien
postgresql+asyncpg://postgres:old_password@db.cvtrghsdfkrwgasvnflb.supabase.co:5432/postgres

# Nouveau
postgresql+asyncpg://postgres:new_password@db.[new_ref].supabase.co:5432/postgres
```

**Où utiliser** :
- ✅ Backend `.env` : `DATABASE_URL`
- ✅ `docker-compose.yml` : Variable d'environnement

---

### 2.2 Database Password

**Valeur dans le nouveau compte** :
```
[Le mot de passe que vous avez créé lors de la création du projet]
```

**Où trouver dans l'ancien compte** :
1. **Vous ne pouvez PAS voir l'ancien mot de passe** (il est hashé)
2. Si vous l'avez oublié :
   - Aller dans **Settings → Database**
   - Cliquer sur **"Reset database password"**
   - Créer un nouveau mot de passe
   - ⚠️ Cela va casser la connexion actuelle, donc faites-le seulement si nécessaire

**⚠️ IMPORTANT** :
- Sauvegardez le mot de passe dans un gestionnaire de mots de passe
- Vous en aurez besoin pour les scripts de migration

**Où utiliser** :
- ✅ Dans `DATABASE_URL` (voir section 2.1)
- ✅ Scripts `pg_dump` / `pg_restore`
- ✅ Connexion directe à la base de données

---

## 🔐 Section 3 : Configuration Authentication

### 3.1 Site URL

**Valeur dans le nouveau compte** :
```
http://cartagespa.com
```
OU (si HTTPS est déjà configuré) :
```
https://cartagespa.com
```

**Où trouver dans l'ancien compte** :
1. Aller dans **Authentication → Settings**
2. Section **"URL Configuration"**
3. Copier la valeur de **"Site URL"**

**Où configurer dans le nouveau compte** :
1. Aller dans **Authentication → Settings**
2. Section **"URL Configuration"**
3. Entrer : `http://cartagespa.com` (ou `https://` si HTTPS est configuré)
4. Cliquer sur **"Save"**

---

### 3.2 Redirect URLs

**Valeurs dans le nouveau compte** :
```
http://cartagespa.com/auth/callback
http://cartagespa.com/**
http://www.cartagespa.com/auth/callback
http://www.cartagespa.com/**
http://localhost:5173/auth/callback
http://localhost:5174/auth/callback
```

**Où trouver dans l'ancien compte** :
1. Aller dans **Authentication → Settings**
2. Section **"URL Configuration"**
3. Section **"Redirect URLs"**
4. Copier **TOUTES** les URLs listées

**Où configurer dans le nouveau compte** :
1. Aller dans **Authentication → Settings**
2. Section **"URL Configuration"**
3. Section **"Redirect URLs"**
4. Cliquer sur **"Add URL"**
5. Ajouter chaque URL une par une :
   - `http://cartagespa.com/auth/callback`
   - `http://cartagespa.com/**`
   - `http://www.cartagespa.com/auth/callback`
   - `http://www.cartagespa.com/**`
   - `http://localhost:5173/auth/callback`
   - `http://localhost:5174/auth/callback`
6. Cliquer sur **"Save"**

**⚠️ IMPORTANT** :
- Le `/**` permet tous les chemins sous ce domaine
- Ajouter les URLs HTTP ET HTTPS si vous utilisez les deux
- Après configuration HTTPS, ajouter aussi les URLs `https://`

---

### 3.3 Email Templates - Confirm Signup

**Valeur dans le nouveau compte** :
```
From Name: [Votre nom/pseudonyme]
Subject: [Sujet personnalisé]
Body: [Corps de l'email HTML]
```

**Où trouver dans l'ancien compte** :
1. Aller dans **Authentication → Email Templates**
2. Cliquer sur **"Confirm signup"**
3. Copier :
   - **From Name** : (ex: "CartageSpa", "Marketplace", etc.)
   - **Subject** : (ex: "Confirmez votre inscription")
   - **Body** : (le contenu HTML complet)

**Où configurer dans le nouveau compte** :
1. Aller dans **Authentication → Email Templates**
2. Cliquer sur **"Confirm signup"**
3. Copier les valeurs de l'ancien compte :
   - **From Name** : Copier depuis l'ancien compte
   - **Subject** : Copier depuis l'ancien compte
   - **Body** : Copier le HTML complet depuis l'ancien compte
4. Cliquer sur **"Save"**

**Exemple de Body** :
```html
<h2>Confirmez votre inscription</h2>
<p>Bonjour,</p>
<p>Cliquez sur le lien ci-dessous pour confirmer votre email :</p>
<p><a href="{{ .ConfirmationURL }}">Confirmer mon email</a></p>
<p>Ou copiez ce lien : {{ .ConfirmationURL }}</p>
<p>Ce lien expire dans 24 heures.</p>
```

**Variables disponibles** :
- `{{ .Email }}` : Email de l'utilisateur
- `{{ .TokenHash }}` : Hash du token
- `{{ .SiteURL }}` : URL du site
- `{{ .ConfirmationURL }}` : URL complète de confirmation

---

### 3.4 Email Provider Settings

**Valeur dans le nouveau compte** :
```
Enable email provider: ✅ Activé
Confirm email: ✅ Activé (ou désactivé selon votre choix)
Secure email change: ✅ Activé (recommandé)
```

**Où trouver dans l'ancien compte** :
1. Aller dans **Authentication → Providers**
2. Section **"Email"**
3. Noter les paramètres :
   - **Enable email provider** : Activé/Désactivé
   - **Confirm email** : Activé/Désactivé
   - **Secure email change** : Activé/Désactivé

**Où configurer dans le nouveau compte** :
1. Aller dans **Authentication → Providers**
2. Section **"Email"**
3. Activer **"Enable email provider"**
4. Configurer les mêmes paramètres que l'ancien compte
5. Cliquer sur **"Save"**

---

### 3.5 Google OAuth Provider (Si utilisé)

**Valeurs dans le nouveau compte** :
```
Enable sign in with Google: ✅ Activé
Client ID: [Google Client ID]
Client Secret: [Google Client Secret]
```

**Où trouver dans l'ancien compte** :
1. Aller dans **Authentication → Providers**
2. Section **"Google"**
3. Copier :
   - **Client ID** : (ex: `123456789-abc.apps.googleusercontent.com`)
   - **Client Secret** : (ex: `GOCSPX-abc123...`)

**⚠️ IMPORTANT** :
- Ces valeurs viennent de **Google Cloud Console**, pas de Supabase
- Si vous avez oublié les valeurs, vous devrez les recréer dans Google Cloud Console

**Où configurer dans le nouveau compte** :
1. Aller dans **Authentication → Providers**
2. Section **"Google"**
3. Activer **"Enable sign in with Google"**
4. Entrer le **Client ID** (copier depuis l'ancien compte)
5. Entrer le **Client Secret** (copier depuis l'ancien compte)
6. Cliquer sur **"Save"**

**Si vous devez recréer les credentials Google** :
1. Aller dans [Google Cloud Console](https://console.cloud.google.com)
2. Créer un nouveau projet ou utiliser un existant
3. Aller dans **APIs & Services → Credentials**
4. Créer **OAuth 2.0 Client ID**
5. **Authorized redirect URIs** : Ajouter `https://[NEW_PROJECT_REF].supabase.co/auth/v1/callback`
6. Copier le **Client ID** et **Client Secret**

---

## 📦 Section 4 : Configuration Storage

### 4.1 Bucket `listing-images`

**Valeurs dans le nouveau compte** :
```
Name: listing-images
Public: ✅ Oui (ou Non selon votre configuration)
File size limit: [Limite en MB]
Allowed MIME types: [Types autorisés]
```

**Où trouver dans l'ancien compte** :
1. Aller dans **Storage → Buckets**
2. Cliquer sur le bucket **"listing-images"**
3. Noter :
   - **Public** : Oui/Non
   - **File size limit** : (ex: 5 MB, 10 MB, etc.)
   - **Allowed MIME types** : (ex: `image/jpeg,image/png,image/webp`)

**Où configurer dans le nouveau compte** :
1. Aller dans **Storage → Buckets**
2. Cliquer sur **"New bucket"**
3. **Name** : `listing-images`
4. **Public** : ✅ Cocher si l'ancien était public
5. **File size limit** : Entrer la même valeur que l'ancien
6. **Allowed MIME types** : Entrer les mêmes types que l'ancien
7. Cliquer sur **"Create bucket"**

**Exemple de configuration** :
```
Name: listing-images
Public: ✅ Oui
File size limit: 5 MB
Allowed MIME types: image/jpeg,image/png,image/webp,image/gif
```

---

### 4.2 Storage RLS Policies

**Valeurs dans le nouveau compte** :
```
[Policies SQL à recréer]
```

**Où trouver dans l'ancien compte** :
1. Aller dans **Storage → Policies**
2. Pour chaque policy, cliquer dessus
3. Copier la définition SQL complète

**Exemple de policies communes** :

**Policy 1 : Allow public read access**
```sql
CREATE POLICY "Public Access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'listing-images');
```

**Policy 2 : Allow authenticated users to upload**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'listing-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 3 : Allow users to delete their own files**
```sql
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'listing-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Où configurer dans le nouveau compte** :
1. Aller dans **Storage → Policies**
2. Cliquer sur **"New Policy"**
3. Pour chaque policy de l'ancien compte :
   - Copier le SQL complet
   - Coller dans l'éditeur
   - Cliquer sur **"Save"**

---

## 🗃️ Section 5 : Configuration Database RLS Policies

### 5.1 RLS Policies pour Table `users`

**Où trouver dans l'ancien compte** :
1. Aller dans **Database → Tables → users**
2. Onglet **"Policies"**
3. Pour chaque policy, cliquer dessus et copier le SQL

**Exemple de policies communes** :

**Policy : Users can view their own profile**
```sql
CREATE POLICY "Users can view own profile"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);
```

**Où configurer dans le nouveau compte** :
1. Aller dans **Database → Tables → users**
2. Onglet **"Policies"**
3. Cliquer sur **"New Policy"**
4. Copier le SQL de l'ancien compte
5. Cliquer sur **"Save"**

---

### 5.2 RLS Policies pour Table `listings`

**Où trouver dans l'ancien compte** :
1. Aller dans **Database → Tables → listings**
2. Onglet **"Policies"**
3. Copier toutes les policies

**Exemple de policies communes** :

**Policy 1 : Public can view approved listings**
```sql
CREATE POLICY "Public can view approved listings"
ON listings
FOR SELECT
TO public
USING (status = 'approved');
```

**Policy 2 : Users can create their own listings**
```sql
CREATE POLICY "Users can create own listings"
ON listings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
```

**Policy 3 : Users can update their own listings**
```sql
CREATE POLICY "Users can update own listings"
ON listings
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

**Où configurer dans le nouveau compte** :
1. Aller dans **Database → Tables → listings**
2. Onglet **"Policies"**
3. Recréer chaque policy une par une

---

### 5.3 RLS Policies pour Autres Tables

**Tables à vérifier** :
- ✅ `listing_media`
- ✅ `favorites`
- ✅ `moderation_logs`
- ✅ Toutes les autres tables

**Où trouver dans l'ancien compte** :
1. Pour chaque table, aller dans **Database → Tables → [table_name]**
2. Onglet **"Policies"**
3. Copier toutes les policies

**Où configurer dans le nouveau compte** :
1. Recréer chaque policy dans le nouveau compte
2. Vérifier que toutes les policies sont présentes

---

## 📝 Section 6 : Variables d'Environnement - Checklist

### 6.1 Backend `.env`

**Fichier** : `/root/site Web/.env`

**Variables à mettre à jour** :
```env
# Database
DATABASE_URL=postgresql+asyncpg://postgres:[NEW_PASSWORD]@db.[NEW_PROJECT_REF].supabase.co:5432/postgres

# Supabase
SUPABASE_URL=https://[NEW_PROJECT_REF].supabase.co
SUPABASE_ANON_KEY=[NEW_ANON_KEY]
SUPABASE_JWT_SECRET=[NEW_JWT_SECRET]

# CORS (garder les mêmes valeurs)
CORS_ORIGINS=http://cartagespa.com,http://www.cartagespa.com,http://localhost:5173,http://localhost:5174

# Frontend Build Variables
VITE_API_URL=http://cartagespa.com/api/v1
VITE_SUPABASE_URL=https://[NEW_PROJECT_REF].supabase.co
VITE_SUPABASE_ANON_KEY=[NEW_ANON_KEY]

# Debug
DEBUG=false
```

**Où trouver chaque valeur** :
- `DATABASE_URL` : Section 2.1
- `SUPABASE_URL` : Section 1.1
- `SUPABASE_ANON_KEY` : Section 1.2
- `SUPABASE_JWT_SECRET` : Section 1.3
- `VITE_SUPABASE_URL` : Section 1.1
- `VITE_SUPABASE_ANON_KEY` : Section 1.2

---

### 6.2 Frontend `.env` (Local)

**Fichier** : `frontend/.env`

**Variables à mettre à jour** :
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_SUPABASE_URL=https://[NEW_PROJECT_REF].supabase.co
VITE_SUPABASE_ANON_KEY=[NEW_ANON_KEY]
```

**Où trouver chaque valeur** :
- `VITE_SUPABASE_URL` : Section 1.1
- `VITE_SUPABASE_ANON_KEY` : Section 1.2

---

### 6.3 `docker-compose.yml`

**Fichier** : `/root/site Web/docker-compose.yml`

**Variables à vérifier** :
```yaml
environment:
  - DATABASE_URL=${DATABASE_URL}
  - SUPABASE_URL=${SUPABASE_URL}
  - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
  - SUPABASE_JWT_SECRET=${SUPABASE_JWT_SECRET}
  - CORS_ORIGINS=${CORS_ORIGINS}

args:
  - VITE_API_URL=${VITE_API_URL:-http://cartagespa.com/api/v1}
  - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
  - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
```

**⚠️ IMPORTANT** :
- Ces variables lisent depuis `.env`
- Assurez-vous que `.env` est à jour
- Pas besoin de modifier `docker-compose.yml` si les noms de variables sont identiques

---

## ✅ Checklist Complète de Migration

### Clés API
- [ ] `SUPABASE_URL` copié depuis Settings → API → Project URL
- [ ] `SUPABASE_ANON_KEY` copié depuis Settings → API → anon public
- [ ] `SUPABASE_JWT_SECRET` copié depuis Settings → API → JWT Secret (Reveal)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` copié depuis Settings → API → service_role (Reveal)

### Base de Données
- [ ] `DATABASE_URL` construit avec nouveau mot de passe et project ref
- [ ] Mot de passe base de données sauvegardé

### Authentication
- [ ] Site URL configuré : `http://cartagespa.com`
- [ ] Redirect URLs ajoutées (toutes les URLs)
- [ ] Email Templates copiés (From Name, Subject, Body)
- [ ] Email Provider activé avec mêmes paramètres
- [ ] Google OAuth configuré (si utilisé)

### Storage
- [ ] Bucket `listing-images` créé avec mêmes paramètres
- [ ] RLS Policies Storage recréées (toutes)

### Database RLS
- [ ] RLS Policies pour `users` recréées
- [ ] RLS Policies pour `listings` recréées
- [ ] RLS Policies pour `listing_media` recréées
- [ ] RLS Policies pour `favorites` recréées
- [ ] RLS Policies pour `moderation_logs` recréées
- [ ] RLS Policies pour toutes les autres tables recréées

### Variables d'Environnement
- [ ] Backend `.env` mis à jour sur le serveur
- [ ] Frontend `.env` mis à jour (local)
- [ ] `docker-compose.yml` vérifié

### Tests
- [ ] Connexion API testée
- [ ] Authentification testée
- [ ] Upload d'images testé
- [ ] Données vérifiées
- [ ] Statistiques vérifiées

---

## 🆘 Dépannage

### Problème : "Invalid API key"

**Solution** :
1. Vérifier que `VITE_SUPABASE_ANON_KEY` est correct dans `.env`
2. Vérifier que c'est la clé **anon** (pas service_role)
3. Rebuild frontend : `docker compose build frontend`
4. Redémarrer : `docker compose up -d`

### Problème : "Redirect URL mismatch"

**Solution** :
1. Vérifier que toutes les Redirect URLs sont ajoutées dans Supabase
2. Vérifier que le Site URL est correct
3. Ajouter `http://` ET `https://` si nécessaire

### Problème : "RLS policy violation"

**Solution** :
1. Vérifier que toutes les RLS policies sont recréées
2. Vérifier que les policies sont identiques à l'ancien compte
3. Vérifier que les rôles sont corrects (public, authenticated, etc.)

---

## 📚 Résumé

**Toutes les valeurs nécessaires** :
1. ✅ Clés API (4 valeurs)
2. ✅ Database URL (1 valeur)
3. ✅ Auth Configuration (Site URL, Redirect URLs, Templates)
4. ✅ Storage Configuration (Bucket, Policies)
5. ✅ Database RLS Policies (pour chaque table)
6. ✅ Variables d'environnement (Backend + Frontend)

**Temps estimé** : 1-2 heures pour configurer le nouveau compte

**Difficulté** : Moyenne (beaucoup de copier-coller)

