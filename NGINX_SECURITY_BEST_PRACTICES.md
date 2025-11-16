# 🔒 Sécurité Nginx - Bonnes Pratiques

## 🔍 Problème de Sécurité

### Utiliser `default_server` avec `_` peut exposer à :

1. **Attaques de Host Header** : Un attaquant peut envoyer des requêtes avec un Host header malveillant
2. **Exposition non intentionnelle** : Le site peut être accessible via n'importe quel nom de domaine pointant vers l'IP
3. **Fuites d'informations** : Peut révéler des informations sur la configuration

---

## ✅ Solution Sécurisée : Bloc Default avec Refus

### Configuration Recommandée

```nginx
# Server block principal (votre site)
server {
    listen 80;
    server_name cartagespa.com www.cartagespa.com 89.147.111.166;
    
    # ... votre configuration ...
}

# Bloc default - refuse toutes les autres requêtes
server {
    listen 80 default_server;
    server_name _;
    
    # Retourner 444 (ferme la connexion) pour les Host headers non correspondants
    return 444;
}
```

**Avantages** :
- ✅ Votre site fonctionne avec le domaine et l'IP
- ✅ Les requêtes avec Host headers malveillants sont refusées
- ✅ Plus sécurisé

---

## ✅ Alternative : Redirection

### Si Vous Voulez Rediriger Vers le Domaine

```nginx
# Bloc default - redirige vers le domaine principal
server {
    listen 80 default_server;
    server_name _;
    
    # Rediriger vers le domaine principal
    return 301 http://cartagespa.com$request_uri;
}
```

**Avantages** :
- ✅ Force l'utilisation du domaine
- ✅ Meilleur pour le SEO
- ✅ Évite l'accès direct par IP

---

## ✅ Alternative : Bloc Default avec Message

### Si Vous Voulez Informer l'Utilisateur

```nginx
# Bloc default - message informatif
server {
    listen 80 default_server;
    server_name _;
    
    return 200 "This server only responds to requests for cartagespa.com";
    add_header Content-Type text/plain;
}
```

---

## 🔒 Recommandations de Sécurité

### 1. Utiliser des Server Names Spécifiques

```nginx
server_name cartagespa.com www.cartagespa.com 89.147.111.166;
```

**Ne pas utiliser** : `_` ou `*` dans le server_name principal.

### 2. Bloc Default qui Refuse

```nginx
server {
    listen 80 default_server;
    server_name _;
    return 444;
}
```

**444** = Ferme la connexion sans réponse HTTP (plus sécurisé que 403).

### 3. Headers de Sécurité

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```

### 4. Limiter les Méthodes HTTP

```nginx
if ($request_method !~ ^(GET|HEAD|POST|PUT|DELETE|OPTIONS)$ ) {
    return 405;
}
```

### 5. Masquer la Version de Nginx

```nginx
server_tokens off;
```

---

## 📊 Comparaison des Solutions

| Solution | Sécurité | Fonctionnalité | Recommandation |
|----------|----------|---------------|----------------|
| `default_server` avec `_` | ⚠️ Faible | ✅ Complète | ❌ Non recommandé |
| Bloc default avec `return 444` | ✅ Élevée | ✅ Complète | ✅ **Recommandé** |
| Redirection vers domaine | ✅ Élevée | ✅ Bonne | ✅ Bon pour SEO |
| Message informatif | ⚠️ Moyenne | ⚠️ Limitée | ⚠️ Optionnel |

---

## 🎯 Configuration Finale Recommandée

### Pour Votre Site

```nginx
# Server block principal
server {
    listen 80;
    server_name cartagespa.com www.cartagespa.com 89.147.111.166;
    
    # Frontend
    location / {
        proxy_pass http://frontend:80;
        # ... headers ...
    }
    
    # Backend API
    location /api {
        proxy_pass http://backend:8000;
        # ... headers ...
    }
    
    # Health check
    location /health {
        proxy_pass http://backend:8000/health;
    }
}

# Bloc default - refuse les autres requêtes
server {
    listen 80 default_server;
    server_name _;
    return 444;
}
```

---

## 🔍 Vérification de Sécurité

### Tester la Configuration

```bash
# Test 1: Requête avec le bon Host header
curl -H "Host: cartagespa.com" http://89.147.111.166/
# Devrait retourner : HTML du frontend

# Test 2: Requête avec Host header malveillant
curl -H "Host: evil.com" http://89.147.111.166/
# Devrait : Fermer la connexion (444) ou refuser

# Test 3: Requête sans Host header
curl http://89.147.111.166/
# Devrait : Fonctionner (car 89.147.111.166 est dans server_name)
```

---

## 📝 Notes Importantes

1. **Le bloc default avec `return 444`** est la solution la plus sécurisée
2. **Garder le server_name spécifique** pour le bloc principal
3. **Toujours tester** après modification de la configuration
4. **Documenter** les changements de sécurité

---

## 🆘 En Cas de Problème

Si après avoir ajouté le bloc default, certaines requêtes ne fonctionnent plus :

1. **Vérifiez les logs** : `docker compose logs nginx`
2. **Testez avec différents Host headers**
3. **Ajustez le server_name** si nécessaire
4. **Vérifiez que l'IP est bien dans server_name**

---

## ✅ Conclusion

**Configuration actuelle** : Bloc default avec `return 444` ✅

Cette configuration est **sécurisée** car :
- ✅ Votre site fonctionne avec le domaine et l'IP
- ✅ Les requêtes malveillantes sont refusées
- ✅ Pas d'exposition non intentionnelle

