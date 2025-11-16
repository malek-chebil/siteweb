# How to Use Admin Panel - Quick Guide

## Step 1: Make Yourself Admin

1. **Go to Supabase Dashboard**
2. **Navigate to SQL Editor**
3. **Run this SQL:**

```sql
UPDATE users 
SET is_admin = true 
WHERE email = 'your-email@example.com';
```

Replace `'your-email@example.com'` with your actual email address.

## Step 2: Access Admin Panel

### Option 1: Via Header Button
1. **Log in** with your admin account
2. **Click "Panneau admin"** button in the header
3. You'll be redirected to `/admin`

### Option 2: Direct URL
1. **Log in** with your admin account
2. **Go to**: `http://localhost:5173/admin`
3. You'll see the admin dashboard

## Step 3: Moderate Listings

### View Pending Listings
1. **Click "Annonces en attente"** in the sidebar (or go to `/admin/moderation?status=pending`)
2. You'll see all pending listings in a table
3. Each listing shows:
   - ID
   - Title
   - City
   - Category
   - Price
   - User email
   - Status
   - Action buttons

### Approve a Listing
1. **Click "Approuver"** button on a pending listing
2. **Optional**: Add a reason in the modal
3. **Click "Approuver"** to confirm
4. Listing status changes to `approved`
5. Listing becomes visible to everyone on homepage

### Reject a Listing
1. **Click "Rejeter"** button on a pending listing
2. **Required**: Add a reason in the modal
3. **Click "Rejeter"** to confirm
4. Listing status changes to `rejected`
5. Listing is hidden from public view

## Admin Panel Features

### Dashboard (`/admin`)
- **Statistics Cards**:
  - Pending listings count
  - Approved listings count
  - Rejected listings count
  - Total users count

### Moderation Page (`/admin/moderation`)
- **Filter by Status**:
  - Pending listings
  - Approved listings
  - Rejected listings
- **View Listing Details**:
  - ID, title, city, category, price
  - User email
  - Status badge
- **Actions**:
  - Approve button (green)
  - Reject button (red)
- **Pagination**: Navigate through pages of listings

## Current Workflow

### 1. User Creates Listing
- User fills out form and submits
- Listing is created with status: `pending`
- Listing is saved to database
- Images are uploaded to Supabase Storage

### 2. Admin Reviews Listing
- Admin goes to `/admin/moderation`
- Admin sees pending listings
- Admin can view listing details
- Admin can approve or reject

### 3. Admin Approves Listing
- Admin clicks "Approuver"
- Optional: Adds reason
- Listing status changes to `approved`
- Moderation log is created
- Listing becomes visible to everyone

### 4. Admin Rejects Listing
- Admin clicks "Rejeter"
- Required: Adds reason
- Listing status changes to `rejected`
- Moderation log is created
- Listing is hidden from public

### 5. Listing Visibility
- **Pending**: Only visible to owner and admins
- **Approved**: Visible to everyone (homepage, search)
- **Rejected**: Only visible to owner and admins

## Troubleshooting

### Can't Access Admin Panel
**Problem**: Getting "Access Denied" or redirected to login

**Solutions**:
1. **Check**: User is logged in
2. **Check**: User has `is_admin = true` in database
3. **Check**: Run the SQL query again to set admin status
4. **Check**: Log out and log back in after setting admin status

### Can't See Pending Listings
**Problem**: No listings shown in moderation page

**Solutions**:
1. **Check**: Filter is set to "pending" (default)
2. **Check**: Listings exist with status `pending`
3. **Check**: Backend server is running
4. **Check**: API endpoint is accessible

### Approve/Reject Not Working
**Problem**: Buttons don't work or show error

**Solutions**:
1. **Check**: Backend server is running
2. **Check**: User is authenticated
3. **Check**: User has admin privileges
4. **Check**: Browser console for errors
5. **Check**: Network tab for failed requests

## Admin Panel URLs

- **Dashboard**: `http://localhost:5173/admin`
- **Moderation (Pending)**: `http://localhost:5173/admin/moderation?status=pending`
- **Moderation (Approved)**: `http://localhost:5173/admin/moderation?status=approved`
- **Moderation (Rejected)**: `http://localhost:5173/admin/moderation?status=rejected`

## Next Steps

After setting up admin access:
1. **Test the workflow**: Create a test listing, then approve it
2. **Check visibility**: Verify approved listings appear on homepage
3. **Check moderation logs**: View moderation history in database
4. **Monitor statistics**: Check dashboard for counts

---

**Status**: ✅ Admin panel is fully functional and ready to use!


