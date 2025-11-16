# ✅ Prochaines Étapes Après Configuration Supabase

## 📋 Ce Qui Est Fait

- ✅ URLs ajoutées dans Supabase
- ✅ Site URL configuré : `http://cartagespa.com`
- ✅ Redirect URLs configurées

---

## 🎯 Prochaines Étapes

### ÉTAPE 1 : Rebuild le Frontend

Le frontend doit être reconstruit pour utiliser la nouvelle `VITE_API_URL`.

**Sur le serveur (via SSH)** :

```bash
cd "/root/site Web"

# Rebuild le frontend avec les nouvelles variables d'environnement
docker compose build --no-cache frontend
```

**Temps estimé** : 2-5 minutes

---

### ÉTAPE 2 : Redémarrer les Services

```bash
# Arrêter tous les services
docker compose down

# Redémarrer tous les services
docker compose up -d
```

**Vérifier que tout fonctionne** :

```bash
# Vérifier le statut des conteneurs
docker compose ps

# Vérifier les logs
docker compose logs -f
```

**Attendez** que tous les services soient `healthy` ou `running`.

---

### ÉTAPE 3 : Vérifier les Variables d'Environnement

**Vérifier que le fichier `.env` contient les bonnes valeurs** :

```bash
cat .env | grep VITE_API_URL
```

**Devrait afficher** :
```
VITE_API_URL=http://cartagespa.com/api/v1
```

**Si ce n'est pas le cas**, éditez le fichier `.env` :

```bash
nano .env
```

**Ajoutez ou modifiez** :
```
VITE_API_URL=http://cartagespa.com/api/v1
VITE_SUPABASE_URL=votre_supabase_url
VITE_SUPABASE_ANON_KEY=votre_supabase_anon_key
```

**Puis rebuild** :
```bash
docker compose build --no-cache frontend
docker compose up -d
```

---

### ÉTAPE 4 : Tester l'Application

#### Test 1 : Accéder au Site

**Dans votre navigateur** :
```
http://cartagespa.com
```

**OU** :
```
http://89.147.111.166
```

**Vérifiez** :
- ✅ Le site se charge
- ✅ Pas d'erreurs dans la console (F12)
- ✅ Les images et CSS se chargent

---

#### Test 2 : Vérifier les Appels API

**Ouvrez la console du navigateur** (F12) → **Onglet Network**

**Actions à tester** :
1. Charger la page d'accueil
2. Vérifier les requêtes vers `/api/v1/...`
3. Vérifier qu'elles vont vers `http://cartagespa.com/api/v1/...` (pas localhost)

**Si vous voyez des erreurs 401** :
- Vérifiez que `VITE_API_URL` est correct dans le build
- Vérifiez les logs du backend : `docker compose logs backend`

---

#### Test 3 : Tester Google Auth

1. **Cliquez sur "Se connecter avec Google"**
2. **Vérifiez** que la redirection va vers :
   ```
   http://cartagespa.com/auth/callback
   ```
   (pas `localhost`)

3. **Après authentification Google**, vous devriez être redirigé vers :
   ```
   http://cartagespa.com
   ```

**Si la redirection va vers localhost** :
- Vérifiez les URLs dans Supabase
- Vérifiez que vous avez bien sauvegardé
- Attendez quelques minutes (propagation)

---

## 🔍 Vérifications Détaillées

### Vérifier les Logs du Frontend

```bash
docker compose logs frontend
```

**Cherchez** :
- ✅ Pas d'erreurs de build
- ✅ Nginx démarre correctement
- ✅ Les fichiers sont servis

---

### Vérifier les Logs du Backend

```bash
docker compose logs backend
```

**Cherchez** :
- ✅ Backend démarre correctement
- ✅ Connexion à la base de données réussie
- ✅ Pas d'erreurs 500

---

### Vérifier les Logs de Nginx

```bash
docker compose logs nginx
```

