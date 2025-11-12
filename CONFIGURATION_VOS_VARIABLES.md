# 🔐 Configuration de vos Variables d'Environnement

## 📋 Vos Variables d'Environnement

Ce guide utilise vos valeurs réelles pour configurer Vercel et Render.

---

## 🎨 Frontend - Vercel

### Variables à Ajouter dans Vercel

1. **Allez sur**: https://vercel.com/dashboard
2. **Sélectionnez votre projet** → **Settings** → **Environment Variables**
3. **Ajoutez ces 3 variables**:

#### Variable 1: VITE_SUPABASE_URL

- **Key**: `VITE_SUPABASE_URL`
- **Value**: `https://cvtrghsdfkrwgasvnflb.supabase.co`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- **Cliquez sur "Add"**

#### Variable 2: VITE_SUPABASE_ANON_KEY

- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2dHJnaHNkZmtyd2dhc3ZuZmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Mjc3NDQsImV4cCI6MjA3ODIwMzc0NH0.EKRO_aOfDQs9EiuSyiJvl-n4n4_6zncokZJ1d4GpqiU`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- **Cliquez sur "Add"**

#### Variable 3: VITE_API_URL

- **Key**: `VITE_API_URL`
- **Value**: `https://votre-backend.onrender.com/api/v1`
  - ⚠️ **Remplacez `votre-backend.onrender.com` par l'URL de votre backend Render**
  - ⚠️ **Pour l'instant, utilisez temporairement**: `http://localhost:8000/api/v1`
  - ⚠️ **Une fois le backend déployé sur Render, mettez à jour avec l'URL Render**
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- **Cliquez sur "Add"**

### Redéployer le Frontend

#### Méthode 1: Via le Dashboard (Recommandé)

1. **Allez dans "Deployments"** (dans le menu de gauche)
2. **Trouvez le dernier déploiement** (en haut de la liste)
3. **Cliquez sur les trois points** (⋯) à côté du déploiement
4. **Cliquez sur "Redeploy"**
5. **Sélectionnez "Use existing Build Cache"** (recommandé) ou **"Redeploy"**
6. **Attendez que le déploiement soit terminé** (vous verrez "Ready" en vert)

#### Méthode 2: Via Vercel CLI

```bash
cd "C:\Users\Malek\Desktop\site Web\frontend"
vercel --prod
```

#### Vérification

1. **Visitez**: https://frontend-mocha-seven-19.vercel.app/
2. **Ouvrez la console** (F12)
3. **Vérifiez qu'il n'y a pas d'erreurs**

📚 **Guide détaillé**: Voir `REDEPLOY_VERCEL.md`

---

## 🚀 Backend - Render

### Variables à Ajouter dans Render

1. **Allez sur**: https://render.com
2. **Sélectionnez votre service backend** (ou créez-en un si pas encore fait)
3. **Cliquez sur "Environment"** → **"Environment Variables"**
4. **Ajoutez ces 6 variables**:

#### Variable 1: DATABASE_URL

- **Key**: `DATABASE_URL`
- **Value**: `postgresql+asyncpg://postgres.cvtrghsdfkrwgasvnflb:Malouka33%40%40@aws-1-eu-west-1.pooler.supabase.com:5432/postgres`
- **Cliquez sur "Save Changes"**

#### Variable 2: SUPABASE_URL

- **Key**: `SUPABASE_URL`
- **Value**: `https://cvtrghsdfkrwgasvnflb.supabase.co`
- **Cliquez sur "Save Changes"**

#### Variable 3: SUPABASE_ANON_KEY

- **Key**: `SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2dHJnaHNkZmtyd2dhc3ZuZmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Mjc3NDQsImV4cCI6MjA3ODIwMzc0NH0.EKRO_aOfDQs9EiuSyiJvl-n4n4_6zncokZJ1d4GpqiU`
- **Cliquez sur "Save Changes"**

#### Variable 4: SUPABASE_JWT_SECRET

- **Key**: `SUPABASE_JWT_SECRET`
- **Value**: `O6fBsOp9AMwPpfnSN1cj1TH0Ivzs0BFAZgiFlU+zJEiPsFyH22SR7+2e9BAdq/ENHgUycs2gpRvN5lKqGUISEg==`
- **Cliquez sur "Save Changes"**

#### Variable 5: CORS_ORIGINS ⚠️ **IMPORTANT**

