-- ============================================================
-- Migration 006 — Add English Language Columns
-- ============================================================
-- Add name_en and description_en columns to support bilingual content

-- -------------------------
-- Add English name column to categories
-- -------------------------
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS name_en TEXT;

-- -------------------------
-- Add English columns to products
-- -------------------------
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- -------------------------
-- Create indexes for English columns
-- -------------------------
CREATE INDEX IF NOT EXISTS idx_products_name_en 
ON products USING gin (to_tsvector('english', COALESCE(name_en, '')));
