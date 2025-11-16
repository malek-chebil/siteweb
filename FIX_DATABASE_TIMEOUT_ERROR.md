# 🔧 Fix : TimeoutError - Connexion Base de Données

## 🚨 Problème

**Erreur** : `TimeoutError` lors de la connexion à Supabase

**Signification** : La connexion à la base de données prend trop de temps et expire.

---

## 🔍 Causes Possibles

1. **DATABASE_URL incorrect** : URL mal formée ou port incorrect
2. **Problème de réseau** : Firewall, VPN, ou connexion internet
3. **Supabase inaccessible** : Problème côté Supabase
4. **Timeout trop court** : Le délai d'attente est insuffisant
5. **Connexion directe bloquée** : Le port 5432 peut être bloqué

---

## ✅ Solutions

### Solution 1 : Vérifier DATABASE_URL

**Vérifier que `DATABASE_URL` est correct** :

```powershell
cd backend
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print('DATABASE_URL:', os.getenv('DATABASE_URL', 'NOT SET')[:50] + '...')"
```

**Format attendu** :
```
postgresql+asyncpg://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

**Vérifier** :
- ✅ Le format est correct
- ✅ Le port est 5432 (direct) ou 6543 (pooler)
- ✅ Le mot de passe est correct
- ✅ Le hostname est correct

---

### Solution 2 : Tester la Connexion Directement

**Créer un script de test** `test_db_connection.py` :

```python
import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def test_connection():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("❌ DATABASE_URL not found")
        return
    
    # Extraire les informations de connexion
    # Format: postgresql+asyncpg://user:password@host:port/database
    import urllib.parse
    parsed = urllib.parse.urlparse(db_url.replace("postgresql+asyncpg://", "postgresql://"))
    
    try:
        print(f"🔍 Testing connection to {parsed.hostname}:{parsed.port}...")
        conn = await asyncio.wait_for(
            asyncpg.connect(
                host=parsed.hostname,
                port=int(parsed.port or 5432),
                user=parsed.username,
                password=parsed.password,
                database=parsed.path[1:] if parsed.path else "postgres",
                timeout=10  # 10 secondes timeout
            ),
            timeout=15  # Timeout total de 15 secondes
        )
        print("✅ Connection successful!")
        await conn.close()
    except asyncio.TimeoutError:
        print("❌ Connection timeout - Supabase is not reachable")
    except Exception as e:
        print(f"❌ Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_connection())
```

**Exécuter** :

```powershell
cd backend
python test_db_connection.py
```

---

### Solution 3 : Augmenter le Timeout

**Dans `backend/app/database.py`** :

```python
engine = create_async_engine(
    db_url,
    echo=settings.DEBUG,
    future=True,
    pool_size=2,
    max_overflow=0,
    pool_timeout=30,  # Augmenter de 20 à 30 secondes
    pool_recycle=1800,
    pool_pre_ping=True,
    pool_reset_on_return='commit',
    connect_args={
        "statement_cache_size": 0,
        "command_timeout": 30,  # Ajouter timeout pour les commandes
        "server_settings": {
            "jit": "off"
        }
    }
)
```

---

### Solution 4 : Vérifier le Firewall/Réseau

**Problèmes possibles** :
- Firewall Windows bloque le port 5432
- VPN bloque les connexions
- Connexion internet instable

**Solutions** :
1. **Désactiver temporairement le firewall** pour tester
2. **Vérifier la connexion internet**
3. **Tester depuis un autre réseau** (mobile hotspot)

---

### Solution 5 : Utiliser le Pooler au Lieu de la Connexion Directe

**Si le port 5432 est bloqué**, utilisez le pooler (6543) :

**Dans `DATABASE_URL`** :
```
postgresql+asyncpg://postgres:password@db.xxxxx.supabase.co:6543/postgres
```

**Puis réduire le pool_size** :
```python
pool_size=2,
max_overflow=0,
```

---

## 🔍 Diagnostic Étape par Étape

### ÉTAPE 1 : Vérifier DATABASE_URL

```powershell
cd backend
python -c "import os; from dotenv import load_dotenv; load_dotenv(); url = os.getenv('DATABASE_URL', ''); print('URL:', url[:80] + '...' if len(url) > 80 else url)"
```

### ÉTAPE 2 : Tester la Connexion avec asyncpg

```powershell
cd backend
python test_db_connection.py
```

### ÉTAPE 3 : Vérifier la Connexion Internet

```powershell
# Tester si Supabase est accessible
ping db.xxxxx.supabase.co
```

### ÉTAPE 4 : Vérifier dans Supabase Dashboard

1. Aller dans **Settings** → **Database**
2. Vérifier que la base de données est active
3. Vérifier les connexions actives

---

## 🆘 Solutions Rapides

### Solution Rapide 1 : Augmenter Timeout

**Dans `backend/app/database.py`** :

```python
pool_timeout=30,  # Augmenter de 20 à 30
connect_args={
    "statement_cache_size": 0,
    "command_timeout": 30,  # Ajouter
    ...
}
```

### Solution Rapide 2 : Vérifier DATABASE_URL

**Assurez-vous que `DATABASE_URL` est correct** :
- Format : `postgresql+asyncpg://user:password@host:port/database`
- Port : `5432` (direct) ou `6543` (pooler)
- Pas d'espaces ou caractères spéciaux

### Solution Rapide 3 : Redémarrer le Backend

**Parfois, les connexions restent bloquées** :

```powershell
# Arrêter complètement (Ctrl+C)
# Attendre 10 secondes
# Redémarrer
cd backend
uvicorn app.main:app --reload
```

---

## 📋 Checklist

- [ ] `DATABASE_URL` vérifié (format correct)
- [ ] Port correct (5432 ou 6543)
- [ ] Mot de passe correct
- [ ] Timeout augmenté (30 secondes)
- [ ] Connexion testée avec `test_db_connection.py`
- [ ] Firewall vérifié
- [ ] Connexion internet stable
- [ ] Backend redémarré

---

## 🎯 Action Immédiate

**1. Vérifier DATABASE_URL** :

```powershell
cd backend
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print(os.getenv('DATABASE_URL', 'NOT SET'))"
```

**2. Augmenter le timeout** dans `database.py` :

```python
pool_timeout=30,  # Au lieu de 20
```

**3. Redémarrer le backend** :

```powershell
uvicorn app.main:app --reload
```

---

**Le TimeoutError indique que la connexion à Supabase prend trop de temps. Vérifiez DATABASE_URL et augmentez le timeout !** ✅

