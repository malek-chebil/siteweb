# Fix: Rate Limit 429 Too Many Requests

## Problème
Après connexion avec Google, l'endpoint `/api/v1/users/me/stats` retourne :
```
429 Too Many Requests
"Rate limit exceeded. Try again in 9 seconds."
```

## Cause
Le rate limiting était trop strict pour les endpoints utilisateurs :
- **Limite précédente** : 10 requêtes par minute pour `/api/v1/users/*`
- **Problème** : Après connexion Google, le frontend fait plusieurs requêtes (stats, profil, etc.) et dépasse rapidement cette limite

## Solution Appliquée

### Modification dans `backend/app/middleware/rate_limiter.py`

**AVANT :**
```python
if "/api/v1/auth" in path or "/api/v1/users" in path:
    return 10, 60  # 10 requests per minute
```

**APRÈS :**
```python
# Stricter limits for authentication endpoints (login, register)
if "/api/v1/auth" in path:
    return 10, 60  # 10 requests per minute for auth endpoints

# More lenient limits for user profile/stats endpoints (after login)
if "/api/v1/users" in path:
    return 30, 60  # 30 requests per minute for user endpoints
```

### Changements
- ✅ Endpoints `/api/v1/auth` : **10 requêtes/minute** (inchangé, pour sécurité)
- ✅ Endpoints `/api/v1/users` : **30 requêtes/minute** (augmenté de 10 à 30)
- ✅ Endpoints `/api/v1/admin` : **50 requêtes/minute** (inchangé)
- ✅ Autres endpoints : **100 requêtes/minute** (par défaut)

## Déploiement

### 1. Transférer le Fichier Corrigé

Le fichier a été transféré automatiquement. Si nécessaire, transférez manuellement :

```bash
# Depuis votre machine locale
scp -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" \
  backend/app/middleware/rate_limiter.py \
  root@89.147.111.166:/root/site\ Web/backend/app/middleware/rate_limiter.py
```

### 2. Redémarrer le Backend

```bash
cd /root/site\ Web
docker compose restart backend
```

### 3. Vérifier les Logs

```bash
docker compose logs backend --tail 20
```

### 4. Tester

1. Se déconnecter (si connecté)
2. Se reconnecter avec Google
3. Vérifier que `/api/v1/users/me/stats` fonctionne sans erreur 429

## Vérification

### Test Rapide

Après redémarrage, testez :

```bash
# Test depuis le serveur
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://cartagespa.com/api/v1/users/me/stats
```

**Résultat attendu :**
```json
{
  "total_listings": 0,
  "active_listings": 0,
  "expired_listings": 0,
  ...
}
```

## Si le Problème Persiste

### Option 1 : Augmenter Encore la Limite

Si 30 requêtes/minute n'est pas suffisant, modifiez dans `rate_limiter.py` :

```python
if "/api/v1/users" in path:
    return 50, 60  # 50 requests per minute
```

### Option 2 : Désactiver le Rate Limiting pour les Utilisateurs Authentifiés

Pour une solution plus avancée, vous pouvez identifier les utilisateurs authentifiés et leur donner une limite plus élevée. Cela nécessiterait de modifier le middleware pour vérifier le token JWT.

### Option 3 : Désactiver Temporairement le Rate Limiting

**⚠️ Non recommandé en production**

Dans `.env` sur le serveur :
```bash
RATE_LIMIT_ENABLED=false
```

Puis redémarrer :
```bash
docker compose restart backend
```

## Limites Actuelles (Après Correction)

| Endpoint | Limite | Fenêtre |
|----------|--------|---------|
| `/api/v1/auth/*` | 10 req/min | 60s |
| `/api/v1/users/*` | 30 req/min | 60s |
| `/api/v1/admin/*` | 50 req/min | 60s |
| Autres | 100 req/min | 60s |
| `/health` | Illimité | - |

## Notes

- Le rate limiting est **par IP**, pas par utilisateur
- Les limites sont **par endpoint**, pas globales
- Le cleanup automatique empêche les fuites mémoire
- Pour production à grande échelle, considérez Redis pour le rate limiting distribué

