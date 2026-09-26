/**
 * Script to add English translations to products and categories
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const categoryTranslations = {
  'vegetables': 'Vegetables',
  'fruits': 'Fruits',
  'dairy': 'Dairy',
  'meat-poultry': 'Meat & Poultry',
  'bakery': 'Bakery',
  'beverages': 'Beverages',
  'deli': 'Deli',
  'eggs-legumes': 'Eggs & Legumes',
  'dried-fruits-nuts': 'Dried Fruits & Nuts',
  'spices-sauces': 'Spices & Sauces',
};

const productTranslations = {
  'cherry-tomatoes': { name: 'Cherry Tomatoes', description: 'Fresh and sweet cherry tomatoes, locally grown' },
  'cucumbers': { name: 'Cucumbers', description: 'Green and crispy cucumbers' },
  'red-pepper': { name: 'Red Bell Pepper', description: 'Sweet red bell pepper, perfect for salads and cooking' },
  'onions': { name: 'Onions', description: 'Quality dry onions for everyday cooking' },
  'carrots': { name: 'Carrots', description: 'Fresh and sweet carrots, perfect for soups and salads' },
  'lettuce': { name: 'Lettuce', description: 'Fresh and crispy green lettuce' },
  'green-apples': { name: 'Green Apples', description: 'Granny Smith apples, tart and crispy' },
  'bananas': { name: 'Bananas', description: 'Ripe and sweet bananas' },
  'strawberries': { name: 'Strawberries', description: 'Fresh red strawberries, locally grown' },
  'watermelon': { name: 'Watermelon', description: 'Sweet and juicy watermelon' },
  'green-grapes': { name: 'Green Grapes', description: 'Seedless green grapes' },
  'avocado': { name: 'Avocado', description: 'Ripe Hass avocado, premium quality' },
  'milk-3-percent': { name: 'Milk 3%', description: 'Fresh milk 3% fat, 1 liter' },
  'white-cheese-5': { name: 'White Cheese 5%', description: 'Soft white cheese 5% fat, 250 grams' },
  'natural-yogurt': { name: 'Natural Yogurt', description: 'Natural yogurt 1.5%, 500 grams' },
  'butter': { name: 'Butter', description: 'Fresh butter 200 grams' },
  'chicken-breast': { name: 'Fresh Chicken Breast', description: 'Fresh premium chicken breast, boneless' },
  'chicken-drumsticks': { name: 'Chicken Drumsticks', description: 'Fresh chicken drumsticks' },
  'ground-beef': { name: 'Ground Beef', description: 'Fresh ground beef' },
  'whole-wheat-bread': { name: 'Whole Wheat Bread', description: 'Fresh whole wheat bread, baked daily' },
  'challah': { name: 'Challah', description: 'Fresh braided challah for Shabbat' },
  'pita-bread': { name: 'Pita Bread', description: 'Fresh pita bread, pack of 6' },
  'mineral-water': { name: 'Mineral Water', description: 'Natural mineral water, 1.5 liters' },
  'orange-juice': { name: 'Natural Orange Juice', description: 'Freshly squeezed natural orange juice, 1 liter' },
  'cola': { name: 'Cola', description: 'Cola 1.5 liters' },
  'free-range-eggs': { name: 'Free Range Eggs', description: 'Free range eggs from happy chickens, pack of 12' },
  'dried-chickpeas': { name: 'Dried Chickpeas', description: 'Premium dried chickpeas, 500 grams' },
  'red-lentils': { name: 'Red Lentils', description: 'Red lentils, 500 grams' },
  'grated-yellow-cheese': { name: 'Grated Yellow Cheese', description: 'Grated yellow cheese, excellent for pizza and pasta, 200 grams' },
  'goat-cheese': { name: 'Goat Cheese', description: 'Premium goat cheese, 200 gram roll' },
  'roasted-almonds': { name: 'Roasted Almonds', description: 'Lightly salted roasted almonds, 250 grams' },
  'walnuts': { name: 'Walnuts', description: 'Natural premium walnuts, 200 grams' },
  'dates': { name: 'Dates', description: 'Juicy Medjool dates, 500 grams' },
  'black-pepper': { name: 'Black Pepper', description: 'Ground black pepper, 100 grams' },
  'sweet-paprika': { name: 'Sweet Paprika', description: 'Quality sweet paprika, 100 grams' },
  'tomato-paste': { name: 'Tomato Paste', description: 'Natural tomato paste, 250 grams' },
  'butter-croissant': { name: 'Butter Croissant', description: 'Fresh French butter croissant, pack of 3' },
  'entrecote-steak': { name: 'Entrecote Steak', description: 'Premium aged entrecote steak' },
  'chicken-soup-parts': { name: 'Chicken Soup Parts', description: 'Selected chicken parts for rich and tasty soup' },
};

async function updateCategories() {
  console.log('📝 Updating categories...');
  let successCount = 0;
  let errorCount = 0;

  for (const [slug, name_en] of Object.entries(categoryTranslations)) {
    const { error } = await supabase
      .from('categories')
      .update({ name_en })
      .eq('slug', slug);

    if (error) {
      console.error(`❌ Failed to update category ${slug}:`, error.message);
      errorCount++;
    } else {
      console.log(`✓ Updated category: ${slug} → ${name_en}`);
      successCount++;
    }
  }

  console.log(`\n✅ Categories: ${successCount} updated, ${errorCount} errors\n`);
}

async function updateProducts() {
  console.log('📝 Updating products...');
  let successCount = 0;
  let errorCount = 0;

  for (const [slug, translation] of Object.entries(productTranslations)) {
    const { error } = await supabase
      .from('products')
      .update({ 
        name_en: translation.name,
        description_en: translation.description 
      })
      .eq('slug', slug);

    if (error) {
      console.error(`❌ Failed to update product ${slug}:`, error.message);
      errorCount++;
    } else {
      console.log(`✓ Updated product: ${slug} → ${translation.name}`);
      successCount++;
    }
  }

  console.log(`\n✅ Products: ${successCount} updated, ${errorCount} errors\n`);
}

async function main() {
  console.log('🚀 Starting to add English translations...\n');
  
  try {
    await updateCategories();
    await updateProducts();
    
    console.log('🎉 All translations added successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
