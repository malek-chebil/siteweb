# 🔒 Prochaines Étapes Après Génération des Certificats SSL

## ✅ Certificats SSL Générés avec Succès

**Certificats créés** :
- ✅ `/etc/letsencrypt/live/cartagespa.com/fullchain.pem`
- ✅ `/etc/letsencrypt/live/cartagespa.com/privkey.pem`
- ✅ Expiration : 2026-02-14 (90 jours)
- ✅ Renouvellement automatique configuré

---

## 🔍 Étape 1 : Vérifier les Certificats

**Sur le serveur** :

```bash
# Vérifier que les certificats existent
ls -la /etc/letsencrypt/live/cartagespa.com/

# Devrait afficher :
# - fullchain.pem
# - privkey.pem
# - cert.pem
# - chain.pem
```

---

## 📤 Étape 2 : Transférer les Fichiers Modifiés

**Depuis Windows PowerShell** :

```powershell
$SSH_KEY = "C:\Users\Malek\Desktop\config site web\1984_hosting_key"
$SERVER = "root@89.147.111.166"
$REMOTE_PATH = "/root/site Web"

# Transférer le script Nginx HTTPS
scp -i $SSH_KEY "nginx\start-nginx-with-ips-https.sh" "${SERVER}:${REMOTE_PATH}/nginx/start-nginx-with-ips-https.sh"

# Transférer docker-compose HTTPS
scp -i $SSH_KEY "docker-compose-https.yml" "${SERVER}:${REMOTE_PATH}/docker-compose.yml"
```

---

## 🔧 Étape 3 : Configurer Nginx Docker pour HTTPS

**Sur le serveur** :

```bash
cd "/root/site Web"

# Renommer le script HTTPS
mv nginx/start-nginx-with-ips-https.sh nginx/start-nginx-with-ips.sh
chmod +x nginx/start-nginx-with-ips.sh

# Vérifier que docker-compose.yml a le volume SSL
grep letsencrypt docker-compose.yml

# Devrait afficher : - /etc/letsencrypt:/etc/letsencrypt:ro
```

---

## 🛑 Étape 4 : Arrêter Nginx Système et Redémarrer Docker

**Sur le serveur** :

```bash
# Arrêter Nginx système (plus besoin)
systemctl stop nginx
systemctl disable nginx

# Optionnel : Remasquer Nginx (pour éviter qu'il démarre accidentellement)
systemctl mask nginx

# Redémarrer Docker Compose
docker compose down
docker compose up -d

# Vérifier que tout fonctionne
docker compose ps

# Vérifier les logs Nginx
docker compose logs nginx | tail -20
```

---

## ✅ Étape 5 : Tester HTTPS

**Sur le serveur** :

```bash
# Tester HTTPS
curl -I https://cartagespa.com

# Devrait retourner : HTTP/2 200

# Tester la redirection HTTP → HTTPS
curl -I http://cartagespa.com

# Devrait retourner : HTTP/1.1 301 Moved Permanently
# Location: https://cartagespa.com/
```

**Dans le navigateur** :
1. Aller sur : `http://cartagespa.com`
2. Vérifier : Redirection automatique vers `https://cartagespa.com`
3. Vérifier : Cadenas vert dans la barre d'adresse

---

## 🔄 Étape 6 : Mettre à Jour Supabase

**Dans Supabase Dashboard** :

1. **Aller dans** : Authentication → Settings
2. **Site URL** : Changer de `http://cartagespa.com` à `https://cartagespa.com`
3. **Redirect URLs** : Ajouter :
   - `https://cartagespa.com/auth/callback`
   - `https://cartagespa.com/**`
   - `https://www.cartagespa.com/auth/callback`
   - `https://www.cartagespa.com/**`
4. **Garder** (pour développement local) :
   - `http://localhost:5173/auth/callback`
   - `http://localhost:5174/auth/callback`
5. Cliquer sur **"Save"**

---

## 🔧 Étape 7 : Mettre à Jour les Variables d'Environnement

**Sur le serveur** :

```bash
# Éditer le fichier .env
nano "/root/site Web/.env"
```

**Changer** :
```env
# Avant
VITE_API_URL=http://cartagespa.com/api/v1
CORS_ORIGINS=http://cartagespa.com,http://www.cartagespa.com,http://localhost:5173,http://localhost:5174

# Après
VITE_API_URL=https://cartagespa.com/api/v1
CORS_ORIGINS=https://cartagespa.com,https://www.cartagespa.com,http://localhost:5173,http://localhost:5174
```

**Sauvegarder** : `Ctrl+X`, puis `Y`, puis `Enter`

**Rebuild frontend** :
```bash
docker compose build frontend
docker compose up -d
```

---

## ✅ Étape 8 : Tests Finaux

### 8.1 Test HTTPS

```bash
curl -I https://cartagespa.com
```

### 8.2 Test dans le Navigateur

1. **Aller sur** : `http://cartagespa.com`
2. **Vérifier** : Redirection automatique vers `https://cartagespa.com`
3. **Vérifier** : Cadenas vert dans la barre d'adresse
4. **Tester** : Connexion Google Auth
5. **Tester** : Création de listing
6. **Tester** : Upload d'images

### 8.3 Vérifier le Certificat SSL

**Dans le navigateur** :
1. Cliquer sur le **cadenas** dans la barre d'adresse
2. Cliquer sur **"Certificate"**
3. Vérifier :
   - **Issued to** : `cartagespa.com`
   - **Issued by** : `Let's Encrypt`
   - **Valid until** : 2026-02-14

---

## 📋 Checklist Complète

### Certificats
- [x] Certificats SSL générés
- [ ] Certificats vérifiés dans `/etc/letsencrypt/live/cartagespa.com/`

### Configuration
- [ ] Script Nginx HTTPS transféré
- [ ] `docker-compose.yml` mis à jour avec volume SSL
- [ ] Nginx système arrêté
- [ ] Docker Compose redémarré

### Tests
- [ ] HTTPS fonctionne : `https://cartagespa.com`
- [ ] Redirection HTTP → HTTPS fonctionne
- [ ] Cadenas vert dans le navigateur
- [ ] Google Auth fonctionne avec HTTPS
- [ ] API calls fonctionnent
- [ ] Upload d'images fonctionne

### Supabase
- [ ] Site URL changé : `https://cartagespa.com`
- [ ] Redirect URLs HTTPS ajoutées
- [ ] Localhost URLs gardées en HTTP

### Variables
- [ ] `.env` mis à jour : `VITE_API_URL=https://...`
- [ ] `CORS_ORIGINS` mis à jour avec HTTPS
- [ ] Frontend rebuild

---

## 🎯 Résumé

**Terminé** :
- ✅ Certificats SSL générés
- ✅ Renouvellement automatique configuré

**À faire maintenant** :
1. Transférer les fichiers modifiés
2. Configurer Nginx Docker
3. Mettre à jour Supabase
4. Mettre à jour les variables
5. Tester

**Temps estimé** : 15-20 minutes

