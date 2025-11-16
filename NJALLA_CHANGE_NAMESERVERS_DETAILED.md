# Instructions Détaillées : Changer Nameservers dans Njalla

## 📋 État Actuel

Je vois dans votre interface Njalla :
- ✅ 2 records A configurés :
  - `cartagespa.com` → `89.147.111.166`
  - `www.cartagespa.com` → `89.147.111.166`
- ⚠️ Message : "The domain cartagespa.com uses Njalla's name servers."

## 🔄 Action : Utiliser les Nameservers Cloudflare

### Étape 1 : Cliquer sur "Use custom name servers"

1. **Trouver le lien** :
   - Chercher le texte : "The domain cartagespa.com uses Njalla's name servers."
   - À droite de ce texte, il y a un lien : **"Use custom name servers"**
   - **Cliquer sur ce lien**

### Étape 2 : Entrer les Nameservers Cloudflare

Après avoir cliqué, un formulaire apparaîtra pour entrer les nameservers personnalisés.

**Entrer ces 2 nameservers Cloudflare** :

```
alaric.ns.cloudflare.com
cecelia.ns.cloudflare.com
```

**Important** :
- Entrer **exactement** comme indiqué (sans espaces)
- Un nameserver par ligne
- Pas besoin de supprimer les records A existants

### Étape 3 : Sauvegarder

1. Vérifier que les 2 nameservers sont correctement entrés
2. Cliquer sur **"Save"** ou **"Update"** ou **"Confirm"**
3. Confirmer le changement si demandé

---

## ⏱️ Après le Changement

### Propagation DNS

**Temps** : 5 minutes à 24 heures (généralement 5-15 minutes)

### Vérifications

**Dans Cloudflare** :
- Le tag orange "Invalid nameservers" disparaîtra
- Le statut passera à "Active"

**Dans Njalla** :
- Le message changera pour indiquer l'utilisation de nameservers personnalisés
- Les records A resteront visibles (mais seront gérés par Cloudflare)

---

## 📝 Notes Importantes

1. **Les records A dans Njalla** : Ils resteront visibles mais seront ignorés. Cloudflare gérera les DNS.

2. **Les records dans Cloudflare** : Ce sont ceux qui seront utilisés (déjà configurés correctement).

3. **Pendant la propagation** : Le site peut être temporairement inaccessible (rare, généralement pas de problème).

4. **Pas besoin de supprimer les records A** : Ils peuvent rester dans Njalla, Cloudflare les remplacera.

---

## ✅ Résultat Attendu

Après propagation (5-15 minutes) :
- ✅ Site accessible via Cloudflare
- ✅ IPs visiteurs masquées
- ✅ Site plus rapide (CDN)
- ✅ Protection DDoS active
- ✅ SSL automatique

---

## 🆘 Si Problème

### Le lien "Use custom name servers" n'apparaît pas

**Solution** :
- Vérifier que vous êtes bien dans "DNS Settings"
- Rafraîchir la page
- Vérifier les permissions du compte

### Erreur lors de la sauvegarde

**Solution** :
- Vérifier que les nameservers sont correctement formatés
- Pas d'espaces avant/après
- Un nameserver par ligne
- Réessayer

---

**Dites-moi quand vous avez cliqué sur "Use custom name servers" et entré les nameservers !**

