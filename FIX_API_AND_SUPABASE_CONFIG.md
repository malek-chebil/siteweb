# 🔧 Corriger les API et la Configuration Supabase

## 🔍 Problèmes Identifiés

1. **401 Unauthorized sur les API** : Les variables d'environnement pointent vers `localhost`
2. **Google Auth redirige vers localhost** : Configuration Supabase à mettre à jour

---

## ✅ SOLUTION 1 : Corriger les Variables d'Environnement

### Sur le Serveur

Vérifiez et modifiez le fichier `.env` :

```bash
# Sur le serveur
cd /root/site\ Web
nano .env
```

### Variables à Vérifier

```bash
# Backend API URL (pour le frontend)
VITE_API_URL=http://cartagespa.com/api/v1

# OU si vous préférez utiliser l'IP directement
# VITE_API_URL=http://89.147.111.166/api/v1

# Supabase (déjà configuré normalement)
VITE_SUPABASE_URL=https://cvtrghsdfkrwgasvnflb.supabase.co
VITE_SUPABASE_ANON_KEY=<votre-clé>
```

### Rebuild le Frontend

Après avoir modifié les variables :

```bash
# Rebuild le frontend avec les nouvelles variables
docker compose build frontend

# Redémarrer
docker compose restart frontend
```

---

## ✅ SOLUTION 2 : Configurer les Redirect URLs dans Supabase

### Dans le Dashboard Supabase

1. **Connectez-vous** à https://supabase.com
2. **Sélectionnez votre projet** : `cvtrghsdfkrwgasvnflb`
3. **Allez dans** : Authentication → URL Configuration
4. **Ajoutez les URLs suivantes** :

#### Site URL
```
http://cartagespa.com
```

#### Redirect URLs
```
http://cartagespa.com/auth/callback
http://cartagespa.com/**
http://www.cartagespa.com/auth/callback
http://www.cartagespa.com/**
```

**OU** si vous voulez aussi permettre l'IP (moins sécurisé) :
```
http://89.147.111.166/auth/callback
http://89.147.111.166/**
```

### Sauvegarder

Cliquez sur **"Save"** après avoir ajouté les URLs.

---

## ✅ SOLUTION 3 : Vérifier le Code Frontend

### Le Code Utilise Déjà `window.location.origin`

Dans `AuthContext.jsx`, le code utilise déjà :
```javascript
redirectTo: `${window.location.origin}/auth/callback`
```

**C'est correct** - il utilisera automatiquement le bon domaine.

**Le problème** est que Supabase doit avoir cette URL dans sa liste de redirect URLs autorisées.

---

## ✅ SOLUTION 4 : Mettre à Jour docker-compose.yml

### J'ai Déjà Corrigé

Le fichier `docker-compose.yml` a été mis à jour pour utiliser :
```yaml
VITE_API_URL=${VITE_API_URL:-http://cartagespa.com/api/v1}
```

**Au lieu de** :
```yaml
VITE_API_URL=${VITE_API_URL:-http://localhost:8000/api/v1}
```

---

## 🔧 Actions à Faire

### 1. Sur le Serveur - Vérifier/Mettre à Jour .env

```bash
cd /root/site\ Web

# Voir le contenu actuel
cat .env | grep VITE

# Modifier si nécessaire
nano .env
```

**Assurez-vous que** :
```bash
VITE_API_URL=http://cartagespa.com/api/v1
VITE_SUPABASE_URL=https://cvtrghsdfkrwgasvnflb.supabase.co
VITE_SUPABASE_ANON_KEY=<votre-clé>
```

### 2. Rebuild le Frontend

```bash
# Rebuild avec les nouvelles variables
docker compose build frontend

# Redémarrer
docker compose restart frontend

# Vérifier les logs
docker compose logs frontend
```

### 3. Dans Supabase Dashboard

1. Allez dans **Authentication → URL Configuration**
2. **Site URL** : `http://cartagespa.com`
3. **Redirect URLs** : Ajoutez toutes les URLs listées ci-dessus
4. **Save**

### 4. Tester

```bash
# Test 1: API
curl http://cartagespa.com/api/v1/listings

# Test 2: Dans le navigateur
# - Aller sur http://cartagespa.com
# - Essayer de se connecter
# - Essayer Google Auth
```

---

## 🐛 Dépannage

### Les API Retournent Toujours 401

1. **Vérifiez les variables d'environnement** :
   ```bash
   docker compose exec frontend env | grep VITE
   ```

2. **Vérifiez que le frontend a été rebuild** :
   ```bash
   docker compose build --no-cache frontend
   ```

3. **Vérifiez les logs du frontend** :
   ```bash
   docker compose logs frontend
   ```

### Google Auth Redirige Toujours vers localhost

1. **Vérifiez la configuration Supabase** :
   - Les redirect URLs sont-elles bien configurées ?
   - Le Site URL est-il `http://cartagespa.com` ?

2. **Videz le cache du navigateur** :
   - Ctrl+Shift+Delete
   - Vider le cache et les cookies

3. **Vérifiez dans la console du navigateur** :
   - Ouvrez F12 → Console
   - Regardez les erreurs

---

## 📝 Notes Importantes

1. **Les variables VITE_*** sont compilées dans le build**
   - Il faut **rebuild** le frontend après modification
   - Les changements dans `.env` ne prennent effet qu'après rebuild

2. **Supabase vérifie les redirect URLs**
   - Toutes les URLs de redirection doivent être dans la liste Supabase
   - Sinon, Supabase refuse la redirection

3. **HTTPS recommandé**
   - Une fois SSL configuré, changez les URLs pour `https://`
   - Mettez à jour Supabase avec les URLs HTTPS

---

## ✅ Checklist

- [ ] Variables d'environnement mises à jour dans `.env`
- [ ] `docker-compose.yml` utilise `http://cartagespa.com/api/v1`
- [ ] Frontend rebuild avec les nouvelles variables
- [ ] Supabase Site URL configuré : `http://cartagespa.com`
- [ ] Supabase Redirect URLs configurées
- [ ] Testé la connexion
- [ ] Testé Google Auth

---

## 🎯 Après Correction

Une fois corrigé, vous devriez pouvoir :
- ✅ Vous connecter avec email/password
- ✅ Vous connecter avec Google
- ✅ Utiliser toutes les API
- ✅ Upload d'images fonctionne

