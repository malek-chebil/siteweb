# Supabase Storage Setup Guide

## Problem
Images not showing after upload - this is usually due to missing or incorrectly configured Supabase Storage bucket.

## Solution: Set Up Supabase Storage

### Step 1: Create Storage Bucket

1. **Go to Supabase Dashboard**:
   - Navigate to your project
   - Click on "Storage" in the left sidebar

2. **Create New Bucket**:
   - Click "New bucket" button
   - Name: `listing-images`
   - **Make it Public** (toggle "Public bucket" to ON)
   - Click "Create bucket"

### Step 2: Configure Bucket Policies

1. **Go to Storage > Policies**:
   - Click on the `listing-images` bucket
   - Go to "Policies" tab

2. **Create Public Read Policy**:
   ```sql
   -- Allow public read access
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'listing-images');
   ```

3. **Create Upload Policy**:
   ```sql
   -- Allow authenticated users to upload
   CREATE POLICY "Authenticated users can upload"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'listing-images' 
     AND auth.role() = 'authenticated'
   );
   ```

4. **Create Delete Policy** (optional):
   ```sql
   -- Allow users to delete their own files
   CREATE POLICY "Users can delete own files"
   ON storage.objects FOR DELETE
   USING (
     bucket_id = 'listing-images'
     AND auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

### Step 3: Verify Setup

1. **Check Bucket Exists**:
   - Go to Storage > Buckets
   - Verify `listing-images` bucket exists
   - Verify it's marked as "Public"

2. **Test Upload**:
   - Try uploading an image through the frontend
   - Check browser console for errors
   - Check Network tab for upload requests

3. **Check Files**:
   - Go to Storage > listing-images
   - Verify files are being uploaded
   - Check file URLs are accessible

## Quick Setup (Simplified)

### Option 1: Public Bucket (Easiest)

1. Create bucket: `listing-images`
2. Toggle "Public bucket" to ON
3. That's it! No policies needed for public buckets

### Option 2: Private Bucket with Policies

1. Create bucket: `listing-images`
2. Keep it private
3. Add the policies above

## Troubleshooting

### Issue 1: "Bucket does not exist"
**Solution**: Create the bucket in Supabase Storage

### Issue 2: "Permission denied"
**Solution**: 
- Make bucket public, OR
- Add proper RLS policies
- Verify user is authenticated

### Issue 3: "Upload fails silently"
**Solution**:
- Check browser console for errors
- Verify bucket exists
- Check file size (max 5MB)
- Check file type (images only)

### Issue 4: "Images upload but don't display"
**Solution**:
- Check image URLs are correct
- Verify bucket is public
- Check CORS settings
- Verify public URL is accessible

## Verification Steps

1. **Check Bucket**:
   - Storage > Buckets > listing-images exists
   - Bucket is Public

2. **Test Upload**:
   - Upload an image through frontend
   - Check browser console for errors
   - Verify file appears in Storage

3. **Test Access**:
   - Copy image URL from Storage
   - Open in new tab
   - Should display image

4. **Check Policies** (if private):
   - Storage > Policies
   - Verify policies are active
   - Check policy conditions

## Common Errors

### Error: "new row violates row-level security policy"
**Solution**: Add RLS policies or make bucket public

### Error: "Bucket not found"
**Solution**: Create the bucket in Supabase Storage

### Error: "Permission denied"
**Solution**: Check bucket policies and authentication

### Error: "File too large"
**Solution**: Reduce file size (max 5MB per image)

---

**After setting up Storage, images should upload and display correctly!**


