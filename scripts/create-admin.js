const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');

// Admin credentials to create
const ADMIN_EMAIL = 'admin@grocery.com';
const ADMIN_PASSWORD = 'Admin@1234';
const ADMIN_NAME = 'Super Admin';

// Supabase client with service role key (bypasses RLS)
const supabase = createClient(
  'https://mgtpfdmunnklomapdsub.supabase.co',
  'sb_secret_9wwk3mml8xrvhmLOF9M1oQ_5bOI4Np9'
);

// Direct DB client to set role
const db = new Client({
  host: 'db.mgtpfdmunnklomapdsub.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'sero-hebrw123',
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
});

async function createSuperAdmin() {
  try {
    console.log('🔌 Connecting to database...');
    await db.connect();
    console.log('✅ Connected!\n');

    // Step 1: Create auth user via Supabase Admin API
    console.log(`👤 Creating auth user: ${ADMIN_EMAIL}`);
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true, // auto-confirm email
    });

    if (authError) {
      if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
        console.log('⚠️  Auth user already exists, fetching existing user...');
        // Try to get the existing user
        const { data: users } = await supabase.auth.admin.listUsers();
        const existing = users?.users?.find(u => u.email === ADMIN_EMAIL);
        if (!existing) throw new Error('Could not find existing admin user');
        authData = { user: existing };
      } else {
        throw authError;
      }
    }

    const authUserId = authData.user.id;
    console.log(`✅ Auth user created! ID: ${authUserId}\n`);

    // Step 2: Insert into customers table with admin role
    console.log('🛡️  Inserting admin record into customers table...');
    await db.query(`
      INSERT INTO customers (auth_user_id, full_name, phone, role)
      VALUES ($1, $2, $3, 'admin')
      ON CONFLICT (auth_user_id) 
      DO UPDATE SET role = 'admin', full_name = $2;
    `, [authUserId, ADMIN_NAME, null]);

    console.log('✅ Admin record created/updated in customers table!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Super Admin credentials ready!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email:    ${ADMIN_EMAIL}`);
    console.log(`🔑 Password: ${ADMIN_PASSWORD}`);
    console.log(`👑 Role:     admin`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await db.end();
  }
}

createSuperAdmin();
