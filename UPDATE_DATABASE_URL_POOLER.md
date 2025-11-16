# ✅ Mettre à Jour DATABASE_URL avec le Pooler

## 📋 URL du Pooler

**URL fournie par Supabase** :
```
postgresql://postgres.cvtrghsdfkrwgasvnflb:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
```

**Format correct** : ✅
- ✅ Username : `postgres.cvtrghsdfkrwgasvnflb`
- ✅ Hostname : `aws-1-eu-west-1.pooler.supabase.com` (avec `aws-1-`)
- ✅ Port : `6543` (pooler)

---

## 🔧 Modifications Nécessaires

### 1. Remplacer `[YOUR-PASSWORD]` par Votre Mot de Passe

**Trouver votre mot de passe** :
- Dans Supabase Dashboard → **Settings** → **Database**
- Chercher **Database password**
- Si vous ne le connaissez pas, vous pouvez le réinitialiser

### 2. Ajouter `+asyncpg` pour Python

**Format pour Python/FastAPI** :
```
postgresql+asyncpg://postgres.cvtrghsdfkrwgasvnflb:VOTRE_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
```

**Important** : `postgresql+asyncpg://` (pas juste `postgresql://`)

---

## ✅ URL Finale

**Format complet** :
```bash
DATABASE_URL=postgresql+asyncpg://postgres.cvtrghsdfkrwgasvnflb:VOTRE_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
```

**Remplacez** :
- `VOTRE_PASSWORD` par votre mot de passe de base de données

---

## 🔧 Configuration

### Option 1 : Sur le Serveur VPS

```bash
# 1. Se connecter au serveur
ssh -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" root@89.147.111.166

# 2. Éditer le fichier .env
nano /root/site\ Web/backend/.env

# 3. Mettre à jour DATABASE_URL
# Remplacer la ligne DATABASE_URL par :
DATABASE_URL=postgresql+asyncpg://postgres.cvtrghsdfkrwgasvnflb:VOTRE_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres

# 4. Sauvegarder (Ctrl+O, Enter, Ctrl+X)

# 5. Redémarrer le backend
cd /root/site\ Web
docker compose restart backend
```

### Option 2 : Depuis Windows (Local)

```powershell
# 1. Éditer backend/.env
notepad backend\.env

# 2. Mettre à jour DATABASE_URL
# Remplacer la ligne DATABASE_URL par :
DATABASE_URL=postgresql+asyncpg://postgres.cvtrghsdfkrwgasvnflb:VOTRE_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres

# 3. Transférer vers le serveur
scp -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" backend\.env root@89.147.111.166:"/root/site Web/backend/.env"

# 4. Se connecter et redémarrer
ssh -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" root@89.147.111.166
cd /root/site\ Web
docker compose restart backend
```

---

## ✅ Vérification

### Vérifier le Format

```bash
# Sur le serveur
cd /root/site\ Web/backend
grep DATABASE_URL .env
```

**Vérifier** :
- ✅ Commence par `postgresql+asyncpg://`
- ✅ Contient `postgres.cvtrghsdfkrwgasvnflb`
- ✅ Port `6543` présent
- ✅ Hostname `aws-1-eu-west-1.pooler.supabase.com`

### Tester la Connexion

```bash
# Sur le serveur
cd /root/site\ Web/backend
python test_db_timeout.py
```

**Résultat attendu** :
```
✅ Connection successful!
```

### Vérifier les Logs Backend

```bash
# Sur le serveur
cd /root/site\ Web
docker compose logs backend | grep -i "pooler\|connection" | tail -5
```

**Résultat attendu** :
```
⚠️  Using pooler connection. Consider switching to direct connection (port 5432) for better performance.
```

---

## 📋 Checklist

- [ ] Trouver le mot de passe de base de données (Supabase Dashboard)
- [ ] Remplacer `[YOUR-PASSWORD]` par le vrai mot de passe
- [ ] Ajouter `+asyncpg` après `postgresql`
- [ ] Mettre à jour `DATABASE_URL` dans `backend/.env`
- [ ] Vérifier le format (username, hostname, port)
- [ ] Redémarrer le backend (`docker compose restart backend`)
- [ ] Vérifier les logs (message pooler)
- [ ] Tester la connexion (`test_db_timeout.py`)

---

## 🎯 Résumé

**URL à utiliser** :
```bash
DATABASE_URL=postgresql+asyncpg://postgres.cvtrghsdfkrwgasvnflb:VOTRE_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
```

**Changements** :
1. ✅ `postgresql://` → `postgresql+asyncpg://`
2. ✅ `[YOUR-PASSWORD]` → Votre mot de passe réel
3. ✅ Le reste est correct (username, hostname, port)

---

**Mettez à jour DATABASE_URL avec votre mot de passe et redémarrez le backend !** ✅

