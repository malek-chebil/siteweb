# Guide : Configuration fail2ban (Protection DDoS)

## 📋 Objectif
Configurer fail2ban pour protéger le serveur contre :
- Les attaques DDoS
- Les tentatives de force brute SSH
- Les attaques sur les endpoints API
- Les requêtes malveillantes

## ⏱️ Temps estimé
15-20 minutes

---

## ÉTAPE 1 : Installation de fail2ban

### Sur le serveur :

```bash
# Mettre à jour les paquets
apt update

# Installer fail2ban
apt install -y fail2ban

# Vérifier l'installation
fail2ban-client --version
```

**Résultat attendu :** Version de fail2ban affichée (ex: `0.11.2`)

---

## ÉTAPE 2 : Configuration de base

### 2.1. Créer le fichier de configuration local

```bash
# Copier le fichier de configuration par défaut
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Éditer le fichier
nano /etc/fail2ban/jail.local
```

### 2.2. Modifier la section [DEFAULT]

**Trouver cette section :**
```ini
[DEFAULT]
# Ban hosts for one hour
bantime = 3600
# Override /etc/fail2ban/jail.d/00-firewalld.conf:
banaction = iptables-multiport
# A host is banned if it has generated "maxretry" during the last "findtime" seconds.
findtime = 600
maxretry = 5
```

**Modifier pour :**
```ini
[DEFAULT]
# Ban hosts for one hour (3600 seconds)
bantime = 3600

# Override /etc/fail2ban/jail.d/00-firewalld.conf:
banaction = iptables-multiport

# A host is banned if it has generated "maxretry" during the last "findtime" seconds.
findtime = 600
maxretry = 5

# Email notifications (optionnel - désactivé par défaut)
# destemail = root@localhost
# sendername = Fail2Ban
# action = %(action_mwl)s
```

**Sauvegarder** : `Ctrl+O`, `Enter`, `Ctrl+X`

---

## ÉTAPE 3 : Configurer la protection SSH

### 3.1. Vérifier que SSH est activé

Dans le fichier `/etc/fail2ban/jail.local`, trouver la section `[sshd]` :

```ini
[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
backend = %(sshd_backend)s
maxretry = 5
bantime = 3600
findtime = 600
```

**Vérifier que `enabled = true`**

Si ce n'est pas le cas, modifier :
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

**Sauvegarder** : `Ctrl+O`, `Enter`, `Ctrl+X`

---

## ÉTAPE 4 : Configurer la protection Nginx

### 4.1. Créer un filtre pour Nginx

```bash
# Créer le répertoire des filtres personnalisés
mkdir -p /etc/fail2ban/filter.d

# Créer le filtre pour Nginx
nano /etc/fail2ban/filter.d/nginx-limit-req.conf
```

**Contenu du fichier :**
```ini
[Definition]
failregex = ^<HOST> -.*- .*HTTP/.*" (4\d{2}|5\d{2}) .*$
            ^<HOST> -.*- .*HTTP/.*" (4\d{2}|5\d{2}) .*" ".*"$
ignoreregex =
```

**Sauvegarder** : `Ctrl+O`, `Enter`, `Ctrl+X`

### 4.2. Créer un filtre pour les attaques API

```bash
nano /etc/fail2ban/filter.d/nginx-api.conf
```

**Contenu du fichier :**
```ini
[Definition]
# Détecter les requêtes répétées vers /api avec codes d'erreur
failregex = ^<HOST> -.*- .*" (GET|POST|PUT|DELETE) /api/.*" (4\d{2}|5\d{2}) .*$
            ^<HOST> -.*- .*" (GET|POST|PUT|DELETE) /api/.*" (4\d{2}|5\d{2}) .*" ".*"$
ignoreregex =
```

**Sauvegarder** : `Ctrl+O`, `Enter`, `Ctrl+X`

### 4.3. Ajouter les jails Nginx dans jail.local

```bash
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

## ÉTAPE 5 : Configurer l'accès aux logs Nginx Docker

### 5.1. Vérifier les logs Nginx

Les logs Nginx sont dans le conteneur Docker. Il faut les rendre accessibles à fail2ban.

**Option 1 : Utiliser les logs du conteneur (Recommandé)**

```bash
# Vérifier où sont les logs
docker compose logs nginx --tail 10

# Les logs sont accessibles via docker logs, mais fail2ban a besoin d'un fichier
# On va créer un script pour copier les logs
```

**Option 2 : Configurer Nginx pour logger sur le système hôte**

Modifier `docker-compose.yml` pour monter un volume pour les logs :

```yaml
nginx:
  volumes:
    - ./nginx/logs:/var/log/nginx:rw  # Ajouter cette ligne
    # ... autres volumes
