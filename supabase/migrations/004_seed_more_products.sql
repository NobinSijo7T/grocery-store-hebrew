-- -------------------------
-- Seed More Products (004)
-- -------------------------

-- -------------------------
-- Products — Deli (מעדנייה)
-- -------------------------
INSERT INTO products (category_id, name_he, slug, description_he, price, unit, stock_qty, is_featured, image_url) VALUES
  ((SELECT id FROM categories WHERE slug = 'deli'), 'גבינה צהובה מגורדת', 'grated-yellow-cheese', 'גבינה צהובה מגורדת, מצוינת לפיצה ופסטה, 200 גרם', 16.90, 'יחידה', 100, true, 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400'),
  ((SELECT id FROM categories WHERE slug = 'deli'), 'גבינת עזים', 'goat-cheese', 'גבינת עזים משובחת, גליל 200 גרם', 22.90, 'יחידה', 50, false, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400');

-- -------------------------
-- Products — Dried Fruits & Nuts (פירות יבשים ואגוזים)
-- -------------------------
INSERT INTO products (category_id, name_he, slug, description_he, price, unit, stock_qty, is_featured, image_url) VALUES
  ((SELECT id FROM categories WHERE slug = 'dried-fruits-nuts'), 'שקדים קלויים', 'roasted-almonds', 'שקדים קלויים ומומלחים קלות, 250 גרם', 24.90, 'חבילה', 150, true, 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400'),
  ((SELECT id FROM categories WHERE slug = 'dried-fruits-nuts'), 'אגוזי מלך', 'walnuts', 'אגוזי מלך טבעיים ואיכותיים, 200 גרם', 19.90, 'חבילה', 100, false, 'https://images.unsplash.com/photo-1590059942690-3b6038f28f09?w=400'),
  ((SELECT id FROM categories WHERE slug = 'dried-fruits-nuts'), 'תמרים', 'dates', 'תמרי מג''הול עסיסיים, 500 גרם', 29.90, 'חבילה', 120, true, 'https://images.unsplash.com/photo-1596773516546-f949437145de?w=400');

-- -------------------------
-- Products — Spices & Sauces (תבלינים ורטבים)
-- -------------------------
INSERT INTO products (category_id, name_he, slug, description_he, price, unit, stock_qty, is_featured, image_url) VALUES
  ((SELECT id FROM categories WHERE slug = 'spices-sauces'), 'פלפל שחור גרוס', 'black-pepper', 'פלפל שחור גרוס, 100 גרם', 9.90, 'יחידה', 200, false, 'https://images.unsplash.com/photo-1596647271946-fdf09c310461?w=400'),
  ((SELECT id FROM categories WHERE slug = 'spices-sauces'), 'פפריקה מתוקה', 'sweet-paprika', 'פפריקה מתוקה איכותית, 100 גרם', 8.90, 'יחידה', 180, true, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400'),
  ((SELECT id FROM categories WHERE slug = 'spices-sauces'), 'רסק עגבניות', 'tomato-paste', 'רסק עגבניות טבעי, 250 גרם', 4.90, 'יחידה', 300, false, 'https://images.unsplash.com/photo-1579294970425-2e65c9c99153?w=400');

-- -------------------------
-- Products — Bakery (מאפים ולחם)
-- -------------------------
INSERT INTO products (category_id, name_he, slug, description_he, price, unit, stock_qty, is_featured, image_url) VALUES
  ((SELECT id FROM categories WHERE slug = 'bakery'), 'קרואסון חמאה', 'butter-croissant', 'קרואסון חמאה צרפתי טרי, 3 יחידות', 15.90, 'חבילה', 60, true, 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400');

-- -------------------------
-- Products — Meat & Poultry (בשר ועוף)
-- -------------------------
INSERT INTO products (category_id, name_he, slug, description_he, price, unit, stock_qty, is_featured, image_url) VALUES
  ((SELECT id FROM categories WHERE slug = 'meat-poultry'), 'סטייק אנטריקוט', 'entrecote-steak', 'סטייק אנטריקוט פרימיום מיושן', 139.90, 'ק"ג', 40, true, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400'),
  ((SELECT id FROM categories WHERE slug = 'meat-poultry'), 'חלקי עוף למרק', 'chicken-soup-parts', 'חלקי עוף נבחרים למרק טעים ועשיר', 18.90, 'ק"ג', 80, false, 'https://images.unsplash.com/photo-1612966804561-399a9a5f22e7?w=400');
