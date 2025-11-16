# ✅ Comment Vérifier si le DNS est Actif

## 🎯 Vue d'Ensemble

Vous avez configuré les enregistrements DNS dans Njalla. Maintenant, vérifiez qu'ils sont actifs et propagés.

---

## 🔍 MÉTHODE 1 : nslookup (Windows PowerShell)

### Commande

```powershell
nslookup cartagespa.com
nslookup www.cartagespa.com
```

### Résultat Attendu (✅ Actif)

```
Serveur :   UnKnown
Address:  10.64.0.1

Nom :    cartagespa.com
Address:  89.147.111.166    ← C'est ça qu'on veut voir !
```

### Résultat si Pas Encore Actif (❌)

```
Nom :    cartagespa.com
```

**Sans adresse IP** = Pas encore propagé ou mal configuré.

---

## 🔍 MÉTHODE 2 : ping (Windows)

### Commande

```powershell
ping cartagespa.com
ping www.cartagespa.com
```

### Résultat Attendu (✅ Actif)

```
Ping cartagespa.com [89.147.111.166] avec 32 octets de données :
Réponse de 89.147.111.166 : octets=32 temps=XXms TTL=XX
```

### Résultat si Pas Actif (❌)

```
Impossible de résoudre le nom 'cartagespa.com'.
```

---

## 🌐 MÉTHODE 3 : Navigateur Web

### Test Direct

1. Ouvrez votre navigateur (Chrome, Firefox, Edge)
2. Allez à : `http://cartagespa.com`
3. Allez à : `http://www.cartagespa.com`

### Résultat Attendu (✅ Actif)

- ✅ Le site s'affiche (votre application React)
- ✅ Pas d'erreur "Site non trouvé"
- ✅ Pas d'erreur DNS

### Résultat si Pas Actif (❌)

- ❌ "Ce site est inaccessible"
- ❌ "DNS_PROBE_FINISHED_NXDOMAIN"
- ❌ "ERR_NAME_NOT_RESOLVED"

---

## 🌍 MÉTHODE 4 : Vérification en Ligne (Propagation Mondiale)

### Site 1 : DNS Checker

1. Allez sur : **https://dnschecker.org**
2. Entrez : `cartagespa.com`
3. Sélectionnez : **Type A**
4. Cliquez sur **"Search"**

### Résultat Attendu (✅ Actif)

- ✅ Tous les serveurs DNS montrent : **89.147.111.166**
- ✅ Pas de résultats vides
- ✅ Propagation complète dans le monde

### Résultat si Pas Encore Actif (❌)

- ❌ Certains serveurs DNS montrent "No results"
- ❌ Propagation partielle seulement

---

### Site 2 : What's My DNS

1. Allez sur : **https://www.whatsmydns.net**
2. Entrez : `cartagespa.com`
3. Sélectionnez : **A Record**

### Résultat Attendu (✅ Actif)

- ✅ Carte du monde avec des points verts partout
- ✅ Tous les serveurs DNS montrent : **89.147.111.166**

---

## 🖥️ MÉTHODE 5 : Depuis le Serveur (SSH)

### Commande

```bash
# Test avec dig
dig cartagespa.com
dig www.cartagespa.com

# Test avec nslookup
nslookup cartagespa.com
nslookup www.cartagespa.com

# Test avec host
host cartagespa.com
host www.cartagespa.com
```

### Résultat Attendu (✅ Actif)

```
cartagespa.com.   3600    IN    A    89.147.111.166
```

---

## ⏱️ Temps de Propagation

### Attendez...

- **Minimum** : 5 minutes
- **Typique** : 15-30 minutes
- **Maximum** : 24-48 heures (rare)

### Si ça ne fonctionne pas après 1 heure

1. Vérifiez la configuration dans Njalla
2. Videz le cache DNS local
3. Utilisez un autre serveur DNS

---

## 🔧 Vider le Cache DNS (Windows)

### PowerShell (Administrateur)

```powershell
ipconfig /flushdns
```

### Puis retestez

```powershell
nslookup cartagespa.com
```

---

## 📊 Checklist de Vérification

- [ ] `nslookup cartagespa.com` retourne `89.147.111.166`
- [ ] `nslookup www.cartagespa.com` retourne `89.147.111.166`
- [ ] `ping cartagespa.com` fonctionne
- [ ] Le site s'affiche dans le navigateur
- [ ] DNS Checker montre la propagation mondiale
- [ ] Pas d'erreurs DNS

---

## ✅ Test Rapide (1 Minute)

### Depuis PowerShell

```powershell
# Test 1: nslookup
nslookup cartagespa.com

# Test 2: ping
ping -n 1 cartagespa.com

# Test 3: Test HTTP
Invoke-WebRequest -Uri http://cartagespa.com -UseBasicParsing
```

**Si les 3 fonctionnent** = DNS actif ! ✅

---

## 🐛 Dépannage

### Le DNS ne fonctionne toujours pas après 1 heure

1. **Vérifiez dans Njalla** :
   - Les enregistrements sont-ils corrects ?
   - L'IP est-elle : `89.147.111.166` ?
   - Le TTL est-il configuré ?

2. **Videz le cache DNS** :
   ```powershell
   ipconfig /flushdns
   ```

3. **Utilisez un autre serveur DNS** :
   ```powershell
   nslookup cartagespa.com 8.8.8.8
   ```

4. **Vérifiez la propagation en ligne** :
   - https://dnschecker.org
   - Si certains serveurs DNS montrent l'IP, c'est en cours de propagation

---

## 🎯 Résultat Final

### ✅ DNS Actif

```
nslookup cartagespa.com
→ Address: 89.147.111.166

Navigateur
→ http://cartagespa.com s'affiche correctement
```

### ❌ DNS Pas Encore Actif

```
nslookup cartagespa.com
→ Pas d'adresse IP retournée

Navigateur
→ Erreur DNS
```

**Solution** : Attendez 15-30 minutes et retestez.

---

## 📝 Notes

- La propagation DNS prend du temps
- Différents serveurs DNS peuvent avoir des résultats différents
- Videz le cache si nécessaire
- Utilisez les sites en ligne pour vérifier la propagation mondiale

