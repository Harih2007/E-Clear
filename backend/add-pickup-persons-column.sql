-- Add pickup_persons column to ecentres table
-- Run this in Supabase SQL Editor if the column doesn't exist

ALTER TABLE ecentres 
ADD COLUMN IF NOT EXISTS pickup_persons JSONB DEFAULT '[]';

-- Add some sample pickup persons to the test E-Centre
UPDATE ecentres 
SET pickup_persons = '[
    {
        "id": "person-1",
        "name": "Ramesh Kumar",
        "phone": "+91-9876543301",
        "vehicle": "TWO_WHEELER",
        "active": true
    },
    {
        "id": "person-2",
        "name": "Rahul Sharma",
        "phone": "+91-9876543302",
        "vehicle": "SMALL_VEHICLE",
        "active": true
    },
    {
        "id": "person-3",
        "name": "Suresh Patel",
        "phone": "+91-9876543303",
        "vehicle": "TWO_WHEELER",
        "active": true
    },
    {
        "id": "person-4",
        "name": "Vijay Singh",
        "phone": "+91-9876543304",
        "vehicle": "SMALL_VEHICLE",
        "active": true
    }
]'::jsonb
WHERE email = 'greenrecycle@eclear.com';

-- Verify
SELECT name, pickup_persons FROM ecentres WHERE email = 'greenrecycle@eclear.com';
