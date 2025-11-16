# 🔧 Résoudre le Problème Nginx - Configuration OK mais Ne Fonctionne Pas

## 🔍 Diagnostic

**Situation** :
- ✅ Tous les services sont "Up" et "healthy"
- ✅ Backend fonctionne : `curl http://localhost:8000/health` → `{"status":"ok"}`
- ✅ Frontend fonctionne : `curl http://localhost:3000` → HTML retourné
- ✅ Configuration Nginx est correcte et montée
- ❌ Nginx affiche toujours la page par défaut

**Problème** : Nginx ne peut probablement pas résoudre les noms de services Docker ou il y a un problème avec le proxy_pass.

---

## ✅ SOLUTION 1 : Vérifier la Connexion aux Services

### Tester depuis le Container Nginx

```bash
# Sur le serveur
cd /root/site\ Web

# 1. Tester si Nginx peut joindre le frontend
docker compose exec nginx ping -c 1 frontend

# 2. Tester si Nginx peut joindre le backend
docker compose exec nginx ping -c 1 backend

# 3. Tester HTTP vers frontend
docker compose exec nginx wget -O- http://frontend:80

# 4. Tester HTTP vers backend
docker compose exec nginx wget -O- http://backend:8000/health
```

**Si ces tests échouent** = Problème de réseau Docker.

---

## ✅ SOLUTION 2 : Vérifier les Logs d'Erreur Nginx

### Voir les Erreurs

```bash
# Voir les logs d'erreur
docker compose exec nginx cat /var/log/nginx/error.log

# Voir les logs d'accès
docker compose exec nginx cat /var/log/nginx/access.log

# Voir tous les logs
docker compose logs nginx
```

**Cherchez** des erreurs comme :
- `host not found in upstream`
- `connection refused`
- `502 Bad Gateway`

---

## ✅ SOLUTION 3 : Vérifier le Réseau Docker

### Vérifier que Tous les Services sont sur le Même Réseau

```bash
# Voir les réseaux
docker network ls

# Inspecter le réseau
docker network inspect siteweb_cartagespa-network

# Vérifier que tous les services sont dans le réseau
docker compose ps
```

**Vérifiez** que `backend`, `frontend`, et `nginx` sont tous sur `cartagespa-network`.

---

## ✅ SOLUTION 4 : Tester la Configuration Nginx

### Valider la Configuration

```bash
# Tester la configuration
docker compose exec nginx nginx -t

# Recharger la configuration
docker compose exec nginx nginx -s reload
```

**Si la configuration est invalide** = Corrigez les erreurs.

---

## ✅ SOLUTION 5 : Vérifier que Nginx Utilise la Bonne Configuration

### Problème Possible : Configuration Par Défaut

Nginx peut utiliser `/etc/nginx/conf.d/default.conf` au lieu de `/etc/nginx/nginx.conf`.

### Vérifier

```bash
# Voir les fichiers de configuration
docker compose exec nginx ls -la /etc/nginx/

# Voir le contenu de default.conf
docker compose exec nginx cat /etc/nginx/conf.d/default.conf

# Si default.conf existe et contient la page par défaut, supprimez-le
docker compose exec nginx rm /etc/nginx/conf.d/default.conf

# Redémarrer Nginx
docker compose restart nginx
```

---

## ✅ SOLUTION 6 : Modifier la Configuration Nginx

### Problème Possible : Le Resolver Ne Fonctionne Pas

La configuration utilise des variables avec resolver, mais cela peut ne pas fonctionner correctement.

### Solution Alternative : Utiliser les Noms Directement

Modifiez `nginx/nginx.conf` pour utiliser les noms directement (sans variables) :

```nginx
location / {
    proxy_pass http://frontend:80;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

**Mais** : Nginx doit résoudre les noms au démarrage, donc il faut que les services soient démarrés avant Nginx.

---

## ✅ SOLUTION 7 : Redémarrer Nginx avec Rechargement

### Redémarrer Correctement

```bash
# Sur le serveur
cd /root/site\ Web

