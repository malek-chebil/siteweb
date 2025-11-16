# 🔧 Solution : Nginx Redémarre en Boucle

## ⚠️ Problème

Le conteneur Nginx redémarre en boucle (status: `Restarting`), ce qui indique une erreur dans la configuration ou le script.

---

## 🔍 Diagnostic

### 1. Voir les Logs Nginx

**Sur le serveur** :

```bash
# Voir les logs complets
docker compose logs nginx

# Voir les 50 dernières lignes
docker compose logs nginx --tail 50

# Suivre les logs en temps réel
docker compose logs -f nginx
```

### 2. Tester la Configuration Nginx

```bash
# Tester la configuration dans le conteneur
docker compose exec nginx nginx -t

# Si le conteneur ne démarre pas, utiliser docker run
docker run --rm -v "/root/site Web/nginx/start-nginx-with-ips.sh:/start-nginx.sh:ro" nginx:alpine sh /start-nginx.sh
```

---

## 🔧 Solutions Possibles

### Solution 1 : Certificats SSL Non Accessibles

**Problème** : Le volume `/etc/letsencrypt` n'est pas monté correctement.

**Vérification** :
```bash
# Vérifier que le volume est dans docker-compose.yml
grep letsencrypt docker-compose.yml

# Devrait afficher : - /etc/letsencrypt:/etc/letsencrypt:ro
```

**Si manquant, ajouter** :
```bash
# Éditer docker-compose.yml
nano docker-compose.yml

# Dans la section nginx volumes, ajouter :
volumes:
  - ./nginx/ssl:/etc/nginx/ssl:ro
  - ./nginx/start-nginx-with-ips.sh:/start-nginx.sh:ro
  - /var/run/docker.sock:/var/run/docker.sock:ro
  - /etc/letsencrypt:/etc/letsencrypt:ro  # ← AJOUTER CETTE LIGNE
```

### Solution 2 : Erreur dans le Script

**Problème** : Le script `start-nginx-with-ips.sh` a une erreur de syntaxe.

**Vérification** :
```bash
# Vérifier la syntaxe du script
bash -n nginx/start-nginx-with-ips.sh

# Vérifier les permissions
ls -la nginx/start-nginx-with-ips.sh
chmod +x nginx/start-nginx-with-ips.sh
```

### Solution 3 : Certificats Non Trouvés

**Problème** : Le script ne trouve pas les certificats SSL.

**Vérification** :
```bash
# Vérifier que les certificats existent
ls -la /etc/letsencrypt/live/cartagespa.com/

# Tester l'accès depuis le conteneur
docker compose exec nginx ls -la /etc/letsencrypt/live/cartagespa.com/
```

**Si les certificats ne sont pas accessibles** :
```bash
# Vérifier les permissions
ls -la /etc/letsencrypt/live/

# Les certificats doivent être accessibles en lecture
```

### Solution 4 : Port 80/443 Déjà Utilisé

**Problème** : Nginx système utilise encore les ports 80/443.

**Solution** :
```bash
# Vérifier ce qui utilise les ports
netstat -tuln | grep -E ':(80|443)'

# Arrêter Nginx système
systemctl stop nginx
systemctl mask nginx

# Redémarrer Docker
docker compose down
docker compose up -d
```

---

## 🛠️ Solution Rapide : Vérifier les Logs

**Commande la plus importante** :

```bash
docker compose logs nginx --tail 100
```

**Cherchez les erreurs** :
- `nginx: [emerg]` → Erreur de configuration
- `Permission denied` → Problème de permissions
- `No such file or directory` → Fichier manquant
- `Address already in use` → Port occupé

---

## 🔄 Solution Alternative : Script Simplifié

**Si le script a des problèmes, utiliser une version simplifiée** :

```bash
# Créer un script de test
cat > nginx/start-nginx-simple.sh <<'EOF'
#!/bin/sh
echo "Starting Nginx with HTTPS..."

# Vérifier les certificats
if [ -f "/etc/letsencrypt/live/cartagespa.com/fullchain.pem" ]; then
  echo "SSL certificates found"
else
  echo "WARNING: SSL certificates not found"
fi

# Créer une configuration simple pour tester
cat > /etc/nginx/nginx.conf <<'NGINXEOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # HTTP - Redirect to HTTPS
    server {
        listen 80;
        server_name cartagespa.com www.cartagespa.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS
    server {
        listen 443 ssl http2;
        server_name cartagespa.com www.cartagespa.com;

        ssl_certificate /etc/letsencrypt/live/cartagespa.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/cartagespa.com/privkey.pem;

        location / {
            proxy_pass http://frontend:80;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api {
            proxy_pass http://backend:8000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
NGINXEOF

nginx -t
exec nginx -g 'daemon off;'
EOF

chmod +x nginx/start-nginx-simple.sh

# Modifier docker-compose.yml temporairement
# Changer : ./nginx/start-nginx-with-ips.sh:/start-nginx.sh:ro
# Par : ./nginx/start-nginx-simple.sh:/start-nginx.sh:ro
```

---

## 📋 Checklist de Diagnostic

- [ ] Logs Nginx vérifiés : `docker compose logs nginx`
- [ ] Configuration testée : `docker compose exec nginx nginx -t`
- [ ] Certificats vérifiés : `ls -la /etc/letsencrypt/live/cartagespa.com/`
- [ ] Volume SSL vérifié : `grep letsencrypt docker-compose.yml`
- [ ] Ports vérifiés : `netstat -tuln | grep -E ':(80|443)'`
- [ ] Nginx système arrêté : `systemctl status nginx`

---

## 🆘 Commande de Diagnostic Complète

```bash
# Diagnostic complet
echo "=== Diagnostic Nginx ==="
echo ""
echo "1. Logs Nginx :"
docker compose logs nginx --tail 30
echo ""
echo "2. Statut conteneurs :"
docker compose ps
echo ""
echo "3. Certificats SSL :"
ls -la /etc/letsencrypt/live/cartagespa.com/ 2>&1
echo ""
echo "4. Volume dans docker-compose.yml :"
grep letsencrypt docker-compose.yml
echo ""
echo "5. Ports utilisés :"
netstat -tuln | grep -E ':(80|443)'
echo ""
echo "6. Nginx système :"
systemctl status nginx --no-pager
```

---

## 🎯 Prochaine Étape

**Exécutez d'abord** :
```bash
docker compose logs nginx --tail 50
```

**Envoyez-moi les logs** pour que je puisse identifier le problème exact.

