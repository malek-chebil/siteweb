# 📋 Variables d'Environnement - Copier/Coller

## 🎯 Variables à Copier/Coller

Ce guide contient **toutes les variables d'environnement** prêtes à copier/coller dans Vercel et Render.

---

## 🎨 Frontend - Vercel (3 variables)

### Variable 1: VITE_SUPABASE_URL

**Key**: `VITE_SUPABASE_URL`

**Value**:
```
https://cvtrghsdfkrwgasvnflb.supabase.co
```

**Environments**: Production, Preview, Development

---

### Variable 2: VITE_SUPABASE_ANON_KEY

**Key**: `VITE_SUPABASE_ANON_KEY`

**Value**:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2dHJnaHNkZmtyd2dhc3ZuZmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Mjc3NDQsImV4cCI6MjA3ODIwMzc0NH0.EKRO_aOfDQs9EiuSyiJvl-n4n4_6zncokZJ1d4GpqiU
```

**Environments**: Production, Preview, Development

---

### Variable 3: VITE_API_URL ⚠️ **IMPORTANT**

**Key**: `VITE_API_URL`

**Value**:
```
https://carthage-wellness-backend.onrender.com/api/v1
```

**Environments**: Production, Preview, Development

⚠️ **IMPORTANT**: Utilisez cette valeur exacte (pas `http://localhost:8000/api/v1`!)

---

## 🚀 Backend - Render (6 variables)

### Variable 1: DATABASE_URL

**Key**: `DATABASE_URL`

**Value**:
```
postgresql+asyncpg://postgres.cvtrghsdfkrwgasvnflb:Malouka33%40%40@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
```

---

### Variable 2: SUPABASE_URL

**Key**: `SUPABASE_URL`

**Value**:
```
https://cvtrghsdfkrwgasvnflb.supabase.co
```

---

### Variable 3: SUPABASE_ANON_KEY

**Key**: `SUPABASE_ANON_KEY`

**Value**:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2dHJnaHNkZmtyd2dhc3ZuZmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Mjc3NDQsImV4cCI6MjA3ODIwMzc0NH0.EKRO_aOfDQs9EiuSyiJvl-n4n4_6zncokZJ1d4GpqiU
```

---

### Variable 4: SUPABASE_JWT_SECRET

**Key**: `SUPABASE_JWT_SECRET`

**Value**:
```
O6fBsOp9AMwPpfnSN1cj1TH0Ivzs0BFAZgiFlU+zJEiPsFyH22SR7+2e9BAdq/ENHgUycs2gpRvN5lKqGUISEg==
```

---

### Variable 5: CORS_ORIGINS ⚠️ **IMPORTANT**

**Key**: `CORS_ORIGINS`

**Value**:
```
https://frontend-mocha-seven-19.vercel.app,http://localhost:5174,http://localhost:5173,http://localhost:3000
```

⚠️ **IMPORTANT**: 
- Inclut l'URL de votre frontend Vercel
- Format: URLs séparées par des virgules (pas d'espaces)
- Utilisez `https://` pour la production

---

### Variable 6: DEBUG

**Key**: `DEBUG`

**Value**:
```
false
```

⚠️ **IMPORTANT**: Utilisez `false` en production (pas `True` ou `true`!)

---

## 📋 Checklist Rapide

### Frontend (Vercel)

- [ ] `VITE_SUPABASE_URL` = `https://cvtrghsdfkrwgasvnflb.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY` = (copié ci-dessus)
- [ ] `VITE_API_URL` = `https://carthage-wellness-backend.onrender.com/api/v1`
- [ ] Variables configurées pour Production, Preview, Development
- [ ] Frontend redéployé

### Backend (Render)

- [ ] `DATABASE_URL` = (copié ci-dessus)
- [ ] `SUPABASE_URL` = `https://cvtrghsdfkrwgasvnflb.supabase.co`
- [ ] `SUPABASE_ANON_KEY` = (copié ci-dessus)
- [ ] `SUPABASE_JWT_SECRET` = (copié ci-dessus)
- [ ] `CORS_ORIGINS` = `https://frontend-mocha-seven-19.vercel.app,http://localhost:5174,http://localhost:5173,http://localhost:3000`
- [ ] `DEBUG` = `false`
- [ ] Backend déployé et fonctionnel

---

## 🔗 URLs

### Frontend
- **URL Vercel**: https://frontend-mocha-seven-19.vercel.app/

### Backend
- **URL Render**: https://carthage-wellness-backend.onrender.com
- **Health Check**: https://carthage-wellness-backend.onrender.com/health
- **API Base**: https://carthage-wellness-backend.onrender.com/api/v1

---

## ✅ Résumé

### Frontend (Vercel) - 3 variables

1. `VITE_SUPABASE_URL`
2. `VITE_SUPABASE_ANON_KEY`
3. `VITE_API_URL` = `https://carthage-wellness-backend.onrender.com/api/v1`

### Backend (Render) - 6 variables

1. `DATABASE_URL`
2. `SUPABASE_URL`
3. `SUPABASE_ANON_KEY`
4. `SUPABASE_JWT_SECRET`
5. `CORS_ORIGINS` = `https://frontend-mocha-seven-19.vercel.app,http://localhost:5174,http://localhost:5173,http://localhost:3000`
6. `DEBUG` = `false`

---

**Toutes les variables prêtes à copier/coller! 🚀**

