# Limites de l'Authentification Google

Ce document détaille toutes les limites liées à l'utilisation de l'authentification Google OAuth dans votre application.

---

## 🔵 Limites Google Cloud Console (OAuth 2.0)

### Quotas par Défaut (Gratuit)

#### 1. **Quota de Requêtes OAuth**
- **Requêtes par jour** : **100 utilisateurs uniques par jour**
- **Requêtes par minute** : **100 requêtes par minute**
- **Note** : Ces quotas sont par projet Google Cloud

#### 2. **Utilisateurs de Test (Mode Testing)**
- **Limite** : **100 utilisateurs de test maximum**
- **Restriction** : Seuls les utilisateurs ajoutés dans "Test users" peuvent se connecter
- **Solution** : Publier l'application pour permettre à tous les utilisateurs de se connecter

#### 3. **Applications OAuth par Projet**
- **Limite** : **Pas de limite stricte**, mais recommandé de ne pas dépasser 10-20 applications OAuth par projet
- **Recommandation** : Créez une application OAuth par environnement (dev, staging, prod)

### Quotas Étendus (Sur Demande)

Si vous dépassez les limites par défaut, vous pouvez demander une augmentation :

1. Allez dans **Google Cloud Console** > **APIs & Services** > **Quotas**
2. Recherchez "OAuth API"
3. Cliquez sur **"Edit Quotas"** (Modifier les quotas)
4. Remplissez le formulaire de demande
5. Google examinera votre demande (généralement 24-48h)

**Limites typiques après augmentation** :
- **Requêtes par jour** : 1,000 - 10,000+ (selon votre demande)
- **Requêtes par minute** : 1,000 - 5,000+ (selon votre demande)

---

## 🟢 Limites Supabase (Authentification)

### Plan Gratuit (Free Tier)

#### 1. **Utilisateurs Actifs**
- **Limite** : **50,000 utilisateurs actifs par mois**
- **Définition** : Un utilisateur qui s'est connecté au moins une fois dans le mois
- **Note** : Les utilisateurs inactifs ne comptent pas

#### 2. **Requêtes d'Authentification**
- **Limite** : **Pas de limite stricte** sur les requêtes d'authentification
- **Note** : Les requêtes d'authentification sont généralement très rapides et ne consomment pas beaucoup de ressources

#### 3. **Providers OAuth**
- **Limite** : **Tous les providers OAuth sont disponibles** (Google, GitHub, Facebook, etc.)
- **Note** : Pas de limite sur le nombre de providers activés

### Plans Payants

