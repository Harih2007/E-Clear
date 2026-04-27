-- Create E-Centre Test Account
-- Run this in Supabase SQL Editor

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
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSKJxqaa',
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

-- Verify E-Centre was created
SELECT email, name, phone_number FROM ecentres WHERE email = 'greenrecycle@eclear.com';
