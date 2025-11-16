# 🐳 Guide Étape par Étape - Déploiement Docker

## 📋 Vue d'Ensemble

Ce guide vous mènera du début à la fin pour déployer votre application avec Docker sur votre VPS.

**Temps total estimé:** 15-20 minutes

---

## ✅ ÉTAPE 1: Installer Docker sur le VPS (5 minutes)

### 1.1 Se Connecter au Serveur

```bash
# Depuis Windows PowerShell (avec VPN connecté)
ssh -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" root@89.147.111.166
```

### 1.2 Installer Docker

```bash
# Télécharger le script d'installation Docker
curl -fsSL https://get.docker.com -o get-docker.sh

# Exécuter le script
sh get-docker.sh

# Installer Docker Compose
apt install docker-compose-plugin -y

# Vérifier l'installation
docker --version
docker compose version
```

**Résultat attendu:**
```
Docker version 24.x.x
Docker Compose version v2.x.x
```

### 1.3 Vérifier que Docker Fonctionne

```bash
# Tester Docker
docker run hello-world

# Vérifier que le service Docker est actif
systemctl status docker
```

**Résultat attendu:** Vous devriez voir "Hello from Docker!" et le service Docker "active (running)".

---

## ✅ ÉTAPE 2: Transférer les Nouveaux Fichiers Docker (5 minutes)

### 2.1 Sur Windows - Transférer les Fichiers Docker

**Option A: Transférer seulement les nouveaux fichiers (recommandé)**

```powershell
# Depuis PowerShell (avec VPN connecté)
# Transférer les fichiers Docker
scp -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" docker-compose.yml root@89.147.111.166:/root/site\ Web/

scp -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" backend/Dockerfile root@89.147.111.166:/root/site\ Web/backend/

scp -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" frontend/Dockerfile root@89.147.111.166:/root/site\ Web/frontend/

# Créer le dossier nginx
ssh -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" root@89.147.111.166 "mkdir -p /root/site\ Web/nginx"

scp -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" nginx/nginx.conf root@89.147.111.166:/root/site\ Web/nginx/
```

**Option B: Transférer tout le projet (si vous préférez)**

```powershell
# Transférer tout le projet (sans node_modules/venv si possible)
scp -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" -r "C:\Users\Malek\Desktop\site Web" root@89.147.111.166:/root/
```

### 2.2 Sur le Serveur - Vérifier les Fichiers

```bash
# Vérifier que les fichiers sont là
cd /root/site\ Web
ls -la

# Vérifier les Dockerfiles
ls -la backend/Dockerfile
ls -la frontend/Dockerfile
ls -la docker-compose.yml
ls -la nginx/nginx.conf
```

**Résultat attendu:** Tous les fichiers doivent être présents.

---

## ✅ ÉTAPE 3: Créer le Fichier .env (2 minutes)

### 3.1 Créer le Fichier .env

```bash
# Aller dans le dossier du projet
cd /root/site\ Web

# Créer le fichier .env
nano .env
```

### 3.2 Remplir le Fichier .env

**Collez ce contenu (remplacez avec vos vraies valeurs):**

```env
# Database
DATABASE_URL=postgresql+asyncpg://postgres:VOTRE_MOT_DE_PASSE@db.xxx.supabase.co:5432/postgres

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=votre_cle_anon_ici
SUPABASE_JWT_SECRET=votre_jwt_secret_ici

# CORS
CORS_ORIGINS=https://cartagespa.com,http://localhost:5173

# Frontend Build Variables
VITE_API_URL=https://cartagespa.com/api/v1
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anon_ici

# Debug
DEBUG=false
```

**Pour sauvegarder dans nano:**
- Appuyez sur `Ctrl + O` (sauvegarder)
- Appuyez sur `Enter` (confirmer)
- Appuyez sur `Ctrl + X` (quitter)

### 3.3 Vérifier le Fichier .env

```bash
# Vérifier que le fichier est créé
cat .env
```

---

## ✅ ÉTAPE 4: Build les Images Docker (5-10 minutes)

### 4.1 Build le Backend

```bash
# Aller dans le dossier du projet
cd /root/site\ Web

# Build l'image backend
docker compose build backend
```

**Temps estimé:** 3-5 minutes (première fois)

**Résultat attendu:** Vous verrez "Successfully built" et "Successfully tagged" à la fin.

### 4.2 Build le Frontend

```bash
# Build l'image frontend
docker compose build frontend
```

**Temps estimé:** 2-5 minutes (première fois)

**Résultat attendu:** Vous verrez "Successfully built" et "Successfully tagged" à la fin.

### 4.3 Build Tout en Une Fois (Alternative)

```bash
# Build toutes les images en une fois
docker compose build
```

**Temps estimé:** 5-10 minutes (première fois)

---

## ✅ ÉTAPE 5: Démarrer les Services (2 minutes)

### 5.1 Démarrer les Containers

```bash
# Démarrer tous les services en arrière-plan
docker compose up -d
```

**Résultat attendu:** Vous devriez voir:
```
[+] Running 3/3
 ✔ Container cartagespa-backend   Started
 ✔ Container cartagespa-frontend  Started
 ✔ Container cartagespa-nginx     Started
```

### 5.2 Vérifier le Statut

```bash
# Vérifier que tous les containers sont en cours d'exécution
docker compose ps
```

**Résultat attendu:** Tous les containers doivent être "Up" et "healthy" (ou "running").

### 5.3 Voir les Logs

```bash
# Voir les logs de tous les services
docker compose logs -f
```

**Appuyez sur `Ctrl + C` pour quitter les logs.**

---

## ✅ ÉTAPE 6: Tester l'Application (2 minutes)

### 6.1 Tester le Backend

