-- ============================================================
-- Fix Broken Product Image URLs
-- ============================================================
-- Updates 404/broken Unsplash links with verified working, high-res images.

UPDATE products
SET image_url = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400'
WHERE slug = 'cherry-tomatoes';

UPDATE products
SET image_url = 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400'
WHERE slug = 'chicken-breast';

UPDATE products
SET image_url = 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400'
WHERE slug = 'challah';

UPDATE products
SET image_url = 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400'
WHERE slug = 'dried-chickpeas';

UPDATE products
SET image_url = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'
WHERE slug = 'walnuts';

UPDATE products
SET image_url = 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=400'
WHERE slug = 'dates';

UPDATE products
SET image_url = 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400'
WHERE slug = 'black-pepper';

UPDATE products
SET image_url = 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400'
WHERE slug = 'tomato-paste';

UPDATE products
SET image_url = 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400'
WHERE slug = 'chicken-soup-parts';
