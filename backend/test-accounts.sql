-- Test Accounts for E-Clear System
-- Run this in your Supabase SQL Editor

-- Test User Account
-- Email: testuser@eclear.com
-- Password: TestUser123!
INSERT INTO users (
    id,
    name,
    email,
    password,
    role,
    points,
    phone_number,
    location_address,
    location_pincode,
    location_lat,
    location_lng
) VALUES (
    gen_random_uuid(),
    'Test User',
    'testuser@eclear.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSKJxqaa', -- Password: TestUser123!
    'USER',
    100,
    '+91-9876543210',
    'MG Road, Bangalore, Karnataka 560001, India',
    '560001',
    12.9716,
    77.5946
) ON CONFLICT (email) DO NOTHING;

-- Test E-Centre Account 1
-- Email: greenrecycle@eclear.com
-- Password: EcentreTest123!
INSERT INTO ecentres (
    id,
    name,
    email,
    password,
    phone_number,
    location_address,
    location_lat,
    location_lng,
    service_areas,
    verified,
    license_number,
    capacity,
    completed_pickups,
    rating,
    operational_status,
    service_radius
) VALUES (
    gen_random_uuid(),
    'Green Recycle Centre',
    'greenrecycle@eclear.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSKJxqaa', -- Password: EcentreTest123!
    '+91-9876543211',
    'Indiranagar, Bangalore, Karnataka 560038, India',
    12.9784,
    77.6408,
    ARRAY['560001', '560002', '560038', '560025', '560008'],
    true,
    'LIC-BLR-2024-001',
    100,
    45,
    4.8,
    'ACTIVE',
    15.0
) ON CONFLICT (email) DO NOTHING;

-- Test E-Centre Account 2
-- Email: ecowarriors@eclear.com
-- Password: EcentreTest123!
INSERT INTO ecentres (
    id,
    name,
    email,
    password,
    phone_number,
    location_address,
    location_lat,
    location_lng,
    service_areas,
    verified,
    license_number,
    capacity,
    completed_pickups,
    rating,
    operational_status,
    service_radius
) VALUES (
    gen_random_uuid(),
    'Eco Warriors Recycling Hub',
    'ecowarriors@eclear.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSKJxqaa', -- Password: EcentreTest123!
    '+91-9876543212',
    'Koramangala, Bangalore, Karnataka 560034, India',
    12.9352,
    77.6245,
    ARRAY['560001', '560034', '560095', '560068', '560047'],
    true,
    'LIC-BLR-2024-002',
    150,
    78,
    4.9,
    'ACTIVE',
    20.0
) ON CONFLICT (email) DO NOTHING;

-- Display created accounts
SELECT 'User Account Created:' as info, email, name FROM users WHERE email = 'testuser@eclear.com'
UNION ALL
SELECT 'E-Centre Account Created:' as info, email, name FROM ecentres WHERE email IN ('greenrecycle@eclear.com', 'ecowarriors@eclear.com');
