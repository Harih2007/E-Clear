# E-Centre Location Update - Fixed! ✅

## What Was Fixed

The location update feature was failing because:
1. Backend only accepted `lat` and `lng` parameters
2. Frontend was sending `address` and `coordinates` object
3. Backend only updated `users` table, not `ecentres` table

## Changes Made

### Backend (`auth.controller.ts`)
- Updated `updateLocation` function to accept both formats:
  - Old format: `{ lat, lng }` (for backward compatibility)
  - New format: `{ address, coordinates: { lat, lng } }`
- Added E-Centre support - now updates `ecentres` table when role is "ECENTRE"
- Added address field update for E-Centres
- Added logging for debugging
- Added `phoneNumber` to login response

## How to Test

### 1. Login as E-Centre
- Go to: http://localhost:4000/auth/login-ecentre
- Email: `greenrecycle@eclear.com`
- Password: `EcentreTest123!`

### 2. Update Location
- Find "Your E-Centre Information" card (green gradient)
- Click "Update Location" button
- Modal opens with current location pre-filled

### 3. Option A: Use GPS
- Click "Use My Current Location" button
- Browser asks for location permission - Click "Allow"
- Address auto-fills with your current location
- Coordinates show in green box below
- Click "Confirm Location Update"

### 4. Option B: Manual Entry
- Type a new address in the text field
- Click "Use My Current Location" to get coordinates
- Or manually set coordinates (not recommended)
- Click "Confirm Location Update"

### 5. Verify Update
- Page reloads automatically
- New address shows in E-Centre info card
- Map (if shown) centers on new location
- Green marker moves to new position

## Expected Behavior

✅ **Before Update:**
- Address: Indiranagar, Bangalore, Karnataka 560038, India
- Coordinates: 12.9784°N, 77.6408°E

✅ **After Update:**
- Address: Your new address
- Coordinates: Your new coordinates
- Map updates to show new location
- E-Centre info card shows new address

## API Request Format

The backend now accepts:

```json
{
  "address": "123 Main Street, City",
  "coordinates": {
    "lat": 13.142732,
    "lng": 80.243317
  }
}
```

Or the old format (backward compatible):

```json
{
  "lat": 13.142732,
  "lng": 80.243317
}
```

## Database Updates

When E-Centre updates location:
- `ecentres.location_address` = new address
- `ecentres.location_lat` = new latitude
- `ecentres.location_lng` = new longitude
- `ecentres.updated_at` = current timestamp

## Troubleshooting

**Still getting "lat and lng are required" error?**
- Check browser console for the actual request being sent
- Verify backend is running (port 5000)
- Check backend logs for the request details

**Location not updating?**
- Ensure you're logged in as E-Centre (not user)
- Check if coordinates are valid numbers
- Verify Supabase connection is active

**GPS not working?**
- Browser must have location permission
- HTTPS required for production (localhost is OK)
- Check browser console for geolocation errors

**Page not reloading?**
- Manual refresh: Press F5
- Check if update was successful (backend logs)
- Verify token is still valid

## Backend Logs

When updating location, you should see:
```
📍 Update location request: { address: '...', coordinates: { lat: ..., lng: ... } }
✅ E-Centre location updated
```

## Files Modified

1. `backend/src/controllers/auth.controller.ts`
   - Updated `updateLocation` function
   - Added E-Centre support
   - Added address field update
   - Added backward compatibility

## Test Coordinates

Some test locations in India:

**Bangalore:**
- Indiranagar: 12.9784, 77.6408
- Koramangala: 12.9352, 77.6245
- Whitefield: 12.9698, 77.7500

**Chennai:**
- T Nagar: 13.0418, 80.2341
- Anna Nagar: 13.0878, 80.2085

**Mumbai:**
- Andheri: 19.1136, 72.8697
- Bandra: 19.0596, 72.8295

## Next Steps

After successful location update:
1. View map to see new E-Centre position
2. Check if pickup requests are still assigned correctly
3. Verify service area coverage
4. Test user-side E-Centre discovery with new location
