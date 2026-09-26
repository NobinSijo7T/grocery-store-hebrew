-- Run this in Supabase SQL Editor
-- https://supabase.com/dashboard/project/gcihfcmnroxlxwuakvbm/sql/new

-- Add English columns to banners
ALTER TABLE banners ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE banners ADD COLUMN IF NOT EXISTS subtitle_en TEXT;

-- Create admin role trigger
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
