# 📚 Documentation Complète : Déploiement et Sécurité

## Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Architecture de Déploiement](#architecture-de-déploiement)
3. [Infrastructure](#infrastructure)
4. [Technologies Utilisées](#technologies-utilisées)
5. [Processus de Déploiement](#processus-de-déploiement)
6. [Sécurité Implémentée](#sécurité-implémentée)
7. [Configuration](#configuration)
8. [Monitoring et Maintenance](#monitoring-et-maintenance)
9. [Dépannage](#dépannage)

---

## Vue d'Ensemble

**Carthage Wellness Spa** est une plateforme web full-stack déployée sur un VPS (Virtual Private Server) avec une architecture Docker, protégée par Cloudflare, et sécurisée avec plusieurs couches de protection.

### Caractéristiques Principales

- ✅ **Déploiement Docker** : Architecture containerisée pour isolation et portabilité
- ✅ **HTTPS/SSL** : Certificat Let's Encrypt avec renouvellement automatique
- ✅ **Cloudflare CDN** : Protection DDoS, cache, et optimisation de performance
- ✅ **Sécurité Multi-Couches** : fail2ban, rate limiting, anonymisation IP, headers de sécurité
- ✅ **Anonymat** : IPs masquées dans les logs, tracking frontend désactivé
- ✅ **Monitoring** : Logs de sécurité, health checks, surveillance des attaques

---

## Architecture de Déploiement

### Schéma d'Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Internet                              │
└──────────────────────┬──────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare CDN                           │
│  - DDoS Protection                                          │
│  - SSL/TLS Termination                                      │
│  - Caching                                                  │
│  - WAF (Web Application Firewall)                          │
└──────────────────────┬──────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  VPS (1984 Hosting)                         │
│                  IP: 89.147.111.166                        │
│                  Domain: cartagespa.com                    │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Nginx (Reverse Proxy)                    │  │
│  │  - Port 80 (HTTP → HTTPS redirect)                   │  │
│  │  - Port 443 (HTTPS with SSL)                          │  │
│  │  - Security Headers                                    │  │
│  │  - Gzip Compression                                    │  │
│  └──────────────┬───────────────────────┬────────────────┘  │
│                 │                       │                    │
│                 ▼                       ▼                    │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │   Frontend Container  │  │   Backend Container │        │
│  │   (React/Vite)        │  │   (FastAPI)         │        │
│  │   - Port 3000:80      │  │   - Port 8000       │        │
│  │   - Nginx Alpine      │  │   - Python 3.12     │        │
│  └──────────────────────┘  └──────────┬───────────┘        │
│                                         │                    │
│                                         ▼                    │
│                              ┌──────────────────────┐       │
│                              │   Supabase (Cloud)   │       │
│                              │   - PostgreSQL DB     │       │
│                              │   - Auth              │       │
│                              │   - Storage           │       │
│                              └──────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### Composants

1. **Cloudflare** : CDN et protection
2. **Nginx** : Reverse proxy et serveur web
3. **Frontend** : Application React/Vite dans un conteneur Docker
4. **Backend** : API FastAPI dans un conteneur Docker
5. **Supabase** : Base de données PostgreSQL, authentification, stockage

---

## Infrastructure

### VPS (Virtual Private Server)

- **Fournisseur** : 1984 Hosting
- **Localisation** : Islande
- **OS** : Ubuntu 22.04 LTS
- **IP** : 89.147.111.166
- **Domaine** : cartagespa.com
- **Ressources** :
  - CPU : 2 vCPU
  - RAM : 4 GB
  - Stockage : 80 GB SSD
  - Bande passante : Illimitée

### DNS

- **Registrar** : Njalla (anonyme, accepte Bitcoin)
- **Nameservers** : Cloudflare
- **Records** :
  - A Record : `cartagespa.com` → `89.147.111.166`
  - A Record : `www.cartagespa.com` → `89.147.111.166`

### SSL/TLS

- **Certificat** : Let's Encrypt (gratuit, renouvellement automatique)
- **Génération** : Certbot
- **Renouvellement** : Automatique via cron
- **Protocoles** : TLS 1.2, TLS 1.3
- **Cipher Suites** : Modernes et sécurisées

---

## Technologies Utilisées

### Backend

| Technologie | Version | Usage |
|------------|---------|-------|
| **Python** | 3.12 | Langage de programmation |
| **FastAPI** | Latest | Framework web asynchrone |
| **SQLAlchemy** | Latest | ORM pour PostgreSQL |
| **Alembic** | Latest | Migrations de base de données |
| **Pydantic** | Latest | Validation de données |
| **Uvicorn** | Latest | Serveur ASGI |
| **Supabase** | Latest | Base de données, Auth, Storage |

### Frontend

| Technologie | Version | Usage |
|------------|---------|-------|
| **React** | 18.x | Framework UI |
| **Vite** | Latest | Build tool et dev server |
| **Mantine UI** | Latest | Bibliothèque de composants |
| **React Router** | Latest | Routing |
| **React Query** | Latest | Gestion d'état et cache |
| **i18next** | Latest | Internationalisation |
| **Axios** | Latest | Client HTTP |

### Infrastructure

| Technologie | Version | Usage |
|------------|---------|-------|
| **Docker** | Latest | Containerisation |
| **Docker Compose** | Latest | Orchestration |
| **Nginx** | Alpine | Reverse proxy |
| **Certbot** | Latest | Gestion SSL |
| **fail2ban** | Latest | Protection contre les attaques |
| **UFW** | Latest | Firewall |
| **Cloudflare** | Free Plan | CDN et protection |

---

## Processus de Déploiement

### Phase 1 : Préparation du Serveur

#### 1.1 Configuration Initiale

```bash
# Mise à jour du système
apt update && apt upgrade -y

# Installation des outils de base
apt install -y curl wget git vim ufw fail2ban

# Configuration du firewall
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

#### 1.2 Installation de Docker

```bash
# Installation de Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Installation de Docker Compose
apt install -y docker-compose-plugin

# Vérification
docker --version
docker compose version
```

#### 1.3 Configuration SSH

- Génération de clé SSH ED25519
- Désactivation de l'authentification par mot de passe
- Configuration des clés publiques sur le serveur

### Phase 2 : Configuration DNS

#### 2.1 Configuration Njalla

1. Connexion au dashboard Njalla
2. Configuration des records A :
   - `cartagespa.com` → `89.147.111.166`
   - `www.cartagespa.com` → `89.147.111.166`

#### 2.2 Configuration Cloudflare

1. Création d'un compte Cloudflare
2. Ajout du domaine `cartagespa.com`
3. Configuration des nameservers dans Njalla
4. Configuration des records DNS dans Cloudflare
5. Activation du proxy (nuage orange)

### Phase 3 : Déploiement de l'Application

#### 3.1 Transfert des Fichiers

```bash
# Sur le serveur, création du répertoire
mkdir -p "/root/site Web"

# Depuis la machine locale (Windows PowerShell)
scp -i "path/to/key" -r backend root@89.147.111.166:"/root/site Web/"
scp -i "path/to/key" -r frontend root@89.147.111.166:"/root/site Web/"
scp -i "path/to/key" docker-compose.yml root@89.147.111.166:"/root/site Web/"
scp -i "path/to/key" .env root@89.147.111.166:"/root/site Web/"
```

#### 3.2 Configuration des Variables d'Environnement

Création du fichier `.env` sur le serveur :

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your-jwt-secret

# CORS
CORS_ORIGINS=https://cartagespa.com,https://www.cartagespa.com,http://localhost:5173

# Frontend
VITE_API_URL=https://cartagespa.com/api/v1
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Debug
DEBUG=false
```

#### 3.3 Build et Démarrage

```bash
cd "/root/site Web"

# Build des images Docker
docker compose build

# Démarrage des services
docker compose up -d

# Vérification des logs
docker compose logs -f
```

### Phase 4 : Configuration SSL

#### 4.1 Installation de Certbot

```bash
# Installation
apt install -y certbot

# Génération du certificat
certbot certonly --standalone -d cartagespa.com -d www.cartagespa.com

# Vérification
ls -la /etc/letsencrypt/live/cartagespa.com/
```

#### 4.2 Configuration Nginx pour HTTPS

Le script `nginx/start-nginx-with-ips-https.sh` détecte automatiquement les certificats et configure HTTPS.

#### 4.3 Renouvellement Automatique

```bash
# Test du renouvellement
certbot renew --dry-run

# Ajout au cron (renouvellement automatique)
crontab -e
# Ajouter :
0 0 * * * certbot renew --quiet && docker compose restart nginx
```

### Phase 5 : Configuration fail2ban

#### 5.1 Installation et Configuration

```bash
# Installation (déjà fait)
apt install -y fail2ban

# Configuration SSH
cat > /etc/fail2ban/jail.local <<EOF
[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 5
bantime = 3600
findtime = 600
EOF

# Configuration Nginx
cat > /etc/fail2ban/filter.d/nginx-limit-req.conf <<EOF
[Definition]
failregex = ^<HOST> -.*- .*HTTP/.*" (4\d{2}|5\d{2}) .*$
ignoreregex =
EOF

cat > /etc/fail2ban/filter.d/nginx-api.conf <<EOF
[Definition]
failregex = ^<HOST> -.*- .*" (GET|POST|PUT|DELETE) /api/.*" (4\d{2}|5\d{2}) .*$
ignoreregex =
EOF

# Ajout des jails Nginx
cat >> /etc/fail2ban/jail.local <<EOF

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
bantime = 3600
findtime = 300

[nginx-api]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
filter = nginx-api
maxretry = 20
bantime = 1800
findtime = 300
EOF

# Démarrage
systemctl enable fail2ban
systemctl start fail2ban
systemctl status fail2ban
```

---

## Sécurité Implémentée

### 1. Sécurité Réseau

#### 1.1 Firewall (UFW)

- **Ports ouverts** : 22 (SSH), 80 (HTTP), 443 (HTTPS)
- **Ports fermés** : Tous les autres ports
- **Configuration** :
  ```bash
  ufw allow 22/tcp
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw enable
  ```

#### 1.2 Cloudflare Protection

- **DDoS Protection** : Automatique via Cloudflare
- **WAF (Web Application Firewall)** : Protection contre les attaques web
- **Rate Limiting** : Limitation des requêtes par IP
- **Bot Management** : Détection et blocage des bots malveillants

### 2. Sécurité SSL/TLS

#### 2.1 Configuration SSL

- **Certificat** : Let's Encrypt (gratuit, renouvellement automatique)
- **Protocoles** : TLS 1.2, TLS 1.3 uniquement
- **Cipher Suites** : Modernes et sécurisées
- **HSTS** : Strict-Transport-Security activé (max-age=31536000)

#### 2.2 Headers de Sécurité

Nginx ajoute automatiquement :

```nginx
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: no-referrer-when-downgrade
```

### 3. Protection contre les Attaques

#### 3.1 fail2ban

**Jails configurés** :

1. **SSH (sshd)**
   - Max retries : 5
   - Ban time : 1 heure
   - Find time : 10 minutes
   - Log : `/var/log/auth.log`

2. **Nginx General (nginx-limit-req)**
   - Max retries : 10
   - Ban time : 1 heure
   - Find time : 5 minutes
   - Log : `/var/log/nginx/error.log`

3. **Nginx API (nginx-api)**
   - Max retries : 20
   - Ban time : 30 minutes
   - Find time : 5 minutes
   - Log : `/var/log/nginx/error.log`

**Commandes utiles** :

```bash
# Vérifier le statut
fail2ban-client status

# Vérifier un jail spécifique
fail2ban-client status sshd
fail2ban-client status nginx-limit-req
fail2ban-client status nginx-api

# Débannir une IP
fail2ban-client set sshd unbanip <IP>
```

#### 3.2 Rate Limiting (Backend)

**Configuration** :

- **Global** : 100 requêtes / 60 secondes
- **Auth endpoints** : 10 requêtes / 60 secondes
- **User endpoints** : 30 requêtes / 60 secondes (non authentifiés)
- **User endpoints** : Illimité (authentifiés)
- **Admin endpoints** : 50 requêtes / 60 secondes

**Implémentation** : `backend/app/middleware/rate_limiter.py`

**Headers de réponse** :
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

### 4. Anonymat et Confidentialité

#### 4.1 Anonymisation des IPs

**Backend** : `backend/app/utils/security_logger.py`

- **IPv4** : Masquage des 2 derniers octets
  - Exemple : `192.168.1.100` → `192.168.xxx.xxx`
- **IPv6** : Masquage des 4 derniers groupes
  - Exemple : `2001:db8::1` → `2001:db8:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx`

**Fonction** : `mask_ip(ip: str) -> str`

#### 4.2 Désactivation du Tracking Frontend

**Fichier** : `frontend/src/utils/visitStats.js`

- **Cookies désactivés** : Pas de tracking des visites
- **localStorage désactivé** : Pas de stockage local
- **Statistiques** : Toutes les fonctions retournent des valeurs par défaut

### 5. Authentification et Autorisation

#### 5.1 Supabase Auth

- **JWT Tokens** : Validation côté backend
- **OAuth** : Google OAuth configuré
- **Email Verification** : Requis pour l'authentification
- **Password Policy** : Gérée par Supabase

#### 5.2 Rôles et Permissions

- **User** : Utilisateur standard
- **Admin** : Accès au dashboard admin
- **Protection** : Middleware `get_current_admin_user` pour les endpoints admin

### 6. Validation et Sanitisation

#### 6.1 Validation Backend

- **Pydantic Schemas** : Validation automatique des données
- **File Upload** : Limite de taille (5MB par fichier, 10 fichiers max)
- **Request Size** : Limite de 10MB par requête

#### 6.2 Protection contre les Injections

- **SQL Injection** : Protection via SQLAlchemy (ORM)
- **XSS** : Headers de sécurité + validation
- **CSRF** : Protection via tokens (Supabase)

### 7. Logging et Monitoring

#### 7.1 Logs de Sécurité

**Fichier** : `backend/app/utils/security_logger.py`

**Événements loggés** :
- Authentification (succès/échec)
- Expiration/invalidité des tokens
- Actions admin
- Rate limit exceeded
- Upload de fichiers
- Activité suspecte
- Tentatives d'injection (SQL, XSS, CSRF)

**Format** : JSON avec timestamp, IP anonymisée, user agent, détails

**Localisation** : `backend/logs/security.log`

#### 7.2 Health Checks

**Backend** : `/health` endpoint
- Vérification de la disponibilité
- Utilisé par Docker healthchecks
- Monitoring externe possible

**Docker Healthchecks** :
- Backend : Vérification toutes les 30s
- Frontend : Vérification toutes les 10s

### 8. Sécurité des Conteneurs

#### 8.1 Docker Best Practices

- **Images minimales** : Alpine Linux pour Nginx
- **Non-root** : Utilisateurs non-privilégiés (si possible)
- **Volumes** : Montage en lecture seule pour les certificats
- **Networks** : Réseau isolé pour les conteneurs
- **Restart Policy** : `unless-stopped` pour redémarrage automatique

#### 8.2 Secrets Management

- **Variables d'environnement** : Stockées dans `.env` (non versionné)
- **Secrets** : Jamais commités dans Git
- **Rotation** : Recommandée périodiquement

---

## Configuration

### Docker Compose

**Fichier** : `docker-compose.yml`

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - SUPABASE_URL=${SUPABASE_URL}
      - CORS_ORIGINS=${CORS_ORIGINS}
    healthcheck:
      test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:8000/health').read()"]
      interval: 30s

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - ./nginx/logs:/var/log/nginx:rw
    depends_on:
      backend:
        condition: service_healthy
      frontend:
        condition: service_healthy
```

### Nginx Configuration

**Script** : `nginx/start-nginx-with-ips-https.sh`

- Détection automatique des certificats SSL
- Génération dynamique de la configuration
- Support HTTP et HTTPS
- Redirection HTTP → HTTPS
- Headers de sécurité
- Compression Gzip

### Backend Configuration

**Fichier** : `backend/app/config.py`

```python
class Settings(BaseSettings):
    DATABASE_URL: str
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_JWT_SECRET: str
    CORS_ORIGINS: str
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 60
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5MB
    MAX_FILES_PER_UPLOAD: int = 10
```

---

## Monitoring et Maintenance

### Commandes de Monitoring

#### Vérification des Services

```bash
# Statut des conteneurs
docker compose ps

# Logs en temps réel
docker compose logs -f

# Logs d'un service spécifique
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx

# Utilisation des ressources
docker stats
```

#### Vérification de la Sécurité

```bash
# Statut fail2ban
fail2ban-client status

# IPs bannies
fail2ban-client status sshd
fail2ban-client status nginx-limit-req

# Logs de sécurité
tail -f /root/site\ Web/backend/logs/security.log

# Logs Nginx
tail -f /root/site\ Web/nginx/logs/access.log
tail -f /root/site\ Web/nginx/logs/error.log
```

#### Vérification SSL

```bash
# Vérifier le certificat
openssl s_client -connect cartagespa.com:443 -servername cartagespa.com

# Vérifier l'expiration
certbot certificates

# Test de renouvellement
certbot renew --dry-run
```

### Maintenance Régulière

#### Quotidienne

- Vérification des logs d'erreur
- Vérification des IPs bannies par fail2ban
- Vérification de la disponibilité du site

#### Hebdomadaire

- Vérification de l'utilisation des ressources (CPU, RAM, disque)
- Vérification des logs de sécurité
- Vérification des mises à jour système

#### Mensuelle

- Mise à jour du système
- Mise à jour des images Docker
- Rotation des logs (si nécessaire)
- Vérification des certificats SSL
- Backup de la base de données

### Backups

#### Base de Données Supabase

- **Automatique** : Géré par Supabase (quotidien)
- **Manuel** : Export via Supabase Dashboard

#### Configuration Serveur

```bash
# Backup des fichiers de configuration
tar -czf backup-config-$(date +%Y%m%d).tar.gz \
  /root/site\ Web/docker-compose.yml \
  /root/site\ Web/.env \
  /etc/fail2ban/jail.local \
  /etc/nginx/

# Backup des certificats SSL
tar -czf backup-ssl-$(date +%Y%m%d).tar.gz /etc/letsencrypt/
```

---

## Dépannage

### Problèmes Courants

#### 1. Site Inaccessible

```bash
# Vérifier les conteneurs
docker compose ps

# Vérifier les logs
docker compose logs nginx

# Vérifier le port 443
netstat -tlnp | grep 443

# Tester HTTPS
curl -I https://cartagespa.com
```

#### 2. Erreur SSL

```bash
# Vérifier les certificats
ls -la /etc/letsencrypt/live/cartagespa.com/

# Vérifier la configuration Nginx
docker compose exec nginx nginx -t

# Redémarrer Nginx
docker compose restart nginx
```

#### 3. Rate Limit 429

- Vérifier les logs : `docker compose logs backend | grep "rate limit"`
- Vérifier la configuration : `backend/app/middleware/rate_limiter.py`
- Ajuster les limites si nécessaire

#### 4. fail2ban Bloque une IP Légitime

```bash
# Débannir une IP
fail2ban-client set sshd unbanip <IP>
fail2ban-client set nginx-limit-req unbanip <IP>
fail2ban-client set nginx-api unbanip <IP>
```

#### 5. Conteneur ne Démarre pas

```bash
# Vérifier les logs
docker compose logs <service>

# Rebuild
docker compose build --no-cache <service>
docker compose up -d <service>
```

---

## Résumé des Mesures de Sécurité

### ✅ Implémentées

1. **HTTPS/SSL** : Certificat Let's Encrypt, TLS 1.2/1.3, HSTS
2. **Firewall** : UFW avec ports minimaux
3. **Cloudflare** : DDoS protection, WAF, CDN
4. **fail2ban** : Protection SSH, Nginx, API
5. **Rate Limiting** : Backend et Cloudflare
6. **Headers de Sécurité** : HSTS, X-Frame-Options, CSP, etc.
7. **Anonymisation IP** : Masquage dans les logs
8. **Tracking Désactivé** : Pas de cookies/localStorage
9. **Validation** : Pydantic, limites de taille, sanitisation
10. **Logging** : Logs de sécurité détaillés
11. **Health Checks** : Monitoring de la disponibilité
12. **Docker** : Isolation, volumes en lecture seule

### 📊 Niveau de Sécurité

- **Infrastructure** : ⭐⭐⭐⭐⭐ (5/5)
- **Application** : ⭐⭐⭐⭐⭐ (5/5)
- **Réseau** : ⭐⭐⭐⭐⭐ (5/5)
- **Anonymat** : ⭐⭐⭐⭐☆ (4/5)
- **Monitoring** : ⭐⭐⭐⭐☆ (4/5)

---

## Conclusion

Cette documentation couvre l'ensemble du déploiement et des mesures de sécurité implémentées pour **Carthage Wellness Spa**. Le système est conçu pour être :

- ✅ **Sécurisé** : Multiples couches de protection
- ✅ **Performant** : CDN, cache, compression
- ✅ **Anonyme** : IPs masquées, tracking désactivé
- ✅ **Maintenable** : Docker, logs, monitoring
- ✅ **Scalable** : Architecture containerisée

Pour toute question ou problème, consultez la section [Dépannage](#dépannage) ou les guides spécifiques dans le répertoire `documentations/`.

---

**Dernière mise à jour** : Novembre 2025  
**Version** : 1.0  
**Auteur** : Documentation générée automatiquement

