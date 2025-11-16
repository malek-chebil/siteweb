# 🧪 Guide : Tester Cloudflare

## ✅ Méthodes de Test

### 1. Test Visuel dans le Navigateur

#### Vérifier le Cadenas SSL
1. Ouvrir : `https://cartagespa.com`
2. Cliquer sur le **cadenas** dans la barre d'adresse
3. Vérifier :
   - ✅ **Certificat valide** : "Votre connexion à ce site est sécurisée"
   - ✅ **Émis par** : Cloudflare ou Let's Encrypt
   - ✅ **Protocole** : TLS 1.3 ou TLS 1.2

#### Vérifier les Headers HTTP
1. Ouvrir les **Outils de développement** : `F12`
2. Aller dans l'onglet **Network** (Réseau)
3. Recharger la page : `F5`
4. Cliquer sur la première requête (le document HTML)
5. Vérifier les **Response Headers** :
   - ✅ `cf-ray` : Présent (indique Cloudflare)
   - ✅ `server` : `cloudflare` ou `nginx` avec Cloudflare
   - ✅ `cf-cache-status` : Présent (si cache activé)

---

### 2. Test avec curl (Depuis votre Machine)

#### Test 1 : Vérifier les Headers Cloudflare
```powershell
curl -I https://cartagespa.com
```

**Résultat attendu** :
```
HTTP/2 200
server: cloudflare
cf-ray: xxxxx-XXX
cf-cache-status: DYNAMIC
```

**Si vous voyez `cf-ray`** : ✅ Cloudflare fonctionne !

#### Test 2 : Vérifier l'IP Cloudflare
```powershell
nslookup cartagespa.com
```

**Résultat attendu** :
- IP Cloudflare (104.x.x.x, 172.x.x.x, ou 162.x.x.x)
- **OU** IP de votre serveur (89.147.111.166) si le proxy est désactivé

**Note** : Si le proxy Cloudflare est activé (nuage orange), vous verrez une IP Cloudflare, pas votre IP serveur.

---

### 3. Test depuis le Serveur

#### Test 1 : Vérifier les IPs Cloudflare dans les Logs
```bash
tail -f /root/site\ Web/nginx/logs/access.log
```

**Puis visiter le site dans le navigateur**

**Résultat attendu** : Vous devriez voir des IPs Cloudflare :
- `104.23.x.x` (Cloudflare)
- `172.70.x.x` (Cloudflare)
- `162.158.x.x` (Cloudflare)

**Si vous voyez votre IP locale** : Le proxy Cloudflare n'est pas activé.

#### Test 2 : Compter les Requêtes Cloudflare
```bash
grep -E "(104\.|172\.70\.|162\.158\.)" /root/site\ Web/nginx/logs/access.log | wc -l
```

**Résultat attendu** : Nombre de requêtes provenant de Cloudflare (devrait être > 0)

---

### 4. Test avec des Outils en Ligne

#### Test 1 : SSL Labs SSL Test
1. Aller sur : https://www.ssllabs.com/ssltest/
2. Entrer : `cartagespa.com`
3. Cliquer sur **Submit**
4. Attendre le résultat (1-2 minutes)

**Vérifier** :
- ✅ **Grade** : A ou A+ (excellent)
- ✅ **Protocol Support** : TLS 1.2, TLS 1.3
- ✅ **Certificate** : Valide

#### Test 2 : Cloudflare Status Checker
1. Aller sur : https://www.cloudflare.com/cdn-cgi/trace
2. Entrer : `https://cartagespa.com/cdn-cgi/trace`

**Résultat attendu** :
```
fl=xxx
h=cartagespa.com
ip=xxx.xxx.xxx.xxx
ts=xxx
visit_scheme=https
uag=Mozilla/5.0...
colo=XXX
http=http/2
loc=XX
tls=TLSv1.3
sni=plain
warp=off
```

**Si vous voyez `colo=XXX`** : ✅ Cloudflare fonctionne !

#### Test 3 : DNS Checker
1. Aller sur : https://dnschecker.org/
2. Entrer : `cartagespa.com`
3. Sélectionner : **A Record**
4. Cliquer sur **Search**

**Résultat attendu** :
- Si proxy activé : IPs Cloudflare (104.x.x.x, 172.x.x.x)
- Si proxy désactivé : IP de votre serveur (89.147.111.166)

---

### 5. Test de Performance

#### Test 1 : PageSpeed Insights
1. Aller sur : https://pagespeed.web.dev/
2. Entrer : `https://cartagespa.com`
3. Cliquer sur **Analyze**

**Vérifier** :
- ✅ **Performance Score** : > 70 (bon)
- ✅ **Core Web Vitals** : Passés
- ✅ **Lighthouse** : Score élevé

