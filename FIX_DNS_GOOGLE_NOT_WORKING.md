# 🔧 DNS Ne Fonctionne Pas Même avec Google DNS

## 🔍 Diagnostic

**Problème** : Même avec Google DNS (8.8.8.8), le domaine ne se résout pas.

**Cela peut signifier** :
1. Problème de connexion réseau
2. Firewall/proxy bloque les requêtes DNS
3. Problème avec votre FAI
4. Le DNS n'est pas vraiment propagé partout

---

## ✅ SOLUTION 1 : Tester la Connexion Internet

### Test de Base

```powershell
# Test 1: Ping Google DNS
ping 8.8.8.8

# Test 2: Ping Cloudflare DNS
ping 1.1.1.1

# Test 3: Test HTTP
Invoke-WebRequest -Uri https://www.google.com -UseBasicParsing
```

**Si ces tests échouent** = Problème de connexion Internet, pas de DNS.

---

## ✅ SOLUTION 2 : Tester le Serveur Directement (Bypass DNS)

### Test Direct de l'IP

```powershell
# Test 1: Ping direct de l'IP
ping 89.147.111.166

# Test 2: HTTP direct
Invoke-WebRequest -Uri http://89.147.111.166 -UseBasicParsing
```

**Dans le navigateur** :
```
http://89.147.111.166
```

**Si ça fonctionne** = Le serveur est OK, c'est juste le DNS qui ne fonctionne pas.

---

## ✅ SOLUTION 3 : Tester depuis le Serveur (SSH)

### Se Connecter au Serveur

```powershell
ssh -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" root@89.147.111.166
```

### Tester depuis le Serveur

```bash
# Test DNS depuis le serveur
dig cartagespa.com
nslookup cartagespa.com
host cartagespa.com

# Test HTTP depuis le serveur
curl http://localhost/
curl http://localhost/health
```

**Si ça fonctionne depuis le serveur** = Le DNS est propagé, c'est votre connexion locale qui a un problème.

---

## ✅ SOLUTION 4 : Vérifier le Proxy/Firewall

### Vérifier le Proxy

1. **Paramètres Windows**
   - Paramètres → Réseau et Internet → Proxy
   - Vérifiez si un proxy est configuré
   - **Désactivez-le temporairement** si activé

2. **Vérifier le Firewall**
   - Paramètres → Réseau et Internet → Pare-feu Windows
   - Vérifiez que le pare-feu n'bloque pas les requêtes DNS

### Vérifier l'Antivirus

- Certains antivirus bloquent les requêtes DNS
- **Désactivez temporairement** l'antivirus et retestez

---

## ✅ SOLUTION 5 : Utiliser l'IP Directement

### Solution Temporaire

En attendant que le DNS fonctionne, utilisez l'IP directement :

**Dans le navigateur** :
```
http://89.147.111.166
```

**Pour tester l'API** :
```
http://89.147.111.166/health
http://89.147.111.166/api/v1/...
```

---

## ✅ SOLUTION 6 : Tester depuis un Autre Réseau

### Utiliser votre Téléphone en Hotspot

1. **Activez le hotspot** sur votre téléphone
2. **Connectez votre PC** au hotspot
3. **Testez** :
   ```powershell
   nslookup cartagespa.com
   ```
4. **Dans le navigateur** : `http://cartagespa.com`

**Si ça fonctionne depuis le hotspot** = Problème avec votre réseau/FAI.

---

## ✅ SOLUTION 7 : Vérifier le Fichier Hosts

### Vérifier si le Domaine est Bloqué

```powershell
# Ouvrir le fichier hosts
notepad C:\Windows\System32\drivers\etc\hosts
```

**Vérifiez** qu'il n'y a pas de ligne avec `cartagespa.com`.

**Si vous trouvez une ligne**, commentez-la :
```
# 127.0.0.1 cartagespa.com
```

---

## 🔍 Diagnostic Complet

### Script PowerShell

Créez un fichier `diagnostic-dns.ps1` :

