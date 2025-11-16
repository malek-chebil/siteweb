# 🚀 Guide Complet - Déploiement 100% Gratuit (Vercel + Render)

## 📋 Vue d'Ensemble

**Frontend**: Vercel (100% gratuit) ✅
**Backend**: Render (100% gratuit) ✅
**Total**: $0/mois ✅

**Temps estimé**: 20-30 minutes

---

## Étape 1: Préparer les Fichiers (5 min)

### 1.1 Créer `frontend/vercel.json`

Créez ce fichier dans le dossier `frontend`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 1.2 Créer `backend/Procfile`

Créez ce fichier dans le dossier `backend`:

```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### 1.3 Vérifier vos Variables d'Environnement

Notez ces valeurs depuis votre fichier `.env` du backend:
- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_JWT_SECRET`

---

## Étape 2: Déployer le Frontend sur Vercel (10 min)

### 2.1 Installer Vercel CLI

Ouvrez PowerShell ou CMD et exécutez:

```bash
npm install -g vercel
```

### 2.2 Se Connecter à Vercel

```bash
vercel login
```

- Une fenêtre de navigateur s'ouvrira
- Connectez-vous avec GitHub, Google, ou email

### 2.3 Déployer le Frontend

```bash
cd frontend
vercel
```

**Répondez aux questions**:
1. **Set up and deploy?** → Appuyez sur `Entrée` (Yes)
2. **Which scope?** → Sélectionnez votre compte (Entrée)
3. **Link to existing project?** → `N` (Non)
4. **What's your project's name?** → Appuyez sur `Entrée` (nom par défaut)
5. **In which directory is your code located?** → Appuyez sur `Entrée` (./)
6. **Want to override the settings?** → `N` (Non)

**Attendez le déploiement** (1-2 minutes)

### 2.4 Noter l'URL Vercel

À la fin, vous verrez quelque chose comme:
```
✅ Production: https://your-app-name.vercel.app
```

**Notez cette URL** - vous en aurez besoin pour le backend!

---

## Étape 3: Déployer le Backend sur Render (15 min)

### 3.1 Créer un Compte Render

1. Allez sur: https://render.com
2. Cliquez sur **"Get Started for Free"**
3. Inscrivez-vous avec GitHub (recommandé) ou email

### 3.2 Créer un Nouveau Web Service

1. Dans le Dashboard, cliquez sur **"New +"**
2. Sélectionnez **"Web Service"**

### 3.3 Connecter votre Repository (Option A - Recommandé)

**Si votre code est sur GitHub**:

1. Cliquez sur **"Connect GitHub"**
2. Autorisez Render à accéder à vos repos
3. Sélectionnez votre repository
4. Cliquez sur **"Connect"**

**Si votre code n'est pas sur GitHub**:

1. Créez un compte GitHub (gratuit)
2. Créez un nouveau repository
3. Uploadez votre code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/votre-username/votre-repo.git
   git push -u origin main
   ```
4. Revenez sur Render et connectez le repo

### 3.4 Configurer le Service

Remplissez le formulaire:

- **Name**: `carthage-wellness-backend` (ou un nom de votre choix)
- **Region**: Choisissez le plus proche (ex: `Frankfurt` pour l'Europe)
- **Branch**: `main` (ou `master`)
- **Root Directory**: `backend` ⚠️ **IMPORTANT**
- **Environment**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### 3.5 Ajouter les Variables d'Environnement

Cliquez sur **"Advanced"** → **"Add Environment Variable"**

Ajoutez **une par une**:

1. **Key**: `DATABASE_URL`
   **Value**: `votre_database_url_complete`

2. **Key**: `SUPABASE_URL`
   **Value**: `https://votre-projet.supabase.co`

3. **Key**: `SUPABASE_ANON_KEY`
   **Value**: `votre_anon_key`

4. **Key**: `SUPABASE_JWT_SECRET`
   **Value**: `votre_jwt_secret`

5. **Key**: `CORS_ORIGINS`
   **Value**: `https://your-app-name.vercel.app,http://localhost:5174`
   ⚠️ Remplacez `your-app-name` par votre vraie URL Vercel!

6. **Key**: `DEBUG`
   **Value**: `false`

7. **Key**: `API_V1_PREFIX`
   **Value**: `/api/v1`

### 3.6 Choisir le Plan

- Sélectionnez **"Free"** (gratuit)
- Cliquez sur **"Create Web Service"**

### 3.7 Attendre le Déploiement

- Render va construire et déployer votre backend
- Cela prend **5-10 minutes** la première fois
- Vous pouvez voir les logs en temps réel

### 3.8 Noter l'URL Render

Une fois déployé, vous verrez:
```
Your service is live at: https://your-backend-name.onrender.com
```

**Notez cette URL** - vous en aurez besoin pour le frontend!

---

## Étape 4: Connecter Frontend et Backend (5 min)

