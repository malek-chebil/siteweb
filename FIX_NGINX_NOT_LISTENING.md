# 🔧 Résoudre : Nginx Docker N'Écoute Pas sur le Port 80

## 🔍 Diagnostic

**Problème** : `curl: (7) Failed to connect to localhost port 80`

**Cause** : Le container Nginx Docker n'écoute pas sur le port 80.

**Vérification** : `netstat -tlnp | grep :80` ne montre rien (sauf peut-être le port 8000).

---

## ✅ SOLUTION 1 : Vérifier l'État du Container

### Vérifier l'État

```bash
# Sur le serveur
cd /root/site\ Web

# Voir l'état de tous les services
docker compose ps

# Vérifier spécifiquement Nginx
docker compose ps nginx
```

**Si Nginx n'est pas "Up"** = Problème de démarrage.

---

## ✅ SOLUTION 2 : Vérifier les Logs Nginx

### Voir les Logs

```bash
# Logs récents
docker compose logs nginx

# Logs en temps réel
docker compose logs -f nginx

# Dernières 50 lignes
docker compose logs nginx --tail=50
```

**Cherchez** des erreurs comme :
- `nginx: [emerg] ...`
- `configuration file ... test failed`
- `bind() to 0.0.0.0:80 failed`

---

## ✅ SOLUTION 3 : Vérifier la Configuration Nginx

### Tester la Configuration

```bash
# Tester la configuration dans le container
docker compose exec nginx nginx -t

# Voir la configuration
docker compose exec nginx cat /etc/nginx/nginx.conf
```

**Si la configuration est invalide** = Corrigez les erreurs.

---

## ✅ SOLUTION 4 : Redémarrer Nginx

### Redémarrer

```bash
# Arrêter Nginx
docker compose stop nginx

# Redémarrer
docker compose start nginx

# Ou redémarrer complètement
docker compose restart nginx

# Vérifier les logs
docker compose logs -f nginx
```

---

## ✅ SOLUTION 5 : Vérifier le Mapping des Ports

### Vérifier Docker Compose

```bash
# Voir la configuration des ports
docker compose config | grep -A 5 nginx

# Vérifier les ports du container
docker port cartagespa-nginx
```

**Devrait montrer** : `80/tcp -> 0.0.0.0:80`

---

## ✅ SOLUTION 6 : Recréer le Container Nginx

### Si Rien ne Fonctionne

```bash
# Sur le serveur
cd /root/site\ Web

# Supprimer le container Nginx
docker compose stop nginx
docker compose rm -f nginx

# Recréer
docker compose up -d nginx

# Vérifier les logs
docker compose logs -f nginx
```

---

## ✅ SOLUTION 7 : Vérifier que Nginx Écoute dans le Container

### Tester depuis le Container

```bash
# Vérifier que Nginx écoute dans le container
docker compose exec nginx netstat -tlnp | grep :80

# Ou avec ss
docker compose exec nginx ss -tlnp | grep :80

# Tester HTTP depuis le container
docker compose exec nginx wget -O- http://localhost/
```

**Si ça fonctionne dans le container mais pas depuis l'extérieur** = Problème de mapping de ports.

---

## 🔍 Diagnostic Complet

### Script de Diagnostic

Créez un fichier `diagnostic-nginx-port.sh` sur le serveur :

```bash
#!/bin/bash

echo "=== Diagnostic Port 80 Nginx ==="
echo ""

# 1. État du container
echo "1. État du container Nginx:"
docker compose ps nginx
echo ""

# 2. Ports mappés
echo "2. Ports mappés:"
docker port cartagespa-nginx 2>/dev/null || echo "   Container non trouvé"
echo ""

# 3. Port 80 sur l'hôte
echo "3. Port 80 sur l'hôte:"
netstat -tlnp | grep :80 || echo "   Rien n'écoute sur le port 80"
echo ""

# 4. Port 80 dans le container
echo "4. Port 80 dans le container:"
docker compose exec nginx netstat -tlnp 2>/dev/null | grep :80 || echo "   Nginx n'écoute pas dans le container"
echo ""

# 5. Logs récents
echo "5. Derniers logs Nginx:"
docker compose logs nginx --tail=20
echo ""

# 6. Test de configuration
echo "6. Test de configuration:"
docker compose exec nginx nginx -t 2>&1
echo ""
```

Exécutez-le :

```bash
chmod +x diagnostic-nginx-port.sh
./diagnostic-nginx-port.sh
```

---

## 🎯 Actions Immédiates

### Sur le Serveur

```bash
# 1. Vérifier l'état
docker compose ps

# 2. Voir les logs
docker compose logs nginx --tail=50

# 3. Tester la configuration
docker compose exec nginx nginx -t

# 4. Vérifier les ports
docker port cartagespa-nginx

# 5. Redémarrer
docker compose restart nginx

# 6. Vérifier les logs en temps réel
docker compose logs -f nginx
```

---

## 🐛 Causes Possibles

### 1. Configuration Nginx Invalide

**Symptôme** : Erreurs dans les logs, `nginx -t` échoue.

**Solution** : Corriger la configuration.

### 2. Port Déjà Utilisé (Mais Nginx Système Arrêté)

**Symptôme** : `bind() to 0.0.0.0:80 failed: address already in use`

**Solution** : Vérifier avec `netstat -tlnp | grep :80` et arrêter le service.

### 3. Container Ne Démarre Pas

**Symptôme** : Container en état "Restarting" ou "Exited".

**Solution** : Voir les logs et corriger le problème.

### 4. Mapping de Ports Incorrect

**Symptôme** : Nginx écoute dans le container mais pas depuis l'extérieur.

**Solution** : Vérifier `docker-compose.yml` et les ports mappés.

---

## ✅ Solution Rapide

```bash
# Sur le serveur
cd /root/site\ Web

# 1. Voir les logs
docker compose logs nginx

# 2. Si erreur de configuration, vérifier
docker compose exec nginx nginx -t

# 3. Redémarrer complètement
docker compose restart nginx

# 4. Vérifier
docker compose ps
netstat -tlnp | grep :80
curl http://localhost/health
```

---

## 📝 Notes

- Le port 80 doit être mappé dans `docker-compose.yml` : `"80:80"`
- Nginx doit écouter sur `0.0.0.0:80` dans le container
- Vérifiez toujours les logs en cas de problème
- Le container doit être "Up" pour que les ports soient mappés

---

## 🆘 Si Rien ne Fonctionne

1. **Vérifiez Docker** : `docker --version`
2. **Vérifiez Docker Compose** : `docker compose version`
3. **Recréez tout** : `docker compose down && docker compose up -d`
4. **Vérifiez les permissions** : Le port 80 nécessite des privilèges (root ou capabilities)

