# 🔧 Arrêter Nginx Système

## 🔍 Diagnostic

**Erreur** : `404 Not Found` avec `nginx/1.24.0 (Ubuntu)`

**Problème** : Nginx système (Ubuntu) écoute encore sur le port 80 au lieu du container Docker.

**Solution** : Arrêter et désactiver Nginx système.

---

## ✅ SOLUTION : Arrêter Nginx Système

### Sur le Serveur

```bash
# 1. Arrêter Nginx système
systemctl stop nginx

# 2. Désactiver au démarrage (pour éviter qu'il redémarre)
systemctl disable nginx

# 3. Vérifier qu'il est arrêté
systemctl status nginx

# 4. Vérifier que le port 80 est libre
netstat -tlnp | grep :80
# ou
ss -tlnp | grep :80

# 5. Redémarrer le container Nginx Docker (si nécessaire)
cd /root/site\ Web
docker compose restart nginx

# 6. Tester
curl http://localhost/health
curl http://localhost/
```

---

## 🔍 Vérifications

### Vérifier l'État de Nginx Système

```bash
# État
systemctl status nginx

# Devrait montrer: "inactive (dead)" ou "stopped"
```

### Vérifier le Port 80

```bash
# Voir ce qui écoute sur le port 80
lsof -i :80
# ou
netstat -tlnp | grep :80
# ou
ss -tlnp | grep :80
```

**Devrait montrer** : Le container Docker `cartagespa-nginx`, pas `nginx` système.

---

## ✅ Après Avoir Arrêté Nginx Système

### Tester

```bash
# Test 1: Health check
curl http://localhost/health
# Devrait retourner: {"status":"ok"}

# Test 2: Frontend
curl http://localhost/
# Devrait retourner: HTML de votre application React

# Test 3: Depuis l'extérieur
curl http://89.147.111.166/health
curl http://89.147.111.166/
```

---

## 🐛 Si Nginx Système Redémarre

### Empêcher le Redémarrage

```bash
# Désactiver complètement
systemctl disable nginx
systemctl mask nginx

# Vérifier
systemctl status nginx
```

### Si Vous Voulez Garder Nginx Système

Si vous voulez garder Nginx système pour autre chose :

1. **Changer le port de Nginx système** :
   ```bash
   # Modifier /etc/nginx/sites-available/default
   # Changer "listen 80" vers "listen 8080"
   ```

2. **Ou changer le port du container Docker** :
   ```yaml
   # Dans docker-compose.yml
   nginx:
     ports:
       - "8080:80"  # Au lieu de "80:80"
   ```

---

## 📝 Notes

- Nginx système et Nginx Docker ne peuvent pas écouter sur le même port
- Il faut choisir lequel utiliser
- Pour votre application Docker, utilisez le container Docker
- Désactivez Nginx système pour éviter les conflits

---

## ✅ Checklist

- [ ] Nginx système arrêté (`systemctl stop nginx`)
- [ ] Nginx système désactivé (`systemctl disable nginx`)
- [ ] Port 80 libre (vérifié avec `netstat` ou `ss`)
- [ ] Container Nginx Docker redémarré (`docker compose restart nginx`)
- [ ] Test réussi (`curl http://localhost/health` retourne `{"status":"ok"}`)

---

## 🆘 Si le Problème Persiste

1. **Vérifiez les processus** : `ps aux | grep nginx`
2. **Tuez les processus Nginx système** : `pkill nginx`
3. **Vérifiez les ports** : `netstat -tlnp | grep :80`
4. **Redémarrez Docker Compose** : `docker compose down && docker compose up -d`

