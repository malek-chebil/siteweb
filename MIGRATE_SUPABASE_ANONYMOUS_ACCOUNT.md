# 🔒 Guide Complet - Migration vers Compte Supabase Anonyme

## 📋 Vue d'Ensemble

Ce guide vous permet de créer un nouveau compte Supabase anonyme et de migrer toute votre configuration actuelle, étape par étape.

**Temps estimé** : 2-3 heures  
**Difficulté** : Moyenne  
**Risque** : Faible (backup complet avant migration)

---

## 🎯 Objectifs

1. ✅ Créer un compte Supabase anonyme
2. ✅ Exporter toutes les données de l'ancien compte
3. ✅ Importer les données dans le nouveau compte
4. ✅ Migrer toute la configuration (Auth, Storage, RLS, etc.)
5. ✅ Mettre à jour les variables d'environnement
6. ✅ Tester et vérifier
7. ✅ Supprimer l'ancien compte (optionnel)

---

## 📝 Prérequis

### 1. Email Anonyme

**Options recommandées** :
- **ProtonMail** (recommandé) : https://proton.me
  - Gratuit
  - Chiffrement end-to-end
  - Pas de vérification téléphone nécessaire
- **Tutanota** : https://tutanota.com
  - Gratuit
  - Chiffrement
- **Autre service anonyme**

**Créer l'email** :
1. Aller sur ProtonMail (ou autre)
2. Créer un compte avec un pseudonyme
3. **IMPORTANT** : Notez l'email et le mot de passe dans un gestionnaire de mots de passe sécurisé

### 2. VPN (Optionnel mais Recommandé)

**Pourquoi** : Masquer votre IP lors de la création du compte

**Options** :
- **Mullvad VPN** (recommandé pour anonymat)
- **ProtonVPN** (gratuit avec ProtonMail)
- **Autre VPN respectueux de la vie privée**

**Activer le VPN** avant de créer le compte Supabase.

### 3. Accès à l'Ancien Compte

- Email de connexion
- Mot de passe
- Accès au Dashboard Supabase

### 4. Outils Nécessaires

