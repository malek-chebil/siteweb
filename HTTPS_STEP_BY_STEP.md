# 🔒 Configuration HTTPS - Étapes Détaillées

## ✅ Étape 0 : Vérification DNS (TERMINÉ)

**Vérification** :
```bash
nslookup cartagespa.com
# Résultat : 89.147.111.166 ✅
```

**DNS configuré correctement** - Vous pouvez continuer !

---

## 🚀 Étape 1 : Se Connecter au Serveur

**Depuis Windows PowerShell** :

```powershell
ssh -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" root@89.147.111.166
```

**Une fois connecté, vous devriez voir** :
```
root@cartagespa:~#
```

---

## 📦 Étape 2 : Installer Certbot

**Sur le serveur** :

```bash
# Mettre à jour les paquets
apt update

# Installer Certbot et le plugin Nginx
apt install certbot python3-certbot-nginx -y

# Vérifier l'installation
certbot --version
```

**Résultat attendu** :
```
certbot 2.x.x
```

---

## 🛑 Étape 3 : Arrêter Nginx Docker Temporairement

**Pour que Certbot puisse valider le domaine, nous devons arrêter Nginx Docker et utiliser Nginx système temporairement** :

```bash
# Aller dans le répertoire du projet
cd "/root/site Web"

# Arrêter Nginx Docker
docker compose stop nginx

# Vérifier qu'il est arrêté
docker compose ps nginx
```

---

## 🔧 Étape 4 : Installer et Configurer Nginx Système (Temporaire)

**Nginx système sera utilisé uniquement pour obtenir les certificats** :

```bash
# Installer Nginx système
apt install nginx -y

# Créer le répertoire pour la validation Certbot
mkdir -p /var/www/html

# Créer la configuration Nginx pour Certbot
cat > /etc/nginx/sites-available/cartagespa.com <<'EOF'
server {
    listen 80;
    server_name cartagespa.com www.cartagespa.com;

    # Pour la validation Certbot
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Proxy vers Docker (frontend sur port 3000)
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Activer la configuration
ln -s /etc/nginx/sites-available/cartagespa.com /etc/nginx/sites-enabled/

# Supprimer la configuration par défaut
rm -f /etc/nginx/sites-enabled/default

# Tester la configuration
nginx -t

# Si OK, démarrer Nginx
systemctl start nginx
systemctl enable nginx

# Vérifier que Nginx fonctionne
systemctl status nginx
```

**Vérifier que le site fonctionne** :
```bash
curl -I http://cartagespa.com
# Devrait retourner : HTTP/1.1 200 OK
```

---

## 🔐 Étape 5 : Générer les Certificats SSL

**Maintenant, générer les certificats** :

```bash
certbot --nginx -d cartagespa.com -d www.cartagespa.com
```

**Réponses aux questions** :

1. **Email address** :
   ```
   Entrer votre email (pour notifications de renouvellement)
   ```

2. **Terms of Service** :
   ```
   (A)gree
   ```

3. **Share email** :
   ```
   (Y)es ou (N)o (votre choix)
   ```

4. **Redirect HTTP to HTTPS** :
   ```
   (2) Redirect - Make all requests redirect to secure HTTPS access
   ```

**Résultat attendu** :
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/cartagespa.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/cartagespa.com/privkey.pem
```

**Vérifier les certificats** :
```bash
ls -la /etc/letsencrypt/live/cartagespa.com/
# Devrait afficher : fullchain.pem, privkey.pem, cert.pem, chain.pem
```

---

## 🐳 Étape 6 : Transférer les Fichiers Modifiés

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

## 🔄 Étape 7 : Configurer Nginx Docker pour HTTPS

**Sur le serveur** :

```bash
cd "/root/site Web"

# Renommer le script HTTPS
mv nginx/start-nginx-with-ips-https.sh nginx/start-nginx-with-ips.sh
chmod +x nginx/start-nginx-with-ips.sh

# Vérifier que docker-compose.yml est à jour
cat docker-compose.yml | grep letsencrypt
# Devrait afficher : - /etc/letsencrypt:/etc/letsencrypt:ro
```

---

## 🛑 Étape 8 : Arrêter Nginx Système et Redémarrer Docker

**Sur le serveur** :

```bash
# Arrêter Nginx système (plus besoin)
systemctl stop nginx
systemctl disable nginx

# Redémarrer Docker Compose
docker compose down
docker compose up -d

# Vérifier que tout fonctionne
docker compose ps

# Vérifier les logs Nginx
docker compose logs nginx | tail -20
```

**Vérifier HTTPS** :
```bash
# Tester HTTPS
curl -I https://cartagespa.com

# Devrait retourner : HTTP/2 200
```

---

## 🔄 Étape 9 : Mettre à Jour Supabase

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

## 🔧 Étape 10 : Mettre à Jour les Variables d'Environnement

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

## ✅ Étape 11 : Tests et Vérification

### 11.1 Test HTTPS

```bash
# Tester HTTPS
curl -I https://cartagespa.com

# Devrait retourner : HTTP/2 200
```

### 11.2 Test Redirection HTTP → HTTPS

```bash
# Tester la redirection
curl -I http://cartagespa.com

# Devrait retourner : HTTP/1.1 301 Moved Permanently
# Location: https://cartagespa.com/
```

### 11.3 Test dans le Navigateur

1. **Aller sur** : `http://cartagespa.com`
2. **Vérifier** : Redirection automatique vers `https://cartagespa.com`
3. **Vérifier** : Cadenas vert dans la barre d'adresse
4. **Tester** : Connexion Google Auth
5. **Tester** : Création de listing
6. **Tester** : Upload d'images

---

## 🔄 Étape 12 : Vérifier le Renouvellement Automatique

```bash
# Tester le renouvellement (dry-run)
certbot renew --dry-run

# Devrait afficher : "The dry run was successful"

# Vérifier le timer
systemctl status certbot.timer

# Devrait être : active (running)
```

**Le renouvellement se fait automatiquement 2 fois par jour.**

---

## 📋 Checklist Complète

### Installation
- [ ] Certbot installé
- [ ] Certificats SSL générés
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

### Renouvellement
- [ ] Renouvellement testé : `certbot renew --dry-run`
- [ ] Timer actif : `systemctl status certbot.timer`

---

## 🆘 Dépannage Rapide

### Problème : Certbot ne peut pas accéder au port 80

**Solution** :
```bash
# Vérifier que Nginx système fonctionne
systemctl status nginx

# Vérifier le port 80
netstat -tuln | grep :80

# Vérifier firewall
ufw status
ufw allow 80/tcp
ufw allow 443/tcp
```

### Problème : "SSL certificate not found" dans Nginx Docker

**Solution** :
```bash
# Vérifier que le volume est monté
docker compose exec nginx ls -la /etc/letsencrypt/live/cartagespa.com/

# Vérifier docker-compose.yml
cat docker-compose.yml | grep letsencrypt
```

### Problème : Erreur "Mixed Content"

**Solution** :
- Vérifier que `VITE_API_URL` utilise `https://`
- Vérifier que les images Supabase sont en HTTPS
- Vérifier la console du navigateur pour les erreurs

---

## 🎯 Résumé

**Étapes principales** :
1. ✅ DNS vérifié (TERMINÉ)
2. Installer Certbot
3. Générer les certificats SSL
4. Transférer les fichiers modifiés
5. Configurer Nginx Docker
6. Mettre à jour Supabase
7. Mettre à jour les variables
8. Tester

**Temps estimé** : 30-45 minutes

**Résultat** : Site accessible en HTTPS avec redirection automatique HTTP → HTTPS

