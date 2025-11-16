# ✅ Tester l'Application Maintenant

## 📊 Statut des Services

D'après les logs, **tous les services fonctionnent correctement** :

### ✅ Backend
- Migrations OK
- Serveur Uvicorn démarré sur port 8000
- Healthcheck : 200 OK
- Connexion à la base de données : OK

### ✅ Frontend
- Nginx démarré correctement
- Configuration OK
- Prêt à servir les fichiers

### ✅ Nginx (Reverse Proxy)
- IPs récupérées dynamiquement :
  - Frontend : `172.18.0.3`
  - Backend : `172.18.0.2`
- Configuration créée avec succès
- Test de configuration : OK

---

## 🎯 Tests à Effectuer

### Test 1 : Accéder au Site

**Ouvrez dans votre navigateur** :
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
- ✅ La page d'accueil s'affiche correctement

---

### Test 2 : Vérifier les Appels API

1. **Ouvrez la console du navigateur** (F12)
2. **Allez dans l'onglet "Network"**
3. **Rechargez la page**
4. **Cherchez les requêtes vers `/api/v1/...`**

**Vérifiez** :
- ✅ Les requêtes vont vers `http://cartagespa.com/api/v1/...`
- ✅ Pas de requêtes vers `localhost`
- ✅ Pas d'erreurs 401 Unauthorized
- ✅ Pas d'erreurs 500 Internal Server Error

**Si vous voyez des erreurs 401** :
- Vérifiez que le frontend a été rebuild avec la bonne `VITE_API_URL`
- Vérifiez les logs : `docker compose logs frontend`

---

### Test 3 : Tester Google Auth

1. **Cliquez sur "Se connecter avec Google"** (ou bouton similaire)
2. **Vérifiez la redirection** :
   - Devrait aller vers Google
   - Après authentification, devrait rediriger vers :
     ```
     http://cartagespa.com/auth/callback
     ```
   - **PAS** vers `localhost`

3. **Après authentification** :
   - Vous devriez être redirigé vers `http://cartagespa.com`
   - Vous devriez être connecté

**Si la redirection va vers localhost** :
- Vérifiez les URLs dans Supabase Dashboard
- Vérifiez que `http://cartagespa.com/auth/callback` est dans la liste
- Videz le cache du navigateur (Ctrl+Shift+Delete)
- Attendez quelques minutes (propagation)

---

### Test 4 : Tester les Fonctionnalités

#### Créer un Compte (si pas encore fait)
- Testez la création de compte
- Vérifiez que ça fonctionne

#### Créer un Listing
- Testez la création d'un listing
- Vérifiez l'upload d'images
- Vérifiez que le listing apparaît

#### Recherche
- Testez la recherche
- Testez les filtres

---

## 🔍 Vérifications Supplémentaires

### Vérifier les Logs en Temps Réel

**Sur le serveur** :
```bash
# Logs de tous les services
docker compose logs -f

# Logs du backend uniquement
docker compose logs -f backend

# Logs du frontend uniquement
docker compose logs -f frontend

# Logs de Nginx uniquement
docker compose logs -f nginx
```

---

### Vérifier le Statut des Services

```bash
docker compose ps
```

**Devrait afficher** :
- `cartagespa-backend` : `Up` et `healthy`
- `cartagespa-frontend` : `Up` et `healthy`
- `cartagespa-nginx` : `Up`

---

### Vérifier les Variables d'Environnement

```bash
# Vérifier VITE_API_URL dans le build
docker compose exec frontend env | grep VITE_API_URL
```

**OU** vérifier dans le navigateur :
1. Ouvrez la console (F12)
2. Tapez : `console.log(import.meta.env.VITE_API_URL)`
3. Devrait afficher : `http://cartagespa.com/api/v1`

---

## ⚠️ Avertissement Noté

Les logs montrent :
```
⚠️  WARNING: Using pooler connection. For best results, use direct connection (port 5432) in DATABASE_URL
```

**Ce n'est pas critique**, mais pour de meilleures performances :

1. **Dans Supabase Dashboard** :
   - Allez dans Settings → Database
   - Copiez la "Connection string" (pas "Connection pooling")
   - Utilisez le port `5432` au lieu de `6543`

2. **Mettez à jour `.env`** :
   ```
   DATABASE_URL=postgresql://...@db.xxx.supabase.co:5432/postgres
   ```

3. **Redémarrez le backend** :
   ```bash
   docker compose restart backend
   ```

**Note** : Ce n'est pas urgent, l'application fonctionne avec le pooler.

---

## 🐛 Problèmes Courants

### Problème 1 : Le site ne se charge pas

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

### Problème 2 : Erreurs 401 Unauthorized

**Solution** :
1. Vérifiez que le frontend a été rebuild :
   ```bash
   docker compose build --no-cache frontend
   docker compose up -d
   ```

2. Vérifiez `VITE_API_URL` dans `.env` :
   ```bash
   cat .env | grep VITE_API_URL
   ```

3. Vérifiez dans le navigateur (console) :
   ```javascript
   console.log(import.meta.env.VITE_API_URL)
   ```

---

### Problème 3 : Google Auth redirige vers localhost

**Solution** :
1. Vérifiez les URLs dans Supabase Dashboard
2. Vérifiez que `http://cartagespa.com/auth/callback` est dans la liste
3. Videz le cache du navigateur
4. Testez en navigation privée

---

## ✅ Checklist de Test

- [ ] Site accessible : `http://cartagespa.com`
- [ ] Pas d'erreurs dans la console (F12)
- [ ] Les appels API vont vers `http://cartagespa.com/api/v1/...`
- [ ] Pas d'erreurs 401 ou 500
- [ ] Google Auth redirige vers `http://cartagespa.com/auth/callback`
- [ ] Authentification Google fonctionne
- [ ] Création de compte fonctionne
- [ ] Création de listing fonctionne
- [ ] Upload d'images fonctionne

---

## 🎉 Si Tout Fonctionne

Félicitations ! Votre application est déployée et fonctionnelle.

### Prochaines Étapes (Optionnelles)

1. **Configurer HTTPS** (recommandé)
   - Installer Certbot
   - Générer les certificats SSL
   - Mettre à jour Supabase pour HTTPS

2. **Monitoring**
   - Configurer des alertes
   - Surveiller les logs
   - Surveiller les performances

3. **Backups**
   - Configurer les backups de la base de données
   - Configurer les backups des fichiers

4. **Optimisations**
   - Optimiser les images
   - Configurer le cache
   - Optimiser les requêtes

---

## 🆘 Si Quelque Chose Ne Fonctionne Pas

1. **Vérifiez tous les logs** :
   ```bash
   docker compose logs
   ```

2. **Vérifiez le statut** :
   ```bash
   docker compose ps
   ```

3. **Redémarrez tout** :
   ```bash
   docker compose down
   docker compose up -d
   ```

4. **Consultez les guides de dépannage** :
   - `FIX_API_AND_SUPABASE_CONFIG.md`
   - `NEXT_STEPS_AFTER_SUPABASE_CONFIG.md`

---

## 📝 Notes

- **Les services sont opérationnels** d'après les logs
- **Le warning sur le pooler** n'est pas critique
- **Testez maintenant** pour vérifier que tout fonctionne
- **Si vous voyez des erreurs**, consultez les guides de dépannage

