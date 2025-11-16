# 📤 Commandes pour Transférer les Fichiers (Fond Crème)

## Commandes SCP à Exécuter

Exécutez ces commandes **une par une** dans PowerShell depuis le répertoire racine du projet :

```powershell
# Définir les variables
$SSH_KEY = "C:\Users\Malek\Desktop\config site web\1984_hosting_key"
$SERVER = "root@89.147.111.166"
$REMOTE_PATH = "/root/site Web"

# 1. CSS principal
scp -i $SSH_KEY "frontend\src\index.css" "${SERVER}:${REMOTE_PATH}/frontend/src/index.css"

# 2. Pages d'authentification
scp -i $SSH_KEY "frontend\src\pages\LoginPage.jsx" "${SERVER}:${REMOTE_PATH}/frontend/src/pages/LoginPage.jsx"
scp -i $SSH_KEY "frontend\src\pages\RegisterPage.jsx" "${SERVER}:${REMOTE_PATH}/frontend/src/pages/RegisterPage.jsx"

# 3. Composants
scp -i $SSH_KEY "frontend\src\components\FiltersBar.jsx" "${SERVER}:${REMOTE_PATH}/frontend/src/components/FiltersBar.jsx"
scp -i $SSH_KEY "frontend\src\components\ImageUploader.jsx" "${SERVER}:${REMOTE_PATH}/frontend/src/components/ImageUploader.jsx"
scp -i $SSH_KEY "frontend\src\components\ListingCardList.jsx" "${SERVER}:${REMOTE_PATH}/frontend/src/components/ListingCardList.jsx"
scp -i $SSH_KEY "frontend\src\components\Footer.jsx" "${SERVER}:${REMOTE_PATH}/frontend/src/components/Footer.jsx"

# 4. Pages
scp -i $SSH_KEY "frontend\src\pages\HomePage.jsx" "${SERVER}:${REMOTE_PATH}/frontend/src/pages/HomePage.jsx"
scp -i $SSH_KEY "frontend\src\pages\AdminDashboard.jsx" "${SERVER}:${REMOTE_PATH}/frontend/src/pages/AdminDashboard.jsx"

# 5. Layouts
scp -i $SSH_KEY "frontend\src\layouts\Layout.jsx" "${SERVER}:${REMOTE_PATH}/frontend/src/layouts/Layout.jsx"
scp -i $SSH_KEY "frontend\src\layouts\AdminLayout.jsx" "${SERVER}:${REMOTE_PATH}/frontend/src/layouts/AdminLayout.jsx"
```

## Alternative : Utiliser le Script PowerShell

Exécutez simplement :

```powershell
.\TRANSFER_CREAM_BACKGROUND_FILES.ps1
```

## Après le Transfert

Une fois tous les fichiers transférés, connectez-vous au serveur et rebuild :

```bash
# SSH sur le serveur
ssh -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" root@89.147.111.166

# Sur le serveur
cd "/root/site Web"
docker compose build frontend
docker compose up -d
```

## Vérification

Pour vérifier que les fichiers sont bien transférés :

```bash
# Sur le serveur
ls -la "/root/site Web/frontend/src/index.css"
grep -n "faf8f3" "/root/site Web/frontend/src/index.css"
```