- **pgAdmin** ou **psql** (pour export/import base de données)
- **Navigateur web** (avec VPN activé)
- **Éditeur de texte** (pour variables d'environnement)

---

## 🔐 Étape 1 : Créer le Compte Supabase Anonyme

### 1.1 Préparation

1. **Activer le VPN** (si disponible)
2. **Ouvrir une fenêtre de navigation privée** (Incognito/Private)
3. **Aller sur** : https://supabase.com

### 1.2 Création du Compte

1. **Cliquer sur "Start your project"** ou **"Sign Up"**
2. **Choisir "Sign up with email"**
3. **Utiliser l'email anonyme** (ProtonMail, etc.)
4. **Créer un mot de passe fort** (utiliser un gestionnaire de mots de passe)
5. **Accepter les conditions** (lire si nécessaire)
6. **Vérifier l'email** (aller dans votre boîte ProtonMail)

### 1.3 Créer le Projet

1. **Cliquer sur "New Project"**
2. **Nom du projet** : Utiliser un nom générique (ex: "marketplace", "classifieds")
3. **Mot de passe de la base de données** :
   - Générer un mot de passe fort
   - **IMPORTANT** : Sauvegarder dans un gestionnaire de mots de passe
4. **Région** : Choisir la même région que l'ancien projet (pour la latence)
5. **Plan** : Sélectionner **Free** (ou Pro si nécessaire)
6. **Créer le projet**

### 1.4 Attendre la Création

- ⏱️ **Temps** : 2-5 minutes
- Le projet sera créé automatiquement
- Notez le **Project URL** et **Project Reference**

---

## 📊 Étape 2 : Documenter la Configuration Actuelle

**IMPORTANT** : Avant de migrer, documenter TOUTE la configuration actuelle.

### 2.1 Informations de Base

**Dans l'ancien compte Supabase Dashboard** :

1. **Settings → API** :
   - ✅ `SUPABASE_URL` : `https://xxx.supabase.co`
   - ✅ `SUPABASE_ANON_KEY` : `eyJhbGc...`
   - ✅ `SUPABASE_JWT_SECRET` : (cliquer "Reveal")
   - ✅ `SUPABASE_SERVICE_ROLE_KEY` : (cliquer "Reveal") - **IMPORTANT**

2. **Settings → Database** :
   - ✅ `DATABASE_URL` : `postgresql://postgres:password@db.xxx.supabase.co:5432/postgres`
   - ✅ `Database Password` : (le mot de passe que vous avez créé)

3. **Project Settings** :
   - ✅ `Project Reference` : (dans l'URL)
   - ✅ `Region` : (ex: eu-west-1)

### 2.2 Configuration Auth

**Authentication → Settings** :

1. **Site URL** : `http://cartagespa.com` (ou `https://` si déjà configuré)
2. **Redirect URLs** :
   - `http://cartagespa.com/auth/callback`
   - `http://cartagespa.com/**`
   - `http://www.cartagespa.com/auth/callback`
   - `http://localhost:5173/auth/callback`
   - `http://localhost:5174/auth/callback`

3. **Email Templates** :
   - **Confirm signup** :
     - From Name : (noter)
     - Subject : (noter)
     - Body : (copier le contenu)

4. **Providers** :
   - ✅ Email : Activé
   - ✅ Google : Activé (si utilisé)
   - Autres providers : (noter)

### 2.3 Configuration Storage

**Storage → Buckets** :

1. **Bucket `listing-images`** :
   - ✅ Public/Private : (noter)
   - ✅ File size limit : (noter)
   - ✅ Allowed MIME types : (noter)

2. **Storage Policies (RLS)** :
   - Pour chaque policy :
     - ✅ Policy name
     - ✅ Target roles
     - ✅ USING expression
     - ✅ WITH CHECK expression

**Comment copier les policies** :
```sql
-- Dans Supabase Dashboard → Storage → Policies
-- Cliquer sur chaque policy et copier la définition SQL
```

### 2.4 Configuration Database

**Database → Tables** :

1. **Liste des tables** :
   - ✅ `users`
   - ✅ `listings`
   - ✅ `listing_media`
   - ✅ `favorites`
   - ✅ `moderation_logs`
   - ✅ Autres tables

2. **RLS Policies** :
   - Pour chaque table, noter toutes les RLS policies

**Comment exporter les RLS policies** :
```sql
-- Dans Supabase Dashboard → Database → Tables → [Table] → Policies
-- Copier chaque policy SQL
```

### 2.5 Extensions et Fonctions

**Database → Extensions** :
- ✅ Liste des extensions activées

**Database → Functions** :
- ✅ Liste des fonctions SQL (si présentes)

---

## 💾 Étape 3 : Exporter les Données

### 3.1 Exporter la Base de Données

**Option A : Via Supabase Dashboard (Recommandé)**

1. **Aller dans** : Database → Backups
2. **Cliquer sur "Download backup"**
3. **Choisir "Full backup"**
4. **Télécharger le fichier** (peut prendre du temps)

**Option B : Via pg_dump (Avancé)**

```bash
# Installer PostgreSQL client si nécessaire
# Sur Windows : Télécharger depuis https://www.postgresql.org/download/windows/

# Exporter
pg_dump -h db.xxx.supabase.co \
        -U postgres \
        -d postgres \
        -F c \
        -f backup.dump

# Entrer le mot de passe quand demandé
```

### 3.2 Exporter les Fichiers Storage

**Storage → listing-images** :

1. **Télécharger tous les fichiers** :
   - Cliquer sur chaque fichier
   - Télécharger manuellement
   - OU utiliser l'API Supabase (voir script ci-dessous)

**Script Python pour exporter Storage** :
```python
from supabase import create_client, Client
import os
import requests

# Ancien compte
OLD_SUPABASE_URL = "https://xxx.supabase.co"
OLD_SUPABASE_KEY = "your-service-role-key"  # Service role key

supabase: Client = create_client(OLD_SUPABASE_URL, OLD_SUPABASE_KEY)

# Lister tous les fichiers
files = supabase.storage.from("listing-images").list()

# Créer un dossier pour les fichiers
os.makedirs("storage_backup", exist_ok=True)

# Télécharger chaque fichier
for file in files:
    url = supabase.storage.from("listing-images").get_public_url(file['name'])
    response = requests.get(url)
    
    # Créer la structure de dossiers
    file_path = os.path.join("storage_backup", file['name'])
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    # Sauvegarder le fichier
    with open(file_path, 'wb') as f:
        f.write(response.content)
    
    print(f"Downloaded: {file['name']}")
```

---

## 🚀 Étape 4 : Configurer le Nouveau Compte

### 4.1 Configuration Auth

**Dans le nouveau compte Supabase Dashboard** :

1. **Authentication → Settings** :
   - **Site URL** : `http://cartagespa.com` (ou `https://` si déjà configuré)
   - **Redirect URLs** : Ajouter toutes les URLs de l'ancien compte
   - **Email Templates** : Copier les templates de l'ancien compte

2. **Authentication → Providers** :
   - **Email** : Activer
   - **Google** : Activer (si utilisé)
     - Client ID : (copier de l'ancien compte)
     - Client Secret : (copier de l'ancien compte)

### 4.2 Créer le Bucket Storage

**Storage → New Bucket** :

1. **Nom** : `listing-images`
2. **Public** : ✅ (ou Private selon votre configuration)
3. **File size limit** : (même que l'ancien)
4. **Allowed MIME types** : (même que l'ancien)

### 4.3 Configurer les RLS Policies Storage

**Storage → listing-images → Policies** :

Pour chaque policy de l'ancien compte :

1. **Cliquer sur "New Policy"**
2. **Copier la définition SQL** de l'ancien compte
3. **Sauvegarder**

**Exemple de policy** :
```sql
-- Policy pour permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Users can upload their own files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'listing-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 📥 Étape 5 : Importer les Données

### 5.1 Importer la Base de Données

**Option A : Via Supabase Dashboard**

1. **Aller dans** : Database → Backups
2. **Cliquer sur "Restore from backup"**
3. **Uploader le fichier backup**
4. **Attendre la restauration** (peut prendre du temps)

**Option B : Via psql (Avancé)**

```bash
# Importer
pg_restore -h db.xxx.supabase.co \
           -U postgres \
           -d postgres \
           backup.dump

# Entrer le mot de passe quand demandé
```

### 5.2 Importer les Fichiers Storage

**Option A : Via Dashboard (Manuel)**

1. **Aller dans** : Storage → listing-images
2. **Uploader chaque fichier** manuellement
3. **Conserver la même structure de dossiers**

**Option B : Via Script Python (Recommandé)**

```python
from supabase import create_client, Client
import os

# Nouveau compte
NEW_SUPABASE_URL = "https://yyy.supabase.co"
NEW_SUPABASE_KEY = "your-service-role-key"  # Service role key

supabase: Client = create_client(NEW_SUPABASE_URL, NEW_SUPABASE_KEY)

# Parcourir les fichiers sauvegardés
storage_backup_dir = "storage_backup"

for root, dirs, files in os.walk(storage_backup_dir):
    for file in files:
        file_path = os.path.join(root, file)
        relative_path = os.path.relpath(file_path, storage_backup_dir)
        
        # Lire le fichier
        with open(file_path, 'rb') as f:
            file_data = f.read()
        
        # Uploader vers Supabase
        supabase.storage.from("listing-images").upload(
            relative_path,
            file_data,
            file_options={"content-type": "image/jpeg"}  # Ajuster selon le type
        )
        
        print(f"Uploaded: {relative_path}")
```

### 5.3 Vérifier les RLS Policies Database

**Database → Tables → [Table] → Policies** :

1. **Vérifier que toutes les policies sont présentes**
2. **Si manquantes, les recréer** (copier depuis l'ancien compte)

**Comment recréer une policy** :
```sql
-- Exemple pour la table listings
CREATE POLICY "Users can view approved listings"
ON listings
FOR SELECT
TO authenticated, anon
USING (status = 'approved');
```

---

## 🔧 Étape 6 : Mettre à Jour les Variables d'Environnement

### 6.1 Récupérer les Nouvelles Clés

**Dans le nouveau compte Supabase Dashboard** :

1. **Settings → API** :
   - ✅ `SUPABASE_URL` : Copier
   - ✅ `SUPABASE_ANON_KEY` : Copier
   - ✅ `SUPABASE_JWT_SECRET` : Cliquer "Reveal" et copier
   - ✅ `SUPABASE_SERVICE_ROLE_KEY` : Cliquer "Reveal" et copier

2. **Settings → Database** :
   - ✅ `DATABASE_URL` : Copier (ou construire manuellement)
   - ✅ `Database Password` : (vous l'avez créé lors de la création du projet)

### 6.2 Mettre à Jour `.env` sur le Serveur

**Sur le serveur** :

```bash
# Éditer le fichier
nano "/root/site Web/.env"

# Remplacer les anciennes valeurs par les nouvelles :
DATABASE_URL=postgresql+asyncpg://postgres:NEW_PASSWORD@db.NEW_PROJECT_REF.supabase.co:5432/postgres
SUPABASE_URL=https://NEW_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=NEW_ANON_KEY
SUPABASE_JWT_SECRET=NEW_JWT_SECRET

# Frontend
VITE_SUPABASE_URL=https://NEW_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=NEW_ANON_KEY
```

### 6.3 Mettre à Jour `docker-compose.yml`

**Sur le serveur** :

```bash
# Éditer le fichier
nano "/root/site Web/docker-compose.yml"

# Vérifier que les variables d'environnement pointent vers le nouveau compte
```

### 6.4 Rebuild et Redémarrer

```bash
cd "/root/site Web"

# Rebuild avec les nouvelles variables
docker compose build backend frontend

# Redémarrer
docker compose up -d

# Vérifier les logs
docker compose logs -f backend
```

---

## ✅ Étape 7 : Tests et Vérification

### 7.1 Test de Connexion

1. **Tester l'API** :
   ```bash
   curl http://cartagespa.com/api/v1/health
   ```

2. **Tester l'authentification** :
   - Aller sur `http://cartagespa.com/login`
   - Essayer de se connecter avec un compte existant
   - Vérifier que ça fonctionne

3. **Tester l'upload d'images** :
   - Créer un nouveau listing
   - Uploader une image
   - Vérifier que l'image apparaît

### 7.2 Vérification des Données

**Dans le nouveau compte Supabase Dashboard** :

1. **Database → Tables** :
   - ✅ Vérifier que toutes les tables existent
   - ✅ Vérifier le nombre de lignes (doit correspondre à l'ancien compte)

2. **Storage → listing-images** :
   - ✅ Vérifier que tous les fichiers sont présents
   - ✅ Tester l'accès à quelques fichiers

3. **Authentication → Users** :
   - ✅ Vérifier que tous les utilisateurs sont présents
   - ✅ Tester la connexion avec un utilisateur

### 7.3 Vérification des Statistiques

**Admin Panel** :
- ✅ Aller sur `/admin/stats`
- ✅ Vérifier que les statistiques sont correctes
- ✅ Vérifier que les vues (`views_count`) sont présentes

---

## 🗑️ Étape 8 : Supprimer l'Ancien Compte (Optionnel)

**⚠️ ATTENTION** : Ne supprimer l'ancien compte QUE si vous êtes sûr que tout fonctionne.

### 8.1 Vérifications Finales

Avant de supprimer :
- ✅ Tous les tests passent
- ✅ Toutes les données sont migrées
- ✅ Tous les utilisateurs peuvent se connecter
- ✅ Les images s'affichent correctement
- ✅ L'admin panel fonctionne

### 8.2 Supprimer le Projet

1. **Aller dans** : Settings → General
2. **Scroller jusqu'à "Danger Zone"**
3. **Cliquer sur "Delete Project"**
4. **Confirmer la suppression**

---

## 📋 Checklist Complète

### Préparation
- [ ] Email anonyme créé (ProtonMail, etc.)
- [ ] VPN activé (optionnel)
- [ ] Configuration actuelle documentée

### Création Nouveau Compte
- [ ] Compte Supabase anonyme créé
- [ ] Projet créé
- [ ] Nouvelles clés API notées

### Export
- [ ] Base de données exportée
- [ ] Fichiers Storage exportés
- [ ] Configuration Auth documentée
- [ ] RLS Policies documentées

### Import
- [ ] Base de données importée
- [ ] Fichiers Storage importés
- [ ] RLS Policies recréées
- [ ] Configuration Auth recréée

### Mise à Jour
- [ ] Variables d'environnement mises à jour
- [ ] `docker-compose.yml` mis à jour
- [ ] Services rebuild et redémarrés

### Tests
- [ ] Connexion API fonctionne
- [ ] Authentification fonctionne
- [ ] Upload d'images fonctionne
- [ ] Données vérifiées
- [ ] Statistiques vérifiées

### Nettoyage
- [ ] Ancien compte supprimé (optionnel)

---

## 🆘 Dépannage

### Problème : Erreur lors de l'import de la base de données

**Solution** :
```bash
# Vérifier la taille du backup
# Si trop gros, utiliser pg_restore avec options
pg_restore -h db.xxx.supabase.co \
           -U postgres \
           -d postgres \
           --verbose \
           --no-owner \
           --no-privileges \
           backup.dump
```

### Problème : Les images ne s'affichent pas

**Solution** :
1. Vérifier que le bucket est **Public**
2. Vérifier les **RLS Policies** du bucket
3. Vérifier que les URLs dans la base de données pointent vers le nouveau compte

### Problème : Les utilisateurs ne peuvent pas se connecter

**Solution** :
1. Vérifier que les **Redirect URLs** sont correctement configurées
2. Vérifier que le **Site URL** est correct
3. Vérifier que les **Email Templates** sont configurés

### Problème : Erreur "Invalid API key"

**Solution** :
1. Vérifier que `VITE_SUPABASE_ANON_KEY` est correct dans `.env`
2. Rebuild le frontend : `docker compose build frontend`
3. Redémarrer : `docker compose up -d`

---

## 📚 Ressources

- **Supabase Documentation** : https://supabase.com/docs
- **Migration Guide** : https://supabase.com/docs/guides/database/migrations
- **Storage Guide** : https://supabase.com/docs/guides/storage
- **Auth Guide** : https://supabase.com/docs/guides/auth

---

## 🎯 Résumé

**Temps total** : 2-3 heures  
**Étapes principales** :
1. Créer compte anonyme
2. Exporter données
3. Importer données
4. Configurer
5. Mettre à jour variables
6. Tester
7. Supprimer ancien compte (optionnel)

**Résultat** : Compte Supabase complètement anonyme avec toutes les données et configurations migrées.

