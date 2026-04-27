const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixVehicleTypes() {
    console.log('Updating vehicle types to match frontend...\n');
    
    const { data, error } = await supabase
        .from('ecentres')
        .update({
            pickup_persons: [
                {
                    id: 'person-1',
                    name: 'Ramesh Kumar',
                    phone: '+91-9876543301',
                    vehicle: 'BIKE',
                    active: true
                },
                {
                    id: 'person-2',
                    name: 'Rahul Sharma',
                    phone: '+91-9876543302',
                    vehicle: 'PICKUP_TRUCK',
                    active: true
                },
                {
                    id: 'person-3',
                    name: 'Suresh Patel',
                    phone: '+91-9876543303',
                    vehicle: 'BIKE',
                    active: true
                },
                {
                    id: 'person-4',
                    name: 'Vijay Singh',
                    phone: '+91-9876543304',
                    vehicle: 'PICKUP_TRUCK',
                    active: true
                }
            ]
        })
        .eq('email', 'greenrecycle@eclear.com')
        .select();
    
    if (error) {
        console.error('Error updating:', error);
    } else {
        console.log('✅ Updated successfully!');
        console.log('New pickup persons:', data[0].pickup_persons);
    }
}

fixVehicleTypes().then(() => {
    console.log('\nDone!');
    process.exit(0);
}).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
