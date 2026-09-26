/**
 * Script to create admin user in Supabase
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

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  console.log('🚀 Creating admin user...\n');

  const adminEmail = 'admin@kirshnerfarm.com';
  const adminPassword = 'Admin@123456';
  const adminName = 'Admin User';

  try {
    // Step 1: Create auth user
    console.log('📝 Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: adminName
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('⚠️  User already exists. Checking customer record...');
        
        // Get the existing user
        const { data: users, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;
        
        const existingUser = users.users.find(u => u.email === adminEmail);
        if (!existingUser) {
          throw new Error('User exists but cannot find it');
        }

        // Check if customer record exists
        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('auth_user_id', existingUser.id)
          .single();

        if (customerError && customerError.code !== 'PGRST116') {
          throw customerError;
        }

        if (customer) {
          // Update existing customer to admin
          const { error: updateError } = await supabase
            .from('customers')
            .update({ role: 'admin' })
            .eq('id', customer.id);

          if (updateError) throw updateError;
          
          console.log('✅ Updated existing user to admin role!');
        } else {
          // Create customer record
          const { error: createError } = await supabase
            .from('customers')
            .insert({
              auth_user_id: existingUser.id,
              full_name: adminName,
              role: 'admin'
            });

          if (createError) throw createError;
          
          console.log('✅ Created customer record with admin role!');
        }

        console.log('\n🎉 Admin user is ready!');
        console.log('\nLogin credentials:');
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Password: ${adminPassword}`);
        return;
      }
      throw authError;
    }

    console.log('✅ Auth user created!');

    // Step 2: Create customer record with admin role
    console.log('📝 Creating customer record...');
    const { error: customerError } = await supabase
      .from('customers')
      .insert({
        auth_user_id: authData.user.id,
        full_name: adminName,
        role: 'admin',
        phone: null
      });

    if (customerError) {
      console.error('❌ Failed to create customer record:', customerError.message);
      
      // Try to clean up auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw customerError;
    }

    console.log('✅ Customer record created with admin role!');

    console.log('\n🎉 Admin user created successfully!');
    console.log('\nLogin credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('\nYou can now log in to the app with these credentials.');

  } catch (error) {
    console.error('\n❌ Error creating admin user:', error.message);
    console.log('\n📋 Manual steps:');
    console.log('1. Go to your app and click "Sign Up"');
    console.log('2. Use these credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('   Name: ${adminName}');
    console.log('3. The trigger will automatically assign admin role');
    process.exit(1);
  }
}

createAdminUser();
