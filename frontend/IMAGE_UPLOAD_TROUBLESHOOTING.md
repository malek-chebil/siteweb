# Image Upload Troubleshooting Guide

## Problem
Image upload field is not working properly.

## Common Issues and Solutions

### 1. User Not Authenticated
**Symptom**: Upload fails immediately or shows "Authentification requise" alert.

**Solution**: 
- User must be logged in to upload images
- Supabase Storage requires authentication for uploads
- Check if user is logged in by looking at the auth state

**Fix**: Make sure you're logged in before trying to upload images.

### 2. Storage Bucket Doesn't Exist
**Symptom**: Error message "Le bucket 'listing-images' n'existe pas"

**Solution**: 
1. Go to Supabase Dashboard
2. Navigate to Storage
3. Click "New bucket"
4. Name it: `listing-images`
5. Make it **Public** (toggle ON)
6. Click "Create bucket"

### 3. Storage Policies Not Configured
**Symptom**: Error "Permissions insuffisantes" or "new row violates row-level security policy"

**Solution**: Set up Storage policies in Supabase:

1. Go to Storage > Policies
2. Click on `listing-images` bucket
3. Add these policies:

#### Public Read Policy:
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'listing-images');
```

#### Authenticated Upload Policy:
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'listing-images' 
  AND auth.role() = 'authenticated'
);
```

#### User Delete Policy (optional):
```sql
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'listing-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### 4. File Size Too Large
**Symptom**: Error "L'image est trop grande (max 5MB)"

**Solution**: 
- Reduce image size
- Compress images before uploading
- Maximum file size is 5MB per image

### 5. Invalid File Type
**Symptom**: Upload rejected or error message

**Solution**: 
- Only image files are allowed (jpg, png, gif, webp)
- Check file extension
- Convert to supported format if needed

### 6. Network/CORS Issues
**Symptom**: Upload fails with network error

**Solution**: 
- Check internet connection
- Check browser console for CORS errors
- Verify Supabase URL and keys in `.env` file

### 7. Environment Variables Missing
**Symptom**: Error "Missing Supabase environment variables"

**Solution**: 
1. Check `frontend/.env` file exists
2. Verify it contains:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_API_URL=http://localhost:8000/api/v1
   ```
3. Restart frontend server after updating `.env`

## Debugging Steps

### Step 1: Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for error messages
4. Check for upload errors

### Step 2: Check Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Try uploading an image
4. Look for failed requests
5. Check request/response details

### Step 3: Check Supabase Storage
1. Go to Supabase Dashboard
2. Navigate to Storage
3. Check if `listing-images` bucket exists
4. Check if files are being uploaded
5. Check bucket policies

### Step 4: Verify Authentication
1. Check if user is logged in
2. Verify Supabase auth session is active
3. Check browser console for auth errors

### Step 5: Test Upload Manually
1. Go to Supabase Dashboard > Storage
2. Try uploading a file manually
3. Check if it works
4. This helps identify if issue is with code or Supabase

## Quick Fix Checklist

- [ ] User is logged in
- [ ] Storage bucket `listing-images` exists
- [ ] Bucket is set to **Public**
- [ ] Storage policies are configured
- [ ] File size is under 5MB
- [ ] File type is an image (jpg, png, etc.)
- [ ] Environment variables are set correctly
- [ ] Frontend server is running
- [ ] No errors in browser console
- [ ] No CORS errors in network tab

## Testing

### Test 1: Basic Upload
1. Log in to the application
2. Go to "Ajouter une annonce"
3. Click on image upload area
4. Select an image file
5. Check if it uploads successfully

### Test 2: Multiple Images
1. Try uploading multiple images at once
2. Check if all upload successfully
3. Verify images display correctly

### Test 3: Error Cases
1. Try uploading without being logged in
2. Try uploading a file that's too large
3. Try uploading a non-image file
4. Verify error messages are shown

## Still Not Working?

If image upload still doesn't work after checking all above:

1. **Check browser console** for specific error messages
2. **Check Supabase Dashboard** for storage errors
3. **Verify Supabase credentials** in `.env` file
4. **Test with a simple file** to isolate the issue
5. **Check Supabase Storage logs** for detailed errors

## Common Error Messages

### "Vous devez être connecté pour uploader des images"
- **Cause**: User not authenticated
- **Fix**: Log in before uploading

### "Le bucket 'listing-images' n'existe pas"
- **Cause**: Storage bucket not created
- **Fix**: Create bucket in Supabase Storage

### "Permissions insuffisantes"
- **Cause**: Storage policies not configured
- **Fix**: Set up RLS policies in Supabase

### "L'image est trop grande"
- **Cause**: File size exceeds 5MB
- **Fix**: Reduce image size or compress

### "Erreur d'accès au stockage"
- **Cause**: Supabase configuration issue
- **Fix**: Check Supabase URL and keys

---

**If you're still having issues, check the browser console for specific error messages and share them for further debugging.**


