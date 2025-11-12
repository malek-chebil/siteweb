# 🍪 Système de Cookies - Explication et Utilisation

## 📚 Qu'est-ce qu'un Cookie ?

Un **cookie** est un petit fichier texte stocké dans le navigateur de l'utilisateur par un site web. Il permet au site de :
- **Se souvenir** de l'utilisateur entre les sessions
- **Maintenir** l'état de connexion
- **Stocker** des préférences utilisateur
- **Personnaliser** l'expérience

---

## 🔄 Comment Fonctionnent les Cookies ?

### 1. **Création d'un Cookie**
```
Serveur → Navigateur : "Set-Cookie: session_id=abc123; expires=..."
Navigateur stocke : session_id=abc123
```

### 2. **Envoi Automatique**
```
Navigateur → Serveur : "Cookie: session_id=abc123"
(Envoyé automatiquement à chaque requête)
```

### 3. **Types de Cookies**

| Type | Durée | Utilisation |
|------|-------|-------------|
| **Session Cookie** | Jusqu'à la fermeture du navigateur | Données temporaires |
| **Persistent Cookie** | Date d'expiration définie | Données à long terme |
| **HttpOnly Cookie** | Accessible uniquement par le serveur | Sécurité (tokens) |
| **Secure Cookie** | Envoyé uniquement via HTTPS | Sécurité |
| **SameSite Cookie** | Protection CSRF | Sécurité |

---

## 🎯 Comment Votre Site Utilise Actuellement les Cookies

### **Supabase Authentication**

Votre application utilise **Supabase Auth**, qui gère automatiquement les cookies pour l'authentification :

```javascript
// frontend/src/lib/supabase.js
// Supabase stocke automatiquement :
// - Access Token (JWT) dans localStorage
// - Refresh Token dans localStorage (ou cookie si configuré)
// - Session data
```

**Ce qui est stocké actuellement :**
- ✅ **Access Token** : Token JWT pour authentifier les requêtes API
- ✅ **Refresh Token** : Pour renouveler l'access token
- ✅ **User Session** : Données de l'utilisateur connecté

---

## 💡 Comment Bénéficier Davantage des Cookies

### 1. **Préférences Utilisateur** 🎨

Stocker les préférences de l'utilisateur pour une meilleure expérience :

```javascript
// Exemple : Thème préféré
document.cookie = "theme=dark; max-age=31536000; path=/"; // 1 an

// Exemple : Langue préférée
document.cookie = "language=fr; max-age=31536000; path=/";

// Exemple : Filtres de recherche sauvegardés
document.cookie = "last_search=masseuse+tunis; max-age=86400; path=/"; // 24h
```

**Bénéfices :**
- ✅ L'utilisateur retrouve ses préférences à chaque visite
- ✅ Pas besoin de se reconnecter pour les préférences
- ✅ Expérience personnalisée

---

### 2. **Panier / Favoris Temporaires** 🛒

Pour les utilisateurs non connectés, stocker temporairement leurs favoris :

```javascript
// Stocker les favoris dans un cookie
const favorites = [1, 5, 12]; // IDs des annonces
document.cookie = `favorites=${JSON.stringify(favorites)}; max-age=2592000; path=/`; // 30 jours

// Lire les favoris
const favoritesCookie = document.cookie
  .split('; ')
  .find(row => row.startsWith('favorites='))
  ?.split('=')[1];
const favorites = favoritesCookie ? JSON.parse(favoritesCookie) : [];
```

**Bénéfices :**
- ✅ Les utilisateurs non connectés peuvent "aimer" des annonces
- ✅ Les favoris sont conservés même après fermeture du navigateur
- ✅ Migration automatique vers le compte après inscription

---

### 3. **Historique de Navigation** 📜

Sauvegarder les dernières annonces consultées :