```bash
# Tester l'endpoint de santé
curl http://localhost:8000/health
```

**Résultat attendu:** `{"status":"ok"}`

### 6.2 Tester le Frontend

```bash
# Tester le frontend
curl http://localhost:3000
```

**Résultat attendu:** Code HTML de votre application React.

### 6.3 Tester depuis l'Extérieur

Ouvrez votre navigateur et allez à:
- `http://89.147.111.166:8000/health` - Backend health check
- `http://89.147.111.166:3000` - Frontend

---

## ✅ ÉTAPE 7: Configurer DNS (Njalla) (5 minutes)

### 7.1 Configurer les Enregistrements DNS

1. **Connectez-vous à Njalla**: https://njal.la
2. **Allez dans**: Domain Management → cartagespa.com → DNS
3. **Ajoutez/modifiez les enregistrements:**

```
Type    Name    Value           TTL
A       @       89.147.111.166   3600
A       www     89.147.111.166   3600
```

4. **Attendez la propagation DNS** (5-30 minutes)

### 7.2 Vérifier la Propagation DNS

```bash
# Vérifier que le DNS pointe vers votre IP
nslookup cartagespa.com
```

**Résultat attendu:** L'IP retournée doit être `89.147.111.166`.

---

## ✅ ÉTAPE 8: Configurer SSL avec Let's Encrypt (5 minutes)

### 8.1 Installer Certbot

```bash
# Installer Certbot
apt install certbot -y
```

### 8.2 Obtenir le Certificat SSL

**IMPORTANT:** Assurez-vous que le DNS est propagé avant cette étape!

```bash
# Arrêter temporairement nginx dans docker
docker compose stop nginx

# Obtenir le certificat SSL
certbot certonly --standalone -d cartagespa.com -d www.cartagespa.com
```

**Suivez les instructions:**
- Entrez votre email: `cartagespa@protonmail.com`
- Acceptez les termes (tapez `A`)
- Partagez l'email avec EFF? (tapez `N` ou `Y`)

**Résultat attendu:** "Successfully received certificate"

### 8.3 Copier les Certificats

```bash
# Créer le dossier ssl
mkdir -p /root/site\ Web/nginx/ssl

# Copier les certificats
cp /etc/letsencrypt/live/cartagespa.com/fullchain.pem /root/site\ Web/nginx/ssl/
cp /etc/letsencrypt/live/cartagespa.com/privkey.pem /root/site\ Web/nginx/ssl/

# Vérifier que les certificats sont là
ls -la /root/site\ Web/nginx/ssl/
```

### 8.4 Redémarrer Nginx

```bash
# Redémarrer nginx avec les certificats SSL
docker compose up -d nginx

# Vérifier le statut
docker compose ps nginx
docker compose logs nginx
```

---

## ✅ ÉTAPE 9: Test Final (2 minutes)

### 9.1 Tester HTTPS

Ouvrez votre navigateur et allez à:
- `https://cartagespa.com` - Vous devriez voir votre application avec un cadenas vert 🔒
- `https://cartagespa.com/api/v1/health` - Devrait retourner `{"status":"ok"}`

### 9.2 Vérifier que Tout Fonctionne

- [ ] Frontend accessible via HTTPS
- [ ] Backend API accessible via HTTPS
- [ ] SSL certificat valide (cadenas vert)
- [ ] Authentification fonctionne
- [ ] Upload d'images fonctionne (si applicable)

---

## 🆘 Dépannage

### Container ne démarre pas

```bash
# Voir les logs d'erreur
docker compose logs backend
docker compose logs frontend

# Vérifier la configuration
docker compose config

# Rebuild depuis zéro
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Problème de permissions

```bash
# Vérifier les permissions
ls -la /root/site\ Web/

# Corriger si nécessaire
chmod -R 755 /root/site\ Web/
```

### Backend ne répond pas

```bash
# Vérifier les logs
docker compose logs backend

# Vérifier que le container est en cours d'exécution
docker ps

# Redémarrer le backend
docker compose restart backend
```

### Frontend ne se build pas

```bash
# Vérifier les logs de build
docker compose build frontend --no-cache

# Vérifier que les variables d'environnement sont correctes
cat .env | grep VITE
```

---

## 🔄 Commandes Utiles

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

# 2. Transférer les nouveaux fichiers (via SCP)

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

### Vérifier l'Utilisation des Ressources

```bash
# Utilisation des ressources
docker stats

# Espace disque utilisé
docker system df
```

---

## ✅ Checklist Finale

### Installation
- [ ] Docker installé
- [ ] Docker Compose installé
- [ ] Fichiers Docker transférés
- [ ] Fichier `.env` créé avec les bonnes variables

### Build
- [ ] Image backend buildée
- [ ] Image frontend buildée
- [ ] Containers démarrés

### Configuration
- [ ] DNS configuré (Njalla)
- [ ] DNS propagé
- [ ] SSL certificat obtenu
- [ ] Certificats copiés dans nginx/ssl/

### Tests
- [ ] Backend accessible (health check)
- [ ] Frontend accessible
- [ ] HTTPS fonctionne
- [ ] SSL certificat valide
- [ ] Application fonctionnelle

---

## 🎉 Félicitations!

Votre application est maintenant déployée avec Docker et optimisée pour la performance!

**Temps total:** ~15-20 minutes (vs 30-60 minutes avec déploiement classique)

---

## 📚 Ressources

- **Guide complet:** `DOCKER_DEPLOYMENT_GUIDE.md`
- **Guide rapide:** `DOCKER_QUICK_START.md`
- **Documentation Docker:** https://docs.docker.com/

---

**Besoin d'aide?** Vérifiez les logs avec `docker compose logs -f` et consultez la section Dépannage ci-dessus.

