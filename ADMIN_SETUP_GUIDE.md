# Admin Authentication Setup Guide

## Overview
This guide will help you:
1. Fix the banner to show in English when language is English
2. Set up admin authentication with super user privileges
3. Create an admin account

## Step 1: Add Database Columns for Banners

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase SQL Editor:
   https://supabase.com/dashboard/project/gcihfcmnroxlxwuakvbm/sql/new

2. Copy and paste the SQL from `ADD_BANNER_COLUMNS.sql`:

```sql
-- Add English columns to banners
ALTER TABLE banners ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE banners ADD COLUMN IF NOT EXISTS subtitle_en TEXT;

-- Create admin role trigger
CREATE OR REPLACE FUNCTION auto_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = NEW.auth_user_id 
    AND email = 'admin@kirshnerfarm.com'
  ) THEN
    NEW.role = 'admin';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_admin_role ON customers;
CREATE TRIGGER trigger_auto_admin_role
  BEFORE INSERT ON customers
  FOR EACH ROW
  EXECUTE FUNCTION auto_admin_role();
```

3. Click **"RUN"**

## Step 2: Add English Translations to Banners

After adding the columns, run this script:

```bash
node scripts/setup-banners-and-admin.js
```

This will:
- Add English titles and subtitles to all 3 banners
- Display admin setup instructions

You should see:
```
✓ Updated banner: פירות וירקות טריים כל יום! → Fresh Fruits and Vegetables Every Day!
✓ Updated banner: מבצע השבוע: בננות ב-₪7.90 לק"ג → Weekly Special: Bananas at ₪7.90/kg
✓ Updated banner: מוצרים אורגניים → Organic Products
✅ Banners: 3 updated, 0 errors
```

## Step 3: Create Admin Account

### Admin Credentials
- **Email**: `admin@kirshnerfarm.com`
- **Password**: `Admin@123456` (or choose your own)
- **Full Name**: Admin User

### Creating the Admin Account

1. **Open your app**

2. **Go to Register/Sign Up screen**

3. **Fill in the admin credentials**:
   - Full Name: Admin User
   - Phone: (optional)
   - Email: admin@kirshnerfarm.com
   - Password: Admin@123456

4. **Sign up**

5. The system will **automatically assign admin role** via the trigger

### How It Works

When a user signs up with email `admin@kirshnerfarm.com`:
- The `auto_admin_role()` trigger fires
- It checks if the email matches the admin email
- If yes, it sets `role = 'admin'` automatically
- The user now has super user privileges

## Step 4: Verify Admin Access

After creating the admin account:

1. **Check the database**:
   - Go to Supabase → Table Editor → customers
   - Find the user with email `admin@kirshnerfarm.com`
   - Verify `role` column shows `'admin'`

2. **Test admin features**:
   - Admin users should have access to admin panel
   - Can manage products, orders, users
   - Has CRUD operations on all tables

## Admin Privileges

Admin users (`role = 'admin'`) have:
- ✅ Access to admin panel routes `/(admin)`
- ✅ Product management (create, edit, delete)
- ✅ Order management (view all orders, update status)
- ✅ User management (view customers)
- ✅ Banner management
- ✅ Offer management
- ✅ Category management
- ✅ Full database access via RLS policies

Regular customers (`role = 'customer'`) have:
- ✅ Browse products
- ✅ Add to cart
- ✅ Place orders
- ✅ View their own orders
- ❌ No access to admin features

## Banner Language Support

### When Language is English:
- Banner shows: "Fresh Fruits and Vegetables Every Day!"
- Subtitle shows: "Free delivery on orders over ₪150"

### When Language is Hebrew:
- Banner shows: "פירות וירקות טריים כל יום!"
- Subtitle shows: "משלוח חינם בהזמנה מעל ₪150"

## Security Notes

1. **Change the admin password** after first login
2. **Keep admin credentials secure** - don't commit them to git
3. **Use strong passwords** in production
4. **Consider 2FA** for admin accounts in production
5. **Monitor admin actions** via audit logs

## Adding More Admins

To add additional admin users:

### Option 1: Update Trigger
Edit the trigger to include multiple admin emails:

```sql
CREATE OR REPLACE FUNCTION auto_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = NEW.auth_user_id 
    AND email IN ('admin@kirshnerfarm.com', 'admin2@kirshnerfarm.com')
  ) THEN
    NEW.role = 'admin';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Option 2: Manual Update
Update existing users to admin:

```sql
UPDATE customers 
SET role = 'admin' 
WHERE auth_user_id IN (
  SELECT id FROM auth.users WHERE email = 'newemail@example.com'
);
```

## Troubleshooting

### Banner still showing in Hebrew
1. Verify columns were added: Check `banners` table for `title_en` column
2. Verify translations were added: Run the setup script again
3. Clear app cache and restart

### Admin role not assigned
1. Check trigger exists: Run the trigger creation SQL again
2. Verify email matches exactly: `admin@kirshnerfarm.com`
3. Check customers table: Look for the user and verify role

### Cannot access admin panel
1. Verify role is 'admin' in customers table
2. Check RLS policies allow admin access
3. Restart the app after signing in

## Files Modified

### Code Changes:
- `src/types/models.ts` - Added `title_en` and `subtitle_en` to Banner interface
- `src/components/home/HeroBanner.tsx` - Banner now respects language setting

### Database Changes:
- `supabase/migrations/007_add_banner_english_and_admin.sql` - Migration file
- Added `title_en` and `subtitle_en` columns to `banners` table
- Created `auto_admin_role()` trigger function
- Created trigger on `customers` table

### Scripts:
- `scripts/setup-banners-and-admin.js` - Setup script
- `ADD_BANNER_COLUMNS.sql` - Quick SQL reference

## Next Steps

1. ✅ Run the SQL to add columns and trigger
2. ✅ Run the setup script to add translations
3. ✅ Create admin account by signing up
4. ✅ Verify admin role in database
5. ✅ Test admin features
6. 🔒 Change admin password to something secure
7. 📝 Document your admin processes
