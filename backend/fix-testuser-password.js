const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixPassword() {
    const password = 'TestUser123!';
    
    console.log('Generating hash for:', password);
    const hash = await bcrypt.hash(password, 12);
    console.log('Generated hash:', hash);
    
    // Test the hash
    const isValid = await bcrypt.compare(password, hash);
    console.log('Hash validation test:', isValid);
    
    if (!isValid) {
        console.error('❌ Hash validation failed!');
        return;
    }
    
    // Update in database
    const { error } = await supabase
        .from('users')
        .update({ password: hash })
        .eq('email', 'testuser@eclear.com');
    
    if (error) {
        console.error('Error updating:', error);
    } else {
        console.log('✅ Password updated successfully!');
        
        // Verify in database
        const { data } = await supabase
            .from('users')
            .select('password')
            .eq('email', 'testuser@eclear.com')
            .single();
        
        if (data) {
            const dbValid = await bcrypt.compare(password, data.password);
            console.log('Database verification:', dbValid);
        }
    }
}

fixPassword().then(() => {
    console.log('\nDone! You can now login with:');
    console.log('Email: testuser@eclear.com');
    console.log('Password: TestUser123!');
    process.exit(0);
}).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
