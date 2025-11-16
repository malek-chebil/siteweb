# 🔧 Corriger l'Erreur "Invalid API key" Supabase

## 🐛 Problème

Erreur lors de la connexion avec Google :
```json
{
    "message": "Invalid API key",
    "hint": "Double check your Supabase `anon` or `service_role` API key."
}
```

**Cause** : Les variables d'environnement Supabase ne sont pas correctement passées au build du frontend.

---

## ✅ Solution

### ÉTAPE 1 : Vérifier le Fichier `.env` sur le Serveur

**Sur le serveur (via SSH)** :

```bash
cd "/root/site Web"
cat .env | grep SUPABASE
```

**Devrait afficher** :
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Si les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont manquantes**, ajoutez-les.

---

### ÉTAPE 2 : Ajouter les Variables Manquantes

**Si les variables sont manquantes**, éditez le fichier `.env` :

```bash
nano .env
```

**Ajoutez ou modifiez** :
```bash
# Supabase (pour le frontend - VITE_ prefix)
VITE_SUPABASE_URL=https://votre-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.votre-cle-anon

# Supabase (pour le backend)
SUPABASE_URL=https://votre-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.votre-cle-anon
SUPABASE_JWT_SECRET=votre-jwt-secret
```

**Pour trouver vos clés Supabase** :
1. Allez dans Supabase Dashboard
2. Settings → API
3. Copiez :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
   - **JWT Secret** → `SUPABASE_JWT_SECRET`

**Sauvegardez** : `Ctrl+O`, `Enter`, `Ctrl+X`

---

### ÉTAPE 3 : Vérifier le Format des Variables

**Important** : Les variables doivent être **sans guillemets** et **sans espaces** :

❌ **Mauvais** :
```bash
VITE_SUPABASE_URL="https://xxxxx.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

✅ **Bon** :
```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### ÉTAPE 4 : Rebuild le Frontend

**Après avoir ajouté/modifié les variables**, rebuild le frontend :

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

### ÉTAPE 6 : Vérifier que les Variables Sont Passées

**Vérifier dans les logs du build** :

```bash
docker compose logs frontend | grep -i supabase
```

**OU vérifier dans le conteneur** :

```bash
# Entrer dans le conteneur frontend
docker compose exec frontend sh

# Vérifier les variables (si elles sont encore disponibles)
env | grep VITE
```

**Note** : Les variables VITE sont intégrées au build, donc elles ne seront pas visibles dans `env` après le build. Elles sont dans le code JavaScript compilé.

---

### ÉTAPE 7 : Vérifier dans le Navigateur

**Dans la console du navigateur** (F12) :

```javascript
// Vérifier les variables
console.log(import.meta.env.VITE_SUPABASE_URL)
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
```

**Devrait afficher** :
- `VITE_SUPABASE_URL` : Votre URL Supabase
- `VITE_SUPABASE_ANON_KEY` : Votre clé anon (commence par `eyJ...`)

**Si `undefined`** :
- Les variables n'ont pas été passées au build
- Rebuild le frontend : `docker compose build --no-cache frontend`

---

## 🔍 Vérifications Détaillées

### Vérifier le Fichier `.env` Complet

```bash
cat .env
```

**Devrait contenir** :
```bash
# Database
DATABASE_URL=postgresql://...

# Supabase (Frontend - VITE_ prefix)
VITE_API_URL=http://cartagespa.com/api/v1
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase (Backend)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=...

# CORS
CORS_ORIGINS=http://cartagespa.com,http://localhost:5173
```

---

### Vérifier le Dockerfile Frontend

Le `frontend/Dockerfile` doit avoir :

```dockerfile
# Build arguments for Vite environment variables
ARG VITE_API_URL
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
```

**Vérifiez** que le Dockerfile contient bien ces lignes.

---

### Vérifier le docker-compose.yml

Le `docker-compose.yml` doit avoir :

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

**Vérifiez** que ces `args` sont présents.

---

## 🐛 Problèmes Courants

### Problème 1 : Variables Non Définies dans `.env`

**Symptôme** : `VITE_SUPABASE_URL` ou `VITE_SUPABASE_ANON_KEY` sont `undefined` dans le navigateur.

**Solution** :
1. Vérifiez que les variables sont dans `.env`
2. Vérifiez qu'elles n'ont pas de guillemets
3. Rebuild : `docker compose build --no-cache frontend`

---

### Problème 2 : Variables avec Guillemets

**Symptôme** : Les variables sont définies mais Supabase retourne "Invalid API key".

**Solution** :
1. Retirez les guillemets dans `.env`
2. Rebuild : `docker compose build --no-cache frontend`

---

### Problème 3 : Mauvaises Clés

**Symptôme** : "Invalid API key" même après rebuild.

**Solution** :
1. Vérifiez que vous utilisez la clé **anon public** (pas service_role)
2. Vérifiez que la clé est complète (commence par `eyJ...`)
3. Copiez-collez directement depuis Supabase Dashboard

---

### Problème 4 : Cache du Navigateur

**Symptôme** : Les anciennes variables sont encore utilisées.

**Solution** :
1. Videz le cache du navigateur (Ctrl+Shift+Delete)
2. Testez en navigation privée
3. Hard refresh : Ctrl+Shift+R

---

## ✅ Checklist

- [ ] Variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans `.env`
- [ ] Variables sans guillemets
- [ ] Variables avec les bonnes valeurs (depuis Supabase Dashboard)
- [ ] Frontend rebuild : `docker compose build --no-cache frontend`
- [ ] Services redémarrés : `docker compose up -d`
- [ ] Variables visibles dans la console navigateur
- [ ] Google Auth fonctionne

---

## 🎯 Commandes Rapides

```bash
# Vérifier les variables
cd "/root/site Web"
cat .env | grep VITE_SUPABASE

# Éditer le fichier .env
nano .env

# Rebuild et redémarrer
docker compose build --no-cache frontend
docker compose down
docker compose up -d

# Vérifier les logs
docker compose logs frontend
```

---

## 📝 Notes

- **Les variables VITE sont intégrées au build** : elles doivent être passées au moment du build, pas au runtime
- **Le préfixe `VITE_` est obligatoire** pour que Vite les inclue dans le build
- **Pas de guillemets** dans `.env` pour les valeurs
- **Rebuild nécessaire** après chaque modification des variables VITE

---

## 🆘 Si Rien Ne Fonctionne

1. **Vérifiez tous les fichiers** :
   ```bash
   cat .env
   cat docker-compose.yml | grep -A 5 frontend
   cat frontend/Dockerfile | grep VITE
   ```

2. **Vérifiez dans Supabase Dashboard** :
   - Settings → API
   - Copiez les valeurs exactes
   - Vérifiez qu'elles sont correctes

3. **Rebuild complet** :
   ```bash
   docker compose down
   docker compose build --no-cache
   docker compose up -d
   ```

4. **Vérifiez les logs** :
   ```bash
   docker compose logs -f
   ```

