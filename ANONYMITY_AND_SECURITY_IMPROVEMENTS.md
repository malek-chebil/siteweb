# 🔒 Améliorations Anonymat et Sécurité - Guide Complet

## 📋 État Actuel vs Ce Qui Manque

### ✅ Ce Qui Existe Déjà

1. **Sécurité Backend** :
   - ✅ Security headers middleware
   - ✅ Security logging middleware
   - ✅ Rate limiting
   - ✅ Request size limits
   - ✅ JWT authentication
   - ✅ CORS configuré

2. **Infrastructure** :
   - ✅ VPS anonyme (1984 Hosting - Iceland)
   - ✅ Domaine anonyme (Njalla)
   - ✅ Docker containerisation

### ❌ Ce Qui Manque (Critique)

1. **Anonymat** :
   - ❌ Pas de masquage des IPs utilisateurs
   - ❌ Logs contiennent des IPs réelles
   - ❌ Pas de proxy/VPN pour les requêtes sortantes
   - ❌ Tracking côté frontend (cookies, localStorage)
   - ❌ Pas de protection contre la corrélation

2. **Sécurité** :
   - ❌ Pas de HTTPS (HTTP seulement)
   - ❌ Pas de chiffrement des données sensibles
   - ❌ Pas de rotation des clés API
   - ❌ Pas de protection CSRF
   - ❌ Pas de protection XSS avancée
   - ❌ Pas de protection contre les attaques DDoS
   - ❌ Pas de monitoring des intrusions

3. **Confidentialité** :
   - ❌ Logs contiennent des informations personnelles
   - ❌ Pas de suppression automatique des logs
   - ❌ Pas de chiffrement des données en base
   - ❌ Pas de politique de rétention des données

---

## 🎯 Plan d'Action Prioritaire

### PRIORITÉ 1 : Anonymat des Utilisateurs

#### 1.1 Masquer les IPs dans les Logs

**Problème** : Les logs backend contiennent les vraies IPs des utilisateurs.

**Solution** : Hasher ou anonymiser les IPs dans les logs.

**Fichier à modifier** : `backend/app/utils/security_logger.py`

```python
import hashlib
import hmac

def anonymize_ip(ip: str, secret_key: str) -> str:
    """Anonymiser une IP en utilisant HMAC."""
    if not ip or ip == "unknown":
        return "anonymous"
    
    # Utiliser HMAC pour créer un hash déterministe mais non réversible
    h = hmac.new(
        secret_key.encode(),
        ip.encode(),
        hashlib.sha256
    )
    return h.hexdigest()[:16]  # Prendre les 16 premiers caractères

# OU simplement masquer les 3 derniers octets
def mask_ip(ip: str) -> str:
    """Masquer les 3 derniers octets d'une IPv4."""
    if not ip or ip == "unknown":
        return "anonymous"
    
    parts = ip.split('.')
    if len(parts) == 4:
        return f"{parts[0]}.{parts[1]}.xxx.xxx"
    return "anonymous"
```

**Modifier** `get_client_ip()` pour utiliser `mask_ip()` ou `anonymize_ip()`.

---

#### 1.2 Supprimer le Tracking Frontend

**Problème** : Cookies et localStorage trackent les utilisateurs.

**Solution** : Rendre le tracking optionnel ou anonyme.

**Fichiers à modifier** :
- `frontend/src/utils/visitStats.js`
- `frontend/src/utils/cookies.js`
- `frontend/src/utils/navigationHistory.js`

**Options** :
1. **Désactiver complètement** le tracking
2. **Anonymiser** les données (pas d'IP, pas d'identifiants)
3. **Rendre optionnel** avec consentement utilisateur

---

#### 1.3 Proxy/VPN pour Requêtes Sortantes

**Problème** : Les requêtes du serveur vers l'extérieur révèlent l'IP du serveur.

**Solution** : Utiliser un proxy/VPN pour les requêtes sortantes.

**Configuration** :
```bash
# Installer un proxy SOCKS5 (ex: via Tor)
apt install tor

# Configurer les variables d'environnement
export HTTP_PROXY=socks5://127.0.0.1:9050
export HTTPS_PROXY=socks5://127.0.0.1:9050
```

**OU utiliser un VPN** :
```bash
# Exemple avec WireGuard
apt install wireguard
# Configurer selon votre fournisseur VPN
```

---

### PRIORITÉ 2 : Sécurité

#### 2.1 Configurer HTTPS (URGENT)

**Problème** : Site en HTTP, données non chiffrées.

**Solution** : Installer Certbot et configurer SSL.

**Guide** : `HTTPS_MIGRATION_GUIDE.md`

