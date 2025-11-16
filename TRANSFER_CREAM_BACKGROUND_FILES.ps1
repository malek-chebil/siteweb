# Script PowerShell pour transférer les fichiers modifiés (fond crème) vers le serveur
# Exécutez ce script depuis le répertoire racine du projet

$SSH_KEY = "C:\Users\Malek\Desktop\config site web\1984_hosting_key"
$SERVER = "root@89.147.111.166"
$REMOTE_PATH = "/root/site Web"

Write-Host "=== Transfert des fichiers (fond crème) vers le serveur ===" -ForegroundColor Yellow
Write-Host ""

# Fonction pour transférer un fichier
function Transfer-File {
    param(
        [string]$LocalFile,
        [string]$RemoteFile
    )
    
    Write-Host "Transfert: $LocalFile" -ForegroundColor Cyan
    scp -i $SSH_KEY $LocalFile "${SERVER}:${RemoteFile}"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Succès" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Erreur" -ForegroundColor Red
    }
}

# Transférer les fichiers
Write-Host "1. CSS principal..." -ForegroundColor Yellow
Transfer-File "frontend\src\index.css" "${REMOTE_PATH}/frontend/src/index.css"

Write-Host ""
Write-Host '2. Pages d''authentification...' -ForegroundColor Yellow
Transfer-File "frontend\src\pages\LoginPage.jsx" "${REMOTE_PATH}/frontend/src/pages/LoginPage.jsx"
Transfer-File "frontend\src\pages\RegisterPage.jsx" "${REMOTE_PATH}/frontend/src/pages/RegisterPage.jsx"

Write-Host ""
Write-Host "3. Composants..." -ForegroundColor Yellow
Transfer-File "frontend\src\components\FiltersBar.jsx" "${REMOTE_PATH}/frontend/src/components/FiltersBar.jsx"
Transfer-File "frontend\src\components\ImageUploader.jsx" "${REMOTE_PATH}/frontend/src/components/ImageUploader.jsx"
Transfer-File "frontend\src\components\ListingCardList.jsx" "${REMOTE_PATH}/frontend/src/components/ListingCardList.jsx"
Transfer-File "frontend\src\components\Footer.jsx" "${REMOTE_PATH}/frontend/src/components/Footer.jsx"

Write-Host ""
Write-Host "4. Pages..." -ForegroundColor Yellow
Transfer-File "frontend\src\pages\HomePage.jsx" "${REMOTE_PATH}/frontend/src/pages/HomePage.jsx"
Transfer-File "frontend\src\pages\AdminDashboard.jsx" "${REMOTE_PATH}/frontend/src/pages/AdminDashboard.jsx"

Write-Host ""
Write-Host "5. Layouts..." -ForegroundColor Yellow
Transfer-File "frontend\src\layouts\Layout.jsx" "${REMOTE_PATH}/frontend/src/layouts/Layout.jsx"
Transfer-File "frontend\src\layouts\AdminLayout.jsx" "${REMOTE_PATH}/frontend/src/layouts/AdminLayout.jsx"

Write-Host ""
Write-Host "=== Transfert terminé ===" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes:" -ForegroundColor Yellow
Write-Host "  1. SSH sur le serveur: ssh -i `"$SSH_KEY`" $SERVER" -ForegroundColor White
Write-Host "  2. Rebuild frontend: cd /root/site Web && docker compose build frontend" -ForegroundColor White
Write-Host "  3. Redémarrer: docker compose up -d" -ForegroundColor White

