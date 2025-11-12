# 🔧 Fix: Problème CORS entre Frontend Vercel et Backend Render

## ❌ Symptômes du Problème CORS

Si vous voyez ces erreurs dans la console du navigateur:
```
Access to fetch at 'https://votre-backend.onrender.com/api/v1/...' from origin 'https://frontend-mocha-seven-19.vercel.app' has been blocked by CORS policy
```

Ou:
```
CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource
```

✅ **C'est un problème CORS!**

---

## 🔍 Diagnostic du Problème CORS

### 1. Vérifier CORS_ORIGINS dans Render

1. **Allez sur**: https://dashboard.render.com
2. **Sélectionnez votre service backend**
3. **Cliquez sur "Environment"** → **"Environment Variables"**
4. **Trouvez `CORS_ORIGINS`**
5. **Vérifiez que la valeur inclut**:
   - `https://frontend-mocha-seven-19.vercel.app`
   - `http://localhost:5174`
   - `http://localhost:5173`
   - `http://localhost:3000`

### 2. Format Correct de CORS_ORIGINS

**✅ Format correct**:
```
https://frontend-mocha-seven-19.vercel.app,http://localhost:5174,http://localhost:5173,http://localhost:3000
```

**❌ Format incorrect** (avec espaces):
```
https://frontend-mocha-seven-19.vercel.app, http://localhost:5174, http://localhost:5173
```

