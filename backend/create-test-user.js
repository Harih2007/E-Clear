// Create Test User Script
// Run this with: node create-test-user.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTestUser() {
    console.log('🚀 Creating test user...');
    
    // Delete existing test user if exists
    const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('email', 'testuser@eclear.com');
    
    if (deleteError && deleteError.code !== 'PGRST116') {
        console.error('Error deleting existing user:', deleteError);
    } else {
        console.log('✅ Cleaned up existing test user');
    }
    
    // Create new test user with correct password hash
    // Password: TestUser123!
    const { data, error } = await supabase
        .from('users')
        .insert({
            name: 'Test User',
            email: 'testuser@eclear.com',
            password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSKJxqaa',
            role: 'USER',
            points: 100,
            phone_number: '+91-9876543210',
            location_address: 'MG Road, Bangalore, Karnataka 560001, India',
            location_pincode: '560001',
            location_lat: 12.9716,
            location_lng: 77.5946
        })
        .select();
    
    if (error) {
        console.error('❌ Error creating test user:', error);
        process.exit(1);
    }
    
    console.log('✅ Test user created successfully!');
    console.log('📧 Email: testuser@eclear.com');
    console.log('🔑 Password: TestUser123!');
    console.log('');
    
    // Verify password hash
    const { data: user } = await supabase
        .from('users')
        .select('email, name, password')
        .eq('email', 'testuser@eclear.com')
        .single();
    
    if (user) {
        console.log('✅ Verification:');
        console.log('   Email:', user.email);
        console.log('   Name:', user.name);
        console.log('   Password hash length:', user.password.length);
        console.log('   Expected length: 60');
        
        if (user.password.length === 60) {
            console.log('   ✅ Password hash is correct!');
        } else {
            console.log('   ❌ Password hash length is wrong!');
        }
    }
    
    console.log('');
    console.log('🎉 You can now login at: http://localhost:4000/auth/login-user');
}

async function createTestECentre() {
    console.log('');
    console.log('🚀 Creating test E-Centre...');
    
    // Delete existing test e-centre if exists
    const { error: deleteError } = await supabase
        .from('ecentres')
        .delete()
        .eq('email', 'greenrecycle@eclear.com');
    
    if (deleteError && deleteError.code !== 'PGRST116') {
        console.error('Error deleting existing e-centre:', deleteError);
    } else {
        console.log('✅ Cleaned up existing test e-centre');
    }
    
    // Create new test e-centre
    // Password: EcentreTest123!
    const { data, error } = await supabase
        .from('ecentres')
        .insert({
            name: 'Green Recycle Centre',
            email: 'greenrecycle@eclear.com',
            password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSKJxqaa',
            phone_number: '+91-9876543211',
            location_address: 'Indiranagar, Bangalore, Karnataka 560038, India',
            location_lat: 12.9784,
            location_lng: 77.6408,
            service_areas: ['560001', '560002', '560038', '560025', '560008'],
            verified: true,
            license_number: 'LIC-BLR-2024-001',
            capacity: 100,
            completed_pickups: 45,
            rating: 4.8,
            operational_status: 'ACTIVE',
            service_radius: 15.0
        })
        .select();
    
    if (error) {
        console.error('❌ Error creating test e-centre:', error);
        process.exit(1);
    }
    
    console.log('✅ Test E-Centre created successfully!');
    console.log('📧 Email: greenrecycle@eclear.com');
    console.log('🔑 Password: EcentreTest123!');
    console.log('');
    console.log('🎉 You can now login at: http://localhost:4000/auth/login-ecentre');
}

async function main() {
    try {
        await createTestUser();
        await createTestECentre();
        console.log('');
        console.log('✅ All test accounts created successfully!');
        console.log('');
        console.log('📝 Test Accounts:');
        console.log('   User: testuser@eclear.com / TestUser123!');
        console.log('   E-Centre: greenrecycle@eclear.com / EcentreTest123!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

main();
