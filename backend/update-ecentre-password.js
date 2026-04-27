// Update E-Centre password
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updatePassword() {
    console.log('🔐 Updating E-Centre password...');
    
    const password = 'EcentreTest123!';
    const hash = await bcrypt.hash(password, 12);
    
    console.log('Generated hash:', hash);
    console.log('Hash length:', hash.length);
    
    // Update password
    const { error } = await supabase
        .from('ecentres')
        .update({ password: hash })
        .eq('email', 'greenrecycle@eclear.com');
    
    if (error) {
        console.error('❌ Error:', error);
        return;
    }
    
    console.log('✅ Password updated successfully!');
    console.log('');
    console.log('📧 Email: greenrecycle@eclear.com');
    console.log('🔑 Password: EcentreTest123!');
    console.log('🌐 Login at: http://localhost:4000/auth/login-ecentre');
    
    // Verify
    const { data: ecentre } = await supabase
        .from('ecentres')
        .select('email, name, password')
        .eq('email', 'greenrecycle@eclear.com')
        .single();
    
    if (ecentre) {
        console.log('');
        console.log('✅ Verification:');
        console.log('   Email:', ecentre.email);
        console.log('   Name:', ecentre.name);
        console.log('   Password hash length:', ecentre.password.length);
        
        // Test the password
        const isValid = await bcrypt.compare(password, ecentre.password);
        console.log('   Password validation:', isValid ? '✅ PASS' : '❌ FAIL');
    }
}

updatePassword();
