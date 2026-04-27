-- Add columns for pickup person assignment
-- Run this in Supabase SQL Editor

-- 1. Add pickup_persons column to ecentres table
ALTER TABLE ecentres 
ADD COLUMN IF NOT EXISTS pickup_persons JSONB DEFAULT '[]';

-- 2. Add assigned_pickup_person column to disposal_requests table
ALTER TABLE disposal_requests
ADD COLUMN IF NOT EXISTS assigned_pickup_person JSONB DEFAULT NULL;

-- 3. Update pickup persons for test E-Centre with correct vehicle types
UPDATE ecentres 
SET pickup_persons = '[
    {
        "id": "person-1",
        "name": "Ramesh Kumar",
        "phone": "+91-9876543301",
        "vehicle": "BIKE",
        "active": true
    },
    {
        "id": "person-2",
        "name": "Rahul Sharma",
        "phone": "+91-9876543302",
        "vehicle": "PICKUP_TRUCK",
        "active": true
    },
    {
        "id": "person-3",
        "name": "Suresh Patel",
        "phone": "+91-9876543303",
        "vehicle": "BIKE",
        "active": true
    },
    {
        "id": "person-4",
        "name": "Vijay Singh",
        "phone": "+91-9876543304",
        "vehicle": "PICKUP_TRUCK",
        "active": true
    }
]'::jsonb
WHERE email = 'greenrecycle@eclear.com';

-- 4. Verify
SELECT name, pickup_persons FROM ecentres WHERE email = 'greenrecycle@eclear.com';
