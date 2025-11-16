# 🔧 Solution : Nginx Masqué (Masked)

## ⚠️ Problème

Nginx système est **masqué** (masked), ce qui signifie qu'il a été désactivé de manière permanente. Cela empêche Certbot de fonctionner.

**Erreur** :
```
Failed to start nginx.service: Unit nginx.service is masked.
Failed to enable unit: Unit file /etc/systemd/system/nginx.service is masked.
```

---

## ✅ Solution : Démasquer Nginx

**Sur le serveur** :

```bash
# 1. Démasquer Nginx
systemctl unmask nginx

# 2. Démarrer Nginx
systemctl start nginx

# 3. Activer Nginx (pour qu'il démarre au boot)
systemctl enable nginx

# 4. Vérifier le statut
systemctl status nginx

# Devrait afficher : active (running)
```

---

## 🔍 Vérification

### Vérifier que Nginx fonctionne

```bash
# Vérifier le statut
systemctl status nginx

# Tester l'accès HTTP
curl -I http://cartagespa.com

# Devrait retourner : HTTP/1.1 200 OK
```

### Vérifier la configuration

```bash
# Tester la configuration
nginx -t

# Devrait afficher : syntax is ok, test is successful
```

---

## 🚀 Continuer avec Certbot

**Une fois Nginx démarré, vous pouvez générer les certificats** :

```bash
certbot --nginx -d cartagespa.com -d www.cartagespa.com
```

---

## 📝 Notes

- **Nginx système est utilisé temporairement** uniquement pour obtenir les certificats SSL
- **Après avoir obtenu les certificats**, nous arrêterons Nginx système et utiliserons Nginx Docker
- **Nginx Docker** sera configuré pour utiliser les certificats SSL

---

## 🔄 Après Obtention des Certificats

**Une fois les certificats obtenus** :

```bash
# Arrêter Nginx système
systemctl stop nginx
systemctl disable nginx

# Optionnel : Remasquer Nginx (pour éviter qu'il démarre accidentellement)
systemctl mask nginx

# Redémarrer Docker Compose avec la configuration HTTPS
cd "/root/site Web"
docker compose down
docker compose up -d
```

---

## 🆘 Si ça ne fonctionne pas

### Problème : Port 80 déjà utilisé

**Solution** :
```bash
# Vérifier ce qui utilise le port 80
netstat -tuln | grep :80

# Si c'est Docker Nginx, l'arrêter temporairement
docker compose stop nginx
```

### Problème : Nginx ne démarre pas

**Solution** :
```bash
# Vérifier les logs
journalctl -u nginx -n 50

# Vérifier la configuration
nginx -t

# Vérifier les permissions
ls -la /etc/nginx/
```

---

## ✅ Checklist

- [ ] Nginx démasqué : `systemctl unmask nginx`
- [ ] Nginx démarré : `systemctl start nginx`
- [ ] Nginx actif : `systemctl status nginx` → active (running)
- [ ] Site accessible : `curl -I http://cartagespa.com` → 200 OK
- [ ] Certbot peut générer les certificats

---

## 🎯 Résumé

**Commandes à exécuter** :
```bash
systemctl unmask nginx
systemctl start nginx
systemctl enable nginx
systemctl status nginx
curl -I http://cartagespa.com
```

**Ensuite** :
```bash
certbot --nginx -d cartagespa.com -d www.cartagespa.com
```