```javascript
// Stocker les 5 dernières annonces vues
const recentViews = [123, 456, 789, 101, 112];
document.cookie = `recent_views=${JSON.stringify(recentViews)}; max-age=604800; path=/`; // 7 jours
```

**Bénéfices :**
- ✅ "Annonces récemment consultées" pour tous les utilisateurs
- ✅ Améliore l'engagement
- ✅ Facilite le retour aux annonces intéressantes

---

### 4. **Filtres de Recherche Sauvegardés** 🔍

Se souvenir des derniers filtres utilisés :

```javascript
// Sauvegarder les filtres
const lastFilters = {
  city: "Tunis",
  category: "Massage",
  minPrice: 50,
  maxPrice: 200
};
document.cookie = `last_filters=${JSON.stringify(lastFilters)}; max-age=86400; path=/`; // 24h
```

**Bénéfices :**
- ✅ L'utilisateur retrouve ses filtres préférés
- ✅ Gain de temps
- ✅ Expérience utilisateur améliorée

---

### 5. **Statistiques et Analytics** 📊

Suivre le comportement des utilisateurs (anonyme) :

```javascript
// Compteur de visites
let visitCount = parseInt(getCookie('visit_count') || '0') + 1;
document.cookie = `visit_count=${visitCount}; max-age=31536000; path=/`; // 1 an

// Première visite
if (!getCookie('first_visit')) {
  document.cookie = `first_visit=${new Date().toISOString()}; max-age=31536000; path=/`;
  // Afficher un message de bienvenue
}
```

**Bénéfices :**
- ✅ Comprendre le comportement des utilisateurs
- ✅ Améliorer l'expérience utilisateur
- ✅ Analytics sans tracking tiers

---

### 6. **Sécurité et Protection CSRF** 🔒

Utiliser des cookies sécurisés pour protéger contre les attaques :

```javascript
// Token CSRF pour protéger les formulaires
const csrfToken = generateRandomToken();
document.cookie = `csrf_token=${csrfToken}; HttpOnly; Secure; SameSite=Strict; path=/`;
```

**Bénéfices :**
- ✅ Protection contre les attaques CSRF
- ✅ Sécurité renforcée
- ✅ Conformité avec les meilleures pratiques

---

## 🛠️ Implémentation Pratique

### **Fonctions Utilitaires pour les Cookies**

Créez un fichier `frontend/src/utils/cookies.js` :

```javascript
/**
 * Définir un cookie
 * @param {string} name - Nom du cookie
 * @param {string} value - Valeur du cookie
 * @param {number} days - Nombre de jours avant expiration
 * @param {object} options - Options supplémentaires (secure, sameSite, etc.)
 */
export function setCookie(name, value, days = 30, options = {}) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  
  let cookieString = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
  
  if (options.secure) {
    cookieString += '; Secure';
  }
  
  if (options.sameSite) {
    cookieString += `; SameSite=${options.sameSite}`;
  }
  
  if (options.httpOnly) {
    // Note: HttpOnly ne peut être défini que côté serveur
    console.warn('HttpOnly doit être défini côté serveur');
  }
  
  document.cookie = cookieString;
}

/**
 * Lire un cookie
 * @param {string} name - Nom du cookie
 * @returns {string|null} - Valeur du cookie ou null
 */
export function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  
  return null;
}

/**
 * Supprimer un cookie
 * @param {string} name - Nom du cookie
 */
export function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Vérifier si les cookies sont activés
 * @returns {boolean}
 */
export function areCookiesEnabled() {
  try {
    setCookie('test_cookie', 'test', 1);
    const enabled = getCookie('test_cookie') === 'test';
    deleteCookie('test_cookie');
    return enabled;
  } catch (e) {
    return false;
  }
}
```

---

## 📋 Cas d'Usage Recommandés pour Votre Site

### 1. **Sauvegarder les Filtres de Recherche** ✅

