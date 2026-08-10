-- ============================================================
-- Seed Data — Hebrew Grocery Store
-- ============================================================
-- Run this AFTER tables and RLS policies are created.

-- -------------------------
-- Categories
-- -------------------------
INSERT INTO categories (name_he, slug, icon, sort_order) VALUES
  ('ירקות', 'vegetables', '🥬', 1),
  ('פירות', 'fruits', '🍎', 2),
  ('מוצרי חלב', 'dairy', '🥛', 3),
  ('בשר ועוף', 'meat-poultry', '🥩', 4),
  ('מאפים ולחם', 'bakery', '🍞', 5),
  ('משקאות', 'beverages', '🥤', 6),
  ('מעדנייה', 'deli', '🧀', 7),
  ('ביצים וקטניות', 'eggs-legumes', '🥚', 8),
  ('פירות יבשים ואגוזים', 'dried-fruits-nuts', '🥜', 9),
  ('תבלינים ורטבים', 'spices-sauces', '🌶️', 10);

-- -------------------------
-- Products — Vegetables (ירקות)
-- -------------------------
INSERT INTO products (category_id, name_he, slug, description_he, price, unit, stock_qty, is_featured, image_url) VALUES
  ((SELECT id FROM categories WHERE slug = 'vegetables'), 'עגבניות שרי', 'cherry-tomatoes', 'עגבניות שרי טריות ומתוקות, גידול מקומי', 12.90, 'ק"ג', 150, true, 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400'),
  ((SELECT id FROM categories WHERE slug = 'vegetables'), 'מלפפונים', 'cucumbers', 'מלפפונים ירוקים ופריכים', 6.90, 'ק"ג', 200, false, 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400'),
  ((SELECT id FROM categories WHERE slug = 'vegetables'), 'פלפל אדום', 'red-pepper', 'פלפל אדום מתוק, מושלם לסלט ולבישול', 14.90, 'ק"ג', 100, true, 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400'),
  ((SELECT id FROM categories WHERE slug = 'vegetables'), 'בצל יבש', 'onions', 'בצל יבש איכותי לבישול יומיומי', 5.90, 'ק"ג', 300, false, 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400'),
  ((SELECT id FROM categories WHERE slug = 'vegetables'), 'גזר', 'carrots', 'גזר טרי ומתוק, מושלם למרקים ולסלטים', 7.90, 'ק"ג', 180, false, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400'),
  ((SELECT id FROM categories WHERE slug = 'vegetables'), 'חסה', 'lettuce', 'חסה ירוקה טרייה ופריכה', 8.90, 'יחידה', 120, false, 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400');

-- -------------------------
-- Products — Fruits (פירות)
-- -------------------------
INSERT INTO products (category_id, name_he, slug, description_he, price, unit, discount_price, stock_qty, is_featured, is_offer, seasonal_tag, image_url) VALUES
  ((SELECT id FROM categories WHERE slug = 'fruits'), 'תפוחים ירוקים', 'green-apples', 'תפוחי גרני סמית, חמוצים ופריכים', 14.90, 'ק"ג', NULL, 200, true, false, NULL, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400'),
  ((SELECT id FROM categories WHERE slug = 'fruits'), 'בננות', 'bananas', 'בננות בשלות ומתוקות', 9.90, 'ק"ג', 7.90, 250, true, true, NULL, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400'),
  ((SELECT id FROM categories WHERE slug = 'fruits'), 'תותים', 'strawberries', 'תותים טריים ואדומים, גידול מקומי', 24.90, 'חבילה', NULL, 80, true, false, 'אביב', 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400'),
  ((SELECT id FROM categories WHERE slug = 'fruits'), 'אבטיח', 'watermelon', 'אבטיח מתוק ועסיסי', 4.90, 'ק"ג', 3.90, 60, false, true, 'קיץ', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400'),
  ((SELECT id FROM categories WHERE slug = 'fruits'), 'ענבים ירוקים', 'green-grapes', 'ענבים ירוקים ללא חרצנים', 29.90, 'ק"ג', NULL, 90, false, false, 'קיץ', 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400'),
  ((SELECT id FROM categories WHERE slug = 'fruits'), 'אבוקדו', 'avocado', 'אבוקדו חאס בשל ואיכותי', 8.90, 'יחידה', NULL, 150, true, false, NULL, 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400');

-- -------------------------
-- Products — Dairy (מוצרי חלב)
-- -------------------------
INSERT INTO products (category_id, name_he, slug, description_he, price, unit, stock_qty, is_featured, image_url) VALUES
  ((SELECT id FROM categories WHERE slug = 'dairy'), 'חלב 3%', 'milk-3-percent', 'חלב טרי 3% שומן, 1 ליטר', 6.90, 'ליטר', 300, false, 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'),
  ((SELECT id FROM categories WHERE slug = 'dairy'), 'גבינה לבנה 5%', 'white-cheese-5', 'גבינה לבנה רכה 5% שומן, 250 גרם', 7.50, 'יחידה', 200, false, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400'),
  ((SELECT id FROM categories WHERE slug = 'dairy'), 'יוגורט טבעי', 'natural-yogurt', 'יוגורט טבעי 1.5%, 500 גרם', 8.90, 'יחידה', 150, true, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'),
  ((SELECT id FROM categories WHERE slug = 'dairy'), 'חמאה', 'butter', 'חמאה טרייה 200 גרם', 12.90, 'יחידה', 180, false, 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400');

-- -------------------------
-- Products — Meat & Poultry (בשר ועוף)
-- -------------------------
INSERT INTO products (category_id, name_he, slug, description_he, price, unit, stock_qty, is_featured, image_url) VALUES
  ((SELECT id FROM categories WHERE slug = 'meat-poultry'), 'חזה עוף טרי', 'chicken-breast', 'חזה עוף טרי ואיכותי, ללא עצמות', 39.90, 'ק"ג', 100, true, 'https://images.unsplash.com/photo-1604503468506-a8da13d82571?w=400'),
  ((SELECT id FROM categories WHERE slug = 'meat-poultry'), 'כרעיים עוף', 'chicken-drumsticks', 'כרעיים עוף טריות', 24.90, 'ק"ג', 120, false, 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400'),
  ((SELECT id FROM categories WHERE slug = 'meat-poultry'), 'בשר טחון', 'ground-beef', 'בשר בקר טחון טרי', 59.90, 'ק"ג', 80, true, 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400');

-- -------------------------
-- Products — Bakery (מאפים ולחם)
-- -------------------------
INSERT INTO products (category_id, name_he, slug, description_he, price, unit, stock_qty, is_featured, image_url) VALUES
  ((SELECT id FROM categories WHERE slug = 'bakery'), 'לחם מחיטה מלאה', 'whole-wheat-bread', 'לחם מחיטה מלאה טרי, אפייה יומית', 14.90, 'יחידה', 100, false, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'),
  ((SELECT id FROM categories WHERE slug = 'bakery'), 'חלה לשבת', 'challah', 'חלה מקולעת טרייה לשבת', 18.90, 'יחידה', 60, true, 'https://images.unsplash.com/photo-1603379016822-e6d5e2770ece?w=400'),
  ((SELECT id FROM categories WHERE slug = 'bakery'), 'פיתות', 'pita-bread', 'פיתות טריות, חבילת 6 יחידות', 9.90, 'חבילה', 150, false, 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400');

-- -------------------------
-- Products — Beverages (משקאות)
-- -------------------------
INSERT INTO products (category_id, name_he, slug, description_he, price, unit, discount_price, stock_qty, is_featured, is_offer, image_url) VALUES
  ((SELECT id FROM categories WHERE slug = 'beverages'), 'מים מינרליים', 'mineral-water', 'מים מינרליים טבעיים, 1.5 ליטר', 4.50, 'יחידה', NULL, 500, false, false, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400'),
  ((SELECT id FROM categories WHERE slug = 'beverages'), 'מיץ תפוזים טבעי', 'orange-juice', 'מיץ תפוזים סחוט טבעי, 1 ליטר', 16.90, 'ליטר', 12.90, 120, true, true, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400'),
  ((SELECT id FROM categories WHERE slug = 'beverages'), 'קולה', 'cola', 'קולה 1.5 ליטר', 8.90, 'יחידה', NULL, 200, false, false, 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400');

-- -------------------------
-- Products — Eggs & Legumes (ביצים וקטניות)
-- -------------------------
INSERT INTO products (category_id, name_he, slug, description_he, price, unit, stock_qty, is_featured, is_organic, image_url) VALUES
  ((SELECT id FROM categories WHERE slug = 'eggs-legumes'), 'ביצים חופש', 'free-range-eggs', 'ביצים מתרנגולות חופשיות, תבנית 12', 22.90, 'תבנית', 100, true, true, 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=400'),
  ((SELECT id FROM categories WHERE slug = 'eggs-legumes'), 'חומוס יבש', 'dried-chickpeas', 'חומוס יבש איכותי, 500 גרם', 11.90, 'חבילה', 200, false, false, 'https://images.unsplash.com/photo-1515543904323-bce17976f9d5?w=400'),
  ((SELECT id FROM categories WHERE slug = 'eggs-legumes'), 'עדשים אדומות', 'red-lentils', 'עדשים אדומות, 500 גרם', 13.90, 'חבילה', 180, false, false, 'https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=400');

-- -------------------------
-- Banners
-- -------------------------
INSERT INTO banners (title_he, subtitle_he, image_url, link_type, link_value, sort_order) VALUES
  ('פירות וירקות טריים כל יום!', 'משלוח חינם בהזמנה מעל ₪150', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', 'category', 'vegetables', 1),
  ('מבצע השבוע: בננות ב-₪7.90 לק"ג', 'מלאי מוגבל, הזדרזו!', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800', 'product', 'bananas', 2),
  ('מוצרים אורגניים', 'טריים מהחקלאי ישירות אליכם', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800', 'category', 'eggs-legumes', 3);

-- -------------------------
-- Offers
-- -------------------------
INSERT INTO offers (title_he, description_he, discount_percent, start_date, end_date, banner_image_url) VALUES
  ('מבצע סוף שבוע', 'הנחה של 20% על כל הפירות!', 20, now(), now() + interval '7 days', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800'),
  ('חזרה לשגרה', '3 ב-₪30 על מוצרי חלב נבחרים', NULL, now(), now() + interval '14 days', 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800'),
  ('משלוח חינם', 'משלוח חינם בהזמנות מעל ₪200', NULL, now(), now() + interval '30 days', 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800');
