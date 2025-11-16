# 🚀 Instructions de Déploiement - Étape par Étape

## 📋 ÉTAPE 1 : Transférer les Fichiers

### Depuis PowerShell (dans le dossier `site Web`)

```powershell
# 1. Script simplifié Nginx
scp -i "..\config site web\1984_hosting_key" nginx\start-nginx-simple.sh root@89.147.111.166:"/root/site Web/nginx/"

# 2. Docker Compose mis à jour
scp -i "..\config site web\1984_hosting_key" docker-compose.yml root@89.147.111.166:"/root/site Web/"
```

**Note** : Si vous avez des erreurs avec les chemins, utilisez des guillemets simples :
```powershell
scp -i '..\config site web\1984_hosting_key' nginx\start-nginx-simple.sh root@89.147.111.166:'/root/site Web/nginx/'
```

---

## 📋 ÉTAPE 2 : Se Connecter au Serveur

```powershell
ssh -i "C:\Users\Malek\Desktop\config site web\1984_hosting_key" root@89.147.111.166
```

---

## 📋 ÉTAPE 3 : Sur le Serveur - Redémarrer les Services

Une fois connecté au serveur, exécutez :

```bash
# Aller dans le dossier du projet
cd /root/site\ Web

# Arrêter tous les containers
docker compose down

# Redémarrer tous les services
docker compose up -d

# Vérifier les logs (Ctrl+C pour quitter)
docker compose logs -f
```

---

## 📋 ÉTAPE 4 : Vérifier que Tout Fonctionne

### Vérifier les services

```bash
# Voir l'état de tous les services
docker compose ps

# Vérifier les logs du backend
docker compose logs backend

# Vérifier les logs du frontend
docker compose logs frontend

# Vérifier les logs de Nginx
docker compose logs nginx
```

### Tester les endpoints

```bash
# Tester le backend directement
curl http://localhost:8000/health

# Tester le frontend directement
curl http://localhost:3000

# Tester via Nginx (si configuré)
curl http://localhost/health
curl http://localhost/
```

---

## 🔍 En Cas de Problème

### Le backend ne démarre pas ?

```bash
# Voir les logs détaillés
docker compose logs backend --tail=100

# Vérifier les variables d'environnement
docker compose exec backend env | grep DATABASE_URL

# Vérifier la connexion à la base de données
docker compose exec backend python -c "from app.database import engine; print('DB OK')"
```

### Nginx ne démarre pas ?

```bash
# Vérifier la configuration Nginx
docker compose exec nginx nginx -t

# Voir les logs Nginx
docker compose logs nginx --tail=50

# Vérifier si les services sont accessibles depuis Nginx
docker compose exec nginx ping -c 1 backend
docker compose exec nginx ping -c 1 frontend
```

### Le frontend ne démarre pas ?

```bash
# Voir les logs
docker compose logs frontend --tail=100

# Vérifier si le build a réussi
docker compose exec frontend ls -la /usr/share/nginx/html
```

---

## ✅ Checklist de Vérification

- [ ] Fichiers transférés avec succès
- [ ] Services redémarrés (`docker compose up -d`)
- [ ] Tous les services sont "Up" (`docker compose ps`)
- [ ] Backend répond sur `/health`
- [ ] Frontend répond sur le port 3000
- [ ] Nginx démarre sans erreur
- [ ] Pas d'erreurs dans les logs

---

## 🎯 Prochaines Étapes

Une fois que tout fonctionne :

1. **Configurer le DNS** : Pointer `cartagespa.com` vers `89.147.111.166`
2. **Configurer SSL** : Utiliser Certbot pour obtenir des certificats HTTPS
3. **Tester en production** : Accéder à `http://cartagespa.com`

---

## 📝 Notes

- Le script `start-nginx-simple.sh` attend 5 secondes puis démarre Nginx
- Les healthchecks Docker garantissent que les services sont prêts
- Si un service ne démarre pas, vérifiez les logs avec `docker compose logs <service>`

