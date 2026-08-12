const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env manually so we don't depend on dotenv package or newer Node features
const envFile = fs.readFileSync('.env', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1]] = match[2];
  }
});

const url = envVars.EXPO_PUBLIC_SUPABASE_URL;
const key = envVars.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("❌ Missing Supabase keys in .env!");
  process.exit(1);
}

const supabase = createClient(url, key);

async function testConnection() {
  console.log(`Connecting to: ${url}`);
  try {
    // A simple query to check connection, e.g. querying a system table or just auth state
    // Let's just list the tables or check session to confirm API is reachable
    const { data, error } = await supabase.from('products').select('*').limit(1);
    
    if (error) {
      console.error("❌ Error connecting to Supabase or accessing 'products' table:");
      console.error(error);
    } else {
      console.log("✅ Successfully connected to Supabase!");
      console.log("Data from 'products' table:", data);
    }
  } catch (err) {
    console.error("❌ Unexpected error:", err);
  }
}

testConnection();
