# Map View Troubleshooting Guide

## ✅ Fixes Applied

1. **Added Leaflet CSS to global styles**
   - Imported `leaflet/dist/leaflet.css` in `app/globals.css`
   - Ensures CSS loads before map renders

2. **Added custom Leaflet styles**
   - Fixed z-index issues
   - Ensured proper marker positioning
   - Set container height to 100%

3. **Removed duplicate CSS import**
   - Removed from `components/ui/map.tsx`
   - Now only imported once globally

## 🔍 Common Issues & Solutions

### Issue 1: Map Container is Blank/White
**Symptoms:** Map area shows but no tiles load

**Solutions:**
1. Check browser console for errors
2. Verify internet connection (tiles load from OpenStreetMap)
3. Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue 2: Map Tiles Not Loading
**Symptoms:** Gray tiles or broken image icons

**Solutions:**
1. Check if OpenStreetMap is accessible: https://tile.openstreetmap.org/0/0/0.png
2. Try a different tile provider in `components/ui/map.tsx`:
   ```typescript
   url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
   ```

### Issue 3: Markers Not Showing
**Symptoms:** Map loads but no markers visible

**Solutions:**
1. Check if location data is valid:
   - Open browser console
   - Look for `userLocation` and `eCentres` data
2. Verify coordinates are numbers (not strings)
3. Check if coordinates are within valid range:
   - Latitude: -90 to 90
   - Longitude: -180 to 180

### Issue 4: Map Height is 0px
**Symptoms:** Map container collapses

**Solutions:**
1. Verify parent container has explicit height:
   ```html
   <div className="h-[400px]">
     <Map ... />
   </div>
   ```
2. Check CSS is loaded:
   - Open DevTools → Network tab
   - Look for `leaflet.css` file
   - Should return 200 status

### Issue 5: Map Doesn't Update on Location Change
**Symptoms:** Map stays at default location

**Solutions:**
1. Check if `userLocation` prop is being passed correctly
2. Verify location search is working:
   - Click "Set Location" button
   - Search for a location
   - Check browser console for API responses
3. Map remounts on location change (uses `key` prop)

## 🧪 Testing the Map

### Test 1: Default View
1. Login as user: test@example.com / test1234
2. Go to dashboard
3. Map should show Delhi, India by default
4. Should see OpenStreetMap tiles

### Test 2: Set Location
1. Click "Set Location" or "Change Location"
2. Search for "Koramangala" or "MG Road"
3. Select a location from dropdown
4. Map should update to show selected location
5. Blue marker should appear at your location
6. Green markers should appear for nearby E-Centres

### Test 3: Markers
1. After setting location, verify:
   - Blue marker = Your location
   - Green markers = E-Centres (4 fake ones generated)
2. Click on markers to see popup with info

## 🔧 Manual Verification

### Check 1: Leaflet CSS Loaded
```javascript
// Open browser console and run:
document.querySelector('link[href*="leaflet"]')
// Should return a <link> element
```

### Check 2: Map Container Height
```javascript
// Open browser console and run:
document.querySelector('.leaflet-container')?.offsetHeight
// Should return 400 (or whatever height is set)
```

### Check 3: Location Data
```javascript
// In user dashboard, check React DevTools:
// Look for userLocation state
// Should have { lat: number, lng: number }
```

## 📝 Current Configuration

**Map Component:** `components/ui/map.tsx`
- Uses react-leaflet v5.0.0
- Uses leaflet v1.9.4
- Dynamically imported (SSR disabled)
- Remounts on location change

**Tile Provider:** OpenStreetMap
- URL: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
- Free, no API key required
- Rate limit: ~1000 requests/day per IP

**Default Location:** Delhi, India
- Lat: 28.6139
- Lng: 77.2090
- Zoom: 13

**Map Features:**
- User location marker (blue)
- E-Centre markers (green)
- Popups on marker click
- Scroll wheel zoom disabled
- Auto-center on location change

## 🚨 If Map Still Not Working

1. **Check browser console** for errors
2. **Verify packages installed:**
   ```bash
   npm list leaflet react-leaflet
   ```
3. **Restart development server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```
4. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```
5. **Check if port 3000 is accessible:**
   - Open http://localhost:3000
   - Should see E-Clear homepage

## 📞 Debug Information to Collect

If map still doesn't work, collect this info:

1. Browser console errors (screenshot)
2. Network tab showing failed requests
3. React DevTools showing component state
4. Browser and version
5. Operating system
6. Node.js version: `node --version`
7. npm version: `npm --version`

## ✅ Expected Behavior

When working correctly:
1. Map loads with OpenStreetMap tiles
2. Shows Delhi by default (no location set)
3. After setting location:
   - Map centers on selected location
   - Blue marker appears at user location
   - 4 green markers appear for E-Centres
   - Clicking markers shows popups
4. Map updates smoothly when location changes
5. No console errors