#### Pro Plan ($25/mois)
- **Utilisateurs actifs** : **100,000 par mois**
- **Support** : Email support
- **Autres limites** : Voir [Supabase Pricing](https://supabase.com/pricing)

#### Team Plan ($599/mois)
- **Utilisateurs actifs** : **500,000 par mois**
- **Support** : Priorité email + chat
- **Autres limites** : Voir [Supabase Pricing](https://supabase.com/pricing)

#### Enterprise Plan (Sur mesure)
- **Utilisateurs actifs** : **Illimité**
- **Support** : Support dédié 24/7
- **Autres limites** : Personnalisées selon vos besoins

---

## 🟡 Limites de Votre Application

### 1. **Taux de Connexion**
- **Limite technique** : Dépend de votre infrastructure backend
- **Recommandation** : 
  - Si vous utilisez Render/Railway : Vérifiez les limites de votre plan
  - Si vous utilisez Vercel : Limites basées sur les "Function Invocations"
  - Backend FastAPI : Généralement très performant, limite principalement liée à la base de données

### 2. **Connexions Simultanées**
- **Limite** : Dépend de votre pool de connexions à la base de données
- **Configuration actuelle** : 
  - `pool_size=3`
  - `max_overflow=5`
  - **Total** : Maximum **8 connexions simultanées** à la base de données
- **Note** : Pour augmenter, modifiez `backend/app/database.py`

### 3. **Stockage des Sessions**
- **Limite** : Les sessions sont stockées dans Supabase (gratuit jusqu'à 500MB)
- **Note** : Les sessions OAuth sont généralement très légères (< 1KB par session)

---

## 📊 Tableau Récapitulatif des Limites

| Service | Limite Gratuite | Limite Payante | Notes |
|---------|----------------|----------------|-------|
| **Google OAuth (par jour)** | 100 utilisateurs uniques | Sur demande (1,000+) | Par projet Google Cloud |
| **Google OAuth (par minute)** | 100 requêtes | Sur demande (1,000+) | Par projet Google Cloud |
| **Utilisateurs de test** | 100 maximum | N/A | Mode Testing uniquement |
| **Supabase - Utilisateurs actifs/mois** | 50,000 | 100,000+ (selon plan) | Par projet Supabase |
| **Supabase - Requêtes auth** | Illimité | Illimité | Pas de limite stricte |
| **Connexions DB simultanées** | 8 (config actuelle) | Configurable | Dépend de votre config |

---

## ⚠️ Scénarios de Dépassement

### Scénario 1 : Plus de 100 Utilisateurs Google par Jour

**Symptômes** :
- Erreur : `Error 403: access_denied`
- Message : "Quota exceeded"

**Solutions** :
1. **Court terme** : Attendre le lendemain (quota réinitialisé)
2. **Long terme** : Demander une augmentation de quota dans Google Cloud Console
3. **Alternative** : Utiliser d'autres providers OAuth (GitHub, Facebook, etc.) pour répartir la charge

### Scénario 2 : Plus de 50,000 Utilisateurs Actifs par Mois (Supabase)

**Symptômes** :
- Notification Supabase
- Possible limitation des fonctionnalités

**Solutions** :
1. **Upgrade** : Passer au plan Pro ($25/mois)
2. **Optimisation** : Nettoyer les utilisateurs inactifs
3. **Alternative** : Migrer vers un plan supérieur

### Scénario 3 : Plus de 8 Connexions DB Simultanées

**Symptômes** :
- Erreur : `Too many connections`
- Timeouts lors des connexions

**Solutions** :
1. **Augmenter le pool** : Modifier `pool_size` et `max_overflow` dans `backend/app/database.py`
2. **Optimiser les requêtes** : Réduire le temps de connexion
3. **Upgrade DB** : Passer à un plan Supabase supérieur (plus de connexions)

---

## 🎯 Recommandations pour Votre Application

### Pour un Site à Petite/Moyenne Échelle

**Configuration recommandée** :
- ✅ Google OAuth : Quota gratuit (100 utilisateurs/jour) suffisant
- ✅ Supabase : Plan gratuit (50,000 utilisateurs/mois) suffisant
- ✅ Base de données : Pool actuel (8 connexions) suffisant

**Estimation** :
- **Utilisateurs par jour** : Jusqu'à 100 avec Google OAuth
- **Utilisateurs par mois** : Jusqu'à 50,000 avec Supabase
- **Connexions simultanées** : Jusqu'à 8 utilisateurs en même temps

### Pour un Site à Grande Échelle

**Configuration recommandée** :
- ⚠️ Google OAuth : Demander une augmentation de quota (1,000+ utilisateurs/jour)
- ⚠️ Supabase : Plan Pro ($25/mois) ou supérieur
- ⚠️ Base de données : Augmenter le pool (ex: `pool_size=10`, `max_overflow=10`)

**Estimation** :
- **Utilisateurs par jour** : 1,000+ avec quota augmenté
- **Utilisateurs par mois** : 100,000+ avec plan Pro
- **Connexions simultanées** : 20+ avec pool augmenté

---

## 📈 Monitoring et Alertes

### Comment Surveiller les Limites

#### Google Cloud Console
1. Allez dans **APIs & Services** > **Dashboard**
2. Vérifiez les métriques OAuth
3. Configurez des alertes si nécessaire

#### Supabase Dashboard
1. Allez dans **Settings** > **Usage**
2. Vérifiez le nombre d'utilisateurs actifs
3. Surveillez les quotas mensuels

#### Votre Application
1. Ajoutez des logs pour suivre les connexions
2. Surveillez les erreurs dans les logs backend
3. Configurez des alertes pour les erreurs OAuth

---

## 🔧 Optimisations pour Réduire la Charge

### 1. **Cache des Sessions**
- Utilisez le cache pour éviter les requêtes répétées
- Les sessions Supabase sont déjà en cache côté client

### 2. **Réduction des Requêtes DB**
- Le backend crée automatiquement l'utilisateur uniquement lors de la première connexion
- Les connexions suivantes ne créent pas de nouvelles entrées

### 3. **Pool de Connexions Optimisé**
- Configuration actuelle : `pool_size=3`, `max_overflow=5`
- Pour plus de trafic : Augmentez progressivement

### 4. **Utilisation de Plusieurs Providers**
- Répartissez la charge entre Google, GitHub, Facebook, etc.
- Réduit la dépendance à un seul provider

---

## 📝 Checklist de Vérification

Avant de lancer votre application en production :

- [ ] Vérifier que le quota Google OAuth est suffisant pour vos besoins
- [ ] Vérifier que le plan Supabase correspond à votre nombre d'utilisateurs attendu
- [ ] Configurer le pool de connexions DB selon le trafic attendu
- [ ] Configurer des alertes pour surveiller les limites
- [ ] Tester avec plusieurs utilisateurs simultanés
- [ ] Prévoir un plan d'upgrade si nécessaire

---

## 🆘 Support

### En Cas de Dépassement

1. **Google OAuth** :
   - Demander une augmentation dans Google Cloud Console
   - Contact : [Google Cloud Support](https://cloud.google.com/support)

2. **Supabase** :
   - Upgrade vers un plan supérieur
   - Contact : [Supabase Support](https://supabase.com/support)

3. **Votre Application** :
   - Vérifier les logs backend
   - Optimiser les requêtes
   - Augmenter les ressources si nécessaire

---

## 📚 Ressources

- [Google OAuth Quotas](https://developers.google.com/identity/protocols/oauth2/policies)
- [Supabase Pricing](https://supabase.com/pricing)
- [Supabase Auth Limits](https://supabase.com/docs/guides/auth)
- [Google Cloud Console Quotas](https://console.cloud.google.com/apis/api/oauth2.googleapis.com/quotas)

---

**Dernière mise à jour** : Configuration actuelle de votre application


