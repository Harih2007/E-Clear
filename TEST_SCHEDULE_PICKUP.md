# Test Schedule Pickup Feature

## What Was Fixed

1. **Database columns verified** - Both `assigned_pickup_person` and `pickup_persons` columns exist
2. **Vehicle types updated** - Changed from `TWO_WHEELER`/`SMALL_VEHICLE` to `BIKE`/`PICKUP_TRUCK` to match frontend
3. **Added detailed logging** - Both frontend and backend now log the schedule process
4. **Servers restarted** - Fresh start with all changes

## Test Steps

### 1. Login as E-Centre
- Go to: http://localhost:4000/auth/login-ecentre
- Email: `greenrecycle@eclear.com`
- Password: `EcentreTest123!`

### 2. View Requests
- You should see disposal requests in the table
- Look for requests with status `GROUPING` or `PENDING`

### 3. Schedule a Pickup
- Click the "Schedule" button on a request that has met its grouping target (e.g., 5/5)
- A modal should open showing 4 pickup persons:
  - 🏍️ Ramesh Kumar (+91-9876543301) - Bike
  - 🚚 Rahul Sharma (+91-9876543302) - Pickup Truck
  - 🏍️ Suresh Patel (+91-9876543303) - Bike
  - 🚚 Vijay Singh (+91-9876543304) - Pickup Truck

### 4. Select a Person
- Click on one of the pickup persons
- The card should highlight with green border
- Click "Confirm Schedule"

### 5. Check Browser Console
Open browser DevTools (F12) and check the Console tab for:
```
Scheduling pickup with: {requestId: "...", person: {...}, status: "SCHEDULED"}
Schedule response: {success: true, ...}
```

### 6. Check Backend Logs
Look at the backend terminal for:
```
=== UPDATE DISPOSAL STATUS ===
User: {...}
Request ID: ...
Body: {status: "SCHEDULED", assignedPickupPerson: {...}}
Adding assigned pickup person: {...}
Update data: {...}
Update successful!
```

### 7. Verify Success
- You should see an alert: "✅ Pickup scheduled with [Person Name]!"
- The request status should change to "SCHEDULED"
- The "Schedule" button should change to "Mark Collected"

## If It Still Doesn't Work

### Check These:

1. **Browser Console Errors**
   - Press F12 → Console tab
   - Look for red error messages
   - Share the error message

2. **Network Tab**
   - Press F12 → Network tab
   - Click Schedule → Select person → Confirm
   - Look for the PATCH request to `/disposal/[id]/status`
   - Check if it's 200 (success) or error (4xx/5xx)
   - Click on the request → Preview tab to see response

3. **Backend Terminal**
   - Look for the logging output
   - Check for any error messages

4. **Grouping Validation**
   - Make sure the request shows "5/5" or whatever the target is
   - If it shows "3/5", you cannot schedule yet (this is intentional)

## Test Accounts

**User Account:**
- Email: `testuser@eclear.com`
- Password: `TestUser123!`

**E-Centre Account:**
- Email: `greenrecycle@eclear.com`
- Password: `EcentreTest123!`

## Expected Behavior

✅ Can only schedule when grouping target is met (e.g., 5/5)
✅ Modal shows 4 pickup persons with names visible
✅ Can select a person (card highlights)
✅ Clicking "Confirm Schedule" updates status to SCHEDULED
✅ User can see pickup person details in their dashboard
✅ E-Centre sees "Mark Collected" button after scheduling

## Debugging Commands

If you need to check the database directly:

```bash
cd backend
node check-columns.js
```

This will show:
- If columns exist
- Current pickup persons in database
- Sample request data
