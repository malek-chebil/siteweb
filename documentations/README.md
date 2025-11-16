# 📚 Documentation du Projet

Ce dossier contient toute la documentation et les guides de déploiement du projet, organisés par catégorie.

## 📁 Structure

```
documentations/
├── README.md                    (ce fichier)
├── frontend/                     (Documentation frontend - 8 fichiers)
│   ├── IMAGE_UPLOAD_TROUBLESHOOTING.md
│   ├── IMAGE_UPLOADER_FIX.md
│   ├── FIX_STYLES_NOT_LOADING.md
│   ├── CSS_IMPROVEMENTS.md
│   ├── MANTINE_V7_FIXES.md
│   ├── DEBUG_WHITE_PAGE.md
│   ├── FRONTEND_SETUP.md
│   └── FIX_WHITE_PAGE.md
├── backend/                      (Documentation backend - 15 fichiers)
│   ├── FIX_EMAIL_VALIDATOR.md
│   ├── SUPABASE_TIER_ISSUES.md
│   ├── PRODUCTION_CONNECTION_GUIDE.md
│   ├── FIX_CORS.md
│   ├── START_SERVER.md
│   ├── TROUBLESHOOTING_CONNECTION.md
│   ├── RESET_PASSWORD_GUIDE.md
│   ├── VERIFY_PASSWORD.md
│   ├── GET_POOLER_CONNECTION.md
│   ├── FIX_IPV4_ISSUE.md
│   ├── UPDATE_TO_POOLER.md
│   ├── CHECK_SUPABASE_STATUS.md
│   ├── VERIFY_CONNECTION_STRING.md
│   ├── FIX_DATABASE_URL.md
│   └── CONFIG_SETUP.md
└── [Fichiers racine]             (Guides généraux - ~95 fichiers)
    ├── VPS_STEP_BY_STEP.md
    ├── VPS_DEPLOYMENT_GUIDE.md
    ├── NEXT_STEP_AFTER_DOMAIN.md
    ├── DEPLOYMENT_GUIDE.md
    └── ... (autres guides)
```

## 📋 Contenu par Catégorie

### 🎨 Frontend (`frontend/`)
- Guides de configuration React/Mantine
- Solutions aux problèmes d'upload d'images
- Fixes pour les styles et CSS
- Guides de débogage

### ⚙️ Backend (`backend/`)
- Configuration de la base de données
- Guides de connexion Supabase
- Solutions aux problèmes de connexion
- Guides de configuration et dépannage

### 📖 Guides Généraux (racine)
- Guides de déploiement VPS
- Configuration de domaines et DNS
- Guides de sécurité et anonymat
- Workflow de développement
- Guides de dépannage généraux

## 🚀 Utilisation

Ces fichiers sont utiles pendant le développement et le déploiement, mais ne sont **pas nécessaires** sur le serveur de production.

## 📦 Sur le Serveur

Après le déploiement, vous pouvez :
1. **Copier ce dossier** pour référence locale
2. **Supprimer ce dossier** du serveur pour économiser de l'espace

```bash
# Sur le serveur, après déploiement
rm -rf /root/site\ Web/documentations
```

## 📝 Note

Les fichiers `README.md` dans `frontend/` et `backend/` restent dans leurs dossiers respectifs car ils sont importants pour la documentation du code.
