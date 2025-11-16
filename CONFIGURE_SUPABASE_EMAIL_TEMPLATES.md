# 📧 Configurer les Templates d'Email Supabase

## 📋 Vue d'Ensemble

Supabase permet de personnaliser les emails envoyés pour :
- ✅ Confirmation d'email
- ✅ Réinitialisation de mot de passe
- ✅ Invitation d'utilisateur
- ✅ Changement d'email

Vous pouvez modifier :
- **Nom de l'expéditeur** (From Name)
- **Adresse email de l'expéditeur** (From Email)
- **Sujet de l'email** (Subject)
- **Contenu du message** (Body - HTML et texte)

---

## 🎯 Étapes pour Modifier les Templates d'Email

### ÉTAPE 1 : Accéder aux Templates d'Email

1. **Allez dans** Supabase Dashboard
2. **Cliquez sur** Authentication (dans le menu de gauche)
3. **Cliquez sur** Email Templates (ou Templates)
4. **Sélectionnez** le template que vous voulez modifier :
   - **Confirm signup** (Confirmation d'inscription)
   - **Reset password** (Réinitialisation de mot de passe)
   - **Magic Link** (Lien magique)
   - **Change Email Address** (Changement d'email)
   - **Invite user** (Invitation d'utilisateur)

---

### ÉTAPE 2 : Modifier le Template de Confirmation

**Pour "Confirm signup"** :

1. **Cliquez sur** "Confirm signup"
2. **Vous verrez** plusieurs sections :

#### A. Configuration de l'Expéditeur

**From Name** (Nom de l'expéditeur) :
```
Cartage Spa
```
ou
```
Votre Nom de Site
```

**From Email** (Email de l'expéditeur) :
```
noreply@cartagespa.com
```
ou
```
contact@cartagespa.com
```

**Note** : Vous devez configurer un domaine personnalisé dans Supabase pour utiliser votre propre domaine. Sinon, Supabase utilisera son domaine par défaut.

---

#### B. Sujet de l'Email (Subject)

**Template par défaut** :
```
Confirm your signup
```

**Personnalisé** :
```
Confirmez votre inscription - Cartage Spa
```

**OU avec variables** :
```
Confirmez votre inscription {{ .Email }} - Cartage Spa
```

---

#### C. Contenu du Message (Body)

**Vous pouvez utiliser** :
- **HTML** : Pour le formatage
- **Variables** : Pour personnaliser le contenu

**Variables disponibles** :
- `{{ .Email }}` : Email de l'utilisateur
- `{{ .Token }}` : Token de confirmation (généralement dans le lien)
- `{{ .TokenHash }}` : Hash du token
- `{{ .SiteURL }}` : URL de votre site (configuré dans Site URL)
- `{{ .RedirectTo }}` : URL de redirection après confirmation

---

### ÉTAPE 3 : Exemple de Template Personnalisé

#### Version HTML

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #FFC300 0%, #ffb300 100%);
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 8px 8px;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #FFC300 0%, #ffb300 100%);
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Bienvenue sur Cartage Spa !</h1>
    </div>
    <div class="content">
      <p>Bonjour,</p>
      <p>Merci de vous être inscrit sur <strong>Cartage Spa</strong> !</p>
      <p>Pour confirmer votre adresse email <strong>{{ .Email }}</strong>, veuillez cliquer sur le bouton ci-dessous :</p>
      <p style="text-align: center;">
        <a href="{{ .SiteURL }}/auth/confirm?token={{ .TokenHash }}&type=signup" class="button">
          Confirmer mon email
        </a>
      </p>
      <p>Ou copiez-collez ce lien dans votre navigateur :</p>
      <p style="word-break: break-all; color: #666;">
        {{ .SiteURL }}/auth/confirm?token={{ .TokenHash }}&type=signup
      </p>
      <p>Ce lien expirera dans 24 heures.</p>
      <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
      <p>Cordialement,<br>L'équipe Cartage Spa</p>
    </div>
    <div class="footer">
      <p>© 2025 Cartage Spa. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>
```

---

#### Version Texte (Plain Text)

```
Bienvenue sur Cartage Spa !

Bonjour,

Merci de vous être inscrit sur Cartage Spa !

Pour confirmer votre adresse email {{ .Email }}, veuillez cliquer sur le lien suivant :

{{ .SiteURL }}/auth/confirm?token={{ .TokenHash }}&type=signup

Ce lien expirera dans 24 heures.

Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.

Cordialement,
L'équipe Cartage Spa

© 2025 Cartage Spa. Tous droits réservés.
```

---

### ÉTAPE 4 : Configurer le Domaine Personnalisé (Optionnel)

**Pour utiliser votre propre domaine** (ex: `noreply@cartagespa.com`) :

1. **Allez dans** Settings → Authentication
2. **Trouvez** "SMTP Settings" ou "Email Settings"
3. **Configurez** :
   - **SMTP Host** : Votre serveur SMTP (ex: `smtp.gmail.com`, `smtp.sendgrid.net`)
   - **SMTP Port** : `587` (TLS) ou `465` (SSL)
   - **SMTP User** : Votre nom d'utilisateur SMTP
   - **SMTP Password** : Votre mot de passe SMTP
   - **Sender Email** : `noreply@cartagespa.com`
   - **Sender Name** : `Cartage Spa`

**Services SMTP recommandés** :
- **SendGrid** : Gratuit jusqu'à 100 emails/jour
- **Mailgun** : Gratuit jusqu'à 5,000 emails/mois
- **Amazon SES** : Très économique
- **Gmail SMTP** : Pour les tests (limité)

---

## 📝 Templates Disponibles

### 1. Confirm Signup (Confirmation d'Inscription)

**Quand** : Envoyé après l'inscription d'un nouvel utilisateur

**Variables disponibles** :
- `{{ .Email }}`
- `{{ .TokenHash }}`
- `{{ .SiteURL }}`
- `{{ .RedirectTo }}`

---

### 2. Reset Password (Réinitialisation de Mot de Passe)

**Quand** : Envoyé quand un utilisateur demande une réinitialisation

**Variables disponibles** :
- `{{ .Email }}`
- `{{ .TokenHash }}`
- `{{ .SiteURL }}`
- `{{ .RedirectTo }}`

---

### 3. Magic Link (Lien Magique)

**Quand** : Envoyé pour la connexion sans mot de passe

**Variables disponibles** :
- `{{ .Email }}`
- `{{ .TokenHash }}`
- `{{ .SiteURL }}`
- `{{ .RedirectTo }}`

---

### 4. Change Email Address (Changement d'Email)

**Quand** : Envoyé quand un utilisateur change son email

**Variables disponibles** :
- `{{ .Email }}`
- `{{ .TokenHash }}`
- `{{ .SiteURL }}`
- `{{ .RedirectTo }}`

---

### 5. Invite User (Invitation d'Utilisateur)

**Quand** : Envoyé quand un admin invite un utilisateur

**Variables disponibles** :
- `{{ .Email }}`
- `{{ .TokenHash }}`
- `{{ .SiteURL }}`
- `{{ .RedirectTo }}`
- `{{ .InvitedBy }}` : Email de la personne qui invite

---

## 🎨 Personnalisation Avancée

### Utiliser des Images

```html
<img src="{{ .SiteURL }}/logo.png" alt="Cartage Spa Logo" style="max-width: 200px;">
```

### Utiliser des Couleurs Personnalisées

```html
<div style="background: linear-gradient(135deg, #FFC300 0%, #ffb300 100%);">
  <!-- Contenu -->
</div>
```

### Ajouter des Liens

```html
<a href="{{ .SiteURL }}">Visitez notre site</a>
```

---

## ✅ Checklist de Configuration

- [ ] Accès à Supabase Dashboard → Authentication → Email Templates
- [ ] Template "Confirm signup" modifié
- [ ] Nom de l'expéditeur configuré
- [ ] Sujet de l'email personnalisé
- [ ] Contenu HTML personnalisé
- [ ] Contenu texte personnalisé (optionnel)
- [ ] Variables utilisées correctement
- [ ] Test d'envoi effectué
- [ ] Domaine personnalisé configuré (optionnel)

---

## 🧪 Tester les Templates

### Méthode 1 : Test Manuel

1. **Créez un compte de test** avec un email valide
2. **Vérifiez** votre boîte de réception
3. **Vérifiez** :
   - Le nom de l'expéditeur
   - Le sujet de l'email
   - Le contenu du message
   - Le lien de confirmation fonctionne

---

### Méthode 2 : Test via Supabase Dashboard

1. **Allez dans** Authentication → Users
2. **Créez un utilisateur de test**
3. **Cliquez sur** "Send confirmation email"
4. **Vérifiez** votre boîte de réception

---

## 🔧 Configuration SMTP Personnalisée

### Exemple avec SendGrid

1. **Créez un compte** sur SendGrid
2. **Générez une API Key**
3. **Dans Supabase** :
   - **SMTP Host** : `smtp.sendgrid.net`
   - **SMTP Port** : `587`
   - **SMTP User** : `apikey`
   - **SMTP Password** : `VOTRE_API_KEY_SENDGRID`
   - **Sender Email** : `noreply@cartagespa.com`
   - **Sender Name** : `Cartage Spa`

---

### Exemple avec Gmail SMTP

1. **Activez** "Less secure app access" dans votre compte Google
2. **Générez** un "App Password"
3. **Dans Supabase** :
   - **SMTP Host** : `smtp.gmail.com`
   - **SMTP Port** : `587`
   - **SMTP User** : `votre-email@gmail.com`
   - **SMTP Password** : `VOTRE_APP_PASSWORD`
   - **Sender Email** : `votre-email@gmail.com`
   - **Sender Name** : `Cartage Spa`

---

## 📚 Ressources

- **Documentation Supabase** : https://supabase.com/docs/guides/auth/auth-email-templates
- **Variables disponibles** : https://supabase.com/docs/guides/auth/auth-email-templates#variables
- **SMTP Configuration** : https://supabase.com/docs/guides/auth/auth-smtp

---

## 🆘 Problèmes Courants

### Problème 1 : Les Emails Ne Sont Pas Envoyés

**Solution** :
1. Vérifiez la configuration SMTP
2. Vérifiez que les emails ne sont pas dans les spams
3. Vérifiez les logs dans Supabase Dashboard

---

### Problème 2 : Le Nom de l'Expéditeur Ne Change Pas

**Solution** :
1. Vérifiez que vous avez configuré "From Name" dans le template
2. Vérifiez que vous avez configuré SMTP personnalisé
3. Certains fournisseurs SMTP ignorent le "From Name"

---

### Problème 3 : Les Variables Ne Fonctionnent Pas

**Solution** :
1. Vérifiez la syntaxe : `{{ .Variable }}` (avec espaces)
2. Vérifiez que la variable est disponible pour ce template
3. Testez avec une variable simple d'abord

---

## 🎯 Recommandations

1. **Utilisez un domaine personnalisé** pour plus de professionnalisme
2. **Testez tous les templates** avant de mettre en production
3. **Gardez les emails simples** et clairs
4. **Incluez toujours un lien de secours** (texte)
5. **Personnalisez selon votre marque** (couleurs, logo, style)

---

## 📝 Notes

- **Les templates sont sauvegardés automatiquement** dans Supabase
- **Les modifications prennent effet immédiatement**
- **Vous pouvez revenir aux templates par défaut** à tout moment
- **Les variables sont remplacées automatiquement** lors de l'envoi

