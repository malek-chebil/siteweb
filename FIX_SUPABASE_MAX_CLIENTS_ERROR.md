# 🔧 Fix : Erreur MaxClientsInSessionMode

## 🚨 Problème

**Erreur** : `MaxClientsInSessionMode: max clients reached - in Session mode max clients are limited to pool_size`

**Signification** : Le pool de connexions à Supabase a atteint sa limite maximale. Cela se produit quand :
- Trop de connexions sont ouvertes simultanément
- Les connexions ne sont pas correctement fermées
- Le `pool_size` est trop élevé pour le plan Supabase

---

## ✅ Solutions

### Solution 1 : Réduire le Pool Size (Recommandé)

**Fichier** : `backend/app/database.py`

**Modifier la configuration du pool** :

```python
# Réduire pool_size et max_overflow
engine = create_async_engine(
    database_url,
    pool_size=5,  # Réduire de 10 à 5 (ou moins)
    max_overflow=0,  # Pas de connexions supplémentaires
    pool_pre_ping=True,  # Vérifier les connexions avant utilisation
    pool_recycle=3600,  # Recycler les connexions après 1 heure
    echo=settings.DEBUG,
)
```

**Valeurs recommandées pour Supabase Free/Pro** :
- `pool_size=5` : Maximum 5 connexions simultanées
- `max_overflow=0` : Pas de connexions supplémentaires
- `pool_pre_ping=True` : Vérifier que les connexions sont valides

---

### Solution 2 : Utiliser la Connexion Directe (Alternative)

**Si vous utilisez le pooler Supabase** (port 6543 ou 6544), **passez à la connexion directe** (port 5432).

**Dans votre `DATABASE_URL`** :

**Avant** (pooler) :
```
postgresql+asyncpg://postgres:password@db.xxxxx.supabase.co:6543/postgres
```

**Après** (direct) :
```
postgresql+asyncpg://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

**Avantages** :
- Pas de limite de pool_size
- Connexions plus stables
- Meilleure performance pour les requêtes longues

**Inconvénients** :
- Limite de connexions simultanées (selon le plan Supabase)
- Nécessite de gérer le pool_size manuellement

---

### Solution 3 : Fermer Correctement les Connexions

**Vérifier que les sessions sont correctement fermées** :

**Dans `backend/app/dependencies.py`** :

```python
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()  # S'assurer que la session est fermée
```

---

## 🔍 Diagnostic

### Vérifier le Pool Size Actuel

**Dans `backend/app/database.py`** :

```python
# Vérifier la configuration actuelle
print(f"Pool size: {engine.pool.size()}")
print(f"Pool checked out: {engine.pool.checkedout()}")
```

### Vérifier les Connexions Actives

**Dans Supabase Dashboard** :
1. Aller dans **Database** → **Connection Pooling**
2. Vérifier le nombre de connexions actives
3. Voir les limites de votre plan

---

## 📋 Configuration Recommandée

### Pour Supabase Free Plan

```python
engine = create_async_engine(
    database_url,
    pool_size=3,  # Limite basse pour Free plan
    max_overflow=0,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=settings.DEBUG,
)
```

### Pour Supabase Pro Plan

```python
engine = create_async_engine(
    database_url,
    pool_size=10,  # Plus élevé pour Pro plan
    max_overflow=5,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=settings.DEBUG,
)
```

---

## 🆘 Si le Problème Persiste

### Option 1 : Redémarrer le Backend

**Parfois, les connexions restent ouvertes** :

```powershell
# Arrêter complètement le backend (Ctrl+C)
# Attendre quelques secondes
# Redémarrer
cd backend
uvicorn app.main:app --reload
```

### Option 2 : Vérifier les Connexions Zombies

**Dans Supabase Dashboard** :
1. Aller dans **Database** → **Connection Pooling**
2. Vérifier les connexions actives
3. Si beaucoup de connexions, attendre qu'elles expirent (généralement 1 heure)

### Option 3 : Utiliser la Connexion Directe

**Changer `DATABASE_URL` pour utiliser le port 5432** au lieu de 6543/6544.

---

## 🎯 Action Immédiate

**1. Vérifier `backend/app/database.py`** :

```python
# Vérifier la configuration du pool
pool_size=10  # Peut être trop élevé
```

**2. Réduire le pool_size** :

```python
pool_size=5  # Ou 3 pour Free plan
max_overflow=0
```

**3. Redémarrer le backend** :

```powershell
cd backend
uvicorn app.main:app --reload
```

---

**Cette erreur indique que vous avez trop de connexions ouvertes simultanément. Réduisez le `pool_size` dans `database.py` !** ✅

