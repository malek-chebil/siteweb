# 🔧 Résoudre le Problème de Réseau Docker

## 🔍 Diagnostic

**Erreur** : `ping: bad address 'frontend'`

**Problème** : Nginx ne peut pas résoudre les noms de services Docker (`frontend`, `backend`).

**Causes possibles** :
1. Nginx n'est pas sur le même réseau Docker que les autres services
2. Le resolver Docker (127.0.0.11) ne fonctionne pas
3. Les services ne sont pas démarrés quand Nginx démarre
4. Problème de configuration du réseau Docker

---

## ✅ SOLUTION 1 : Vérifier le Réseau Docker

### Inspecter le Réseau

```bash
# Sur le serveur
cd /root/site\ Web

# Voir tous les réseaux
docker network ls

# Inspecter le réseau
docker network inspect siteweb_cartagespa-network

# Vérifier que tous les services sont dans le réseau
docker network inspect siteweb_cartagespa-network | grep -A 5 "Containers"
```

**Vérifiez** que `backend`, `frontend`, et `nginx` sont tous listés dans le réseau.

---

## ✅ SOLUTION 2 : Vérifier les IPs des Services

### Voir les Adresses IP

```bash
# IP du frontend
docker inspect cartagespa-frontend | grep IPAddress

# IP du backend
docker inspect cartagespa-backend | grep IPAddress

# IP de nginx
docker inspect cartagespa-nginx | grep IPAddress
```

**Tous doivent être sur le même réseau** (même sous-réseau).

---

## ✅ SOLUTION 3 : Redémarrer Tous les Services

### Redémarrer Complètement

```bash
# Sur le serveur
cd /root/site\ Web

# Arrêter tous les services
docker compose down

# Redémarrer
docker compose up -d

# Vérifier l'état
docker compose ps

# Vérifier les logs
docker compose logs -f
```

**Cela recréera le réseau et reconnectera tous les services.**

---

## ✅ SOLUTION 4 : Vérifier la Configuration Docker Compose

### Vérifier que Tous les Services sont sur le Même Réseau

Le fichier `docker-compose.yml` doit avoir :

```yaml
services:
  backend:
    networks:
      - cartagespa-network
  
  frontend:
    networks:
      - cartagespa-network
  
  nginx:
    networks:
      - cartagespa-network

networks:
  cartagespa-network:
    driver: bridge
```

**Vérifiez** que tous les services ont `networks: - cartagespa-network`.

---

## ✅ SOLUTION 5 : Tester avec les IPs Directes

### Solution Temporaire

Si le DNS Docker ne fonctionne pas, vous pouvez utiliser les IPs directes :

```bash
# Obtenir l'IP du frontend
FRONTEND_IP=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' cartagespa-frontend)
echo "Frontend IP: $FRONTEND_IP"

# Obtenir l'IP du backend
BACKEND_IP=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' cartagespa-backend)
echo "Backend IP: $BACKEND_IP"

# Tester depuis Nginx
docker compose exec nginx ping -c 1 $FRONTEND_IP
docker compose exec nginx ping -c 1 $BACKEND_IP
```

**Si ça fonctionne avec les IPs** = Le problème est le DNS Docker, pas le réseau.

---

## ✅ SOLUTION 6 : Forcer la Recréation du Réseau

### Supprimer et Recréer le Réseau

```bash
# Sur le serveur
cd /root/site\ Web

# Arrêter tous les services
docker compose down

# Supprimer le réseau manuellement (si nécessaire)
docker network rm siteweb_cartagespa-network

# Redémarrer (créera un nouveau réseau)
docker compose up -d

# Vérifier
docker compose ps
docker network inspect siteweb_cartagespa-network
```

---

## ✅ SOLUTION 7 : Vérifier le Resolver Docker

### Tester le Resolver

```bash
# Depuis le container Nginx, tester le resolver
docker compose exec nginx nslookup frontend 127.0.0.11

# Devrait retourner l'IP du frontend
```

**Si ça ne fonctionne pas** = Le resolver Docker ne fonctionne pas dans le container Nginx.

---

## 🔍 Diagnostic Complet

### Script de Diagnostic

