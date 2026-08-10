-- ============================================================
-- Row Level Security Policies
-- ============================================================
-- Run this AFTER 001_create_tables.sql

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- -------------------------
-- Helper function: check if user is admin
-- -------------------------
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM customers
    WHERE auth_user_id = auth.uid()
    AND role IN ('admin', 'staff')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: get customer_id for current user
CREATE OR REPLACE FUNCTION get_my_customer_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id FROM customers
    WHERE auth_user_id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- PUBLIC READ policies (categories, products, banners, offers)
-- ============================================================

-- Categories: anyone can read active categories
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT USING (is_active = true);

-- Products: anyone can read active products
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (is_active = true);

-- Banners: anyone can read active banners
CREATE POLICY "banners_public_read" ON banners
  FOR SELECT USING (is_active = true);

-- Offers: anyone can read active offers
CREATE POLICY "offers_public_read" ON offers
  FOR SELECT USING (is_active = true);

-- ============================================================
-- CUSTOMER policies (own data only)
-- ============================================================

-- Customers: users can read and update own profile
CREATE POLICY "customers_own_read" ON customers
  FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "customers_own_update" ON customers
  FOR UPDATE USING (auth_user_id = auth.uid());

CREATE POLICY "customers_insert" ON customers
  FOR INSERT WITH CHECK (auth_user_id = auth.uid());

-- Addresses: customers manage their own addresses
CREATE POLICY "addresses_own_read" ON addresses
  FOR SELECT USING (customer_id = get_my_customer_id());

CREATE POLICY "addresses_own_insert" ON addresses
  FOR INSERT WITH CHECK (customer_id = get_my_customer_id());

CREATE POLICY "addresses_own_update" ON addresses
  FOR UPDATE USING (customer_id = get_my_customer_id());

CREATE POLICY "addresses_own_delete" ON addresses
  FOR DELETE USING (customer_id = get_my_customer_id());

-- Carts: customers manage their own cart
CREATE POLICY "carts_own_read" ON carts
  FOR SELECT USING (customer_id = get_my_customer_id());

CREATE POLICY "carts_own_insert" ON carts
  FOR INSERT WITH CHECK (customer_id = get_my_customer_id());

CREATE POLICY "carts_own_update" ON carts
  FOR UPDATE USING (customer_id = get_my_customer_id());

-- Cart Items: customers manage items in their own cart
CREATE POLICY "cart_items_own_read" ON cart_items
  FOR SELECT USING (
    cart_id IN (SELECT id FROM carts WHERE customer_id = get_my_customer_id())
  );

CREATE POLICY "cart_items_own_insert" ON cart_items
  FOR INSERT WITH CHECK (
    cart_id IN (SELECT id FROM carts WHERE customer_id = get_my_customer_id())
  );

CREATE POLICY "cart_items_own_update" ON cart_items
  FOR UPDATE USING (
    cart_id IN (SELECT id FROM carts WHERE customer_id = get_my_customer_id())
  );

CREATE POLICY "cart_items_own_delete" ON cart_items
  FOR DELETE USING (
    cart_id IN (SELECT id FROM carts WHERE customer_id = get_my_customer_id())
  );

-- Orders: customers read their own orders
CREATE POLICY "orders_own_read" ON orders
  FOR SELECT USING (customer_id = get_my_customer_id());

CREATE POLICY "orders_own_insert" ON orders
  FOR INSERT WITH CHECK (customer_id = get_my_customer_id());

-- Order Items: customers read items of their own orders
CREATE POLICY "order_items_own_read" ON order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE customer_id = get_my_customer_id())
  );

CREATE POLICY "order_items_own_insert" ON order_items
  FOR INSERT WITH CHECK (
    order_id IN (SELECT id FROM orders WHERE customer_id = get_my_customer_id())
  );

-- Deliveries: customers read delivery of their own orders
CREATE POLICY "deliveries_own_read" ON deliveries
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE customer_id = get_my_customer_id())
  );

-- Favorites: customers manage their own favorites
CREATE POLICY "favorites_own_read" ON favorites
  FOR SELECT USING (customer_id = get_my_customer_id());

CREATE POLICY "favorites_own_insert" ON favorites
  FOR INSERT WITH CHECK (customer_id = get_my_customer_id());

CREATE POLICY "favorites_own_delete" ON favorites
  FOR DELETE USING (customer_id = get_my_customer_id());

-- ============================================================
-- ADMIN policies (full access)
-- ============================================================

-- Admin: full access on categories
CREATE POLICY "admin_categories_all" ON categories
  FOR ALL USING (is_admin());

-- Admin: full access on products
CREATE POLICY "admin_products_all" ON products
  FOR ALL USING (is_admin());

-- Admin: full access on orders
CREATE POLICY "admin_orders_all" ON orders
  FOR ALL USING (is_admin());

-- Admin: full access on order_items
CREATE POLICY "admin_order_items_all" ON order_items
  FOR ALL USING (is_admin());

-- Admin: full access on deliveries
CREATE POLICY "admin_deliveries_all" ON deliveries
  FOR ALL USING (is_admin());

-- Admin: full access on banners
CREATE POLICY "admin_banners_all" ON banners
  FOR ALL USING (is_admin());

-- Admin: full access on offers
CREATE POLICY "admin_offers_all" ON offers
  FOR ALL USING (is_admin());

-- Admin: read all customers
CREATE POLICY "admin_customers_read" ON customers
  FOR SELECT USING (is_admin());

-- Admin: update customer roles
CREATE POLICY "admin_customers_update" ON customers
  FOR UPDATE USING (is_admin());

-- Admin: read all addresses (for order fulfillment)
CREATE POLICY "admin_addresses_read" ON addresses
  FOR SELECT USING (is_admin());

-- Admin: read all carts
CREATE POLICY "admin_carts_read" ON carts
  FOR SELECT USING (is_admin());

-- Admin: read all cart items
CREATE POLICY "admin_cart_items_read" ON cart_items
  FOR SELECT USING (is_admin());

-- Admin: manage all favorites (for analytics)
CREATE POLICY "admin_favorites_read" ON favorites
  FOR SELECT USING (is_admin());
