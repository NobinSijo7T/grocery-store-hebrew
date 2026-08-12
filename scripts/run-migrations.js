const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  host: 'db.mgtpfdmunnklomapdsub.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'sero-hebrw123',
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
});

const migrations = [
  '001_create_tables.sql',
  '002_rls_policies.sql',
  '003_seed_data.sql',
  '004_seed_more_products.sql',
];

async function runMigrations() {
  try {
    console.log('🔌 Connecting to Supabase database...');
    await client.connect();
    console.log('✅ Connected!\n');

    for (const file of migrations) {
      const filePath = path.join(__dirname, '..', 'supabase', 'migrations', file);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`⏳ Running ${file}...`);
      try {
        await client.query(sql);
        console.log(`✅ ${file} — Done!\n`);
      } catch (err) {
        // Some errors like "already exists" are safe to ignore
        if (
          err.message.includes('already exists') ||
          err.message.includes('duplicate')
        ) {
          console.log(`⚠️  ${file} — Skipped (already applied): ${err.message}\n`);
        } else {
          console.error(`❌ ${file} — Error:`, err.message);
        }
      }
    }

    console.log('🎉 All migrations completed!');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  } finally {
    await client.end();
  }
}

runMigrations();
