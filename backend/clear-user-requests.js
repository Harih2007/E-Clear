// Clear all requests for test user
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function clearRequests() {
    console.log('🧹 Clearing all requests for testuser@eclear.com...');
    
    // Get user ID
    const { data: user } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', 'testuser@eclear.com')
        .single();
    
    if (!user) {
        console.log('❌ User not found');
        return;
    }
    
    console.log('✅ Found user:', user.email);
    
    // Get all requests
    const { data: requests } = await supabase
        .from('disposal_requests')
        .select('id, status')
        .eq('user_id', user.id);
    
    console.log(`📦 Found ${requests?.length || 0} requests`);
    
    if (requests && requests.length > 0) {
        // Delete all requests
        const { error } = await supabase
            .from('disposal_requests')
            .delete()
            .eq('user_id', user.id);
        
        if (error) {
            console.error('❌ Error deleting requests:', error);
        } else {
            console.log('✅ All requests deleted!');
            console.log('\n🎉 You can now submit a new pickup request!');
        }
    } else {
        console.log('✅ No requests to delete');
    }
}

clearRequests();
