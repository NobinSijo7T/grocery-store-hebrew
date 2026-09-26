/**
 * Script to add English translations to banners and setup admin
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

const bannerTranslations = [
  {
    title_he: 'פירות וירקות טריים כל יום!',
    title_en: 'Fresh Fruits and Vegetables Every Day!',
    subtitle_en: 'Free delivery on orders over ₪150'
  },
  {
    title_he: 'מבצע השבוע: בננות ב-₪7.90 לק"ג',
    title_en: 'Weekly Special: Bananas at ₪7.90/kg',
    subtitle_en: 'Limited stock, hurry up!'
  },
  {
    title_he: 'מוצרים אורגניים',
    title_en: 'Organic Products',
    subtitle_en: 'Fresh from the farm directly to you'
  }
];

async function addBannerColumns() {
  console.log('⚠️  Database columns need to be added via SQL Editor\n');
  console.log('Go to: https://supabase.com/dashboard/project/gcihfcmnroxlxwuakvbm/sql/new\n');
  console.log('Run this SQL:\n');
  console.log('─'.repeat(70));
  console.log('ALTER TABLE banners ADD COLUMN IF NOT EXISTS title_en TEXT;');
  console.log('ALTER TABLE banners ADD COLUMN IF NOT EXISTS subtitle_en TEXT;');
  console.log('─'.repeat(70));
  console.log('\nThen run this script again.\n');
}

async function updateBanners() {
  console.log('📝 Updating banners with English translations...\n');
  let successCount = 0;
  let errorCount = 0;

  for (const translation of bannerTranslations) {
    const { error } = await supabase
      .from('banners')
      .update({ 
        title_en: translation.title_en,
        subtitle_en: translation.subtitle_en 
      })
      .eq('title_he', translation.title_he);

    if (error) {
      if (error.message.includes('title_en')) {
        await addBannerColumns();
        return false;
      }
      console.error(`❌ Failed to update banner "${translation.title_he}":`, error.message);
      errorCount++;
    } else {
      console.log(`✓ Updated banner: ${translation.title_he} → ${translation.title_en}`);
      successCount++;
    }
  }

  console.log(`\n✅ Banners: ${successCount} updated, ${errorCount} errors\n`);
  return errorCount === 0;
}

async function setupAdminInstructions() {
  console.log('📋 Admin Setup Instructions:\n');
  console.log('1. The admin role trigger has been set up in the database');
  console.log('2. To create an admin account:\n');
  console.log('   a. Open your app and go to the Register screen');
  console.log('   b. Sign up with these credentials:');
  console.log('      Email: admin@kirshnerfarm.com');
  console.log('      Password: Admin@123456 (or your choice)');
  console.log('      Name: Admin User\n');
  console.log('3. The system will automatically assign admin role');
  console.log('4. Admin users can access the admin panel at /(admin) routes\n');
  console.log('✅ Admin authentication is now configured!\n');
}

async function main() {
  console.log('🚀 Setting up banners and admin authentication...\n');
  
  try {
    const success = await updateBanners();
    if (success) {
      await setupAdminInstructions();
      console.log('🎉 Setup completed successfully!');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
