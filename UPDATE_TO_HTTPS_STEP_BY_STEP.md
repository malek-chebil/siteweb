# Guide Étape par Étape : Mise à Jour vers HTTPS

## ✅ État Actuel
- ✅ HTTPS fonctionne sur `https://cartagespa.com`
- ✅ Certificats SSL valides
- ✅ Nginx configuré et opérationnel

## 📋 Étapes à Suivre

---

## ÉTAPE 1 : Mettre à Jour Supabase

### 1.1. Site URL

1. **Aller dans Supabase Dashboard**
   - Ouvrir : https://supabase.com/dashboard
   - Se connecter à votre projet

2. **Navigation**
   - Cliquer sur **Authentication** (menu gauche)
   - Cliquer sur **URL Configuration** (sous-menu)

3. **Modifier Site URL**
   - **AVANT** : `http://cartagespa.com`
   - **APRÈS** : `https://cartagespa.com`
   - Cliquer sur **Save**

### 1.2. Redirect URLs

Dans la même page **URL Configuration** :

1. **Section "Redirect URLs"**
   - Vous devriez voir une liste d'URLs existantes

2. **Ajouter les URLs HTTPS** (garder aussi les HTTP pour localhost) :
   ```
   https://cartagespa.com/auth/callback
   https://cartagespa.com/**
   https://www.cartagespa.com/auth/callback
   https://www.cartagespa.com/**
   ```

3. **URLs à garder** (pour développement local) :
   ```
   http://localhost:5173/auth/callback
   http://localhost:5173/**
   http://localhost:5174/auth/callback
   http://localhost:5174/**
   ```

4. **Cliquer sur "Save"**

**Note** : Si vous avez déjà des URLs HTTP pour `cartagespa.com`, vous pouvez les remplacer par les versions HTTPS, ou les garder toutes (Supabase acceptera les deux).

---

## ÉTAPE 2 : Mettre à Jour Variables d'Environnement sur le Serveur

### 2.1. Se Connecter au Serveur

```bash
ssh -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" root@89.147.111.166
```

### 2.2. Éditer le Fichier .env

```bash
cd /root/site\ Web
nano .env
```

### 2.3. Modifier VITE_API_URL

**Trouver cette ligne :**
```bash
VITE_API_URL=http://cartagespa.com/api/v1
```

**Remplacer par :**
```bash
VITE_API_URL=https://cartagespa.com/api/v1
```

### 2.4. Modifier CORS_ORIGINS

**Trouver cette ligne (si elle existe) :**
```bash
CORS_ORIGINS=http://cartagespa.com,http://www.cartagespa.com,http://localhost:5173,http://localhost:5174
```

**Remplacer par :**
```bash
CORS_ORIGINS=https://cartagespa.com,https://www.cartagespa.com,http://localhost:5173,http://localhost:5174
```

**Note** : Si `CORS_ORIGINS` n'existe pas dans `.env`, elle utilisera la valeur par défaut de `docker-compose.yml`. Vous pouvez l'ajouter pour plus de clarté.

### 2.5. Sauvegarder et Quitter

- **Sauvegarder** : `Ctrl+O`, puis `Enter`
- **Quitter** : `Ctrl+X`

### 2.6. Vérifier les Modifications

```bash
grep -E "(VITE_API_URL|CORS_ORIGINS)" .env
```

Vous devriez voir :
```
VITE_API_URL=https://cartagespa.com/api/v1
CORS_ORIGINS=https://cartagespa.com,https://www.cartagespa.com,http://localhost:5173,http://localhost:5174
```

---

## ÉTAPE 3 : Mettre à Jour docker-compose.yml (si nécessaire)

### 3.1. Vérifier la Valeur par Défaut de CORS_ORIGINS

```bash
grep CORS_ORIGINS docker-compose.yml
```

Si vous voyez encore `http://cartagespa.com` dans la valeur par défaut, vous pouvez la mettre à jour (optionnel, car `.env` prendra le dessus).

### 3.2. Mettre à Jour docker-compose.yml (optionnel)

```bash
nano docker-compose.yml
```

**Trouver :**
```yaml
- CORS_ORIGINS=${CORS_ORIGINS:-http://cartagespa.com,http://www.cartagespa.com,http://localhost:5173,http://localhost:5174}
```

