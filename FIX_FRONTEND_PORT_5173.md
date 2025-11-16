# 🔧 Fix : Changer le Port Frontend Local à 5173

## ✅ Modification Effectuée

Le port du serveur de développement frontend a été changé de **5174** à **5173** dans `frontend/vite.config.js`.

---

## 📋 Vérifications

### 1. Port Frontend Local

**Fichier** : `frontend/vite.config.js`

```javascript
server: {
  port: 5173,  // ✅ Changé de 5174 à 5173
  host: true,
}
```

### 2. Configuration CORS Backend

**Fichier** : `docker-compose.yml`

La configuration CORS inclut déjà `http://localhost:5173` :

```yaml
CORS_ORIGINS=${CORS_ORIGINS:-http://cartagespa.com,http://www.cartagespa.com,http://localhost:5173,http://localhost:5174}
```

**✅ Le port 5173 est déjà autorisé dans CORS !**

---

## 🚀 Utilisation

### Démarrer le Frontend en Local

```bash
cd frontend
npm run dev
```

Le serveur démarrera sur : **http://localhost:5173**

### Vérifier que l'API Fonctionne

1. Ouvrir : `http://localhost:5173`
2. Ouvrir la console du navigateur (F12)
3. Vérifier qu'il n'y a pas d'erreurs CORS
4. Tester une requête API (par exemple, charger les listings)

---

## 🔍 Si l'API ne Fonctionne pas

### Problème 1 : Erreur CORS

**Symptôme** : `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution** : Vérifier que `CORS_ORIGINS` inclut `http://localhost:5173`

**Sur le serveur** :
```bash
# Vérifier CORS_ORIGINS dans .env
cat /root/site\ Web/.env | grep CORS_ORIGINS

# Si manquant, ajouter dans .env
echo "CORS_ORIGINS=https://cartagespa.com,https://www.cartagespa.com,http://localhost:5173" >> /root/site\ Web/.env

# Redémarrer le backend
docker compose restart backend
```

### Problème 2 : Backend Non Accessible

**Symptôme** : `Network Error` ou `Connection refused`

**Solution** : Vérifier que le backend est accessible

**Dans `frontend/.env`** :
```env
VITE_API_URL=http://localhost:8000/api/v1
```

**OU** si le backend est sur le serveur distant :
```env
VITE_API_URL=https://cartagespa.com/api/v1
```

---

## 📝 Configuration Complète

### Frontend `.env` (Local)

```env
VITE_API_URL=http://localhost:8000/api/v1
# OU pour le serveur distant :
# VITE_API_URL=https://cartagespa.com/api/v1

VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Backend CORS (Serveur)

**Dans `.env` sur le serveur** :
```env
CORS_ORIGINS=https://cartagespa.com,https://www.cartagespa.com,http://localhost:5173
```

**OU** dans `docker-compose.yml` (valeur par défaut) :
```yaml
CORS_ORIGINS=${CORS_ORIGINS:-http://cartagespa.com,http://www.cartagespa.com,http://localhost:5173,http://localhost:5174}
```

---

## ✅ Checklist

- [x] Port frontend changé à 5173 dans `vite.config.js`
- [ ] `CORS_ORIGINS` inclut `http://localhost:5173` (déjà fait dans docker-compose.yml)
- [ ] `VITE_API_URL` configuré dans `frontend/.env`
- [ ] Backend redémarré si `CORS_ORIGINS` modifié
- [ ] Frontend testé sur `http://localhost:5173`

---

## 🎯 Prochaines Étapes

1. **Redémarrer le frontend** (si en cours d'exécution) :
   ```bash
   # Arrêter (Ctrl+C)
   # Redémarrer
   npm run dev
   ```

2. **Tester** :
   - Ouvrir : `http://localhost:5173`
   - Vérifier la console (F12)
   - Tester une requête API

3. **Si erreur CORS** :
   - Vérifier `CORS_ORIGINS` sur le serveur
   - Redémarrer le backend : `docker compose restart backend`

---

**Le port frontend local est maintenant configuré sur 5173 !** ✅

