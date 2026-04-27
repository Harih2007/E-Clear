-- Delete the existing test user and recreate with correct password
DELETE FROM users WHERE email = 'testuser@eclear.com';

-- Insert test user with correct password hash
-- Password: TestUser123!
-- Hash: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSKJxqaa
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
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSKJxqaa',
    'USER',
    100,
    '+91-9876543210',
    'MG Road, Bangalore, Karnataka 560001, India',
    '560001',
    12.9716,
    77.5946
);

-- Verify the password hash is exactly 60 characters
SELECT 
    email, 
    name, 
    role,
    password,
    LENGTH(password) as password_length,
    CASE 
        WHEN LENGTH(password) = 60 THEN '✅ Correct length'
        ELSE '❌ Wrong length'
    END as status
FROM users 
WHERE email = 'testuser@eclear.com';