```

Puis redémarrer :
```bash
docker compose restart nginx
```

### 5.2. Vérifier que les logs sont accessibles

```bash
# Vérifier que le fichier existe
ls -la /var/log/nginx/error.log

# Si le fichier n'existe pas, créer le répertoire
mkdir -p /var/log/nginx
touch /var/log/nginx/error.log
chmod 644 /var/log/nginx/error.log
```

---

## ÉTAPE 6 : Démarrer et activer fail2ban

### 6.1. Démarrer fail2ban

```bash
# Démarrer le service
systemctl start fail2ban

# Activer au démarrage
systemctl enable fail2ban

# Vérifier le statut
systemctl status fail2ban
```

**Résultat attendu :** `Active: active (running)`

### 6.2. Vérifier les jails actifs

```bash
# Voir les jails actifs
fail2ban-client status

# Voir le statut d'un jail spécifique
fail2ban-client status sshd
fail2ban-client status nginx-limit-req
fail2ban-client status nginx-api
```

---

## ÉTAPE 7 : Tester fail2ban

### 7.1. Tester SSH (optionnel - attention !)

**⚠️ ATTENTION : Ne testez pas depuis votre IP actuelle !**

```bash
# Voir les IPs bannies
fail2ban-client status sshd

# Voir les IPs bannies pour Nginx
fail2ban-client status nginx-limit-req
```

### 7.2. Tester avec une requête API

**Depuis votre machine locale :**

```bash
# Faire plusieurs requêtes avec erreur (simuler une attaque)
for i in {1..25}; do
  curl -I https://cartagespa.com/api/v1/nonexistent 2>&1
done
```

**Sur le serveur, vérifier :**
```bash
# Voir si votre IP est bannie
fail2ban-client status nginx-api

# Voir les logs
tail -f /var/log/fail2ban.log
```

---

## ÉTAPE 8 : Commandes utiles

### 8.1. Gérer les bannissements

```bash
# Voir toutes les IPs bannies
fail2ban-client status

# Voir les IPs bannies pour un jail spécifique
fail2ban-client status sshd

# Débannir une IP
fail2ban-client set sshd unbanip 192.168.1.100

# Bannir manuellement une IP
fail2ban-client set sshd banip 192.168.1.100
```

### 8.2. Redémarrer fail2ban

```bash
# Redémarrer le service
systemctl restart fail2ban

# Recharger la configuration (sans redémarrer)
fail2ban-client reload
```

### 8.3. Voir les logs

```bash
# Logs fail2ban
tail -f /var/log/fail2ban.log

# Logs d'un jail spécifique
tail -f /var/log/fail2ban.log | grep sshd
```

---

## ✅ Vérification Finale

### Checklist :

- [ ] fail2ban installé
- [ ] Service démarré et activé
- [ ] Jail SSH activé
- [ ] Jails Nginx créés et activés
- [ ] Logs Nginx accessibles
- [ ] Test de fonctionnement réussi

### Commandes de vérification :

```bash
# Vérifier le statut
systemctl status fail2ban

# Voir les jails actifs
fail2ban-client status

# Voir les IPs bannies
fail2ban-client status sshd
```

---

## 🆘 Dépannage

### Problème : fail2ban ne démarre pas

**Solution :**
```bash
# Voir les erreurs
journalctl -u fail2ban -n 50

# Vérifier la syntaxe de la configuration
fail2ban-client -t
```

### Problème : Les logs Nginx ne sont pas accessibles

**Solution :**
1. Vérifier que les logs sont montés dans docker-compose.yml
2. Vérifier les permissions : `ls -la /var/log/nginx/`
3. Créer le fichier manuellement si nécessaire

### Problème : Votre IP est bannie par erreur

**Solution :**
```bash
# Débannir votre IP
fail2ban-client set sshd unbanip VOTRE_IP
fail2ban-client set nginx-limit-req unbanip VOTRE_IP
fail2ban-client set nginx-api unbanip VOTRE_IP
```

---

## 📊 Monitoring

### Voir les statistiques

```bash
# Statistiques globales
fail2ban-client status

# Statistiques d'un jail
fail2ban-client status sshd
```

### Logs à surveiller

```bash
# Logs fail2ban
tail -f /var/log/fail2ban.log

# Logs Nginx (pour voir les attaques)
tail -f /var/log/nginx/error.log
```

---

## 🎉 Félicitations !

fail2ban est maintenant configuré et protège votre serveur !

**Prochaines étapes possibles :**
- Configurer des backups automatiques
- Configurer un monitoring (Uptime Robot)
- Optimiser les performances (CDN, cache)

