# Prochaines Étapes Après Configuration HTTPS

## ✅ État Actuel
- ✅ Certificats SSL générés avec Certbot
- ✅ Nginx Docker configuré pour HTTPS
- ✅ Volume SSL monté dans docker-compose.yml
- ✅ Nginx démarre correctement avec HTTPS

## 📋 Étapes Restantes

### 1. Tester HTTPS (Vérification Immédiate)

**Sur votre navigateur :**
```
https://cartagespa.com
```

**Vérifications :**
- ✅ Le cadenas vert s'affiche
- ✅ Pas d'avertissement de sécurité
- ✅ Redirection HTTP → HTTPS fonctionne
- ✅ Le site se charge correctement

**Commande de test :**
```bash
curl -I https://cartagespa.com
# Devrait retourner : HTTP/2 200
```

---

### 2. Mettre à Jour Supabase

#### 2.1. Site URL
1. Aller dans **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. Changer **Site URL** de `http://cartagespa.com` à `https://cartagespa.com`

#### 2.2. Redirect URLs
Ajouter ces URLs dans **Redirect URLs** :
```
https://cartagespa.com/auth/callback
https://cartagespa.com/**
https://www.cartagespa.com/auth/callback
https://www.cartagespa.com/**
```

**Garder aussi** (pour développement local) :
```
http://localhost:5173/auth/callback
http://localhost:5173/**
http://localhost:5174/auth/callback
http://localhost:5174/**
```

---

### 3. Mettre à Jour Variables d'Environnement

#### 3.1. Sur le Serveur

**Éditer `.env` :**
```bash
nano /root/site\ Web/.env
```

**Changer :**
```bash
# AVANT
VITE_API_URL=http://cartagespa.com/api/v1

# APRÈS
VITE_API_URL=https://cartagespa.com/api/v1
```

**Sauvegarder** (Ctrl+O, Enter, Ctrl+X)

#### 3.2. Rebuild Frontend

```bash
cd /root/site\ Web
docker compose build frontend
docker compose up -d frontend
```

**Vérifier les logs :**
```bash
docker compose logs frontend --tail 20
```

---

### 4. Mettre à Jour CORS dans Backend

**Éditer `.env` :**
```bash
nano /root/site\ Web/.env
```

**Changer `CORS_ORIGINS` :**
```bash
# AVANT
CORS_ORIGINS=http://cartagespa.com,http://www.cartagespa.com,http://localhost:5173,http://localhost:5174

# APRÈS
CORS_ORIGINS=https://cartagespa.com,https://www.cartagespa.com,http://localhost:5173,http://localhost:5174
```

**Redémarrer backend :**
```bash
docker compose restart backend
```

---

### 5. Tests Finaux

#### 5.1. Test HTTPS
```bash
# Test depuis le serveur
curl -I https://cartagespa.com
curl -I https://cartagespa.com/api/v1/health
```

#### 5.2. Test Redirection HTTP → HTTPS
```bash
curl -I http://cartagespa.com
# Devrait retourner : HTTP/1.1 301 Moved Permanently
# Location: https://cartagespa.com/...
```

#### 5.3. Test Frontend
- Ouvrir `https://cartagespa.com` dans le navigateur
- Vérifier que le site se charge
- Vérifier la console (F12) pour les erreurs

#### 5.4. Test Authentification
- Tester la connexion Google
- Vérifier que la redirection fonctionne avec HTTPS

#### 5.5. Test API
- Tester une requête API depuis le frontend
- Vérifier que les appels API utilisent HTTPS

---

### 6. Configuration Fail2ban (Protection DDoS)

**Installation :**
```bash
apt update
apt install -y fail2ban
```

**Configuration :**
```bash
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
nano /etc/fail2ban/jail.local
```

**Activer les protections :**
```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
```

**Démarrer fail2ban :**
```bash
systemctl enable fail2ban
systemctl start fail2ban
systemctl status fail2ban
```

---

### 7. Vérifications Finales

#### Checklist :
- [ ] HTTPS fonctionne (`https://cartagespa.com`)
- [ ] Redirection HTTP → HTTPS fonctionne
- [ ] Supabase Site URL mis à jour vers HTTPS
- [ ] Supabase Redirect URLs mis à jour vers HTTPS
- [ ] `VITE_API_URL` mis à jour vers HTTPS
- [ ] Frontend rebuild avec nouvelles variables
- [ ] `CORS_ORIGINS` mis à jour pour inclure HTTPS
- [ ] Backend redémarré
- [ ] Authentification Google fonctionne avec HTTPS
- [ ] API calls fonctionnent avec HTTPS
- [ ] Fail2ban configuré et actif

---

## 🎉 Félicitations !

Votre site est maintenant sécurisé avec HTTPS ! 

**Prochaines améliorations possibles :**
- Configuration HSTS (déjà inclus dans la config Nginx)
- Monitoring avec Uptime Robot
- Backups automatiques
- CDN pour améliorer les performances

