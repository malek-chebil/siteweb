# 🔧 Fix : Colonne `listing_type` Manquante

## 🚨 Problème

**Erreur** : `column listings.listing_type does not exist`

**Cause** : La colonne `listing_type` n'existe pas dans la table `listings` de la base de données, mais le code essaie de l'utiliser.

---

## ✅ Solution : Exécuter la Migration

### Option 1 : Via Supabase SQL Editor (Recommandé)

1. **Aller dans Supabase Dashboard** :
   - Ouvrir votre projet Supabase
   - Aller dans **SQL Editor**

2. **Exécuter la Migration** :
   - Copier le contenu de `backend/migration_009_listing_type.sql`
   - Coller dans l'éditeur SQL
   - Cliquer sur **Run**

**Contenu de la migration** :
```sql
-- Step 1: Create enum type for listing_type (if it doesn't exist)
DO $$ BEGIN
    CREATE TYPE listingtype AS ENUM ('personal', 'company');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 2: Add listing_type column with default value
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS listing_type listingtype NOT NULL DEFAULT 'personal';

-- Step 3: Create index for listing_type
CREATE INDEX IF NOT EXISTS ix_listings_listing_type ON listings(listing_type);

-- Verify the migration
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'listings' 
AND column_name = 'listing_type';
```

3. **Vérifier** :
   - La requête de vérification devrait retourner une ligne avec `listing_type`

---

### Option 2 : Via Alembic (Sur le Serveur)

**Sur le serveur, exécuter :**

```bash
# Aller dans le répertoire du projet
cd "/root/site Web"

# Exécuter la migration Alembic
docker compose exec backend alembic upgrade head

# Vérifier que la migration a été appliquée
docker compose exec backend alembic current
```

**Si Alembic échoue** (par exemple, à cause des limites du pooler Supabase), utilisez l'**Option 1** (SQL Editor).

---

## 🔍 Vérification

### Vérifier que la Colonne Existe

**Dans Supabase SQL Editor** :

```sql
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'listings' 
AND column_name = 'listing_type';
```

**Résultat attendu** :
```
column_name   | data_type | column_default | is_nullable
--------------+-----------+----------------+-------------
listing_type  | USER-DEFINED | 'personal'::listingtype | NO
```

### Tester l'API

**Après la migration, tester** :

```bash
# Sur le serveur
curl http://localhost:8000/api/v1/listings?page=1&page_size=20

# OU depuis votre machine
curl https://cartagespa.com/api/v1/listings?page=1&page_size=20
```

**Résultat attendu** : `200 OK` avec les données des listings

---

## 🆘 Si la Migration Échoue

### Problème 1 : Type Enum Existe Déjà

**Erreur** : `type "listingtype" already exists`

**Solution** : C'est normal, la migration utilise `IF NOT EXISTS`. Continuez avec l'étape suivante.

### Problème 2 : Colonne Existe Déjà

**Erreur** : `column "listing_type" of relation "listings" already exists`

**Solution** : La colonne existe déjà. Vérifiez avec la requête de vérification.

### Problème 3 : Permissions Insuffisantes

**Erreur** : `permission denied`

**Solution** : Assurez-vous d'utiliser un compte avec les permissions appropriées dans Supabase.

---

## 📋 Checklist

- [ ] Migration SQL exécutée dans Supabase SQL Editor
- [ ] Vérification de la colonne effectuée
- [ ] Test de l'API effectué
- [ ] Erreurs 500 résolues

---

## 🎯 Action Immédiate

**Exécuter la migration dans Supabase SQL Editor** :

1. Ouvrir Supabase Dashboard
2. Aller dans **SQL Editor**
3. Copier-coller le contenu de `backend/migration_009_listing_type.sql`
4. Cliquer sur **Run**
5. Vérifier le résultat

**Après la migration, redémarrer le backend** (si nécessaire) :

```bash
docker compose restart backend
```

---

**Une fois la migration exécutée, les erreurs 500 devraient être résolues !** ✅

