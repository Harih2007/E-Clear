# Verify Supabase Keys

## Your Current Configuration

Your `backend/.env` file has:
```
SUPABASE_URL=https://ofrugpnrfrgnlwdifamr.supabase.co
SUPABASE_ANON_KEY=sb_publishable_AvPiWRnWT6BCnmXpRMSNdA_KYe4yFaa
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=PYfbRPI2m0xDLgETZOW4VfSj6QKUJNcqZiBxP5ClY+s/qMEDzGHS1l1xZYLHSsciRp67EvuwNmIypDmGemaKZg==
```

## ⚠️ Issue Detected

Your `SUPABASE_ANON_KEY` looks incomplete. It should be a long JWT token, not just `sb_publishable_...`

## How to Get the Correct Keys

### Step 1: Go to Supabase Project Settings

1. Open: https://supabase.com/dashboard/project/ofrugpnrfrgnlwdifamr
2. Click **"Settings"** (gear icon in left sidebar)
3. Click **"API"** under Project Settings

### Step 2: Copy the Correct Keys

You'll see these keys:

**Project URL:**
```
https://ofrugpnrfrgnlwdifamr.supabase.co
```

**anon/public key:** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
```
This is a LONG token (200+ characters)
```

**service_role key:** (also starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
```
This is also a LONG token (200+ characters)
```

### Step 3: Update Your .env File

Replace the values in `backend/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration (REQUIRED)
SUPABASE_URL=https://ofrugpnrfrgnlwdifamr.supabase.co
SUPABASE_ANON_KEY=<paste the anon/public key here>
SUPABASE_SERVICE_ROLE_KEY=<paste the service_role key here>

# JWT Configuration (REQUIRED)
JWT_SECRET=PYfbRPI2m0xDLgETZOW4VfSj6QKUJNcqZiBxP5ClY+s/qMEDzGHS1l1xZYLHSsciRp67EvuwNmIypDmGemaKZg==

# CORS Configuration
CORS_ORIGIN=http://localhost:4000,http://localhost:3000
```

## What Each Key Does

- **SUPABASE_URL**: Your Supabase project URL
- **SUPABASE_ANON_KEY**: Public key for client-side access (safe to expose)
- **SUPABASE_SERVICE_ROLE_KEY**: Admin key for backend (NEVER expose publicly)
- **JWT_SECRET**: Used to sign authentication tokens
- **CORS_ORIGIN**: Allowed frontend URLs

## After Updating Keys

1. Save the `.env` file
2. Restart the backend (it will auto-restart with nodemon)
3. Check backend logs for "✅ Supabase Connected Successfully"

## Still Need to Create Test Accounts

Even with correct keys, you still need to create the test user account in Supabase SQL Editor.

Run this in Supabase SQL Editor:

```sql
INSERT INTO users (
    id, name, email, password, role, points, phone_number,
    location_address, location_pincode, location_lat, location_lng
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
```

Then try logging in again!
