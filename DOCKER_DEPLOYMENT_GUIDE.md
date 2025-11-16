# 🐳 Guide de Déploiement Docker - Optimisé

## 🚀 Avantages de Docker

- ✅ **Déploiement rapide** : Build une fois, déployez partout
- ✅ **Environnements isolés** : Pas de conflits de dépendances
- ✅ **Configuration simple** : Un seul fichier `docker-compose.yml`
- ✅ **Meilleures performances** : Containers optimisés
- ✅ **Mises à jour faciles** : Rebuild et redémarrage rapide
- ✅ **Scalabilité** : Facile d'ajouter plus de containers

---

## 📋 Prérequis

### Sur le VPS

```bash
# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Installer Docker Compose
apt install docker-compose-plugin -y

# Vérifier l'installation
docker --version
docker compose version

# Ajouter votre utilisateur au groupe docker (si nécessaire)
usermod -aG docker root
```

---

## 📦 ÉTAPE 1: Préparer les Fichiers

### 1.1 Transférer le Code (sans node_modules/venv)

```bash
# Sur Windows, transférer sans les gros dossiers
# Utilisez rsync ou créez une archive sans node_modules/venv
```

### 1.2 Créer le fichier .env à la racine

```bash
# Sur le serveur
cd /root/site\ Web
nano .env
```

**Contenu du fichier `.env`:**

```env
# Database
DATABASE_URL=postgresql+asyncpg://postgres:VOTRE_MOT_DE_PASSE@db.xxx.supabase.co:5432/postgres

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_JWT_SECRET=votre_jwt_secret

# CORS
CORS_ORIGINS=https://cartagespa.com,http://localhost:5173

# Frontend
VITE_API_URL=https://cartagespa.com/api/v1
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anon

# Debug
DEBUG=false
```

---

## 🐳 ÉTAPE 2: Build et Démarrage

### 2.1 Build les Images

```bash
cd /root/site\ Web

# Build toutes les images
docker compose build

# Ou build une seule image
docker compose build backend
docker compose build frontend
```

**Temps estimé:** 5-10 minutes (première fois)

### 2.2 Démarrer les Containers

```bash
# Démarrer tous les services
docker compose up -d

# Vérifier le statut
docker compose ps

# Voir les logs
docker compose logs -f
```

### 2.3 Vérifier que Tout Fonctionne

```bash
# Vérifier les containers
docker ps

# Tester le backend
curl http://localhost:8000/health

# Tester le frontend
curl http://localhost:80
```

---

## 🔐 ÉTAPE 3: Configurer SSL (Let's Encrypt)

### 3.1 Installer Certbot

```bash
apt install certbot -y
```

### 3.2 Obtenir le Certificat

```bash
# Arrêter temporairement nginx dans docker
docker compose stop nginx

# Obtenir le certificat
certbot certonly --standalone -d cartagespa.com -d www.cartagespa.com

# Les certificats seront dans /etc/letsencrypt/live/cartagespa.com/
```

### 3.3 Copier les Certificats

```bash
# Créer le dossier ssl
mkdir -p /root/site\ Web/nginx/ssl

# Copier les certificats
cp /etc/letsencrypt/live/cartagespa.com/fullchain.pem /root/site\ Web/nginx/ssl/
cp /etc/letsencrypt/live/cartagespa.com/privkey.pem /root/site\ Web/nginx/ssl/

# Redémarrer nginx
docker compose up -d nginx
```

---

## 🔄 ÉTAPE 4: Commandes Utiles

### Voir les Logs

```bash
# Tous les services
docker compose logs -f

# Un service spécifique
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx
```

### Redémarrer les Services

```bash
# Redémarrer tous les services
docker compose restart

# Redémarrer un service
docker compose restart backend
```

### Mettre à Jour l'Application

```bash
# 1. Arrêter les containers
docker compose down

# 2. Pull les nouveaux fichiers (ou transférer)
# 3. Rebuild les images
docker compose build

# 4. Redémarrer
docker compose up -d
```

### Arrêter les Services

```bash
# Arrêter sans supprimer
docker compose stop

# Arrêter et supprimer les containers
docker compose down

# Arrêter et supprimer tout (containers + volumes)
docker compose down -v
```

---

## 📊 Monitoring

### Vérifier l'Utilisation des Ressources

```bash
# Utilisation des ressources
docker stats

# Espace disque utilisé
docker system df
```

### Health Checks

```bash
# Vérifier la santé des containers
docker compose ps

# Tester manuellement
curl http://localhost:8000/health
```

---

## 🆘 Dépannage

### Container ne démarre pas

```bash
# Voir les logs d'erreur
docker compose logs backend

# Vérifier la configuration
docker compose config

# Rebuild depuis zéro
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Problème de permissions

```bash
# Vérifier les permissions des fichiers
ls -la /root/site\ Web/

# Corriger si nécessaire
chmod -R 755 /root/site\ Web/
```

### Problème de réseau

```bash
# Vérifier le réseau Docker
docker network ls
docker network inspect site-web_cartagespa-network
```

---

## ⚡ Optimisations de Performance

### 1. Multi-stage Build (déjà implémenté)

Les Dockerfiles utilisent des builds multi-stage pour réduire la taille des images.

### 2. Cache des Layers

Docker cache automatiquement les layers, donc les rebuilds sont plus rapides.

### 3. Health Checks

Les containers ont des health checks pour redémarrer automatiquement en cas de problème.

### 4. Restart Policies

Tous les containers ont `restart: unless-stopped` pour redémarrer automatiquement.

---

## 📝 Checklist de Déploiement

- [ ] Docker installé sur le VPS
- [ ] Docker Compose installé
- [ ] Code transféré sur le serveur
- [ ] Fichier `.env` créé avec les bonnes variables
- [ ] Images Docker buildées
- [ ] Containers démarrés
- [ ] Backend accessible (health check)
- [ ] Frontend accessible
- [ ] SSL configuré
- [ ] DNS pointant vers le VPS
- [ ] Site accessible via HTTPS

---

## 🎯 Avantages vs Déploiement Classique

| Aspect | Classique | Docker |
|--------|-----------|--------|
| Temps de déploiement | 30-60 min | 10-15 min |
| Configuration | Complexe | Simple (1 fichier) |
| Mises à jour | Manuelles | `docker compose up -d` |
| Isolation | Problèmes de dépendances | Parfaite |
| Scalabilité | Difficile | Facile |
| Rollback | Difficile | `docker compose down` + rebuild |

---

**Félicitations! Votre application est maintenant dockerisée et optimisée! 🚀**

