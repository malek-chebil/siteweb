# 🔄 Réinitialiser Toutes les Vues et Statistiques

## 📋 Ce Qui Sera Réinitialisé

1. **Vues des listings** (`views_count` dans la table `listings`)
2. **Statistiques de sécurité** (logs de sécurité)
3. **Statistiques de visites frontend** (cookies - instructions pour les utilisateurs)

---

## 🗄️ Réinitialiser les Vues des Listings (Base de Données)

### Méthode 1 : Via SQL Direct (Recommandé)

**Sur le serveur (via SSH)** :

```bash
# Se connecter à la base de données Supabase
# Vous aurez besoin de votre DATABASE_URL depuis .env
```

**OU** via Supabase Dashboard :

1. **Allez dans** Supabase Dashboard
2. **Cliquez sur** SQL Editor
3. **Exécutez cette requête** :

```sql
-- Réinitialiser toutes les vues des listings à 0
UPDATE listings 
SET views_count = 0;
```

**Pour vérifier** :
```sql
-- Vérifier que toutes les vues sont à 0
SELECT id, title, views_count 
FROM listings 
ORDER BY views_count DESC 
LIMIT 10;
```

---

### Méthode 2 : Via Script Python (Backend)

**Créez un script de réinitialisation** :

```bash
cd "/root/site Web/backend"
nano reset_views.py
```

**Collez ce code** :

```python
import asyncio
from sqlalchemy import update
from app.database import async_session_maker
from app.models import Listing

async def reset_all_views():
    """Réinitialiser toutes les vues des listings à 0."""
    async with async_session_maker() as session:
        try:
            # Réinitialiser toutes les vues
            result = await session.execute(
                update(Listing).values(views_count=0)
            )
            await session.commit()
            print(f"✅ {result.rowcount} listings réinitialisés")
        except Exception as e:
            await session.rollback()
            print(f"❌ Erreur: {e}")
        finally:
            await session.close()

if __name__ == "__main__":
    asyncio.run(reset_all_views())
```

**Exécutez le script** :

```bash
# Activer l'environnement virtuel si nécessaire
source venv/bin/activate  # ou python3 -m venv venv && source venv/bin/activate

# Installer les dépendances si nécessaire
pip install sqlalchemy asyncpg

# Exécuter le script
python reset_views.py
```

---

### Méthode 3 : Via API Admin (Si Disponible)

**Si vous avez un endpoint admin pour réinitialiser les vues**, vous pouvez l'utiliser :

```bash
# Exemple (à adapter selon votre API)
curl -X POST http://cartagespa.com/api/v1/admin/reset-views \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Note** : Cet endpoint n'existe probablement pas encore. Vous pouvez l'ajouter si nécessaire.

---

## 🔒 Réinitialiser les Statistiques de Sécurité

**Les statistiques de sécurité sont stockées dans des fichiers de logs.**

**Sur le serveur** :

```bash
cd "/root/site Web/backend"

# Vérifier les fichiers de logs
ls -la logs/

# Supprimer les logs de sécurité (optionnel)
# ATTENTION : Cela supprimera tous les logs de sécurité
rm -f logs/security_*.log

# OU vider les fichiers sans les supprimer
truncate -s 0 logs/security_*.log
```

**OU** via Python (si vous avez un endpoint) :

```python
from app.utils.monitoring import reset_security_stats

# Réinitialiser toutes les statistiques de sécurité
reset_security_stats()
```

---

## 🍪 Réinitialiser les Statistiques de Visites Frontend (Cookies)

**Les statistiques de visites sont stockées dans les cookies du navigateur.**

### Pour les Utilisateurs

**Dans le navigateur** :

1. **Ouvrez la console** (F12)
2. **Onglet Console**
3. **Tapez** :

```javascript
// Réinitialiser les statistiques de visites
document.cookie = "visit_count=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
document.cookie = "first_visit=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
document.cookie = "last_visit=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
document.cookie = "daily_visits=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
console.log("✅ Statistiques de visites réinitialisées");
```

**OU** via les paramètres du navigateur :

1. **Chrome/Edge** : Paramètres → Confidentialité → Effacer les données de navigation → Cookies
2. **Firefox** : Paramètres → Vie privée → Cookies → Supprimer les cookies

---

## 📝 Script SQL Complet

**Pour réinitialiser tout en une fois** :

```sql
-- Réinitialiser toutes les vues des listings
UPDATE listings 
SET views_count = 0;

-- Vérifier le résultat
SELECT 
    COUNT(*) as total_listings,
    SUM(views_count) as total_views,
    AVG(views_count) as avg_views
