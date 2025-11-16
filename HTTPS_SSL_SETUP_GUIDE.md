# 🔒 Guide Complet - Configuration HTTPS/SSL avec Certbot

## 📋 Vue d'Ensemble

Ce guide vous permet de configurer HTTPS/SSL pour votre site `cartagespa.com` en utilisant Let's Encrypt (Certbot) avec votre configuration Docker/Nginx.

**Temps estimé** : 30-45 minutes  
**Difficulté** : Moyenne  
**Prérequis** : DNS configuré et pointant vers le serveur

---

## ✅ Prérequis

Avant de commencer, vérifiez que :

1. ✅ **DNS configuré** : `cartagespa.com` et `www.cartagespa.com` pointent vers `89.147.111.166`
2. ✅ **Port 80 accessible** : Le site fonctionne en HTTP
3. ✅ **Port 443 ouvert** : Le firewall permet le trafic HTTPS
4. ✅ **Accès SSH** : Vous pouvez vous connecter au serveur

**Vérification DNS** :
```bash
# Depuis votre machine locale
nslookup cartagespa.com
nslookup www.cartagespa.com

# Les deux doivent retourner : 89.147.111.166
```

**Vérification Port 80** :
```bash
# Tester depuis votre navigateur
http://cartagespa.com
# Doit afficher votre site
```

---

## 🚀 Étape 1 : Installer Certbot

**Sur le serveur (via SSH)** :

```bash
# Se connecter au serveur
ssh -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" root@89.147.111.166

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

## 🔧 Étape 2 : Préparer Nginx pour Certbot

**⚠️ IMPORTANT** : Certbot doit pouvoir accéder à Nginx pour la validation.

### 2.1 Vérifier que Nginx fonctionne

```bash
# Vérifier que Nginx Docker fonctionne
docker compose ps nginx

# Vérifier les logs
docker compose logs nginx

# Tester l'accès HTTP
curl -I http://cartagespa.com
```

**Résultat attendu** : `HTTP/1.1 200 OK`

### 2.2 Arrêter temporairement Nginx Docker (si nécessaire)

**Si Certbot ne peut pas accéder à Nginx** :

```bash
# Arrêter Nginx Docker temporairement
docker compose stop nginx

# Installer Nginx système (temporaire, pour Certbot)
apt install nginx -y

# Démarrer Nginx système
systemctl start nginx
systemctl enable nginx
```

**⚠️ Note** : Nous utiliserons Nginx système uniquement pour obtenir les certificats, puis nous reviendrons à Docker.

---

## 📜 Étape 3 : Créer Configuration Nginx Temporaire

**Pour que Certbot fonctionne, nous devons créer une configuration Nginx système** :

```bash
# Créer le répertoire de configuration
mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled

