# Fix: Nginx Docker Container Restarting in Loop

## Problème
Le conteneur `cartagespa-nginx` redémarre en boucle après la génération des certificats SSL.

## Cause Identifiée
Le volume `/etc/letsencrypt` n'était **pas monté** dans `docker-compose.yml`, donc le script ne pouvait pas accéder aux certificats SSL.

## Solution Appliquée

### 1. Volume SSL ajouté dans docker-compose.yml
```yaml
volumes:
  - /etc/letsencrypt:/etc/letsencrypt:ro  # SSL certificates from Certbot
```

### 2. Script de debug créé
Un script avec plus de logs a été créé : `nginx/start-nginx-with-ips-https-debug.sh`

## Étapes de Correction

### Sur le serveur :

```bash
# 1. Vérifier que le docker-compose.yml est à jour
grep letsencrypt docker-compose.yml

# 2. Remplacer le script par la version debug (optionnel, pour plus de logs)
mv nginx/start-nginx-with-ips-https-debug.sh nginx/start-nginx-with-ips.sh
chmod +x nginx/start-nginx-with-ips.sh

# 3. Redémarrer les services
docker compose down
docker compose up -d

# 4. Voir les logs en temps réel
docker compose logs -f nginx
```

## Vérifications

### Vérifier que les certificats sont accessibles :
```bash
# Depuis le serveur (hôte)
ls -la /etc/letsencrypt/live/cartagespa.com/

# Depuis le conteneur (après démarrage)
docker compose exec nginx ls -la /etc/letsencrypt/live/cartagespa.com/
```

### Vérifier le statut des conteneurs :
```bash
docker compose ps
```

Tous les conteneurs devraient être `Up` et non `Restarting`.

## Logs Attendus (avec script debug)

Si vous utilisez le script debug, vous devriez voir :
```
=== Starting Nginx with HTTPS (DEBUG) ===
Date: ...
Waiting for frontend DNS...
Waiting for backend DNS...
Frontend IP: 172.x.x.x
Backend IP: 172.x.x.x
Checking SSL certificates...
✓ SSL certificates found
Creating Nginx configuration...
Creating HTTPS configuration...
Nginx configuration created
Testing Nginx configuration...
✓ Nginx configuration test: SUCCESS
Starting Nginx...
```

## Si le problème persiste

### 1. Vérifier les permissions des certificats
```bash
ls -la /etc/letsencrypt/live/cartagespa.com/
# Les certificats doivent être lisibles (r--r--r--)
```

### 2. Vérifier que le volume est bien monté
```bash
docker compose exec nginx mount | grep letsencrypt
```

### 3. Vérifier la syntaxe Nginx
```bash
docker compose exec nginx nginx -t
```

### 4. Voir les logs d'erreur complets
```bash
docker compose logs nginx --tail 100
```

## Prochaines Étapes

Une fois Nginx démarré correctement :
1. ✅ Tester HTTPS : `https://cartagespa.com`
2. ✅ Mettre à jour Supabase (Site URL + Redirect URLs vers HTTPS)
3. ✅ Mettre à jour les variables d'environnement frontend (`VITE_API_URL` vers HTTPS)
4. ✅ Rebuild frontend avec les nouvelles variables
5. ✅ Configurer fail2ban

