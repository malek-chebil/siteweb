# Configuration de la Connexion Google (OAuth)

## ✅ Implémentation Frontend

La fonctionnalité de connexion/inscription avec Google a été implémentée dans le frontend :

### Fichiers Modifiés

1. **`frontend/src/context/AuthContext.jsx`**
   - Ajout de la fonction `signInWithGoogle()` qui utilise `supabase.auth.signInWithOAuth()`
   - Redirection vers `/auth/callback` après authentification Google

2. **`frontend/src/pages/LoginPage.jsx`**
   - Ajout d'un bouton "Continuer avec Google" avec icône Google
   - Ajout d'un séparateur "OU" entre Google et le formulaire email/password

3. **`frontend/src/pages/RegisterPage.jsx`**
   - Même implémentation que LoginPage avec bouton Google

4. **`frontend/src/pages/AuthCallbackPage.jsx`** (nouveau)
   - Page de callback qui gère le retour de Google OAuth
   - Extrait le username depuis les métadonnées Google
   - Met à jour le profil utilisateur dans le backend
   - Redirige vers la page d'accueil

5. **`frontend/src/router.jsx`**
   - Ajout de la route `/auth/callback` pour gérer le retour OAuth

6. **Traductions**
   - Ajout de `auth.continueWithGoogle` et `auth.or` en français et arabe

## ⚙️ Configuration Supabase (À FAIRE)

Pour activer la connexion Google, vous devez configurer OAuth dans votre dashboard Supabase :

### Étapes de Configuration

1. **Aller dans Supabase Dashboard**
   - Ouvrez votre projet Supabase
   - Allez dans **Authentication > Providers**

2. **Activer Google Provider**
   - Trouvez "Google" dans la liste des providers
   - Activez le toggle "Enable Google provider"

3. **Configurer Google OAuth**
   - Vous aurez besoin de :
     - **Client ID** : ID client de votre application Google OAuth
     - **Client Secret** : Secret client de votre application Google OAuth

4. **Créer une Application Google OAuth**

   Si vous n'avez pas encore d'application OAuth :

   a. **Aller dans Google Cloud Console**
      - Visitez [Google Cloud Console](https://console.cloud.google.com/)
      - Créez un nouveau projet ou sélectionnez un projet existant

   b. **Activer Google+ API**
      - Allez dans **APIs & Services > Library**
      - Recherchez "Google+ API" et activez-la

   c. **Créer des Identifiants OAuth 2.0**
      - Allez dans **APIs & Services > Credentials**
      - Cliquez sur **Create Credentials > OAuth client ID**
      - Choisissez **Web application**
      - Configurez :
        - **Name** : Nom de votre application (ex: "Carthage Wellness Spa")
        - **Authorized JavaScript origins** :
          - `http://localhost:5173` (développement)
          - `http://localhost:5174` (développement alternatif)
          - `https://votre-domaine.com` (production)
        - **Authorized redirect URIs** :
          - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
          - Remplacez `YOUR_PROJECT_REF` par votre référence de projet Supabase

   d. **Copier les Identifiants**
      - Copiez le **Client ID** et le **Client Secret**
      - Collez-les dans Supabase Dashboard > Authentication > Providers > Google

5. **Configurer l'URL de Redirection dans Supabase**
   - Dans Supabase Dashboard > Authentication > URL Configuration
   - Ajoutez votre URL de callback frontend :
     - Développement : `http://localhost:5173/auth/callback`
     - Production : `https://votre-domaine.com/auth/callback`

### URLs de Redirection à Configurer

**Dans Google Cloud Console (Authorized redirect URIs) :**
```
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

**Dans Supabase (Site URL et Redirect URLs) :**
```
http://localhost:5173/auth/callback  (développement)
https://votre-domaine.com/auth/callback  (production)
```

## 🔄 Flux d'Authentification

1. L'utilisateur clique sur "Continuer avec Google"
2. Redirection vers Google pour authentification
3. Google redirige vers Supabase callback : `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
4. Supabase traite l'authentification et redirige vers votre frontend : `/auth/callback`
5. `AuthCallbackPage` :
   - Récupère la session depuis Supabase
   - Extrait le username depuis les métadonnées Google (full_name, email, etc.)
   - Met à jour le profil utilisateur via l'API backend
   - Redirige vers la page d'accueil

## 📝 Notes Importantes

- Le backend crée automatiquement l'utilisateur lors de la première connexion (voir `backend/app/dependencies.py` - `get_current_user`)
- Le username est extrait depuis les métadonnées Google ou généré depuis l'email
- Si l'utilisateur existe déjà, il est simplement connecté
- Le backend gère la création automatique des utilisateurs OAuth

## 🧪 Test

Une fois la configuration terminée :

1. Allez sur `/login` ou `/register`
2. Cliquez sur "Continuer avec Google"
3. Vous devriez être redirigé vers Google pour vous connecter
4. Après connexion, vous serez redirigé vers `/auth/callback`
5. Puis automatiquement vers la page d'accueil

## ⚠️ Dépannage

### Erreur : "redirect_uri_mismatch"
- Vérifiez que l'URL de redirection dans Google Cloud Console correspond exactement à celle de Supabase
- Format : `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

### Erreur : "invalid_client"
- Vérifiez que le Client ID et Client Secret sont corrects dans Supabase
- Vérifiez que l'application OAuth est bien configurée dans Google Cloud Console

### L'utilisateur n'est pas créé dans le backend
- Le backend crée automatiquement l'utilisateur lors du premier appel API authentifié
- Vérifiez que `get_current_user` dans `backend/app/dependencies.py` fonctionne correctement