- **Key**: `CORS_ORIGINS`
- **Value**: `https://frontend-mocha-seven-19.vercel.app,http://localhost:5174,http://localhost:5173,http://localhost:3000`
  - ⚠️ **Cette variable doit inclure l'URL de votre frontend Vercel**
  - ⚠️ **Format**: URLs séparées par des virgules (pas d'espaces)
  - ⚠️ **Utilisez `https://` pour la production**
- **Cliquez sur "Save Changes"**

#### Variable 6: DEBUG ⚠️ **IMPORTANT**

- **Key**: `DEBUG`
- **Value**: `false`
  - ⚠️ **Utilisez `false` en production (pas `True`)**
  - ⚠️ **Cela désactive la documentation API (`/docs`) en production**
- **Cliquez sur "Save Changes"**

### Le Backend Redéploie Automatiquement

1. **Après avoir ajouté chaque variable**, Render redéploie automatiquement
2. **Attendez que le déploiement soit terminé** (vous verrez "Live" en vert)
3. **Notez l'URL du backend** (ex: `https://carthage-wellness-backend.onrender.com`)

---

## 🔄 Mettre à Jour VITE_API_URL dans Vercel

Une fois que votre backend est déployé sur Render:

1. **Retournez dans Vercel** → **Settings** → **Environment Variables**
2. **Trouvez `VITE_API_URL`**
3. **Mettez à jour la valeur** avec l'URL de votre backend Render:
   - Exemple: `https://carthage-wellness-backend.onrender.com/api/v1`
4. **Cliquez sur "Save"**
5. **Redéployez le frontend**

---

## ✅ Checklist

### Frontend (Vercel)

- [ ] `VITE_SUPABASE_URL` ajouté: `https://cvtrghsdfkrwgasvnflb.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY` ajouté
- [ ] `VITE_API_URL` ajouté (temporairement: `http://localhost:8000/api/v1`)
- [ ] Variables configurées pour Production, Preview, Development
- [ ] Frontend redéployé
- [ ] `VITE_API_URL` mis à jour avec l'URL du backend Render (après déploiement)

### Backend (Render)

- [ ] `DATABASE_URL` ajouté (avec pooler Supabase)
- [ ] `SUPABASE_URL` ajouté: `https://cvtrghsdfkrwgasvnflb.supabase.co`
- [ ] `SUPABASE_ANON_KEY` ajouté
- [ ] `SUPABASE_JWT_SECRET` ajouté
- [ ] `CORS_ORIGINS` ajouté: `https://frontend-mocha-seven-19.vercel.app,http://localhost:5174,http://localhost:5173,http://localhost:3000`
- [ ] `DEBUG` ajouté: `false` ⚠️ **Important: utilisez `false` en production**
- [ ] Backend déployé et fonctionnel
- [ ] URL du backend notée

---

## 🔒 Sécurité

⚠️ **Important**: 

- ✅ Ne partagez JAMAIS vos variables d'environnement publiquement
- ✅ Ne commitez JAMAIS votre fichier `.env` dans Git (déjà dans `.gitignore`)
- ✅ Utilisez `DEBUG=false` en production
- ✅ Régénérez vos secrets Supabase si vous pensez qu'ils ont été compromis

---

## 📝 Notes Importantes

### DATABASE_URL

- ✅ Vous utilisez le **pooler Supabase** (`aws-1-eu-west-1.pooler.supabase.com`)
- ✅ Le mot de passe est **URL-encodé** (`Malouka33%40%40`) - c'est correct
- ✅ Le format est correct: `postgresql+asyncpg://...`

### CORS_ORIGINS

- ✅ Inclut votre frontend Vercel: `https://frontend-mocha-seven-19.vercel.app`
- ✅ Inclut les URLs locales pour le développement
- ✅ Format correct: URLs séparées par des virgules

### DEBUG

- ✅ Utilisez `false` en production (pas `True`)
- ✅ Cela désactive `/docs` et `/redoc` en production (plus sécurisé)

---

## 🆘 Problèmes Courants

### Erreur: "Database connection failed"

**Solution**: 
- Vérifiez que `DATABASE_URL` est correct
- Vérifiez que le format est `postgresql+asyncpg://...` (pas `postgresql://...`)
- Vérifiez que le mot de passe est URL-encodé (`%40` pour `@`)

### Erreur: "CORS policy"

**Solution**: 
- Vérifiez que `CORS_ORIGINS` inclut: `https://frontend-mocha-seven-19.vercel.app`
- Vérifiez que l'URL est correcte (avec `https://`)
- Vérifiez que les URLs sont séparées par des virgules (pas d'espaces)

### Erreur: "JWT verification failed"

**Solution**: 
- Vérifiez que `SUPABASE_JWT_SECRET` est correct
- Vérifiez que vous avez copié le secret complet (sans espaces)

---

## 📚 Ressources

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com
- **Frontend URL**: https://frontend-mocha-seven-19.vercel.app/
- **Supabase Dashboard**: https://supabase.com/dashboard/project/cvtrghsdfkrwgasvnflb

---

**Bon déploiement ! 🚀**

