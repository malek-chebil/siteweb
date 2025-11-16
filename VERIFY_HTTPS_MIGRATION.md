# Vérification de la Migration HTTPS

## ✅ État Actuel
- ✅ Frontend rebuild et redémarré
- ✅ Logs montrent que le frontend fonctionne

## 📋 Vérifications à Faire

### 1. Vérifier les Variables d'Environnement

**Sur le serveur :**
```bash
cd /root/site\ Web
grep -E "(VITE_API_URL|CORS_ORIGINS)" .env
```

**Vous devriez voir :**
```
VITE_API_URL=https://cartagespa.com/api/v1
CORS_ORIGINS=https://cartagespa.com,https://www.cartagespa.com,http://localhost:5173,http://localhost:5174
```

### 2. Vérifier le Statut des Conteneurs

```bash
docker compose ps
```

**Tous les conteneurs devraient être "Up" :**
- ✅ cartagespa-backend
- ✅ cartagespa-frontend
- ✅ cartagespa-nginx

### 3. Test dans le Navigateur

#### 3.1. Test HTTPS
1. Ouvrir : `https://cartagespa.com`
2. Vérifier :
   - ✅ Cadenas vert visible
   - ✅ Pas d'avertissement de sécurité
   - ✅ Site se charge correctement

#### 3.2. Test Redirection HTTP → HTTPS
1. Ouvrir : `http://cartagespa.com`
2. Vérifier :
   - ✅ Redirection automatique vers `https://cartagespa.com`

#### 3.3. Test Console du Navigateur
1. Ouvrir la console (F12)
2. Aller dans l'onglet "Network"
3. Recharger la page
4. Vérifier :
   - ✅ Les requêtes API utilisent `https://cartagespa.com/api/v1`
   - ✅ Pas d'erreurs CORS
   - ✅ Pas d'erreurs de connexion

### 4. Test Authentification Google

1. Cliquer sur "Se connecter avec Google"
2. Vérifier :
   - ✅ Redirection vers Google fonctionne
   - ✅ Retour vers `https://cartagespa.com/auth/callback` fonctionne
   - ✅ Connexion réussie
   - ✅ Pas d'erreur dans la console

### 5. Test API depuis le Serveur (optionnel)

```bash
# Test HTTPS
curl -I https://cartagespa.com

# Test API Health
curl https://cartagespa.com/api/v1/health

# Test redirection HTTP → HTTPS
curl -I http://cartagespa.com
# Devrait retourner : HTTP/1.1 301 Moved Permanently
# Location: https://cartagespa.com/...
```

---

## 🐛 En Cas de Problème

### Problème : Erreur CORS

**Symptômes :**
- Erreur dans la console : `Access to fetch at 'https://...' from origin 'https://cartagespa.com' has been blocked by CORS policy`

**Solution :**
```bash
# Vérifier CORS_ORIGINS dans .env
grep CORS_ORIGINS .env

# Si nécessaire, redémarrer le backend
docker compose restart backend

# Vérifier les logs
docker compose logs backend --tail 50
```

### Problème : Authentification Google ne fonctionne pas

**Symptômes :**
- Erreur après redirection Google
- Redirection vers localhost au lieu de cartagespa.com

**Solution :**
1. Vérifier Supabase Redirect URLs incluent `https://cartagespa.com/auth/callback`
2. Vérifier Site URL est `https://cartagespa.com`
3. Vider le cache du navigateur
4. Réessayer

### Problème : Frontend utilise encore HTTP pour les appels API

**Symptômes :**
- Erreur dans la console : `net::ERR_CONNECTION_REFUSED`
- Les requêtes utilisent `http://cartagespa.com/api/v1`

**Solution :**
```bash
# Vérifier VITE_API_URL dans .env
grep VITE_API_URL .env

# Si nécessaire, rebuild le frontend
docker compose build frontend
docker compose up -d frontend
```

---

## ✅ Checklist Finale

- [ ] Variables d'environnement vérifiées (VITE_API_URL et CORS_ORIGINS)
- [ ] Tous les conteneurs sont "Up"
- [ ] Test HTTPS dans le navigateur : ✅
- [ ] Test redirection HTTP → HTTPS : ✅
- [ ] Test console navigateur (pas d'erreurs) : ✅
- [ ] Test authentification Google : ✅
- [ ] Test API depuis le serveur (optionnel) : ✅

---

## 🎉 Si Tout Fonctionne

Félicitations ! Votre migration HTTPS est complète !

**Prochaines étapes possibles :**
- Configurer fail2ban pour protection DDoS
- Mettre en place des backups automatiques
- Configurer un monitoring (Uptime Robot)
- Optimiser les performances (CDN, cache)

