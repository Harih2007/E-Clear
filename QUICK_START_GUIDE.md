# E-Clear Quick Start Guide

## ✅ System Status

Your E-Clear application is currently running:

- **Frontend (Next.js)**: http://localhost:4000 ✅
- **Backend (Express)**: http://localhost:5000 ✅

## 🎯 What's Been Added

### 1. Test Accounts Created
Three test accounts are ready to use (see TEST_ACCOUNTS.md for details):
- 1 User account
- 2 E-Centre accounts

### 2. Pickup Person Details Feature
Users can now see who's coming for pickup with name and phone number.

### 3. Bidirectional Contact Information
- Users see E-Centre details when pickup is scheduled
- E-Centres see user details for all requests

## 🚀 Getting Started

### Step 1: Set Up Test Accounts in Supabase

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file `backend/test-accounts.sql`
4. Copy all the SQL code
5. Paste it into the Supabase SQL Editor
6. Click **Run** to create the test accounts

### Step 2: Test as a User

1. Open http://localhost:4000/auth/login-user
2. Log in with:
   - **Email**: `testuser@eclear.com`
   - **Password**: `TestUser123!`
3. Click **"Request Pickup"**
4. Select an item type (e.g., Laptop)
5. Enter quantity
6. Submit the request
7. You should see your request in "PENDING" or "GROUPING" status

### Step 3: Test as an E-Centre

1. Open a new incognito/private window or log out
2. Go to http://localhost:4000/auth/login-ecentre
3. Log in with:
   - **Email**: `greenrecycle@eclear.com`
   - **Password**: `EcentreTest123!`
4. You should see the user's request in the dashboard
5. Notice the **User column** showing:
   - User name: "Test User"
   - Phone number: "+91-9876543210" (clickable)
6. Click **"Schedule"** button on the request
7. Request status changes to "SCHEDULED"

### Step 4: View Pickup Person Details

1. Go back to the user account (or log in again)
2. View the dashboard at http://localhost:4000/dashboard/user
3. You should now see **"Pickup Person Details"** section showing:
   - Name: "Green Recycle Centre"
   - Phone: "+91-9876543211" (clickable)

### Step 5: Complete the Pickup

1. Log back in as E-Centre
2. Click **"Mark Collected"** on the scheduled request
3. The user receives incentive points
4. Request status changes to "COLLECTED"
5. User can still see pickup person details

## 📱 Features to Test

### User Dashboard Features
- ✅ Request pickup for e-waste items
- ✅ View pickup status (PENDING, GROUPING, SCHEDULED, COLLECTED)
- ✅ See grouping progress (X/5 households)
- ✅ View pickup person name and phone when scheduled
- ✅ Track eco-points earned
- ✅ View nearby E-Centres on map
- ✅ Set location using Google Autocomplete

### E-Centre Dashboard Features
- ✅ View all assigned pickup requests
- ✅ See user details (name and phone) for each request
- ✅ Schedule pickups
- ✅ Mark pickups as collected
- ✅ View statistics (pending, completed, total items)
- ✅ Track completed pickups count

## 🔧 Troubleshooting

### Issue: 401 Unauthorized Error
**Solution**: Make sure you're logged in with the correct account type:
- User routes require user login
- E-Centre routes require E-Centre login

### Issue: No requests showing in E-Centre dashboard
**Solution**: 
1. Make sure you created a pickup request as a user first
2. Check that the user's pincode (560001) is in the E-Centre's service areas
3. The test accounts are pre-configured to work together

### Issue: Supabase connection failed
**Solution**: 
1. Check your `backend/.env` file has correct Supabase credentials
2. Make sure your Supabase project is active
3. The server will still start and work if Supabase is configured correctly

### Issue: Can't see pickup person details
**Solution**: 
1. Make sure the request status is "SCHEDULED" or "COLLECTED"
2. The E-Centre must have scheduled the pickup first
3. Refresh the page to see updated data

## 📚 Documentation Files

- **TEST_ACCOUNTS.md** - Complete test account credentials and setup
- **PICKUP_PERSON_FEATURE.md** - Detailed feature documentation
- **backend/test-accounts.sql** - SQL script to create test accounts

## 🎨 UI Highlights

### User Dashboard
- Clean, modern design with emerald green theme
- Interactive map showing nearby E-Centres
- Real-time status updates
- Clickable phone numbers for easy contact
- Grouping progress visualization

### E-Centre Dashboard
- Professional recycler interface
- Tabular view of all requests
- User contact information readily available
- Quick action buttons (Schedule, Mark Collected)
- Statistics dashboard

## 🔐 Security Notes

- All passwords are hashed using bcrypt (12 salt rounds)
- JWT tokens expire after 7 days
- Role-based access control (USER, ECENTRE, ADMIN)
- E-Centres can only see requests assigned to them
- Users can only see their own requests

## 📞 Contact Information Format

All phone numbers use Indian format: `+91-XXXXXXXXXX`

Test account phone numbers:
- User: +91-9876543210
- E-Centre 1: +91-9876543211
- E-Centre 2: +91-9876543212

## 🎯 Next Steps

1. ✅ Run the SQL script to create test accounts
2. ✅ Test the complete workflow (user → e-centre → user)
3. ✅ Verify pickup person details are displayed correctly
4. ✅ Test phone number click-to-call functionality
5. ✅ Explore the map and location features

## 💡 Tips

- Use Chrome DevTools to test responsive design
- Test in incognito mode to easily switch between accounts
- Check browser console for any errors
- The backend logs all API requests for debugging

---

**Need Help?** Check the documentation files or review the code comments for more details.
