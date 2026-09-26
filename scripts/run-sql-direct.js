/**
 * Script to run SQL directly on Supabase using SQL endpoint
 */

const https = require('https');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const SQL_TO_RUN = `
-- Add English columns
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_en TEXT;
CREATE INDEX IF NOT EXISTS idx_products_name_en ON products USING gin (to_tsvector('english', COALESCE(name_en, '')));
`;

async function executeSql(sql) {
  return new Promise((resolve, reject) => {
    const url = new URL(supabaseUrl);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: '/rest/v1/rpc/exec',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify({ sql }));
    req.end();
  });
}

async function main() {
  console.log('🚀 Attempting to add English columns...\n');

  console.log('⚠️  Supabase does not allow DDL operations via REST API.');
  console.log('📋 You need to run this SQL manually in Supabase Dashboard:\n');
  console.log('1. Go to: https://supabase.com/dashboard/project/gcihfcmnroxlxwuakvbm/sql/new');
  console.log('2. Paste this SQL:\n');
  console.log('─'.repeat(70));
  console.log(SQL_TO_RUN);
  console.log('─'.repeat(70));
  console.log('\n3. Click "RUN" button');
  console.log('4. After it completes, run: node scripts/add-english-translations.js\n');
}

main();
