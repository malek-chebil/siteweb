# 🔧 Résoudre le Problème de Resolver Docker dans Nginx

## 🔍 Diagnostic

**Erreur** : `nslookup: write to '127.0.0.11': Connection refused`

**Problème** : Le resolver Docker (127.0.0.11) ne fonctionne pas dans le container Nginx.

**Causes possibles** :
1. Le container Nginx n'a pas accès au resolver Docker
2. Le resolver n'est pas disponible dans l'image alpine
3. Problème de configuration réseau

---

## ✅ SOLUTION 1 : Utiliser les IPs Directement (Solution Rapide)

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

### Modifier nginx.conf pour Utiliser les IPs

Modifiez `nginx/nginx.conf` pour utiliser les IPs directement au lieu des noms :

```nginx
# Frontend (React build)
location / {
    proxy_pass http://172.18.0.X:80;  # Remplacez X par l'IP du frontend
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Backend API
location /api {
    proxy_pass http://172.18.0.Y:8000;  # Remplacez Y par l'IP du backend
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

**Problème** : Les IPs peuvent changer à chaque redémarrage.

---

## ✅ SOLUTION 2 : Utiliser les Noms Sans Resolver (Recommandé)

### Modifier nginx.conf

Supprimez le resolver et utilisez les noms directement. Nginx résoudra les noms au démarrage :

```nginx
# Frontend (React build)
location / {
    proxy_pass http://frontend:80;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Backend API
location /api {
    proxy_pass http://backend:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

**Important** : Les services doivent être démarrés avant Nginx (déjà configuré avec `depends_on`).

---

## ✅ SOLUTION 3 : Vérifier le Réseau Docker

### Inspecter le Réseau

```bash
# Voir le réseau
docker network inspect siteweb_cartagespa-network

# Vérifier que tous les services sont dans le réseau
docker network inspect siteweb_cartagespa-network | grep -A 10 "Containers"
```

**Vérifiez** que `backend`, `frontend`, et `nginx` sont tous listés.

---

## ✅ SOLUTION 4 : Utiliser un Script pour Obtenir les IPs Dynamiquement

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

# Replace IPs in nginx.conf
sed -i "s/frontend:80/$FRONTEND_IP:80/g" /etc/nginx/nginx.conf
sed -i "s/backend:8000/$BACKEND_IP:8000/g" /etc/nginx/nginx.conf

# Start nginx
exec nginx -g 'daemon off;'
```

**Complexe** : Pas recommandé, mieux d'utiliser la solution 2.

---

## ✅ SOLUTION 5 : Vérifier que Nginx est sur le Bon Réseau

### Vérifier le Réseau de Nginx

```bash
# Voir les réseaux de Nginx
docker inspect cartagespa-nginx | grep -A 10 "Networks"

# Voir tous les réseaux
docker network ls

# Vérifier que Nginx est sur cartagespa-network
docker network inspect siteweb_cartagespa-network | grep cartagespa-nginx
```

**Si Nginx n'est pas sur le réseau** = Problème de configuration docker-compose.yml.

---

## 🎯 Solution Recommandée : Utiliser les Noms Directement

### Modifier nginx.conf

La solution la plus simple est d'utiliser les noms directement sans resolver, car :
1. Les services sont démarrés avant Nginx (dépendances)
2. Nginx résoudra les noms au démarrage
3. Plus simple et plus fiable

### Configuration Simplifiée

```nginx
http {
    # ... autres configurations ...

    server {
        listen 80;
        server_name cartagespa.com www.cartagespa.com 89.147.111.166;

        # Frontend (React build)
        location / {
            proxy_pass http://frontend:80;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Backend API
        location /api {
            proxy_pass http://backend:8000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health check
        location /health {
            proxy_pass http://backend:8000/health;
        }
    }
}
```

**Supprimez** toutes les lignes avec `resolver` et `set $..._upstream`.

---

## 🔧 Actions Immédiates

### Sur le Serveur

```bash
# 1. Obtenir les IPs (pour vérification)
docker inspect cartagespa-frontend | grep IPAddress
docker inspect cartagespa-backend | grep IPAddress

# 2. Tester avec les IPs directement
FRONTEND_IP=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' cartagespa-frontend)
docker compose exec nginx ping -c 1 $FRONTEND_IP

# 3. Si ça fonctionne avec l'IP, modifier nginx.conf pour utiliser les noms directement
# (voir solution 2)
```

---

## 📝 Notes

- Le resolver Docker (127.0.0.11) peut ne pas fonctionner dans certaines images
- Utiliser les noms directement est plus simple et plus fiable
- Les services doivent être démarrés avant Nginx (déjà configuré)
- Si les IPs changent, il faudra modifier la config (d'où l'intérêt d'utiliser les noms)

