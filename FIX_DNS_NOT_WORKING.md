# 🔧 DNS Non Actif - Solutions

## 🔍 Diagnostic

Votre résultat :
```
Nom :    cartagespa.com
```

**Problème** : Aucune adresse IP n'est retournée.

**Cela signifie** : Le DNS n'est pas encore propagé ou mal configuré.

---

## ✅ SOLUTION 1 : Vérifier la Configuration dans Njalla

### Vérifiez que les enregistrements sont corrects

Dans Njalla, vous devriez avoir :

```
Type    Name                    Content          TTL
A       cartagespa.com          89.147.111.166    1h
A       www.cartagespa.com      89.147.111.166    1h
```

**OU**

```
Type    Name    Content          TTL
A       @       89.147.111.166   1h
A       www     89.147.111.166   1h
```

### Points à vérifier

- ✅ L'IP est correcte : `89.147.111.166`
- ✅ Le type est `A` (pas `AAAA` ou autre)
- ✅ Le TTL est configuré (3600 ou 1h)
- ✅ Les deux enregistrements existent

---

## ✅ SOLUTION 2 : Vider le Cache DNS (Windows)

### PowerShell (en tant qu'administrateur)

```powershell
# Vider le cache DNS
ipconfig /flushdns

# Puis retester
nslookup cartagespa.com
```

### Si ça ne fonctionne pas

```powershell
# Redémarrer le service DNS
Restart-Service -Name Dnscache

# Puis retester
nslookup cartagespa.com
```

---

## ✅ SOLUTION 3 : Utiliser un Autre Serveur DNS

### Test avec Google DNS

```powershell
nslookup cartagespa.com 8.8.8.8
```

### Test avec Cloudflare DNS

```powershell
nslookup cartagespa.com 1.1.1.1
```

**Si ça fonctionne avec ces serveurs** = Votre cache DNS local est le problème.

---

## ✅ SOLUTION 4 : Attendre la Propagation

### Temps de Propagation

- **Minimum** : 5 minutes
- **Typique** : 15-30 minutes
- **Maximum** : 24-48 heures (rare)

### Vérifier la Propagation en Ligne

1. Allez sur : **https://dnschecker.org**
2. Entrez : `cartagespa.com`
3. Type : `A`
4. Cliquez sur "Search"

**Si certains serveurs DNS montrent l'IP** = Propagation en cours, attendez.

**Si aucun serveur ne montre l'IP** = Problème de configuration dans Njalla.

---

## ✅ SOLUTION 5 : Vérifier les Name Servers

### Dans Njalla

Vérifiez que le domaine utilise les name servers de Njalla :

```
The domain cartagespa.com uses Njalla's name servers.
```

**Si vous voyez "Use custom name servers"** = Le domaine n'utilise pas les name servers de Njalla.

**Solution** : Cliquez sur "Use Njalla's name servers" ou configurez les name servers personnalisés.

---

## 🔍 Vérification Complète

### Étape 1 : Vérifier dans Njalla

1. Connectez-vous à Njalla
2. Allez dans "DNS Settings" pour `cartagespa.com`
3. Vérifiez les enregistrements A
4. Vérifiez que l'IP est : `89.147.111.166`

### Étape 2 : Vider le Cache

```powershell
ipconfig /flushdns
```

### Étape 3 : Tester avec Google DNS

```powershell
nslookup cartagespa.com 8.8.8.8
```

### Étape 4 : Vérifier en Ligne

- https://dnschecker.org
- https://www.whatsmydns.net

### Étape 5 : Attendre et Retester

Attendez 15-30 minutes, puis retestez :

```powershell
nslookup cartagespa.com
```

---

## 🐛 Dépannage Avancé

### Le DNS ne fonctionne toujours pas après 1 heure

1. **Vérifiez les logs dans Njalla**
   - Y a-t-il des erreurs ?
   - Les enregistrements sont-ils sauvegardés ?

2. **Supprimez et Recréez les Enregistrements**
   - Supprimez les enregistrements A existants
   - Recréez-les avec les mêmes valeurs
   - Attendez 15 minutes

3. **Contactez le Support Njalla**
   - Si rien ne fonctionne après 1 heure
   - Fournissez les détails de configuration

---

## 📊 Test Complet

### Script de Test PowerShell

Créez un fichier `test-dns.ps1` :

```powershell
Write-Host "=== Test DNS pour cartagespa.com ===" -ForegroundColor Green
Write-Host ""

# Test 1: nslookup standard
Write-Host "1. Test nslookup standard..." -ForegroundColor Yellow
$result = nslookup cartagespa.com 2>&1
if ($result -match "89.147.111.166") {
    Write-Host "   ✅ DNS actif !" -ForegroundColor Green
} else {
    Write-Host "   ❌ DNS non actif" -ForegroundColor Red
}

# Test 2: nslookup avec Google DNS
Write-Host "2. Test avec Google DNS (8.8.8.8)..." -ForegroundColor Yellow
$result = nslookup cartagespa.com 8.8.8.8 2>&1
if ($result -match "89.147.111.166") {
    Write-Host "   ✅ DNS actif sur Google DNS !" -ForegroundColor Green
} else {
    Write-Host "   ❌ DNS non actif sur Google DNS" -ForegroundColor Red
}

# Test 3: ping
Write-Host "3. Test ping..." -ForegroundColor Yellow
$result = ping -n 1 cartagespa.com 2>&1
if ($result -match "89.147.111.166") {
    Write-Host "   ✅ Ping fonctionne !" -ForegroundColor Green
} else {
    Write-Host "   ❌ Ping ne fonctionne pas" -ForegroundColor Red
}

Write-Host ""
Write-Host "Si tous les tests échouent, attendez 15-30 minutes et réessayez." -ForegroundColor Yellow
```

Exécutez-le :

```powershell
.\test-dns.ps1
```

---

## ✅ Checklist

- [ ] Vérifié la configuration dans Njalla
- [ ] L'IP est correcte : `89.147.111.166`
- [ ] Les deux enregistrements A existent
- [ ] Vidé le cache DNS (`ipconfig /flushdns`)
- [ ] Testé avec Google DNS (`nslookup cartagespa.com 8.8.8.8`)
- [ ] Vérifié la propagation en ligne (dnschecker.org)
- [ ] Attendu 15-30 minutes
- [ ] Retesté avec `nslookup cartagespa.com`

---

## 🎯 Résultat Attendu

Après correction, vous devriez voir :

```powershell
C:\Users\Malek>nslookup cartagespa.com
Serveur :   UnKnown
Address:  10.64.0.1

Nom :    cartagespa.com
Address:  89.147.111.166    ← C'est ça qu'on veut voir ! ✅
```

---

## 📝 Notes Importantes

1. **La propagation DNS prend du temps** : 5 minutes à 48 heures
2. **Différents serveurs DNS** peuvent avoir des résultats différents
3. **Videz toujours le cache** après avoir modifié le DNS
4. **Utilisez les sites en ligne** pour vérifier la propagation mondiale
5. **Soyez patient** : La propagation peut prendre jusqu'à 1 heure

---

## 🆘 Si Rien ne Fonctionne

1. **Vérifiez dans Njalla** que les enregistrements sont sauvegardés
2. **Contactez le support Njalla** avec :
   - Le nom de domaine : `cartagespa.com`
   - L'IP cible : `89.147.111.166`
   - Les enregistrements configurés
3. **Attendez 24 heures** maximum pour la propagation complète

