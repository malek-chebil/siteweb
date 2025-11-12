# 📅 Système d'Expiration des Annonces - Explication Complète

## 🎯 Vue d'ensemble

Le système d'expiration permet aux administrateurs de définir une date d'expiration pour les annonces approuvées. Une fois la date passée, les annonces sont automatiquement masquées du public et marquées comme "expirées".

---

## 🔄 Fonctionnement du Système

### 1. **Définition de la Date d'Expiration**

**Quand ?** Lors de l'approbation d'une annonce par un administrateur

**Comment ?**
- L'admin ouvre le modal d'approbation
- Il peut activer le switch "Définir une date d'expiration"
- Il sélectionne une date et heure via le `DatePickerInput`
- La date est enregistrée dans le champ `expires_at` de l'annonce

**Code :** `frontend/src/pages/AdminModerationPage.jsx` (lignes 24-25, 252-261)

```javascript
const [expirationDate, setExpirationDate] = useState(null)
const [hasExpiration, setHasExpiration] = useState(false)
```

**Backend :** `backend/app/routers/admin.py` (lignes 126-128)

```python
# Set expiration date if provided
if request.expires_at:
    listing.expires_at = request.expires_at
```

---

### 2. **Marquage Automatique des Annonces Expirées**

**Quand ?** 
- **Automatiquement** : Chaque fois qu'un admin ouvre la page de modération (`AdminModerationPage`)
- **Manuellement** : Via l'endpoint `/admin/listings/mark-expired` (admin uniquement)

**Comment ça marche ?**

1. Le système recherche toutes les annonces qui :
   - Ont le statut `APPROVED`
   - Ont une date `expires_at` définie (non null)
   - Ont une date `expires_at` <= maintenant (UTC)

2. Ces annonces sont automatiquement marquées avec le statut `EXPIRED`

**Code Frontend :** `frontend/src/pages/AdminModerationPage.jsx` (lignes 53-81)

```javascript
// Automatically mark expired listings when component mounts
useEffect(() => {
  markExpiredMutation.mutate()
}, [])
```

**Code Backend :** `backend/app/routers/admin.py` (lignes 24-55)

```python
@router.post("/listings/mark-expired")
async def mark_expired_listings(...):
    now = datetime.now(timezone.utc)
    
    # Find all approved listings that have expired
    result = await db.execute(
        select(Listing).where(
            and_(
                Listing.status == ListingStatus.APPROVED,
                Listing.expires_at.isnot(None),
                Listing.expires_at <= now
            )
        )
    )
    
    # Update status to EXPIRED
    for listing in expired_listings:
        listing.status = ListingStatus.EXPIRED
```

---

### 3. **Affichage des Annonces Expirées**

