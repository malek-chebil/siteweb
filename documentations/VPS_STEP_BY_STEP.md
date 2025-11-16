# 🚀 Guide Étape par Étape - Déploiement VPS

## ✅ Vous avez déjà fait: `apt update`

---

## 📋 ÉTAPE 1: Sécurité de Base (5 minutes)

### 1.1 Installer et Configurer le Firewall

```bash
# Installer UFW
apt install ufw -y

# Autoriser SSH (IMPORTANT - faites-le d'abord!)
ufw allow 22/tcp

# Autoriser HTTP et HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Activer le firewall
ufw enable

# Vérifier le statut
ufw status
```

**Résultat attendu:** Vous devriez voir les règles actives.

---

## 📋 ÉTAPE 2: Installer les Outils de Base (2 minutes)

```bash
# Installer les outils essentiels
apt install -y git curl wget build-essential
```

---

## 📋 ÉTAPE 3: Installer Python (3 minutes)

```bash
# Installer Python 3 et pip
apt install -y python3 python3-pip python3-venv

# Vérifier l'installation
python3 --version
pip3 --version
```

**Résultat attendu:** Python 3.x.x et pip version affichée.

---

## 📋 ÉTAPE 4: Installer Node.js (5 minutes)

```bash
# Installer Node.js 18+ via NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Vérifier l'installation
node --version
npm --version
```

**Résultat attendu:** Node.js v18.x.x et npm version affichée.

---

## 📋 ÉTAPE 5: Installer Nginx (2 minutes)

```bash
# Installer Nginx
apt install nginx -y

# Démarrer et activer Nginx
systemctl start nginx
systemctl enable nginx

# Vérifier le statut
systemctl status nginx
```

**Résultat attendu:** Nginx devrait être "active (running)".

**Test:** Ouvrez votre navigateur et allez à `http://89.147.111.166` - vous devriez voir la page par défaut de Nginx.

---

## 📋 ÉTAPE 6: Installer Certbot (pour SSL plus tard) (1 minute)

```bash
# Installer Certbot pour Let's Encrypt
apt install certbot python3-certbot-nginx -y
```

---

## 📋 ÉTAPE 7: Transférer Votre Code (10-15 minutes)

### Option A: Via SCP (depuis votre ordinateur Windows)

**Sur votre ordinateur Windows (PowerShell avec VPN connecté):**

```powershell
# Transférer le code vers le VPS
scp -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" -r "C:\Users\Malek\Desktop\site Web" root@89.147.111.166:/root/
```

**Sur le VPS (après le transfert):**

```bash
# Vérifier que les fichiers sont là
ls -la /root/site\ Web/

# Vous devriez voir les dossiers: backend, frontend, etc.
```

### Option B: Via Git (si votre code est sur GitHub)

```bash
# Installer Git (si pas déjà fait)
apt install git -y

# Cloner votre repository
cd /root
git clone https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
cd VOTRE_REPO
```

---

## 📋 ÉTAPE 8: Configurer le Backend (10 minutes)

```bash
# Aller dans le dossier backend
cd /root/site\ Web/backend

# Créer un environnement virtuel Python
python3 -m venv venv

# Activer l'environnement virtuel
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
```

### 8.1 Créer le fichier .env pour le backend

```bash
# Créer le fichier .env
nano .env
```

**Collez ce contenu (remplacez avec vos vraies valeurs):**

```env
DATABASE_URL=postgresql+asyncpg://postgres:VOTRE_MOT_DE_PASSE@db.xxx.supabase.co:5432/postgres
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_JWT_SECRET=votre_jwt_secret
CORS_ORIGINS=https://cartagespa.com,http://89.147.111.166
DEBUG=False
```

**Pour sauvegarder dans nano:**
- Appuyez sur `Ctrl + O` (sauvegarder)
- Appuyez sur `Enter` (confirmer)
- Appuyez sur `Ctrl + X` (quitter)

### 8.2 Exécuter les migrations

```bash
# Toujours dans le dossier backend avec venv activé
alembic upgrade head
```

### 8.3 Tester le backend

```bash
# Démarrer le serveur backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Test:** Ouvrez un autre terminal SSH et testez:
```bash
curl http://localhost:8000/health
```

**Résultat attendu:** `{"status":"ok"}`

**Arrêtez le serveur:** Appuyez sur `Ctrl + C` dans le terminal où uvicorn tourne.

---

## 📋 ÉTAPE 9: Configurer le Frontend (10 minutes)

```bash
# Aller dans le dossier frontend
cd /root/site\ Web/frontend

# Installer les dépendances
npm install
```

### 9.1 Créer le fichier .env pour le frontend

```bash
# Créer le fichier .env
nano .env
```

**Collez ce contenu (remplacez avec vos vraies valeurs):**

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anon
VITE_API_URL=http://89.147.111.166:8000/api/v1
```

**Sauvegarder:** `Ctrl + O`, `Enter`, `Ctrl + X`

### 9.2 Build le frontend

```bash
# Build le frontend (cela crée le dossier dist/)
npm run build
```

**Résultat attendu:** Le dossier `dist/` devrait être créé avec les fichiers compilés.

---

## 📋 ÉTAPE 10: Configurer Nginx (10 minutes)

### 10.1 Créer la configuration Nginx

```bash
# Créer le fichier de configuration
nano /etc/nginx/sites-available/cartagespa
```

**Collez ce contenu:**

```nginx
server {
    listen 80;
    server_name cartagespa.com www.cartagespa.com 89.147.111.166;

    # Frontend (React build)
    root /root/site Web/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Sauvegarder:** `Ctrl + O`, `Enter`, `Ctrl + X`

### 10.2 Activer le site

```bash
# Créer le lien symbolique
ln -s /etc/nginx/sites-available/cartagespa /etc/nginx/sites-enabled/

