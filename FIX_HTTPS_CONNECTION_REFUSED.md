# 🔧 Corriger ERR_CONNECTION_REFUSED (HTTPS au lieu de HTTP)

## 🐛 Problème

Le frontend essaie d'accéder à `https://cartagespa.com/api/v1/listings` mais le site est en **HTTP**, pas HTTPS.

**Erreur** :
```
GET https://cartagespa.com/api/v1/listings?page=1&page_size=20 net::ERR_CONNECTION_REFUSED
```

**Cause** : Le frontend a été build avec `VITE_API_URL` pointant vers `https://` au lieu de `http://`.

---

## ✅ Solution

### ÉTAPE 1 : Vérifier VITE_API_URL dans `.env`

**Sur le serveur (via SSH)** :

```bash
cd "/root/site Web"
cat .env | grep VITE_API_URL
```

**Devrait afficher** :
```
VITE_API_URL=http://cartagespa.com/api/v1
```

**Si la variable est manquante ou utilise `https://`**, continuez à l'étape 2.

---

### ÉTAPE 2 : Corriger VITE_API_URL dans `.env`

**Éditez le fichier `.env`** :

```bash
nano .env
```

**Ajoutez ou modifiez** :
```bash
VITE_API_URL=http://cartagespa.com/api/v1
```

**Important** :
- ✅ Utilisez `http://` (pas `https://`)
- ✅ Incluez `/api/v1` à la fin
- ✅ Pas de slash final

**Sauvegardez** : `Ctrl+O`, `Enter`, `Ctrl+X`

---

### ÉTAPE 3 : Vérifier docker-compose.yml

**Vérifiez que `docker-compose.yml` utilise bien la variable** :

```bash
cat docker-compose.yml | grep VITE_API_URL
```

**Devrait afficher** :
```yaml
- VITE_API_URL=${VITE_API_URL:-http://cartagespa.com/api/v1}
```

**Si la valeur par défaut utilise `https://`**, modifiez-la :

```yaml
- VITE_API_URL=${VITE_API_URL:-http://cartagespa.com/api/v1}
```

---

### ÉTAPE 4 : Rebuild le Frontend

**IMPORTANT** : Les variables `VITE_*` sont intégrées au build. Vous **devez** rebuild le frontend après modification.

```bash
cd "/root/site Web"

# Rebuild le frontend avec les nouvelles variables
docker compose build --no-cache frontend
```

**Temps estimé** : 2-5 minutes

---

### ÉTAPE 5 : Redémarrer les Services

```bash
# Arrêter tous les services
docker compose down

# Redémarrer tous les services
docker compose up -d
```

---

### ÉTAPE 6 : Vérifier dans le Navigateur

**Dans la console du navigateur** (F12) :

```javascript
// Vérifier la variable
console.log(import.meta.env.VITE_API_URL)
```

**Devrait afficher** :
```
http://cartagespa.com/api/v1
```

**Si `undefined` ou `https://`** :
- Le frontend n'a pas été rebuild
- Rebuild : `docker compose build --no-cache frontend`

---

### ÉTAPE 7 : Vérifier les Requêtes

**Dans la console du navigateur** (F12) → Network :

1. **Rechargez la page**
2. **Cherchez les requêtes** vers `/api/v1/...`
3. **Vérifiez** :
   - ✅ URL : `http://cartagespa.com/api/v1/...` (pas `https://`)
   - ✅ Status : `200 OK`
   - ✅ Pas d'erreurs `ERR_CONNECTION_REFUSED`

---

## 🔍 Vérifications Détaillées

### Vérifier le Fichier `.env` Complet

```bash
cat .env
```

**Devrait contenir** :
```bash
# API URL (Frontend - VITE_ prefix)
VITE_API_URL=http://cartagespa.com/api/v1
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# CORS
CORS_ORIGINS=http://cartagespa.com,http://www.cartagespa.com,http://localhost:5173
```

---

### Vérifier le docker-compose.yml

**Le `docker-compose.yml` doit avoir** :

```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile
    args:
      - VITE_API_URL=${VITE_API_URL:-http://cartagespa.com/api/v1}
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
```

---

### Vérifier le Frontend Dockerfile