**Commandes** :
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d cartagespa.com -d www.cartagespa.com
```

---

#### 2.2 Protection CSRF

**Problème** : Pas de protection contre les attaques CSRF.

**Solution** : Ajouter des tokens CSRF.

**Fichier à créer** : `backend/app/middleware/csrf.py`

```python
from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer
import secrets
from typing import Optional

class CSRFProtection:
    def __init__(self):
        self.token_header = "X-CSRF-Token"
    
    async def generate_token(self) -> str:
        """Générer un token CSRF."""
        return secrets.token_urlsafe(32)
    
    async def validate_token(self, request: Request, token: Optional[str]) -> bool:
        """Valider un token CSRF."""
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True  # Pas de protection pour les méthodes safe
        
        if not token:
            return False
        
        # Vérifier le token (simplifié - à améliorer avec session)
        # Pour une vraie protection, utiliser des sessions
        return True
```

---

#### 2.3 Protection XSS Avancée

**Problème** : Protection XSS basique seulement.

**Solution** : Améliorer le sanitization des entrées utilisateur.

**Fichier à modifier** : `backend/app/utils/security.py` (à créer)

```python
import bleach
from html import escape

def sanitize_html(html: str) -> str:
    """Sanitizer HTML strict."""
    allowed_tags = ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li']
    allowed_attributes = {}
    
    return bleach.clean(
        html,
        tags=allowed_tags,
        attributes=allowed_attributes,
        strip=True
    )

def sanitize_text(text: str) -> str:
    """Échapper le texte pour éviter XSS."""
    return escape(text)
```

---

#### 2.4 Protection DDoS

**Problème** : Pas de protection contre les attaques DDoS.

**Solution** : Configurer fail2ban et rate limiting strict.

**Installation** :
```bash
apt install fail2ban -y

# Créer la configuration
cat > /etc/fail2ban/jail.local <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = 22

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10
EOF

systemctl enable fail2ban
systemctl start fail2ban
```

---

#### 2.5 Monitoring des Intrusions

**Problème** : Pas de système d'alerte pour les intrusions.

**Solution** : Configurer des alertes basées sur les logs de sécurité.

**Fichier à créer** : `backend/app/utils/intrusion_detection.py`

```python
from app.utils.security_logger import SecurityEvent
from app.utils.monitoring import get_security_stats
import asyncio

async def check_intrusion_patterns():
    """Détecter les patterns d'intrusion."""
    stats = get_security_stats()
    
    # Alertes si trop de tentatives d'auth échouées
    if stats.get('auth_failures', 0) > 10:
        # Envoyer une alerte
        pass
    
    # Alertes si trop de tentatives SQL injection
    if stats.get('sql_injection_attempts', 0) > 5:
        # Envoyer une alerte
        pass
```

---

### PRIORITÉ 3 : Confidentialité

#### 3.1 Chiffrement des Données Sensibles

**Problème** : Données sensibles en clair dans la base.

**Solution** : Chiffrer les données sensibles (emails, téléphones).

**Fichier à créer** : `backend/app/utils/encryption.py`

```python
from cryptography.fernet import Fernet
import os
import base64

class DataEncryption:
    def __init__(self):
        # Générer une clé depuis une variable d'environnement
        key = os.getenv('ENCRYPTION_KEY')
        if not key:
            raise ValueError("ENCRYPTION_KEY not set")
        
        # Si la clé est en base64, décoder
        try:
            self.key = base64.urlsafe_b64decode(key)
        except:
            self.key = key.encode()
        
        self.cipher = Fernet(self.key)
    
    def encrypt(self, data: str) -> str:
        """Chiffrer des données."""
        return self.cipher.encrypt(data.encode()).decode()
    
    def decrypt(self, encrypted_data: str) -> str:
        """Déchiffrer des données."""
        return self.cipher.decrypt(encrypted_data.encode()).decode()
```

**Générer une clé** :
```python
from cryptography.fernet import Fernet
key = Fernet.generate_key()
print(key.decode())  # Ajouter à .env comme ENCRYPTION_KEY
```

---

#### 3.2 Politique de Rétention des Logs

**Problème** : Logs conservés indéfiniment.

**Solution** : Supprimer automatiquement les anciens logs.

**Script à créer** : `backend/scripts/cleanup_logs.py`

```python
import os
import time
from datetime import datetime, timedelta

LOG_RETENTION_DAYS = 30  # Conserver 30 jours

def cleanup_old_logs():
    """Supprimer les logs de plus de 30 jours."""
    logs_dir = "logs"
    
    if not os.path.exists(logs_dir):
        return
    
    cutoff_time = time.time() - (LOG_RETENTION_DAYS * 24 * 60 * 60)
    
    for filename in os.listdir(logs_dir):
        filepath = os.path.join(logs_dir, filename)
        if os.path.isfile(filepath):
            if os.path.getmtime(filepath) < cutoff_time:
                os.remove(filepath)
                print(f"Deleted old log: {filename}")

