-- ============================================================
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/gcihfcmnroxlxwuakvbm/sql/new
-- ============================================================

-- 1. Favorites Table (Liked Products)
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (customer_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_customer ON favorites (customer_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product ON favorites (product_id);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "favorites_own_read" ON favorites;
DROP POLICY IF EXISTS "favorites_own_insert" ON favorites;
DROP POLICY IF EXISTS "favorites_own_delete" ON favorites;

CREATE POLICY "favorites_own_read" ON favorites
  FOR SELECT TO authenticated
  USING (customer_id = get_my_customer_id());

CREATE POLICY "favorites_own_insert" ON favorites
  FOR INSERT TO authenticated
  WITH CHECK (customer_id = get_my_customer_id());

CREATE POLICY "favorites_own_delete" ON favorites
  FOR DELETE TO authenticated
  USING (customer_id = get_my_customer_id());

-- 2. Enhance Addresses Table
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS apartment TEXT;
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS floor TEXT;
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS entrance TEXT;
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Ensure RLS on addresses
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "addresses_own_read" ON addresses;
DROP POLICY IF EXISTS "addresses_own_insert" ON addresses;
DROP POLICY IF EXISTS "addresses_own_update" ON addresses;
DROP POLICY IF EXISTS "addresses_own_delete" ON addresses;

CREATE POLICY "addresses_own_read" ON addresses
  FOR SELECT TO authenticated
  USING (customer_id = get_my_customer_id());

CREATE POLICY "addresses_own_insert" ON addresses
  FOR INSERT TO authenticated
  WITH CHECK (customer_id = get_my_customer_id());

CREATE POLICY "addresses_own_update" ON addresses
  FOR UPDATE TO authenticated
  USING (customer_id = get_my_customer_id())
  WITH CHECK (customer_id = get_my_customer_id());

CREATE POLICY "addresses_own_delete" ON addresses
  FOR DELETE TO authenticated
  USING (customer_id = get_my_customer_id());

-- 3. Enhance Customers Table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

DROP POLICY IF EXISTS "customers_own_update" ON customers;
CREATE POLICY "customers_own_update" ON customers
  FOR UPDATE TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- 4. Products Likes Counter Trigger
ALTER TABLE products ADD COLUMN IF NOT EXISTS likes_count INT DEFAULT 0;

CREATE OR REPLACE FUNCTION update_product_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE products SET likes_count = COALESCE(likes_count, 0) + 1 WHERE id = NEW.product_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE products SET likes_count = GREATEST(0, COALESCE(likes_count, 0) - 1) WHERE id = OLD.product_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_favorites_likes_count ON favorites;
CREATE TRIGGER trg_favorites_likes_count
  AFTER INSERT OR DELETE ON favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_product_likes_count();