**Le `frontend/Dockerfile` doit avoir** :

```dockerfile
# Build arguments for Vite environment variables
ARG VITE_API_URL
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Build the application
RUN npx vite build
```

---

## 🐛 Problèmes Courants

### Problème 1 : VITE_API_URL Utilise HTTPS

**Symptôme** : `ERR_CONNECTION_REFUSED` même après rebuild.

**Solution** :
1. Vérifiez que `VITE_API_URL` utilise `http://` dans `.env`
2. Vérifiez que la valeur par défaut dans `docker-compose.yml` utilise `http://`
3. Rebuild : `docker compose build --no-cache frontend`

---

### Problème 2 : Frontend Non Rebuild

**Symptôme** : Les requêtes utilisent encore `https://` après modification.

**Solution** :
1. **Rebuild est obligatoire** pour les variables `VITE_*`
2. Rebuild : `docker compose build --no-cache frontend`
3. Redémarrez : `docker compose down && docker compose up -d`

---

### Problème 3 : Cache du Navigateur

**Symptôme** : Les anciennes requêtes HTTPS persistent.

**Solution** :
1. Videz le cache du navigateur (Ctrl+Shift+Delete)
2. Testez en navigation privée (Ctrl+Shift+N)
3. Hard refresh : Ctrl+Shift+R

---

### Problème 4 : VITE_API_URL Non Défini

**Symptôme** : `import.meta.env.VITE_API_URL` est `undefined`.

**Solution** :
1. Vérifiez que `VITE_API_URL` est dans `.env`
2. Vérifiez que `docker-compose.yml` passe la variable au build
3. Rebuild : `docker compose build --no-cache frontend`

---

## ✅ Checklist

- [ ] `VITE_API_URL` défini dans `.env` avec `http://cartagespa.com/api/v1`
- [ ] `VITE_API_URL` utilise `http://` (pas `https://`)
- [ ] `docker-compose.yml` utilise `${VITE_API_URL:-http://cartagespa.com/api/v1}`
- [ ] Frontend rebuild : `docker compose build --no-cache frontend`
- [ ] Services redémarrés : `docker compose down && docker compose up -d`
- [ ] Variable vérifiée dans le navigateur : `console.log(import.meta.env.VITE_API_URL)`
- [ ] Requêtes utilisent `http://` (pas `https://`)
- [ ] Pas d'erreurs `ERR_CONNECTION_REFUSED`

---

## 🎯 Commandes Rapides

```bash
# Vérifier VITE_API_URL
cat .env | grep VITE_API_URL

# Éditer .env
nano .env

# Rebuild le frontend
docker compose build --no-cache frontend

# Redémarrer
docker compose down
docker compose up -d

# Vérifier les logs
docker compose logs frontend
```

---

## 📝 Notes

- **Les variables VITE sont intégrées au build** : elles doivent être passées au moment du build, pas au runtime
- **Rebuild obligatoire** après chaque modification de `VITE_API_URL`
- **Utilisez `http://` maintenant**, changez pour `https://` plus tard (après configuration SSL)

---

## 🆘 Si Rien Ne Fonctionne

1. **Vérifiez tous les fichiers** :
   ```bash
   cat .env | grep VITE_API_URL
   cat docker-compose.yml | grep VITE_API_URL
   cat frontend/Dockerfile | grep VITE_API_URL
   ```

2. **Vérifiez dans le navigateur** :
   ```javascript
   console.log(import.meta.env.VITE_API_URL)
   ```

3. **Rebuild complet** :
   ```bash
   docker compose down
   docker compose build --no-cache
   docker compose up -d
   ```

4. **Vérifiez les logs** :
   ```bash
   docker compose logs frontend
   ```

---

## 🎉 Une Fois Corrigé

Une fois que `VITE_API_URL` pointe vers `http://cartagespa.com/api/v1` :

- ✅ Les requêtes API fonctionnent
- ✅ Pas d'erreurs `ERR_CONNECTION_REFUSED`
- ✅ Les données se chargent correctement

**Plus tard** (après configuration HTTPS) :
- Changez `VITE_API_URL` pour `https://cartagespa.com/api/v1`
- Rebuild le frontend
- Redémarrez les services