```powershell
Write-Host "=== Diagnostic DNS Complet ===" -ForegroundColor Green
Write-Host ""

# Test 1: Connexion Internet
Write-Host "1. Test connexion Internet..." -ForegroundColor Yellow
$ping = Test-Connection -ComputerName 8.8.8.8 -Count 2 -Quiet
if ($ping) {
    Write-Host "   ✅ Connexion Internet OK" -ForegroundColor Green
} else {
    Write-Host "   ❌ Pas de connexion Internet" -ForegroundColor Red
    exit
}

# Test 2: Serveur direct
Write-Host "2. Test serveur direct (89.147.111.166)..." -ForegroundColor Yellow
$ping = Test-Connection -ComputerName 89.147.111.166 -Count 2 -Quiet
if ($ping) {
    Write-Host "   ✅ Serveur accessible" -ForegroundColor Green
} else {
    Write-Host "   ❌ Serveur inaccessible" -ForegroundColor Red
}

# Test 3: HTTP direct
Write-Host "3. Test HTTP direct..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri http://89.147.111.166 -UseBasicParsing -TimeoutSec 5
    Write-Host "   ✅ Serveur HTTP répond" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Serveur HTTP ne répond pas" -ForegroundColor Red
}

# Test 4: DNS Google
Write-Host "4. Test DNS avec Google (8.8.8.8)..." -ForegroundColor Yellow
$result = nslookup cartagespa.com 8.8.8.8 2>&1
if ($result -match "89.147.111.166") {
    Write-Host "   ✅ DNS Google fonctionne" -ForegroundColor Green
} else {
    Write-Host "   ❌ DNS Google ne fonctionne pas" -ForegroundColor Red
    Write-Host "   Résultat: $result" -ForegroundColor Gray
}

# Test 5: DNS local
Write-Host "5. Test DNS local..." -ForegroundColor Yellow
$result = nslookup cartagespa.com 2>&1
if ($result -match "89.147.111.166") {
    Write-Host "   ✅ DNS local fonctionne" -ForegroundColor Green
} else {
    Write-Host "   ❌ DNS local ne fonctionne pas" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Recommandations ===" -ForegroundColor Cyan
Write-Host "1. Utilisez l'IP directement: http://89.147.111.166" -ForegroundColor Yellow
Write-Host "2. Testez depuis un autre réseau (hotspot téléphone)" -ForegroundColor Yellow
Write-Host "3. Contactez votre FAI si le problème persiste" -ForegroundColor Yellow
```

Exécutez-le :

```powershell
.\diagnostic-dns.ps1
```

---

## 🎯 Actions Immédiates

### 1. Tester le Serveur Directement

```powershell
# Ping
ping 89.147.111.166

# HTTP
Invoke-WebRequest -Uri http://89.147.111.166 -UseBasicParsing
```

**Dans le navigateur** : `http://89.147.111.166`

### 2. Tester depuis le Serveur

```powershell
# SSH au serveur
ssh -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" root@89.147.111.166

# Sur le serveur
dig cartagespa.com
```

### 3. Tester depuis un Autre Réseau

- Utilisez votre téléphone en hotspot
- Testez : `http://cartagespa.com`

---

## 🐛 Dépannage Avancé

### Si le Serveur Ne Répond Pas

1. **Vérifiez les services sur le serveur** :
   ```bash
   docker compose ps
   docker compose logs
   ```

2. **Vérifiez le firewall** :
   ```bash
   ufw status
   ```

3. **Vérifiez que Nginx écoute** :
   ```bash
   netstat -tlnp | grep :80
   ```

### Si C'est un Problème de Réseau

1. **Contactez votre FAI** si le problème persiste
2. **Vérifiez votre routeur** pour des blocages DNS
3. **Testez depuis un autre réseau** pour confirmer

---

## ✅ Solution Temporaire

**En attendant que le DNS fonctionne**, utilisez l'IP directement :

```
http://89.147.111.166
```

Votre site fonctionnera normalement, juste avec l'IP au lieu du domaine.

---

## 📝 Notes

- Le DNS peut prendre jusqu'à 48 heures pour se propager partout
- Certains FAI ont des caches DNS très longs
- Utiliser l'IP directement est une solution temporaire valide
- Le problème peut venir de votre FAI, pas de votre configuration

---

## 🆘 Si Rien ne Fonctionne

1. **Utilisez l'IP directement** : `http://89.147.111.166`
2. **Testez depuis un autre réseau** (hotspot téléphone)
3. **Contactez votre FAI** si le problème persiste
4. **Attendez 24-48 heures** pour la propagation complète

