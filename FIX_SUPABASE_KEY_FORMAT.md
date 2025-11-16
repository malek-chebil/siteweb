# 🔧 Corriger le Format de la Clé Supabase

## 🐛 Problème Détecté

La clé `VITE_SUPABASE_ANON_KEY` dans votre `.env` est **mal formatée** :

**Actuel (incorrect)** :
```
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2dHJnaHNkZmtyd2dhc3ZuZmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Mjc3NDQsImV4cCI6MjA3ODIwMzc0NH0.EKRO_aOfDQs9EiuSyiJvl-n4n4_6zncokZJ1d4GpqiU1~eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2dHJnaHNkZmtyd2dhc3ZuZmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Mjc3NDQsImV4cCI6MjA3ODIwMzc0NH0.EKRO_aOfDQs9EiuSyiJvl-n4n4_6zncokZJ1d4GpqiU
```

**Problèmes** :
- ❌ Contient un caractère `~` (tild)
- ❌ Semble être dupliquée (deux clés collées ensemble)
- ❌ Contient un `1` avant le `~`

---

## ✅ Solution

### ÉTAPE 1 : Corriger la Clé dans `.env`

**Sur le serveur (via SSH)** :

```bash
cd "/root/site Web"
nano .env
```

**Trouvez la ligne** :
```bash
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2dHJnaHNkZmtyd2dhc3ZuZmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Mjc3NDQsImV4cCI6MjA3ODIwMzc0NH0.EKRO_aOfDQs9EiuSyiJvl-n4n4_6zncokZJ1d4GpqiU1~eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2dHJnaHNkZmtyd2dhc3ZuZmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Mjc3NDQsImV4cCI6MjA3ODIwMzc0NH0.EKRO_aOfDQs9EiuSyiJvl-n4n4_6zncokZJ1d4GpqiU
```

**Remplacez par** (première partie seulement, sans le `1~` et sans la duplication) :
```bash
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2dHJnaHNkZmtyd2dhc3ZuZmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Mjc3NDQsImV4cCI6MjA3ODIwMzc0NH0.EKRO_aOfDQs9EiuSyiJvl-n4n4_6zncokZJ1d4GpqiU
```

**OU** mieux encore, **copiez directement depuis Supabase Dashboard** :

1. Allez dans Supabase Dashboard
2. Settings → API
3. Copiez la clé **anon public** (sans espaces, sans caractères spéciaux)
4. Collez-la dans `.env`

**Sauvegardez** : `Ctrl+O`, `Enter`, `Ctrl+X`

---

### ÉTAPE 2 : Vérifier le Format

**Vérifiez que la clé est correcte** :

```bash
cat .env | grep VITE_SUPABASE_ANON_KEY
```

**Devrait afficher** :
```
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2dHJnaHNkZmtyd2dhc3ZuZmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Mjc3NDQsImV4cCI6MjA3ODIwMzc0NH0.EKRO_aOfDQs9EiuSyiJvl-n4n4_6zncokZJ1d4GpqiU
```

**Vérifiez** :
- ✅ Pas de caractère `~`
- ✅ Pas de duplication
- ✅ Pas de `1` avant le `~`
- ✅ Commence par `eyJ...`
- ✅ Une seule ligne continue

---

### ÉTAPE 3 : Rebuild le Frontend

**Après avoir corrigé la clé**, rebuild le frontend :

```bash
cd "/root/site Web"
docker compose build --no-cache frontend
```

**Temps estimé** : 2-5 minutes

---

### ÉTAPE 4 : Redémarrer les Services

```bash
docker compose down
docker compose up -d
```

---

### ÉTAPE 5 : Vérifier dans le Navigateur

**Dans la console du navigateur** (F12) :

```javascript
// Vérifier la clé
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
```

