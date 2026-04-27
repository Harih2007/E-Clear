const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkColumns() {
    console.log('Checking if columns exist...\n');
    
    // Check disposal_requests table
    console.log('1. Checking disposal_requests table:');
    const { data: requests, error: reqError } = await supabase
        .from('disposal_requests')
        .select('*')
        .limit(1);
    
    if (reqError) {
        console.error('Error querying disposal_requests:', reqError);
    } else if (requests && requests.length > 0) {
        console.log('Sample disposal_request columns:', Object.keys(requests[0]));
        console.log('Has assigned_pickup_person?', 'assigned_pickup_person' in requests[0]);
    } else {
        console.log('No requests found, but table exists');
    }
    
    console.log('\n2. Checking ecentres table:');
    const { data: ecentres, error: ecError } = await supabase
        .from('ecentres')
        .select('*')
        .limit(1);
    
    if (ecError) {
        console.error('Error querying ecentres:', ecError);
    } else if (ecentres && ecentres.length > 0) {
        console.log('Sample ecentre columns:', Object.keys(ecentres[0]));
        console.log('Has pickup_persons?', 'pickup_persons' in ecentres[0]);
    } else {
        console.log('No ecentres found, but table exists');
    }
    
    console.log('\n3. Checking test E-Centre pickup persons:');
    const { data: testEcentre } = await supabase
        .from('ecentres')
        .select('name, email, pickup_persons')
        .eq('email', 'greenrecycle@eclear.com')
        .single();
    
    if (testEcentre) {
        console.log('Test E-Centre:', testEcentre.name);
        console.log('Pickup persons:', testEcentre.pickup_persons);
    } else {
        console.log('Test E-Centre not found');
    }
}

checkColumns().then(() => {
    console.log('\nDone!');
    process.exit(0);
}).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