# Supprimer la config par défaut
rm /etc/nginx/sites-enabled/default

# Tester la configuration
nginx -t
```

**Résultat attendu:** `nginx: configuration file /etc/nginx/nginx.conf test is successful`

### 10.3 Redémarrer Nginx

```bash
# Redémarrer Nginx
systemctl restart nginx

# Vérifier le statut
systemctl status nginx
```

---

## 📋 ÉTAPE 11: Créer un Service Systemd pour le Backend (5 minutes)

### 11.1 Créer le fichier de service

```bash
# Créer le service
nano /etc/systemd/system/cartagespa-backend.service
```

**Collez ce contenu:**

```ini
[Unit]
Description=CartageSpa Backend API
After=network.target

[Service]
User=root
WorkingDirectory=/root/site Web/backend
Environment="PATH=/root/site Web/backend/venv/bin"
ExecStart=/root/site Web/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

**Sauvegarder:** `Ctrl + O`, `Enter`, `Ctrl + X`

### 11.2 Activer et démarrer le service

```bash
# Recharger systemd
systemctl daemon-reload

# Démarrer le service
systemctl start cartagespa-backend

# Activer au démarrage
systemctl enable cartagespa-backend

# Vérifier le statut
systemctl status cartagespa-backend
```

**Résultat attendu:** Le service devrait être "active (running)".

---

## 📋 ÉTAPE 12: Tester l'Application (5 minutes)

### 12.1 Tester le Backend

```bash
# Tester l'endpoint de santé
curl http://localhost:8000/health

# Tester via l'IP publique
curl http://89.147.111.166/api/v1/health
```

**Résultat attendu:** `{"status":"ok"}`

### 12.2 Tester le Frontend

Ouvrez votre navigateur et allez à:
- `http://89.147.111.166` - Vous devriez voir votre application React

### 12.3 Vérifier les Logs

```bash
# Logs du backend
journalctl -u cartagespa-backend -f

# Logs de Nginx
tail -f /var/log/nginx/error.log
```

---

## 📋 ÉTAPE 13: Configurer DNS (Njalla) (10 minutes)

### 13.1 Configurer les Enregistrements DNS

1. **Connectez-vous à Njalla**: https://njal.la
2. **Allez dans**: Domain Management → cartagespa.com → DNS
3. **Ajoutez/modifiez les enregistrements:**

```
Type    Name    Value           TTL
A       @       89.147.111.166   3600
A       www     89.147.111.166   3600
```

4. **Attendez la propagation DNS** (5-30 minutes)

### 13.2 Vérifier la Propagation DNS

```bash
# Vérifier que le DNS pointe vers votre IP
nslookup cartagespa.com
```

---

## 📋 ÉTAPE 14: Configurer SSL avec Let's Encrypt (10 minutes)

**IMPORTANT:** Attendez que le DNS soit propagé avant cette étape!

### 14.1 Obtenir le Certificat SSL

```bash
# Obtenir le certificat SSL
certbot --nginx -d cartagespa.com -d www.cartagespa.com
```

**Suivez les instructions:**
- Entrez votre email: `cartagespa@protonmail.com`
- Acceptez les termes (tapez `A`)
- Partagez l'email avec EFF? (tapez `N` ou `Y`)
- Le certificat sera installé automatiquement

### 14.2 Vérifier le Renouvellement Automatique

```bash
# Tester le renouvellement
certbot renew --dry-run
```

**Résultat attendu:** Le test devrait réussir.

---

## 📋 ÉTAPE 15: Test Final (5 minutes)

### 15.1 Tester HTTPS

Ouvrez votre navigateur et allez à:
- `https://cartagespa.com` - Vous devriez voir votre application avec un cadenas vert
- `https://cartagespa.com/api/v1/health` - Devrait retourner `{"status":"ok"}`

### 15.2 Vérifier que Tout Fonctionne

- [ ] Frontend accessible via HTTPS
- [ ] Backend API accessible via HTTPS
- [ ] Authentification fonctionne
- [ ] Upload d'images fonctionne (si applicable)

---

## 🆘 Commandes Utiles

### Redémarrer les Services

```bash
# Redémarrer le backend
systemctl restart cartagespa-backend

# Redémarrer Nginx
systemctl restart nginx
```

### Voir les Logs

```bash
# Logs backend
journalctl -u cartagespa-backend -f

# Logs Nginx (erreurs)
tail -f /var/log/nginx/error.log

# Logs Nginx (accès)
tail -f /var/log/nginx/access.log
```

### Vérifier le Statut

```bash
# Statut du backend
systemctl status cartagespa-backend

# Statut de Nginx
systemctl status nginx

# Statut du firewall
ufw status
```

---

## ✅ Checklist Complète

### Installation
- [ ] Firewall configuré
- [ ] Python installé
- [ ] Node.js installé
- [ ] Nginx installé
- [ ] Certbot installé

### Application
- [ ] Code transféré sur le VPS
- [ ] Backend configuré (.env créé)
- [ ] Backend migrations exécutées
- [ ] Frontend configuré (.env créé)
- [ ] Frontend build réussi
- [ ] Service systemd créé et actif
- [ ] Nginx configuré

### DNS et SSL
- [ ] DNS configuré (Njalla)
- [ ] DNS propagé
- [ ] SSL certificat installé
- [ ] HTTPS fonctionne

### Tests
- [ ] Backend accessible
- [ ] Frontend accessible
- [ ] Application fonctionnelle

---

**Félicitations! Votre application est maintenant déployée! 🎉**

