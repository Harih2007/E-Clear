# E-Centre Map & Location Features ✅

## New Features Added

### 1. 🗺️ Pickup Locations Map
E-Centres can now view all pickup requests on an interactive map!

**Features:**
- Shows your E-Centre location (Green marker 🟢)
- Shows pending pickups (Orange markers 🟠)
- Shows scheduled pickups (Purple markers 🟣)
- Interactive markers with popup info
- Toggle map visibility with "Show Map" / "Hide Map" button
- Map legend to identify marker types

**How to Use:**
1. Login as E-Centre: `greenrecycle@eclear.com` / `EcentreTest123!`
2. Scroll to "Pickup Locations Map" section
3. Click "Show Map" button
4. See all pickup locations and your E-Centre on the map
5. Click markers to see details

### 2. 📍 Update E-Centre Location
E-Centres can now update their location!

**Features:**
- Manual address entry
- GPS-based location detection ("Use My Current Location")
- Automatic reverse geocoding (converts GPS to address)
- Shows coordinates confirmation
- Updates location in real-time

**How to Use:**
1. In E-Centre dashboard, find "Your E-Centre Information" card
2. Click "Update Location" button
3. Either:
   - **Option A:** Click "Use My Current Location" (GPS)
   - **Option B:** Type address manually and set coordinates
4. Click "Confirm Location Update"
5. Page refreshes with new location

## Map Marker Colors

| Color | Meaning |
|-------|---------|
| 🟢 Green | Your E-Centre location |
| 🟠 Orange | Pending/Grouping pickup requests |
| 🟣 Purple | Scheduled pickup requests |

## Benefits

### For E-Centres:
✅ **Visual Route Planning** - See all pickups on a map
✅ **Distance Estimation** - Understand pickup locations geographically
✅ **Efficient Routing** - Plan the best collection route
✅ **Location Accuracy** - Update your E-Centre location anytime
✅ **Better Service** - Users can find you more easily

### For Users:
✅ **Find Nearby E-Centres** - Accurate location data
✅ **Trust & Transparency** - See where E-Centre is located
✅ **Better Matching** - System assigns closest E-Centre

## Technical Details

### Map Component
- Uses Leaflet.js for interactive maps
- OpenStreetMap tiles (free, no API key needed)
- Supports multiple marker types
- Backward compatible with existing user map

### Location Update
- Uses browser Geolocation API
- Reverse geocoding via Nominatim (OpenStreetMap)
- Updates both address and coordinates
- Stored in Supabase database

### Data Flow
1. E-Centre location stored in `ecentres` table
2. Pickup locations from `disposal_requests` table
3. Map renders all locations with appropriate markers
4. Real-time updates when location changes

## Test Scenarios

### Scenario 1: View Map
1. Login as E-Centre
2. Click "Show Map"
3. Verify you see:
   - Green marker for E-Centre (Indiranagar, Bangalore)
   - Orange/Purple markers for pickup requests
   - Map legend at bottom

### Scenario 2: Update Location
1. Click "Update Location" in E-Centre info card
2. Click "Use My Current Location"
3. Browser asks for permission - Allow
4. Address auto-fills with your current location
5. Coordinates show below
6. Click "Confirm Location Update"
7. Page reloads with new location

### Scenario 3: Plan Route
1. View map with all pickups
2. Click "Schedule Route" button
3. See list of scheduled pickups with addresses
4. Use map + list together to plan efficient route

## Current E-Centre Location

**Test E-Centre (greenrecycle@eclear.com):**
- Address: Indiranagar, Bangalore, Karnataka 560038, India
- Coordinates: 12.9784°N, 77.6408°E
- Service Areas: 560001, 560002, 560038, 560025, 560008

## Future Enhancements

Possible additions:
- 🚗 Route optimization algorithm
- 📏 Distance calculations between pickups
- 🕐 Estimated time for route completion
- 🗺️ Turn-by-turn directions
- 📊 Heatmap of pickup density
- 🔍 Filter map by status/date
- 📱 Mobile-optimized map controls

## Troubleshooting

**Map not showing?**
- Check if "Show Map" button is clicked
- Verify E-Centre has location set
- Check browser console for errors

**Location not updating?**
- Ensure browser has location permission
- Check internet connection (for reverse geocoding)
- Verify backend is running (port 5000)

**Markers not appearing?**
- Verify pickup requests have coordinates
- Check if requests are in the database
- Ensure location was set when creating request

## API Endpoints Used

- `PATCH /auth/update-location` - Update E-Centre location
- `GET /disposal/requests` - Get all pickup requests with locations

## Files Modified

1. `app/dashboard/recycler/page.tsx` - Added map and location update
2. `components/ui/map.tsx` - Enhanced to support multiple marker types
3. Map now supports both old format (user dashboard) and new format (E-Centre dashboard)
