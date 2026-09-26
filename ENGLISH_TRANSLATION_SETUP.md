# English Translation Setup Instructions

## Overview
This guide will help you add English translations to your grocery store app so that:
- When language is English → Products and categories show in English
- When language is Hebrew → Products and categories show in Hebrew

## Step 1: Add Database Columns

You need to add English columns to your Supabase database.

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase SQL Editor:
   https://supabase.com/dashboard/project/gcihfcmnroxlxwuakvbm/sql/new

2. Copy and paste this SQL:

```sql
-- Add English columns
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Create search index for English names
CREATE INDEX IF NOT EXISTS idx_products_name_en 
ON products USING gin (to_tsvector('english', COALESCE(name_en, '')));
```

3. Click the **"RUN"** button

4. You should see a success message

### Option B: Using Migration File

If you have Supabase CLI installed, you can run:

```bash
supabase db push
```

This will apply the migration file: `supabase/migrations/006_add_english_columns.sql`

## Step 2: Add English Translations to Database

After the columns are added, run this script to populate English translations:

```bash
node scripts/add-english-translations.js
```

This script will:
- Add English names to all 10 categories
- Add English names and descriptions to all 39 products

You should see output like:
```
✓ Updated category: vegetables → Vegetables
✓ Updated category: fruits → Fruits
...
✓ Updated product: cherry-tomatoes → Cherry Tomatoes
✓ Updated product: bananas → Bananas
...
✅ Categories: 10 updated, 0 errors
✅ Products: 39 updated, 0 errors
```

## Step 3: Restart Your App

After the translations are added:

1. **Stop the Metro bundler** (Ctrl+C in the terminal running Expo)

2. **Clear the app data/cache**:
   - Android: Long-press app icon → App info → Storage → Clear Data
   - iOS: Delete the app and reinstall

3. **Start the app again**:
   ```bash
   npx expo start
   ```

4. The app will now default to **English** on first launch

## Step 4: Test the App

1. **Open the app** - it should be in English by default

2. **Check the home screen**:
   - Categories should show in English (Vegetables, Fruits, etc.)
   - Product names should show in English

3. **Open a product detail page**:
   - Product name should be in English
   - Product description should be in English
   - All UI text should be in English

4. **Switch to Hebrew**:
   - Go to Account/Settings
   - Change language to Hebrew
   - Everything should switch to Hebrew

## Verification Checklist

- [ ] Database columns added (name_en, description_en)
- [ ] English translations populated in database
- [ ] App cache cleared
- [ ] App defaults to English on first launch
- [ ] Product cards show English names
- [ ] Product detail page shows English content
- [ ] Category chips show English names
- [ ] Language toggle switches between English and Hebrew
- [ ] Text alignment changes with language (left for English, right for Hebrew)

## Files Modified

### Database Changes:
- `supabase/migrations/006_add_english_columns.sql` - Adds columns
- `supabase/migrations/006_add_english_translations.sql` - SQL version of translations

### Code Changes:
- `src/stores/languageStore.ts` - Default language changed to 'en'
- `src/app/(stack)/product/[id].tsx` - Product detail page now respects language
- `src/components/product/ProductCard.tsx` - Already supported (no changes needed)
- `src/components/home/CategoryChips.tsx` - Already supported (no changes needed)

### Scripts:
- `scripts/add-english-translations.js` - Populates English data
- `scripts/add-english-columns.js` - Helper to show SQL needed
- `scripts/run-sql-direct.js` - Alternative SQL runner

## Troubleshooting

### Products still showing in Hebrew

1. Check if columns were added:
   - Go to Supabase → Table Editor → products table
   - Verify `name_en` and `description_en` columns exist

2. Check if translations were added:
   - Run: `node scripts/add-english-translations.js`
   - Look for "✅ Products: 39 updated"

3. Clear app cache completely:
   - The language preference is stored in AsyncStorage
   - Deleting and reinstalling the app will clear it

### Categories showing in Hebrew

Same as above, but check the `categories` table for `name_en` column.

### App not defaulting to English

The storage key was changed to `language-storage-v2` to force a reset.
If you still see Hebrew, try:

```bash
# In your app, run this in console
AsyncStorage.clear()
```

Or delete and reinstall the app.

## Support

If you encounter issues:
1. Check the console output for errors
2. Verify database columns exist in Supabase
3. Ensure English translations were successfully added
4. Try clearing all app data and cache

## Next Steps

Once English translations are working:
- You can add more products with both Hebrew and English names
- Consider adding more languages
- Update the ProductFormModal to allow editing both languages