**❌ Format incorrect** (sans https://):
```
frontend-mocha-seven-19.vercel.app,localhost:5174
```

**❌ Format incorrect** (URL incorrecte):
```
https://frontend-mocha-seven-19.vercel.app/
```

⚠️ **Important**: 
- Pas d'espaces après les virgules
- Utilisez `https://` pour la production
- Pas de slash final (`/`) à la fin de l'URL
- URLs séparées par des virgules uniquement

---

## ✅ Solution: Configurer CORS_ORIGINS dans Render

### Étape 1: Ouvrir les Variables d'Environnement

1. **Allez sur**: https://dashboard.render.com
2. **Sélectionnez votre service backend**
3. **Cliquez sur "Environment"** → **"Environment Variables"**

### Étape 2: Mettre à Jour CORS_ORIGINS

1. **Trouvez `CORS_ORIGINS`** (ou créez-la si elle n'existe pas)
2. **Mettez à jour la valeur** avec:
   ```
   https://frontend-mocha-seven-19.vercel.app,http://localhost:5174,http://localhost:5173,http://localhost:3000
   ```
3. **Vérifiez que**:
   - ✅ L'URL du frontend Vercel est incluse: `https://frontend-mocha-seven-19.vercel.app`
   - ✅ Pas d'espaces après les virgules
   - ✅ Utilisez `https://` pour la production
   - ✅ Pas de slash final (`/`) à la fin
4. **Cliquez sur "Save Changes"**

### Étape 3: Render Redéploie Automatiquement

1. **Render redéploiera automatiquement** après avoir sauvegardé
2. **Vous verrez**: "Deploying..." dans le statut du service
3. **Attendez que le déploiement soit terminé** (vous verrez "Live" en vert)
4. **Vérifiez les logs** pour confirmer qu'il n'y a pas d'erreurs

---

## 🔍 Vérification de la Configuration CORS

### 1. Vérifier les Logs dans Render

1. **Allez sur**: https://dashboard.render.com
2. **Sélectionnez votre service backend**
3. **Cliquez sur "Logs"** (dans le menu de gauche)
4. **Vérifiez qu'il n'y a pas d'erreurs CORS**

### 2. Tester CORS avec curl

Testez si CORS est configuré correctement:

```bash
curl -H "Origin: https://frontend-mocha-seven-19.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://votre-backend.onrender.com/api/v1/listings
```

**Réponse attendue**:
```
Access-Control-Allow-Origin: https://frontend-mocha-seven-19.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type, Accept, Origin, X-Requested-With
```

### 3. Tester dans le Navigateur

1. **Visitez**: https://frontend-mocha-seven-19.vercel.app/
2. **Ouvrez la console** (F12)
3. **Vérifiez qu'il n'y a pas d'erreurs CORS**
4. **Testez l'authentification**: Créez un compte ou connectez-vous
5. **Testez les annonces**: Créez, modifiez, supprimez des annonces

---

## 🆘 Problèmes Courants et Solutions

### Problème 1: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Cause**: `CORS_ORIGINS` ne contient pas l'URL du frontend Vercel

**Solution**: 
1. Vérifiez que `CORS_ORIGINS` dans Render inclut: `https://frontend-mocha-seven-19.vercel.app`
2. Vérifiez que l'URL est correcte (avec `https://`)
3. Vérifiez que le format est correct (pas d'espaces, pas de slash final)
4. Redéployez le backend après avoir modifié `CORS_ORIGINS`

### Problème 2: "CORS policy: Request header field authorization is not allowed"

**Cause**: Les headers autorisés ne sont pas configurés correctement

**Solution**: 
1. Vérifiez que `allow_headers` dans `app/main.py` inclut `"Authorization"`
2. Vérifiez que le backend a redéployé après les changements

### Problème 3: "CORS policy: Method POST is not allowed"

**Cause**: Les méthodes autorisées ne sont pas configurées correctement

**Solution**: 
1. Vérifiez que `allow_methods` dans `app/main.py` inclut `"POST"`, `"PUT"`, `"DELETE"`, etc.
2. Vérifiez que le backend a redéployé après les changements

### Problème 4: CORS fonctionne en local mais pas en production

**Cause**: `CORS_ORIGINS` dans Render ne contient pas l'URL de production

**Solution**: 
1. Vérifiez que `CORS_ORIGINS` dans Render inclut: `https://frontend-mocha-seven-19.vercel.app`
2. Vérifiez que vous utilisez `https://` (pas `http://`)
3. Vérifiez que l'URL est correcte (sans slash final)

---

## 🔧 Configuration CORS dans le Backend

### Code CORS dans `app/main.py`

Le backend utilise cette configuration CORS:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,  # Depuis CORS_ORIGINS
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=[
        "Authorization",
        "Content-Type",
        "Accept",
        "Origin",
        "X-Requested-With",
    ],
    expose_headers=[
        "X-RateLimit-Limit",
        "X-RateLimit-Remaining",
        "X-RateLimit-Reset",
    ],
    max_age=3600,
)
```

### Configuration dans `app/config.py`

```python
CORS_ORIGINS: str = "http://localhost:5173,http://localhost:5174,http://localhost:3000"

@property
def cors_origins_list(self) -> list[str]:
    """Parse CORS_ORIGINS from comma-separated string to list."""
    return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]
```

---

## ✅ Checklist de Vérification CORS

### Configuration dans Render
- [ ] `CORS_ORIGINS` est défini dans Render
- [ ] `CORS_ORIGINS` inclut: `https://frontend-mocha-seven-19.vercel.app`
- [ ] `CORS_ORIGINS` inclut: `http://localhost:5174`
- [ ] Format correct: URLs séparées par des virgules (pas d'espaces)
- [ ] Utilisez `https://` pour la production
- [ ] Pas de slash final (`/`) à la fin de l'URL

### Redéploiement
- [ ] Backend redéployé après avoir modifié `CORS_ORIGINS`
- [ ] Statut du service est "Live" (en vert)
- [ ] Pas d'erreurs dans les logs

### Test
- [ ] Frontend accessible: https://frontend-mocha-seven-19.vercel.app/
- [ ] Pas d'erreurs CORS dans la console du navigateur
- [ ] Authentification fonctionne
- [ ] API fonctionne

---

## 🎯 Solution Rapide

### Étape 1: Mettre à Jour CORS_ORIGINS dans Render

1. **Allez sur**: https://dashboard.render.com
2. **Sélectionnez votre service backend**
3. **Cliquez sur "Environment"** → **"Environment Variables"**
4. **Trouvez `CORS_ORIGINS`**
5. **Mettez à jour la valeur** avec:
   ```
   https://frontend-mocha-seven-19.vercel.app,http://localhost:5174,http://localhost:5173,http://localhost:3000
   ```
6. **Cliquez sur "Save Changes"**

### Étape 2: Attendre le Redéploiement

1. **Render redéploiera automatiquement** (2-5 minutes)
2. **Attendez que le statut soit "Live"** (en vert)
3. **Vérifiez les logs** pour confirmer qu'il n'y a pas d'erreurs

### Étape 3: Tester

1. **Visitez**: https://frontend-mocha-seven-19.vercel.app/
2. **Ouvrez la console** (F12)
3. **Vérifiez qu'il n'y a pas d'erreurs CORS**
4. **Testez l'application**

---

## 📝 Notes Importantes

### Format de CORS_ORIGINS

✅ **Correct**:
```
https://frontend-mocha-seven-19.vercel.app,http://localhost:5174
```

❌ **Incorrect** (avec espaces):
```
https://frontend-mocha-seven-19.vercel.app, http://localhost:5174
```

❌ **Incorrect** (avec slash final):
```
https://frontend-mocha-seven-19.vercel.app/,http://localhost:5174
```

❌ **Incorrect** (sans https://):
```
frontend-mocha-seven-19.vercel.app,localhost:5174
```

### Redéploiement

- ✅ Render redéploie automatiquement quand vous modifiez `CORS_ORIGINS`
- ✅ Le redéploiement prend généralement 2-5 minutes
- ✅ Vous devez attendre que le déploiement soit terminé avant de tester
- ✅ Vérifiez les logs pour confirmer qu'il n'y a pas d'erreurs

---

## 🔗 Ressources

- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Frontend URL**: https://frontend-mocha-seven-19.vercel.app/
- **Backend URL**: `https://votre-backend.onrender.com`

---

## ✅ Résumé

1. ✅ **Vérifiez `CORS_ORIGINS` dans Render**
2. ✅ **Mettez à jour avec l'URL du frontend Vercel**
3. ✅ **Format correct**: URLs séparées par des virgules (pas d'espaces)
4. ✅ **Utilisez `https://` pour la production**
5. ✅ **Attendez le redéploiement automatique**
6. ✅ **Testez l'application**

---

**Le problème CORS devrait être résolu! 🚀**

