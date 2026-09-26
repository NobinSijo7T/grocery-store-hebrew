/**
 * Script to add English columns to database using raw SQL
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  console.log('🚀 Adding English columns to database...\n');
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '006_add_english_columns.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📝 SQL to execute:');
    console.log(sql);
    console.log('\n');

    // Execute SQL using REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      const error = await response.text();
      console.log('⚠️  Direct SQL execution not available via RPC.');
      console.log('📋 Please run the following SQL in Supabase SQL Editor:\n');
      console.log('1. Go to https://app.supabase.com/project/gcihfcmnroxlxwuakvbm/sql');
      console.log('2. Copy and paste this SQL:\n');
      console.log('─'.repeat(60));
      console.log(sql);
      console.log('─'.repeat(60));
      console.log('\n3. Click "Run" to execute');
      console.log('\n4. Then run: node scripts/add-english-translations.js');
    } else {
      console.log('✅ Columns added successfully!');
      console.log('\nNow run: node scripts/add-english-translations.js');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
