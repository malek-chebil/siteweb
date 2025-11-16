# 🔧 Configurer les Redirect URLs dans Supabase

## 📋 Configuration Actuelle

Vous avez déjà : `localhost:3000`

## ✅ URLs à Ajouter

### Dans Supabase Dashboard

1. **Allez dans** : Authentication → URL Configuration
2. **Site URL** : `http://cartagespa.com`

3. **Redirect URLs** : Ajoutez ces URLs (une par ligne) :

```
http://localhost:3000/auth/callback
http://cartagespa.com/auth/callback
http://cartagespa.com/**
http://www.cartagespa.com/auth/callback
http://www.cartagespa.com/**
```

**OU** si l'interface accepte les virgules :
```
http://localhost:3000/auth/callback, http://cartagespa.com/auth/callback, http://cartagespa.com/**, http://www.cartagespa.com/auth/callback, http://www.cartagespa.com/**
```

---

## 📝 Format dans Supabase

### Option 1 : Une URL par Ligne (Recommandé)

```
http://localhost:3000/auth/callback
http://cartagespa.com/auth/callback
http://cartagespa.com/**
http://www.cartagespa.com/auth/callback
http://www.cartagespa.com/**
```

### Option 2 : Séparées par Virgule

```
http://localhost:3000/auth/callback, http://cartagespa.com/auth/callback, http://cartagespa.com/**, http://www.cartagespa.com/auth/callback, http://www.cartagespa.com/**
```

---

## 🎯 Configuration Complète

### Site URL
```
http://cartagespa.com
```

### Redirect URLs (Liste Complète)

```
http://localhost:3000/auth/callback
http://localhost:3000/**
http://cartagespa.com/auth/callback
http://cartagespa.com/**
http://www.cartagespa.com/auth/callback
http://www.cartagespa.com/**
```

**Note** : `/**` signifie "toutes les URLs sous ce chemin"

---

## 🔍 Explication des URLs

### Pourquoi Ces URLs ?

1. **`http://localhost:3000/auth/callback`**
   - Pour le développement local
   - Gardez-le si vous développez encore

2. **`http://cartagespa.com/auth/callback`**
   - URL de callback principale en production
   - Utilisée par Google Auth après authentification

3. **`http://cartagespa.com/**`**
   - Permet toutes les redirections sous ce domaine
   - Plus flexible

4. **`http://www.cartagespa.com/auth/callback`**
   - Pour le sous-domaine www
   - Si vous utilisez www.cartagespa.com

---

## ✅ Après Configuration

### Tester

1. **Dans le navigateur** : `http://cartagespa.com`
2. **Cliquez sur "Se connecter avec Google"**
3. **Vérifiez** que la redirection va vers `http://cartagespa.com/auth/callback`

### Si Ça Ne Fonctionne Pas

1. **Vérifiez les URLs dans Supabase** :
   - Sont-elles exactement comme ci-dessus ?
   - Y a-t-il des espaces ou caractères spéciaux ?

2. **Videz le cache du navigateur** :
   - Ctrl+Shift+Delete
   - Vider le cache et les cookies

3. **Vérifiez la console du navigateur** (F12) :
   - Regardez les erreurs
   - Vérifiez les requêtes réseau

---

## 🔒 Sécurité

### Bonnes Pratiques

1. **N'utilisez pas `/**` en production** si possible
   - Utilisez des URLs spécifiques
   - `/**` est pratique mais moins sécurisé

2. **Une fois HTTPS configuré** :
   - Changez toutes les URLs pour `https://`
   - Supprimez les URLs HTTP

3. **Supprimez `localhost`** une fois en production
   - Gardez-le seulement pour le développement

---

## 📝 Checklist

- [ ] Site URL configuré : `http://cartagespa.com`
- [ ] Redirect URLs ajoutées (toutes celles listées)
- [ ] Sauvegardé dans Supabase
- [ ] Testé Google Auth
- [ ] Vérifié que la redirection fonctionne

---

## 🆘 Si Rien ne Fonctionne

1. **Vérifiez l'URL exacte** dans la console du navigateur
2. **Copiez-collez l'URL exacte** dans Supabase
3. **Attendez quelques minutes** (propagation)
4. **Videz le cache** et réessayez

---

## 🎯 Configuration Finale Recommandée

### Pour la Production

**Site URL** :
```
http://cartagespa.com
```

**Redirect URLs** :
```
http://cartagespa.com/auth/callback
http://www.cartagespa.com/auth/callback
```

**Pour le Développement** (gardez aussi) :
```
http://localhost:3000/auth/callback
```

---

## 📚 Référence

- Documentation Supabase : https://supabase.com/docs/guides/auth/url-configuration
- Guide OAuth : https://supabase.com/docs/guides/auth/social-login

