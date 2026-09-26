-- ============================================================
-- Migration 007 — Add Banner English Columns and Admin Setup
-- ============================================================

-- -------------------------
-- Add English columns to banners
-- -------------------------
ALTER TABLE banners 
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS subtitle_en TEXT;

-- -------------------------
-- Update existing banners with English translations
-- -------------------------
UPDATE banners 
SET 
  title_en = 'Fresh Fruits and Vegetables Every Day!',
  subtitle_en = 'Free delivery on orders over ₪150'
WHERE title_he = 'פירות וירקות טריים כל יום!';

UPDATE banners 
SET 
  title_en = 'Weekly Special: Bananas at ₪7.90/kg',
  subtitle_en = 'Limited stock, hurry up!'
WHERE title_he = 'מבצע השבוע: בננות ב-₪7.90 לק"ג';

UPDATE banners 
SET 
  title_en = 'Organic Products',
  subtitle_en = 'Fresh from the farm directly to you'
WHERE title_he = 'מוצרים אורגניים';

-- -------------------------
-- Create admin user function
-- -------------------------
-- Note: This creates a customer with admin role
-- The actual auth user needs to be created via Supabase Auth UI or signup
-- Email: admin@kirshnerfarm.com
-- Password: (set via Supabase Auth UI)

-- This function will be called after an admin user signs up
CREATE OR REPLACE FUNCTION set_admin_role(user_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE customers 
  SET role = 'admin'
  WHERE auth_user_id IN (
    SELECT id FROM auth.users WHERE email = user_email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to auto-assign admin role for specific email
CREATE OR REPLACE FUNCTION auto_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the new customer's email is the admin email
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

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS trigger_auto_admin_role ON customers;
CREATE TRIGGER trigger_auto_admin_role
  BEFORE INSERT ON customers
  FOR EACH ROW
  EXECUTE FUNCTION auto_admin_role();

-- -------------------------
-- Admin user credentials documentation
-- -------------------------
-- To create the admin user:
-- 1. Sign up with email: admin@kirshnerfarm.com
-- 2. Password: Admin@123456 (or set your own)
-- 3. The trigger will automatically set role to 'admin'
-- 4. Admin users will have access to:
--    - Admin panel at /(admin) routes
--    - Product management
--    - Order management
--    - User management
--    - All CRUD operations
