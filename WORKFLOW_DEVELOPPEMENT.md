# 🔄 Workflow de Développement - Comment Faire des Changements

## 📋 Vue d'Ensemble

Ce guide explique le workflow complet pour faire des changements dans votre code et les déployer automatiquement sur Vercel (frontend) et Render (backend).

---

## 🎯 Workflow Standard (Recommandé)

### Étape 1: Faire des Changements Locaux

1. **Ouvrez votre éditeur** (VS Code, etc.)
2. **Faites vos modifications** dans le code
3. **Testez localement** (si nécessaire):
   - **Frontend**: `cd frontend && npm run dev`
   - **Backend**: `cd backend && uvicorn app.main:app --reload`

### Étape 2: Commiter les Changements

1. **Ouvrez PowerShell** ou **Terminal**
2. **Naviguez vers le dossier du projet**:
   ```bash
   cd "C:\Users\Malek\Desktop\site Web"
   ```
3. **Vérifiez les changements**:
   ```bash
   git status
   ```
4. **Ajoutez les fichiers modifiés**:
   ```bash
   git add .
   ```
   Ou pour ajouter des fichiers spécifiques:
   ```bash
   git add frontend/src/App.jsx
   git add backend/app/main.py
   ```
5. **Commitez les changements**:
   ```bash
   git commit -m "Description de vos changements"
   ```
   Exemples de messages de commit:
   - `"Add new feature: user profile"`
   - `"Fix CORS issue"`
   - `"Update styling"`
   - `"Fix bug in listings page"`

### Étape 3: Pousser sur GitHub

1. **Poussez les changements sur GitHub**:
   ```bash
   git push
   ```
2. **Les changements sont maintenant sur GitHub**

### Étape 4: Déploiements Automatiques

#### Frontend (Vercel)

**Si Vercel est connecté à GitHub**:
- ✅ **Vercel déploiera automatiquement** à chaque push sur GitHub
- ✅ **Vous verrez une notification** dans Vercel
- ✅ **Le déploiement prend généralement 1-2 minutes**
- ✅ **Vous pouvez voir les logs** dans Vercel Dashboard

**Si Vercel n'est pas connecté à GitHub**:
- ⚠️ **Vous devez redéployer manuellement**:
  1. Allez sur: https://vercel.com/dashboard
  2. Sélectionnez votre projet
  3. Cliquez sur "Deployments" → "..." → "Redeploy"

#### Backend (Render)

**Si Render est connecté à GitHub**:
- ✅ **Render déploiera automatiquement** à chaque push sur GitHub
- ✅ **Vous verrez une notification** dans Render
- ✅ **Le déploiement prend généralement 2-5 minutes**
- ✅ **Vous pouvez voir les logs** dans Render Dashboard

**Si Render n'est pas connecté à GitHub**:
- ⚠️ **Vous devez redéployer manuellement**:
  1. Allez sur: https://dashboard.render.com
  2. Sélectionnez votre service backend
  3. Cliquez sur "Manual Deploy" → "Clear build cache & deploy"

---

## 🔄 Workflow Détaillé

### 1. Faire des Changements

```bash
# 1. Faire des modifications dans votre éditeur
# 2. Tester localement (optionnel)
cd frontend
npm run dev

# Ou pour le backend
cd backend
uvicorn app.main:app --reload
```

### 2. Commiter les Changements

```bash
# 1. Vérifier les changements
git status

# 2. Ajouter les fichiers modifiés
git add .

# 3. Commiter avec un message descriptif
git commit -m "Description de vos changements"

# 4. Pousser sur GitHub
git push
```

### 3. Attendre les Déploiements Automatiques

- ✅ **Vercel déploiera automatiquement** le frontend (si connecté à GitHub)
- ✅ **Render déploiera automatiquement** le backend (si connecté à GitHub)
- ✅ **Vérifiez les logs** dans Vercel et Render pour confirmer les déploiements

