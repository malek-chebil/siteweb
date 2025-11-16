# Fix Final : Rate Limit 429 - Solution Complète

## Problème
Même après augmentation de la limite, `/api/v1/users/me/stats` retourne toujours 429.

## Cause
Le frontend fait **33 requêtes** au chargement, et plusieurs composants appellent `/api/v1/users/me/stats` simultanément, dépassant même 60 req/min.

## Solution 1 : Limite Spécifique pour Stats (Déjà Appliquée)

Limite augmentée à **60 req/min** pour `/api/v1/users/me/stats`.

**Vérifier que le backend a été redémarré :**
```bash
cd /root/site\ Web
docker compose restart backend
docker compose logs backend --tail 20
```

## Solution 2 : Désactiver Rate Limiting pour Utilisateurs Authentifiés (Recommandé)

Si le problème persiste, désactiver le rate limiting pour les endpoints utilisateurs authentifiés.

### Modification dans `rate_limiter.py`

Ajouter une vérification pour les utilisateurs authentifiés :

```python
async def dispatch(self, request: Request, call_next: Callable):
    """
    Check rate limit before processing request.
    """
    # Skip rate limiting for health checks
    if request.url.path in ["/health", "/"]:
        return await call_next(request)

    # Skip rate limiting for authenticated user endpoints
    # Check if user is authenticated by looking for Authorization header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        # User is authenticated - skip rate limiting for user endpoints
        if "/api/v1/users" in request.url.path:
            # Process request without rate limiting
            response = await call_next(request)
            # Add rate limit headers with high values
            response.headers["X-RateLimit-Limit"] = "1000"
            response.headers["X-RateLimit-Remaining"] = "999"
            response.headers["X-RateLimit-Reset"] = str(int(time.time()) + 60)
            return response

    # Get client identifier
    identifier = self._get_client_identifier(request)
    # ... rest of the code
```

## Solution 3 : Désactiver Complètement le Rate Limiting (Temporaire)

**⚠️ Non recommandé en production, mais utile pour tester**

### Dans `.env` sur le serveur :

```bash
nano /root/site\ Web/.env
```

Ajouter ou modifier :
```bash
RATE_LIMIT_ENABLED=false
```

Puis redémarrer :
```bash
docker compose restart backend
```

## Solution 4 : Augmenter Encore la Limite (Simple)

Si vous préférez garder le rate limiting, augmentez simplement la limite :

### Dans `rate_limiter.py` :

```python
if "/api/v1/users/me/stats" in path:
    return 120, 60  # 120 requests per minute for stats endpoint
```

## Solution Recommandée : Combinaison

1. **Garder le rate limiting pour les endpoints publics** (auth, listings publics)
2. **Désactiver pour les endpoints utilisateurs authentifiés** (Solution 2)
3. **Garder des limites strictes pour les endpoints admin**

## Déploiement de la Solution 2

### 1. Modifier `rate_limiter.py`

Le fichier sera modifié pour sauter le rate limiting si l'utilisateur est authentifié (présence d'un token Bearer).

### 2. Transférer et Redémarrer

```bash
# Sur le serveur
cd /root/site\ Web
docker compose restart backend
docker compose logs backend --tail 20
```

### 3. Tester

1. Se déconnecter
2. Se reconnecter avec Google
3. Vérifier que `/api/v1/users/me/stats` fonctionne sans erreur 429

## Limites Actuelles (Après Correction V2)

| Endpoint | Limite | Fenêtre |
|----------|--------|---------|
| `/api/v1/auth/*` | 10 req/min | 60s |
| `/api/v1/users/me/stats` | **60 req/min** | 60s (augmenté) |
| `/api/v1/users/*` (autres) | 30 req/min | 60s |
| `/api/v1/admin/*` | 50 req/min | 60s |
| Autres | 100 req/min | 60s |
| `/health` | Illimité | - |

## Si le Problème Persiste

1. **Vérifier que le backend a bien été redémarré :**
   ```bash
   docker compose ps backend
   docker compose logs backend --tail 50 | grep -i "rate"
   ```

2. **Vérifier la configuration :**
   ```bash
   docker compose exec backend cat /app/app/middleware/rate_limiter.py | grep -A 5 "users/me/stats"
   ```

3. **Tester directement :**
   ```bash
   # Faire plusieurs requêtes rapides
   for i in {1..10}; do
     curl -H "Authorization: Bearer YOUR_TOKEN" \
       https://cartagespa.com/api/v1/users/me/stats
     echo ""
   done
   ```

4. **Si nécessaire, désactiver temporairement :**
   ```bash
   # Dans .env
   RATE_LIMIT_ENABLED=false
   docker compose restart backend
   ```

