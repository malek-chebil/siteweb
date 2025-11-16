# 🌐 Configurer le DNS dans Njalla - Guide Complet

## 🔍 Diagnostic de Votre Résultat

Votre `nslookup` montre :
```
Nom :    cartagespa.com
```

**Problème** : Aucune adresse IP n'est retournée.

**Cela signifie** : Les enregistrements DNS A ne sont pas encore configurés dans Njalla.

---

## 📋 ÉTAPE 1 : Se Connecter à Njalla

1. Allez sur : https://njal.la
2. Connectez-vous à votre compte
3. Allez dans **"My Domains"** ou **"Domain Management"**
4. Cliquez sur **`cartagespa.com`**

---

## 📋 ÉTAPE 2 : Configurer les Enregistrements DNS

### Option A : Utiliser l'Interface Web de Njalla

1. Dans la gestion du domaine, cherchez **"DNS Records"** ou **"DNS Management"**
2. Cliquez sur **"Add Record"** ou **"New Record"**

### Option B : Utiliser l'API Njalla (si disponible)

Njalla peut avoir une interface API pour configurer le DNS.

---

## 📝 Configuration des Enregistrements A

### Enregistrements à Ajouter

Ajoutez **2 enregistrements A** :

#### 1. Enregistrement pour le domaine principal

```
Type    : A
Name    : @
Value   : 89.147.111.166
TTL     : 3600
```

#### 2. Enregistrement pour www

```
Type    : A
Name    : www
Value   : 89.147.111.166
TTL     : 3600
```

---

## 🖼️ Exemple d'Interface Njalla

L'interface peut ressembler à ceci :

```
┌─────────────────────────────────────────┐
│ DNS Records for cartagespa.com          │
├─────────────────────────────────────────┤
│ Type │ Name │ Value          │ TTL     │
├──────┼──────┼────────────────┼─────────┤
│ A    │ @    │ 89.147.111.166 │ 3600    │
│ A    │ www  │ 89.147.111.166 │ 3600    │
└─────────────────────────────────────────┘
```

---

## ⚙️ Détails de Configuration

### Type A
- **Type** : `A` (Address Record)
- **Fonction** : Pointe un nom de domaine vers une adresse IPv4

### Name (@)
- **@** : Représente le domaine principal (`cartagespa.com`)
- **www** : Représente le sous-domaine (`www.cartagespa.com`)

### Value
- **89.147.111.166** : L'adresse IP de votre serveur VPS

### TTL
- **3600** : 1 heure (recommandé pour la production)

---

## ✅ Après Configuration

### Vérifier la Configuration

Attendez **5-10 minutes** après avoir ajouté les enregistrements, puis testez :

#### Depuis Windows (PowerShell)

```powershell
nslookup cartagespa.com
nslookup www.cartagespa.com
```

**Résultat attendu** :
```
Nom :    cartagespa.com
Address:  89.147.111.166
```

#### Depuis le Navigateur

```
http://cartagespa.com
http://www.cartagespa.com
```

#### Depuis le Serveur

```bash
dig cartagespa.com
dig www.cartagespa.com
```

---

## ⏱️ Temps de Propagation

### Propagation DNS

- **Minimum** : 5 minutes
- **Typique** : 15-30 minutes
- **Maximum** : 24-48 heures (rare)

### Facteurs qui Affectent la Propagation

1. **TTL précédent** : Si le domaine avait un TTL de 86400, ça peut prendre jusqu'à 24h
2. **Serveurs DNS locaux** : Votre FAI peut mettre du temps à mettre à jour
3. **Cache du navigateur** : Videz le cache si nécessaire

---

## 🔍 Vérifier la Propagation dans le Monde

### Sites Web Utiles

1. **DNS Checker** : https://dnschecker.org
   - Entrez : `cartagespa.com`
   - Type : `A`
   - Vérifiez que tous les serveurs DNS montrent `89.147.111.166`

2. **What's My DNS** : https://www.whatsmydns.net
   - Entrez : `cartagespa.com`
   - Vérifiez la propagation mondiale

---

## 🐛 Dépannage

### Le DNS ne se propage pas après 1 heure

1. **Vérifiez la configuration dans Njalla**
   - Les enregistrements sont-ils corrects ?
   - Y a-t-il des erreurs de frappe ?

2. **Videz le cache DNS local**

   **Windows** :
   ```powershell
   ipconfig /flushdns
   ```

   **Linux/Mac** :
   ```bash
   sudo systemd-resolve --flush-caches
   # ou
   sudo dscacheutil -flushcache
   ```

3. **Utilisez un autre serveur DNS**
   - Essayez Google DNS : `8.8.8.8`
   - Essayez Cloudflare DNS : `1.1.1.1`

   ```powershell
   nslookup cartagespa.com 8.8.8.8
   ```

### Le domaine pointe vers une mauvaise IP

1. Vérifiez dans Njalla que l'IP est correcte : `89.147.111.166`
2. Attendez la propagation complète
3. Videz le cache DNS

### Le sous-domaine www ne fonctionne pas

1. Vérifiez que l'enregistrement `www` existe dans Njalla
2. Vérifiez que l'IP est la même : `89.147.111.166`
3. Attendez la propagation

---

## 📊 Checklist de Configuration

- [ ] Connecté à Njalla
- [ ] Accès à la gestion DNS de `cartagespa.com`
- [ ] Enregistrement A pour `@` ajouté (IP: 89.147.111.166)
- [ ] Enregistrement A pour `www` ajouté (IP: 89.147.111.166)
- [ ] TTL configuré à 3600
- [ ] Attendu 5-10 minutes
- [ ] Testé avec `nslookup cartagespa.com`
- [ ] Vérifié la propagation avec dnschecker.org
- [ ] Testé dans le navigateur

---

## 🎯 Après la Propagation

Une fois que le DNS est propagé :

1. **Testez le site** :
   ```
   http://cartagespa.com
   http://www.cartagespa.com
   ```

2. **Configurez SSL/HTTPS** :
   - Utilisez Certbot pour obtenir des certificats Let's Encrypt
   - Voir `NEXT_STEPS_AFTER_DEPLOYMENT.md`

3. **Testez toutes les fonctionnalités** :
   - Frontend
   - Backend API
   - Authentification
   - Upload d'images

---

## 📝 Notes Importantes

- **Ne supprimez pas** les enregistrements DNS existants sans vérifier
- **Gardez une copie** de votre configuration DNS
- **Vérifiez régulièrement** que le DNS fonctionne
- **Documentez** toute modification DNS

---

## 🆘 Support Njalla

Si vous avez des problèmes avec Njalla :

1. **Documentation** : https://njal.la/docs
2. **Support** : Contactez le support Njalla via leur interface
3. **FAQ** : Consultez la FAQ Njalla

---

## ✅ Résultat Final Attendu

Après configuration et propagation :

```powershell
C:\Users\Malek>nslookup cartagespa.com
Serveur :   UnKnown
Address:  10.64.0.1

Nom :    cartagespa.com
Address:  89.147.111.166    ← C'est ce que vous voulez voir !
```

Et dans le navigateur :
```
http://cartagespa.com → Votre site s'affiche ! 🎉
```

