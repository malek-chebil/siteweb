# Guide : Configuration Cloudflare (Plan Free)

## 📋 Objectif
Configurer Cloudflare pour améliorer les performances et la sécurité de `cartagespa.com`.

## ⏱️ Temps estimé
10-15 minutes

## ✅ Prérequis
- Domaine : `cartagespa.com`
- DNS actuellement géré par : Njalla
- Serveur IP : `89.147.111.166`

---

## ÉTAPE 1 : Créer un Compte Cloudflare

### 1.1. Aller sur Cloudflare

1. Ouvrir : https://dash.cloudflare.com/sign-up
2. Cliquer sur **"Sign Up"**

### 1.2. Créer le Compte

**Option 1 : Email (Recommandé pour anonymat)**
- Utiliser votre email ProtonMail
- Créer un mot de passe fort
- Cliquer sur **"Create Account"**

**Option 2 : Google (Plus rapide, moins anonyme)**
- Cliquer sur **"Continue with Google"**
- Choisir votre compte Google

### 1.3. Vérifier l'Email

- Vérifier votre boîte email
- Cliquer sur le lien de confirmation
- Vous serez redirigé vers le dashboard Cloudflare

---

## ÉTAPE 2 : Ajouter Votre Site

### 2.1. Ajouter le Domaine

1. Dans le dashboard Cloudflare, cliquer sur **"Add a Site"**
2. Entrer : `cartagespa.com`
3. Cliquer sur **"Add site"**

### 2.2. Choisir le Plan

1. Cloudflare vous proposera un plan
2. **Sélectionner "Free"** (gratuit)
3. Cliquer sur **"Continue"**

### 2.3. Vérifier les DNS Records

Cloudflare va scanner vos DNS actuels et proposer de les importer.

