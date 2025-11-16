# 📋 Configuration Supabase - Étapes Détaillées

## 🎯 Où Ajouter les URLs

### ÉTAPE 1 : Modifier le Site URL

1. **Dans la section "Site URL"** (en haut de la page)
2. **Remplacez** : `http://localhost:3000`
3. **Par** : `http://cartagespa.com`
4. **Cliquez sur** : Le bouton vert **"Save changes"**

---

### ÉTAPE 2 : Ajouter les Redirect URLs

1. **Dans la section "Redirect URLs"** (en bas de la page)
2. **Cliquez sur** : Le bouton vert **"Add URL"**
3. **Ajoutez chaque URL une par une** :

#### URL 1
```
http://cartagespa.com/auth/callback
```
Cliquez sur "Add" ou "Save"

#### URL 2
```
http://cartagespa.com/**
```
Cliquez sur "Add" ou "Save"

#### URL 3
```
http://www.cartagespa.com/auth/callback
```
Cliquez sur "Add" ou "Save"

#### URL 4
```
http://www.cartagespa.com/**
```
Cliquez sur "Add" ou "Save"

---

## 📝 Liste Complète des URLs

### Site URL
```
http://cartagespa.com
```

### Redirect URLs (à avoir dans la liste)

```
http://localhost:5174/auth/callback  (gardez celui que vous avez déjà)
http://cartagespa.com/auth/callback
http://cartagespa.com/**
http://www.cartagespa.com/auth/callback
http://www.cartagespa.com/**
```

**Total** : 5 URLs dans la liste

---

## ✅ Après Configuration

### Vérification

1. **Site URL** doit être : `http://cartagespa.com`
2. **Redirect URLs** doit contenir toutes les URLs listées ci-dessus
3. **Cliquez sur "Save changes"** si nécessaire

### Test

1. Allez sur : `http://cartagespa.com`
2. Cliquez sur "Se connecter avec Google"
3. Vérifiez que la redirection va vers : `http://cartagespa.com/auth/callback`

---

## 🎯 Résumé Visuel

```
┌─────────────────────────────────────┐
│ URL Configuration                   │
├─────────────────────────────────────┤
│ Site URL                            │
│ [http://cartagespa.com        ]     │
│ [Save changes]                      │
├─────────────────────────────────────┤
│ Redirect URLs                       │
│ [Add URL]                           │
│                                     │
│ ☐ http://localhost:5174/auth/...   │
│ ☐ http://cartagespa.com/auth/...   │ ← Ajoutez
│ ☐ http://cartagespa.com/**         │ ← Ajoutez
│ ☐ http://www.cartagespa.com/auth/..│ ← Ajoutez
│ ☐ http://www.cartagespa.com/**     │ ← Ajoutez
│                                     │
│ Total URLs: 5                       │
└─────────────────────────────────────┘
```

---

## 📝 Notes

- **Une URL à la fois** : Cliquez sur "Add URL" pour chaque nouvelle URL
- **Gardez localhost** : Pour le développement local
- **Sauvegardez** : Les changements sont automatiques ou cliquez sur "Save"

---

## 🆘 Si Vous Ne Voyez Pas le Bouton "Add URL"

1. **Vérifiez que vous êtes dans** : Authentication → URL Configuration
2. **Scroll vers le bas** : Le bouton est en bas de la section "Redirect URLs"
3. **Vérifiez les permissions** : Vous devez être admin du projet

---

## ✅ Checklist

- [ ] Site URL changé : `http://cartagespa.com`
- [ ] "Save changes" cliqué pour Site URL
- [ ] "Add URL" cliqué
- [ ] `http://cartagespa.com/auth/callback` ajouté
- [ ] "Add URL" cliqué à nouveau
- [ ] `http://cartagespa.com/**` ajouté
- [ ] "Add URL" cliqué à nouveau
- [ ] `http://www.cartagespa.com/auth/callback` ajouté
- [ ] "Add URL" cliqué à nouveau
- [ ] `http://www.cartagespa.com/**` ajouté
- [ ] Total : 5 URLs dans la liste

