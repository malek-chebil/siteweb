# 🔧 Résoudre "Port 80 Already in Use"

## 🔍 Diagnostic

**Erreur** : `failed to bind host port 0.0.0.0:80/tcp: address already in use`

**Cause** : Un autre service (probablement Nginx système) écoute déjà sur le port 80.

**Solution** : Arrêter le service qui utilise le port 80.

---

## ✅ SOLUTION 1 : Arrêter Nginx Système

### Vérifier si Nginx Système Tourne

```bash
# Sur le serveur
systemctl status nginx

# Voir ce qui écoute sur le port 80
netstat -tlnp | grep :80
# ou
ss -tlnp | grep :80
```

### Arrêter Nginx Système

```bash
# Arrêter Nginx système
systemctl stop nginx

# Désactiver au démarrage (optionnel)
systemctl disable nginx

# Vérifier qu'il est arrêté
systemctl status nginx
```

### Redémarrer Docker Compose

```bash
cd /root/site\ Web
docker compose up -d
```

---

## ✅ SOLUTION 2 : Vérifier Autres Services sur Port 80

### Voir Tous les Services sur Port 80

```bash
# Voir ce qui écoute sur le port 80
lsof -i :80

# Ou avec netstat
netstat -tlnp | grep :80

# Ou avec ss
ss -tlnp | grep :80
```

### Arrêter le Service

Selon le service trouvé :

```bash
# Si c'est Apache
systemctl stop apache2

# Si c'est un autre Nginx
systemctl stop nginx

# Si c'est un autre service Docker
docker ps | grep 80
docker stop <container_id>
```

---

## ✅ SOLUTION 3 : Changer le Port de Nginx Docker (Temporaire)

### Si Vous Ne Pouvez Pas Arrêter le Service

Modifiez `docker-compose.yml` pour utiliser un autre port :

```yaml
nginx:
  ports:
    - "8080:80"  # Au lieu de "80:80"
    - "443:443"
```

**Puis** :
```bash
docker compose up -d
```

**Accès** : `http://89.147.111.166:8080`

**Note** : Ce n'est qu'une solution temporaire. Il vaut mieux arrêter le service qui utilise le port 80.

---

## ✅ SOLUTION 4 : Vérifier que Tout Fonctionne

### Après Avoir Arrêté le Service

```bash
# 1. Vérifier l'état
docker compose ps

# 2. Tester la résolution DNS
docker compose exec nginx nslookup frontend 127.0.0.11
docker compose exec nginx ping -c 1 frontend

# 3. Tester HTTP
curl http://localhost/
curl http://localhost/health

# 4. Vérifier les logs
docker compose logs nginx
```

---

## 🔍 Diagnostic Complet

### Script de Diagnostic

Créez un fichier `diagnostic-port80.sh` sur le serveur :

```bash
#!/bin/bash

echo "=== Diagnostic Port 80 ==="
echo ""

# 1. Services sur port 80
echo "1. Services qui écoutent sur le port 80:"
lsof -i :80 2>/dev/null || ss -tlnp | grep :80
echo ""

# 2. État Nginx système
echo "2. État Nginx système:"
systemctl status nginx --no-pager 2>/dev/null | head -5 || echo "   Nginx système non installé"
echo ""

# 3. État Apache
echo "3. État Apache:"
systemctl status apache2 --no-pager 2>/dev/null | head -5 || echo "   Apache non installé"
echo ""

# 4. Containers Docker sur port 80
echo "4. Containers Docker sur port 80:"
docker ps --format "table {{.Names}}\t{{.Ports}}" | grep 80 || echo "   Aucun container Docker sur port 80"
echo ""

# 5. Test de connexion
echo "5. Test de connexion au port 80:"
curl -I http://localhost:80 2>/dev/null | head -1 || echo "   Port 80 non accessible"
echo ""
```

Exécutez-le :

```bash
chmod +x diagnostic-port80.sh
./diagnostic-port80.sh
```

---

## 🎯 Actions Immédiates

### Sur le Serveur

```bash
# 1. Arrêter Nginx système
systemctl stop nginx
systemctl disable nginx

# 2. Vérifier qu'il est arrêté
systemctl status nginx

# 3. Vérifier le port 80
netstat -tlnp | grep :80

# 4. Redémarrer Docker Compose
cd /root/site\ Web
docker compose up -d

# 5. Vérifier l'état
docker compose ps

# 6. Tester
curl http://localhost/
```

---

## ✅ Vérifications Après Correction

### Tester que Tout Fonctionne

```bash
# 1. État des services
docker compose ps
# Devrait montrer tous les services "Up"

# 2. Test DNS
docker compose exec nginx nslookup frontend 127.0.0.11
# Devrait retourner l'IP du frontend

# 3. Test ping
docker compose exec nginx ping -c 1 frontend
# Devrait fonctionner

# 4. Test HTTP
curl http://localhost/
# Devrait retourner le HTML du frontend

curl http://localhost/health
# Devrait retourner {"status":"ok"}
```

---

## 🐛 Si le Problème Persiste

### Vérifier les Logs

```bash
# Logs Docker Compose
docker compose logs

# Logs Nginx
docker compose logs nginx

# Logs système
journalctl -u nginx
```

### Vérifier les Permissions

```bash
# Vérifier que Docker peut utiliser le port 80
# (normalement pas de problème si vous êtes root)
```

---

## 📝 Notes

- Le port 80 est souvent utilisé par Nginx ou Apache système
- Il faut arrêter le service système pour que Docker puisse utiliser le port 80
- Vous pouvez désactiver le service au démarrage avec `systemctl disable`
- Après avoir arrêté le service, redémarrez Docker Compose

---

## 🆘 Si Rien ne Fonctionne

1. **Vérifiez tous les services** : `systemctl list-units --type=service | grep -E "nginx|apache|http"`
2. **Vérifiez les containers Docker** : `docker ps -a`
3. **Vérifiez les ports** : `netstat -tlnp | grep -E ":80|:443"`
4. **Utilisez un autre port temporairement** : Modifiez `docker-compose.yml` pour utiliser le port 8080

