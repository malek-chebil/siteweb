#!/bin/bash
# Script pour corriger la section dupliquée nginx-limit-req

# Créer une sauvegarde
cp /etc/fail2ban/jail.local /etc/fail2ban/jail.local.backup

# Supprimer la première section nginx-limit-req (celle avec les commentaires)
# On supprime depuis "# To use 'nginx-limit-req'" jusqu'à "[nginx-botsearch]" (exclu)
sed -i '/# To use.*nginx-limit-req/,/\[nginx-botsearch\]/{ /\[nginx-botsearch\]/!d; }' /etc/fail2ban/jail.local

# Supprimer aussi les lignes commentées avant [nginx-limit-req]
sed -i '/# To use.*nginx-limit-req/,/\[nginx-limit-req\]/{ /\[nginx-limit-req\]/!d; }' /etc/fail2ban/jail.local

# Supprimer les lignes vides en trop
sed -i '/^$/N;/^\n$/d' /etc/fail2ban/jail.local

echo "Section dupliquée supprimée !"
echo "Vérifiez avec: fail2ban-client -t"

