# ⚡ Déploiement Rapide - Étapes Simplifiées

## 🎯 Objectif: Déployer en 20 minutes (100% Gratuit)

---

## ✅ Étape 1: Fichiers Créés (Déjà Fait!)

Les fichiers nécessaires ont été créés:
- ✅ `frontend/vercel.json`
- ✅ `backend/Procfile`

---

## 🚀 Étape 2: Frontend sur Vercel (5 min)

### Commande Rapide:
```bash
cd ;..
cd frontend
vercel login
vercel
```

**Répondez**: Entrée, Entrée, Entrée... (valeurs par défaut)

**Résultat**: URL comme `https://votre-app.vercel.app`

---

## 🔧 Étape 3: Backend sur Render (10 min)

### Actions:
1. Allez sur: https://render.com
2. **New +** → **Web Service**
3. Connectez votre repo GitHub (ou uploadez)
4. **Config**:
   - Root Directory: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Plan: **Free**
5. **Variables d'environnement** (copiez depuis votre `.env`):
   ```
   DATABASE_URL=...
   SUPABASE_URL=...
   SUPABASE_ANON_KEY=...
   SUPABASE_JWT_SECRET=...
   CORS_ORIGINS=https://votre-app.vercel.app,http://localhost:5174
   DEBUG=false
   ```
6. **Create Web Service**

**Résultat**: URL comme `https://votre-backend.onrender.com`

---

## 🔗 Étape 4: Connecter (5 min)

### Dans Vercel:
1. Dashboard → Votre projet → **Settings** → **Environment Variables**
2. Ajoutez: `VITE_API_URL` = `https://votre-backend.onrender.com/api/v1`
3. **Deployments** → **Redeploy**

---

## ✅ Étape 5: Tester

Ouvrez: `https://votre-app.vercel.app`

---

## 📋 Checklist

- [ ] Frontend déployé (Vercel)
- [ ] Backend déployé (Render)
- [ ] `VITE_API_URL` configuré
- [ ] `CORS_ORIGINS` configuré
- [ ] Frontend redéployé
- [ ] Site testé

---

## 🆘 Aide

Pour plus de détails, voir: `GUIDE_DEPLOIEMENT_GRATUIT.md`

