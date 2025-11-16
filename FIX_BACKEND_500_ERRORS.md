# 🔧 Fix : Erreurs 500 Backend

## 🚨 Problème

Plusieurs endpoints retournent des erreurs **500 (Internal Server Error)** :

- `/api/v1/listings?is_featured=true&page=1&page_size=20` → 500
- `/api/v1/listings?page=1&page_size=100` → 500
- `/api/v1/admin/stats` → 500
- `/api/v1/favorites/check/11` → 500
- `/api/v1/favorites/check/7` → 500

**Aussi** :
- `/api/v1/listings?page=1&page_size=20` → 504 (Gateway Timeout)
- `/api/v1/users/me/stats` → 429 (Too Many Requests)

---

## 🔍 Diagnostic

### ÉTAPE 1 : Vérifier les Logs Backend

**Sur le serveur, exécuter :**

```bash
# Voir les dernières erreurs
docker compose logs backend --tail 100

# Voir les erreurs en temps réel
docker compose logs -f backend

# Filtrer les erreurs
docker compose logs backend | grep -i error
docker compose logs backend | grep -i traceback
docker compose logs backend | grep -i exception
```

### ÉTAPE 2 : Vérifier le Statut du Backend

```bash
# Vérifier que le backend est en cours d'exécution
docker compose ps backend

# Vérifier les health checks
docker compose exec backend curl -I http://localhost:8000/health
```

### ÉTAPE 3 : Tester les Endpoints Directement

**Sur le serveur :**

```bash
# Tester l'endpoint listings
curl -v http://localhost:8000/api/v1/listings?page=1&page_size=20

# Tester l'endpoint health
curl -v http://localhost:8000/health

# Tester depuis l'extérieur (via Nginx)
curl -v https://cartagespa.com/api/v1/listings?page=1&page_size=20
```

---

## 🆘 Causes Possibles

### 1. Problème de Connexion à la Base de Données

**Symptômes** :
- Erreurs `Connection refused` ou `timeout`
- Erreurs `database connection failed`

**Solution** :
```bash
# Vérifier la variable DATABASE_URL
docker compose exec backend env | grep DATABASE_URL

# Tester la connexion
docker compose exec backend python -c "
from app.database import engine
import asyncio
async def test():
    async with engine.begin() as conn:
        print('Database connection OK')
asyncio.run(test())
"
```

### 2. Problème avec Supabase

**Symptômes** :
- Erreurs `Invalid API key`
- Erreurs `Supabase connection failed`

**Solution** :
```bash
# Vérifier les variables Supabase
docker compose exec backend env | grep SUPABASE

# Vérifier que les clés sont correctes
docker compose exec backend python -c "
import os
print('SUPABASE_URL:', os.getenv('SUPABASE_URL'))
print('SUPABASE_ANON_KEY:', os.getenv('SUPABASE_ANON_KEY')[:20] + '...')
"
```

### 3. Exception Non Gérée dans le Code

**Symptômes** :
- Traceback dans les logs
- Erreurs Python spécifiques

**Solution** : Vérifier les logs pour identifier l'exception exacte

### 4. Problème de Migration de Base de Données

**Symptômes** :
- Erreurs `relation does not exist`
- Erreurs `table not found`

**Solution** :
```bash
# Vérifier les migrations
docker compose exec backend alembic current

# Exécuter les migrations
docker compose exec backend alembic upgrade head
```

### 5. Problème de Mémoire/Ressources

**Symptômes** :
- Erreurs `out of memory`
- Timeouts

**Solution** :
```bash
# Vérifier l'utilisation des ressources
docker stats

# Vérifier les logs système
dmesg | tail -20
```

---

## 🔧 Solutions Rapides

### Solution 1 : Redémarrer le Backend

```bash
# Redémarrer le backend
docker compose restart backend

# Attendre quelques secondes
sleep 5

# Vérifier les logs
docker compose logs backend --tail 20
```

### Solution 2 : Rebuild le Backend

```bash
# Rebuild sans cache
docker compose build --no-cache backend

# Redémarrer
docker compose up -d backend

# Vérifier les logs
docker compose logs -f backend
```

### Solution 3 : Vérifier les Variables d'Environnement

```bash
# Vérifier le fichier .env
cat /root/site\ Web/.env

# Vérifier que les variables sont chargées
docker compose exec backend env | grep -E "(DATABASE|SUPABASE|CORS)"
```

---

## 📋 Checklist de Diagnostic

- [ ] Backend est en cours d'exécution (`docker compose ps`)
- [ ] Health check fonctionne (`/health` endpoint)
- [ ] Logs backend vérifiés (pas d'erreurs Python)
- [ ] Connexion base de données fonctionne
- [ ] Variables d'environnement correctes
- [ ] Migrations à jour (`alembic upgrade head`)
- [ ] Ressources suffisantes (RAM, CPU)
- [ ] Nginx peut atteindre le backend

---

## 🎯 Action Immédiate

**Sur le serveur, exécuter :**

```bash
# 1. Voir les logs backend
docker compose logs backend --tail 50

# 2. Vérifier le statut
docker compose ps

# 3. Tester l'endpoint health
curl http://localhost:8000/health

# 4. Si erreur, redémarrer
docker compose restart backend
```

**Envoyez-moi les logs backend pour identifier la cause exacte !**

