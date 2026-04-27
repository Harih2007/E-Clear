// Generate correct password hash for TestUser123!
const bcrypt = require('bcryptjs');

async function generateHash() {
    const password = 'TestUser123!';
    console.log('Generating hash for password:', password);
    
    const hash = await bcrypt.hash(password, 12);
    console.log('\n✅ Generated hash:');
    console.log(hash);
    console.log('\nHash length:', hash.length);
    
    // Verify it works
    const isValid = await bcrypt.compare(password, hash);
    console.log('\n✅ Verification:', isValid ? 'PASS' : 'FAIL');
    
    // Now update the user in database
    require('dotenv').config();
    const { createClient } = require('@supabase/supabase-js');
    
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    console.log('\nUpdating user in database...');
    
    const { error } = await supabase
        .from('users')
        .update({ password: hash })
        .eq('email', 'testuser@eclear.com');
    
    if (error) {
        console.error('❌ Error updating user:', error);
    } else {
        console.log('✅ User password updated successfully!');
        console.log('\nYou can now login with:');
        console.log('Email: testuser@eclear.com');
        console.log('Password: TestUser123!');
    }
}

generateHash();
