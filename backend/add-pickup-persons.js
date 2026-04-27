// Add pickup persons to E-Centre
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addPickupPersons() {
    console.log('👥 Adding pickup persons to E-Centre...');
    
    // Get E-Centre ID
    const { data: ecentre } = await supabase
        .from('ecentres')
        .select('id, name')
        .eq('email', 'greenrecycle@eclear.com')
        .single();
    
    if (!ecentre) {
        console.log('❌ E-Centre not found');
        return;
    }
    
    console.log('✅ Found E-Centre:', ecentre.name);
    
    // Add pickup_persons column data
    const pickupPersons = [
        {
            id: 'person-1',
            name: 'Ramesh Kumar',
            phone: '+91-9876543301',
            vehicle: 'TWO_WHEELER',
            active: true
        },
        {
            id: 'person-2',
            name: 'Rahul Sharma',
            phone: '+91-9876543302',
            vehicle: 'SMALL_VEHICLE',
            active: true
        },
        {
            id: 'person-3',
            name: 'Suresh Patel',
            phone: '+91-9876543303',
            vehicle: 'TWO_WHEELER',
            active: true
        },
        {
            id: 'person-4',
            name: 'Vijay Singh',
            phone: '+91-9876543304',
            vehicle: 'SMALL_VEHICLE',
            active: true
        }
    ];
    
    // Update E-Centre with pickup persons
    const { error } = await supabase
        .from('ecentres')
        .update({ 
            pickup_persons: pickupPersons
        })
        .eq('id', ecentre.id);
    
    if (error) {
        console.error('❌ Error:', error);
        return;
    }
    
    console.log('✅ Pickup persons added successfully!');
    console.log('');
    console.log('👥 Pickup Persons:');
    pickupPersons.forEach(person => {
        console.log(`   - ${person.name} (${person.phone}) - ${person.vehicle}`);
    });
}

addPickupPersons();
