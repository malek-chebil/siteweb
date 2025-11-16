# 🔧 Fix : Configuration Sécurité Supabase (CORS)

## 🚨 Problème

**Erreur CORS** : Les requêtes depuis `http://localhost:5173` sont bloquées.

**Cause possible** : Configuration de sécurité dans Supabase Dashboard qui bloque les requêtes.

---

## ✅ Solution : Vérifier la Configuration Supabase

### ÉTAPE 1 : Vérifier les Settings API

**Dans Supabase Dashboard** :

1. **Aller dans Settings** → **API**
2. **Vérifier** :
   - **Project URL** : Doit être votre URL Supabase
   - **anon public key** : Doit être correcte
   - **service_role key** : Ne pas exposer publiquement

---

### ÉTAPE 2 : Vérifier les Settings Auth

**Dans Supabase Dashboard** :

1. **Aller dans Settings** → **Auth**
2. **Vérifier "Site URL"** :
   - Doit être : `http://localhost:5173` (pour le développement local)
   - **OU** : `https://cartagespa.com` (pour la production)

3. **Vérifier "Redirect URLs"** :
   - Ajouter : `http://localhost:5173/**`
   - Ajouter : `http://localhost:5173/auth/callback`
   - Ajouter : `https://cartagespa.com/**` (pour la production)
   - Ajouter : `https://cartagespa.com/auth/callback` (pour la production)

---

### ÉTAPE 3 : Vérifier les RLS (Row Level Security) Policies

**Dans Supabase Dashboard** :

1. **Aller dans Authentication** → **Policies**
2. **Vérifier les tables** :
   - `listings` : Doit avoir des policies pour permettre la lecture publique
   - `users` : Doit avoir des policies appropriées
   - `listing_media` : Doit avoir des policies pour permettre l'accès

**Exemple de Policy pour `listings` (lecture publique)** :

```sql
-- Allow public read access to approved listings
CREATE POLICY "Public can view approved listings"
ON listings
FOR SELECT
USING (status = 'approved');
```

---

### ÉTAPE 4 : Vérifier les CORS Headers (Si Configuré)

**Dans Supabase Dashboard** :

1. **Aller dans Settings** → **API**
2. **Vérifier "CORS"** (si disponible) :
   - Ajouter : `http://localhost:5173`
   - Ajouter : `https://cartagespa.com`

**Note** : Supabase gère généralement CORS automatiquement, mais vérifiez si cette option existe.

---

## 🔍 Configuration Recommandée

### Settings → Auth

**Site URL** :
```
http://localhost:5173
```

**Redirect URLs** :
```
http://localhost:5173/**
http://localhost:5173/auth/callback
https://cartagespa.com/**
https://cartagespa.com/auth/callback
```

### Settings → API

**Project URL** : Votre URL Supabase (ex: `https://xxxxx.supabase.co`)

**API Keys** :
- `anon public` : Utilisée par le frontend
- `service_role` : Ne jamais exposer publiquement

---

## 🆘 Vérifications Supplémentaires

### Vérifier les Logs Supabase

**Dans Supabase Dashboard** :

1. **Aller dans Logs** → **API Logs**
2. **Vérifier les erreurs** :
   - Erreurs 401 (Unauthorized) → Problème d'authentification
   - Erreurs 403 (Forbidden) → Problème de RLS policies
   - Erreurs CORS → Problème de configuration CORS

### Vérifier les RLS Policies

**Pour la table `listings`** :

```sql
-- Vérifier les policies existantes
SELECT * FROM pg_policies WHERE tablename = 'listings';

-- Si aucune policy pour SELECT, créer :
CREATE POLICY "Public can view approved listings"
ON listings
FOR SELECT
USING (status = 'approved');
```

---

## 📋 Checklist

- [ ] **Site URL** configuré : `http://localhost:5173`
- [ ] **Redirect URLs** incluent : `http://localhost:5173/**`
- [ ] **RLS Policies** configurées pour permettre la lecture publique
- [ ] **API Keys** correctes dans le frontend
- [ ] **Logs Supabase** vérifiés (pas d'erreurs 401/403)

---

## 🎯 Action Immédiate

**1. Vérifier Settings → Auth** :

- **Site URL** : `http://localhost:5173`
- **Redirect URLs** : Ajouter `http://localhost:5173/**`

**2. Vérifier les RLS Policies** :

- Table `listings` : Doit avoir une policy pour SELECT (lecture publique)

**3. Vérifier les Logs** :

- Aller dans **Logs** → **API Logs**
- Vérifier les erreurs récentes

---

## 🔗 Liens Utiles

- **Supabase Dashboard** : https://app.supabase.com
- **Documentation RLS** : https://supabase.com/docs/guides/auth/row-level-security
- **Documentation Auth** : https://supabase.com/docs/guides/auth

---

**Après avoir vérifié ces paramètres, redémarrez le frontend et testez à nouveau !** ✅

