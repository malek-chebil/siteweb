# 🚀 Commandes Rapides - Workflow de Développement

## 📋 Commandes Git Essentielles

### Workflow Standard (3 commandes)

```bash
# 1. Ajouter tous les fichiers modifiés
git add .

# 2. Commiter avec un message
git commit -m "Description de vos changements"

# 3. Pousser sur GitHub
git push
```

---

## 🔄 Workflow Complet

### Étape 1: Vérifier les Changements

```bash
cd "C:\Users\Malek\Desktop\site Web"
git status
```

### Étape 2: Ajouter les Fichiers Modifiés

```bash
# Ajouter tous les fichiers
git add .

# Ou ajouter des fichiers spécifiques
git add frontend/src/App.jsx
git add backend/app/main.py
```

### Étape 3: Commiter les Changements

```bash
git commit -m "Description de vos changements"
```

**Exemples de messages**:
- `"Add user profile page"`
- `"Fix CORS issue"`
- `"Update styling"`
- `"Fix bug in listings"`

### Étape 4: Pousser sur GitHub

```bash
git push
```

---

## 📝 Exemples Concrets

### Exemple 1: Modifier le Frontend

```bash
cd "C:\Users\Malek\Desktop\site Web"
git add frontend/src/App.jsx
git commit -m "Update App.jsx: add new feature"
git push
```

### Exemple 2: Modifier le Backend

```bash
cd "C:\Users\Malek\Desktop\site Web"
git add backend/app/main.py
git commit -m "Update main.py: add new endpoint"
git push
```

### Exemple 3: Modifier Plusieurs Fichiers

```bash
cd "C:\Users\Malek\Desktop\site Web"
git add .
git commit -m "Update multiple files: add new feature"
git push
```

---

## 🔍 Commandes de Vérification

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

---

## 🆘 Commandes de Dépannage

### Annuler des Changements Non Committés

```bash
# Annuler un fichier spécifique
git restore fichier.js

# Annuler tous les changements
git restore .
```

### Voir les Branches

```bash
git branch
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

## 🚀 Déploiements

### Frontend (Vercel)

**Automatique** (si connecté à GitHub):
- ✅ Déploie automatiquement à chaque `git push`
- ✅ Prend généralement 1-2 minutes

**Manuel** (si pas connecté à GitHub):
1. Allez sur: https://vercel.com/dashboard
2. Projet → Deployments → "..." → "Redeploy"

### Backend (Render)

**Automatique** (si connecté à GitHub):
- ✅ Déploie automatiquement à chaque `git push`
- ✅ Prend généralement 2-5 minutes

**Manuel** (si pas connecté à GitHub):
1. Allez sur: https://dashboard.render.com
2. Service → Manual Deploy → "Clear build cache & deploy"

---

## ✅ Checklist Rapide

### Avant de Commiter

- [ ] Code testé (si nécessaire)
- [ ] Pas d'erreurs
- [ ] Code fonctionne

### Après avoir Committé

- [ ] `git push` exécuté
- [ ] Déploiements automatiques déclenchés
- [ ] Déploiements terminés
- [ ] Changements visibles

---

## 🎯 Résumé

### Workflow Standard (3 commandes)

```bash
git add .
git commit -m "Description des changements"
git push
```

### Vérification

```bash
git status
git log --oneline
```

---

**Workflow rapide configuré! 🚀**