### 4.1 Ajouter la Variable d'Environnement dans Vercel

1. Allez sur: https://vercel.com/dashboard
2. Cliquez sur votre projet
3. Allez dans **"Settings"** → **"Environment Variables"**
4. Cliquez sur **"Add New"**
5. Ajoutez:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-name.onrender.com/api/v1`
     ⚠️ Remplacez par votre vraie URL Render et ajoutez `/api/v1` à la fin!
   - **Environment**: Sélectionnez les 3 (Production, Preview, Development)
6. Cliquez sur **"Save"**

### 4.2 Redéployer le Frontend

1. Dans Vercel Dashboard, allez dans **"Deployments"**
2. Cliquez sur les **3 points** (⋯) du dernier déploiement
3. Cliquez sur **"Redeploy"**
4. Confirmez **"Redeploy"**

**Attendez 1-2 minutes** pour le redéploiement

---

## Étape 5: Tester (5 min)

### 5.1 Tester le Frontend

1. Ouvrez votre URL Vercel: `https://your-app-name.vercel.app`
2. Vérifiez que la page charge
3. Ouvrez la console du navigateur (F12)
4. Vérifiez qu'il n'y a pas d'erreurs CORS

### 5.2 Tester l'API

1. Allez sur: `https://your-backend-name.onrender.com/api/v1/listings`
2. Vous devriez voir une réponse JSON (même si vide)

### 5.3 Tester les Fonctionnalités

- [ ] Page d'accueil charge
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Recherche fonctionne
- [ ] Images s'affichent

---

## ✅ C'est Fini!

### URLs à Partager avec le Client

**Site Principal**: `https://your-app-name.vercel.app`
**Admin Panel**: `https://your-app-name.vercel.app/admin`

---

## 🔧 Problèmes Courants et Solutions

### ❌ Erreur CORS

**Symptôme**: Erreur dans la console: "CORS policy"

**Solution**:
1. Vérifiez que `CORS_ORIGINS` dans Render contient votre URL Vercel exacte
2. Vérifiez qu'il n'y a pas d'espace après la virgule
3. Redéployez le backend après modification

### ❌ API Not Found (404)

**Symptôme**: Erreur 404 quand le frontend appelle l'API

**Solution**:
1. Vérifiez que `VITE_API_URL` dans Vercel se termine par `/api/v1`
2. Vérifiez que l'URL Render est correcte
3. Redéployez le frontend après modification

### ❌ Backend Lent au Premier Démarrage

**Symptôme**: Le backend prend 30-60 secondes à répondre

**Explication**: C'est normal! Render "endort" les services gratuits après 15 min d'inactivité. Le premier démarrage après le sommeil est lent.

**Solution**:
- C'est acceptable pour une démo
- Si vous voulez éviter cela, utilisez UptimeRobot (gratuit) pour ping votre backend toutes les 5 minutes

### ❌ Images Ne Chargent Pas

**Symptôme**: Les images ne s'affichent pas

**Solution**:
1. Vérifiez que Supabase Storage est configuré
2. Vérifiez les permissions des buckets dans Supabase
3. Vérifiez que les URLs d'images sont correctes dans la console

### ❌ Erreur de Build dans Render

**Symptôme**: Le build échoue dans Render

**Solution**:
1. Vérifiez les logs dans Render
2. Vérifiez que `Root Directory` est bien `backend`
3. Vérifiez que `requirements.txt` existe dans le dossier backend
4. Vérifiez que toutes les variables d'environnement sont définies

---

## 📝 Checklist Finale

- [ ] Frontend déployé sur Vercel
- [ ] Backend déployé sur Render
- [ ] `VITE_API_URL` configuré dans Vercel
- [ ] `CORS_ORIGINS` configuré dans Render
- [ ] Frontend redéployé
- [ ] Site testé et fonctionnel
- [ ] URLs notées pour partage avec le client

---

## 🎉 Félicitations!

Votre site est maintenant en ligne et 100% gratuit!

**Coût mensuel**: $0 ✅

**Note**: Le backend Render peut être lent au premier démarrage après inactivité (30-60 secondes), mais c'est acceptable pour une démo client.

---

## 💡 Astuce: Garder Render Actif (Optionnel)

Si vous voulez éviter le "sommeil" de Render:

1. Créez un compte gratuit sur: https://uptimerobot.com
2. Ajoutez un "HTTP(s) Monitor"
3. URL: `https://your-backend-name.onrender.com/api/v1/health` (ou `/listings`)
4. Interval: 5 minutes
5. Cela gardera votre backend actif

---

## Support

Si vous rencontrez des problèmes:
1. Vérifiez les logs dans Vercel et Render
2. Vérifiez la console du navigateur (F12)
3. Vérifiez que toutes les variables d'environnement sont correctes
4. Consultez les sections "Problèmes Courants" ci-dessus

