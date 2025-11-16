# Clarification : Supabase Redirect URLs

## ✅ Ce qu'il faut faire

### Option 1 : Remplacer les URLs HTTP par HTTPS (Recommandé)

**Si vous avez actuellement :**
```
http://cartagespa.com/auth/callback
http://cartagespa.com/**
http://www.cartagespa.com/auth/callback
http://www.cartagespa.com/**
```

**Remplacez-les par :**
```
https://cartagespa.com/auth/callback
https://cartagespa.com/**
https://www.cartagespa.com/auth/callback
https://www.cartagespa.com/**
```

### Option 2 : Garder les deux (HTTP + HTTPS)

Vous pouvez aussi **garder les deux** (HTTP et HTTPS) :
```
http://cartagespa.com/auth/callback
http://cartagespa.com/**
https://cartagespa.com/auth/callback
https://cartagespa.com/**
http://www.cartagespa.com/auth/callback
http://www.cartagespa.com/**
https://www.cartagespa.com/auth/callback
https://www.cartagespa.com/**
```

**Avantage** : Fonctionne même si quelqu'un accède en HTTP (bien que vous redirigiez vers HTTPS)

---

## ⚠️ IMPORTANT : Garder les URLs localhost

**NE SUPPRIMEZ PAS** ces URLs (nécessaires pour le développement local) :
```
http://localhost:5173/auth/callback
http://localhost:5173/**
http://localhost:5174/auth/callback
http://localhost:5174/**
```

---

## 📋 Liste Complète Recommandée

**Voici la liste complète que vous devriez avoir :**

```
# Production HTTPS
https://cartagespa.com/auth/callback
https://cartagespa.com/**
https://www.cartagespa.com/auth/callback
https://www.cartagespa.com/**

# Production HTTP (optionnel, mais recommandé pour compatibilité)
http://cartagespa.com/auth/callback
http://cartagespa.com/**
http://www.cartagespa.com/auth/callback
http://www.cartagespa.com/**

# Développement local (OBLIGATOIRE)
http://localhost:5173/auth/callback
http://localhost:5173/**
http://localhost:5174/auth/callback
http://localhost:5174/**
```

---

## 🎯 Recommandation

**Je recommande l'Option 1** (remplacer HTTP par HTTPS) car :
- ✅ Plus sécurisé
- ✅ Plus propre
- ✅ Votre site redirige déjà HTTP → HTTPS automatiquement
- ✅ Évite la confusion

**Mais gardez absolument les URLs localhost !**

---

## ✅ Checklist

- [ ] Site URL changé vers `https://cartagespa.com`
- [ ] URLs HTTPS ajoutées pour cartagespa.com
- [ ] URLs HTTPS ajoutées pour www.cartagespa.com
- [ ] URLs localhost conservées (pour développement)
- [ ] Sauvegardé les modifications

