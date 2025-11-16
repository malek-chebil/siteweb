# 🔧 Fix : CORS pour localhost:5173

## 🚨 Problème

**Erreur CORS** : Les requêtes depuis `http://localhost:5173` sont bloquées par CORS.

**Cause** : `CORS_ORIGINS` ne contient pas `http://localhost:5173` ou le backend n'a pas été redémarré après modification.

---

## ✅ Solution : Vérifier et Corriger CORS_ORIGINS

### ÉTAPE 1 : Vérifier la Configuration Actuelle

**Dans `backend/.env` (si existe)** :

```powershell
cd backend
cat .env | findstr CORS_ORIGINS
```

**OU vérifier dans le code** :

Le fichier `backend/app/config.py` a une valeur par défaut :
```python
CORS_ORIGINS: str = "http://localhost:5173,http://localhost:5174,http://localhost:3000"
```

**✅ Le port 5173 est déjà inclus par défaut !**

---

### ÉTAPE 2 : Vérifier si `.env` Surcharge la Valeur

**Si vous avez un fichier `backend/.env`** :

1. **Vérifier le contenu** :
   ```powershell
   cd backend
   type .env
   ```

2. **Si `CORS_ORIGINS` existe** :
   - Vérifier qu'il inclut `http://localhost:5173`
   - Si non, ajouter ou modifier

3. **Si `CORS_ORIGINS` n'existe pas** :
   - La valeur par défaut sera utilisée (qui inclut déjà 5173)
   - OU ajouter explicitement dans `.env`

---

### ÉTAPE 3 : Ajouter/Corriger dans `.env`

**Créer ou modifier `backend/.env`** :

```env
# CORS - Include localhost:5173
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

**OU si vous avez d'autres origines** :

```env
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000,https://cartagespa.com
```

---

### ÉTAPE 4 : Redémarrer le Backend

**Important** : Le backend doit être redémarré pour prendre en compte les changements.

```powershell
# Arrêter le serveur (Ctrl+C)
# Redémarrer
cd backend
uvicorn app.main:app --reload
```

---

## 🔍 Vérification

### Test 1 : Vérifier les Origines CORS dans le Backend

**Créer un script de test** `test_cors.py` :

```python
from app.config import settings

print("CORS Origins:")
for origin in settings.cors_origins_list:
    print(f"  - {origin}")

print(f"\nTotal: {len(settings.cors_origins_list)} origins")
```

**Exécuter** :

```powershell
cd backend
python test_cors.py
```

**Résultat attendu** :
```
CORS Origins:
  - http://localhost:5173
  - http://localhost:5174
  - http://localhost:3000

Total: 3 origins
```

### Test 2 : Tester depuis le Navigateur

1. **Ouvrir** : `http://localhost:5173`
2. **Ouvrir la console** (F12)
3. **Vérifier les erreurs CORS** :
   - Si vous voyez `Access to XMLHttpRequest has been blocked by CORS policy` → CORS n'est pas configuré
   - Si pas d'erreur CORS → CORS fonctionne ✅

### Test 3 : Tester avec curl

```powershell
# Tester une requête avec l'origine localhost:5173
curl -H "Origin: http://localhost:5173" -H "Access-Control-Request-Method: GET" -X OPTIONS http://localhost:8000/api/v1/listings -v
```

**Vérifier les headers de réponse** :
- `Access-Control-Allow-Origin: http://localhost:5173` ✅
- `Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS` ✅

---

## 🆘 Dépannage

### Problème 1 : CORS_ORIGINS dans `.env` mais Pas Pris en Compte

**Solution** :
1. Vérifier que le fichier `.env` est dans `backend/` (pas à la racine)
2. Vérifier qu'il n'y a pas d'espaces après les virgules
3. Redémarrer le backend

### Problème 2 : Backend Utilise une Ancienne Configuration

**Solution** :
1. Arrêter complètement le backend (Ctrl+C)
2. Vérifier qu'aucun processus n'utilise le port 8000 :
   ```powershell
   netstat -ano | findstr :8000
   ```
3. Redémarrer le backend

### Problème 3 : Erreur CORS Persiste

**Solution** :
1. Vérifier que le frontend utilise bien `http://localhost:5173` (pas `https://`)
2. Vérifier que `VITE_API_URL` dans `frontend/.env` pointe vers `http://localhost:8000/api/v1`
3. Vider le cache du navigateur (Ctrl+Shift+Delete)

---

## 📋 Checklist

- [ ] `CORS_ORIGINS` vérifié dans `backend/.env` (ou valeur par défaut)
- [ ] `http://localhost:5173` inclus dans `CORS_ORIGINS`
- [ ] Backend redémarré après modification
- [ ] Test CORS effectué (console navigateur)
- [ ] Pas d'erreurs CORS dans la console

---

## 🎯 Action Immédiate

**1. Vérifier la configuration** :

```powershell
cd backend
type .env
```

**2. Si `CORS_ORIGINS` n'existe pas ou ne contient pas 5173** :

Ajouter dans `backend/.env` :
```env
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

**3. Redémarrer le backend** :

```powershell
# Arrêter (Ctrl+C) et redémarrer
uvicorn app.main:app --reload
```

**4. Tester** :

- Ouvrir `http://localhost:5173`
- Vérifier la console (F12)
- Pas d'erreurs CORS ✅

---

**Note** : La valeur par défaut dans `config.py` inclut déjà `http://localhost:5173`, donc si vous n'avez pas de fichier `.env` ou si `CORS_ORIGINS` n'est pas défini, cela devrait fonctionner. Assurez-vous simplement que le backend est redémarré !

