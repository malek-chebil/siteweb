#!/bin/bash
# Script de test IPv6 pour Supabase

echo "=== Test IPv6 Configuration ==="
echo ""

# 1. Vérifier les interfaces IPv6
echo "1. Interfaces IPv6 configurées:"
if ip -6 addr show 2>/dev/null | grep -q inet6; then
    echo "   ✅ IPv6 est configuré sur le serveur"
    ip -6 addr show | grep inet6 | head -3 | sed 's/^/   /'
else
    echo "   ❌ IPv6 n'est pas configuré"
fi
echo ""

# 2. Vérifier la route IPv6
echo "2. Route IPv6 par défaut:"
if ip -6 route show default 2>/dev/null | grep -q default; then
    echo "   ✅ Route IPv6 par défaut trouvée"
    ip -6 route show default | sed 's/^/   /'
else
    echo "   ⚠️  Pas de route IPv6 par défaut"
fi
echo ""

# 3. Tester la résolution DNS IPv6
echo "3. Résolution DNS IPv6 pour Supabase:"
if nslookup -type=AAAA db.krwgasvnflb.supabase.co 2>/dev/null | grep -q "AAAA"; then
    echo "   ✅ DNS résout en IPv6"
    nslookup -type=AAAA db.krwgasvnflb.supabase.co 2>/dev/null | grep "AAAA" | sed 's/^/   /'
else
    echo "   ❌ Pas de résolution IPv6 disponible"
fi
echo ""

# 4. Tester la connexion IPv6
echo "4. Test de connexion IPv6:"
if ping6 -c 2 -W 5 db.krwgasvnflb.supabase.co 2>/dev/null > /dev/null; then
    echo "   ✅ IPv6 fonctionne - Connexion réussie"
    echo ""
    echo "🎯 RECOMMANDATION: Utilisez la connexion DIRECTE (port 5432)"
    echo "   - 20 connexions disponibles"
    echo "   - Meilleures performances"
    echo "   - Format: postgresql+asyncpg://...@...:5432/postgres"
else
    echo "   ❌ IPv6 ne fonctionne pas - Connexion échouée"
    echo ""
    echo "🎯 RECOMMANDATION: Utilisez le POOLER (port 6543)"
    echo "   - 10 connexions disponibles"
    echo "   - Compatible avec IPv4"
    echo "   - Format: postgresql+asyncpg://...@...:6543/postgres"
fi
echo ""

