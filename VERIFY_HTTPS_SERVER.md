# Vérification HTTPS Serveur

## 🔍 Test 1 : Vérifier HTTPS avec le Domaine

**Sur le serveur, tester avec le domaine (pas l'IP) :**

```bash
curl -I https://cartagespa.com
```

**Résultat attendu** : HTTP/2 200 ou HTTP/1.1 200

**Si erreur** : Le serveur ne répond pas en HTTPS.

---

## 🔍 Test 2 : Vérifier HTTPS avec l'IP (ignorer le certificat)

**Pour tester si le serveur écoute sur le port 443 :**

```bash
curl -Ik https://89.147.111.166
```

**Option `-k`** : Ignore la vérification du certificat (car le certificat est pour le domaine, pas l'IP)

**Résultat attendu** : HTTP/2 200 ou HTTP/1.1 200

**Si erreur** : Le serveur n'écoute pas sur le port 443.

---

## 🔍 Test 3 : Vérifier que Nginx Écoute sur le Port 443

**Sur le serveur :**

```bash
netstat -tlnp | grep 443
```

**OU**

```bash
ss -tlnp | grep 443
```

**Résultat attendu** : 
```
tcp  0  0  0.0.0.0:443  0.0.0.0:*  LISTEN  <nginx_pid>
```

**Si rien** : Nginx n'écoute pas sur le port 443.

---

## 🔍 Test 4 : Vérifier la Configuration Nginx

**Vérifier que Nginx utilise le certificat SSL :**

```bash
docker compose exec nginx cat /etc/nginx/nginx.conf | grep -A 5 "ssl_certificate"
```

**Résultat attendu** :
```
ssl_certificate /etc/letsencrypt/live/cartagespa.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/cartagespa.com/privkey.pem;
```

---

## 🔍 Test 5 : Vérifier les Logs Nginx

**Vérifier les erreurs SSL :**

```bash
docker compose logs nginx | grep -i ssl
```

**OU**

```bash
tail -f /root/site\ Web/nginx/logs/error.log
```

---

## 🔍 Test 6 : Vérifier que le Certificat Existe

**Sur le serveur :**

```bash
ls -la /etc/letsencrypt/live/cartagespa.com/
```

**Résultat attendu** :
```
fullchain.pem
privkey.pem
```

---

## 🔍 Test 7 : Tester depuis l'Extérieur (avec le Domaine)

**Depuis votre machine locale (Windows PowerShell) :**

```powershell
curl -I https://cartagespa.com
```

**OU dans le navigateur :**
- Aller sur `https://cartagespa.com`
- Vérifier que le site se charge

---

## 🆘 Si le Serveur ne Répond pas en HTTPS

### Problème 1 : Nginx n'écoute pas sur le port 443

**Solution :**
1. Vérifier que le port 443 est ouvert dans le firewall :
   ```bash
   ufw status | grep 443
   ```
2. Si pas ouvert :
   ```bash
   ufw allow 443/tcp
   ```

### Problème 2 : Nginx Docker ne monte pas le certificat

**Vérifier dans `docker-compose.yml` :**
```yaml
nginx:
  volumes:
    - /etc/letsencrypt:/etc/letsencrypt:ro
```

**Si manquant, ajouter et redémarrer :**
```bash
docker compose down
docker compose up -d
```

### Problème 3 : Le script Nginx ne génère pas la config HTTPS

**Vérifier que le script utilise le bon fichier :**
```bash
docker compose exec nginx ls -la /start-nginx.sh
```

**Vérifier que le script génère la config HTTPS :**
```bash
docker compose exec nginx cat /etc/nginx/nginx.conf | grep "listen 443"
```

---

## ✅ Configuration Correcte

**Pour que Cloudflare fonctionne en mode "Full" :**

1. ✅ Le serveur doit écouter sur le port 443
2. ✅ Le serveur doit accepter HTTPS avec le certificat Let's Encrypt
3. ✅ Le certificat doit être valide pour `cartagespa.com`
4. ✅ Nginx doit être configuré pour servir HTTPS

**Cloudflare se connectera à :**
- `https://cartagespa.com` (pas l'IP)
- Le certificat sera vérifié (mais Let's Encrypt est accepté en mode "Full")

---

## 🎯 Action Immédiate

**Sur le serveur, exécuter :**

```bash
# Test 1 : HTTPS avec le domaine
curl -I https://cartagespa.com

# Test 2 : Vérifier le port 443
netstat -tlnp | grep 443

# Test 3 : Vérifier les logs Nginx
docker compose logs nginx | tail -20
```

**Envoyez-moi les résultats !**

