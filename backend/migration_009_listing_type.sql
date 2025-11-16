-- Migration 009: Add listing_type to listings table
-- Execute this SQL directly in Supabase SQL Editor if Alembic fails due to pooler limits

-- Step 1: Create enum type for listing_type (if it doesn't exist)
DO $$ BEGIN
    CREATE TYPE listingtype AS ENUM ('personal', 'company');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 2: Add listing_type column with default value
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS listing_type listingtype NOT NULL DEFAULT 'personal';

-- Step 3: Create index for listing_type
CREATE INDEX IF NOT EXISTS ix_listings_listing_type ON listings(listing_type);

-- Verify the migration
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'listings' 
AND column_name = 'listing_type';

