# Supabase Account Limits

## Free Tier Limits

### Storage
- **File Storage**: 1 GB per project (all buckets combined)
- **Max File Size**: 50 MB per file
- **Bandwidth**: 5 GB cached + 5 GB uncached = 10 GB/month

### Database
- **Database Storage**: 500 MB per project
- **Database Size**: 500 MB total

### API & Auth
- **API Requests**: Unlimited
- **Monthly Active Users**: 50,000
- **Auth Providers**: Social OAuth providers available

## For This Project

### Image Storage
- **Current Limit**: 5 MB per image (well under 50 MB limit)
- **Total Images**: ~200 images at 5 MB each (1 GB ÷ 5 MB)
- **Images per Listing**: Up to 10 images

### Recommendations
1. **Compress images** before upload
2. **Use responsive images** (serve smaller sizes)
3. **Remove unused images** periodically
4. **Monitor storage usage** in Supabase dashboard

## Upgrade to Pro ($25/month)

### Benefits
- **File Storage**: 100 GB (vs 1 GB)
- **Database Storage**: 8 GB (vs 500 MB)
- **Bandwidth**: 250 GB (vs 10 GB)
- **Larger Files**: Up to 500 GB per file
- **Daily Backups**: Automated backups

## Monitoring Usage

### Check Storage Usage
1. Go to Supabase Dashboard
2. Navigate to **Settings** > **Usage**
3. Check **Storage** and **Database** usage

### Check Bandwidth
1. Go to Supabase Dashboard
2. Navigate to **Settings** > **Usage**
3. Check **Bandwidth** usage

## When to Upgrade

Upgrade to Pro if you need:
- More than 1 GB of file storage
- More than 500 MB of database storage
- More than 10 GB of bandwidth per month
- Larger file uploads (over 50 MB)
- Daily backups

## Optimization Tips

### For Free Tier
1. **Compress images** before upload (reduce file size)
2. **Use image optimization** (serve smaller sizes)
3. **Remove unused images** (clean up old files)
4. **Monitor usage** (check dashboard regularly)

### For Production
1. **Use CDN** for image delivery (Cloudflare, etc.)
2. **Implement image cleanup** (delete old/unused images)
3. **Use image compression** (reduce file size)
4. **Monitor storage usage** (set up alerts)

---

**Note**: Limits are subject to change. Check [Supabase Pricing](https://supabase.com/pricing) for the latest information.


