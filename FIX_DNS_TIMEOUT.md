# 🔧 Résoudre le Timeout DNS

## 🔍 Diagnostic

Votre résultat montre :
```
DNS request timed out.
```

**Cela peut signifier** :
1. Problème de connexion réseau
2. DNS pas encore propagé
3. Firewall bloque les requêtes DNS
4. Problème avec le serveur DNS

---

## ✅ SOLUTION 1 : Vérifier en Ligne (Recommandé)

### DNS Checker

1. Allez sur : **https://dnschecker.org**
2. Entrez : `cartagespa.com`
3. Sélectionnez : **Type A**
4. Cliquez sur **"Search"**

**Avantage** : Ne nécessite pas de connexion DNS depuis votre machine.

**Résultat attendu** :
- ✅ Si certains serveurs DNS montrent `89.147.111.166` = Propagation en cours
- ✅ Si tous les serveurs montrent `89.147.111.166` = Propagation complète
- ❌ Si aucun serveur ne montre l'IP = Problème de configuration

---

## ✅ SOLUTION 2 : Tester la Connexion Réseau

### Test de Connexion Internet

```powershell
# Test 1: Ping Google
ping -n 2 8.8.8.8

# Test 2: Ping Cloudflare
ping -n 2 1.1.1.1

# Test 3: Test HTTP
Invoke-WebRequest -Uri https://www.google.com -UseBasicParsing
```

**Si ces tests échouent** = Problème de connexion réseau, pas de DNS.

---

## ✅ SOLUTION 3 : Tester Directement l'IP du Serveur

### Test Direct de l'IP

```powershell
# Tester si le serveur répond
ping 89.147.111.166

# Tester HTTP directement
Invoke-WebRequest -Uri http://89.147.111.166 -UseBasicParsing
```

**Si ça fonctionne** = Le serveur est OK, c'est juste le DNS qui n'est pas propagé.

---

## ✅ SOLUTION 4 : Tester depuis le Serveur (SSH)

### Se Connecter au Serveur

```powershell
ssh -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" root@89.147.111.166
```

### Tester depuis le Serveur

```bash
# Test avec dig
dig cartagespa.com

# Test avec nslookup
nslookup cartagespa.com

# Test avec host
host cartagespa.com
```

**Si ça fonctionne depuis le serveur** = Le DNS est propagé, c'est votre connexion locale qui a un problème.

---

## ✅ SOLUTION 5 : Utiliser un Autre Outil

### Test avec Resolve-DnsName (PowerShell)

```powershell
# Test DNS avec PowerShell natif
Resolve-DnsName -Name cartagespa.com -Type A -Server 8.8.8.8
```

### Test avec Test-NetConnection

```powershell
# Test de connexion
Test-NetConnection -ComputerName cartagespa.com -Port 80
```

---

## ✅ SOLUTION 6 : Vérifier dans Njalla

### Vérifier la Configuration

1. Connectez-vous à Njalla
2. Allez dans "DNS Settings" pour `cartagespa.com`
3. Vérifiez que les enregistrements sont :
   - Type : `A`
   - Name : `cartagespa.com` et `www.cartagespa.com`
   - Content : `89.147.111.166`
   - TTL : `1h` ou `3600`

### Vérifier les Name Servers

Assurez-vous que le domaine utilise les name servers de Njalla :
```
The domain cartagespa.com uses Njalla's name servers.
```

---

## ✅ SOLUTION 7 : Tester dans le Navigateur

### Test Direct

1. Ouvrez votre navigateur
2. Allez à : `http://89.147.111.166`
3. Si le site s'affiche = Le serveur fonctionne

### Test avec le Domaine

1. Allez à : `http://cartagespa.com`
2. Si le site s'affiche = DNS propagé ! ✅
3. Si erreur DNS = Pas encore propagé

---

## 🔍 Diagnostic Complet

### Étape 1 : Vérifier la Connexion

```powershell
# Test Internet
ping -n 2 8.8.8.8

# Test serveur direct
ping -n 2 89.147.111.166
```

### Étape 2 : Vérifier en Ligne

- https://dnschecker.org
- https://www.whatsmydns.net

### Étape 3 : Tester le Serveur Directement

```powershell
# Test HTTP direct
Invoke-WebRequest -Uri http://89.147.111.166 -UseBasicParsing
```

### Étape 4 : Tester depuis le Serveur

```bash
# SSH au serveur
ssh -i "..." root@89.147.111.166

# Test DNS depuis le serveur
dig cartagespa.com
```

---

## 🐛 Dépannage Avancé

### Problème de Firewall

Si votre firewall bloque les requêtes DNS :

1. **Vérifiez Windows Firewall**
   - Autorisez les connexions sortantes sur le port 53 (DNS)

2. **Vérifiez votre Antivirus**
   - Certains antivirus bloquent les requêtes DNS

### Problème de Proxy/VPN

Si vous utilisez un proxy ou VPN :

1. **Désactivez temporairement** le proxy/VPN
2. **Retestez** avec `nslookup`
3. **Réactivez** après le test

### Problème de DNS Local

Si votre FAI a des problèmes DNS :

1. **Changez votre DNS** :
   - Google DNS : `8.8.8.8` et `8.8.4.4`
   - Cloudflare DNS : `1.1.1.1` et `1.0.0.1`

2. **Dans Windows** :
   - Paramètres → Réseau → Modifier les options d'adaptateur
   - Clic droit sur votre connexion → Propriétés
   - IPv4 → Propriétés
   - Utiliser les adresses de serveur DNS suivantes

---

## 📊 Test Rapide (Sans DNS)

### Test Direct de l'IP

```powershell
# Test 1: Ping direct
ping 89.147.111.166

# Test 2: HTTP direct
Invoke-WebRequest -Uri http://89.147.111.166 -UseBasicParsing

# Test 3: Dans le navigateur
# http://89.147.111.166
```

**Si ces tests fonctionnent** = Le serveur est OK, attendez juste la propagation DNS.

---

## ✅ Checklist

- [ ] Testé la connexion Internet (`ping 8.8.8.8`)
- [ ] Testé le serveur directement (`ping 89.147.111.166`)
- [ ] Vérifié en ligne (dnschecker.org)
- [ ] Testé dans le navigateur (`http://89.147.111.166`)
- [ ] Vérifié la configuration dans Njalla
- [ ] Testé depuis le serveur (SSH)
- [ ] Attendu 15-30 minutes pour la propagation

---

## 🎯 Actions Immédiates

1. **Vérifiez en ligne** : https://dnschecker.org
   - C'est la méthode la plus fiable si votre connexion a des problèmes

2. **Testez le serveur directement** :
   ```powershell
   ping 89.147.111.166
   Invoke-WebRequest -Uri http://89.147.111.166
   ```

3. **Testez dans le navigateur** :
   - `http://89.147.111.166` (devrait fonctionner)
   - `http://cartagespa.com` (peut ne pas fonctionner si DNS pas propagé)

---

## 📝 Notes

- Le timeout peut être dû à votre connexion réseau, pas au DNS
- Utilisez les sites en ligne pour vérifier la propagation (plus fiable)
- Le serveur peut fonctionner même si le DNS n'est pas propagé
- Attendez 15-30 minutes après avoir configuré le DNS

---

## 🆘 Si Rien ne Fonctionne

1. **Vérifiez votre connexion Internet**
2. **Testez depuis un autre réseau** (téléphone en hotspot)
3. **Contactez le support Njalla** si le DNS n'est pas propagé après 1 heure
4. **Utilisez l'IP directement** en attendant : `http://89.147.111.166`

