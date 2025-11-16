# Fix : ERR_SSL_VERSION_OR_CIPHER_MISMATCH

## 🚨 Problème

Erreur : `ERR_SSL_VERSION_OR_CIPHER_MISMATCH`

**Cause** : Cloudflare ne peut pas établir une connexion SSL sécurisée avec votre serveur.

---

## 🔧 Solution : Configurer SSL/TLS dans Cloudflare

### ÉTAPE 1 : Aller dans SSL/TLS Settings

1. Dans le dashboard Cloudflare, cliquer sur **"SSL/TLS"** (menu gauche)
2. Aller dans **"Overview"** (sous SSL/TLS)

### ÉTAPE 2 : Changer le Mode SSL

**Problème courant** : Le mode est sur **"Flexible"** au lieu de **"Full"** ou **"Full (strict)"**

**Solution** :

1. **Trouver "SSL/TLS encryption mode"**
2. **Changer de "Flexible" à "Full"** :
   - **Flexible** : Cloudflare → Visiteur (HTTPS), Cloudflare → Serveur (HTTP) ❌
   - **Full** : Cloudflare → Visiteur (HTTPS), Cloudflare → Serveur (HTTPS) ✅
   - **Full (strict)** : Cloudflare → Visiteur (HTTPS), Cloudflare → Serveur (HTTPS avec certificat valide) ✅

3. **Recommandation** : Utiliser **"Full"** (votre certificat Certbot sera accepté)

### ÉTAPE 3 : Vérifier les Settings

**Dans "SSL/TLS" → "Overview"** :
- **SSL/TLS encryption mode** : **Full** ✅
- **Always Use HTTPS** : **On** (recommandé)
- **Minimum TLS Version** : **TLS 1.2** (ou TLS 1.3)

**Dans "SSL/TLS" → "Edge Certificates"** :
- **Always Use HTTPS** : **On**
- **Automatic HTTPS Rewrites** : **On**

---

## 🔍 Vérifications Supplémentaires

### 1. Vérifier que le Serveur Accepte HTTPS

**Sur le serveur, tester :**
```bash
curl -I https://89.147.111.166
```

**Résultat attendu** : HTTP/2 200 ou HTTP/1.1 200

**Si erreur** : Le serveur ne répond pas en HTTPS directement. C'est normal si vous utilisez Cloudflare, mais il faut que Cloudflare puisse se connecter en HTTPS.

### 2. Vérifier le Certificat SSL

**Sur le serveur :**
```bash
openssl s_client -connect 89.147.111.166:443 -servername cartagespa.com
```

**Vérifier** :
- Le certificat est valide
- Le certificat correspond à `cartagespa.com`

---

## ⚙️ Configuration Recommandée

### SSL/TLS Settings dans Cloudflare

1. **SSL/TLS encryption mode** : **Full**
2. **Always Use HTTPS** : **On**
3. **Automatic HTTPS Rewrites** : **On**
4. **Minimum TLS Version** : **TLS 1.2**

### Edge Certificates

1. **Always Use HTTPS** : **On**
2. **Automatic HTTPS Rewrites** : **On**
3. **Opportunistic Encryption** : **On** (si disponible)

---

## 🆘 Si le Problème Persiste

### Option 1 : Utiliser "Full (strict)"

Si "Full" ne fonctionne pas :

1. Aller dans **"SSL/TLS"** → **"Overview"**
2. Changer en **"Full (strict)"**
3. **Attention** : Cela nécessite que le certificat soit valide et reconnu par Cloudflare

### Option 2 : Vérifier le Certificat Serveur

**Sur le serveur :**
```bash
# Vérifier que le certificat existe
ls -la /etc/letsencrypt/live/cartagespa.com/

# Vérifier que Nginx utilise le certificat
docker compose exec nginx cat /etc/nginx/nginx.conf | grep ssl_certificate
```

### Option 3 : Désactiver Temporairement Cloudflare Proxy

**Si nécessaire (temporairement)** :
1. Dans Cloudflare, aller dans **"DNS"** → **"Records"**
2. Pour chaque record A, cliquer sur le **nuage orange** (Proxied)
3. Le nuage devient **gris** (DNS only)
4. Le site fonctionnera directement depuis votre serveur (sans Cloudflare)
5. **Réactiver le proxy** une fois le problème SSL résolu

---

## 📝 Explication des Modes SSL

### Flexible
- ✅ Visiteur → Cloudflare : HTTPS
- ❌ Cloudflare → Serveur : HTTP
- **Problème** : Si votre serveur force HTTPS, cela cause une erreur

### Full
- ✅ Visiteur → Cloudflare : HTTPS
- ✅ Cloudflare → Serveur : HTTPS
- **Avantage** : Accepte les certificats auto-signés ou Let's Encrypt
- **Recommandé** : Pour votre cas (Certbot)

### Full (strict)
- ✅ Visiteur → Cloudflare : HTTPS
- ✅ Cloudflare → Serveur : HTTPS
- **Exigence** : Certificat valide et reconnu par Cloudflare
- **Avantage** : Plus sécurisé

---

## ✅ Après Correction

1. **Attendre 1-2 minutes** (propagation des settings)
2. **Tester le site** : `https://cartagespa.com`
3. **Vérifier** : Le site devrait se charger sans erreur SSL

---

## 🎯 Action Immédiate

**Dans Cloudflare :**
1. Aller dans **"SSL/TLS"** → **"Overview"**
2. Changer **"SSL/TLS encryption mode"** de **"Flexible"** à **"Full"**
3. Activer **"Always Use HTTPS"**
4. Sauvegarder
5. Attendre 1-2 minutes
6. Tester : `https://cartagespa.com`

**Dites-moi si cela résout le problème !**

