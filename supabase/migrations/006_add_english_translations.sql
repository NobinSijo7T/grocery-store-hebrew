-- ============================================================
-- Migration 006 — Add English Translations
-- ============================================================
-- Add English names and descriptions for all products and categories

-- -------------------------
-- Update Categories with English Names
-- -------------------------
UPDATE categories SET name_en = 'Vegetables' WHERE slug = 'vegetables';
UPDATE categories SET name_en = 'Fruits' WHERE slug = 'fruits';
UPDATE categories SET name_en = 'Dairy' WHERE slug = 'dairy';
UPDATE categories SET name_en = 'Meat & Poultry' WHERE slug = 'meat-poultry';
UPDATE categories SET name_en = 'Bakery' WHERE slug = 'bakery';
UPDATE categories SET name_en = 'Beverages' WHERE slug = 'beverages';
UPDATE categories SET name_en = 'Deli' WHERE slug = 'deli';
UPDATE categories SET name_en = 'Eggs & Legumes' WHERE slug = 'eggs-legumes';
UPDATE categories SET name_en = 'Dried Fruits & Nuts' WHERE slug = 'dried-fruits-nuts';
UPDATE categories SET name_en = 'Spices & Sauces' WHERE slug = 'spices-sauces';

-- -------------------------
-- Update Products — Vegetables
-- -------------------------
UPDATE products SET 
  name_en = 'Cherry Tomatoes',
  description_en = 'Fresh and sweet cherry tomatoes, locally grown'
WHERE slug = 'cherry-tomatoes';

UPDATE products SET 
  name_en = 'Cucumbers',
  description_en = 'Green and crispy cucumbers'
WHERE slug = 'cucumbers';

UPDATE products SET 
  name_en = 'Red Bell Pepper',
  description_en = 'Sweet red bell pepper, perfect for salads and cooking'
WHERE slug = 'red-pepper';

UPDATE products SET 
  name_en = 'Onions',
  description_en = 'Quality dry onions for everyday cooking'
WHERE slug = 'onions';

UPDATE products SET 
  name_en = 'Carrots',
  description_en = 'Fresh and sweet carrots, perfect for soups and salads'
WHERE slug = 'carrots';

UPDATE products SET 
  name_en = 'Lettuce',
  description_en = 'Fresh and crispy green lettuce'
WHERE slug = 'lettuce';

-- -------------------------
-- Update Products — Fruits
-- -------------------------
UPDATE products SET 
  name_en = 'Green Apples',
  description_en = 'Granny Smith apples, tart and crispy'
WHERE slug = 'green-apples';

UPDATE products SET 
  name_en = 'Bananas',
  description_en = 'Ripe and sweet bananas'
WHERE slug = 'bananas';

UPDATE products SET 
  name_en = 'Strawberries',
  description_en = 'Fresh red strawberries, locally grown'
WHERE slug = 'strawberries';

UPDATE products SET 
  name_en = 'Watermelon',
  description_en = 'Sweet and juicy watermelon'
WHERE slug = 'watermelon';

UPDATE products SET 
  name_en = 'Green Grapes',
  description_en = 'Seedless green grapes'
WHERE slug = 'green-grapes';

UPDATE products SET 
  name_en = 'Avocado',
  description_en = 'Ripe Hass avocado, premium quality'
WHERE slug = 'avocado';

-- -------------------------
-- Update Products — Dairy
-- -------------------------
UPDATE products SET 
  name_en = 'Milk 3%',
  description_en = 'Fresh milk 3% fat, 1 liter'
WHERE slug = 'milk-3-percent';

UPDATE products SET 
  name_en = 'White Cheese 5%',
  description_en = 'Soft white cheese 5% fat, 250 grams'
WHERE slug = 'white-cheese-5';

UPDATE products SET 
  name_en = 'Natural Yogurt',
  description_en = 'Natural yogurt 1.5%, 500 grams'
WHERE slug = 'natural-yogurt';

UPDATE products SET 
  name_en = 'Butter',
  description_en = 'Fresh butter 200 grams'
WHERE slug = 'butter';

-- -------------------------
-- Update Products — Meat & Poultry
-- -------------------------
UPDATE products SET 
  name_en = 'Fresh Chicken Breast',
  description_en = 'Fresh premium chicken breast, boneless'
WHERE slug = 'chicken-breast';