#### A. **Pour les Utilisateurs Non Authentifiés**
- ❌ **Ne voient PAS** les annonces expirées
- ✅ Voient uniquement les annonces `APPROVED` avec :
  - `expires_at` = null (pas de date d'expiration), OU
  - `expires_at` > maintenant (pas encore expirées)

**Code :** `backend/app/routers/listings.py` (lignes 119-130)

```python
if not current_user_id:
    now = datetime.now(timezone.utc)
    query = query.where(
        and_(
            Listing.status == ListingStatus.APPROVED,
            or_(
                Listing.expires_at.is_(None),
                Listing.expires_at > now
            )
        )
    )
```

#### B. **Pour les Utilisateurs Authentifiés (Non-Admin)**
- ❌ **Ne voient PAS** les annonces expirées des autres utilisateurs
- ✅ Voient leurs propres annonces (même si expirées)
- ✅ Voient les annonces `APPROVED` non expirées des autres

**Code :** `backend/app/routers/listings.py` (lignes 143-157)

```python
# Regular users see approved (non-expired) + their own
now = datetime.now(timezone.utc)
query = query.where(
    or_(
        and_(
            Listing.status == ListingStatus.APPROVED,
            or_(
                Listing.expires_at.is_(None),
                Listing.expires_at > now
            ),
            Listing.status != ListingStatus.EXPIRED
        ),
        Listing.user_id == current_user_id  # Users can see their own
    )
)
```

#### C. **Pour les Administrateurs**
- ✅ **Voient TOUTES** les annonces, y compris les expirées
- ✅ Peuvent filtrer par statut (pending, approved, rejected, expired)

**Code :** `backend/app/routers/listings.py` (lignes 138-141)

```python
if is_admin:
    # Admins can see all listings (filtered by status if provided)
    if filters.status:
        query = query.where(Listing.status == filters.status)
```

---

### 4. **Affichage Visuel de l'Expiration**

#### Dans le Tableau Admin (`AdminModerationPage`)
- **Colonne "Expiration"** affiche :
  - Temps restant : `5j 12h` ou `12h` (si < 1 jour)
  - Date complète : `DD/MM/YY HH:mm`
  - Badge de statut :
    - 🟢 **Vert** : Actif (plus de 7 jours)
    - 🟠 **Orange** : Expire bientôt (≤ 7 jours)
    - 🔴 **Rouge** : Expiré

**Code :** `frontend/src/pages/AdminModerationPage.jsx` (lignes 474-514)

#### Dans "Mes Annonces" (`MyListingsPage`)
- Badge avec icône sablier
- Affiche le temps restant ou "Expiré"
- Couleur selon l'état (rouge/orange/bleu)

**Code :** `frontend/src/pages/MyListingsPage.jsx` (lignes 113-128)

#### Dans le Profil Utilisateur (`UserProfilePage`)
- Carte "Expirées" avec compteur
- Affiche le nombre total d'annonces expirées

**Code :** `frontend/src/pages/UserProfilePage.jsx` (lignes 229-247)

---

## 📊 États d'une Annonce

| Statut | Description | Visible Public | Visible Propriétaire | Visible Admin |
|--------|-------------|----------------|---------------------|---------------|
| `PENDING` | En attente de modération | ❌ | ✅ | ✅ |
| `APPROVED` | Approuvée et active | ✅ | ✅ | ✅ |
| `APPROVED` (avec `expires_at` passée) | Approuvée mais date passée | ❌ | ✅ | ✅ |
| `EXPIRED` | Marquée comme expirée | ❌ | ✅ | ✅ |
| `REJECTED` | Rejetée | ❌ | ✅ | ✅ |

---

## 🔧 Points Techniques Importants

### 1. **Fuseau Horaire**
- Toutes les dates sont stockées en **UTC** (`timezone.utc`)
- Les comparaisons se font toujours en UTC
- L'affichage peut être converti dans le fuseau local du navigateur

### 2. **Marquage Automatique**
- ⚠️ **Actuellement** : Le marquage se fait uniquement quand un admin ouvre la page de modération
- 💡 **Recommandation** : Mettre en place une tâche cron/scheduled task pour marquer automatiquement les annonces expirées toutes les heures/jours

### 3. **Annonces Sans Date d'Expiration**
- Si `expires_at = null`, l'annonce reste active indéfiniment
- Elle ne sera jamais automatiquement marquée comme expirée

### 4. **Réapprobation d'une Annonce Expirée**
- Un admin peut réapprouver une annonce expirée
- Il peut définir une nouvelle date d'expiration
- L'annonce redevient visible publiquement

---

## 🚀 Améliorations Possibles

### 1. **Tâche Automatique (Cron)**
Créer une tâche qui s'exécute périodiquement pour marquer les annonces expirées :

```python
# backend/app/tasks/expire_listings.py
async def mark_expired_listings_task():
    # Appelle /admin/listings/mark-expired automatiquement
    pass
```

### 2. **Notifications**
- Notifier les utilisateurs X jours avant l'expiration
- Notifier les utilisateurs quand leur annonce expire

### 3. **Renouvellement**
- Permettre aux utilisateurs de renouveler leurs annonces expirées
- Système de paiement pour prolonger l'expiration

### 4. **Statistiques**
- Graphique des annonces expirées par période
- Taux d'expiration moyen

---

## 📝 Résumé

1. **Admin définit** une date d'expiration lors de l'approbation
2. **Système vérifie** automatiquement les annonces expirées (quand admin ouvre modération)
3. **Annonces expirées** sont marquées avec le statut `EXPIRED`
4. **Public ne voit pas** les annonces expirées
5. **Propriétaires voient** leurs annonces expirées dans "Mes annonces"
6. **Admins voient** toutes les annonces, y compris expirées

---

## 🔍 Fichiers Clés

- **Backend** :
  - `backend/app/routers/admin.py` : Endpoint `mark-expired` et approbation
  - `backend/app/routers/listings.py` : Filtrage des annonces expirées
  - `backend/app/models.py` : Modèle `Listing` avec `expires_at`

- **Frontend** :
  - `frontend/src/pages/AdminModerationPage.jsx` : Interface admin + marquage auto
  - `frontend/src/pages/MyListingsPage.jsx` : Affichage pour utilisateurs
  - `frontend/src/pages/UserProfilePage.jsx` : Statistiques utilisateur