# Arrêter Nginx
docker compose stop nginx

# Redémarrer tous les services (pour s'assurer que l'ordre est correct)
docker compose up -d

# Vérifier les logs
docker compose logs -f nginx
```

---

## 🔍 Diagnostic Complet

### Script de Diagnostic

Créez un fichier `diagnostic-nginx-full.sh` sur le serveur :

```bash
#!/bin/bash

echo "=== Diagnostic Nginx Complet ==="
echo ""

# 1. État des services
echo "1. État des services:"
docker compose ps
echo ""

# 2. Test de connexion
echo "2. Test de connexion aux services depuis Nginx:"
echo "   Frontend:"
docker compose exec nginx ping -c 1 frontend 2>/dev/null && echo "   ✅ Frontend accessible" || echo "   ❌ Frontend inaccessible"
echo "   Backend:"
docker compose exec nginx ping -c 1 backend 2>/dev/null && echo "   ✅ Backend accessible" || echo "   ❌ Backend inaccessible"
echo ""

# 3. Test HTTP
echo "3. Test HTTP depuis Nginx:"
echo "   Frontend:"
docker compose exec nginx wget -O- http://frontend:80 2>/dev/null | head -5 && echo "   ✅ Frontend HTTP OK" || echo "   ❌ Frontend HTTP échoue"
echo "   Backend:"
docker compose exec nginx wget -O- http://backend:8000/health 2>/dev/null && echo "   ✅ Backend HTTP OK" || echo "   ❌ Backend HTTP échoue"
echo ""

# 4. Logs d'erreur
echo "4. Dernières erreurs Nginx:"
docker compose exec nginx tail -20 /var/log/nginx/error.log 2>/dev/null || echo "   Pas de logs d'erreur"
echo ""

# 5. Configuration
echo "5. Test de configuration:"
docker compose exec nginx nginx -t
echo ""

# 6. Fichiers de configuration
echo "6. Fichiers de configuration:"
docker compose exec nginx ls -la /etc/nginx/conf.d/ 2>/dev/null || echo "   Pas de dossier conf.d"
echo ""
```

Exécutez-le :

```bash
chmod +x diagnostic-nginx-full.sh
./diagnostic-nginx-full.sh
```

---

## 🎯 Actions Immédiates

### Sur le Serveur

```bash
# 1. Tester la connexion
docker compose exec nginx ping -c 1 frontend
docker compose exec nginx ping -c 1 backend

# 2. Tester HTTP
docker compose exec nginx wget -O- http://frontend:80
docker compose exec nginx wget -O- http://backend:8000/health

# 3. Voir les logs d'erreur
docker compose exec nginx cat /var/log/nginx/error.log

# 4. Vérifier default.conf
docker compose exec nginx cat /etc/nginx/conf.d/default.conf

# 5. Si default.conf existe, le supprimer
docker compose exec nginx rm /etc/nginx/conf.d/default.conf

# 6. Redémarrer Nginx
docker compose restart nginx
```

---

## 🐛 Cause Probable

Le problème le plus probable est que **Nginx utilise la configuration par défaut** (`/etc/nginx/conf.d/default.conf`) au lieu de votre configuration personnalisée.

**Solution** : Supprimez le fichier `default.conf` dans le container Nginx.

---

## ✅ Solution Rapide

```bash
# Sur le serveur
cd /root/site\ Web

# Supprimer la configuration par défaut
docker compose exec nginx rm -f /etc/nginx/conf.d/default.conf

# Redémarrer Nginx
docker compose restart nginx

# Tester
curl http://localhost/
```

---

## 📝 Notes

- Nginx peut avoir plusieurs fichiers de configuration
- La configuration par défaut peut prendre le dessus
- Vérifiez toujours les logs d'erreur
- Testez la connexion aux services depuis Nginx

