#!/bin/bash
# Script pour ajouter les jails Nginx à jail.local

echo "Ajout des jails Nginx..."

# Vérifier si les jails existent déjà
if grep -q "^\[nginx-limit-req\]" /etc/fail2ban/jail.local; then
    echo "⚠️  Les jails Nginx existent déjà !"
    exit 1
fi

# Ajouter les jails à la fin du fichier
cat >> /etc/fail2ban/jail.local << 'EOF'

# Nginx - Protection générale
[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
bantime = 3600
findtime = 300

# Nginx - Protection API
[nginx-api]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
filter = nginx-api
maxretry = 20
bantime = 1800
findtime = 300
EOF

echo "✅ Jails Nginx ajoutés !"
echo ""
echo "Testez maintenant:"
echo "  fail2ban-client -t"
echo "  systemctl restart fail2ban"
echo "  fail2ban-client status"

