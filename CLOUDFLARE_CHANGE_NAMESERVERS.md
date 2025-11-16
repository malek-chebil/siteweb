# Changer les Nameservers dans Njalla pour Cloudflare

## 📋 État Actuel

✅ Compte Cloudflare créé
✅ Site ajouté (cartagespa.com)
✅ DNS records configurés :
- `cartagespa.com` → `89.147.111.166` (Proxied ✅)
- `www` → `89.147.111.166` (Proxied ✅)

## ⚠️ Action Requise

**Tag orange "Invalid nameservers"** : Les nameservers doivent être changés dans Njalla.

---

## 🔄 ÉTAPE : Changer les Nameservers

### Nameservers Cloudflare à Utiliser

```
alaric.ns.cloudflare.com
cecelia.ns.cloudflare.com
```

### Instructions Njalla

1. **Aller sur Njalla**
   - Ouvrir : https://njal.la/
   - Se connecter à votre compte

2. **Accéder aux Nameservers**
   - Cliquer sur **"Domains"** (menu principal)
   - Cliquer sur **"cartagespa.com"**
   - Aller dans **"Nameservers"** ou **"DNS"** → **"Nameservers"**

3. **Remplacer les Nameservers**
   
   **Nameservers actuels (Njalla)** :
   ```
   1-you.njalla.no
   2-can.njalla.in
   3-get.njalla.fo
   ```
   
   **Remplacer par (Cloudflare)** :
   ```
   alaric.ns.cloudflare.com
   cecelia.ns.cloudflare.com
   ```

4. **Sauvegarder**
   - Cliquer sur **"Save"** ou **"Update"**
   - Confirmer le changement

---

## ⏱️ Propagation DNS

**Temps de propagation** : 5 minutes à 24 heures
**Généralement** : 5-15 minutes

### Vérifier la Propagation

**Option 1 : Dans Cloudflare**
- Le tag orange "Invalid nameservers" disparaîtra
- Le statut passera à "Active"

**Option 2 : En ligne**
- Aller sur : https://dnschecker.org/
- Entrer : `cartagespa.com`
- Vérifier que les nameservers sont ceux de Cloudflare

**Option 3 : Depuis votre machine**
```powershell
nslookup -type=NS cartagespa.com
```

**Résultat attendu** :
```
cartagespa.com nameserver = alaric.ns.cloudflare.com
cartagespa.com nameserver = cecelia.ns.cloudflare.com
```

---

## ✅ Après Propagation

Une fois les nameservers propagés :

1. **Le tag orange disparaîtra** dans Cloudflare
2. **Le site sera accessible** via Cloudflare
3. **Les IPs des visiteurs seront masquées** (IPs Cloudflare dans les logs)
4. **Le site sera plus rapide** (CDN)
5. **Protection DDoS activée** automatiquement

---

## 🆘 Si le Site ne Fonctionne Pas

### Vérifications

1. **Vérifier les nameservers dans Njalla**
   - Sont-ils bien changés ?
   - Ont-ils été sauvegardés ?

2. **Attendre la propagation**
   - Minimum 5 minutes
   - Maximum 24 heures (généralement 5-15 minutes)

3. **Vérifier dans Cloudflare**
   - Le tag orange est-il toujours là ?
   - Les DNS records sont-ils toujours là ?

4. **Vider le cache DNS local**
   ```powershell
   ipconfig /flushdns
   ```

---

## 📝 Notes Importantes

1. **Pendant la propagation** : Le site peut être inaccessible temporairement (rare)
2. **Les DNS records** : Restent dans Cloudflare, pas besoin de les recréer
3. **Le proxy** : Reste actif (nuage orange) - c'est correct
4. **SSL** : Cloudflare fournira SSL automatiquement

---

## 🎯 Prochaine Étape

Une fois les nameservers changés dans Njalla :
1. Attendre 5-15 minutes
2. Vérifier que le tag orange disparaît dans Cloudflare
3. Tester le site : `https://cartagespa.com`
4. Vérifier les logs serveur (IPs Cloudflare)

**Dites-moi quand vous avez changé les nameservers dans Njalla !**

