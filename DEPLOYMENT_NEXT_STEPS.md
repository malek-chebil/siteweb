# 🚀 Prochaines Étapes de Déploiement

## ✅ État Actuel

- ✅ Repository Git initialisé
- ✅ Code poussé sur GitHub : https://github.com/malek-chebil/siteweb
- ✅ Conflit de dépendances résolu (recharts)
- ✅ Build local réussi

---

## 📋 Checklist de Déploiement

### Frontend (Vercel)

- [ ] Créer un compte sur https://vercel.com
- [ ] Connecter votre compte GitHub
- [ ] Importer le repository `malek-chebil/siteweb`
- [ ] Configurer :
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`
- [ ] Ajouter les variables d'environnement :
  - `VITE_API_URL` = `https://votre-backend.onrender.com/api/v1` (après le déploiement du backend)
- [ ] Déployer
- [ ] Noter l'URL du frontend (ex: `https://siteweb.vercel.app`)

### Backend (Render)

- [ ] Créer un compte sur https://render.com
- [ ] Connecter votre compte GitHub
- [ ] Créer un nouveau Web Service
- [ ] Sélectionner le repository `malek-chebil/siteweb`
- [ ] Configurer :
  - Name: `carthage-wellness-backend`
  - Region: `Frankfurt` (ou le plus proche)
  - Branch: `main`
  - Root Directory: `backend` ⚠️ **IMPORTANT**
  - Environment: `Python 3`
  - Build Command: `pip install -r requirements.txt`
  - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
  - Plan: **Free**
- [ ] Ajouter les variables d'environnement (depuis votre `.env` local) :
  ```
  DATABASE_URL=postgresql+asyncpg://...
  SUPABASE_URL=https://...
  SUPABASE_ANON_KEY=...
  SUPABASE_JWT_SECRET=...
  CORS_ORIGINS=https://votre-app.vercel.app,http://localhost:5174
  DEBUG=false
  ```
- [ ] Déployer
- [ ] Noter l'URL du backend (ex: `https://carthage-wellness-backend.onrender.com`)

### Connecter Frontend et Backend

- [ ] Dans Vercel, ajouter `VITE_API_URL` = URL du backend Render
- [ ] Dans Render, mettre à jour `CORS_ORIGINS` avec l'URL du frontend Vercel
- [ ] Redéployer le frontend
- [ ] Tester l'application

---

## 🔗 Liens Utiles

- **Repository GitHub**: https://github.com/malek-chebil/siteweb
- **Vercel**: https://vercel.com
- **Render**: https://render.com
- **Supabase**: https://supabase.com

---

## 📝 Commandes Git Utiles

### Voir l'état du repository
```bash
git status
```

### Ajouter des changements
```bash
git add .
git commit -m "Description des changements"
git push
```

### Voir l'historique
```bash
git log --oneline
```

---

## 🆘 Problèmes Courants

### Erreur de build sur Vercel
- Vérifiez que `Root Directory` est défini sur `frontend`
- Vérifiez que `Build Command` est `npm run build`
- Vérifiez que `Output Directory` est `dist`

### Erreur de build sur Render
- Vérifiez que `Root Directory` est défini sur `backend`
- Vérifiez que `Build Command` est `pip install -r requirements.txt`
- Vérifiez que `Start Command` est `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Erreur CORS
- Vérifiez que `CORS_ORIGINS` dans Render inclut l'URL du frontend Vercel
- Vérifiez que l'URL du frontend est correcte (avec `https://`)

### Erreur de connexion à la base de données
- Vérifiez que `DATABASE_URL` est correct dans Render
- Vérifiez que la base de données Supabase est accessible
- Vérifiez que les migrations sont exécutées (elles devraient l'être automatiquement)

---

## 🎉 Une fois Déployé

1. **Testez l'application** : Visitez l'URL du frontend Vercel
2. **Testez l'authentification** : Créez un compte et connectez-vous
3. **Testez les annonces** : Créez, modifiez et supprimez des annonces
4. **Testez l'admin** : Connectez-vous en tant qu'admin et testez la modération
5. **Testez sur mobile** : L'application est responsive

---

## 📚 Documentation

- **Guide de déploiement complet**: `GUIDE_DEPLOIEMENT_GRATUIT.md`
- **Guide rapide**: `DEPLOIEMENT_ETAPES_RAPIDES.md`
- **Configuration GitHub**: `CONNECT_GITHUB.md`

---

## 💡 Conseils

- **Sauvegardez vos variables d'environnement** : Gardez une copie de vos variables d'environnement dans un fichier sécurisé
- **Testez localement** : Avant de déployer, testez toujours localement
- **Surveillez les logs** : Vérifiez les logs de Vercel et Render en cas de problème
- **Mettez à jour régulièrement** : Poussez vos changements sur GitHub régulièrement

---

**Bon déploiement ! 🚀**

