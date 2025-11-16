# ✅ Configuration Vercel - Frontend Déployé

## 🌐 URL du Frontend

**Frontend Vercel**: https://frontend-mocha-seven-19.vercel.app/

---

## 🔐 Variables d'Environnement à Configurer dans Vercel

### Étape 1: Ouvrir les Paramètres Vercel

1. **Allez sur**: https://vercel.com
2. **Connectez-vous** avec GitHub
3. **Sélectionnez votre projet** (probablement `frontend` ou `siteweb`)
4. **Cliquez sur "Settings"** → **"Environment Variables"**

### Étape 2: Ajouter les Variables

Vous devez ajouter ces 3 variables:

#### 1. VITE_API_URL

- **Key**: `VITE_API_URL`
- **Value**: `https://votre-backend.onrender.com/api/v1`
  - ⚠️ **Remplacez `votre-backend.onrender.com` par l'URL de votre backend Render**
  - Si vous n'avez pas encore déployé le backend, utilisez temporairement: `http://localhost:8000/api/v1`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- **Cliquez sur "Add"**

#### 2. VITE_SUPABASE_URL

- **Key**: `VITE_SUPABASE_URL`
- **Value**: Votre URL Supabase (ex: `https://xxx.supabase.co`)
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- **Cliquez sur "Add"**

#### 3. VITE_SUPABASE_ANON_KEY

- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: Votre clé anonyme Supabase
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- **Cliquez sur "Add"**

### Étape 3: Redéployer

1. **Allez dans "Deployments"**
2. **Cliquez sur les trois points** (⋯) à côté du dernier déploiement
3. **Cliquez sur "Redeploy"**
4. **Sélectionnez "Use existing Build Cache"** ou **"Redeploy"**
5. **Attendez que le déploiement soit terminé**

---

## 🚀 Configuration Backend (Render)

### Important: Mettre à jour CORS_ORIGINS

Une fois que votre frontend est déployé sur Vercel, vous devez mettre à jour `CORS_ORIGINS` dans Render pour autoriser votre frontend.

1. **Allez sur**: https://render.com
2. **Sélectionnez votre service backend**
3. **Cliquez sur "Environment"**
4. **Trouvez la variable `CORS_ORIGINS`**
5. **Mettez à jour la valeur**:
   ```
   https://frontend-mocha-seven-19.vercel.app,http://localhost:5174
   ```
6. **Cliquez sur "Save Changes"**
7. **Le backend redéploiera automatiquement**

---

## ✅ Vérification

### 1. Vérifier le Frontend

1. **Visitez**: https://frontend-mocha-seven-19.vercel.app/
2. **Ouvrez la console du navigateur** (F12)
3. **Vérifiez qu'il n'y a pas d'erreurs**:
   - ❌ Si vous voyez: `VITE_API_URL is not defined` → Les variables d'environnement ne sont pas configurées
   - ❌ Si vous voyez: `Failed to fetch` → Le backend n'est pas accessible ou CORS n'est pas configuré
   - ✅ Si tout fonctionne: Vous devriez voir la page d'accueil

### 2. Vérifier le Backend

1. **Testez l'endpoint de santé**: `https://votre-backend.onrender.com/health`
2. **Vous devriez voir**: `{"status":"ok"}`
3. **Testez l'API**: `https://votre-backend.onrender.com/api/v1/listings`

### 3. Tester l'Application

1. **Testez l'authentification**: Créez un compte ou connectez-vous
2. **Testez les annonces**: Créez, modifiez, supprimez des annonces
3. **Testez l'admin**: Si vous êtes admin, testez le panneau d'administration

---

## 🆘 Problèmes Courants

### Erreur: "VITE_API_URL is not defined"

**Solution**: 
1. Vérifiez que `VITE_API_URL` est bien définie dans Vercel
2. Vérifiez que vous avez redéployé après avoir ajouté la variable
3. Vérifiez que la variable commence par `VITE_` (nécessaire pour Vite)

### Erreur: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution**: 
1. Vérifiez que `CORS_ORIGINS` dans Render inclut: `https://frontend-mocha-seven-19.vercel.app`
2. Vérifiez que l'URL est correcte (avec `https://`)
3. Vérifiez que les URLs sont séparées par des virgules

### Erreur: "Failed to fetch" ou "Network error"

**Solution**: 
1. Vérifiez que le backend est déployé et fonctionne
2. Vérifiez que `VITE_API_URL` dans Vercel pointe vers le bon backend
3. Vérifiez que le backend est accessible (testez l'URL dans votre navigateur)

### Erreur: "Supabase connection failed"

**Solution**: 
1. Vérifiez que `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont corrects dans Vercel
2. Vérifiez que les valeurs sont identiques à celles de votre fichier `.env` local

---

## 📝 Checklist

### Frontend (Vercel)

- [ ] `VITE_API_URL` ajouté (avec l'URL du backend Render)
- [ ] `VITE_SUPABASE_URL` ajouté
- [ ] `VITE_SUPABASE_ANON_KEY` ajouté
- [ ] Variables configurées pour Production, Preview, Development
- [ ] Frontend redéployé
- [ ] Site accessible: https://frontend-mocha-seven-19.vercel.app/

### Backend (Render)

- [ ] Backend déployé sur Render
- [ ] `CORS_ORIGINS` inclut: `https://frontend-mocha-seven-19.vercel.app`
- [ ] Toutes les variables d'environnement configurées
- [ ] Backend accessible (testez `/health`)

---

## 🔄 Prochaines Étapes

1. ✅ **Configurer les variables d'environnement dans Vercel**
2. ✅ **Déployer le backend sur Render** (si pas encore fait)
3. ✅ **Mettre à jour `CORS_ORIGINS` dans Render**
4. ✅ **Tester l'application complète**
5. ✅ **Vérifier que tout fonctionne**

---

## 📚 Ressources

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables
- **Render Dashboard**: https://dashboard.render.com
- **Frontend URL**: https://frontend-mocha-seven-19.vercel.app/

---

**Bon déploiement ! 🚀**

