# Fix: Health Endpoint 404

## Problème
`curl -I https://cartagespa.com/api/v1/health` retourne 404.

## Cause
Le health endpoint du backend est à `/health` (racine), pas à `/api/v1/health`.

Dans `backend/app/main.py` :
```python
@app.get("/health")
async def health_check():
    return {"status": "ok"}
```

## Solution

### Test 1 : Health Endpoint Direct (Recommandé)

Le health endpoint est accessible directement à la racine :

```bash
curl https://cartagespa.com/health
```

**Résultat attendu :**
```json
{"status":"ok"}
```

### Test 2 : Via Nginx (si configuré)

Si Nginx route `/api` vers le backend, essayez :

```bash
curl https://cartagespa.com/api/health
```

**Note** : Cela dépend de la configuration Nginx. Si Nginx fait `proxy_pass http://backend:8000` (sans préfixe), alors `/api/health` devient `/health` au backend.

### Test 3 : Backend Direct (depuis le serveur)

```bash
curl http://localhost:8000/health
```

**Résultat attendu :**
```json
{"status":"ok"}
```

---

## Configuration Nginx Actuelle

Dans `nginx/start-nginx-with-ips.sh`, la configuration est :

```nginx
location /api {
    proxy_pass http://${BACKEND_IP}:8000;
    ...
}
```

Cela signifie que :
- `https://cartagespa.com/api/v1/health` → Nginx enlève `/api` → envoie `/v1/health` au backend → ❌ 404
- `https://cartagespa.com/api/health` → Nginx enlève `/api` → envoie `/health` au backend → ✅ OK

---

## Tests Recommandés

### Test 1 : Health Endpoint Direct
```bash
curl https://cartagespa.com/health
```

### Test 2 : Health via API (si Nginx préserve le préfixe)
```bash
curl https://cartagespa.com/api/health
```

### Test 3 : API Endpoints (qui fonctionnent)
```bash
curl https://cartagespa.com/api/v1/listings
```

---

## Conclusion

Le 404 sur `/api/v1/health` est **normal** car :
- Le health endpoint est à `/health` (racine)
- Les endpoints API sont sous `/api/v1/...`
- Le health endpoint n'est pas sous le préfixe `/api/v1`

**Utilisez** : `https://cartagespa.com/health` ou `https://cartagespa.com/api/health`

---

## Vérification Complète

```bash
# Test HTTPS principal
curl -I https://cartagespa.com
# ✅ Devrait retourner HTTP/2 200

# Test health endpoint
curl https://cartagespa.com/health
# ✅ Devrait retourner {"status":"ok"}

# Test API (si vous avez des listings)
curl https://cartagespa.com/api/v1/listings
# ✅ Devrait retourner une liste (vide ou avec données)
```

