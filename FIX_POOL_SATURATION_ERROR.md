# 🔧 Fix : Pool de Connexions Saturé

## 🚨 Problème

**Erreur** : `QueuePool limit of size 2 overflow 0 reached, connection timed out`

**Signification** : Le pool de connexions SQLAlchemy est saturé. Avec seulement 2 connexions disponibles et 0 overflow, plusieurs requêtes simultanées saturent le pool.

---

## 🔍 Cause

**Configuration actuelle** :
- `pool_size=2` : Seulement 2 connexions dans le pool
- `max_overflow=0` : Aucune connexion supplémentaire autorisée
- **Résultat** : Si 3+ requêtes arrivent en même temps, elles attendent et timeout après 30 secondes

---

## ✅ Solution

### Option 1 : Augmenter le Pool (Recommandé)

**Pour connexion directe (port 5432)** - Plus de connexions disponibles :

```python
pool_size=5,  # Augmenter de 2 à 5
max_overflow=5,  # Permettre 5 connexions supplémentaires en cas de pic
```

**Pour pooler (port 6543)** - Limites strictes :

```python
pool_size=3,  # Augmenter de 2 à 3 (limite Supabase pooler)
max_overflow=2,  # Permettre 2 connexions supplémentaires
```

### Option 2 : Utiliser Connexion Directe (Meilleure Solution)

**Avantages** :
- ✅ Plus de connexions disponibles (~60 au lieu de ~15-20)
- ✅ Pas d'erreur `MaxClientsInSessionMode`
- ✅ Plus stable

**Changement dans `DATABASE_URL`** :
```
# Avant (pooler)
postgresql+asyncpg://...@db.xxxxx.supabase.co:6543/postgres

# Après (direct)
postgresql+asyncpg://...@db.xxxxx.supabase.co:5432/postgres
```

**Puis dans `database.py`** :
```python
pool_size=5,
max_overflow=5,
```

---

## 🔧 Modification Immédiate

**Fichier** : `backend/app/database.py`

**Changement** :

```python
engine = create_async_engine(
    db_url,
    echo=settings.DEBUG,
    future=True,
    pool_size=5,  # Augmenter de 2 à 5
    max_overflow=5,  # Permettre 5 connexions supplémentaires
    pool_timeout=30,
    pool_recycle=1800,
    pool_pre_ping=True,
    pool_reset_on_return='commit',
    connect_args={
        "statement_cache_size": 0,
        "command_timeout": 30,
        "server_settings": {
            "jit": "off"
        }
    }
)
```

---

## 📋 Vérifications

### 1. Vérifier le Type de Connexion

```powershell
cd backend
python -c "import os; from dotenv import load_dotenv; load_dotenv(); url = os.getenv('DATABASE_URL', ''); print('Port:', '6543 (pooler)' if ':6543' in url or ':6544' in url else '5432 (direct)' if ':5432' in url else 'Unknown')"
```

### 2. Tester après Modification

```powershell
# Redémarrer le backend
uvicorn app.main:app --reload

# Tester plusieurs requêtes simultanées
# Le pool devrait maintenant gérer plus de requêtes
```

---

## 🎯 Recommandation Finale

**Si vous utilisez le pooler (6543)** :
- `pool_size=3`, `max_overflow=2` (limites Supabase)

**Si vous utilisez la connexion directe (5432)** :
- `pool_size=5`, `max_overflow=5` (plus de marge)

**Meilleure solution** : Passer à la connexion directe (port 5432) pour plus de connexions et plus de stabilité.

---

**Le pool est saturé ! Augmentez pool_size et max_overflow, ou passez à la connexion directe (port 5432).** ✅

