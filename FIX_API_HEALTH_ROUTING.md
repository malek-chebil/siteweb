# Fix: /api/health Returns 404

## Problème
`curl https://cartagespa.com/api/health` retourne `{"detail":"Not Found"}`.

## Cause
Nginx route `/api` vers le backend, mais le backend reçoit peut-être une requête malformée.

## Diagnostic

### Test 1 : Health Endpoint Direct (Sans /api)

Le script Nginx a un `location /health` séparé :

```bash
curl https://cartagespa.com/health
```

**Résultat attendu :**
```json
{"status":"ok"}
```

### Test 2 : Backend Direct

Testez le backend directement depuis le serveur :

```bash
curl http://localhost:8000/health
```

**Résultat attendu :**
```json
{"status":"ok"}
```

### Test 3 : Vérifier le Backend

```bash
# Vérifier que le backend est en cours d'exécution
docker compose ps backend

# Voir les logs du backend
docker compose logs backend --tail 20
```

## Explication du Routing

Dans la configuration Nginx :

```nginx
location /api {
    proxy_pass http://${BACKEND_IP}:8000;
    ...
}

location /health {
    proxy_pass http://${BACKEND_IP}:8000/health;
    ...
}
```

**Comportement attendu :**
- `https://cartagespa.com/health` → Nginx route vers `http://backend:8000/health` → ✅ Devrait fonctionner
- `https://cartagespa.com/api/health` → Nginx enlève `/api` → envoie `/health` au backend → ⚠️ Peut ne pas fonctionner selon la config

## Solution

### Option 1 : Utiliser `/health` Directement (Recommandé)

Le health endpoint est accessible directement :

```bash
curl https://cartagespa.com/health
```

### Option 2 : Corriger le Routing Nginx (Si nécessaire)

Si vous voulez que `/api/health` fonctionne, modifiez la configuration Nginx pour préserver le préfixe `/api` :

```nginx
location /api {
    proxy_pass http://${BACKEND_IP}:8000/api;
    ...
}
```

**Mais attention** : Cela changerait tous les endpoints API. Actuellement, les endpoints sont sous `/api/v1/...` dans le backend, donc cette modification pourrait casser d'autres endpoints.

## Vérification Complète

```bash
# 1. Test HTTPS principal
curl -I https://cartagespa.com
# ✅ Devrait retourner HTTP/2 200

# 2. Test health endpoint direct
curl https://cartagespa.com/health
# ✅ Devrait retourner {"status":"ok"}

# 3. Test backend direct
curl http://localhost:8000/health
# ✅ Devrait retourner {"status":"ok"}

# 4. Test API listings (pour vérifier que /api fonctionne)
curl https://cartagespa.com/api/v1/listings
# ✅ Devrait retourner une liste (vide ou avec données)
```

## Conclusion

Le 404 sur `/api/health` est **normal** car :
- Le health endpoint est à `/health` (racine)
- Nginx route `/api` vers le backend, mais le backend reçoit peut-être une requête malformée
- **Utilisez** : `https://cartagespa.com/health` (sans `/api`)

---

## Si `/health` Direct Ne Fonctionne Pas

Si `curl https://cartagespa.com/health` ne fonctionne pas non plus :

1. **Vérifier que le backend est accessible :**
   ```bash
   docker compose ps backend
   curl http://localhost:8000/health
   ```

2. **Vérifier les logs Nginx :**
   ```bash
   docker compose logs nginx --tail 50
   ```

3. **Vérifier les logs Backend :**
   ```bash
   docker compose logs backend --tail 50
   ```

4. **Vérifier la configuration Nginx :**
   ```bash
   docker compose exec nginx cat /etc/nginx/nginx.conf | grep -A 5 "location /health"
   ```

