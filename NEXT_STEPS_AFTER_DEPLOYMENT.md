# 🎉 Déploiement Réussi - Prochaines Étapes

## ✅ État Actuel

Tous les services sont opérationnels :
- ✅ **Backend** : Healthy sur le port 8000
- ✅ **Frontend** : Healthy sur le port 3000
- ✅ **Nginx** : Opérationnel sur le port 80

---

## 🧪 Tests à Effectuer

### Sur le Serveur

```bash
# 1. Tester le backend directement
curl http://localhost:8000/health
# Devrait retourner: {"status":"ok"}

# 2. Tester le frontend directement
curl http://localhost:3000
# Devrait retourner du HTML

# 3. Tester via Nginx
curl http://localhost/health
curl http://localhost/

# 4. Vérifier les logs
docker compose logs nginx --tail=50
docker compose logs backend --tail=50
```

### Depuis Votre Machine Locale

```bash
# Tester via l'IP publique
curl http://89.147.111.166/health
curl http://89.147.111.166/

# Ou dans le navigateur
http://89.147.111.166
```

---

## 🌐 ÉTAPE 1 : Configurer le DNS

### Dans Njalla (votre registrar de domaine)

1. Connectez-vous à votre compte Njalla
2. Allez dans la gestion de domaine pour `cartagespa.com`
3. Configurez les enregistrements DNS :

```
Type    Name    Value              TTL
A       @       89.147.111.166     3600
A       www     89.147.111.166     3600
```

**Note** : La propagation DNS peut prendre 5 minutes à 48 heures.

### Vérifier la Propagation DNS

```bash
# Sur votre machine locale
nslookup cartagespa.com
dig cartagespa.com
```

---

## 🔒 ÉTAPE 2 : Configurer SSL/HTTPS avec Certbot

Une fois le DNS configuré et propagé :

### Sur le Serveur

```bash
# 1. Installer Certbot
apt update
apt install -y certbot python3-certbot-nginx

# 2. Arrêter temporairement Nginx (si nécessaire)
docker compose stop nginx

# 3. Obtenir les certificats
certbot certonly --standalone -d cartagespa.com -d www.cartagespa.com

# 4. Les certificats seront dans:
# /etc/letsencrypt/live/cartagespa.com/fullchain.pem
# /etc/letsencrypt/live/cartagespa.com/privkey.pem

# 5. Créer le dossier SSL dans le projet
mkdir -p /root/site\ Web/nginx/ssl

# 6. Copier les certificats (ou créer des liens symboliques)
cp /etc/letsencrypt/live/cartagespa.com/fullchain.pem /root/site\ Web/nginx/ssl/
cp /etc/letsencrypt/live/cartagespa.com/privkey.pem /root/site\ Web/nginx/ssl/

# 7. Décommenter le bloc HTTPS dans nginx.conf
# 8. Redémarrer Nginx
docker compose up -d nginx
```

### Alternative : Utiliser Certbot dans Docker

```bash
# Créer un service Certbot dans docker-compose.yml
# Ou utiliser certbot-docker
```

---

## 🔧 ÉTAPE 3 : Activer HTTPS dans Nginx

### Modifier `nginx/nginx.conf`

Décommenter le bloc HTTPS (lignes 57-105) et ajuster les chemins des certificats :

```nginx
server {
    listen 443 ssl http2;
    server_name cartagespa.com www.cartagespa.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    
    # ... reste de la configuration
}
```

### Redémarrer Nginx

```bash
docker compose restart nginx
```

---

## 🔄 ÉTAPE 4 : Renouvellement Automatique des Certificats

### Créer un Cron Job

```bash
# Éditer le crontab
crontab -e

# Ajouter cette ligne (renouvellement tous les jours à 3h du matin)
0 3 * * * certbot renew --quiet --deploy-hook "docker compose -f /root/site\ Web/docker-compose.yml restart nginx"
```

---

## 📊 Monitoring et Maintenance

### Commandes Utiles

```bash
# Voir l'état des services
docker compose ps

# Voir les logs en temps réel
docker compose logs -f

# Redémarrer un service
docker compose restart <service-name>

# Voir l'utilisation des ressources
docker stats

# Vérifier l'espace disque
df -h
```

### Sauvegardes

```bash
# Sauvegarder les fichiers du projet
tar -czf backup-$(date +%Y%m%d).tar.gz /root/site\ Web/

# Sauvegarder les certificats SSL
tar -czf ssl-backup-$(date +%Y%m%d).tar.gz /etc/letsencrypt/
```

---

## 🐛 Dépannage

### Nginx ne démarre pas

```bash
# Vérifier la configuration
docker compose exec nginx nginx -t

# Voir les logs
docker compose logs nginx
```

### Certificats SSL expirés

```bash
# Renouveler manuellement
certbot renew

# Vérifier l'expiration
certbot certificates
```

### Services ne répondent pas

```bash
# Vérifier les healthchecks
docker compose ps

# Redémarrer tous les services
docker compose restart

# Voir les logs détaillés
docker compose logs --tail=100
```

---

## ✅ Checklist Finale

- [ ] Tous les services sont "healthy"
- [ ] DNS configuré et propagé
- [ ] SSL/HTTPS configuré
- [ ] Site accessible via `https://cartagespa.com`
- [ ] Redirection HTTP → HTTPS fonctionne
- [ ] Renouvellement automatique SSL configuré
- [ ] Monitoring en place
- [ ] Sauvegardes configurées

---

## 🎯 Accès Final

Une fois tout configuré, votre site sera accessible à :
- **HTTP** : `http://cartagespa.com`
- **HTTPS** : `https://cartagespa.com` (recommandé)

---

## 📝 Notes Importantes

1. **Sécurité** : Gardez vos certificats SSL privés et sécurisés
2. **Mises à jour** : Mettez à jour régulièrement les images Docker
3. **Logs** : Surveillez les logs pour détecter les problèmes
4. **Backups** : Faites des sauvegardes régulières
5. **Monitoring** : Configurez des alertes pour les pannes

---

## 🆘 Support

En cas de problème :
1. Vérifiez les logs : `docker compose logs`
2. Vérifiez l'état : `docker compose ps`
3. Redémarrez les services : `docker compose restart`
4. Consultez la documentation Docker Compose

