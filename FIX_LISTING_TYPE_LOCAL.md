# 🔧 Fix : Colonne `listing_type` Manquante (Local)

## 🚨 Problème Local

**Erreur** : `column listings.listing_type does not exist`

**Contexte** : Le problème se produit sur votre machine locale, pas sur le serveur.

---

## ✅ Solution : Exécuter la Migration en Local

### Option 1 : Via Supabase SQL Editor (Si vous utilisez Supabase)

1. **Aller dans Supabase Dashboard** :
   - Ouvrir votre projet Supabase
   - Aller dans **SQL Editor**

2. **Exécuter la Migration** :
   - Copier le contenu ci-dessous
   - Coller dans l'éditeur SQL
   - Cliquer sur **Run**

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

---

### Option 2 : Via Alembic (En Local)

**Dans votre terminal local (PowerShell)** :

```powershell
# Aller dans le répertoire backend
cd backend

# Activer l'environnement virtuel (si vous en avez un)
.\venv\Scripts\Activate.ps1

# Exécuter la migration Alembic
alembic upgrade head

# Vérifier que la migration a été appliquée
alembic current
```

**Si vous n'avez pas d'environnement virtuel** :

```powershell
# Installer les dépendances si nécessaire
pip install -r requirements.txt

# Exécuter Alembic
alembic upgrade head
```

---

### Option 3 : Via Python Script Direct

**Créer un script Python** `run_migration.py` :

```python
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
import os
from dotenv import load_dotenv

load_dotenv()

async def run_migration():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("Error: DATABASE_URL not found in .env")
        return
    
    engine = create_async_engine(db_url, echo=True)
    
    async with engine.begin() as conn:
        # Step 1: Create enum type
        await conn.execute(text("""
            DO $$ BEGIN
                CREATE TYPE listingtype AS ENUM ('personal', 'company');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        """))
        
        # Step 2: Add column
        await conn.execute(text("""
            ALTER TABLE listings 
            ADD COLUMN IF NOT EXISTS listing_type listingtype NOT NULL DEFAULT 'personal';
        """))
        
        # Step 3: Create index
        await conn.execute(text("""
            CREATE INDEX IF NOT EXISTS ix_listings_listing_type ON listings(listing_type);
        """))
        
        print("✅ Migration completed successfully!")
    
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(run_migration())
```

**Exécuter** :

```powershell
cd backend
python run_migration.py
```

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

### Tester l'API Localement

**Après la migration, tester** :

```powershell
# Démarrer le backend (si pas déjà démarré)
cd backend
uvicorn app.main:app --reload

# Dans un autre terminal, tester
curl http://localhost:8000/api/v1/listings?page=1&page_size=20
```

**Résultat attendu** : `200 OK` avec les données des listings

---

## 📋 Checklist

- [ ] Migration exécutée (Supabase SQL Editor OU Alembic)
- [ ] Vérification de la colonne effectuée
- [ ] Backend redémarré (si nécessaire)
- [ ] Test de l'API effectué
- [ ] Erreurs 500 résolues

---

## 🎯 Action Immédiate

**Méthode la plus simple** :

1. **Ouvrir Supabase Dashboard**
2. **Aller dans SQL Editor**
3. **Copier-coller le SQL de migration** (voir Option 1)
4. **Cliquer sur Run**
5. **Vérifier le résultat**

**OU** si vous préférez Alembic :

```powershell
cd backend
alembic upgrade head
```

---

## 🆘 Si la Migration Échoue

### Problème 1 : Alembic ne trouve pas la migration

**Solution** : Vérifier que le fichier de migration existe :
```powershell
ls backend/alembic/versions/009_*.py
```

### Problème 2 : Connexion à la base de données échoue

**Solution** : Vérifier `DATABASE_URL` dans `.env` :
```powershell
cat backend/.env | grep DATABASE_URL
```

### Problème 3 : Type Enum existe déjà

**Solution** : C'est normal, la migration utilise `IF NOT EXISTS`. Continuez.

---

**Une fois la migration exécutée en local, les erreurs 500 devraient être résolues !** ✅

