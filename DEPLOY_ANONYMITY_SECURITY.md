# 🚀 Déploiement - Anonymat et Sécurité

## ✅ Fichiers Transférés

1. ✅ `backend/app/utils/security_logger.py` - IPs anonymisées
2. ✅ `frontend/src/utils/visitStats.js` - Tracking désactivé

---

## 📋 Étapes sur le Serveur

### Étape 1 : Rebuild et Redémarrer

```bash
# SSH sur le serveur
ssh -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" root@89.147.111.166

# Aller dans le répertoire
cd "/root/site Web"

# Rebuild backend et frontend
docker compose build backend frontend

# Redémarrer les services
docker compose up -d

# Vérifier les logs
docker compose logs -f backend
```

---

### Étape 2 : Configurer HTTPS (URGENT)

**Pourquoi** : Le site est actuellement en HTTP, ce qui expose les données en clair.

**Commandes** :
```bash
# Installer Certbot
apt update
apt install certbot python3-certbot-nginx -y

# Générer les certificats SSL
certbot --nginx -d cartagespa.com -d www.cartagespa.com

# Certbot va :
# 1. Générer les certificats SSL
# 2. Configurer automatiquement Nginx
# 3. Rediriger HTTP vers HTTPS
# 4. Configurer le renouvellement automatique
```

**Après HTTPS** :

1. **Mettre à jour Supabase Redirect URLs** :
   - Aller dans Supabase Dashboard → Authentication → URL Configuration
   - Ajouter : `https://cartagespa.com/auth/callback`
   - Ajouter : `https://cartagespa.com/**`
   - Ajouter : `https://www.cartagespa.com/auth/callback`
   - Changer Site URL : `https://cartagespa.com`

2. **Mettre à jour `.env` sur le serveur** :
   ```bash
   # Éditer le fichier
   nano "/root/site Web/.env"
   
   # Changer :
   VITE_API_URL=https://cartagespa.com/api/v1
   CORS_ORIGINS=https://cartagespa.com,https://www.cartagespa.com,http://localhost:5173,http://localhost:5174
   ```

3. **Rebuild frontend** :
   ```bash
   docker compose build frontend
   docker compose up -d
   ```

---

### Étape 3 : Configurer fail2ban (Protection DDoS)

**Pourquoi** : Protéger contre les attaques par force brute et DDoS.

**Commandes** :
```bash
# Installer fail2ban
apt install fail2ban -y

# Créer la configuration
cat > /etc/fail2ban/jail.local <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = 22

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10
EOF

# Activer et démarrer
systemctl enable fail2ban
systemctl start fail2ban

# Vérifier le statut
systemctl status fail2ban
fail2ban-client status
```

**Vérifier les bannissements** :
```bash
# Voir les IPs bannies
fail2ban-client status sshd
fail2ban-client status nginx-limit-req

# Débannir une IP (si nécessaire)
fail2ban-client set sshd unbanip <IP_ADDRESS>
```

---

## 🔍 Vérification

### Vérifier l'Anonymisation des IPs

```bash
# Voir les logs backend
docker compose logs backend | grep "ip_address"

# Les IPs devraient être masquées : 192.168.xxx.xxx
```

### Vérifier HTTPS

```bash
# Tester HTTPS
curl -I https://cartagespa.com

# Vérifier le certificat
openssl s_client -connect cartagespa.com:443 -servername cartagespa.com
```

### Vérifier fail2ban

```bash
# Statut
systemctl status fail2ban

# Logs
tail -f /var/log/fail2ban.log
```

---

## 📊 Checklist Complète

### Anonymat
- [x] IPs anonymisées dans les logs backend
- [x] Tracking frontend désactivé
- [ ] HTTPS configuré (en cours)
- [ ] fail2ban configuré (en cours)

### Sécurité
- [ ] HTTPS configuré avec Certbot
- [ ] Protection DDoS (fail2ban)
- [ ] Certificats SSL renouvelés automatiquement

---

## 🆘 Dépannage

### Problème : Certbot ne peut pas accéder à Nginx

**Solution** :
```bash
# Vérifier que Nginx Docker écoute sur le port 80
docker compose ps nginx

# Vérifier les logs
docker compose logs nginx

# Si Nginx n'écoute pas, redémarrer
docker compose restart nginx
```

### Problème : Certbot ne peut pas vérifier le domaine

**Solution** :
```bash
# Vérifier que le DNS pointe vers le serveur
nslookup cartagespa.com

# Vérifier que le port 80 est accessible
curl -I http://cartagespa.com
```

### Problème : fail2ban ne fonctionne pas

**Solution** :
```bash
# Vérifier les logs
journalctl -u fail2ban -f

# Vérifier la configuration
fail2ban-client -d

# Redémarrer
systemctl restart fail2ban
```

---

## 📚 Guides de Référence

- **HTTPS** : `HTTPS_MIGRATION_GUIDE.md`
- **Anonymat** : `ANONYMITY_AND_SECURITY_IMPROVEMENTS.md`
- **Sécurité** : `QUICK_SECURITY_FIXES.md`

---

## 🎯 Résumé

**Terminé** :
- ✅ Fichiers modifiés transférés sur le serveur

**À faire maintenant** :
1. Rebuild et redémarrer sur le serveur
2. Configurer HTTPS (URGENT)
3. Configurer fail2ban
4. Mettre à jour Supabase pour HTTPS

