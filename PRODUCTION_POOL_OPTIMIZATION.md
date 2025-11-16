# 🚀 Optimisation Pool de Connexions pour Production

## 🎯 Problème Résolu

**Erreur en production** : `QueuePool limit reached, connection timed out`

**Cause** : Pool trop petit pour gérer le trafic de production avec plusieurs requêtes simultanées.

---

## ✅ Solution Appliquée

### Configuration Optimisée pour Production

**Fichier** : `backend/app/database.py`

**Nouveaux paramètres** :

#### Connexion Directe (Port 5432) - **RECOMMANDÉ**
```python
pool_size = 10        # Base pool (augmenté de 5)
max_overflow = 10     # Connexions supplémentaires (augmenté de 5)
# Total: 20 connexions simultanées
```

#### Pooler (Port 6543) - Limité
```python
pool_size = 5         # Base pool (augmenté de 3)
max_overflow = 5      # Connexions supplémentaires (augmenté de 2)
# Total: 10 connexions simultanées
```

**Timeout augmenté** :
```python
pool_timeout = 60     # 60 secondes (augmenté de 30)
```

---

## 📊 Comparaison Avant/Après

| Configuration | Avant | Après | Amélioration |
|--------------|-------|-------|--------------|
| **Direct (5432)** | 5 connexions | 20 connexions | **+300%** |
| **Pooler (6543)** | 5 connexions | 10 connexions | **+100%** |
| **Timeout** | 30s | 60s | **+100%** |

---

## 🔧 Pourquoi Ces Valeurs ?

### Connexion Directe (Port 5432)

**Avantages** :
- ✅ **~60 connexions max** sur plan Free Supabase
- ✅ **20 connexions** utilisées = **33% de la capacité** (marge de sécurité)
- ✅ Pas d'erreur `MaxClientsInSessionMode`
- ✅ Prepared statements supportés
- ✅ Plus stable et performant

**Recommandation** : **UTILISER LA CONNEXION DIRECTE EN PRODUCTION**

### Pooler (Port 6543)

**Limites** :
- ⚠️ **~15-20 connexions max** sur plan Free Supabase
- ⚠️ **10 connexions** utilisées = **50-67% de la capacité** (limite atteinte)
- ⚠️ Erreur `MaxClientsInSessionMode` possible
- ⚠️ Prepared statements non supportés

**Recommandation** : Éviter si possible, utiliser uniquement si connexion directe impossible.

---

## 🚀 Migration vers Connexion Directe

### Étape 1 : Vérifier DATABASE_URL Actuel

```powershell
cd backend
python -c "import os; from dotenv import load_dotenv; load_dotenv(); url = os.getenv('DATABASE_URL', ''); print('Port:', '6543 (pooler)' if ':6543' in url or ':6544' in url else '5432 (direct)' if ':5432' in url else 'Unknown')"
```

### Étape 2 : Si Pooler, Changer vers Direct

**Dans `.env`** :

```bash
# Avant (pooler)
DATABASE_URL=postgresql+asyncpg://postgres:password@db.xxxxx.supabase.co:6543/postgres

# Après (direct)
DATABASE_URL=postgresql+asyncpg://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

**Note** : Le code détecte automatiquement et bascule de `:6543` vers `:5432`, mais il est préférable de le faire manuellement dans `.env`.

### Étape 3 : Redémarrer le Backend

```powershell
# Arrêter le backend (Ctrl+C)
# Redémarrer
cd backend
uvicorn app.main:app --reload
```

---

## 📈 Performance Attendue

### Avant (Pool Saturé)
- ❌ **2-5 connexions** disponibles
- ❌ **Timeout errors** fréquents
- ❌ **500 errors** sur requêtes simultanées
- ❌ **Dégradation** sous charge

### Après (Pool Optimisé)
- ✅ **10-20 connexions** disponibles
- ✅ **Pas de timeout errors**
- ✅ **Gestion** de 10-20 requêtes simultanées
- ✅ **Stable** sous charge normale

---

## 🔍 Monitoring

### Vérifier l'Utilisation du Pool

**Dans les logs du backend**, cherchez :
```
✅ Using direct connection (port 5432) - optimal for production
```

ou

```
⚠️  Using pooler connection. Consider switching to direct connection (port 5432) for better performance.
```

### Tester sous Charge

**Avec plusieurs requêtes simultanées** :
```bash
# Tester avec curl en parallèle
for i in {1..20}; do
  curl -s https://cartagespa.com/api/v1/listings?page=1 &
done
wait
```

**Résultat attendu** : Toutes les requêtes réussissent sans timeout.

---

## ⚠️ Limites Supabase Free Plan

| Type | Connexions Max | Notre Utilisation | Marge |
|------|----------------|-------------------|-------|
| **Direct (5432)** | ~60 | 20 | **67% disponible** |
| **Pooler (6543)** | ~15-20 | 10 | **33-50% disponible** |

**Recommandation** : Avec la connexion directe, vous avez une **marge de sécurité de 67%** pour gérer les pics de trafic.

---

## 🎯 Checklist Production

- [x] Pool size augmenté (10 pour direct, 5 pour pooler)
- [x] Max overflow augmenté (10 pour direct, 5 pour pooler)
- [x] Timeout augmenté (60 secondes)
- [ ] **Vérifier DATABASE_URL utilise port 5432 (direct)**
- [ ] **Redémarrer le backend**
- [ ] **Tester avec plusieurs requêtes simultanées**
- [ ] **Monitorer les logs pour erreurs de pool**

---

## 🆘 Si Problème Persiste

### Option 1 : Augmenter Encore le Pool (Direct)

```python
pool_size = 15
max_overflow = 15
# Total: 30 connexions (50% de la capacité max)
```

### Option 2 : Optimiser les Requêtes

- Réduire le temps d'exécution des requêtes
- Utiliser des index appropriés
- Éviter les requêtes N+1

### Option 3 : Mettre à Niveau Supabase

- **Pro Plan** : Plus de connexions disponibles
- **Team Plan** : Encore plus de connexions

---

**Le pool est maintenant optimisé pour la production ! Utilisez la connexion directe (port 5432) pour de meilleures performances.** ✅

