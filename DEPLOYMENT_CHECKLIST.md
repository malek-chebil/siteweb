# ✅ Checklist de Déploiement

## Avant de Commencer

- [ ] Toutes les fonctionnalités testées localement
- [ ] Base de données Supabase configurée
- [ ] Variables d'environnement notées
- [ ] Comptes de test créés

---

## Option A: Déploiement Rapide (ngrok) - 5 minutes

### Étapes:
1. [ ] Backend démarré sur `localhost:8000`
2. [ ] Frontend démarré sur `localhost:5174`
3. [ ] ngrok installé
4. [ ] Tunnel ngrok créé pour le frontend (port 5174)
5. [ ] URL ngrok partagée avec le client

**Commandes**:
```bash
# Terminal 1 - Backend
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - ngrok
ngrok http 5174
```

---

## Option B: Déploiement Permanent (Vercel + Railway) - 30 minutes

### Frontend (Vercel):
1. [ ] Compte Vercel créé
2. [ ] Vercel CLI installé (`npm install -g vercel`)
3. [ ] Connecté à Vercel (`vercel login`)
4. [ ] Frontend déployé (`cd frontend && vercel`)
5. [ ] URL Vercel notée: `https://________________.vercel.app`
6. [ ] Variable `VITE_API_URL` ajoutée dans Vercel (après déploiement backend)

### Backend (Railway):
1. [ ] Compte Railway créé
2. [ ] Nouveau projet créé
3. [ ] Service Python ajouté
4. [ ] Dossier `backend` sélectionné
5. [ ] Variables d'environnement ajoutées:
   - [ ] `DATABASE_URL`
   - [ ] `SUPABASE_URL`
   - [ ] `SUPABASE_ANON_KEY`
   - [ ] `SUPABASE_JWT_SECRET`
   - [ ] `CORS_ORIGINS` = `https://votre-app.vercel.app,http://localhost:5174`
   - [ ] `DEBUG` = `false`
6. [ ] Backend déployé
7. [ ] URL Railway notée: `https://________________.railway.app`
8. [ ] CORS configuré avec l'URL frontend

### Configuration Finale:
1. [ ] `VITE_API_URL` mis à jour dans Vercel avec l'URL Railway
2. [ ] Frontend redéployé
3. [ ] Test de connexion frontend ↔ backend
4. [ ] Test de toutes les fonctionnalités

---

## Variables d'Environnement Requises

### Backend (.env ou Railway):
```
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_JWT_SECRET=...
CORS_ORIGINS=https://votre-app.vercel.app,http://localhost:5174
DEBUG=false
```

### Frontend (Vercel Environment Variables):
```
VITE_API_URL=https://votre-backend.railway.app/api/v1
```

---

## Tests Post-Déploiement

- [ ] Page d'accueil charge correctement
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Création d'annonce fonctionne
- [ ] Upload d'images fonctionne
- [ ] Recherche fonctionne
- [ ] Admin panel accessible
- [ ] Images s'affichent correctement
- [ ] Responsive sur mobile

---

## URLs à Partager

**Frontend**: `https://________________.vercel.app`
**Admin Panel**: `https://________________.vercel.app/admin`

**Comptes de Test**:
- Admin: `admin@test.com` / `admin123`
- User: `user@test.com` / `user123`

---

## Problèmes Courants

### ❌ CORS Error
**Solution**: Vérifiez que l'URL frontend est dans `CORS_ORIGINS` du backend

### ❌ API Not Found (404)
**Solution**: 
- Vérifiez que `VITE_API_URL` se termine par `/api/v1`
- Vérifiez que le backend est bien déployé

### ❌ Images Not Loading
**Solution**: 
- Vérifiez les permissions Supabase Storage
- Vérifiez que les URLs d'images sont correctes

### ❌ Database Connection Error
**Solution**: 
- Vérifiez `DATABASE_URL` dans Railway
- Vérifiez que Supabase accepte les connexions externes

---

## Support

Si vous rencontrez des problèmes:
1. Vérifiez les logs dans Vercel/Railway
2. Vérifiez la console du navigateur (F12)
3. Vérifiez que toutes les variables d'environnement sont correctes
4. Consultez `DEPLOYMENT_GUIDE.md` pour plus de détails

