# 🔧 Corriger les Erreurs CORS

## 🐛 Problème

L'authentification fonctionne, mais **toutes les autres APIs retournent des erreurs CORS**.

**Erreur typique** :
```
Access to fetch at 'http://cartagespa.com/api/v1/...' from origin 'http://cartagespa.com' has been blocked by CORS policy
```

**Cause** : Le backend n'autorise pas les requêtes depuis `http://cartagespa.com`.

---

## ✅ Solution

### ÉTAPE 1 : Vérifier CORS_ORIGINS dans `.env`

**Sur le serveur (via SSH)** :

```bash
cd "/root/site Web"
cat .env | grep CORS_ORIGINS
```

**Devrait contenir** :
```
CORS_ORIGINS=http://cartagespa.com,http://www.cartagespa.com,http://localhost:5173,http://localhost:5174
```

**Si la variable est manquante ou incorrecte**, continuez à l'étape 2.

---

### ÉTAPE 2 : Ajouter/Corriger CORS_ORIGINS dans `.env`

**Éditez le fichier `.env`** :

```bash
nano .env
```

**Ajoutez ou modifiez** :
```bash
CORS_ORIGINS=http://cartagespa.com,http://www.cartagespa.com,http://localhost:5173,http://localhost:5174,http://89.147.111.166
```

**Important** :
- ✅ Utilisez `http://` (pas `https://`) car vous n'avez pas encore configuré SSL
- ✅ Incluez `http://cartagespa.com` (votre domaine)
- ✅ Incluez `http://www.cartagespa.com` (sous-domaine www)
- ✅ Incluez `http://89.147.111.166` (IP directe, pour les tests)
- ✅ Incluez `http://localhost:5173` et `http://localhost:5174` (développement local)

**Sauvegardez** : `Ctrl+O`, `Enter`, `Ctrl+X`

---

### ÉTAPE 3 : Vérifier docker-compose.yml

**Vérifiez que `docker-compose.yml` utilise bien la variable** :

```bash
cat docker-compose.yml | grep CORS_ORIGINS
```

**Devrait afficher** :
```yaml
- CORS_ORIGINS=${CORS_ORIGINS:-https://cartagespa.com,http://localhost:5173}
```

**Problème** : La valeur par défaut utilise `https://` au lieu de `http://`.

**Solution** : Modifiez `docker-compose.yml` pour utiliser `http://` par défaut :

```yaml
- CORS_ORIGINS=${CORS_ORIGINS:-http://cartagespa.com,http://www.cartagespa.com,http://localhost:5173}
```

**OU** mieux : Définissez `CORS_ORIGINS` dans `.env` et laissez docker-compose utiliser cette valeur.

---

### ÉTAPE 4 : Redémarrer le Backend

**Après avoir modifié `.env` ou `docker-compose.yml`** :

```bash
cd "/root/site Web"

# Redémarrer uniquement le backend
docker compose restart backend
```

**OU** redémarrer tous les services :

```bash
docker compose down
docker compose up -d
```

---

### ÉTAPE 5 : Vérifier les Logs

**Vérifiez que le backend démarre correctement** :

```bash
docker compose logs backend | tail -20
```

**Cherchez** :
- ✅ Pas d'erreurs
- ✅ Backend démarré sur port 8000
- ✅ CORS configuré

---

### ÉTAPE 6 : Tester

**Dans le navigateur** :

1. **Ouvrez** `http://cartagespa.com`
2. **Ouvrez la console** (F12) → Onglet Network
3. **Effectuez une action** qui appelle l'API (ex: charger les listings)
4. **Vérifiez** :
   - ✅ Pas d'erreurs CORS
   - ✅ Les requêtes retournent 200 OK
   - ✅ Les données sont chargées

---

## 🔍 Vérifications Détaillées

### Vérifier la Configuration CORS dans le Backend

**Le backend utilise** `settings.cors_origins_list` qui parse `CORS_ORIGINS` depuis une chaîne séparée par des virgules.

**Vérifiez dans le code** (`backend/app/main.py`) :

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Cela devrait autoriser** :
- ✅ Toutes les origines dans `CORS_ORIGINS`
- ✅ Toutes les méthodes HTTP
- ✅ Tous les headers
- ✅ Les credentials (cookies, auth headers)

---

### Vérifier les Variables d'Environnement dans le Conteneur

**Vérifiez que la variable est bien passée au conteneur** :

```bash
docker compose exec backend env | grep CORS_ORIGINS
```

**Devrait afficher** :
```
CORS_ORIGINS=http://cartagespa.com,http://www.cartagespa.com,http://localhost:5173,http://localhost:5174,http://89.147.111.166
```

