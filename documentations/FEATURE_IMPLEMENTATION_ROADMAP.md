# Feature Implementation Roadmap

This document tracks the implementation of all suggested features for the classifieds platform.

## Features to Implement

### ✅ Completed Features
- [x] User authentication and registration
- [x] Listing creation and management
- [x] Admin moderation system
- [x] Expiration dates for paid listings
- [x] User management in admin panel
- [x] Username field for users
- [x] Responsive design and modern UI
- [x] **Featured Listings** — Highlight premium listings
- [x] **Category Icons** — Visual category representation
- [x] **Favorites System** — Save favorite listings

### 🚧 In Progress
- [ ] Map View — show listings on a map

### 📋 Planned Features

1. **Featured Listings** — Highlight premium listings ✅
   - [x] Add `is_featured` field to Listing model
   - [x] Create migration (005_add_is_featured_to_listings)
   - [x] Update schemas (ListingBase, ListingUpdate, ListingFilters, ApproveListingRequest)
   - [x] Add featured badge/indicator on listing cards
   - [x] Add featured section on homepage
   - [x] Admin option to mark listings as featured
   - [x] Featured listings appear first in listings
   - [x] Filter support for featured listings
   - [ ] Payment integration for featured status (future - Phase 6)

2. **Category Icons** — Visual category representation ✅
   - [x] Create icon mapping for categories
   - [x] Add icons to listing cards
   - [x] Add icons to filters
   - [x] Add icons to category selection
   - [x] Add icons to listing detail page

3. **Favorites System** — Save favorite listings ✅
   - [x] Create Favorite model
   - [x] Create migration (006_add_favorites_table)
   - [x] Add favorite endpoints (add/remove/get/check)
   - [x] Add favorite button to listing cards
   - [x] Create favorites page
   - [x] Add favorites link to navigation
   - [x] Prevent editing approved listings

4. **Map View** — Show listings on a map
   - [ ] Integrate map library (Leaflet or Google Maps)
   - [ ] Add coordinates to listings (lat/lng)
   - [ ] Create map view component
   - [ ] Add map toggle on homepage
   - [ ] Show listing markers on map
   - [ ] Add map to listing detail page

5. **User Profiles** — Detailed user pages
   - [ ] Create user profile page
   - [ ] Display user's listings
   - [ ] Display user statistics
   - [ ] Add profile picture support
   - [ ] Add user bio/description
   - [ ] Add contact information

6. **Payment Integration** — For featured listings
   - [ ] Research payment gateway (Stripe/PayPal)
   - [ ] Create payment endpoints
   - [ ] Add payment UI
   - [ ] Link payments to featured status
   - [ ] Add payment history

7. **Reviews/Ratings** — User feedback system
   - [ ] Create Review model
   - [ ] Create migration
   - [ ] Add review endpoints
   - [ ] Add review form on listing detail
   - [ ] Display reviews on listing detail
   - [ ] Calculate average rating
   - [ ] Add rating to listing cards

8. **Advanced Search** — Autocomplete, suggestions
   - [ ] Implement search autocomplete
   - [ ] Add search suggestions
   - [ ] Add recent searches
   - [ ] Add popular searches
   - [ ] Add search filters sidebar
   - [ ] Add search result highlighting

## Implementation Status

### Phase 1: Featured Listings (Current)
**Status**: In Progress
**Started**: 2025-01-15

#### Tasks:
- [x] Create roadmap documentation
- [ ] Add `is_featured` field to Listing model
- [ ] Create migration for featured field
- [ ] Update schemas
- [ ] Add featured badge to ListingCard
- [ ] Create featured section on homepage
- [ ] Add admin option to mark as featured
- [ ] Update listing filters to include featured

#### Notes:
- Featured listings are displayed prominently on the homepage with a dedicated section
- Featured listings appear first in all listing queries (ordered by is_featured DESC, then created_at DESC)
- Admin can mark any listing as featured when approving it
- Featured badge appears on listing cards with a star icon
- Future: Payment integration will allow users to pay for featured status (Phase 6)

#### Implementation Details:
**Backend:**
- Added `is_featured: Boolean` field to Listing model (default: False, indexed)
- Migration: `005_add_is_featured_to_listings.py`
- Updated schemas: `ListingBase`, `ListingUpdate`, `ListingFilters`, `ApproveListingRequest`
- Featured listings are ordered first in all queries
- Filter support: `?is_featured=true` to filter only featured listings

**Frontend:**
- Featured badge on `ListingCard` component (yellow badge with star icon, top-left)
- Featured section on homepage (shows up to 4 featured listings)
- Admin approval modal includes "Mettre en vedette" switch
- Featured listings automatically appear first in listings

**Files Modified:**
- `backend/app/models.py` - Added is_featured field
- `backend/app/schemas.py` - Updated all listing schemas
- `backend/app/routers/listings.py` - Added ordering and filter support
- `backend/app/routers/admin.py` - Added featured support to approval
- `frontend/src/components/ListingCard.jsx` - Added featured badge
- `frontend/src/pages/HomePage.jsx` - Added featured section
- `frontend/src/pages/AdminModerationPage.jsx` - Added featured switch

