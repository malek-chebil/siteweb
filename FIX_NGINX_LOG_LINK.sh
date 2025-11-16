#!/bin/bash
# Script pour corriger le lien symbolique des logs Nginx

echo "Correction du lien symbolique des logs Nginx..."

# 1. Créer le répertoire de logs si nécessaire
mkdir -p /root/site\ Web/nginx/logs

# 2. Créer le fichier de log s'il n'existe pas
if [ ! -f "/root/site Web/nginx/logs/error.log" ]; then
    touch "/root/site Web/nginx/logs/error.log"
    chmod 644 "/root/site Web/nginx/logs/error.log"
    echo "✅ Fichier de log créé"
else
    echo "✅ Fichier de log existe déjà"
fi

# 3. Supprimer l'ancien lien symbolique s'il existe
if [ -L /var/log/nginx/error.log ]; then
    rm /var/log/nginx/error.log
    echo "✅ Ancien lien symbolique supprimé"
fi

# 4. Créer le répertoire /var/log/nginx si nécessaire
mkdir -p /var/log/nginx

# 5. Créer le nouveau lien symbolique
ln -sf "/root/site Web/nginx/logs/error.log" /var/log/nginx/error.log

# 6. Vérifier
if [ -f "/root/site Web/nginx/logs/error.log" ] && [ -L /var/log/nginx/error.log ]; then
    echo "✅ Lien symbolique créé avec succès"
    echo ""
    echo "Vérification:"
    ls -la /var/log/nginx/error.log
    echo ""
    echo "Testez maintenant:"
    echo "  systemctl start fail2ban"
    echo "  fail2ban-client status"
else
    echo "❌ Erreur lors de la création du lien"
    exit 1
fi

