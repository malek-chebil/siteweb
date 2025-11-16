# 🔒 Guide Migration HTTP → HTTPS

## 📋 Situation Actuelle

**Maintenant (HTTP)** :
- Site URL : `http://cartagespa.com`
- Redirect URLs : `http://cartagespa.com/auth/callback`, etc.

**Plus tard (HTTPS)** :
- Site URL : `https://cartagespa.com`
- Redirect URLs : `https://cartagespa.com/auth/callback`, etc.

---

## 🎯 Étapes pour Configurer HTTPS

### ÉTAPE 1 : Installer Certbot

Sur le serveur (via SSH) :

```bash
# Mettre à jour les paquets
apt update

# Installer Certbot
apt install certbot python3-certbot-nginx -y
```

---

### ÉTAPE 2 : Configurer SSL avec Certbot

```bash
# Générer le certificat SSL
certbot --nginx -d cartagespa.com -d www.cartagespa.com
```

**Réponses aux questions** :
- Email : Votre email (pour les notifications)
- Terms of Service : Accepter (A)
- Share email : Votre choix (Y/N)
- Redirect HTTP to HTTPS : Oui (2)

---

### ÉTAPE 3 : Vérifier le Renouvellement Automatique

```bash
# Tester le renouvellement automatique
certbot renew --dry-run
```

Certbot renouvelle automatiquement les certificats (ils expirent après 90 jours).

---

### ÉTAPE 4 : Mettre à Jour Supabase

**Une fois HTTPS configuré et testé** :

#### 1. Site URL
Changez :
```
http://cartagespa.com
```
Par :
```
https://cartagespa.com
```

#### 2. Redirect URLs
Remplacez toutes les URLs HTTP par HTTPS :

**Avant (HTTP)** :
```
http://localhost:5174/auth/callback
http://cartagespa.com/auth/callback
http://cartagespa.com/**
http://www.cartagespa.com/auth/callback
http://www.cartagespa.com/**
```

**Après (HTTPS)** :
```
http://localhost:5174/auth/callback  (gardez localhost en HTTP)
https://cartagespa.com/auth/callback
https://cartagespa.com/**
https://www.cartagespa.com/auth/callback
https://www.cartagespa.com/**
```

---

## 📝 Checklist Migration HTTPS

### Sur le Serveur
- [ ] Certbot installé
- [ ] Certificat SSL généré pour `cartagespa.com` et `www.cartagespa.com`
- [ ] Nginx configuré pour HTTPS (automatique avec Certbot)
- [ ] Test : `https://cartagespa.com` fonctionne
- [ ] Test : Redirection HTTP → HTTPS fonctionne

### Dans Supabase
- [ ] Site URL changé : `https://cartagespa.com`
- [ ] Toutes les Redirect URLs changées en HTTPS
- [ ] Gardé `http://localhost:5174/auth/callback` (développement)
- [ ] Testé Google Auth avec HTTPS

---

## 🔧 Configuration Nginx (Automatique)

Certbot modifie automatiquement votre configuration Nginx pour :
1. **Écouter sur le port 443** (HTTPS)
2. **Rediriger HTTP → HTTPS**
3. **Utiliser les certificats SSL**

### Fichiers Modifiés par Certbot

Certbot crée/modifie :
- `/etc/nginx/sites-available/cartagespa.com` (ou similaire)
- Ajoute les certificats dans `/etc/letsencrypt/live/cartagespa.com/`

**Note** : Avec Docker, vous devrez peut-être adapter la configuration.

---

## 🐳 HTTPS avec Docker

### Option 1 : Certbot dans Docker

Si vous utilisez Docker, vous pouvez :

1. **Monter les certificats** dans le conteneur Nginx
2. **Configurer Nginx** pour utiliser HTTPS
3. **Rediriger HTTP → HTTPS**

### Configuration Docker Compose (après Certbot)

```yaml
nginx:
  volumes:
    - ./nginx/ssl:/etc/nginx/ssl:ro
    - /etc/letsencrypt:/etc/letsencrypt:ro  # Certificats SSL
```

### Configuration Nginx HTTPS

```nginx
# Redirection HTTP → HTTPS
server {
    listen 80;
    server_name cartagespa.com www.cartagespa.com;
    return 301 https://$server_name$request_uri;
}

# Serveur HTTPS
server {
    listen 443 ssl http2;
    server_name cartagespa.com www.cartagespa.com;

    ssl_certificate /etc/letsencrypt/live/cartagespa.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cartagespa.com/privkey.pem;

    # Configuration SSL recommandée
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Frontend
    location / {
        proxy_pass http://frontend:80;
        # ... autres headers ...
    }

    # Backend API
    location /api {
        proxy_pass http://backend:8000;
        # ... autres headers ...
    }
}
```

---

## ⚠️ Points Importants

### 1. Gardez localhost en HTTP
```
http://localhost:5174/auth/callback
```
Ne changez pas localhost en HTTPS (pas nécessaire pour le développement local).

### 2. Testez Avant de Changer Supabase
- Vérifiez que `https://cartagespa.com` fonctionne
- Testez Google Auth avec HTTPS
- Puis changez les URLs dans Supabase

### 3. Renouvellement Automatique
Certbot renouvelle automatiquement les certificats, mais vérifiez que le service fonctionne :
```bash
systemctl status certbot.timer
```

---

## 🆘 Problèmes Courants

### Problème 1 : Certbot ne peut pas accéder au port 80

**Solution** : Assurez-vous que Nginx écoute sur le port 80 avant de lancer Certbot.

### Problème 2 : Certificat expiré

**Solution** : Vérifiez le renouvellement automatique :
```bash
certbot renew --dry-run
```

### Problème 3 : Mixed Content (HTTP/HTTPS)

**Solution** : Assurez-vous que toutes les ressources (CSS, JS, images) sont chargées en HTTPS.

---

## 📚 Ressources

- Certbot Documentation : https://certbot.eff.org/
- Let's Encrypt : https://letsencrypt.org/
- Nginx SSL Configuration : https://nginx.org/en/docs/http/configuring_https_servers.html

---

## ✅ Résumé

1. **Maintenant** : Configurez tout en HTTP
2. **Plus tard** : Installez Certbot et générez les certificats SSL
3. **Ensuite** : Mettez à jour les URLs dans Supabase pour HTTPS
4. **Gardez** : `http://localhost:5174/auth/callback` pour le développement

---

## 🎯 Ordre des Opérations

1. ✅ Configurer Supabase en HTTP (maintenant)
2. ✅ Tester l'application en HTTP
3. ⏳ Installer Certbot (plus tard)
4. ⏳ Générer les certificats SSL
5. ⏳ Tester HTTPS
6. ⏳ Mettre à jour Supabase pour HTTPS
7. ⏳ Tester Google Auth avec HTTPS

