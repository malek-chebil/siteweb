# 🔧 Résoudre le Problème "Welcome to nginx"

## 🔍 Diagnostic

**Problème** : Nginx affiche la page par défaut "Welcome to nginx!" au lieu de votre application.

**Cela signifie** :
- ✅ Nginx fonctionne (le serveur répond)
- ❌ La configuration personnalisée n'est pas appliquée
- ❌ Nginx utilise la configuration par défaut

---

## ✅ SOLUTION 1 : Vérifier sur le Serveur

### Se Connecter au Serveur

```powershell
ssh -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" root@89.147.111.166
```

### Vérifications

```bash
# 1. Vérifier l'état des services
cd /root/site\ Web
docker compose ps

# 2. Vérifier les logs Nginx
docker compose logs nginx

# 3. Vérifier la configuration dans le container
docker compose exec nginx cat /etc/nginx/nginx.conf

# 4. Vérifier si le fichier est monté
docker compose exec nginx ls -la /etc/nginx/

# 5. Tester la configuration Nginx
docker compose exec nginx nginx -t
```

---

## ✅ SOLUTION 2 : Vérifier que la Configuration est Montée

### Vérifier le Volume

```bash
# Sur le serveur
cd /root/site\ Web

# Vérifier que le fichier existe
ls -la nginx/nginx.conf

# Vérifier le contenu
cat nginx/nginx.conf

# Vérifier dans le container
docker compose exec nginx cat /etc/nginx/nginx.conf
```

**Si les deux fichiers sont différents** = Le volume n'est pas monté correctement.

---

## ✅ SOLUTION 3 : Redémarrer Nginx avec la Bonne Configuration

### Redémarrer les Services

```bash
# Sur le serveur
cd /root/site\ Web

# Arrêter tous les services
docker compose down

# Redémarrer avec la configuration
docker compose up -d

# Vérifier les logs
docker compose logs -f nginx
```

---

## ✅ SOLUTION 4 : Vérifier que les Services sont Démarrés

### Vérifier l'État

```bash
# Vérifier tous les services
docker compose ps

# Devrait montrer :
# - backend: Up (healthy)
# - frontend: Up (healthy)
# - nginx: Up
```

**Si frontend ou backend ne sont pas "healthy"** = Nginx ne peut pas les joindre.

---

## ✅ SOLUTION 5 : Vérifier la Configuration Nginx

### Vérifier le Contenu

La configuration devrait pointer vers :
- `frontend:80` pour le frontend
- `backend:8000` pour le backend

### Tester depuis le Container Nginx

```bash
# Tester si Nginx peut joindre le frontend
docker compose exec nginx ping -c 1 frontend

# Tester si Nginx peut joindre le backend
docker compose exec nginx ping -c 1 backend

# Tester HTTP
docker compose exec nginx wget -O- http://frontend:80
docker compose exec nginx wget -O- http://backend:8000/health
```

---

## ✅ SOLUTION 6 : Vérifier le Fichier nginx.conf sur le Serveur

### Vérifier le Contenu

```bash
# Sur le serveur
cd /root/site\ Web
cat nginx/nginx.conf
```

**Vérifiez** que le fichier contient :
- `server_name cartagespa.com www.cartagespa.com 89.147.111.166;`
- `proxy_pass http://$frontend_upstream:80;`
- `proxy_pass http://$backend_upstream:8000;`

---

## ✅ SOLUTION 7 : Recréer le Container Nginx

### Si Rien ne Fonctionne

```bash
# Sur le serveur
cd /root/site\ Web

# Supprimer le container Nginx
docker compose stop nginx
docker compose rm -f nginx

# Recréer avec la bonne configuration
docker compose up -d nginx

# Vérifier les logs
docker compose logs -f nginx
```

---

## 🔍 Diagnostic Complet

### Script de Diagnostic

Créez un fichier `diagnostic-nginx.sh` sur le serveur :

```bash
#!/bin/bash

echo "=== Diagnostic Nginx ==="
echo ""

# 1. État des services
echo "1. État des services:"
docker compose ps
echo ""

# 2. Configuration dans le container
echo "2. Configuration dans le container:"
docker compose exec nginx cat /etc/nginx/nginx.conf | head -30
echo ""

# 3. Test de configuration
echo "3. Test de configuration Nginx:"
docker compose exec nginx nginx -t
echo ""

# 4. Test de connexion
echo "4. Test de connexion aux services:"
docker compose exec nginx ping -c 1 frontend 2>/dev/null && echo "✅ Frontend accessible" || echo "❌ Frontend inaccessible"
docker compose exec nginx ping -c 1 backend 2>/dev/null && echo "✅ Backend accessible" || echo "❌ Backend inaccessible"
echo ""

# 5. Logs récents
echo "5. Derniers logs Nginx:"
docker compose logs nginx --tail=20
```

Exécutez-le :

```bash
chmod +x diagnostic-nginx.sh
./diagnostic-nginx.sh
```

---

## 🎯 Actions Immédiates

### Sur le Serveur (SSH)

```bash
# 1. Aller dans le dossier
cd /root/site\ Web

# 2. Vérifier l'état
docker compose ps

# 3. Vérifier la configuration
docker compose exec nginx cat /etc/nginx/nginx.conf

# 4. Si la configuration est incorrecte, redémarrer
docker compose restart nginx

# 5. Vérifier les logs
docker compose logs nginx
```

---

## 🐛 Causes Possibles

### 1. Configuration Pas Montée

**Symptôme** : Le fichier dans le container est différent de celui sur le serveur.

**Solution** : Vérifier le volume dans `docker-compose.yml` :
```yaml
volumes:
  - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
```

### 2. Services Pas Démarrés

**Symptôme** : Frontend ou backend ne sont pas "healthy".

**Solution** : Vérifier `docker compose ps` et redémarrer les services.

### 3. Nginx Ne Peut Pas Résoudre les Noms

**Symptôme** : Nginx ne peut pas joindre `frontend` ou `backend`.

**Solution** : Vérifier que tous les services sont sur le même réseau Docker.

### 4. Configuration Par Défaut Prioritaire

**Symptôme** : Nginx utilise `/etc/nginx/conf.d/default.conf` au lieu de `/etc/nginx/nginx.conf`.

**Solution** : Vérifier que `nginx.conf` inclut bien notre configuration et pas la config par défaut.

---

## ✅ Solution Rapide

### Redémarrer Tout

```bash
# Sur le serveur
cd /root/site\ Web

# Arrêter tout
docker compose down

# Redémarrer
docker compose up -d

# Vérifier
docker compose ps
docker compose logs nginx
```

---

## 📝 Notes

- La page "Welcome to nginx!" signifie que Nginx utilise sa configuration par défaut
- Vérifiez toujours que la configuration est bien montée dans Docker
- Les services doivent être sur le même réseau Docker
- Redémarrer Nginx peut résoudre le problème

---

## 🆘 Si Rien ne Fonctionne

1. **Vérifiez les logs** : `docker compose logs nginx`
2. **Vérifiez la configuration** : `docker compose exec nginx cat /etc/nginx/nginx.conf`
3. **Recréez le container** : `docker compose up -d --force-recreate nginx`
4. **Vérifiez les volumes** : `docker compose config`