#### Test 2 : GTmetrix
1. Aller sur : https://gtmetrix.com/
2. Entrer : `https://cartagespa.com`
3. Cliquer sur **Test your site**

**Vérifier** :
- ✅ **PageSpeed Score** : > 80
- ✅ **YSlow Score** : > 80
- ✅ **Load Time** : < 3 secondes

---

### 6. Test de Sécurité

#### Test 1 : Security Headers
1. Aller sur : https://securityheaders.com/
2. Entrer : `https://cartagespa.com`
3. Cliquer sur **Scan**

**Vérifier** :
- ✅ **Grade** : A ou B (bon)
- ✅ **Headers présents** :
  - `Strict-Transport-Security` (HSTS)
  - `X-Frame-Options`
  - `X-Content-Type-Options`
  - `X-XSS-Protection`

#### Test 2 : Cloudflare Security Check
1. Dans Cloudflare Dashboard, aller dans **Security** → **Events**
2. Vérifier les **threats blocked** (menaces bloquées)

**Résultat attendu** : Liste des attaques bloquées par Cloudflare

---

### 7. Test de Cache Cloudflare

#### Test 1 : Vérifier le Cache Status
```powershell
curl -I https://cartagespa.com
```

**Vérifier le header** :
```
cf-cache-status: HIT
```

**Statuts possibles** :
- `HIT` : ✅ Servi depuis le cache Cloudflare
- `MISS` : Non en cache, servi depuis le serveur
- `DYNAMIC` : Contenu dynamique (non mis en cache)
- `BYPASS` : Cache contourné

#### Test 2 : Purger le Cache
1. Dans Cloudflare Dashboard, aller dans **Caching** → **Configuration**
2. Cliquer sur **Purge Cache**
3. Sélectionner **Purge Everything**
4. Cliquer sur **Purge**

**Puis tester** : Le site devrait se recharger normalement

---

## 🔍 Vérifications Rapides

### Checklist Cloudflare

- [ ] Le site se charge en HTTPS
- [ ] Le cadenas vert apparaît
- [ ] Les logs montrent des IPs Cloudflare
- [ ] Le header `cf-ray` est présent
- [ ] SSL Labs donne un grade A ou A+
- [ ] `/cdn-cgi/trace` fonctionne
- [ ] Les performances sont bonnes
- [ ] Les headers de sécurité sont présents

---

## 🆘 Dépannage

### Problème 1 : Pas d'IPs Cloudflare dans les Logs

**Cause** : Le proxy Cloudflare n'est pas activé

**Solution** :
1. Dans Cloudflare Dashboard, aller dans **DNS** → **Records**
2. Pour chaque record A, vérifier que le **nuage est orange** (Proxied)
3. Si le nuage est gris, cliquer dessus pour l'activer

### Problème 2 : Le Header `cf-ray` est Absent

**Cause** : Cloudflare ne fonctionne pas ou le proxy est désactivé

**Solution** :
1. Vérifier que les nameservers sont bien configurés dans Njalla
2. Vérifier que le proxy est activé (nuage orange)
3. Attendre 24-48h pour la propagation complète

### Problème 3 : SSL Labs donne un Grade Faible

**Cause** : Configuration SSL/TLS incorrecte

**Solution** :
1. Dans Cloudflare, vérifier que le mode SSL est **Full** ou **Full (strict)**
2. Vérifier que **TLS 1.2** et **TLS 1.3** sont activés
3. Vérifier que **Always Use HTTPS** est activé

---

## 📊 Commandes Utiles

### Sur le Serveur

```bash
# Voir les dernières requêtes Cloudflare
tail -20 /root/site\ Web/nginx/logs/access.log | grep -E "(104\.|172\.70\.|162\.158\.)"

# Compter les requêtes Cloudflare aujourd'hui
grep -E "(104\.|172\.70\.|162\.158\.)" /root/site\ Web/nginx/logs/access.log | wc -l

# Voir les IPs uniques Cloudflare
grep -E "(104\.|172\.70\.|162\.158\.)" /root/site\ Web/nginx/logs/access.log | awk '{print $1}' | sort -u
```

### Depuis Windows PowerShell

```powershell
# Tester les headers Cloudflare
curl -I https://cartagespa.com

# Vérifier l'IP
nslookup cartagespa.com

# Tester le trace Cloudflare
curl https://cartagespa.com/cdn-cgi/trace
```

---

## ✅ Résumé

**Cloudflare fonctionne si :**
1. ✅ Le site se charge en HTTPS
2. ✅ Les logs montrent des IPs Cloudflare
3. ✅ Le header `cf-ray` est présent
4. ✅ `/cdn-cgi/trace` fonctionne
5. ✅ SSL Labs donne un bon grade

**Testez maintenant et dites-moi les résultats !**

