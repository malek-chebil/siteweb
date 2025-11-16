# ⚡ Guide Rapide - Configuration HTTPS

## 🎯 Vue d'Ensemble

Guide rapide pour configurer HTTPS avec Certbot sur votre serveur Docker.

**Temps** : 30-45 minutes

---

## 📋 Étapes Rapides

### 1. Installer Certbot

```bash
ssh -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" root@89.147.111.166

apt update
apt install certbot python3-certbot-nginx -y
```

### 2. Générer les Certificats

```bash
# Arrêter Nginx Docker temporairement
cd "/root/site Web"
docker compose stop nginx

# Installer Nginx système (temporaire)
apt install nginx -y
systemctl start nginx

# Créer configuration Nginx pour Certbot
cat > /etc/nginx/sites-available/cartagespa.com <<EOF
server {
    listen 80;
    server_name cartagespa.com www.cartagespa.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
    }
}
EOF

ln -s /etc/nginx/sites-available/cartagespa.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# Générer les certificats
certbot --nginx -d cartagespa.com -d www.cartagespa.com

# Réponses :
# - Email : votre email
# - Terms : (A)gree
# - Share email : (Y)es ou (N)o
# - Redirect : (2) Redirect to HTTPS
```

### 3. Transférer les Fichiers Modifiés

**Depuis Windows** :

```powershell
$SSH_KEY = "C:\Users\Malek\Desktop\config site web\1984_hosting_key"
$SERVER = "root@89.147.111.166"

# Transférer le script Nginx HTTPS
scp -i $SSH_KEY "nginx\start-nginx-with-ips-https.sh" "${SERVER}:/root/site Web/nginx/start-nginx-with-ips-https.sh"

# Transférer docker-compose mis à jour
scp -i $SSH_KEY "docker-compose-https.yml" "${SERVER}:/root/site Web/docker-compose.yml"
```

### 4. Configurer sur le Serveur

**Sur le serveur** :

```bash
# Renommer le script
cd "/root/site Web"
mv nginx/start-nginx-with-ips-https.sh nginx/start-nginx-with-ips.sh
chmod +x nginx/start-nginx-with-ips.sh

# Arrêter Nginx système
systemctl stop nginx
systemctl disable nginx

# Redémarrer Docker
docker compose down
docker compose up -d

# Vérifier
docker compose logs nginx
curl -I https://cartagespa.com
```

### 5. Mettre à Jour Supabase

**Dans Supabase Dashboard** :

1. **Authentication → Settings** :
   - **Site URL** : `https://cartagespa.com`
   - **Redirect URLs** : Ajouter :
     - `https://cartagespa.com/auth/callback`
     - `https://cartagespa.com/**`
     - `https://www.cartagespa.com/auth/callback`
     - `https://www.cartagespa.com/**`

### 6. Mettre à Jour `.env`

**Sur le serveur** :

```bash
nano "/root/site Web/.env"
```

**Changer** :
```env
VITE_API_URL=https://cartagespa.com/api/v1
CORS_ORIGINS=https://cartagespa.com,https://www.cartagespa.com,http://localhost:5173,http://localhost:5174
```

**Rebuild** :
```bash
docker compose build frontend
docker compose up -d
```

### 7. Tester

```bash
# Tester HTTPS
curl -I https://cartagespa.com

# Tester redirection
curl -I http://cartagespa.com
```

---

## ✅ Checklist

- [ ] Certbot installé
- [ ] Certificats générés
- [ ] Script Nginx HTTPS transféré
- [ ] docker-compose.yml mis à jour
- [ ] Nginx Docker redémarré
- [ ] HTTPS fonctionne
- [ ] Supabase mis à jour
- [ ] `.env` mis à jour
- [ ] Frontend rebuild

---

## 📚 Guide Complet

Pour plus de détails, voir : `HTTPS_SSL_SETUP_GUIDE.md`

