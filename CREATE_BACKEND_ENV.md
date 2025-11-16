# 📝 Créer le Fichier `.env` pour le Backend

## 🚨 Problème

**Aucun fichier `.env` trouvé** dans `backend/`.

Le backend utilise les valeurs par défaut de `config.py`, mais pour un meilleur contrôle, il est recommandé de créer un fichier `.env`.

---

## ✅ Solution : Créer `backend/.env`

### ÉTAPE 1 : Créer le Fichier

**Dans PowerShell** :

```powershell
cd backend
New-Item -Path .env -ItemType File
```

**OU créer manuellement** :
- Créer un nouveau fichier nommé `.env` dans le dossier `backend/`

---

### ÉTAPE 2 : Ajouter le Contenu

**Ouvrir `backend/.env` et ajouter** :

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your-jwt-secret

# CORS - Important pour localhost:5173
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000

# Debug
DEBUG=true
```

---

### ÉTAPE 3 : Remplacer les Valeurs

**Remplacez** :
- `DATABASE_URL` : Votre URL de connexion Supabase
- `SUPABASE_URL` : Votre URL Supabase
- `SUPABASE_ANON_KEY` : Votre clé anonyme Supabase
- `SUPABASE_JWT_SECRET` : Votre secret JWT Supabase

**Gardez** :
- `CORS_ORIGINS` : Inclut déjà `http://localhost:5173` ✅
- `DEBUG=true` : Pour le développement local

---

## 🔍 Où Trouver les Valeurs

### DATABASE_URL

**Dans Supabase Dashboard** :
1. Aller dans **Settings** → **Database**
2. Trouver **Connection string**
3. Utiliser le format : `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`
4. **OU** utiliser le pooler : `postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres`

### SUPABASE_URL

**Dans Supabase Dashboard** :
1. Aller dans **Settings** → **API**
2. Trouver **Project URL**
3. Exemple : `https://xxxxx.supabase.co`

### SUPABASE_ANON_KEY

**Dans Supabase Dashboard** :
1. Aller dans **Settings** → **API**
2. Trouver **anon public** key
3. Exemple : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### SUPABASE_JWT_SECRET

**Dans Supabase Dashboard** :
1. Aller dans **Settings** → **API**
2. Trouver **JWT Secret**
3. Copier la valeur

---

## ✅ Vérification

### Vérifier que le Fichier Existe

```powershell
cd backend
Test-Path .env
```

**Résultat attendu** : `True`

### Vérifier le Contenu

```powershell
cd backend
Get-Content .env
```

**Vérifier** :
- ✅ `CORS_ORIGINS` inclut `http://localhost:5173`
- ✅ Toutes les variables Supabase sont remplies
- ✅ `DATABASE_URL` est correct

---

## 🚀 Après Création

**Redémarrer le backend** :

```powershell
cd backend
uvicorn app.main:app --reload
```

**Tester** :
- Ouvrir `http://localhost:5173`
- Vérifier la console (F12)
- Pas d'erreurs CORS ✅

---

## 📋 Checklist

- [ ] Fichier `backend/.env` créé
- [ ] `CORS_ORIGINS` inclut `http://localhost:5173`
- [ ] Variables Supabase remplies
- [ ] `DATABASE_URL` correct
- [ ] Backend redémarré
- [ ] Test effectué (pas d'erreurs CORS)

---

## 🎯 Action Immédiate

**1. Créer le fichier** :

```powershell
cd backend
New-Item -Path .env -ItemType File
```

**2. Ajouter le contenu** (voir ÉTAPE 2)

**3. Remplacer les valeurs** (voir ÉTAPE 3)

**4. Redémarrer le backend** :

```powershell
uvicorn app.main:app --reload
```

---

**Note** : Si vous ne créez pas de fichier `.env`, le backend utilisera les valeurs par défaut de `config.py`, qui incluent déjà `http://localhost:5173` dans `CORS_ORIGINS`. Mais créer un fichier `.env` explicite est recommandé pour un meilleur contrôle.