if __name__ == "__main__":
    cleanup_old_logs()
```

**Cron job** :
```bash
# Ajouter à crontab
0 2 * * * cd /root/site\ Web/backend && python scripts/cleanup_logs.py
```

---

#### 3.3 Suppression des Données Personnelles

**Problème** : Pas de mécanisme pour supprimer les données personnelles.

**Solution** : Implémenter le droit à l'oubli (GDPR).

**Endpoint à créer** : `DELETE /api/v1/users/me/data`

```python
@router.delete("/me/data")
async def delete_user_data(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Supprimer toutes les données personnelles de l'utilisateur."""
    # Anonymiser les listings
    # Supprimer les médias
    # Supprimer les favoris
    # Supprimer l'utilisateur
    pass
```

---

## 🔧 Implémentation Détaillée

### Étape 1 : Anonymiser les IPs dans les Logs

**Fichier** : `backend/app/utils/security_logger.py`

**Modifier** :
```python
def get_client_ip(request: Request) -> str:
    """Get client IP address from request (ANONYMIZED)."""
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        ip = forwarded_for.split(",")[0].strip()
    else:
        ip = request.client.host if request.client else "unknown"
    
    # Anonymiser l'IP
    return mask_ip(ip)  # Utiliser la fonction mask_ip définie plus haut
```

---

### Étape 2 : Désactiver le Tracking Frontend

**Fichier** : `frontend/src/utils/visitStats.js`

**Modifier** :
```javascript
// Option 1 : Désactiver complètement
export function recordVisit() {
  // Ne rien faire pour l'anonymat
  return null
}

// Option 2 : Anonymiser
export function recordVisit() {
  // Ne stocker que des statistiques anonymes
  // Pas d'IP, pas d'identifiants
  return {
    timestamp: Date.now(),
    // Pas d'autres données personnelles
  }
}
```

---

### Étape 3 : Configurer HTTPS

**Suivre** : `HTTPS_MIGRATION_GUIDE.md`

**Commandes** :
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d cartagespa.com -d www.cartagespa.com
```

---

### Étape 4 : Ajouter la Protection CSRF

**Créer** : `backend/app/middleware/csrf.py`

**Ajouter au main.py** :
```python
from app.middleware.csrf import CSRFProtection

csrf = CSRFProtection()

@app.middleware("http")
async def csrf_middleware(request: Request, call_next):
    # Vérifier le token CSRF pour les méthodes non-safe
    response = await call_next(request)
    return response
```

---

### Étape 5 : Configurer fail2ban

**Commandes** :
```bash
apt install fail2ban -y
systemctl enable fail2ban
systemctl start fail2ban
```

---

## 📝 Checklist Complète

### Anonymat
- [ ] IPs anonymisées dans les logs
- [ ] Tracking frontend désactivé/anonymisé
- [ ] Proxy/VPN pour requêtes sortantes
- [ ] Pas de corrélation possible entre sessions

### Sécurité
- [ ] HTTPS configuré
- [ ] Protection CSRF implémentée
- [ ] Protection XSS avancée
- [ ] Protection DDoS (fail2ban)
- [ ] Monitoring des intrusions
- [ ] Rotation des clés API

### Confidentialité
- [ ] Données sensibles chiffrées
- [ ] Politique de rétention des logs
- [ ] Droit à l'oubli implémenté
- [ ] Pas de données personnelles dans les logs

---

## 🚨 Actions Immédiates (Priorité Haute)

1. **Configurer HTTPS** (URGENT)
   - Guide : `HTTPS_MIGRATION_GUIDE.md`
   - Temps : 15 minutes

2. **Anonymiser les IPs dans les logs**
   - Modifier `security_logger.py`
   - Temps : 30 minutes

3. **Désactiver le tracking frontend**
   - Modifier `visitStats.js`
   - Temps : 15 minutes

4. **Configurer fail2ban**
   - Installation et configuration
   - Temps : 20 minutes

---

## 📚 Ressources

- **HTTPS** : `HTTPS_MIGRATION_GUIDE.md`
- **Anonymat** : `documentations/ANONYMOUS_DEPLOYMENT_GUIDE.md`
- **Sécurité** : Documentation FastAPI Security
- **GDPR** : Guide de conformité RGPD

---

## 🆘 Support

Si vous avez besoin d'aide pour implémenter ces améliorations, consultez les guides spécifiques ou demandez de l'aide pour une fonctionnalité précise.

