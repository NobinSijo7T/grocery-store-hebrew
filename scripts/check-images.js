const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env
const envFile = fs.readFileSync('.env', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const url = envVars.EXPO_PUBLIC_SUPABASE_URL;
const key = envVars.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

async function checkUrl(imgUrl) {
  if (!imgUrl) return { ok: false, status: 'NO_URL' };
  try {
    const res = await fetch(imgUrl, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } });
    const contentType = res.headers.get('content-type') || '';
    return {
      ok: res.ok && contentType.startsWith('image/'),
      status: res.status,
      contentType,
    };
  } catch (err) {
    return { ok: false, status: 'ERROR', error: err.message };
  }
}

async function main() {
  console.log('Fetching all products from DB...');
  const { data: products, error } = await supabase.from('products').select('id, name_he, slug, image_url');
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`Found ${products.length} products. Checking images...\n`);
  const broken = [];
  const valid = [];

  for (const p of products) {
    const res = await checkUrl(p.image_url);
    if (!res.ok) {
      console.log(`❌ BROKEN: [${p.slug}] "${p.name_he}" -> ${p.image_url} (status: ${res.status}, type: ${res.contentType})`);
      broken.push({ ...p, ...res });
    } else {
      console.log(`✅ OK: [${p.slug}] "${p.name_he}"`);
      valid.push(p);
    }
  }

  console.log(`\n========================================`);
  console.log(`Total Products: ${products.length}`);
  console.log(`Working: ${valid.length}`);
  console.log(`Broken: ${broken.length}`);
  console.log(`========================================\n`);

  console.log('Checking banners...');
  const { data: banners } = await supabase.from('banners').select('id, title_he, image_url');
  if (banners) {
    for (const b of banners) {
      const res = await checkUrl(b.image_url);
      if (!res.ok) {
        console.log(`❌ BANNER BROKEN: [${b.id}] "${b.title_he}" -> ${b.image_url} (${res.status})`);
      } else {
        console.log(`✅ BANNER OK: [${b.id}] "${b.title_he}"`);
      }
    }
  }

  console.log('\nChecking offers...');
  const { data: offers } = await supabase.from('offers').select('id, title_he, banner_image_url');
  if (offers) {
    for (const o of offers) {
      const res = await checkUrl(o.banner_image_url);
      if (!res.ok) {
        console.log(`❌ OFFER BROKEN: [${o.id}] "${o.title_he}" -> ${o.banner_image_url} (${res.status})`);
      } else {
        console.log(`✅ OFFER OK: [${o.id}] "${o.title_he}"`);
      }
    }
  }
}

main();
