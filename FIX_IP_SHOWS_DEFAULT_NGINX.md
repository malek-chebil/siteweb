# 🔧 Résoudre : IP Directe Montre "Welcome to nginx"

## 🔍 Diagnostic

**Situation** :
- ✅ `http://cartagespa.com` → Frontend fonctionne
- ❌ `http://89.147.111.166` → "Welcome to nginx" (page par défaut)

**Problème** : Nginx système écoute encore sur le port 80 et répond quand on accède via l'IP directement.

**Cause** : Nginx système n'a pas été complètement arrêté ou a redémarré.

---

## ✅ SOLUTION : Arrêter Nginx Système Définitivement

### Sur le Serveur

```bash
# 1. Arrêter Nginx système
systemctl stop nginx

# 2. Désactiver au démarrage
systemctl disable nginx

# 3. Empêcher le redémarrage (optionnel mais recommandé)
systemctl mask nginx

# 4. Vérifier qu'il est arrêté
systemctl status nginx

# 5. Vérifier le port 80
netstat -tlnp | grep :80
# ou
ss -tlnp | grep :80

# Devrait montrer : docker-proxy ou le container Nginx Docker, PAS nginx système
```

### Vérifier les Processus

```bash
# Voir tous les processus Nginx
ps aux | grep nginx

# Si vous voyez des processus Nginx système, les tuer
pkill nginx
```

---

## ✅ SOLUTION 2 : Vérifier la Configuration Nginx Système

### Voir la Configuration

```bash
# Voir les sites configurés
ls -la /etc/nginx/sites-enabled/

# Voir la configuration par défaut
cat /etc/nginx/sites-enabled/default
```

### Désactiver les Sites

```bash
# Supprimer les liens symboliques
rm /etc/nginx/sites-enabled/default
rm /etc/nginx/sites-enabled/*

# Ou renommer le fichier
mv /etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/default.disabled
```

---

## ✅ SOLUTION 3 : Vérifier que Nginx Docker Écoute sur le Port 80

### Vérifier les Ports

```bash
# Voir ce qui écoute sur le port 80
netstat -tlnp | grep :80

# Devrait montrer quelque chose comme :
# tcp  0  0  0.0.0.0:80  0.0.0.0:*  LISTEN  <PID>/docker-proxy
```

### Vérifier le Container Nginx

```bash
# Voir l'état
docker compose ps nginx

# Voir les ports mappés
docker port cartagespa-nginx

# Devrait montrer : 80/tcp -> 0.0.0.0:80
```

---

## 🔍 Diagnostic Complet

### Script de Diagnostic

Créez un fichier `diagnostic-nginx-conflict.sh` sur le serveur :

```bash
#!/bin/bash

echo "=== Diagnostic Conflit Nginx ==="
echo ""

# 1. État Nginx système
echo "1. État Nginx système:"
systemctl status nginx --no-pager | head -5
echo ""

# 2. Processus Nginx
echo "2. Processus Nginx:"
ps aux | grep nginx | grep -v grep
echo ""

# 3. Port 80
echo "3. Ce qui écoute sur le port 80:"
netstat -tlnp | grep :80
echo ""

# 4. Container Nginx Docker
echo "4. Container Nginx Docker:"
docker compose ps nginx
docker port cartagespa-nginx 2>/dev/null
echo ""

# 5. Test HTTP
echo "5. Test HTTP:"
echo "   Via domaine:"
curl -I http://cartagespa.com 2>/dev/null | head -1
echo "   Via IP:"
curl -I http://89.147.111.166 2>/dev/null | head -1
echo ""
```

Exécutez-le :

```bash
chmod +x diagnostic-nginx-conflict.sh
./diagnostic-nginx-conflict.sh
```

---

## 🎯 Actions Immédiates

### Sur le Serveur

```bash
# 1. Arrêter Nginx système
systemctl stop nginx
systemctl disable nginx
systemctl mask nginx

# 2. Vérifier
systemctl status nginx

# 3. Vérifier le port 80
netstat -tlnp | grep :80

# 4. Si nécessaire, redémarrer Nginx Docker
docker compose restart nginx

# 5. Tester
curl http://89.147.111.166/health
curl http://89.147.111.166/
```

---

## 🐛 Si le Problème Persiste

### Vérifier les Priorités de Port

```bash
# Voir tous les services qui écoutent
ss -tlnp | grep :80

# Voir l'ordre de démarrage
systemctl list-units --type=service | grep nginx
```

### Forcer l'Arrêt

```bash
# Tuer tous les processus Nginx système
pkill -9 nginx

# Vérifier qu'ils sont morts
ps aux | grep nginx

# Redémarrer Nginx Docker
docker compose restart nginx
```

---

## ✅ Vérification Finale

### Après Correction

```bash
# Test 1: Via domaine
curl http://cartagespa.com
# Devrait retourner : HTML du frontend

# Test 2: Via IP
curl http://89.147.111.166
# Devrait retourner : HTML du frontend (pas "Welcome to nginx")

# Test 3: Health check
curl http://89.147.111.166/health
# Devrait retourner : {"status":"ok"}
```

---

## 📝 Notes

- Nginx système et Nginx Docker ne peuvent pas écouter sur le même port
- Il faut choisir lequel utiliser (recommandé : Nginx Docker)
- `systemctl mask nginx` empêche le redémarrage automatique
- Vérifiez toujours avec `netstat` ou `ss` ce qui écoute sur le port 80

---

## 🆘 Si Rien ne Fonctionne

1. **Vérifiez les processus** : `ps aux | grep nginx`
2. **Vérifiez les ports** : `netstat -tlnp | grep :80`
3. **Redémarrez Docker Compose** : `docker compose down && docker compose up -d`
4. **Vérifiez les logs** : `docker compose logs nginx`

