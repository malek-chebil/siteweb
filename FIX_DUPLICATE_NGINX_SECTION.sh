#!/bin/bash
# Script simple pour supprimer la section nginx-limit-req dupliquée

echo "Création d'une sauvegarde..."
cp /etc/fail2ban/jail.local /etc/fail2ban/jail.local.backup.$(date +%Y%m%d_%H%M%S)

echo "Suppression de la première section nginx-limit-req (avec commentaires)..."

# Supprimer depuis "# To use 'nginx-limit-req'" jusqu'à "[nginx-botsearch]" (exclu)
sed -i '/# To use.*nginx-limit-req/,/^\[nginx-botsearch\]/{ /^\[nginx-botsearch\]/!d; }' /etc/fail2ban/jail.local

# Supprimer aussi la section [nginx-limit-req] qui suit (sans enabled)
sed -i '/^\[nginx-limit-req\]$/,/^\[nginx-botsearch\]/{ 
    /^\[nginx-limit-req\]$/d
    /^\[nginx-botsearch\]/!d
}' /etc/fail2ban/jail.local

# Nettoyer les lignes vides multiples
sed -i '/^$/N;/^\n$/d' /etc/fail2ban/jail.local

echo ""
echo "Vérification..."
COUNT=$(grep -c '\[nginx-limit-req\]' /etc/fail2ban/jail.local)
echo "Nombre de sections [nginx-limit-req] trouvées: $COUNT"

if [ "$COUNT" -eq 1 ]; then
    echo "✅ Correction réussie ! Une seule section reste."
    echo ""
    echo "Testez maintenant:"
    echo "  fail2ban-client -t"
    echo "  systemctl start fail2ban"
else
    echo "⚠️  Il reste $COUNT sections. Vérifiez manuellement avec:"
    echo "  grep -n '\[nginx-limit-req\]' /etc/fail2ban/jail.local"
fi