FROM listings;
```

---

## 🎯 Script de Réinitialisation Automatique

**Créez un script bash pour tout réinitialiser** :

```bash
cd "/root/site Web"
nano reset_all_stats.sh
```

**Collez ce code** :

```bash
#!/bin/bash

echo "🔄 Réinitialisation de toutes les vues et statistiques..."

# 1. Réinitialiser les vues dans la base de données
echo "📊 Réinitialisation des vues des listings..."
docker compose exec backend python -c "
import asyncio
from sqlalchemy import update
from app.database import async_session_maker
from app.models import Listing

async def reset_views():
    async with async_session_maker() as session:
        try:
            result = await session.execute(
                update(Listing).values(views_count=0)
            )
            await session.commit()
            print(f'✅ {result.rowcount} listings réinitialisés')
        except Exception as e:
            await session.rollback()
            print(f'❌ Erreur: {e}')
        finally:
            await session.close()

asyncio.run(reset_views())
"

# 2. Réinitialiser les logs de sécurité (optionnel)
echo "🔒 Nettoyage des logs de sécurité..."
docker compose exec backend sh -c "truncate -s 0 logs/security_*.log 2>/dev/null || echo 'Aucun log de sécurité trouvé'"

echo "✅ Réinitialisation terminée!"
echo ""
echo "📝 Note: Les statistiques de visites frontend (cookies) doivent être réinitialisées"
echo "   manuellement dans le navigateur de chaque utilisateur."
```

**Rendez le script exécutable** :

```bash
chmod +x reset_all_stats.sh
```

**Exécutez le script** :

```bash
./reset_all_stats.sh
```

---

## ✅ Vérification Après Réinitialisation

### Vérifier les Vues dans la Base de Données

```sql
-- Vérifier que toutes les vues sont à 0
SELECT 
    COUNT(*) as total_listings,
    SUM(views_count) as total_views,
    MAX(views_count) as max_views,
    AVG(views_count) as avg_views
FROM listings;
```

**Devrait afficher** :
- `total_views` : `0`
- `max_views` : `0`
- `avg_views` : `0`

---

### Vérifier via l'API Admin

```bash
# Vérifier les statistiques admin
curl http://cartagespa.com/api/v1/admin/stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Devrait afficher** :
```json
{
  "total_views": 0,
  "avg_views": 0.0,
  "most_viewed_listing": null
}
```

---

## 🎯 Réinitialisation Sélective

### Réinitialiser les Vues d'un Listing Spécifique

```sql
UPDATE listings 
SET views_count = 0 
WHERE id = 123;
```

---

### Réinitialiser les Vues des Listings d'un Utilisateur

```sql
UPDATE listings 
SET views_count = 0 
WHERE user_id = 'user-id-here';
```

---

### Réinitialiser les Vues des Listings Approuvés Seulement

```sql
UPDATE listings 
SET views_count = 0 
WHERE status = 'approved';
```

---

## ⚠️ Avertissements

1. **Les vues sont définitivement perdues** après réinitialisation
2. **Les statistiques de sécurité** peuvent être importantes pour le monitoring
3. **Les cookies frontend** doivent être réinitialisés par chaque utilisateur
4. **Faites une sauvegarde** de la base de données avant de réinitialiser

---

## 💾 Sauvegarde Avant Réinitialisation

**Avant de réinitialiser, faites une sauvegarde** :

```bash
# Sauvegarder la base de données
# Via Supabase Dashboard → Database → Backups
# OU via pg_dump si vous avez accès direct
```

---

## 📝 Checklist

- [ ] Sauvegarde de la base de données effectuée
- [ ] Vues des listings réinitialisées (SQL ou script)
- [ ] Statistiques de sécurité réinitialisées (optionnel)
- [ ] Vérification effectuée (toutes les vues à 0)
- [ ] Utilisateurs informés pour réinitialiser les cookies (si nécessaire)

---

## 🆘 Si Vous Avez Besoin d'Aide

1. **Vérifiez les logs** :
   ```bash
   docker compose logs backend
   ```

2. **Vérifiez la connexion à la base de données** :
   ```bash
   docker compose exec backend python -c "from app.database import async_session_maker; print('✅ Connexion OK')"
   ```

3. **Testez une requête SQL simple** :
   ```sql
   SELECT COUNT(*) FROM listings;
   ```

---

## 🎉 Après Réinitialisation

Une fois réinitialisé :

- ✅ Toutes les vues des listings sont à 0
- ✅ Les statistiques admin affichent 0 vues
- ✅ Les nouveaux compteurs de vues commencent à 0
- ✅ Les utilisateurs peuvent réinitialiser leurs cookies s'ils le souhaitent

