# Comment fail2ban Bannit les IPs - Explication Détaillée

## 📋 Vue d'Ensemble

fail2ban surveille les **logs** et bannit les IPs qui génèrent trop d'**erreurs** dans un **délai donné**.

---

## 🔒 1. Jail SSH (sshd)

### Critères de Bannissement

**Une IP est bannie si :**
- Elle fait **3 tentatives de connexion SSH échouées** (maxretry = 3)
- En **5 minutes** (findtime = 5m)
- **Durée du ban** : 1 heure (bantime = 1h)

### Comment ça fonctionne

1. **fail2ban surveille** : `/var/log/auth.log` (logs SSH)
2. **Détecte** : Messages comme "Failed password", "Invalid user", etc.
3. **Compte** : Le nombre d'échecs par IP
4. **Bannit** : Si ≥ 3 échecs en 5 minutes

### Exemple de Log SSH qui déclenche un ban

```
Nov 16 18:00:01 server sshd[1234]: Failed password for root from 192.168.1.100 port 22 ssh2
Nov 16 18:00:05 server sshd[1235]: Failed password for root from 192.168.1.100 port 22 ssh2
Nov 16 18:00:10 server sshd[1236]: Failed password for root from 192.168.1.100 port 22 ssh2
```

**Résultat** : IP `192.168.1.100` bannie pour 1 heure

### Filtre Utilisé

Le filtre par défaut `/etc/fail2ban/filter.d/sshd.conf` détecte :
- `Failed password`
- `Invalid user`
- `Connection closed by authenticating user`
- `PAM authentication error`

---

## 🌐 2. Jail nginx-limit-req (Protection Nginx Générale)

### Critères de Bannissement

**Une IP est bannie si :**
- Elle génère **10 requêtes avec codes d'erreur 4xx ou 5xx** (maxretry = 10)
- En **5 minutes** (findtime = 300 secondes)
- **Durée du ban** : 1 heure (bantime = 3600 secondes)

### Comment ça fonctionne

1. **fail2ban surveille** : `/var/log/nginx/error.log`
2. **Détecte** : Requêtes HTTP avec codes d'erreur 4xx (404, 403, etc.) ou 5xx (500, 502, etc.)
3. **Compte** : Le nombre d'erreurs par IP
4. **Bannit** : Si ≥ 10 erreurs en 5 minutes

### Exemple de Log Nginx qui déclenche un ban

```
192.168.1.100 - - [16/Nov/2025:18:00:01 +0000] "GET /admin HTTP/1.1" 404 162 "-" "Mozilla/5.0"
192.168.1.100 - - [16/Nov/2025:18:00:02 +0000] "GET /wp-admin HTTP/1.1" 404 162 "-" "Mozilla/5.0"
192.168.1.100 - - [16/Nov/2025:18:00:03 +0000] "GET /phpmyadmin HTTP/1.1" 404 162 "-" "Mozilla/5.0"
... (7 autres erreurs 404)
```

**Résultat** : IP `192.168.1.100` bannie pour 1 heure

### Filtre Utilisé

Le filtre `/etc/fail2ban/filter.d/nginx-limit-req.conf` détecte :
```regex
^<HOST> -.*- .*HTTP/.*" (4\d{2}|5\d{2}) .*$
```

Cela correspond à :
- Codes 4xx : 400, 401, 403, 404, etc.
- Codes 5xx : 500, 502, 503, etc.

---

## 🔌 3. Jail nginx-api (Protection API)

### Critères de Bannissement

**Une IP est bannie si :**
- Elle génère **20 requêtes avec codes d'erreur 4xx ou 5xx** sur les endpoints `/api/*` (maxretry = 20)
- En **5 minutes** (findtime = 300 secondes)
- **Durée du ban** : 30 minutes (bantime = 1800 secondes)

### Comment ça fonctionne

1. **fail2ban surveille** : `/var/log/nginx/error.log`
2. **Détecte** : Requêtes vers `/api/*` avec codes d'erreur 4xx ou 5xx
3. **Compte** : Le nombre d'erreurs par IP
4. **Bannit** : Si ≥ 20 erreurs en 5 minutes

### Exemple de Log Nginx qui déclenche un ban

```
192.168.1.100 - - [16/Nov/2025:18:00:01 +0000] "GET /api/v1/admin/stats HTTP/1.1" 403 22 "-" "Mozilla/5.0"
192.168.1.100 - - [16/Nov/2025:18:00:02 +0000] "POST /api/v1/users/delete HTTP/1.1" 401 22 "-" "Mozilla/5.0"
192.168.1.100 - - [16/Nov/2025:18:00:03 +0000] "GET /api/v1/admin/users HTTP/1.1" 403 22 "-" "Mozilla/5.0"
... (17 autres erreurs sur /api/*)
```

