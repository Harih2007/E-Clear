# Test Accounts for E-Clear

## How to Set Up Test Accounts

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `backend/test-accounts.sql`
4. Run the SQL script
5. Use the credentials below to log in

## Test User Account

**Purpose:** Regular user who requests e-waste pickups

- **Email:** `testuser@eclear.com`
- **Password:** `TestUser123!`
- **Role:** USER
- **Location:** MG Road, Bangalore (560001)
- **Phone:** +91-9876543210
- **Initial Points:** 100

**Login URL:** http://localhost:4000/auth/login-user

---

## Test E-Centre Account 1

**Purpose:** E-waste collection center that accepts and schedules pickups

- **Email:** `greenrecycle@eclear.com`
- **Password:** `EcentreTest123!`
- **Role:** ECENTRE
- **Name:** Green Recycle Centre
- **Location:** Indiranagar, Bangalore (560038)
- **Phone:** +91-9876543211
- **Service Areas:** 560001, 560002, 560038, 560025, 560008
- **License:** LIC-BLR-2024-001
- **Rating:** 4.8/5.0
- **Completed Pickups:** 45

**Login URL:** http://localhost:4000/auth/login-ecentre

---

## Test E-Centre Account 2

**Purpose:** Another e-waste collection center for testing multiple centers

- **Email:** `ecowarriors@eclear.com`
- **Password:** `EcentreTest123!`
- **Role:** ECENTRE
- **Name:** Eco Warriors Recycling Hub
- **Location:** Koramangala, Bangalore (560034)
- **Phone:** +91-9876543212
- **Service Areas:** 560001, 560034, 560095, 560068, 560047
- **License:** LIC-BLR-2024-002
- **Rating:** 4.9/5.0
- **Completed Pickups:** 78

**Login URL:** http://localhost:4000/auth/login-ecentre

---

## Testing Workflow

### 1. Create a Pickup Request (as User)
1. Log in as `testuser@eclear.com`
2. Click "Request Pickup"
3. Select item type and quantity
4. Submit request
5. Request will be assigned to nearest E-Centre

### 2. Accept and Schedule Pickup (as E-Centre)
1. Log in as `greenrecycle@eclear.com`
2. View pending requests in the dashboard
3. Click "Schedule" on a request
4. Request status changes to "SCHEDULED"
5. User will now see pickup person details

### 3. Mark as Collected (as E-Centre)
1. After pickup is completed
2. Click "Mark Collected"
3. User receives incentive points
4. Request status changes to "COLLECTED"

---

## Password Hash Information

All test accounts use the same password hash for simplicity:
- **Plaintext Password:** `TestUser123!` or `EcentreTest123!`
- **Bcrypt Hash:** `$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSKJxqaa`
- **Salt Rounds:** 12

---

## Notes

- Both E-Centres service the 560001 pincode where the test user is located
- This ensures pickup requests from the test user will be assigned to one of these E-Centres
- All accounts are pre-verified and active
- Phone numbers are Indian format (+91)
