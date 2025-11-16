# ✅ Configuration : Utiliser le Pooler (Port 6543)

## 📊 Résultats du Test IPv6

**Test effectué** : `/root/test_ipv6.sh`

**Résultats** :
- ✅ IPv6 est configuré sur le serveur (interfaces locales)
- ⚠️ **Pas de route IPv6 par défaut**
- ❌ **Pas de résolution DNS IPv6 disponible**
- ❌ **IPv6 ne fonctionne pas** pour se connecter à Supabase

**Conclusion** : IPv6 n'est pas fonctionnel pour les connexions externes.

---

## 🎯 Solution : Utiliser le Pooler (Port 6543)

### Avantages du Pooler

- ✅ **Fonctionne avec IPv4** (compatible partout)
- ✅ **10 connexions** disponibles (suffisant pour la plupart des apps)
- ✅ **Stable et fiable**
- ✅ **Gratuit** (pas besoin d'add-on)

---

## 🔧 Configuration

### Étape 1 : Obtenir l'URL du Pooler depuis Supabase

1. Aller sur **Supabase Dashboard**
2. **Settings** → **Database**
3. Chercher **Connection string**
4. Choisir **Session pooler** (pas "Direct connection")
5. Copier l'URL complète

**Format attendu** :
```
postgresql+asyncpg://postgres.krwgasvnflb:VOTRE_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
```

**Important** :
- ✅ Username : `postgres.krwgasvnflb` (pas juste `krwgasvnflb`)
- ✅ Hostname : `aws-1-eu-west-1.pooler.supabase.com` (avec `aws-1-`)
- ✅ Port : `6543` (pooler, pas 5432)

---

### Étape 2 : Mettre à Jour `backend/.env`

**Sur le serveur VPS** :

```bash
# Éditer le fichier .env
nano /root/site\ Web/backend/.env
```

**OU depuis Windows** :

```powershell
# Éditer localement puis transférer
notepad backend\.env
```

**Mettre à jour `DATABASE_URL`** :

```bash
# Format pooler (port 6543)
DATABASE_URL=postgresql+asyncpg://postgres.krwgasvnflb:VOTRE_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
```

**Vérifier** :
- ✅ Port est `6543` (pooler)
- ✅ Hostname contient `aws-1-` (pooler)
- ✅ Username est `postgres.krwgasvnflb`

---

### Étape 3 : Redémarrer le Backend

**Sur le serveur VPS** :

```bash
# Si Docker Compose
cd /root/site\ Web
docker compose restart backend

# OU si backend local
cd /root/site\ Web/backend
# Arrêter (Ctrl+C) et redémarrer
uvicorn app.main:app --reload
```

**Vérifier les logs** :

```bash
# Docker Compose
docker compose logs backend | tail -20

# OU backend local
# Regarder les logs dans le terminal
```

**Vous devriez voir** :
```
⚠️  Using pooler connection. Consider switching to direct connection (port 5432) for better performance.
```

---

## 📊 Configuration du Pool

**Avec le pooler, le code utilise automatiquement** :
- `pool_size = 5`
- `max_overflow = 5`
- **Total : 10 connexions simultanées**

**C'est suffisant pour** :
- ✅ La plupart des applications web
- ✅ Trafic modéré à élevé
- ✅ Plusieurs utilisateurs simultanés

---

## ✅ Vérification

### Test 1 : Vérifier DATABASE_URL

```bash
# Sur le serveur
cd /root/site\ Web/backend
grep DATABASE_URL .env | head -1
```

**Vérifier** :
- ✅ Port `6543` présent
- ✅ Hostname `aws-1-` présent
- ✅ Username `postgres.krwgasvnflb` présent

### Test 2 : Tester la Connexion

```bash
# Sur le serveur
cd /root/site\ Web/backend
python test_db_timeout.py
```

**Résultat attendu** :
```
✅ Connection successful!
```

### Test 3 : Vérifier les Logs Backend

```bash
# Docker Compose
docker compose logs backend | grep -i "pooler\|connection" | tail -5
```

**Résultat attendu** :
```
⚠️  Using pooler connection...
```

---

## 🔄 Si Vous Voulez Améliorer Plus Tard

### Option 1 : Activer IPv6 sur le Serveur

**Contacter 1984 Hosting** pour activer IPv6 sur votre VPS.

**Puis** :
- Utiliser la connexion directe (port 5432)
- 20 connexions au lieu de 10
- Meilleures performances

### Option 2 : Ajouter l'Add-on IPv4 ($4/mois)

**Dans Supabase Dashboard** :
- Aller dans **Add ons**
- Activer **Dedicated IPv4 address**
- Coût : $4/mois

**Puis** :
- Utiliser la connexion directe (port 5432)
- 20 connexions au lieu de 10
- Meilleures performances

**Pour l'instant** : Le pooler (10 connexions) est **suffisant** pour votre application.

---

## 📋 Checklist

- [ ] Obtenir l'URL pooler depuis Supabase Dashboard
- [ ] Mettre à jour `DATABASE_URL` dans `backend/.env` (port 6543)
- [ ] Vérifier le format (username, hostname, port)
- [ ] Redémarrer le backend
- [ ] Vérifier les logs (message pooler)
- [ ] Tester la connexion (`test_db_timeout.py`)
- [ ] Tester l'application (requêtes API)

---

## 🎯 Résumé

**Configuration actuelle** :
- ✅ Pooler (port 6543)
- ✅ 10 connexions simultanées
- ✅ Compatible IPv4
- ✅ Stable et fiable

**Performance** :
- ⭐⭐⭐⭐ Bonne (suffisante pour la plupart des apps)
- Gère plusieurs utilisateurs simultanés
- Pas de problème de pool saturé avec cette configuration

---

**Configurez DATABASE_URL avec le pooler (port 6543) et redémarrez le backend !** ✅