Créez un fichier `diagnostic-network.sh` sur le serveur :

```bash
#!/bin/bash

echo "=== Diagnostic Réseau Docker ==="
echo ""

# 1. Réseaux
echo "1. Réseaux Docker:"
docker network ls | grep cartagespa
echo ""

# 2. Services dans le réseau
echo "2. Services dans le réseau:"
docker network inspect siteweb_cartagespa-network 2>/dev/null | grep -A 10 "Containers" || echo "   Réseau non trouvé"
echo ""

# 3. IPs des services
echo "3. Adresses IP des services:"
echo "   Frontend:"
docker inspect cartagespa-frontend 2>/dev/null | grep -A 5 "IPAddress" | grep -v "SecondaryIPAddresses" || echo "   ❌ Frontend non trouvé"
echo "   Backend:"
docker inspect cartagespa-backend 2>/dev/null | grep -A 5 "IPAddress" | grep -v "SecondaryIPAddresses" || echo "   ❌ Backend non trouvé"
echo "   Nginx:"
docker inspect cartagespa-nginx 2>/dev/null | grep -A 5 "IPAddress" | grep -v "SecondaryIPAddresses" || echo "   ❌ Nginx non trouvé"
echo ""

# 4. Test de résolution depuis Nginx
echo "4. Test de résolution DNS depuis Nginx:"
docker compose exec nginx nslookup frontend 127.0.0.11 2>/dev/null && echo "   ✅ Frontend résolu" || echo "   ❌ Frontend non résolu"
docker compose exec nginx nslookup backend 127.0.0.11 2>/dev/null && echo "   ✅ Backend résolu" || echo "   ❌ Backend non résolu"
echo ""

# 5. Test de ping avec IP
echo "5. Test de ping avec IP directe:"
FRONTEND_IP=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' cartagespa-frontend 2>/dev/null)
if [ -n "$FRONTEND_IP" ]; then
    docker compose exec nginx ping -c 1 $FRONTEND_IP 2>/dev/null && echo "   ✅ Ping frontend OK" || echo "   ❌ Ping frontend échoue"
else
    echo "   ❌ IP frontend non trouvée"
fi
echo ""
```

Exécutez-le :

```bash
chmod +x diagnostic-network.sh
./diagnostic-network.sh
```

---

## 🎯 Actions Immédiates

### Sur le Serveur

```bash
# 1. Arrêter tous les services
cd /root/site\ Web
docker compose down

# 2. Vérifier le réseau (devrait être supprimé)
docker network ls | grep cartagespa

# 3. Redémarrer (créera un nouveau réseau)
docker compose up -d

# 4. Vérifier l'état
docker compose ps

# 5. Tester la résolution
docker compose exec nginx nslookup frontend 127.0.0.11

# 6. Si ça fonctionne, tester ping
docker compose exec nginx ping -c 1 frontend
```

---

## 🐛 Cause Probable

Le problème le plus probable est que **le réseau Docker n'a pas été créé correctement** ou que **les services ne sont pas tous connectés au même réseau**.

**Solution** : Redémarrer complètement avec `docker compose down` puis `docker compose up -d`.

---

## ✅ Solution Rapide

```bash
# Sur le serveur
cd /root/site\ Web

# Arrêter tout
docker compose down

# Redémarrer (recréera le réseau)
docker compose up -d

# Attendre quelques secondes
sleep 5

# Tester
docker compose exec nginx nslookup frontend 127.0.0.11
docker compose exec nginx ping -c 1 frontend
```

---

## 📝 Notes

- Le réseau Docker est créé automatiquement par Docker Compose
- Tous les services doivent être sur le même réseau pour communiquer
- Le resolver Docker (127.0.0.11) doit fonctionner dans chaque container
- Redémarrer complètement résout souvent les problèmes de réseau

---

## 🆘 Si Rien ne Fonctionne

1. **Vérifiez Docker** : `docker --version`
2. **Vérifiez Docker Compose** : `docker compose version`
3. **Vérifiez les logs** : `docker compose logs`
4. **Recréez le réseau manuellement** : `docker network create cartagespa-network`
5. **Contactez le support** si le problème persiste