**Résultat** : IP `192.168.1.100` bannie pour 30 minutes

### Filtre Utilisé

Le filtre `/etc/fail2ban/filter.d/nginx-api.conf` détecte :
```regex
^<HOST> -.*- .*" (GET|POST|PUT|DELETE) /api/.*" (4\d{2}|5\d{2}) .*$
```

Cela correspond à :
- Requêtes GET, POST, PUT, DELETE vers `/api/*`
- Avec codes d'erreur 4xx ou 5xx

---

## 📊 Tableau Récapitulatif

| Jail | Fichier de Log | Détecte | Max Erreurs | Fenêtre | Durée Ban |
|------|----------------|---------|-------------|---------|-----------|
| **sshd** | `/var/log/auth.log` | Tentatives SSH échouées | 3 | 5 min | 1 heure |
| **nginx-limit-req** | `/var/log/nginx/error.log` | Erreurs HTTP 4xx/5xx | 10 | 5 min | 1 heure |
| **nginx-api** | `/var/log/nginx/error.log` | Erreurs API 4xx/5xx | 20 | 5 min | 30 min |

---

## 🔍 Comment Vérifier les Bannissements

### Voir toutes les IPs bannies

```bash
# SSH
fail2ban-client status sshd

# Nginx général
fail2ban-client status nginx-limit-req

# Nginx API
fail2ban-client status nginx-api
```

### Exemple de sortie

```
Status for the jail: sshd
|- Filter
|  |- Currently failed: 3
|  |- Total failed:     54
|  `- Journal matches:  _SYSTEMD_UNIT=sshd.service + _COMM=sshd
`- Actions
   |- Currently banned: 4
   |- Total banned:     7
   `- Banned IP list:   2.57.121.112 134.199.169.193 159.89.26.183 91.202.233.33
```

---

## ⚙️ Configuration Actuelle

### Dans `/etc/fail2ban/jail.local` :

```ini
[sshd]
enabled = true
maxretry = 3
bantime = 1h
findtime = 5m

[nginx-limit-req]
enabled = true
maxretry = 10
bantime = 3600
findtime = 300

[nginx-api]
enabled = true
maxretry = 20
bantime = 1800
findtime = 300
```

---

## 🎯 Pourquoi Ces Limites ?

### SSH (3 tentatives)
- **Raison** : Les attaques de force brute SSH sont courantes
- **Limite stricte** : 3 tentatives suffisent pour détecter une attaque
- **Ban long** : 1 heure pour décourager les attaquants

### Nginx Général (10 erreurs)
- **Raison** : Les erreurs 404 peuvent être légitimes (liens cassés)
- **Limite modérée** : 10 erreurs pour éviter les faux positifs
- **Ban long** : 1 heure pour protéger contre les scanners

### Nginx API (20 erreurs)
- **Raison** : Les erreurs API peuvent être légitimes (permissions, validation)
- **Limite plus élevée** : 20 erreurs pour éviter les faux positifs
- **Ban plus court** : 30 minutes (les utilisateurs légitimes peuvent faire des erreurs)

---

## 🆘 Cas Spéciaux

### IP Bannie par Erreur

Si votre IP est bannie par erreur :

```bash
# Débannir votre IP
fail2ban-client set sshd unbanip VOTRE_IP
fail2ban-client set nginx-limit-req unbanip VOTRE_IP
fail2ban-client set nginx-api unbanip VOTRE_IP
```

### Ajuster les Limites

Si vous voulez changer les limites, éditez `/etc/fail2ban/jail.local` :

```bash
nano /etc/fail2ban/jail.local
```

Puis redémarrez :
```bash
systemctl restart fail2ban
```

---

## 📝 Notes Importantes

1. **Les bannissements sont temporaires** : Ils expirent automatiquement après le `bantime`
2. **Les compteurs se réinitialisent** : Après `findtime` sans erreur, le compteur repart à zéro
3. **Les logs sont surveillés en temps réel** : fail2ban lit les logs au fur et à mesure
4. **Les IPs bannies ne peuvent plus accéder** : Le firewall bloque les connexions

---

## 🎉 Conclusion

fail2ban protège votre serveur en :
- ✅ Surveillant les logs en temps réel
- ✅ Détectant les patterns d'attaque
- ✅ Bannissant automatiquement les IPs malveillantes
- ✅ Protégeant contre les attaques de force brute et DDoS

