# 🔍 Connexion Supabase - Plan Free

## 📋 Information Importante

D'après le dashboard Supabase, vous êtes sur le **plan Free**.

**Implications** :
- ❌ **Connexion directe (port 5432)** nécessite **IPv6** ou l'add-on IPv4 ($4/mois)
- ✅ **Pooler (port 6543)** fonctionne avec **IPv4** (pas besoin d'add-on)

---

## 🎯 Options Disponibles

### Option 1 : Utiliser le Pooler (RECOMMANDÉ pour Free Plan)

**Avantages** :
- ✅ Fonctionne avec IPv4 (pas besoin d'add-on)
- ✅ Gratuit
- ✅ Compatible avec tous les serveurs

**Format** :
```
postgresql+asyncpg://postgres.krwgasvnflb:VOTRE_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
```

**Configuration pool** :
- `pool_size = 5`
- `max_overflow = 5`
- **Total : 10 connexions**

### Option 2 : Connexion Directe (Si IPv6 Disponible)

**Requis** :
- ✅ Votre serveur/client doit pouvoir résoudre **IPv6**
- ❌ OU payer l'add-on IPv4 ($4/mois)

**Format** :
```
postgresql+asyncpg://postgres.krwgasvnflb:VOTRE_PASSWORD@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
```

**Configuration pool** :
- `pool_size = 10`
- `max_overflow = 10`
- **Total : 20 connexions**

---

## 🔍 Vérifier IPv6 sur Votre Serveur

### Sur le Serveur VPS

```bash
# Vérifier si IPv6 est disponible
ping6 -c 1 db.krwgasvnflb.supabase.co

# OU
curl -6 -I https://db.krwgasvnflb.supabase.co
```

**Si IPv6 fonctionne** : Vous pouvez utiliser la connexion directe (port 5432)
**Si IPv6 ne fonctionne pas** : Utilisez le pooler (port 6543)

---

## ✅ Recommandation pour Plan Free

### Utiliser le Pooler (Port 6543)

**Pourquoi** :
1. ✅ **Gratuit** - Pas besoin d'add-on
2. ✅ **Fonctionne avec IPv4** - Compatible avec tous les serveurs
3. ✅ **10 connexions** - Suffisant pour la plupart des applications
4. ✅ **Stable** - Pas de problème de résolution IPv6

**Configuration dans `backend/.env`** :
```bash
DATABASE_URL=postgresql+asyncpg://postgres.krwgasvnflb:VOTRE_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
```

**Pool configuré** :
- `pool_size = 5`
- `max_overflow = 5`
- **Total : 10 connexions simultanées**

---

## 🔄 Migration vers Pooler

### Étape 1 : Mettre à Jour DATABASE_URL

**Dans `backend/.env`** :

```bash
# Remplacer par le format pooler
DATABASE_URL=postgresql+asyncpg://postgres.krwgasvnflb:VOTRE_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
```

**Important** :
- ✅ Username : `postgres.krwgasvnflb` (pas juste `krwgasvnflb`)
- ✅ Hostname : `aws-1-eu-west-1.pooler.supabase.com` (avec `aws-1-`)
- ✅ Port : `6543` (pooler, pas 5432)

### Étape 2 : Vérifier dans Supabase Dashboard

1. Aller dans **Settings** → **Database**
2. Chercher **Connection string**
3. Choisir **Session pooler** (pas Direct connection)
4. Copier l'URL complète

### Étape 3 : Redémarrer le Backend

```powershell
cd backend
# Arrêter (Ctrl+C)
# Redémarrer
uvicorn app.main:app --reload
```

**Vous devriez voir** :
```
⚠️  Using pooler connection. Consider switching to direct connection (port 5432) for better performance.
```

---

## 📊 Comparaison

| Caractéristique | Pooler (6543) | Direct (5432) |
|-----------------|---------------|---------------|
| **Plan Free** | ✅ Gratuit | ❌ Nécessite IPv6 ou add-on ($4/mois) |
| **IPv4** | ✅ Compatible | ❌ Nécessite IPv6 ou add-on |
| **Connexions** | 10 | 20 |
| **Performance** | Bonne | Meilleure |
| **Stabilité** | ✅ Stable | Dépend d'IPv6 |

---

## 🚀 Amélioration Future

### Si Vous Voulez Plus de Connexions

**Option 1 : Upgrader vers Pro Plan**
- Plus de connexions disponibles
- Meilleures performances
- Support prioritaire

**Option 2 : Ajouter IPv4 Add-on ($4/mois)**
- Permet connexion directe avec IPv4
- 20 connexions au lieu de 10
- Meilleures performances

**Pour l'instant** : Le pooler (10 connexions) est **suffisant** pour la plupart des applications.

---

## ✅ Action Immédiate

**Utiliser le pooler (port 6543)** :

1. **Copier l'URL depuis Supabase Dashboard** :
   - Settings → Database → Connection string → **Session pooler**

2. **Mettre à jour `backend/.env`** :
   ```bash
   DATABASE_URL=postgresql+asyncpg://postgres.krwgasvnflb:VOTRE_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
   ```

3. **Redémarrer le backend**

---

**Sur le plan Free, utilisez le pooler (port 6543) - c'est gratuit et fonctionne parfaitement !** ✅

