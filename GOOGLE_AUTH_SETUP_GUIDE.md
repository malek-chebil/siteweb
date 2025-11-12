# Guide Étape par Étape : Configuration de l'Authentification Google

Ce guide vous accompagne pas à pas pour configurer la connexion Google sur votre site.

---

## 📋 Prérequis

- Un compte Google (Gmail)
- Un projet Supabase actif
- Accès au dashboard Supabase

---

## 🎯 Partie 1 : Configuration dans Google Cloud Console

### Étape 1.1 : Accéder à Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Connectez-vous avec votre compte Google
3. Si c'est votre première fois, acceptez les conditions d'utilisation

### Étape 1.2 : Créer ou Sélectionner un Projet

1. En haut de la page, cliquez sur le menu déroulant du projet (à côté de "Google Cloud")
2. Cliquez sur **"NEW PROJECT"** (Nouveau projet)
3. Donnez un nom à votre projet (ex: "Carthage Wellness Spa")
4. Cliquez sur **"CREATE"** (Créer)
5. Attendez quelques secondes, puis sélectionnez ce projet dans le menu déroulant

### Étape 1.3 : Activer l'API Google+

1. Dans le menu de gauche, allez dans **"APIs & Services"** > **"Library"** (Bibliothèque)
2. Dans la barre de recherche, tapez **"Google+ API"**
3. Cliquez sur **"Google+ API"** dans les résultats
4. Cliquez sur le bouton **"ENABLE"** (Activer)
5. Attendez quelques secondes que l'API soit activée

### Étape 1.4 : Configurer l'Écran de Consentement OAuth

