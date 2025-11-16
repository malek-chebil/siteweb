# Commandes Rapides fail2ban

## ÉTAPE 2 : Configuration de Base

### Sur le serveur :

```bash
# 1. Créer le fichier de configuration local
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# 2. Éditer le fichier
nano /etc/fail2ban/jail.local
```

### Dans l'éditeur nano :

1. **Chercher la section `[DEFAULT]`** (Ctrl+W, taper "DEFAULT")
2. **Vérifier ces valeurs** :
   ```ini
   bantime = 3600
   findtime = 600
   maxretry = 5
   ```
3. **Sauvegarder** : `Ctrl+O`, puis `Enter`, puis `Ctrl+X`

---

## ÉTAPE 3 : Protection SSH

### Dans le même fichier (`nano /etc/fail2ban/jail.local`) :

1. **Chercher la section `[sshd]`** (Ctrl+W, taper "sshd")
2. **Vérifier que c'est activé** :
   ```ini
   [sshd]
   enabled = true
   port = ssh
   logpath = %(sshd_log)s
   backend = %(sshd_backend)s
   maxretry = 3
   bantime = 3600
   findtime = 300
   ```
3. **Sauvegarder** : `Ctrl+O`, `Enter`, `Ctrl+X`

---

## ÉTAPE 4 : Protection Nginx

### 4.1. Créer les filtres

```bash
# Créer le répertoire (déjà créé normalement)
mkdir -p /etc/fail2ban/filter.d

# Créer le filtre Nginx général
cat > /etc/fail2ban/filter.d/nginx-limit-req.conf << 'EOF'
[Definition]
failregex = ^<HOST> -.*- .*HTTP/.*" (4\d{2}|5\d{2}) .*$
            ^<HOST> -.*- .*HTTP/.*" (4\d{2}|5\d{2}) .*" ".*"$
ignoreregex =
EOF

# Créer le filtre Nginx API
cat > /etc/fail2ban/filter.d/nginx-api.conf << 'EOF'
[Definition]
failregex = ^<HOST> -.*- .*" (GET|POST|PUT|DELETE) /api/.*" (4\d{2}|5\d{2}) .*$
            ^<HOST> -.*- .*" (GET|POST|PUT|DELETE) /api/.*" (4\d{2}|5\d{2}) .*" ".*"$
ignoreregex =
EOF
```

### 4.2. Ajouter les jails Nginx

```bash
# Éditer jail.local
nano /etc/fail2ban/jail.local
```

**Ajouter à la fin du fichier :**
```ini
# Nginx - Protection générale
[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
bantime = 3600
findtime = 300

# Nginx - Protection API
[nginx-api]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
filter = nginx-api
maxretry = 20
bantime = 1800
findtime = 300
```

**Sauvegarder** : `Ctrl+O`, `Enter`, `Ctrl+X`

---

## ÉTAPE 5 : Configurer les logs Nginx

```bash
# Créer le répertoire de logs
mkdir -p /var/log/nginx

# Créer le fichier de log (si nécessaire)
touch /var/log/nginx/error.log
chmod 644 /var/log/nginx/error.log
```

**Note** : Les logs Nginx Docker doivent être montés. Vérifier `docker-compose.yml` :
```yaml
nginx:
  volumes:
    - ./nginx/logs:/var/log/nginx:rw
```

---

## ÉTAPE 6 : Démarrer fail2ban

```bash
# Démarrer le service
systemctl start fail2ban

# Activer au démarrage
systemctl enable fail2ban

# Vérifier le statut
systemctl status fail2ban
```

---

## ÉTAPE 7 : Vérifier

```bash
# Voir les jails actifs
fail2ban-client status

# Voir le statut d'un jail spécifique
fail2ban-client status sshd
fail2ban-client status nginx-limit-req
fail2ban-client status nginx-api
```

---

## Commandes Utiles

### Voir les IPs bannies
```bash
fail2ban-client status sshd
```

### Débannir une IP
```bash
fail2ban-client set sshd unbanip 192.168.1.100
```

### Voir les logs
```bash
tail -f /var/log/fail2ban.log
```

### Redémarrer fail2ban
```bash
systemctl restart fail2ban
```