---

### Phase 2: Category Icons (Current)
**Status**: ✅ Complete
**Started**: 2025-01-15
**Completed**: 2025-01-15

#### Tasks:
- [x] Create category icon mapping utility
- [x] Add icons to ListingCard component
- [x] Add icons to FiltersBar category select
- [x] Add icons to ListingEditorPage category select
- [x] Add icons to ListingDetailPage

#### Notes:
- Icons are displayed next to category names throughout the application
- Uses Tabler Icons for consistency
- Default icon (IconCategory) for unknown categories
- Icons appear in:
  - Listing cards (badge)
  - Filter dropdown (with icon in option)
  - Listing editor (with icon in dropdown)
  - Listing detail page (badge)

#### Implementation Details:
**Frontend:**
- Created `frontend/src/utils/categoryIcons.js` utility
- Icon mapping:
  - Massage à domicile → IconMassage
  - Salon de beauté → IconScissors
  - Hôtel → IconBuildingStore
  - Spa → IconDroplet
  - Autre → IconCategory (default)
- Icons displayed in Select components with `renderOption` prop
- Icons displayed in Badge components with `leftSection` prop

**Files Modified:**
- `frontend/src/utils/categoryIcons.js` - New utility file
- `frontend/src/components/ListingCard.jsx` - Added icon to category badge
- `frontend/src/components/FiltersBar.jsx` - Added icons to category select
- `frontend/src/pages/ListingDetailPage.jsx` - Added icon to category badge
- `frontend/src/pages/ListingEditorPage.jsx` - Added icons to category select

---

### Phase 3: Favorites System (Current)
**Status**: ✅ Complete
**Started**: 2025-01-15
**Completed**: 2025-01-15

#### Tasks:
- [x] Create Favorite model
- [x] Create migration (006_add_favorites_table)
- [x] Create favorite schemas (FavoriteResponse, FavoriteListResponse)
- [x] Create favorite endpoints (GET, POST, DELETE, GET check)
- [x] Add favorite button to ListingCard component
- [x] Create FavoritesPage to display user favorites
- [x] Add favorites route to router
- [x] Add favorites link to navigation
- [x] Prevent editing approved listings

#### Notes:
- Users can favorite/unfavorite listings with a heart icon
- Favorites are stored per user (unique constraint: user_id + listing_id)
- Favorite button appears on listing cards (only for authenticated users)
- Favorites page shows all user's favorited listings
- Heart icon in navigation for quick access
- Approved listings cannot be edited by users (only admins can edit them)

#### Implementation Details:
**Backend:**
- Created `Favorite` model with user_id, listing_id, created_at
- Unique constraint on (user_id, listing_id) to prevent duplicates
- Endpoints:
  - `GET /favorites` - Get user's favorites (paginated)
  - `POST /favorites/{listing_id}` - Add to favorites
  - `DELETE /favorites/{listing_id}` - Remove from favorites
  - `GET /favorites/check/{listing_id}` - Check if favorited
- Eager loading of listing relationships (media, user)

**Frontend:**
- Favorite button (heart icon) on ListingCard component
- Heart icon filled (red) when favorited, outline when not
- FavoritesPage displays all user's favorites
- Navigation link with heart icon
- Real-time updates when favoriting/unfavoriting
- Error handling and notifications

**Files Modified:**
- `backend/app/models.py` - Added Favorite model
- `backend/app/schemas.py` - Added FavoriteResponse, FavoriteListResponse
- `backend/app/routers/favorites.py` - New router file
- `backend/app/routers/listings.py` - Added restriction for editing approved listings
- `backend/app/main.py` - Added favorites router
- `frontend/src/components/ListingCard.jsx` - Added favorite button
- `frontend/src/pages/FavoritesPage.jsx` - New page
- `frontend/src/pages/ListingEditorPage.jsx` - Added check for approved listings
- `frontend/src/pages/MyListingsPage.jsx` - Disabled edit button for approved listings
- `frontend/src/router.jsx` - Added favorites route
- `frontend/src/layouts/Layout.jsx` - Added favorites navigation link
- `frontend/src/i18n/locales/fr.json` - Added favorites translation

---

## Technical Decisions

### Database Changes
- All new fields will be nullable initially to support existing data
- Migrations will be created for each feature

### Frontend Components
- New components will follow existing Mantine UI patterns
- All new features will be responsive
- Translations will be added for all new text

### Backend Endpoints
- All new endpoints will follow RESTful conventions
- Admin endpoints will be protected
- User endpoints will require authentication where appropriate

---

## Next Steps

1. Complete Featured Listings implementation
2. Move to Category Icons
3. Continue with remaining features in order

---

*Last Updated: 2025-01-15*

