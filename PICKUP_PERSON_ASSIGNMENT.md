# Pickup Person Assignment Feature

## ✅ Features Implemented

### 1. Grouping Requirement for Scheduling
- **Cannot schedule individual requests**
- Must wait until grouping target is met (e.g., 5/5 households)
- Shows alert if trying to schedule before target is reached
- Message: "⚠️ Cannot schedule yet! Waiting for more households to join. Current: X/Y"

### 2. Pickup Person Selection
- E-Centre can choose specific person to handle pickup
- Modal shows list of available pickup persons
- Each person has:
  - Name
  - Phone number
  - Vehicle type (Bike/Car)
- Visual selection with highlighted card

### 3. Pickup Persons Database
- 4 sample pickup persons added:
  - **Ramesh Kumar** - +91-9876543301 (Two Wheeler)
  - **Rahul Sharma** - +91-9876543302 (Small Vehicle)
  - **Suresh Patel** - +91-9876543303 (Two Wheeler)
  - **Vijay Singh** - +91-9876543304 (Small Vehicle)

## 🗄️ Database Changes

### SQL to Run in Supabase:

```sql
-- Add pickup_persons column to ecentres table
ALTER TABLE ecentres 
ADD COLUMN IF NOT EXISTS pickup_persons JSONB DEFAULT '[]';

-- Add assigned_pickup_person column to disposal_requests table
ALTER TABLE disposal_requests
ADD COLUMN IF NOT EXISTS assigned_pickup_person JSONB DEFAULT NULL;

-- Add sample pickup persons to test E-Centre
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
```

## 🎯 User Flow

### E-Centre Scheduling Flow:
1. E-Centre logs in
2. Views pickup requests table
3. Sees requests with grouping status (e.g., "3/5")
4. Tries to click "Schedule" button
5. **If grouping not complete**: Shows alert, cannot proceed
6. **If grouping complete**: Opens pickup person selection modal
7. Selects a pickup person (Ramesh, Rahul, etc.)
8. Clicks "Confirm Schedule"
9. Request is scheduled with assigned person

### User View:
1. User sees request status change to "SCHEDULED"
2. "Pickup Person Details" section appears
3. Shows assigned person's name and phone
4. Example: "Ramesh Kumar - +91-9876543301"
5. Phone number is clickable for easy calling

## 📱 UI Components

### Pickup Person Selection Modal:
```
┌─────────────────────────────────────┐
│  Select Pickup Person               │
├─────────────────────────────────────┤
│  Choose who will handle this pickup:│
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 👤 Ramesh Kumar        🏍️ Bike│   │
│  │    +91-9876543301           │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 👤 Rahul Sharma        🚗 Car │   │
│  │    +91-9876543302           │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Confirm Schedule]                 │
└─────────────────────────────────────┘
```

### Request Card (User Side):
```
┌─────────────────────────────────────┐
│  💻 LAPTOP              [SCHEDULED] │
│  Qty: 1 • ID: ABC123                │
│  ─────────────────────────────────  │
│  PICKUP PERSON DETAILS              │
│  👤 Ramesh Kumar  📞 +91-9876543301 │
└─────────────────────────────────────┘
```

## 🔧 Technical Implementation

### Frontend (Recycler Dashboard):
- Added state for pickup persons list
- Added state for schedule modal
- Added state for selected person
- Grouping validation before opening modal
- Pickup person selection UI
- Sends assigned person data to backend

### Backend (Disposal Controller):
- Updated `updateDisposalStatus` to accept `assignedPickupPerson`
- Stores assigned person in `assigned_pickup_person` column
- Updated `getUserRequests` to return assigned person
- Falls back to E-Centre details if no person assigned

### Data Structure:
```json
{
  "id": "person-1",
  "name": "Ramesh Kumar",
  "phone": "+91-9876543301",
  "vehicle": "TWO_WHEELER"
}
```

## ✅ Validation Rules

### Scheduling Validation:
1. ✅ Request must be in "PENDING" or "GROUPING" status
2. ✅ Grouping target must be met (current >= target)
3. ✅ Pickup person must be selected
4. ✅ E-Centre must own the request

### Grouping Examples:
- ❌ 1/5 - Cannot schedule (need 4 more)
- ❌ 3/5 - Cannot schedule (need 2 more)
- ✅ 5/5 - Can schedule (target met)
- ✅ 7/5 - Can schedule (exceeded target)

## 🧪 Testing Instructions

### 1. Run SQL Script:
- Open Supabase SQL Editor
- Copy and run `update-schema-for-pickup-persons.sql`
- Verify pickup persons are added

### 2. Test Grouping Validation:
- Log in as E-Centre
- Try to schedule a request with 1/5 grouping
- Should see alert: "Cannot schedule yet!"

### 3. Test Pickup Person Selection:
- Wait for grouping to complete (5/5)
- Click "Schedule" button
- Should see modal with 4 pickup persons
- Select "Ramesh Kumar"
- Click "Confirm Schedule"
- Should schedule successfully

### 4. Test User View:
- Log in as user
- View scheduled request
- Should see "Ramesh Kumar" and phone number
- Phone number should be clickable

## 📊 Benefits

1. **Better Resource Management**: Assign specific persons to pickups
2. **Accountability**: Know who handled each pickup
3. **Efficiency**: Match vehicle type to pickup size
4. **User Trust**: Users know exactly who is coming
5. **Prevents Premature Scheduling**: Ensures grouping is complete

## 🚀 Future Enhancements

- [ ] Track pickup person availability
- [ ] Show pickup person's current location
- [ ] Allow users to rate pickup persons
- [ ] Automatic assignment based on proximity
- [ ] Pickup person mobile app
- [ ] Real-time status updates

## 📝 Notes

- Pickup persons are stored at E-Centre level
- Each E-Centre can have different pickup persons
- Assigned person info is stored with the request
- Users see the assigned person, not the E-Centre
- Phone numbers are fake for testing purposes