UPDATE products SET 
  name_en = 'Chicken Drumsticks',
  description_en = 'Fresh chicken drumsticks'
WHERE slug = 'chicken-drumsticks';

UPDATE products SET 
  name_en = 'Ground Beef',
  description_en = 'Fresh ground beef'
WHERE slug = 'ground-beef';

-- -------------------------
-- Update Products — Bakery
-- -------------------------
UPDATE products SET 
  name_en = 'Whole Wheat Bread',
  description_en = 'Fresh whole wheat bread, baked daily'
WHERE slug = 'whole-wheat-bread';

UPDATE products SET 
  name_en = 'Challah',
  description_en = 'Fresh braided challah for Shabbat'
WHERE slug = 'challah';

UPDATE products SET 
  name_en = 'Pita Bread',
  description_en = 'Fresh pita bread, pack of 6'
WHERE slug = 'pita-bread';

-- -------------------------
-- Update Products — Beverages
-- -------------------------
UPDATE products SET 
  name_en = 'Mineral Water',
  description_en = 'Natural mineral water, 1.5 liters'
WHERE slug = 'mineral-water';

UPDATE products SET 
  name_en = 'Natural Orange Juice',
  description_en = 'Freshly squeezed natural orange juice, 1 liter'
WHERE slug = 'orange-juice';

UPDATE products SET 
  name_en = 'Cola',
  description_en = 'Cola 1.5 liters'
WHERE slug = 'cola';

-- -------------------------
-- Update Products — Eggs & Legumes
-- -------------------------
UPDATE products SET 
  name_en = 'Free Range Eggs',
  description_en = 'Free range eggs from happy chickens, pack of 12'
WHERE slug = 'free-range-eggs';

UPDATE products SET 
  name_en = 'Dried Chickpeas',
  description_en = 'Premium dried chickpeas, 500 grams'
WHERE slug = 'dried-chickpeas';

UPDATE products SET 
  name_en = 'Red Lentils',
  description_en = 'Red lentils, 500 grams'
WHERE slug = 'red-lentils';


-- -------------------------
-- Update Products — Deli
-- -------------------------
UPDATE products SET 
  name_en = 'Grated Yellow Cheese',
  description_en = 'Grated yellow cheese, excellent for pizza and pasta, 200 grams'
WHERE slug = 'grated-yellow-cheese';

UPDATE products SET 
  name_en = 'Goat Cheese',
  description_en = 'Premium goat cheese, 200 gram roll'
WHERE slug = 'goat-cheese';

-- -------------------------
-- Update Products — Dried Fruits & Nuts
-- -------------------------
UPDATE products SET 
  name_en = 'Roasted Almonds',
  description_en = 'Lightly salted roasted almonds, 250 grams'
WHERE slug = 'roasted-almonds';

UPDATE products SET 
  name_en = 'Walnuts',
  description_en = 'Natural premium walnuts, 200 grams'
WHERE slug = 'walnuts';

UPDATE products SET 
  name_en = 'Dates',
  description_en = 'Juicy Medjool dates, 500 grams'
WHERE slug = 'dates';

-- -------------------------
-- Update Products — Spices & Sauces
-- -------------------------
UPDATE products SET 
  name_en = 'Black Pepper',
  description_en = 'Ground black pepper, 100 grams'
WHERE slug = 'black-pepper';

UPDATE products SET 
  name_en = 'Sweet Paprika',
  description_en = 'Quality sweet paprika, 100 grams'
WHERE slug = 'sweet-paprika';

UPDATE products SET 
  name_en = 'Tomato Paste',
  description_en = 'Natural tomato paste, 250 grams'
WHERE slug = 'tomato-paste';

-- -------------------------
-- Update Products — Bakery (Additional)
-- -------------------------
UPDATE products SET 
  name_en = 'Butter Croissant',
  description_en = 'Fresh French butter croissant, pack of 3'
WHERE slug = 'butter-croissant';

-- -------------------------
-- Update Products — Meat & Poultry (Additional)
-- -------------------------
UPDATE products SET 
  name_en = 'Entrecote Steak',
  description_en = 'Premium aged entrecote steak'
WHERE slug = 'entrecote-steak';

UPDATE products SET 
  name_en = 'Chicken Soup Parts',
  description_en = 'Selected chicken parts for rich and tasty soup'
WHERE slug = 'chicken-soup-parts';