**Si vide ou incorrect** :
- Vérifiez `.env` sur le serveur
- Vérifiez `docker-compose.yml`
- Redémarrez le backend

---

## 🐛 Problèmes Courants

### Problème 1 : CORS_ORIGINS Utilise HTTPS au Lieu de HTTP

**Symptôme** : Erreurs CORS même après configuration.

**Solution** :
1. Vérifiez que `CORS_ORIGINS` utilise `http://` (pas `https://`)
2. Modifiez `.env` :
   ```bash
   CORS_ORIGINS=http://cartagespa.com,http://www.cartagespa.com,http://localhost:5173
   ```
3. Redémarrez le backend : `docker compose restart backend`

---

### Problème 2 : CORS_ORIGINS Non Défini dans `.env`

**Symptôme** : Le backend utilise la valeur par défaut qui ne contient pas `http://cartagespa.com`.

**Solution** :
1. Ajoutez `CORS_ORIGINS` dans `.env`
2. Redémarrez le backend

---

### Problème 3 : Valeur Par Défaut dans docker-compose.yml Incorrecte

**Symptôme** : Même après avoir défini `CORS_ORIGINS` dans `.env`, les erreurs persistent.

**Solution** :
1. Vérifiez `docker-compose.yml` :
   ```yaml
   - CORS_ORIGINS=${CORS_ORIGINS:-http://cartagespa.com,http://localhost:5173}
   ```
2. Modifiez la valeur par défaut pour utiliser `http://` au lieu de `https://`
3. Redémarrez : `docker compose down && docker compose up -d`

---

### Problème 4 : Cache du Navigateur

**Symptôme** : Les erreurs CORS persistent même après correction.

**Solution** :
1. Videz le cache du navigateur (Ctrl+Shift+Delete)
2. Testez en navigation privée
3. Hard refresh : Ctrl+Shift+R

---

## ✅ Checklist

- [ ] `CORS_ORIGINS` défini dans `.env` avec `http://cartagespa.com`
- [ ] `CORS_ORIGINS` utilise `http://` (pas `https://`)
- [ ] `docker-compose.yml` utilise `${CORS_ORIGINS}`
- [ ] Backend redémarré : `docker compose restart backend`
- [ ] Variables vérifiées dans le conteneur : `docker compose exec backend env | grep CORS`
- [ ] Pas d'erreurs CORS dans la console navigateur
- [ ] Les APIs fonctionnent correctement

---

## 🎯 Configuration Recommandée

### Pour la Production (HTTP actuellement)

**Dans `.env`** :
```bash
CORS_ORIGINS=http://cartagespa.com,http://www.cartagespa.com,http://89.147.111.166
```

**Dans `docker-compose.yml`** :
```yaml
- CORS_ORIGINS=${CORS_ORIGINS:-http://cartagespa.com,http://www.cartagespa.com}
```

---

### Pour Plus Tard (HTTPS)

**Une fois HTTPS configuré**, modifiez `.env` :

```bash
CORS_ORIGINS=https://cartagespa.com,https://www.cartagespa.com,http://localhost:5173,http://localhost:5174
```

**Et redémarrez** :
```bash
docker compose restart backend
```

---

## 🎯 Commandes Rapides

```bash
# Vérifier CORS_ORIGINS
cat .env | grep CORS_ORIGINS

# Éditer .env
nano .env

# Redémarrer le backend
docker compose restart backend

# Vérifier les variables dans le conteneur
docker compose exec backend env | grep CORS_ORIGINS

# Voir les logs
docker compose logs backend | tail -20
```

---

## 📝 Notes

- **CORS est configuré au niveau du backend** (FastAPI)
- **Les variables doivent être définies avant le démarrage** du backend
- **Redémarrage nécessaire** après chaque modification de `CORS_ORIGINS`
- **Utilisez `http://` maintenant**, changez pour `https://` plus tard

---

## 🆘 Si Rien Ne Fonctionne

1. **Vérifiez tous les fichiers** :
   ```bash
   cat .env | grep CORS
   cat docker-compose.yml | grep CORS
   ```

2. **Vérifiez les logs du backend** :
   ```bash
   docker compose logs backend
   ```

3. **Redémarrez tout** :
   ```bash
   docker compose down
   docker compose up -d
   ```

4. **Testez avec curl** :
   ```bash
   curl -H "Origin: http://cartagespa.com" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        http://localhost:8000/api/v1/listings
   ```

   **Devrait retourner** des headers CORS :
   ```
   Access-Control-Allow-Origin: http://cartagespa.com
   Access-Control-Allow-Methods: *
   Access-Control-Allow-Headers: *
   ```