# Créer la configuration Nginx pour Certbot
cat > /etc/nginx/sites-available/cartagespa.com <<EOF
server {
    listen 80;
    server_name cartagespa.com www.cartagespa.com;

    # Pour la validation Certbot
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Redirection temporaire vers le Docker (si Nginx Docker fonctionne)
    # OU proxy vers Docker
    location / {
        proxy_pass http://localhost:3000;  # Port du frontend Docker
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Activer la configuration
ln -s /etc/nginx/sites-available/cartagespa.com /etc/nginx/sites-enabled/

# Supprimer la configuration par défaut
rm -f /etc/nginx/sites-enabled/default

# Tester la configuration
nginx -t

# Recharger Nginx
systemctl reload nginx
```

---

## 🔐 Étape 4 : Générer les Certificats SSL

### 4.1 Générer les Certificats

```bash
# Générer les certificats SSL
certbot --nginx -d cartagespa.com -d www.cartagespa.com
```

**Réponses aux questions** :

1. **Email address** : Entrer votre email (pour les notifications de renouvellement)
   ```
   your-email@example.com
   ```

2. **Terms of Service** : Accepter
   ```
   (A)gree
   ```

3. **Share email** : Votre choix (Y/N)
   ```
   (Y)es ou (N)o
   ```

4. **Redirect HTTP to HTTPS** : **OUI** (recommandé)
   ```
   (2) Redirect - Make all requests redirect to secure HTTPS access
   ```

**Résultat attendu** :
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/cartagespa.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/cartagespa.com/privkey.pem
```

### 4.2 Vérifier les Certificats

```bash
# Vérifier que les certificats existent
ls -la /etc/letsencrypt/live/cartagespa.com/

# Devrait afficher :
# - fullchain.pem (certificat complet)
# - privkey.pem (clé privée)
# - cert.pem (certificat)
# - chain.pem (chaîne)
```

---

## 🐳 Étape 5 : Configurer Nginx Docker pour HTTPS

### 5.1 Modifier le Script Nginx

**Le script `start-nginx-with-ips.sh` doit être modifié pour supporter HTTPS** :

```bash
# Sur le serveur
cd "/root/site Web"

# Créer une sauvegarde
cp nginx/start-nginx-with-ips.sh nginx/start-nginx-with-ips.sh.backup
```

**Modifier le fichier** `nginx/start-nginx-with-ips.sh` :

```bash
nano nginx/start-nginx-with-ips.sh
```

**Remplacer le contenu par** :

```bash
#!/bin/sh
# Wait for services and get IPs using getent (DNS lookup in Docker network)

echo "Waiting for services to be ready..."

# Wait for frontend to be reachable via DNS
TIMEOUT=60
ELAPSED=0
until getent hosts frontend > /dev/null 2>&1; do
  if [ $ELAPSED -ge $TIMEOUT ]; then
    echo "ERROR: Timeout waiting for frontend DNS after ${TIMEOUT}s"
    break
  fi
  echo "Waiting for frontend DNS... (${ELAPSED}s/${TIMEOUT}s)"
  sleep 2
  ELAPSED=$((ELAPSED + 2))
done

# Wait for backend to be reachable via DNS
ELAPSED=0
until getent hosts backend > /dev/null 2>&1; do
  if [ $ELAPSED -ge $TIMEOUT ]; then
    echo "ERROR: Timeout waiting for backend DNS after ${TIMEOUT}s"
    break
  fi
  echo "Waiting for backend DNS... (${ELAPSED}s/${TIMEOUT}s)"
  sleep 2
  ELAPSED=$((ELAPSED + 2))
done

# Get IPs using getent (works in Docker network)
FRONTEND_IP=$(getent hosts frontend | awk '{print $1}' | head -1)
BACKEND_IP=$(getent hosts backend | awk '{print $1}' | head -1)

if [ -z "$FRONTEND_IP" ] || [ -z "$BACKEND_IP" ]; then
  echo "ERROR: Could not get IPs for services"
  echo "Frontend IP: $FRONTEND_IP"
  echo "Backend IP: $BACKEND_IP"
  echo "Trying to use service names directly..."
  FRONTEND_IP="frontend"
  BACKEND_IP="backend"
fi

echo "Frontend IP: $FRONTEND_IP"
echo "Backend IP: $BACKEND_IP"

# Create nginx config with IPs and HTTPS
cat > /etc/nginx/nginx.conf <<EOF
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;

    # HTTP server - Redirect to HTTPS
    server {
        listen 80;
        server_name cartagespa.com www.cartagespa.com 89.147.111.166;
        
        # Allow Let's Encrypt validation
        location /.well-known/acme-challenge/ {
            root /var/www/html;
        }
        
        # Redirect all other traffic to HTTPS
        location / {
            return 301 https://\$server_name\$request_uri;
        }
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name cartagespa.com www.cartagespa.com;

        # SSL certificates (mounted from host)
        ssl_certificate /etc/letsencrypt/live/cartagespa.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/cartagespa.com/privkey.pem;

        # SSL configuration (secure)
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;

        # Frontend (React build)
        location / {
            proxy_pass http://${FRONTEND_IP}:80;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_set_header X-Forwarded-Host \$host;
            proxy_set_header X-Forwarded-Port \$server_port;
        }

        # Backend API
        location /api {
            proxy_pass http://${BACKEND_IP}:8000;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_set_header X-Forwarded-Host \$host;
            proxy_set_header X-Forwarded-Port \$server_port;
        }

        # Health check
        location /health {
            proxy_pass http://${BACKEND_IP}:8000/health;
        }
    }

    # Default server block - catch all other requests
    server {
        listen 80 default_server;
        server_name _;

        # Return 444 (close connection) for unmatched Host headers
        return 444;
    }
}
EOF

echo "Nginx configuration created with HTTPS"
echo "Starting nginx..."

# Test configuration
nginx -t

# Start nginx
exec nginx -g 'daemon off;'
```

### 5.2 Transférer le Script Modifié

**Depuis Windows** :

```powershell
# Transférer le script modifié
$SSH_KEY = "C:\Users\Malek\Desktop\config site web\1984_hosting_key"
$SERVER = "root@89.147.111.166"
scp -i $SSH_KEY "nginx\start-nginx-with-ips.sh" "${SERVER}:/root/site Web/nginx/start-nginx-with-ips.sh"
```

---

## 🔄 Étape 6 : Mettre à Jour Docker Compose

### 6.1 Ajouter le Volume pour les Certificats

**Modifier `docker-compose.yml`** :

```yaml
nginx:
  image: nginx:alpine
  container_name: cartagespa-nginx
  restart: unless-stopped
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx/ssl:/etc/nginx/ssl:ro
    - ./nginx/start-nginx-with-ips.sh:/start-nginx.sh:ro
    - /var/run/docker.sock:/var/run/docker.sock:ro
    - /etc/letsencrypt:/etc/letsencrypt:ro  # ← AJOUTER CETTE LIGNE
  depends_on:
    backend:
      condition: service_healthy
    frontend:
      condition: service_healthy
  networks:
    - cartagespa-network
  command: ["sh", "/start-nginx.sh"]
  entrypoint: []
```

### 6.2 Transférer le Fichier Modifié

**Depuis Windows** :

```powershell
# Transférer docker-compose.yml
scp -i $SSH_KEY "docker-compose.yml" "${SERVER}:/root/site Web/docker-compose.yml"
```

---

## 🛑 Étape 7 : Arrêter Nginx Système et Redémarrer Docker

**Sur le serveur** :

```bash
# Arrêter Nginx système
systemctl stop nginx
systemctl disable nginx

# Redémarrer Docker Compose
cd "/root/site Web"
docker compose down
docker compose up -d

# Vérifier les logs
docker compose logs -f nginx
```

**Vérifier que HTTPS fonctionne** :

```bash
# Tester HTTPS
curl -I https://cartagespa.com

# Devrait retourner : HTTP/2 200
```

---

## 🔧 Étape 8 : Configurer le Renouvellement Automatique

**Les certificats Let's Encrypt expirent après 90 jours. Certbot les renouvelle automatiquement.**

### 8.1 Tester le Renouvellement

```bash
# Tester le renouvellement (dry-run)
certbot renew --dry-run

# Devrait afficher : "The dry run was successful"
```

### 8.2 Vérifier le Timer

```bash
# Vérifier que le service de renouvellement est actif
systemctl status certbot.timer

# Devrait être : active (running)
```

**Le renouvellement se fait automatiquement 2 fois par jour. Si un certificat expire dans moins de 30 jours, il sera renouvelé automatiquement.**

---

## 🔄 Étape 9 : Mettre à Jour Supabase pour HTTPS

### 9.1 Mettre à Jour Site URL

**Dans Supabase Dashboard** :

1. Aller dans **Authentication → Settings**
2. Section **"URL Configuration"**
3. **Site URL** : Changer de `http://cartagespa.com` à `https://cartagespa.com`
4. Cliquer sur **"Save"**

### 9.2 Mettre à Jour Redirect URLs

**Dans Supabase Dashboard** :

1. Section **"Redirect URLs"**
2. **Ajouter** (garder aussi les HTTP pour localhost) :
   - `https://cartagespa.com/auth/callback`
   - `https://cartagespa.com/**`
   - `https://www.cartagespa.com/auth/callback`
   - `https://www.cartagespa.com/**`
3. **Garder** (pour développement local) :
   - `http://localhost:5173/auth/callback`
   - `http://localhost:5174/auth/callback`
4. Cliquer sur **"Save"**

---

## 🔧 Étape 10 : Mettre à Jour les Variables d'Environnement

### 10.1 Mettre à Jour `.env` sur le Serveur

**Sur le serveur** :

```bash
# Éditer le fichier
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

### 10.2 Rebuild Frontend

```bash
# Rebuild frontend avec les nouvelles variables
docker compose build frontend

# Redémarrer
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

### 11.4 Vérifier le Certificat SSL

**Dans le navigateur** :
1. Cliquer sur le **cadenas** dans la barre d'adresse
2. Cliquer sur **"Certificate"**
3. Vérifier :
   - **Issued to** : `cartagespa.com`
   - **Issued by** : `Let's Encrypt`
   - **Valid until** : (date dans 90 jours)

---

## 📋 Checklist Complète

### Installation
- [ ] Certbot installé
- [ ] Certificats SSL générés
- [ ] Certificats vérifiés dans `/etc/letsencrypt/live/cartagespa.com/`

### Configuration Nginx
- [ ] Script `start-nginx-with-ips.sh` modifié pour HTTPS
- [ ] `docker-compose.yml` mis à jour avec volume `/etc/letsencrypt`
- [ ] Nginx Docker redémarré
- [ ] HTTPS fonctionne : `https://cartagespa.com`

### Redirection
- [ ] HTTP → HTTPS redirection fonctionne
- [ ] Test : `http://cartagespa.com` redirige vers `https://`

### Supabase
- [ ] Site URL changé : `https://cartagespa.com`
- [ ] Redirect URLs HTTPS ajoutées
- [ ] Localhost URLs gardées en HTTP

### Variables d'Environnement
- [ ] `.env` mis à jour : `VITE_API_URL=https://...`
- [ ] `CORS_ORIGINS` mis à jour avec HTTPS
- [ ] Frontend rebuild avec nouvelles variables

### Tests
- [ ] HTTPS fonctionne dans le navigateur
- [ ] Cadenas vert visible
- [ ] Google Auth fonctionne avec HTTPS
- [ ] API calls fonctionnent
- [ ] Upload d'images fonctionne

### Renouvellement
- [ ] Renouvellement automatique testé : `certbot renew --dry-run`
- [ ] Timer Certbot actif : `systemctl status certbot.timer`

---

## 🆘 Dépannage

### Problème 1 : "Failed to obtain certificate"

**Causes possibles** :
- DNS pas encore propagé
- Port 80 bloqué par firewall
- Nginx ne répond pas sur le port 80

**Solutions** :
```bash
# Vérifier DNS
nslookup cartagespa.com

# Vérifier port 80
netstat -tuln | grep :80

# Vérifier firewall
ufw status
ufw allow 80/tcp
ufw allow 443/tcp
```

### Problème 2 : "Nginx not found" lors de Certbot

**Solution** :
```bash
# Installer Nginx système temporairement
apt install nginx -y
systemctl start nginx

# Relancer Certbot
certbot --nginx -d cartagespa.com -d www.cartagespa.com
```

### Problème 3 : "SSL certificate not found" dans Nginx Docker

**Solution** :
```bash
# Vérifier que le volume est monté
docker compose exec nginx ls -la /etc/letsencrypt/live/cartagespa.com/

# Vérifier docker-compose.yml
# Le volume doit être : /etc/letsencrypt:/etc/letsencrypt:ro
```

### Problème 4 : "Mixed Content" (HTTP/HTTPS)

**Solution** :
- Vérifier que toutes les ressources sont chargées en HTTPS
- Vérifier que `VITE_API_URL` utilise `https://`
- Vérifier que les images Supabase sont en HTTPS

### Problème 5 : Certificat expire bientôt

**Solution** :
```bash
# Renouveler manuellement
certbot renew

# Vérifier le timer
systemctl status certbot.timer
```

---

## 📚 Commandes Utiles

### Vérifier les Certificats

```bash
# Liste des certificats
certbot certificates

# Détails d'un certificat
openssl x509 -in /etc/letsencrypt/live/cartagespa.com/cert.pem -text -noout
```

### Renouveler les Certificats

```bash
# Renouvellement manuel
certbot renew

# Test de renouvellement
certbot renew --dry-run
```

### Vérifier Nginx

```bash
# Tester la configuration
docker compose exec nginx nginx -t

# Recharger Nginx
docker compose exec nginx nginx -s reload
```

### Logs

```bash
# Logs Nginx
docker compose logs nginx

# Logs Certbot
journalctl -u certbot.timer -f
```

---

## 🎯 Résumé

**Étapes principales** :
1. ✅ Installer Certbot
2. ✅ Générer les certificats SSL
3. ✅ Modifier Nginx pour HTTPS
4. ✅ Mettre à jour Docker Compose
5. ✅ Redémarrer les services
6. ✅ Mettre à jour Supabase
7. ✅ Mettre à jour les variables d'environnement
8. ✅ Tester et vérifier

**Résultat** : Site accessible en HTTPS avec redirection automatique HTTP → HTTPS

**Renouvellement** : Automatique (Certbot renouvelle les certificats tous les 90 jours)

---

## 📝 Notes Importantes

1. **Garder localhost en HTTP** : Les URLs `http://localhost:5173` et `http://localhost:5174` doivent rester en HTTP pour le développement local.

2. **Renouvellement automatique** : Certbot renouvelle automatiquement les certificats. Vérifiez que le timer fonctionne : `systemctl status certbot.timer`

3. **Backup** : Les certificats sont dans `/etc/letsencrypt/`. Faites un backup régulier.

4. **Sécurité** : Les certificats Let's Encrypt sont valides 90 jours et sont renouvelés automatiquement.

---

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifier les logs : `docker compose logs nginx`
2. Vérifier les certificats : `certbot certificates`
3. Tester la configuration : `docker compose exec nginx nginx -t`
4. Vérifier DNS : `nslookup cartagespa.com`