**Remplacer par :**
```yaml
- CORS_ORIGINS=${CORS_ORIGINS:-https://cartagespa.com,https://www.cartagespa.com,http://localhost:5173,http://localhost:5174}
```

**Sauvegarder** : `Ctrl+O`, `Enter`, `Ctrl+X`

---

## ÉTAPE 4 : Rebuild Frontend

### 4.1. Rebuild avec les Nouvelles Variables

```bash
cd /root/site\ Web
docker compose build frontend
```

**Cela peut prendre 2-3 minutes.**

### 4.2. Redémarrer le Frontend

```bash
docker compose up -d frontend
```

### 4.3. Vérifier les Logs

```bash
docker compose logs frontend --tail 20
```

Vous devriez voir que le frontend démarre correctement.

---

## ÉTAPE 5 : Redémarrer le Backend (si CORS_ORIGINS modifié)

### 5.1. Redémarrer le Backend

```bash
docker compose restart backend
```

### 5.2. Vérifier les Logs

```bash
docker compose logs backend --tail 20
```

---

## ÉTAPE 6 : Tests Finaux

### 6.1. Test HTTPS dans le Navigateur

1. Ouvrir : `https://cartagespa.com`
2. Vérifier :
   - ✅ Cadenas vert visible
   - ✅ Pas d'avertissement de sécurité
   - ✅ Site se charge correctement

### 6.2. Test Redirection HTTP → HTTPS

1. Ouvrir : `http://cartagespa.com`
2. Vérifier :
   - ✅ Redirection automatique vers `https://cartagespa.com`

### 6.3. Test Authentification Google

1. Cliquer sur "Se connecter avec Google"
2. Vérifier :
   - ✅ Redirection vers Google fonctionne
   - ✅ Retour vers `https://cartagespa.com/auth/callback` fonctionne
   - ✅ Connexion réussie

### 6.4. Test API depuis le Frontend

1. Ouvrir la console du navigateur (F12)
2. Aller sur une page qui fait des appels API
3. Vérifier :
   - ✅ Pas d'erreurs CORS
   - ✅ Les requêtes utilisent `https://cartagespa.com/api/v1`
   - ✅ Les réponses sont reçues correctement

### 6.5. Test depuis le Serveur (optionnel)

```bash
# Test HTTPS
curl -I https://cartagespa.com

# Test API
curl -I https://cartagespa.com/api/v1/health

# Test redirection HTTP → HTTPS
curl -I http://cartagespa.com
# Devrait retourner : HTTP/1.1 301 Moved Permanently
```

---

## ✅ Checklist Finale

- [ ] Supabase Site URL mis à jour vers HTTPS
- [ ] Supabase Redirect URLs mis à jour vers HTTPS
- [ ] `VITE_API_URL` mis à jour vers HTTPS dans `.env`
- [ ] `CORS_ORIGINS` mis à jour pour inclure HTTPS dans `.env`
- [ ] Frontend rebuild avec nouvelles variables
- [ ] Backend redémarré (si CORS modifié)
- [ ] Test HTTPS dans le navigateur : ✅
- [ ] Test redirection HTTP → HTTPS : ✅
- [ ] Test authentification Google : ✅
- [ ] Test API depuis le frontend : ✅

---

## 🎉 Félicitations !

Votre application est maintenant complètement migrée vers HTTPS !

**Prochaines améliorations possibles :**
- Configurer fail2ban pour protection DDoS
- Mettre en place des backups automatiques
- Configurer un monitoring (Uptime Robot)
- Optimiser les performances (CDN, cache)

---

## 🆘 En Cas de Problème

### Problème : Erreur CORS après mise à jour

**Solution :**
1. Vérifier que `CORS_ORIGINS` dans `.env` inclut `https://cartagespa.com`
2. Redémarrer le backend : `docker compose restart backend`
3. Vérifier les logs : `docker compose logs backend --tail 50`

### Problème : Authentification Google ne fonctionne pas

**Solution :**
1. Vérifier que les Redirect URLs dans Supabase incluent `https://cartagespa.com/auth/callback`
2. Vérifier que Site URL est `https://cartagespa.com`
3. Vider le cache du navigateur et réessayer

### Problème : Frontend utilise encore HTTP pour les appels API

**Solution :**
1. Vérifier que `VITE_API_URL` dans `.env` est bien `https://cartagespa.com/api/v1`
2. Rebuild le frontend : `docker compose build frontend`
3. Redémarrer : `docker compose up -d frontend`