**Devrait afficher** :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2dHJnaHNkZmtyd2dhc3ZuZmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Mjc3NDQsImV4cCI6MjA3ODIwMzc0NH0.EKRO_aOfDQs9EiuSyiJvl-n4n4_6zncokZJ1d4GpqiU
```

**Si `undefined` ou contient `~`** :
- La clé n'a pas été correctement passée au build
- Rebuild : `docker compose build --no-cache frontend`

---

## 🔍 Comment Obtenir la Bonne Clé

### Méthode 1 : Depuis Supabase Dashboard (Recommandé)

1. **Allez dans** Supabase Dashboard
2. **Cliquez sur** Settings (icône engrenage)
3. **Cliquez sur** API
4. **Trouvez** la section "Project API keys"
5. **Copiez** la clé **anon public** (pas service_role)
6. **Collez** dans `.env` (sans espaces, sans guillemets)

---

### Méthode 2 : Utiliser sed pour Corriger Automatiquement

**Sur le serveur** :

```bash
cd "/root/site Web"

# Sauvegarder le fichier
cp .env .env.backup

# Corriger la clé (prendre la première partie avant le ~)
sed -i 's/VITE_SUPABASE_ANON_KEY=.*\(eyJ[^~]*\).*/\1/' .env

# OU manuellement, éditez avec nano
nano .env
```

**Note** : La méthode `sed` peut ne pas fonctionner parfaitement. Il est préférable d'éditer manuellement avec `nano`.

---

## 📝 Format Correct d'une Clé Supabase

Une clé Supabase anon public est un **JWT (JSON Web Token)** qui :

- ✅ Commence par `eyJ` (base64)
- ✅ Contient 3 parties séparées par des points `.`
- ✅ Format : `header.payload.signature`
- ✅ Pas d'espaces
- ✅ Pas de caractères spéciaux (`~`, `#`, etc.)
- ✅ Une seule ligne continue

**Exemple correct** :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2dHJnaHNkZmtyd2dhc3ZuZmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Mjc3NDQsImV4cCI6MjA3ODIwMzc0NH0.EKRO_aOfDQs9EiuSyiJvl-n4n4_6zncokZJ1d4GpqiU
```

---

## ✅ Checklist

- [ ] Clé corrigée dans `.env` (sans `~`, sans duplication)
- [ ] Clé vérifiée : `cat .env | grep VITE_SUPABASE_ANON_KEY`
- [ ] Frontend rebuild : `docker compose build --no-cache frontend`
- [ ] Services redémarrés : `docker compose up -d`
- [ ] Clé vérifiée dans le navigateur (console)
- [ ] Google Auth fonctionne

---

## 🎯 Commandes Rapides

```bash
# Vérifier la clé actuelle
cat .env | grep VITE_SUPABASE_ANON_KEY

# Éditer le fichier
nano .env

# Rebuild et redémarrer
docker compose build --no-cache frontend
docker compose down
docker compose up -d

# Vérifier les logs
docker compose logs frontend
```

---

## 🆘 Si la Clé Ne Fonctionne Toujours Pas

1. **Vérifiez dans Supabase Dashboard** :
   - Settings → API
   - Copiez la clé **anon public** exacte
   - Vérifiez qu'elle n'a pas expiré

2. **Vérifiez le format** :
   ```bash
   # La clé doit commencer par eyJ
   cat .env | grep VITE_SUPABASE_ANON_KEY | grep -q "^VITE_SUPABASE_ANON_KEY=eyJ" && echo "OK" || echo "ERREUR"
   ```

3. **Rebuild complet** :
   ```bash
   docker compose down
   docker compose build --no-cache
   docker compose up -d
   ```

4. **Videz le cache du navigateur** :
   - Ctrl+Shift+Delete
   - Testez en navigation privée

---

## 📝 Notes

- **La clé doit être exactement** comme dans Supabase Dashboard
- **Pas de guillemets** autour de la valeur
- **Pas d'espaces** avant ou après
- **Une seule ligne** continue
- **Rebuild nécessaire** après chaque modification

