# Admin Workflow Guide

## Admin Panel Access

### URL
- **Admin Dashboard**: `http://localhost:5173/admin`
- **Admin Moderation**: `http://localhost:5173/admin/moderation`

### Requirements
1. **User must be logged in**
2. **User must have `is_admin = true` in the database**

### How to Make a User Admin

Run this SQL in Supabase SQL Editor:

```sql
UPDATE users 
SET is_admin = true 
WHERE email = 'your-email@example.com';
```

Replace `'your-email@example.com'` with the email of the user you want to make admin.

## Current Workflow

### 1. User Creates Listing
- User logs in
- User goes to "Ajouter une annonce" (Add Listing)
- User fills out form (title, description, city, category, price, phone, WhatsApp, images)
- User submits form
- **Listing status: `pending`** (default)

### 2. Admin Reviews Listing
- Admin logs in (with admin account)
- Admin goes to `/admin/moderation`
- Admin sees all listings (filtered by status: pending, approved, rejected)
- Admin can:
  - View listing details
  - **Approve** listing (changes status to `approved`)
  - **Reject** listing (changes status to `rejected`, requires reason)

### 3. Listing Visibility
- **Pending listings**: Only visible to owner and admins
- **Approved listings**: Visible to everyone (public)
- **Rejected listings**: Only visible to owner and admins

### 4. After Approval
- Approved listings appear on homepage
- Anyone can view approved listings
- Listing appears in search results
- Listing can be viewed by clicking on it

## Admin Features

### Admin Dashboard (`/admin`)
- Shows statistics:
  - Pending listings count
  - Approved listings count
  - Rejected listings count
  - Total users count

### Admin Moderation Page (`/admin/moderation`)
- Lists all listings in a table
- Filter by status (pending, approved, rejected)
- View listing details
- Approve/Reject buttons
- Moderation logs (history of approvals/rejections)

## Admin Actions

### Approve Listing
1. Click "Approve" button on a pending listing
2. Optional: Add a reason (stored in moderation log)
3. Click "Approve" in modal
4. Listing status changes to `approved`
5. Listing becomes visible to everyone

### Reject Listing
1. Click "Reject" button on a pending listing
2. **Required**: Add a reason (required field)
3. Click "Reject" in modal
4. Listing status changes to `rejected`
5. Listing is hidden from public view

## Moderation Logs

Every approval/rejection is logged in the `moderation_logs` table:
- `listing_id`: Which listing was moderated
- `action`: "approve" or "reject"
- `reason`: Reason provided by admin
- `moderator_id`: Admin user ID
- `created_at`: When the action was taken

## Database Schema

### Listing Statuses
- `pending`: Waiting for admin approval
- `approved`: Approved and visible to public
- `rejected`: Rejected and hidden from public

### User Roles
- `is_admin = false`: Regular user (can create listings, view own listings)
- `is_admin = true`: Admin user (can approve/reject listings, view all listings)

## Testing the Workflow

### Step 1: Create Admin User
```sql
UPDATE users 
SET is_admin = true 
WHERE email = 'admin@example.com';
```

### Step 2: Create Test Listing
1. Log in as regular user
2. Go to "Ajouter une annonce"
3. Fill out form and submit
4. Listing should have status `pending`

### Step 3: Approve Listing
1. Log in as admin user
2. Go to `/admin/moderation`
3. You should see the pending listing
4. Click "Approve" button
5. Add reason (optional) and confirm
6. Listing status changes to `approved`

### Step 4: Verify Listing is Public
1. Log out or use incognito window
2. Go to homepage
3. Approved listing should be visible
4. Click on listing to view details

## Troubleshooting

### Can't Access Admin Panel
- **Check**: User is logged in
- **Check**: User has `is_admin = true` in database
- **Check**: Admin route is protected by `AdminRoute` component

### Can't See Pending Listings
- **Check**: Admin is logged in
- **Check**: Filter is set to "pending" (default)
- **Check**: Listings exist with status `pending`

### Approve/Reject Not Working
- **Check**: Backend server is running
- **Check**: Admin user is authenticated
- **Check**: API endpoints are accessible
- **Check**: Browser console for errors

## Next Steps

### Improvements to Consider
1. **Email notifications**: Notify users when listing is approved/rejected
2. **Bulk actions**: Approve/reject multiple listings at once
3. **Advanced filtering**: Filter by city, category, date, etc.
4. **Listing preview**: Show full listing details before approving
5. **Moderation queue**: Show only pending listings by default
6. **Admin dashboard**: Add more statistics and charts
7. **User management**: Admin can manage users (ban, delete, etc.)

---

**Current Status**: ✅ Admin workflow is fully functional
- Admin can approve/reject listings
- Moderation logs are created
- Listings visibility is controlled by status
- Admin panel is accessible at `/admin/moderation`


