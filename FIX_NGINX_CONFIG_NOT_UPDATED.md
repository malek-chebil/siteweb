# 🔧 Résoudre : Configuration Nginx Non Mis à Jour

## 🔍 Diagnostic

**Erreur** : `host not found in upstream "frontend" in /etc/nginx/nginx.conf:29`

**Problème** : Le fichier `nginx.conf` sur le serveur n'a pas été mis à jour avec la nouvelle configuration.

**Cause** : Le fichier local a été modifié mais n'a pas été transféré sur le serveur.

---

## ✅ SOLUTION 1 : Transférer le Fichier Corrigé

### Depuis PowerShell (dans `site Web`)

```powershell
scp -i "..\config site web\1984_hosting_key" nginx\nginx.conf root@89.147.111.166:"/root/site Web/nginx/"
```

### Sur le Serveur

```bash
cd /root/site\ Web

# Vérifier que le fichier a été mis à jour
cat nginx/nginx.conf | head -35

# Redémarrer Nginx
docker compose restart nginx

# Vérifier les logs
docker compose logs nginx
```

---

## ✅ SOLUTION 2 : Modifier Directement sur le Serveur

### Obtenir les IPs des Services

```bash
# Sur le serveur
cd /root/site\ Web

# IP du frontend
FRONTEND_IP=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' cartagespa-frontend)
echo "Frontend IP: $FRONTEND_IP"

# IP du backend
BACKEND_IP=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' cartagespa-backend)
echo "Backend IP: $BACKEND_IP"
```

### Modifier nginx.conf avec les IPs

```bash
# Éditer le fichier
nano nginx/nginx.conf
```

**Remplacez** :
```nginx
proxy_pass http://frontend:80;
```
**Par** :
```nginx
proxy_pass http://172.18.0.X:80;  # Remplacez X par l'IP du frontend
```

**Et** :
```nginx
proxy_pass http://backend:8000;
```
**Par** :
```nginx
proxy_pass http://172.18.0.Y:8000;  # Remplacez Y par l'IP du backend
```

**Puis** :
```bash
# Redémarrer Nginx
docker compose restart nginx
```

---

## ✅ SOLUTION 3 : Utiliser un Script pour Obtenir les IPs Dynamiquement

### Créer un Script de Démarrage

Créez `nginx/start-nginx-with-ips.sh` :

```bash
#!/bin/sh
# Wait for services and get IPs dynamically

echo "Waiting for services..."

# Wait for backend
until docker inspect cartagespa-backend > /dev/null 2>&1; do
  sleep 1
done

# Wait for frontend
until docker inspect cartagespa-frontend > /dev/null 2>&1; do
  sleep 1
done

# Get IPs
FRONTEND_IP=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' cartagespa-frontend)
BACKEND_IP=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' cartagespa-backend)

echo "Frontend IP: $FRONTEND_IP"
echo "Backend IP: $BACKEND_IP"

# Create nginx config with IPs
cat > /etc/nginx/nginx.conf <<EOF
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;

    server {
        listen 80;
        server_name cartagespa.com www.cartagespa.com 89.147.111.166;

        location / {
            proxy_pass http://${FRONTEND_IP}:80;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        location /api {
            proxy_pass http://${BACKEND_IP}:8000;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        location /health {
            proxy_pass http://${BACKEND_IP}:8000/health;
        }
    }
}
EOF

# Start nginx
exec nginx -g 'daemon off;'
```

**Puis** modifiez `docker-compose.yml` pour utiliser ce script au lieu de `start-nginx-simple.sh`.

---

## ✅ SOLUTION 4 : Vérifier et Corriger le Fichier

### Vérifier le Contenu Actuel

```bash
# Sur le serveur
docker compose exec nginx cat /etc/nginx/nginx.conf | head -35
```

**Si vous voyez encore** :
```nginx
resolver 127.0.0.11 valid=30s;
set $frontend_upstream frontend;
proxy_pass http://$frontend_upstream:80;
```

**Alors** le fichier n'a pas été mis à jour.

### Corriger Directement

```bash
# Sur le serveur
cd /root/site\ Web

# Vérifier le fichier local
cat nginx/nginx.conf | grep -A 5 "location /"

# Si c'est l'ancienne version, transférez le nouveau fichier
# OU modifiez-le directement avec nano
```

---

## 🎯 Solution Recommandée : Transférer le Fichier

### Étape par Étape

1. **Depuis PowerShell** (dans `site Web`) :
   ```powershell
   scp -i "..\config site web\1984_hosting_key" nginx\nginx.conf root@89.147.111.166:"/root/site Web/nginx/"
   ```

2. **Sur le serveur** :
   ```bash
   cd /root/site\ Web
   
   # Vérifier
   cat nginx/nginx.conf | head -35
   
   # Redémarrer
   docker compose restart nginx
   
   # Vérifier les logs
   docker compose logs nginx
   ```

3. **Tester** :
   ```bash
   curl http://localhost/health
   curl http://localhost/
   ```

---

## 📝 Notes

- Le fichier `nginx.conf` doit être transféré sur le serveur après chaque modification
- La nouvelle configuration utilise les noms directement (sans resolver)
- Les services doivent être démarrés avant Nginx (déjà configuré avec `depends_on`)
- Si les noms ne fonctionnent toujours pas, utilisez les IPs directement

---

## 🆘 Si Rien ne Fonctionne

1. **Utilisez les IPs directement** (solution 2)
2. **Utilisez le script dynamique** (solution 3)
3. **Vérifiez le réseau Docker** : `docker network inspect siteweb_cartagespa-network`

