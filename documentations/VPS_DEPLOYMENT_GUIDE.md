# 🚀 Guide de Déploiement VPS - Étapes Suivantes

## ✅ Statut Actuel

- **VPS Actif**: `cartagespa.com[vpsqnc87lw]`
- **Status**: "All is good" ✅
- **Setup**: "setup running" (en cours)
- **Expiration**: 2025-11-30 (16 jours)

---

## 📋 Phase 1: Attendre l'IP et Se Connecter (5-15 minutes)

### Étape 1.1: Obtenir l'Adresse IP

1. **Surveillez le dashboard 1984 Hosting**
   - Le champ "Primary IP" devrait se remplir automatiquement
   - Attendez que le badge "setup running" disparaisse
   - **Notez l'adresse IP** (ex: `185.xxx.xxx.xxx`)

2. **Vérifiez votre email** (cartagespa@protonmail.com)
   - Vous devriez recevoir un email avec les détails du VPS
   - L'IP sera mentionnée dans l'email

### Étape 1.2: Se Connecter via SSH

**Prérequis:**
- ✅ VPN connecté (Mullvad)
- ✅ SSH key prête (`C:\Users\Malek\.ssh\1984_hosting_key` ou `Bureau`)

**Commande SSH:**

```powershell
# Si vous avez utilisé le fichier "Bureau" sur le Desktop
ssh -i C:\Users\Malek\Desktop\site Web\Bureau root@VOTRE_IP_VPS

# Ou si vous avez la clé dans .ssh
ssh -i C:\Users\Malek\.ssh\1984_hosting_key root@VOTRE_IP_VPS
```

**Remplacez `VOTRE_IP_VPS` par l'adresse IP que vous avez reçue.**

**Première connexion:**
- Vous serez demandé d'accepter la clé de l'hôte (tapez `yes`)
- Si vous avez mis un passphrase, entrez-le

**Test de connexion:**
```bash
# Une fois connecté, testez:
uname -a          # Vérifier l'OS
df -h             # Vérifier l'espace disque
free -h           # Vérifier la RAM
ip addr show      # Vérifier l'IP
```

---

## 🔒 Phase 2: Sécuriser le Serveur (15-20 minutes)

### Étape 2.1: Mettre à Jour le Système

```bash
# Mettre à jour les paquets
apt update && apt upgrade -y

# Redémarrer si nécessaire
reboot
# (Attendez 1-2 minutes, puis reconnectez-vous)
```

### Étape 2.2: Créer un Utilisateur Non-Root

```bash
# Créer un nouvel utilisateur
adduser malek
# (Entrez un mot de passe fort et confirmez)

# Ajouter aux sudoers
usermod -aG sudo malek

# Copier votre clé SSH pour le nouvel utilisateur
mkdir -p /home/malek/.ssh
cp ~/.ssh/authorized_keys /home/malek/.ssh/
chown -R malek:malek /home/malek/.ssh
chmod 700 /home/malek/.ssh
chmod 600 /home/malek/.ssh/authorized_keys
```

### Étape 2.3: Configurer le Firewall (UFW)

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

### Étape 2.4: Sécuriser SSH (Optionnel mais Recommandé)

```bash
# Éditer la configuration SSH
nano /etc/ssh/sshd_config

# Modifier ces lignes:
# PermitRootLogin no          (désactiver login root)
# PasswordAuthentication no    (désactiver mots de passe)
# Port 22                      (garder le port 22 ou changer)

# Redémarrer SSH
systemctl restart sshd

# Tester la connexion avec le nouvel utilisateur AVANT de fermer la session root!
```

---

## 🛠️ Phase 3: Installer les Logiciels Nécessaires (20-30 minutes)

### Étape 3.1: Installer Python et Outils

```bash
# Installer Python 3.11+ et pip
apt install python3 python3-pip python3-venv -y

# Installer les outils de développement
apt install git curl wget build-essential -y

# Vérifier les versions
python3 --version
pip3 --version
```

### Étape 3.2: Installer Node.js (pour le frontend)

```bash
# Installer Node.js 18+ via NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Vérifier l'installation
node --version
npm --version
```

### Étape 3.3: Installer Nginx (Serveur Web)

```bash
# Installer Nginx
apt install nginx -y

# Démarrer et activer Nginx
systemctl start nginx
systemctl enable nginx

# Vérifier le statut
systemctl status nginx
```

### Étape 3.4: Installer Certbot (pour SSL)

```bash
# Installer Certbot pour Let's Encrypt
apt install certbot python3-certbot-nginx -y
```

---

## 📦 Phase 4: Déployer l'Application (30-45 minutes)

### Étape 4.1: Cloner ou Transférer le Code

**Option A: Via Git (si votre code est sur GitHub)**

```bash
# Se connecter avec l'utilisateur non-root
su - malek

# Cloner le repository
cd ~
git clone https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
cd VOTRE_REPO
```

**Option B: Via SCP (depuis votre ordinateur Windows)**

```powershell
# Depuis PowerShell sur Windows (avec VPN connecté)
scp -i C:\Users\Malek\Desktop\site Web\Bureau -r "C:\Users\Malek\Desktop\site Web" malek@VOTRE_IP_VPS:/home/malek/
```

### Étape 4.2: Configurer le Backend

```bash
# Aller dans le dossier backend
cd ~/site\ Web/backend

# Créer un environnement virtuel
python3 -m venv venv
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Créer le fichier .env
nano .env
```

