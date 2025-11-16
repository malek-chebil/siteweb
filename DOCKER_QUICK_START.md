# 🐳 Déploiement Docker - Guide Rapide

## ⚡ Déploiement en 5 Minutes

### 1. Installer Docker sur le VPS

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt install docker-compose-plugin -y
```

### 2. Transférer le Code (sans node_modules/venv)

```powershell
# Sur Windows - transférer seulement le code source
scp -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" -r "C:\Users\Malek\Desktop\site Web" root@89.147.111.166:/root/ --exclude "node_modules" --exclude "venv"
```

**Note:** SCP standard ne supporte pas --exclude. Utilisez rsync ou transférez manuellement les dossiers importants.

### 3. Créer le fichier .env

```bash
cd /root/site\ Web
cp .env.example .env
nano .env
# Remplir avec vos vraies valeurs
```

### 4. Build et Démarrer

```bash
# Build les images (5-10 minutes première fois)
docker compose build

# Démarrer les services
docker compose up -d

# Vérifier
docker compose ps
docker compose logs -f
```

### 5. Configurer SSL (après DNS)

```bash
# Arrêter nginx temporairement
docker compose stop nginx

# Obtenir le certificat
certbot certonly --standalone -d cartagespa.com -d www.cartagespa.com

# Copier les certificats
mkdir -p nginx/ssl
cp /etc/letsencrypt/live/cartagespa.com/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/cartagespa.com/privkey.pem nginx/ssl/

# Redémarrer
docker compose up -d nginx
```

## ✅ C'est Tout!

Votre application est maintenant déployée et optimisée avec Docker!

---

## 🔄 Commandes Utiles

```bash
# Voir les logs
docker compose logs -f

# Redémarrer
docker compose restart

# Mettre à jour
docker compose down
docker compose build
docker compose up -d

# Arrêter
docker compose down
```

---

**Voir `DOCKER_DEPLOYMENT_GUIDE.md` pour plus de détails!**

