# 📤 Transférer le Script test_ipv6.sh

## 🎯 Situation

Vous êtes dans `C:\WINDOWS\System32` et vous voulez transférer `test_ipv6.sh` vers le serveur.

---

## ✅ Solution 1 : Naviguer vers le Répertoire

### Étape 1 : Vérifier Votre Position Actuelle

```powershell
# Vérifier où vous êtes
Get-Location
# OU
pwd
```

### Étape 2 : Naviguer vers le Répertoire du Projet

```powershell
# Naviguer vers votre projet
cd 'C:\Users\Malek\Desktop\site Web'

# Vérifier que vous êtes au bon endroit
Get-Location
# Devrait afficher: C:\Users\Malek\Desktop\site Web
```

### Étape 3 : Transférer le Script

```powershell
# Transférer le script
scp -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" test_ipv6.sh root@89.147.111.166:/root/
```

---

## ✅ Solution 2 : Utiliser le Chemin Complet (Sans Naviguer)

### Depuis n'importe quel répertoire :

```powershell
# Utiliser le chemin complet du fichier source
scp -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" "C:\Users\Malek\Desktop\site Web\test_ipv6.sh" root@89.147.111.166:/root/
```

**Note** : Utilisez des guillemets pour les chemins avec espaces.

---

## ✅ Solution 3 : Commandes Complètes (Copier-Coller)

### Option A : Naviguer puis Transférer

```powershell
# 1. Naviguer
cd 'C:\Users\Malek\Desktop\site Web'

# 2. Vérifier que le fichier existe
ls test_ipv6.sh

# 3. Transférer
scp -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" test_ipv6.sh root@89.147.111.166:/root/
```

### Option B : Chemin Complet (Une Seule Commande)

```powershell
scp -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" "C:\Users\Malek\Desktop\site Web\test_ipv6.sh" root@89.147.111.166:/root/
```

---

## 🔍 Vérification

### Vérifier que le Fichier Existe Localement

```powershell
# Depuis le répertoire du projet
cd 'C:\Users\Malek\Desktop\site Web'
Test-Path test_ipv6.sh
# Devrait retourner: True
```

### Vérifier que le Transfert a Réussi

```powershell
# Se connecter au serveur
ssh -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" root@89.147.111.166

# Sur le serveur, vérifier
ls -la /root/test_ipv6.sh
# Devrait afficher le fichier
```

---

## 🚀 Exécuter le Script sur le Serveur

### Après le Transfert

```powershell
# 1. Se connecter au serveur
ssh -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" root@89.147.111.166

# 2. Rendre le script exécutable
chmod +x /root/test_ipv6.sh

# 3. Exécuter le script
/root/test_ipv6.sh
```

---

## ⚠️ Erreurs Communes

### Erreur 1 : "No such file or directory"

**Cause** : Le fichier n'existe pas dans le répertoire actuel.

**Solution** :
```powershell
# Naviguer vers le bon répertoire
cd 'C:\Users\Malek\Desktop\site Web'
# OU utiliser le chemin complet
```

### Erreur 2 : "Permission denied"

**Cause** : Problème avec la clé SSH.

**Solution** :
```powershell
# Vérifier que la clé existe
Test-Path "C:\Users\Malek\Desktop\config site web\1984_hosting_key"

# Utiliser des guillemets simples si le chemin a des espaces
scp -i 'C:\Users\Malek\Desktop\config site web\1984_hosting_key' ...
```

### Erreur 3 : "scp: command not found"

**Cause** : SCP n'est pas installé sur Windows.

**Solution** : Utiliser PowerShell avec OpenSSH (Windows 10+) ou installer Git Bash.

---

## 📋 Checklist

- [ ] Vérifier votre position actuelle (`Get-Location`)
- [ ] Naviguer vers `C:\Users\Malek\Desktop\site Web` OU utiliser le chemin complet
- [ ] Vérifier que `test_ipv6.sh` existe (`Test-Path test_ipv6.sh`)
- [ ] Transférer avec SCP
- [ ] Se connecter au serveur et vérifier le fichier
- [ ] Rendre le script exécutable (`chmod +x`)
- [ ] Exécuter le script (`./test_ipv6.sh`)

---

**Utilisez la Solution 2 (chemin complet) pour transférer depuis n'importe quel répertoire !** ✅