1. Dans le menu de gauche, allez dans **"APIs & Services"** > **"OAuth consent screen"** (Écran de consentement OAuth)
2. Sélectionnez **"External"** (Externe) et cliquez sur **"CREATE"** (Créer)
3. Remplissez le formulaire :
   - **App name** (Nom de l'application) : `Carthage Wellness Spa` (ou votre nom)
   - **User support email** (Email de support) : Votre email
   - **Developer contact information** (Contact développeur) : Votre email
4. Cliquez sur **"SAVE AND CONTINUE"** (Enregistrer et continuer)
5. Sur la page **"Scopes"** (Portées), cliquez sur **"SAVE AND CONTINUE"** (aucune modification nécessaire)
6. Sur la page **"Test users"** (Utilisateurs de test), cliquez sur **"SAVE AND CONTINUE"** (vous pouvez ajouter des emails de test si vous voulez)
7. Sur la page **"Summary"** (Résumé), vérifiez les informations et cliquez sur **"BACK TO DASHBOARD"** (Retour au tableau de bord)

### Étape 1.5 : Créer les Identifiants OAuth 2.0

1. Dans le menu de gauche, allez dans **"APIs & Services"** > **"Credentials"** (Identifiants)
2. En haut de la page, cliquez sur **"+ CREATE CREDENTIALS"** (Créer des identifiants)
3. Sélectionnez **"OAuth client ID"** (ID client OAuth)
4. Si c'est la première fois, vous devrez configurer l'écran de consentement (fait à l'étape précédente)
5. Dans le formulaire :
   - **Application type** (Type d'application) : Sélectionnez **"Web application"** (Application Web)
   - **Name** (Nom) : `Carthage Wellness Spa Web Client` (ou un nom de votre choix)
6. **Authorized JavaScript origins** (Origines JavaScript autorisées) :
   - Cliquez sur **"+ ADD URI"** (Ajouter URI)
   - Ajoutez : `http://localhost:5173` (pour le développement)
   - Ajoutez : `http://localhost:5174` (si vous utilisez ce port)
   - Si vous avez un domaine de production, ajoutez-le aussi (ex: `https://votre-domaine.com`)
7. **Authorized redirect URIs** (URIs de redirection autorisées) :
   - Cliquez sur **"+ ADD URI"** (Ajouter URI)
   - Ajoutez : `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - ⚠️ **IMPORTANT** : Remplacez `YOUR_PROJECT_REF` par votre référence de projet Supabase
   - Pour trouver votre référence : Allez dans Supabase Dashboard > Settings > API > Project URL
   - Exemple : Si votre URL Supabase est `https://abcdefghijklmnop.supabase.co`, alors ajoutez `https://abcdefghijklmnop.supabase.co/auth/v1/callback`
8. Cliquez sur **"CREATE"** (Créer)
9. **⚠️ IMPORTANT** : Une popup s'affichera avec :
   - **Your Client ID** (Votre ID client) : Copiez cette valeur (ex: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
   - **Your Client Secret** (Votre secret client) : Copiez cette valeur (ex: `GOCSPX-abcdefghijklmnopqrstuvwxyz`)
   - ⚠️ **Gardez ces valeurs en sécurité !** Vous en aurez besoin pour Supabase

---

## 🎯 Partie 2 : Configuration dans Supabase Dashboard

### Étape 2.1 : Accéder aux Paramètres d'Authentification

1. Allez sur [Supabase Dashboard](https://app.supabase.com/)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet
4. Dans le menu de gauche, allez dans **"Authentication"** > **"Providers"** (Fournisseurs)

### Étape 2.2 : Activer le Provider Google

1. Dans la liste des providers, trouvez **"Google"**
2. Cliquez sur le toggle pour **activer** Google (il doit passer de gris à vert/bleu)
3. Un formulaire s'ouvrira avec deux champs :
   - **Client ID (for OAuth)** : Collez le **Client ID** que vous avez copié depuis Google Cloud Console
   - **Client Secret (for OAuth)** : Collez le **Client Secret** que vous avez copié depuis Google Cloud Console
4. Cliquez sur **"Save"** (Enregistrer)

### Étape 2.3 : Configurer les URLs de Redirection

1. Dans le menu de gauche, allez dans **"Authentication"** > **"URL Configuration"** (Configuration des URLs)
2. **Site URL** :
   - Pour le développement : `http://localhost:5173`
   - Pour la production : `https://votre-domaine.com` (remplacez par votre domaine réel)
3. **Redirect URLs** :
   - Cliquez sur **"+ Add URL"** (Ajouter URL)
   - Ajoutez : `http://localhost:5173/auth/callback` (pour le développement)
   - Si vous avez un domaine de production, ajoutez : `https://votre-domaine.com/auth/callback`
4. Cliquez sur **"Save"** (Enregistrer)

---

## 🎯 Partie 3 : Vérification et Test

### Étape 3.1 : Vérifier la Configuration

Vérifiez que tout est correct :

**Dans Google Cloud Console :**
- ✅ API Google+ activée
- ✅ OAuth Client ID créé
- ✅ Redirect URI : `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

**Dans Supabase Dashboard :**
- ✅ Provider Google activé
- ✅ Client ID et Client Secret configurés
- ✅ Site URL configurée
- ✅ Redirect URLs configurées (incluant `/auth/callback`)

### Étape 3.2 : Tester la Connexion

1. Démarrez votre application frontend :
   ```bash
   cd frontend
   npm run dev
   ```

2. Allez sur `http://localhost:5173/login` ou `http://localhost:5173/register`

3. Cliquez sur le bouton **"Continuer avec Google"**

4. Vous devriez être redirigé vers Google pour vous connecter

5. Après avoir sélectionné votre compte Google et autorisé l'application, vous serez redirigé vers votre site

6. Vous devriez être automatiquement connecté !

---

## 🔧 Dépannage

### Erreur : "redirect_uri_mismatch"

**Cause** : L'URL de redirection dans Google Cloud Console ne correspond pas à celle de Supabase.

**Solution** :
1. Vérifiez que dans Google Cloud Console, vous avez ajouté exactement :
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
2. Vérifiez que `YOUR_PROJECT_REF` correspond bien à votre référence de projet Supabase
3. Pour trouver votre référence : Supabase Dashboard > Settings > API > Project URL

### Erreur : "invalid_client"

**Cause** : Le Client ID ou Client Secret est incorrect dans Supabase.

**Solution** :
1. Vérifiez que vous avez bien copié le Client ID et Client Secret depuis Google Cloud Console
2. Vérifiez qu'il n'y a pas d'espaces avant ou après les valeurs dans Supabase
3. Réessayez de coller les valeurs

### Erreur : "access_denied"

**Cause** : L'application n'est pas encore approuvée ou vous n'êtes pas dans la liste des utilisateurs de test.

**Solution** :
1. Si votre application est en mode "Testing" (Test), ajoutez votre email dans Google Cloud Console > OAuth consent screen > Test users
2. Ou publiez votre application (passez en mode "Production")

### Le bouton Google ne fonctionne pas

**Vérifications** :
1. Vérifiez que le provider Google est bien activé dans Supabase
2. Vérifiez la console du navigateur pour les erreurs
3. Vérifiez que votre frontend est bien démarré sur le port configuré (5173)

### L'utilisateur n'est pas créé après connexion Google

**Cause** : Le backend ne crée pas automatiquement l'utilisateur.

**Solution** :
- Le backend devrait créer automatiquement l'utilisateur lors du premier appel API authentifié
- Vérifiez que votre backend est bien démarré
- Vérifiez les logs du backend pour les erreurs

---

## 📝 Notes Importantes

1. **Sécurité** :
   - Ne partagez jamais votre Client Secret publiquement
   - Ne commitez jamais vos identifiants OAuth dans Git
   - Utilisez des variables d'environnement pour la production

2. **Production** :
   - Pour la production, vous devrez :
     - Ajouter votre domaine de production dans Google Cloud Console (Authorized JavaScript origins)
     - Ajouter l'URL de callback de production dans Supabase (Redirect URLs)
     - Mettre à jour la Site URL dans Supabase

3. **Limites** :
   - En mode "Testing", seuls les utilisateurs ajoutés dans "Test users" peuvent se connecter
   - Pour permettre à tous les utilisateurs de se connecter, publiez votre application dans Google Cloud Console

---

## ✅ Checklist Finale

Avant de considérer la configuration comme terminée, vérifiez :

- [ ] Projet créé dans Google Cloud Console
- [ ] API Google+ activée
- [ ] Écran de consentement OAuth configuré
- [ ] OAuth Client ID créé avec les bonnes URLs de redirection
- [ ] Client ID et Client Secret copiés
- [ ] Provider Google activé dans Supabase
- [ ] Client ID et Client Secret configurés dans Supabase
- [ ] Site URL configurée dans Supabase
- [ ] Redirect URLs configurées dans Supabase (incluant `/auth/callback`)
- [ ] Test de connexion réussi

---

## 🎉 Félicitations !

Si vous avez suivi toutes les étapes et que le test fonctionne, votre authentification Google est maintenant configurée et prête à être utilisée !

Pour toute question ou problème, consultez la section Dépannage ci-dessus.