```javascript
// Dans FiltersBar.jsx
import { setCookie, getCookie } from '../utils/cookies';

// Sauvegarder les filtres
const handleApplyFilters = () => {
  const filtersData = {
    city: filters.city,
    category: filters.category,
    search: filters.search
  };
  setCookie('last_filters', JSON.stringify(filtersData), 1); // 24h
  // ... appliquer les filtres
};

// Charger les filtres sauvegardés au montage
useEffect(() => {
  const savedFilters = getCookie('last_filters');
  if (savedFilters) {
    const filters = JSON.parse(savedFilters);
    setFilters(filters);
  }
}, []);
```

### 2. **Favoris pour Utilisateurs Non Connectés** ✅

```javascript
// Dans ListingCard.jsx
import { setCookie, getCookie } from '../utils/cookies';

const handleToggleFavorite = () => {
  if (!isAuthenticated) {
    // Stocker dans un cookie
    const favorites = JSON.parse(getCookie('guest_favorites') || '[]');
    if (favorites.includes(listing.id)) {
      favorites.splice(favorites.indexOf(listing.id), 1);
    } else {
      favorites.push(listing.id);
    }
    setCookie('guest_favorites', JSON.stringify(favorites), 30); // 30 jours
  } else {
    // Utiliser l'API normale
    // ...
  }
};
```

### 3. **Historique de Navigation** ✅

```javascript
// Dans ListingDetailPage.jsx
import { setCookie, getCookie } from '../utils/cookies';

useEffect(() => {
  if (listing) {
    const recentViews = JSON.parse(getCookie('recent_views') || '[]');
    
    // Ajouter l'ID de l'annonce au début
    if (!recentViews.includes(listing.id)) {
      recentViews.unshift(listing.id);
      // Garder seulement les 10 dernières
      recentViews.splice(10);
      setCookie('recent_views', JSON.stringify(recentViews), 7); // 7 jours
    }
  }
}, [listing]);
```

### 4. **Préférences de Langue** ✅

```javascript
// Dans LanguageSwitcher.jsx
import { setCookie } from '../utils/cookies';

const handleLanguageChange = (lang) => {
  i18n.changeLanguage(lang);
  setCookie('preferred_language', lang, 365); // 1 an
};

// Charger la langue préférée au démarrage
useEffect(() => {
  const savedLang = getCookie('preferred_language');
  if (savedLang && ['fr', 'ar'].includes(savedLang)) {
    i18n.changeLanguage(savedLang);
  }
}, []);
```

### 5. **Mode Sombre (si ajouté)** ✅

```javascript
// Dans un composant ThemeToggle
import { setCookie, getCookie } from '../utils/cookies';

const toggleTheme = () => {
  const currentTheme = getCookie('theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setCookie('theme', newTheme, 365);
  // Appliquer le thème
};
```

---

## ⚠️ Limitations et Considérations

### 1. **Taille Limite**
- **4 KB par cookie** (limite du navigateur)
- Pour les données volumineuses, utiliser `localStorage` ou `sessionStorage`

