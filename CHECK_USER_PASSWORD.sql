-- Check if the user exists and see the password hash
SELECT 
    email, 
    name, 
    role,
    LEFT(password, 20) as password_preview,
    LENGTH(password) as password_length
FROM users 
WHERE email = 'testuser@eclear.com';

-- The password should be:
-- $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSKJxqaa
-- Length should be 60 characters

-- If the password is different, update it with this:
UPDATE users 
SET password = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSKJxqaa'
WHERE email = 'testuser@eclear.com';

-- Verify the update
SELECT email, name, role FROM users WHERE email = 'testuser@eclear.com';