### 4. Vérifier les Déploiements

- ✅ **Frontend**: https://frontend-mocha-seven-19.vercel.app/
- ✅ **Backend**: https://carthage-wellness-backend.onrender.com/health
- ✅ **Vérifiez que les changements sont déployés**

---

## 📝 Exemples de Workflow

### Exemple 1: Modifier le Frontend

```bash
# 1. Faire des modifications dans frontend/src/App.jsx
# 2. Tester localement
cd frontend
npm run dev

# 3. Commiter les changements
cd ..
git add frontend/src/App.jsx
git commit -m "Update App.jsx: add new feature"
git push

# 4. Vercel déploiera automatiquement (si connecté à GitHub)
# 5. Vérifier: https://frontend-mocha-seven-19.vercel.app/
```

### Exemple 2: Modifier le Backend

```bash
# 1. Faire des modifications dans backend/app/main.py
# 2. Tester localement
cd backend
uvicorn app.main:app --reload

# 3. Commiter les changements
cd ..
git add backend/app/main.py
git commit -m "Update main.py: add new endpoint"
git push

# 4. Render déploiera automatiquement (si connecté à GitHub)
# 5. Vérifier: https://carthage-wellness-backend.onrender.com/health
```

### Exemple 3: Modifier Plusieurs Fichiers

```bash
# 1. Faire des modifications dans plusieurs fichiers
# 2. Ajouter tous les fichiers modifiés
git add .

# 3. Commiter avec un message descriptif
git commit -m "Update multiple files: add new feature and fix bugs"
git push

# 4. Vercel et Render déploieront automatiquement (si connectés à GitHub)
```

---

## 🔍 Vérification des Déploiements

### Frontend (Vercel)

1. **Allez sur**: https://vercel.com/dashboard
2. **Sélectionnez votre projet**
3. **Cliquez sur "Deployments"**
4. **Vérifiez que le dernier déploiement est récent** (après votre push)
5. **Vérifiez que le statut est "Ready"** (en vert)
6. **Vérifiez les logs** pour confirmer qu'il n'y a pas d'erreurs

### Backend (Render)

1. **Allez sur**: https://dashboard.render.com
2. **Sélectionnez votre service backend**
3. **Cliquez sur "Logs"**
4. **Vérifiez que le dernier déploiement est récent** (après votre push)
5. **Vérifiez que le statut est "Live"** (en vert)
6. **Vérifiez les logs** pour confirmer qu'il n'y a pas d'erreurs

---

## 🆘 Problèmes Courants

### Déploiement Ne Se Déclenche Pas Automatiquement

**Solution**: 
1. Vérifiez que Vercel/Render sont connectés à GitHub
2. Vérifiez que vous avez bien poussé sur GitHub (`git push`)
3. Vérifiez que le repository est correct dans Vercel/Render
4. Redéployez manuellement si nécessaire

### Erreur de Build

**Solution**: 
1. Vérifiez les logs dans Vercel/Render
2. Vérifiez que le code fonctionne localement
3. Vérifiez que toutes les dépendances sont installées
4. Vérifiez que les variables d'environnement sont correctes

### Changements Ne Sont Pas Visibles

**Solution**: 
1. Vérifiez que le déploiement est terminé (statut "Ready" ou "Live")
2. Videz le cache du navigateur (Ctrl+Shift+R)
3. Vérifiez que vous avez bien poussé les changements sur GitHub
4. Vérifiez que le bon repository est connecté dans Vercel/Render

---

## 📝 Bonnes Pratiques

### Messages de Commit

✅ **Bons messages de commit**:
- `"Add user profile page"`
- `"Fix CORS issue in backend"`
- `"Update styling for mobile"`
- `"Fix bug in listings filter"`

❌ **Mauvais messages de commit**:
- `"Update"`
- `"Fix"`
- `"Changes"`
- `"Test"`

### Fréquence des Commits

