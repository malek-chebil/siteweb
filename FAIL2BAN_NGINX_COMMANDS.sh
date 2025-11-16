#!/bin/bash
# Commandes pour configurer la protection Nginx avec fail2ban

# 4.1. Créer les filtres
mkdir -p /etc/fail2ban/filter.d

# Créer le filtre Nginx général
cat > /etc/fail2ban/filter.d/nginx-limit-req.conf << 'EOF'
[Definition]
failregex = ^<HOST> -.*- .*HTTP/.*" (4\d{2}|5\d{2}) .*$
            ^<HOST> -.*- .*HTTP/.*" (4\d{2}|5\d{2}) .*" ".*"$
ignoreregex =
EOF

# Créer le filtre Nginx API
cat > /etc/fail2ban/filter.d/nginx-api.conf << 'EOF'
[Definition]
failregex = ^<HOST> -.*- .*" (GET|POST|PUT|DELETE) /api/.*" (4\d{2}|5\d{2}) .*$
            ^<HOST> -.*- .*" (GET|POST|PUT|DELETE) /api/.*" (4\d{2}|5\d{2}) .*" ".*"$
ignoreregex =
EOF

echo "Filtres créés avec succès !"

