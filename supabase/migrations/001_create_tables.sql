-- ============================================================
-- Meshak Kirshner Grocery Store — Database Schema
-- ============================================================
-- Run this in Supabase SQL Editor to create all tables.

-- -------------------------
-- Custom ENUM types
-- -------------------------
CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'packing',
  'out_for_delivery',
  'delivered',
  'cancelled'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'paid',
  'failed',
  'refunded'
);

CREATE TYPE delivery_status AS ENUM (
  'pending',
  'assigned',
  'picked_up',
  'in_transit',
  'delivered',
  'failed'
);

-- -------------------------
-- 1. Categories
-- -------------------------
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_he TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT, -- emoji or icon name
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_categories_sort ON categories (sort_order);
CREATE INDEX idx_categories_active ON categories (is_active);

-- -------------------------
-- 2. Products
-- -------------------------
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name_he TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description_he TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  unit TEXT NOT NULL DEFAULT 'יחידה', -- ק"ג, יחידה, חבילה, ליטר
  discount_price DECIMAL(10, 2) CHECK (discount_price IS NULL OR discount_price >= 0),
  image_url TEXT,
  gallery_urls JSONB DEFAULT '[]'::jsonb,
  stock_qty INT DEFAULT 0 CHECK (stock_qty >= 0),
  is_featured BOOLEAN DEFAULT false,
  is_offer BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_organic BOOLEAN DEFAULT false,
  seasonal_tag TEXT, -- e.g., 'קיץ', 'חורף'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_products_category ON products (category_id);
CREATE INDEX idx_products_active ON products (is_active);
CREATE INDEX idx_products_featured ON products (is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_offer ON products (is_offer) WHERE is_offer = true;
CREATE INDEX idx_products_name_he ON products USING gin (to_tsvector('simple', name_he));

-- -------------------------
-- 3. Customers
-- -------------------------
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  default_address UUID,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_customers_auth ON customers (auth_user_id);

-- -------------------------
-- 4. Addresses
-- -------------------------
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  label TEXT DEFAULT 'בית', -- בית, עבודה, אחר
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  notes TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_addresses_customer ON addresses (customer_id);

-- -------------------------
-- 5. Carts
-- -------------------------
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL UNIQUE REFERENCES customers(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_carts_customer ON carts (customer_id);

-- -------------------------
-- 6. Cart Items
-- -------------------------
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price_snapshot DECIMAL(10, 2) NOT NULL,
  UNIQUE (cart_id, product_id)
);

CREATE INDEX idx_cart_items_cart ON cart_items (cart_id);

-- -------------------------
-- 7. Orders
-- -------------------------
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE SET NULL,
  address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  discount_total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  grand_total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  payment_status payment_status DEFAULT 'pending',
  order_status order_status DEFAULT 'pending',
  delivery_status delivery_status DEFAULT 'pending',
  delivery_slot TEXT, -- e.g., '10:00-12:00'
  coupon_code TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_orders_customer ON orders (customer_id);
CREATE INDEX idx_orders_status ON orders (order_status);
CREATE INDEX idx_orders_created ON orders (created_at DESC);

-- -------------------------
-- 8. Order Items
-- -------------------------
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name_snapshot TEXT NOT NULL,
  unit_snapshot TEXT NOT NULL,
  price_snapshot DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0)
);

CREATE INDEX idx_order_items_order ON order_items (order_id);

-- -------------------------
-- 9. Deliveries
-- -------------------------
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  driver_name TEXT,
  driver_phone TEXT,
  status delivery_status DEFAULT 'pending',
  tracking_note TEXT,
  eta TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_deliveries_order ON deliveries (order_id);
CREATE INDEX idx_deliveries_status ON deliveries (status);

-- -------------------------
-- 10. Banners
-- -------------------------
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_he TEXT NOT NULL,
  subtitle_he TEXT,
  image_url TEXT,
  link_type TEXT DEFAULT 'none', -- 'category', 'product', 'offer', 'none'
  link_value TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_banners_active ON banners (is_active, sort_order);

-- -------------------------
-- 11. Offers
-- -------------------------
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_he TEXT NOT NULL,
  description_he TEXT,
  banner_image_url TEXT,
  discount_percent INT,
  start_date TIMESTAMPTZ DEFAULT now(),
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_offers_active ON offers (is_active, start_date, end_date);

-- -------------------------
-- 12. Favorites (junction table)
-- -------------------------
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (customer_id, product_id)
);

CREATE INDEX idx_favorites_customer ON favorites (customer_id);

-- -------------------------
-- Auto-update updated_at triggers
-- -------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_deliveries_updated_at
  BEFORE UPDATE ON deliveries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_carts_updated_at
  BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- -------------------------
-- Enable Realtime for key tables
-- -------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE deliveries;
ALTER PUBLICATION supabase_realtime ADD TABLE cart_items;