- ✅ **Commitez souvent** (après chaque fonctionnalité ou correction)
- ✅ **Commitez avant de quitter** (pour sauvegarder votre travail)
- ✅ **Commitez après avoir testé** (pour s'assurer que ça fonctionne)

### Branches Git (Optionnel)

Si vous voulez travailler sur plusieurs fonctionnalités en parallèle:

```bash
# Créer une nouvelle branche
git checkout -b feature/nouvelle-fonctionnalite

# Faire des modifications
# Commiter
git add .
git commit -m "Add new feature"
git push origin feature/nouvelle-fonctionnalite

# Revenir à la branche principale
git checkout main

# Fusionner la branche
git merge feature/nouvelle-fonctionnalite
git push
```

---

## 🔄 Workflow Rapide (Résumé)

### Changements Simples

1. **Faire des modifications** dans votre éditeur
2. **Commiter et pousser**:
   ```bash
   git add .
   git commit -m "Description des changements"
   git push
   ```
3. **Attendre les déploiements automatiques** (1-5 minutes)
4. **Vérifier** que les changements sont déployés

### Changements avec Test Local

1. **Faire des modifications** dans votre éditeur
2. **Tester localement**:
   ```bash
   cd frontend && npm run dev
   # Ou
   cd backend && uvicorn app.main:app --reload
   ```
3. **Commiter et pousser**:
   ```bash
   git add .
   git commit -m "Description des changements"
   git push
   ```
4. **Attendre les déploiements automatiques**
5. **Vérifier** que les changements sont déployés

---

## 📚 Commandes Git Utiles

### Voir l'État du Repository

```bash
git status
```

### Voir l'Historique des Commits

```bash
git log --oneline
```

### Voir les Différences

```bash
git diff
```

### Annuler des Changements

```bash
# Annuler les changements non committés
git restore fichier.js

# Annuler tous les changements non committés
git restore .
```

### Créer une Nouvelle Branche

```bash
git checkout -b nom-de-la-branche
```

### Revenir à la Branche Principale

```bash
git checkout main
```

---

## ✅ Checklist pour Chaque Changement

### Avant de Commiter

- [ ] Code testé localement (si nécessaire)
- [ ] Pas d'erreurs de syntaxe
- [ ] Pas d'erreurs de linter
- [ ] Code fonctionne correctement

### Après avoir Committé

- [ ] Changements poussés sur GitHub (`git push`)
- [ ] Déploiements automatiques déclenchés (Vercel/Render)
- [ ] Déploiements terminés (statut "Ready" ou "Live")
- [ ] Changements visibles sur le site

### Vérification

- [ ] Frontend fonctionne: https://frontend-mocha-seven-19.vercel.app/
- [ ] Backend fonctionne: https://carthage-wellness-backend.onrender.com/health
- [ ] Pas d'erreurs dans les logs
- [ ] Application fonctionne correctement

---

## 🔗 Ressources

- **GitHub Repository**: https://github.com/malek-chebil/siteweb
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com
- **Frontend URL**: https://frontend-mocha-seven-19.vercel.app/
- **Backend URL**: https://carthage-wellness-backend.onrender.com

---

## 🎯 Résumé

### Workflow Standard

1. ✅ **Faire des modifications** dans votre éditeur
2. ✅ **Commiter les changements** (`git add . && git commit -m "message"`)
3. ✅ **Pousser sur GitHub** (`git push`)
4. ✅ **Attendre les déploiements automatiques** (Vercel/Render)
5. ✅ **Vérifier** que les changements sont déployés

### Si les Déploiements Automatiques Ne Fonctionnent Pas

1. ✅ **Redéployer manuellement** dans Vercel/Render
2. ✅ **Vérifier les logs** pour identifier les problèmes
3. ✅ **Vérifier que GitHub est connecté** à Vercel/Render

---

**Workflow de développement configuré! 🚀**