### 2. **Sécurité**
- ❌ **Ne JAMAIS** stocker de données sensibles dans les cookies (mots de passe, tokens d'accès)
- ✅ Utiliser `HttpOnly` et `Secure` pour les cookies sensibles
- ✅ Utiliser `SameSite=Strict` pour protéger contre CSRF

### 3. **Performance**
- Les cookies sont envoyés à **chaque requête HTTP**
- Éviter de stocker trop de données dans les cookies
- Préférer `localStorage` pour les données volumineuses

### 4. **Privacy / RGPD**
- ⚠️ Informer les utilisateurs de l'utilisation des cookies
- ⚠️ Obtenir le consentement si nécessaire (banner cookies)
- ⚠️ Permettre la désactivation des cookies non essentiels

---

## 🔄 Cookies vs localStorage vs sessionStorage

| Caractéristique | Cookies | localStorage | sessionStorage |
|----------------|---------|--------------|----------------|
| **Taille** | 4 KB | 5-10 MB | 5-10 MB |
| **Expiration** | Définie | Manuelle | Session |
| **Envoi au serveur** | ✅ Automatique | ❌ Non | ❌ Non |
| **Accessible côté serveur** | ✅ Oui | ❌ Non | ❌ Non |
| **Sécurité** | ⚠️ Moyenne | ⚠️ Faible | ⚠️ Faible |
| **Utilisation** | Auth, préférences | Données client | Données temporaires |

---

## 📊 Recommandations pour Votre Site

### **Utiliser les Cookies pour :**
1. ✅ **Préférences utilisateur** (langue, thème)
2. ✅ **Filtres de recherche** (derniers filtres utilisés)
3. ✅ **Favoris temporaires** (pour utilisateurs non connectés)
4. ✅ **Historique de navigation** (dernières annonces vues)
5. ✅ **Statistiques anonymes** (compteur de visites)

### **Utiliser localStorage pour :**
1. ✅ **Données volumineuses** (liste complète de favoris)
2. ✅ **Cache de données** (listes d'annonces mises en cache)
3. ✅ **Préférences complexes** (configuration avancée)

### **Utiliser sessionStorage pour :**
1. ✅ **Données temporaires** (formulaire en cours)
2. ✅ **État de navigation** (scroll position)
3. ✅ **Données de session** (panier temporaire)

---

## 🚀 Prochaines Étapes

1. **Créer le fichier `utils/cookies.js`** avec les fonctions utilitaires
2. **Implémenter la sauvegarde des filtres** dans `FiltersBar.jsx`
3. **Ajouter les favoris pour utilisateurs non connectés** dans `ListingCard.jsx`
4. **Créer un composant "Annonces récemment consultées"** sur la page d'accueil
5. **Ajouter un banner de consentement cookies** (si nécessaire pour RGPD)

---

## 📝 Exemple Complet : Favoris pour Utilisateurs Non Connectés

```javascript
// frontend/src/utils/favorites.js
import { setCookie, getCookie } from './cookies';

export const getGuestFavorites = () => {
  const favorites = getCookie('guest_favorites');
  return favorites ? JSON.parse(favorites) : [];
};

export const addGuestFavorite = (listingId) => {
  const favorites = getGuestFavorites();
  if (!favorites.includes(listingId)) {
    favorites.push(listingId);
    setCookie('guest_favorites', JSON.stringify(favorites), 30);
  }
};

export const removeGuestFavorite = (listingId) => {
  const favorites = getGuestFavorites();
  const index = favorites.indexOf(listingId);
  if (index > -1) {
    favorites.splice(index, 1);
    setCookie('guest_favorites', JSON.stringify(favorites), 30);
  }
};

export const isGuestFavorite = (listingId) => {
  return getGuestFavorites().includes(listingId);
};

// Migration vers le compte après inscription
export const migrateGuestFavorites = async (userId) => {
  const guestFavorites = getGuestFavorites();
  if (guestFavorites.length > 0) {
    // Ajouter tous les favoris au compte
    for (const listingId of guestFavorites) {
      await api.post('/favorites', { listing_id: listingId });
    }
    // Supprimer le cookie
    deleteCookie('guest_favorites');
  }
};
```

---

## ✅ Résumé

Les cookies permettent de :
- 🎯 **Améliorer l'expérience utilisateur** (préférences, historique)
- 🔄 **Maintenir l'état** entre les sessions
- 📊 **Collecter des statistiques** anonymes
- 🔒 **Renforcer la sécurité** (tokens CSRF)
- 💾 **Stocker des données temporaires** (favoris, filtres)

**Pour votre site, les cookies sont particulièrement utiles pour :**
1. Sauvegarder les filtres de recherche
2. Permettre les favoris aux utilisateurs non connectés
3. Conserver les préférences (langue, thème)
4. Créer un historique de navigation
5. Améliorer l'engagement utilisateur


