# 🔧 Fix : Incompatibilité Enum `listing_type`

## 🚨 Problème

**Erreur** : `LookupError: 'personal' is not among the defined enum values. Enum name: listingtype. Possible values: PERSONAL, COMPANY`

**Cause** : SQLAlchemy essaie de mapper les valeurs de l'enum de la base de données (`'personal'`, `'company'`) vers les noms des attributs Python (`PERSONAL`, `COMPANY`) au lieu d'utiliser les valeurs.

---

## ✅ Solution : Corriger la Configuration de l'Enum

### Modification Effectuée

**Fichier** : `backend/app/models.py`

**Changement** :
- Utilisation de `PG_ENUM` avec `native_enum=False` pour que SQLAlchemy utilise les valeurs directement
- Spécification du nom de l'enum PostgreSQL (`listingtype`) avec `create_type=False`

**Code modifié** :
```python
from sqlalchemy.dialects.postgresql import ENUM as PG_ENUM

# Dans la classe Listing
listing_type = Column(
    PG_ENUM(ListingType, name='listingtype', create_type=False, native_enum=False),
    default=ListingType.PERSONAL,
    nullable=False,
    index=True
)
```

---

## 🔍 Explication

### Problème

- **Base de données** : L'enum PostgreSQL `listingtype` stocke les valeurs `'personal'` et `'company'` (minuscules)
- **Code Python** : L'enum `ListingType` a les attributs `PERSONAL = "personal"` et `COMPANY = "company"`
- **SQLAlchemy** : Par défaut, essaie de mapper en utilisant les noms des attributs (`PERSONAL`, `COMPANY`) au lieu des valeurs (`'personal'`, `'company'`)

### Solution

- **`native_enum=False`** : Force SQLAlchemy à utiliser les valeurs de l'enum plutôt que les noms
- **`name='listingtype'`** : Spécifie le nom de l'enum PostgreSQL existant
- **`create_type=False`** : Indique que le type existe déjà dans la base de données

---

## 🚀 Après Modification

**Redémarrer le backend** :

```powershell
cd backend
# Arrêter (Ctrl+C) et redémarrer
uvicorn app.main:app --reload
```

**Tester** :

```powershell
# Tester l'endpoint
curl http://localhost:8000/api/v1/listings?page=1&page_size=20
```

**Résultat attendu** : `200 OK` avec les données des listings

---

## 🔍 Vérification

### Vérifier que l'Enum Fonctionne

**Créer un script de test** `test_enum.py` :

```python
from app.models import ListingType

# Tester les valeurs
print("ListingType.PERSONAL.value:", ListingType.PERSONAL.value)
print("ListingType.COMPANY.value:", ListingType.COMPANY.value)

# Tester la conversion
print("From string 'personal':", ListingType('personal'))
print("From string 'company':", ListingType('company'))
```

**Exécuter** :

```powershell
cd backend
python test_enum.py
```

**Résultat attendu** :
```
ListingType.PERSONAL.value: personal
ListingType.COMPANY.value: company
From string 'personal': ListingType.PERSONAL
From string 'company': ListingType.COMPANY
```

---

## 🆘 Si le Problème Persiste

### Problème 1 : Erreur "type does not exist"

**Solution** : Vérifier que l'enum existe dans la base de données :

```sql
-- Dans Supabase SQL Editor
SELECT typname FROM pg_type WHERE typname = 'listingtype';
```

**Si n'existe pas** : Exécuter la migration SQL (voir `FIX_MISSING_LISTING_TYPE_COLUMN.md`)

### Problème 2 : Erreur "column does not exist"

**Solution** : Vérifier que la colonne existe :

```sql
-- Dans Supabase SQL Editor
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'listings' AND column_name = 'listing_type';
```

**Si n'existe pas** : Exécuter la migration SQL

---

## 📋 Checklist

- [x] Code modifié dans `backend/app/models.py`
- [ ] Import `PG_ENUM` ajouté
- [ ] Configuration de `listing_type` corrigée
- [ ] Backend redémarré
- [ ] Test effectué (pas d'erreurs 500)

---

## 🎯 Action Immédiate

**1. Redémarrer le backend** :

```powershell
cd backend
uvicorn app.main:app --reload
```

**2. Tester** :

- Ouvrir `http://localhost:5173`
- Vérifier que les listings se chargent
- Pas d'erreurs 500 ✅

---

**La modification a été effectuée dans `backend/app/models.py`. Redémarrez le backend et testez !** ✅