**Contenu du fichier `.env` (backend):**
```env
DATABASE_URL=postgresql+asyncpg://postgres:VOTRE_MOT_DE_PASSE@db.xxx.supabase.co:5432/postgres
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_JWT_SECRET=votre_jwt_secret
CORS_ORIGINS=https://cartagespa.com,http://VOTRE_IP_VPS
DEBUG=False
```

```bash
# Exécuter les migrations
alembic upgrade head

# Tester le backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
# (Appuyez sur Ctrl+C pour arrêter après test)
```

### Étape 4.3: Configurer le Frontend

```bash
# Aller dans le dossier frontend
cd ~/site\ Web/frontend

# Installer les dépendances
npm install

# Créer le fichier .env
nano .env
```

**Contenu du fichier `.env` (frontend):**
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anon
VITE_API_URL=http://VOTRE_IP_VPS:8000/api/v1
```

```bash
# Build le frontend
npm run build

# Le dossier `dist` contient les fichiers à servir
```

---

## ⚙️ Phase 5: Configurer Nginx et Systemd (20-30 minutes)

### Étape 5.1: Configurer Nginx pour le Frontend

```bash
# Créer la configuration Nginx
sudo nano /etc/nginx/sites-available/cartagespa
```

**Contenu de la configuration:**
```nginx
server {
    listen 80;
    server_name cartagespa.com www.cartagespa.com;

    # Frontend (React build)
    root /home/malek/site Web/frontend/dist;
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

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/cartagespa /etc/nginx/sites-enabled/

# Supprimer la config par défaut
sudo rm /etc/nginx/sites-enabled/default

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

### Étape 5.2: Créer un Service Systemd pour le Backend

```bash
# Créer le service
sudo nano /etc/systemd/system/cartagespa-backend.service
```

**Contenu du service:**
```ini
[Unit]
Description=CartageSpa Backend API
After=network.target

[Service]
User=malek
WorkingDirectory=/home/malek/site Web/backend
Environment="PATH=/home/malek/site Web/backend/venv/bin"
ExecStart=/home/malek/site Web/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Recharger systemd
sudo systemctl daemon-reload

# Démarrer le service
sudo systemctl start cartagespa-backend

# Activer au démarrage
sudo systemctl enable cartagespa-backend

# Vérifier le statut
sudo systemctl status cartagespa-backend
```

---

## 🔐 Phase 6: Configurer SSL avec Let's Encrypt (10 minutes)

### Étape 6.1: Obtenir le Certificat SSL

**IMPORTANT:** Assurez-vous que votre domaine `cartagespa.com` pointe vers l'IP du VPS avant cette étape!

```bash
# Obtenir le certificat SSL
sudo certbot --nginx -d cartagespa.com -d www.cartagespa.com

# Suivez les instructions:
# - Entrez votre email
# - Acceptez les termes
# - Le certificat sera installé automatiquement
```

### Étape 6.2: Vérifier le Renouvellement Automatique

```bash
# Tester le renouvellement
sudo certbot renew --dry-run
```

---

## 🌐 Phase 7: Configurer DNS (Njalla)

### Étape 7.1: Configurer les Enregistrements DNS

1. **Connectez-vous à Njalla**: https://njal.la
2. **Allez dans**: Domain Management → cartagespa.com → DNS
3. **Ajoutez/modifiez les enregistrements:**

```
Type    Name    Value              TTL
A       @       VOTRE_IP_VPS       3600
A       www     VOTRE_IP_VPS       3600
```

4. **Attendez la propagation DNS** (5-30 minutes)

---

## ✅ Checklist Finale

### Sécurité
- [ ] Utilisateur non-root créé
- [ ] Firewall (UFW) configuré
- [ ] SSH sécurisé
- [ ] SSL/HTTPS activé

### Application
- [ ] Backend installé et fonctionnel
- [ ] Frontend build et déployé
- [ ] Services systemd configurés
- [ ] Nginx configuré

### DNS
- [ ] DNS pointant vers le VPS
- [ ] SSL certificat installé
- [ ] Site accessible via https://cartagespa.com

### Tests
- [ ] Backend accessible: `https://cartagespa.com/api/v1/health`
- [ ] Frontend accessible: `https://cartagespa.com`
- [ ] Authentification fonctionne
- [ ] Upload d'images fonctionne

---

## 🆘 Commandes Utiles

### Vérifier les Logs

```bash
# Logs backend
sudo journalctl -u cartagespa-backend -f

# Logs Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Redémarrer les Services

```bash
# Redémarrer le backend
sudo systemctl restart cartagespa-backend

# Redémarrer Nginx
sudo systemctl restart nginx
```

### Mettre à Jour l'Application

```bash
# Backend
cd ~/site\ Web/backend
git pull  # ou transférer les nouveaux fichiers
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
sudo systemctl restart cartagespa-backend

# Frontend
cd ~/site\ Web/frontend
git pull  # ou transférer les nouveaux fichiers
npm install
npm run build
sudo systemctl restart nginx
```

---

## 📞 Support

Si vous rencontrez des problèmes:
1. Vérifiez les logs (voir section "Commandes Utiles")
2. Vérifiez que les services sont actifs: `sudo systemctl status cartagespa-backend`
3. Vérifiez la configuration Nginx: `sudo nginx -t`
4. Vérifiez le firewall: `sudo ufw status`

---

**Bon déploiement! 🚀**

