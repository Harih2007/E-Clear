# Pickup Person Details Feature

## Overview

This feature allows users to see the name and mobile number of the E-Centre (pickup person) who will be coming to collect their e-waste when a pickup is scheduled or completed.

## What's New

### For Users (User Dashboard)

When a pickup request is **SCHEDULED** or **COLLECTED**, users will now see:

- **Pickup Person Name**: The name of the E-Centre handling the pickup
- **Phone Number**: A clickable phone number to contact the E-Centre directly

**Visual Display:**
- Shows below the request details in a bordered section
- Includes icons for person and phone
- Phone number is clickable (tel: link) for easy calling

### For E-Centres (Recycler Dashboard)

E-Centres can now see user details for each pickup request:

- **User Name**: The name of the person who requested the pickup
- **Phone Number**: A clickable phone number to contact the user

**Visual Display:**
- Shows in a new "User" column in the requests table
- Includes user icon and phone icon
- Phone number is clickable for easy calling

## Technical Implementation

### Backend Changes

1. **Updated `getUserRequests` in `disposal.controller.ts`**
   - Fetches E-Centre details (name, phone) when status is SCHEDULED or COLLECTED
   - Returns `pickupPerson` object with name and phoneNumber

2. **Updated `getAllRequests` in `disposal.controller.ts`**
   - Fetches user details (name, phone) for each request
   - Returns `userDetails` object with name and phoneNumber

3. **Added `updateDisposalStatus` endpoint**
   - New PATCH endpoint: `/api/disposal/:id/status`
   - Allows E-Centres to update request status
   - Automatically awards points when marking as COLLECTED
   - Increments E-Centre's completed pickups counter

4. **Added route in `api.ts`**
   - `PATCH /disposal/:id/status` - Update disposal request status (E-Centre only)

### Frontend Changes

1. **User Dashboard (`app/dashboard/user/page.tsx`)**
   - Added `Phone` and `User` icons from lucide-react
   - Updated request card to show pickup person details
   - Displays name and phone number in a styled section
   - Phone number is a clickable link

2. **Recycler Dashboard (`app/dashboard/recycler/page.tsx`)**
   - Added `User` icon from lucide-react
   - Added "User" column to requests table
   - Displays user name and phone number for each request
   - Phone number is a clickable link
   - Improved error handling for 401 errors

## API Endpoints

### Get User Requests (with Pickup Person Details)
```
GET /api/disposal/my-requests
Authorization: Bearer <user_token>

Response:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "status": "SCHEDULED",
      "items": [...],
      "pickupPerson": {
        "name": "Green Recycle Centre",
        "phoneNumber": "+91-9876543211"
      },
      ...
    }
  ]
}
```

### Get All Requests (with User Details)
```
GET /api/disposal/requests
Authorization: Bearer <ecentre_token>

Response:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "status": "PENDING",
      "items": [...],
      "userDetails": {
        "name": "Test User",
        "phoneNumber": "+91-9876543210"
      },
      ...
    }
  ]
}
```

### Update Disposal Status
```
PATCH /api/disposal/:id/status
Authorization: Bearer <ecentre_token>
Content-Type: application/json

Body:
{
  "status": "SCHEDULED" | "COLLECTED"
}

Response:
{
  "success": true,
  "message": "Status updated to SCHEDULED"
}
```

## Testing the Feature

### Step 1: Set Up Test Accounts
1. Run the SQL script in `backend/test-accounts.sql` in your Supabase SQL Editor
2. This creates:
   - 1 test user account
   - 2 test E-Centre accounts

### Step 2: Create a Pickup Request
1. Log in as user: `testuser@eclear.com` / `TestUser123!`
2. Click "Request Pickup"
3. Select item type and quantity
4. Submit the request
5. Request will be in "PENDING" or "GROUPING" status

### Step 3: Schedule the Pickup
1. Log out and log in as E-Centre: `greenrecycle@eclear.com` / `EcentreTest123!`
2. You should see the pending request with user details (name and phone)
3. Click "Schedule" button
4. Request status changes to "SCHEDULED"

### Step 4: View Pickup Person Details
1. Log out and log back in as user: `testuser@eclear.com`
2. View your dashboard
3. You should now see:
   - Request status: SCHEDULED
   - Pickup Person Details section showing:
     - Name: Green Recycle Centre
     - Phone: +91-9876543211 (clickable)

### Step 5: Mark as Collected
1. Log in as E-Centre again
2. Click "Mark Collected" on the scheduled request
3. User receives incentive points
4. Request status changes to "COLLECTED"
5. User can still see pickup person details

## UI Screenshots Description

### User Dashboard - Pickup Person Details
```
┌─────────────────────────────────────────────────┐
│ LAPTOP                          [SCHEDULED]     │
│ Qty: 1 • ID: ABC123                            │
│ 2/5 households grouped                          │
│                                                 │
│ ─────────────────────────────────────────────  │
│ PICKUP PERSON DETAILS                           │
│ [👤] Green Recycle Centre  [📞] +91-9876543211 │
└─────────────────────────────────────────────────┘
```

### Recycler Dashboard - User Details
```
┌──────────────────────────────────────────────────────────┐
│ Request ID │ User              │ Items  │ Status         │
├──────────────────────────────────────────────────────────┤
│ #ABC123    │ [👤] Test User    │ LAPTOP │ [SCHEDULED]   │
│            │ [📞] +91-9876...  │ Qty: 1 │               │
└──────────────────────────────────────────────────────────┘
```

## Benefits

1. **Transparency**: Users know exactly who is coming for pickup
2. **Communication**: Direct phone contact between users and E-Centres
3. **Trust**: Builds confidence in the pickup process
4. **Coordination**: Easy to coordinate pickup times and details
5. **Safety**: Users can verify the pickup person before handing over items

## Future Enhancements

- Add profile photos for users and E-Centres
- Add estimated pickup time/date display
- Add real-time tracking of pickup person location
- Add in-app messaging between users and E-Centres
- Add rating system after pickup completion
