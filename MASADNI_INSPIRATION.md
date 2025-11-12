# Masadni.com Inspiration - Listing Detail Page

## Reference Website
Based on: https://masadni.com/masseuse/massage-adaptees-a-vos-besoins_i8238

## Key Features to Implement

### 1. Layout Structure
- **Two-column layout**: Main content (left) + Sidebar (right)
- **Breadcrumbs**: Home > Category > Listing Title
- **Back button**: Easy navigation
- **Responsive**: Stack on mobile

### 2. Main Content Area
- **Image carousel**: Multiple images with indicators
- **Title**: Large, prominent heading
- **Price**: Displayed prominently in badge
- **Location**: City with location icon
- **Category**: Badge
- **Date posted**: "Posted: X ago" format
- **Views count**: "X views"
- **Description**: Full text description with proper formatting
- **Safety warning**: Important security message
- **Comments section**: Placeholder for future comments

### 3. Sidebar
- **Contact information**:
  - Phone number (displayed and copyable)
  - Call button
  - WhatsApp chat button
  - Send SMS button
  - Copy number button
- **Seller information**:
  - Seller name/email
  - Contact seller button
  - View seller's profile link
- **Action buttons**:
  - Print listing
  - Share listing
  - Report listing

### 4. Related Listings
- **Section title**: "You may also like..."
- **Related listings**: Same category/city
- **Card grid**: 3-4 listings
- **Exclude current listing**

### 5. Additional Features
- **Print functionality**: Print-friendly page
- **Share functionality**: Web Share API or copy link
- **Report functionality**: Report listing (spam, misclassified, etc.)
- **View tracking**: Increment views on page load
- **Relative dates**: "1 month ago" format
- **Safety message**: Warning about deposits and payments

## Implementation Status

### ✅ Completed
- Two-column responsive layout
- Image carousel
- Title and price display
- Location and category badges
- Date posted (relative time)
- Views count (backend tracking)
- Description section
- Safety warning alert
- Contact buttons (Call, WhatsApp, SMS)
- Copy number functionality
- Print functionality
- Share functionality
- Report button
- Related listings section
- Breadcrumbs navigation
- Seller information display

### 📝 To Do (Future)
- Comments system
- Seller profile page
- View seller's other listings
- Advanced reporting options
- Print stylesheet
- Share preview (OG tags)
- Favorite/bookmark functionality
- Email contact option

## Design Notes

### Colors
- Primary: Yellow (#FFC300)
- Success: Green (for price, WhatsApp)
- Info: Blue (for phone, call)
- Warning: Yellow (for safety alert)

### Typography
- Title: Large, bold, yellow accent
- Price: Large badge, green
- Description: Readable line height
- Meta info: Smaller, dimmed

### Spacing
- Consistent padding and margins
- Good visual hierarchy
- Proper grouping of related elements

### Icons
- Phone icon for calls
- WhatsApp icon for chat
- Message icon for SMS
- Copy icon for copying
- Print icon for printing
- Share icon for sharing
- Flag icon for reporting
- Location icon for city
- Alert icon for warnings

## Backend Changes

### Model Updates
- Added `views_count` field to Listing model
- Default value: 0
- Increments on each view (for non-owners)

### Schema Updates
- Added `views_count` to ListingResponse
- Added `user` relationship to ListingResponse
- User information included in response

### API Updates
- GET `/listings/{id}` increments views_count
- User information loaded with listing
- Views only tracked for approved listings shown to non-owners

## Frontend Changes

### New Components
- Enhanced ListingDetailPage with two-column layout
- Related listings section
- Contact information sidebar
- Action buttons (print, share, report)
- Safety warning alert
- Breadcrumbs navigation

### New Dependencies
- @tabler/icons-react (for icons)
- dayjs relativeTime plugin (for "X ago" format)

### Styling
- Responsive grid layout
- Proper spacing and padding
- Consistent button styling
- Alert styling for safety message
- Card styling for related listings

## Testing Checklist

- [ ] Listing detail page loads correctly
- [ ] Images display in carousel
- [ ] Contact buttons work (call, WhatsApp, SMS)
- [ ] Copy number works
- [ ] Print functionality works
- [ ] Share functionality works
- [ ] Related listings display correctly
- [ ] Views count increments
- [ ] Safety warning displays
- [ ] Breadcrumbs work
- [ ] Responsive on mobile
- [ ] Seller information displays
- [ ] Report button works

## Next Steps

1. Add database migration for views_count
2. Test views tracking
3. Implement comments system
4. Add seller profile page
5. Add favorite/bookmark functionality
6. Improve print styles
7. Add OG tags for sharing
8. Add email contact option


