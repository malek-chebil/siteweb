# 🔧 Fix : Format DATABASE_URL Incorrect

## 🚨 Problème

**URL actuelle** :
```
postgresql+asyncpg://krwgasvnflb:password@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
```

**Problème** :
- ❌ Utilise le hostname du **pooler** (`pooler.supabase.com`) avec le port **5432** (direct)
- ❌ Format incorrect : le pooler utilise les ports 6543/6544, pas 5432
- ❌ La connexion directe nécessite un hostname différent

---

## ✅ Solution

### Option 1 : Connexion Directe (RECOMMANDÉ pour Production)

**Format correct** :
```
postgresql+asyncpg://postgres.krwgasvnflb:password@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
```

**OU** (si disponible) :
```
postgresql+asyncpg://postgres:password@db.krwgasvnflb.supabase.co:5432/postgres
```

**Où trouver** :
1. Aller dans **Supabase Dashboard** → **Settings** → **Database**
2. Chercher **Connection string** → **Direct connection** (pas pooler)
3. Copier l'URL avec le port **5432**

### Option 2 : Pooler (Si Direct Non Disponible)

**Format correct** :
```
postgresql+asyncpg://postgres.krwgasvnflb:password@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
```

**Note** : Port **6543** (pooler), pas 5432

---

## 🔍 Comment Trouver la Bonne URL

### Méthode 1 : Supabase Dashboard

1. Aller sur [supabase.com](https://supabase.com)
2. Sélectionner votre projet
3. **Settings** → **Database**
4. Chercher **Connection string**
5. Choisir **Direct connection** (port 5432) ou **Session pooler** (port 6543)

### Méthode 2 : Format Standard

**Connexion Directe** :
```
postgresql+asyncpg://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

**Pooler** :
```
postgresql+asyncpg://postgres.[PROJECT_REF]:[PASSWORD]@aws-1-[REGION].pooler.supabase.com:6543/postgres
```

**Où** :
- `[PROJECT_REF]` = `krwgasvnflb` (dans votre cas)
- `[PASSWORD]` = Votre mot de passe de base de données
- `[REGION]` = `eu-west-1` (dans votre cas)

---

## 🔧 Correction Immédiate

### Étape 1 : Vérifier dans Supabase Dashboard

1. Ouvrir **Supabase Dashboard**
2. **Settings** → **Database**
3. Copier la **Connection string** complète

### Étape 2 : Mettre à Jour `.env`

**Dans `backend/.env`** :

```bash
# Connexion Directe (RECOMMANDÉ)
DATABASE_URL=postgresql+asyncpg://postgres.krwgasvnflb:VOTRE_PASSWORD@aws-0-eu-west-1.pooler.supabase.com:5432/postgres

# OU Pooler (si direct non disponible)
DATABASE_URL=postgresql+asyncpg://postgres.krwgasvnflb:VOTRE_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
```

**Important** :
- ✅ Utiliser `postgres.krwgasvnflb` (pas juste `krwgasvnflb`)
- ✅ Port **5432** pour direct, **6543** pour pooler
- ✅ Hostname peut être `aws-0-` (direct) ou `aws-1-` (pooler)

### Étape 3 : Redémarrer le Backend

```powershell
cd backend
# Arrêter (Ctrl+C)
# Redémarrer
uvicorn app.main:app --reload
```

---

## 📋 Vérification

### Vérifier le Format

```powershell
cd backend
python -c "import os; from dotenv import load_dotenv; load_dotenv(); url = os.getenv('DATABASE_URL', ''); print('URL:', url[:80] + '...' if len(url) > 80 else url); print('Port:', '5432 (direct)' if ':5432' in url else '6543 (pooler)' if ':6543' in url else 'Unknown')"
```

### Vérifier la Connexion

```powershell
cd backend
python test_db_timeout.py
```

---

## ⚠️ Erreurs Communes

### ❌ Erreur 1 : Hostname Pooler + Port 5432
```
aws-1-eu-west-1.pooler.supabase.com:5432
```
**Problème** : Le pooler n'utilise pas le port 5432

### ❌ Erreur 2 : Username Incorrect
```
krwgasvnflb:password@...
```
**Problème** : Devrait être `postgres.krwgasvnflb:password@...`

### ✅ Format Correct
```
postgres.krwgasvnflb:password@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
```

---

## 🎯 Recommandation

**Utiliser la connexion directe (port 5432)** pour :
- ✅ Plus de connexions disponibles (20 vs 10)
- ✅ Meilleures performances
- ✅ Pas d'erreur `MaxClientsInSessionMode`
- ✅ Optimisé pour la production

**Format recommandé** :
```
postgresql+asyncpg://postgres.krwgasvnflb:VOTRE_PASSWORD@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
```

---

**Corrigez le format de DATABASE_URL dans backend/.env et redémarrez le backend !** ✅