**Cherchez** :
- ✅ Nginx démarre correctement
- ✅ Pas d'erreurs de configuration
- ✅ Les services backend et frontend sont accessibles

---

## 🐛 Problèmes Courants

### Problème 1 : API retourne 401 Unauthorized

**Solution** :
1. Vérifiez que `VITE_API_URL` est correct dans `.env`
2. Rebuild le frontend : `docker compose build --no-cache frontend`
3. Redémarrez : `docker compose up -d`

---

### Problème 2 : Google Auth redirige vers localhost

**Solution** :
1. Vérifiez les URLs dans Supabase Dashboard
2. Vérifiez que `http://cartagespa.com/auth/callback` est dans la liste
3. Videz le cache du navigateur (Ctrl+Shift+Delete)
4. Attendez quelques minutes (propagation)

---

### Problème 3 : Le site ne se charge pas

**Solution** :
1. Vérifiez que les services sont en cours d'exécution :
   ```bash
   docker compose ps
   ```

2. Vérifiez les logs :
   ```bash
   docker compose logs
   ```

3. Vérifiez que Nginx écoute sur le port 80 :
   ```bash
   netstat -tuln | grep 80
   ```

---

### Problème 4 : Erreurs CORS

**Solution** :
1. Vérifiez `CORS_ORIGINS` dans `.env` :
   ```
   CORS_ORIGINS=http://cartagespa.com,http://localhost:5173
   ```

2. Redémarrez le backend :
   ```bash
   docker compose restart backend
   ```

---

## ✅ Checklist Complète

### Configuration
- [ ] URLs ajoutées dans Supabase
- [ ] Site URL : `http://cartagespa.com`
- [ ] Redirect URLs configurées
- [ ] `.env` contient `VITE_API_URL=http://cartagespa.com/api/v1`

### Déploiement
- [ ] Frontend rebuild : `docker compose build --no-cache frontend`
- [ ] Services redémarrés : `docker compose up -d`
- [ ] Tous les services sont `healthy` ou `running`

### Tests
- [ ] Site accessible : `http://cartagespa.com`
- [ ] Pas d'erreurs dans la console du navigateur
- [ ] Les appels API vont vers `http://cartagespa.com/api/v1/...`
- [ ] Google Auth redirige vers `http://cartagespa.com/auth/callback`
- [ ] Authentification Google fonctionne

---

## 🎯 Commandes Rapides

```bash
# Rebuild et redémarrer
cd "/root/site Web"
docker compose build --no-cache frontend
docker compose down
docker compose up -d

# Vérifier le statut
docker compose ps

# Voir les logs
docker compose logs -f

# Vérifier les variables d'environnement
cat .env | grep VITE_API_URL
```

---

## 📝 Notes

- **Le rebuild du frontend est nécessaire** car `VITE_API_URL` est utilisé au moment du build
- **Les changements dans Supabase** peuvent prendre quelques minutes à se propager
- **Videz le cache du navigateur** si vous voyez encore des erreurs
- **Testez en navigation privée** pour éviter les problèmes de cache

---

## 🆘 Si Rien Ne Fonctionne

1. **Vérifiez tous les logs** :
   ```bash
   docker compose logs
   ```

2. **Vérifiez les variables d'environnement** :
   ```bash
   cat .env
   ```

3. **Vérifiez la configuration Supabase** :
   - Allez dans Supabase Dashboard
   - Vérifiez que les URLs sont correctes
   - Vérifiez que vous avez sauvegardé

4. **Redémarrez tout** :
   ```bash
   docker compose down
   docker compose up -d --build
   ```

---

## 🎉 Une Fois Que Tout Fonctionne

1. ✅ Testez toutes les fonctionnalités
2. ✅ Testez Google Auth
3. ✅ Testez la création de listings
4. ✅ Testez l'upload d'images
5. ⏳ Configurez HTTPS (plus tard)
6. ⏳ Configurez le monitoring
7. ⏳ Configurez les backups