**Vérifier que ces records sont présents :**
- **Type A** : `cartagespa.com` → `89.147.111.166`
- **Type A** : `www.cartagespa.com` → `89.147.111.166` (si vous l'utilisez)

**Si les records ne sont pas détectés automatiquement :**
- Cliquer sur **"Add record"**
- Ajouter manuellement :
  - Type : `A`
  - Name : `cartagespa.com`
  - IPv4 address : `89.147.111.166`
  - Proxy status : `Proxied` (orange cloud) ✅
  - Cliquer sur **"Save"**

- Répéter pour `www.cartagespa.com` si nécessaire

**Important** : Assurez-vous que le **Proxy status** est **"Proxied"** (nuage orange) et non "DNS only" (nuage gris).

### 2.4. Continuer

Cliquer sur **"Continue"**

---

## ÉTAPE 3 : Changer les Nameservers

### 3.1. Obtenir les Nameservers Cloudflare

Cloudflare vous donnera **2 nameservers** (exemple) :
```
dante.ns.cloudflare.com
gwen.ns.cloudflare.com
```

**Notez-les** (ils seront différents pour vous).

### 3.2. Changer les Nameservers dans Njalla

1. Aller sur : https://njal.la/
2. Se connecter à votre compte
3. Aller dans **"Domains"** → Sélectionner `cartagespa.com`
4. Aller dans **"Nameservers"** ou **"DNS"**
5. **Remplacer** les nameservers actuels par ceux de Cloudflare :
   - Supprimer les anciens nameservers
   - Ajouter les 2 nameservers Cloudflare
6. **Sauvegarder**

### 3.3. Vérifier dans Cloudflare

1. Retourner sur Cloudflare
2. Cliquer sur **"Continue"** ou **"Done, check nameservers"**
3. Cloudflare vérifiera automatiquement

**Temps de propagation** : 5 minutes à 24 heures (généralement 5-15 minutes)

---

## ÉTAPE 4 : Configuration Cloudflare

### 4.1. SSL/TLS Settings

1. Dans le dashboard Cloudflare, aller dans **"SSL/TLS"**
2. Vérifier que **"Full"** ou **"Full (strict)"** est sélectionné
   - **Full** : Utilise votre certificat Certbot (recommandé)
   - **Full (strict)** : Utilise uniquement le certificat Cloudflare (si vous voulez)
3. **Recommandation** : Laisser sur **"Full"** pour utiliser votre certificat Certbot

### 4.2. Speed (Vitesse)

1. Aller dans **"Speed"**
2. Activer :
   - ✅ **Auto Minify** : Minification JS/CSS/HTML
   - ✅ **Brotli** : Compression avancée
   - ✅ **Early Hints** : Chargement anticipé

### 4.3. Caching

1. Aller dans **"Caching"**
2. **Caching Level** : Standard
3. **Browser Cache TTL** : Respect Existing Headers (ou 4 hours)
4. **Always Online** : On (si disponible)

### 4.4. Security

1. Aller dans **"Security"**
2. **Security Level** : Medium (ou High si vous voulez plus de protection)
3. **Bot Fight Mode** : On (plan Free)
4. **Challenge Passage** : 30 minutes

---

## ÉTAPE 5 : Vérifier la Propagation DNS

### 5.1. Vérifier depuis votre Machine

```powershell
# Vérifier les nameservers
nslookup -type=NS cartagespa.com

# Vérifier l'IP (devrait être une IP Cloudflare, pas 89.147.111.166)
nslookup cartagespa.com
```

**Résultat attendu** :
- Nameservers : Ceux de Cloudflare
- IP : Une IP Cloudflare (différente de 89.147.111.166)

### 5.2. Vérifier en Ligne

Aller sur : https://dnschecker.org/
- Entrer : `cartagespa.com`
- Vérifier que les nameservers sont ceux de Cloudflare

### 5.3. Vérifier dans Cloudflare

Dans le dashboard Cloudflare, vous devriez voir :
- ✅ **Status** : Active
- ✅ **SSL/TLS** : Active
- ✅ **Proxy** : Proxied (nuage orange)

---

## ÉTAPE 6 : Mettre à Jour la Configuration

### 6.1. Vérifier que le Site Fonctionne

1. Attendre 5-15 minutes après le changement de nameservers
2. Ouvrir : `https://cartagespa.com`
3. Vérifier que le site se charge correctement

### 6.2. Vérifier l'IP dans les Logs

**Sur le serveur** :
```bash
# Voir les dernières requêtes
tail -f /var/log/nginx/access.log
```

**Vous devriez voir** :
- Les IPs des visiteurs sont maintenant des IPs Cloudflare (commencent souvent par `172.64.x.x` ou `104.x.x.x`)
- Votre serveur ne voit plus les IPs réelles des visiteurs

### 6.3. Mettre à Jour Supabase (si nécessaire)

**Si vous utilisez des restrictions par IP dans Supabase** :
- Les IPs Cloudflare peuvent être ajoutées aux allowlists si nécessaire
- Généralement, ce n'est pas nécessaire

---

## ÉTAPE 7 : Optimisations Supplémentaires (Optionnel)

### 7.1. Page Rules (3 règles gratuites)

1. Aller dans **"Rules"** → **"Page Rules"**
2. Créer des règles pour :
   - Cache tout le contenu statique
   - Bypass cache pour `/api/*` (si nécessaire)

### 7.2. Workers (Optionnel)

Pour des optimisations avancées (gratuit jusqu'à 100,000 requêtes/jour).

---

## ✅ Vérification Finale

### Checklist :

- [ ] Compte Cloudflare créé
- [ ] Site ajouté à Cloudflare
- [ ] DNS records configurés (A records vers 89.147.111.166)
- [ ] Proxy status : Proxied (nuage orange)
- [ ] Nameservers changés dans Njalla
- [ ] Propagation DNS vérifiée
- [ ] Site accessible via Cloudflare
- [ ] SSL/TLS actif
- [ ] Cache activé
- [ ] Security settings configurés

---

## 🎯 Résultat Attendu

### Avant Cloudflare :
- IPs visiteurs : Visibles dans les logs
- Vitesse : Dépend de la distance
- Protection : fail2ban uniquement

### Après Cloudflare :
- IPs visiteurs : Masquées (IPs Cloudflare dans les logs)
- Vitesse : 2-3x plus rapide (CDN)
- Protection : fail2ban + Cloudflare DDoS
- Cache : Automatique
- SSL : Automatique (en plus de Certbot)

---

## 🆘 Dépannage

### Problème : Site ne se charge pas après changement DNS

**Solution** :
1. Vérifier que les nameservers sont corrects dans Njalla
2. Attendre 15-30 minutes (propagation DNS)
3. Vérifier avec : https://dnschecker.org/
4. Vider le cache DNS local : `ipconfig /flushdns` (Windows)

### Problème : Erreur SSL

**Solution** :
1. Dans Cloudflare, aller dans **"SSL/TLS"**
2. Changer en **"Full"** (au lieu de "Flexible")
3. Attendre quelques minutes

### Problème : API ne fonctionne pas

**Solution** :
1. Dans Cloudflare, aller dans **"Rules"** → **"Page Rules"**
2. Créer une règle : `https://cartagespa.com/api/*`
3. Settings : **Cache Level** → **Bypass**
4. Sauvegarder

---

## 📊 Monitoring

### Voir les Statistiques

Dans le dashboard Cloudflare :
- **Analytics** : Statistiques de trafic
- **Security** : Attaques bloquées
- **Performance** : Vitesse et cache

### Voir les Logs (Plan Free limité)

Les logs détaillés sont disponibles sur les plans payants, mais vous avez :
- Analytics de base (24h)
- Statistiques de sécurité
- Graphiques de performance

---

## 🎉 Félicitations !

Cloudflare est maintenant configuré et protège votre site !

**Avantages obtenus** :
- ✅ Site plus rapide (CDN)
- ✅ Protection DDoS supplémentaire
- ✅ IPs visiteurs masquées
- ✅ Cache automatique
- ✅ SSL automatique
- ✅ Gratuit à vie

---

## 📝 Notes Importantes

1. **Propagation DNS** : Peut prendre 5 minutes à 24 heures (généralement 5-15 minutes)
2. **Proxy Status** : Toujours garder sur "Proxied" (nuage orange) pour la protection
3. **SSL** : Cloudflare fournit SSL automatiquement, mais vous pouvez garder Certbot comme backup
4. **Cache** : Les assets statiques sont mis en cache automatiquement
5. **API** : Si vous avez des problèmes avec l'API, créer une Page Rule pour bypass le cache

---

## 🔄 Revenir en Arrière (si nécessaire)

Si vous voulez désactiver Cloudflare :
1. Dans Njalla, remettre les anciens nameservers
2. Attendre la propagation DNS
3. Votre site fonctionnera directement depuis votre serveur

---

## 🚀 Prochaines Étapes

Une fois Cloudflare configuré :
- ✅ Tester le site
- ✅ Vérifier les performances
- ✅ Configurer des backups automatiques
- ✅ Configurer un monitoring (Uptime Robot)

