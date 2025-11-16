# 🧪 Comment Tester le Frontend

## 🌐 Méthode 1 : Depuis Votre Navigateur (Recommandé)

### Via l'IP Publique

Ouvrez votre navigateur et allez à :

```
http://89.147.111.166:3000
```

**OU** via Nginx (port 80) :

```
http://89.147.111.166
```

### Via le Domaine (si DNS configuré)

```
http://cartagespa.com
http://www.cartagespa.com
```

---

## 💻 Méthode 2 : Depuis le Serveur (SSH)

### Test Basique avec curl

```bash
# Tester le frontend directement (port 3000)
curl http://localhost:3000

# Tester via Nginx (port 80)
curl http://localhost/

# Voir les en-têtes HTTP
curl -I http://localhost:3000
```

### Test avec wget

```bash
# Télécharger la page
wget -O- http://localhost:3000

# Tester avec verbose
wget --spider --verbose http://localhost:3000
```

---

## 🔍 Méthode 3 : Vérifier les Logs

### Logs du Frontend

```bash
# Voir les logs en temps réel
docker compose logs -f frontend

# Voir les dernières lignes
docker compose logs frontend --tail=50

# Voir les logs depuis le démarrage
docker compose logs frontend
```

### Logs de Nginx

```bash
# Voir les requêtes au frontend
docker compose logs nginx | grep frontend

# Voir toutes les requêtes
docker compose logs nginx
```

---

## 🧪 Méthode 4 : Test de Connectivité

### Vérifier que le Container Répond

```bash
# Vérifier l'état
docker compose ps frontend

# Vérifier les ports
docker compose port frontend 80

# Tester depuis un autre container
docker compose exec backend wget -O- http://frontend:80
```

### Vérifier les Fichiers Statiques

```bash
# Entrer dans le container frontend
docker compose exec frontend sh

# Vérifier que les fichiers existent
ls -la /usr/share/nginx/html/

# Vérifier index.html
cat /usr/share/nginx/html/index.html
```

---

## 🌍 Méthode 5 : Test depuis Votre Machine Locale

### Avec curl (si installé)

```powershell
# PowerShell
curl http://89.147.111.166:3000

# Ou avec Invoke-WebRequest
Invoke-WebRequest -Uri http://89.147.111.166:3000
```

### Avec le Navigateur

1. Ouvrez Chrome, Firefox, ou Edge
2. Allez à : `http://89.147.111.166:3000`
3. Vous devriez voir votre application React

---

## 🔧 Méthode 6 : Test des Fonctionnalités

### Vérifier que l'API est Accessible

Ouvrez la console du navigateur (F12) et vérifiez :

```javascript
// Tester l'API backend
fetch('http://89.147.111.166:8000/health')
  .then(res => res.json())
  .then(data => console.log(data));

// Devrait retourner: {"status":"ok"}
```

### Vérifier les Erreurs

1. Ouvrez les **Outils de Développement** (F12)
2. Allez dans l'onglet **Console**
3. Vérifiez s'il y a des erreurs JavaScript
4. Allez dans l'onglet **Network** pour voir les requêtes

---

## ✅ Checklist de Test

- [ ] Le frontend répond sur le port 3000
- [ ] Le frontend répond via Nginx (port 80)
- [ ] La page se charge sans erreurs
- [ ] Les fichiers statiques sont servis (CSS, JS, images)
- [ ] L'API backend est accessible depuis le frontend
- [ ] Pas d'erreurs dans la console du navigateur
- [ ] Les routes React fonctionnent (navigation)
- [ ] L'authentification fonctionne (si applicable)

---

## 🐛 Dépannage

### Le Frontend ne Répond Pas

```bash
# Vérifier que le container tourne
docker compose ps frontend

# Redémarrer le frontend
docker compose restart frontend

# Voir les logs d'erreur
docker compose logs frontend --tail=100
```

### Erreur 502 Bad Gateway

```bash
# Vérifier que Nginx peut joindre le frontend
docker compose exec nginx ping -c 1 frontend

# Vérifier la configuration Nginx
docker compose exec nginx nginx -t
```

### Le Frontend Charge mais l'API ne Fonctionne Pas

```bash
# Vérifier que le backend répond
curl http://localhost:8000/health

# Vérifier les variables d'environnement du frontend
docker compose exec frontend env | grep VITE
```

### Les Fichiers Statiques ne Chargent Pas

```bash
# Vérifier que les fichiers existent
docker compose exec frontend ls -la /usr/share/nginx/html/

# Vérifier les permissions
docker compose exec frontend ls -la /usr/share/nginx/html/index.html
```

---

## 📊 Test de Performance

### Temps de Chargement

```bash
# Mesurer le temps de réponse
time curl http://localhost:3000

# Avec plus de détails
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000
```

### Test de Charge (optionnel)

```bash
# Installer Apache Bench
apt install apache2-utils

# Tester avec 100 requêtes, 10 simultanées
ab -n 100 -c 10 http://localhost:3000/
```

---

## 🎯 Test Complet

### Script de Test Automatique

Créez un fichier `test-frontend.sh` :

```bash
#!/bin/bash

echo "Testing Frontend..."

# Test 1: Port 3000
echo "1. Testing port 3000..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Port 3000 OK"
else
    echo "   ❌ Port 3000 FAILED"
fi

# Test 2: Via Nginx
echo "2. Testing via Nginx..."
if curl -f http://localhost/ > /dev/null 2>&1; then
    echo "   ✅ Nginx OK"
else
    echo "   ❌ Nginx FAILED"
fi

# Test 3: Health check
echo "3. Testing health endpoint..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "   ✅ Health check OK"
else
    echo "   ❌ Health check FAILED"
fi

echo "Done!"
```

Exécutez-le :

```bash
chmod +x test-frontend.sh
./test-frontend.sh
```

---

## 📝 Notes

- Le frontend est accessible sur le **port 3000** directement
- Le frontend est aussi accessible via **Nginx sur le port 80**
- Si vous configurez le DNS, utilisez le domaine au lieu de l'IP
- Pour HTTPS, configurez SSL avec Certbot (voir `NEXT_STEPS_AFTER_DEPLOYMENT.md`)

