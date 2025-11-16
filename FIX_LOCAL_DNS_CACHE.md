# 🔧 Résoudre le Problème de Cache DNS Local

## 🔍 Diagnostic

**Problème** :
- ✅ DNS propagé en ligne (dnschecker.org montre l'IP)
- ❌ Votre machine ne résout pas le domaine
- ❌ Navigateur : `ERR_NAME_NOT_RESOLVED`
- ❌ nslookup : Pas d'adresse IP retournée

**Cause** : Cache DNS local obsolète ou serveur DNS local problématique.

---

## ✅ SOLUTION 1 : Vider le Cache DNS (PowerShell Admin)

### Ouvrir PowerShell en Administrateur

1. Clic droit sur **PowerShell**
2. Sélectionnez **"Exécuter en tant qu'administrateur"**

### Commandes

```powershell
# 1. Vider le cache DNS
ipconfig /flushdns

# 2. Redémarrer le service DNS
Restart-Service -Name Dnscache

# 3. Retester
nslookup cartagespa.com
```

**Résultat attendu** :
```
Nom :    cartagespa.com
Address:  89.147.111.166    ← Maintenant ça devrait fonctionner !
```

---

## ✅ SOLUTION 2 : Tester avec Google DNS

### Test Direct

```powershell
# Tester avec Google DNS (bypass votre DNS local)
nslookup cartagespa.com 8.8.8.8
```

**Si ça fonctionne avec Google DNS** = Votre serveur DNS local a un problème.

---

## ✅ SOLUTION 3 : Changer Temporairement votre DNS

### Windows 10/11

1. **Ouvrir les Paramètres Réseau**
   - Clic droit sur l'icône réseau (barre des tâches)
   - **"Paramètres réseau et Internet"**

2. **Modifier les Options d'Adaptateur**
   - Cliquez sur **"Modifier les options d'adaptateur"**

3. **Propriétés de votre Connexion**
   - Clic droit sur votre connexion (Wi-Fi ou Ethernet)
   - **"Propriétés"**

4. **Configurer IPv4**
   - Sélectionnez **"Protocole Internet version 4 (TCP/IPv4)"**
   - Cliquez sur **"Propriétés"**

5. **Utiliser des Serveurs DNS Spécifiques**
   - Cochez **"Utiliser les adresses de serveur DNS suivantes"**
   - **Serveur DNS préféré** : `8.8.8.8`
   - **Serveur DNS auxiliaire** : `8.8.4.4`
   - Cliquez sur **"OK"**

6. **Retester**
   ```powershell
   ipconfig /flushdns
   nslookup cartagespa.com
   ```

### Alternative : Cloudflare DNS

- **Serveur DNS préféré** : `1.1.1.1`
- **Serveur DNS auxiliaire** : `1.0.0.1`

---

## ✅ SOLUTION 4 : Redémarrer le Service Réseau

### PowerShell (Admin)

```powershell
# Redémarrer tous les services réseau
Restart-Service -Name Dnscache
Restart-Service -Name Netlogon
Restart-Service -Name NlaSvc

# Vider le cache
ipconfig /flushdns

# Retester
nslookup cartagespa.com
```

---

## ✅ SOLUTION 5 : Vérifier le Fichier Hosts

### Vérifier si le Domaine est Bloqué

```powershell
# Ouvrir le fichier hosts
notepad C:\Windows\System32\drivers\etc\hosts
```

**Vérifiez** qu'il n'y a pas de ligne avec `cartagespa.com` qui pointe vers une autre IP.

**Si vous trouvez une ligne**, commentez-la avec `#` :
```
# 127.0.0.1 cartagespa.com
```

---

## ✅ SOLUTION 6 : Test Complet

### Script PowerShell (Admin)

Créez un fichier `fix-dns.ps1` :

```powershell
Write-Host "=== Correction DNS ===" -ForegroundColor Green
Write-Host ""

# 1. Vider le cache
Write-Host "1. Vidage du cache DNS..." -ForegroundColor Yellow
ipconfig /flushdns
Write-Host "   ✅ Cache vidé" -ForegroundColor Green

# 2. Redémarrer le service DNS
Write-Host "2. Redémarrage du service DNS..." -ForegroundColor Yellow
Restart-Service -Name Dnscache -Force
Write-Host "   ✅ Service redémarré" -ForegroundColor Green

# 3. Test avec DNS local
Write-Host "3. Test avec DNS local..." -ForegroundColor Yellow
$result = nslookup cartagespa.com 2>&1
if ($result -match "89.147.111.166") {
    Write-Host "   ✅ DNS local fonctionne !" -ForegroundColor Green
} else {
    Write-Host "   ❌ DNS local ne fonctionne pas" -ForegroundColor Red
    Write-Host "   → Essayez avec Google DNS" -ForegroundColor Yellow
}

# 4. Test avec Google DNS
Write-Host "4. Test avec Google DNS (8.8.8.8)..." -ForegroundColor Yellow
$result = nslookup cartagespa.com 8.8.8.8 2>&1
if ($result -match "89.147.111.166") {
    Write-Host "   ✅ Google DNS fonctionne !" -ForegroundColor Green
    Write-Host "   → Changez votre DNS vers Google DNS" -ForegroundColor Yellow
} else {
    Write-Host "   ❌ Problème de connexion" -ForegroundColor Red
}

Write-Host ""
Write-Host "Testez maintenant dans le navigateur : http://cartagespa.com" -ForegroundColor Cyan
```

Exécutez-le :

```powershell
.\fix-dns.ps1
```

---

## 🔍 Vérification

### Après Correction

1. **Test nslookup**
   ```powershell
   nslookup cartagespa.com
   ```
   **Résultat attendu** : `Address: 89.147.111.166`

2. **Test ping**
   ```powershell
   ping cartagespa.com
   ```
   **Résultat attendu** : `Réponse de 89.147.111.166`

3. **Test navigateur**
   - Ouvrez : `http://cartagespa.com`
   - **Résultat attendu** : Site s'affiche

---

## 🐛 Dépannage Avancé

### Si Rien ne Fonctionne

1. **Vérifiez votre Connexion Internet**
   ```powershell
   ping 8.8.8.8
   ```

2. **Vérifiez le Proxy**
   - Paramètres → Réseau → Proxy
   - Désactivez le proxy si activé

3. **Vérifiez le Firewall**
   - Autorisez les connexions DNS (port 53)

4. **Testez depuis un Autre Réseau**
   - Utilisez votre téléphone en hotspot
   - Testez : `http://cartagespa.com`

---

## ✅ Checklist

- [ ] PowerShell ouvert en administrateur
- [ ] Cache DNS vidé (`ipconfig /flushdns`)
- [ ] Service DNS redémarré
- [ ] Testé avec Google DNS (`nslookup cartagespa.com 8.8.8.8`)
- [ ] DNS changé vers Google DNS (si nécessaire)
- [ ] Fichier hosts vérifié
- [ ] Navigateur testé (`http://cartagespa.com`)

---

## 🎯 Actions Immédiates

1. **Ouvrez PowerShell en Administrateur**
2. **Exécutez** :
   ```powershell
   ipconfig /flushdns
   Restart-Service -Name Dnscache
   nslookup cartagespa.com
   ```
3. **Si ça ne fonctionne pas**, changez votre DNS vers Google DNS (8.8.8.8)
4. **Testez dans le navigateur** : `http://cartagespa.com`

---

## 📝 Notes

- Le DNS est propagé en ligne, c'est votre cache local qui pose problème
- Vider le cache DNS résout généralement le problème
- Changer vers Google DNS est une solution rapide et fiable
- Vous pouvez remettre votre DNS d'origine plus tard

---

## 🆘 Si Rien ne Fonctionne

1. **Testez depuis un autre réseau** (téléphone en hotspot)
2. **Contactez votre FAI** si le problème persiste
3. **Utilisez l'IP directement** en attendant : `http://89.147.111.166`

