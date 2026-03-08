# MongoDB Database Setup - E-Clear

## ✅ Current Status: FULLY CONFIGURED

Your MongoDB database is **already set up and working** with the E-Clear application!

## 📊 Database Information

**Connection Details:**
- **URI:** `mongodb://localhost:27017/eclear`
- **Database Name:** `eclear`
- **Status:** ✅ Connected and Active

## 📁 Collections

Your database has the following collections:

### 1. **users** Collection
- Stores household user accounts
- Fields: name, email, password (hashed), role, phoneNumber, location, points, pickupHistory
- Current count: 1 user

### 2. **ecentres** Collection  
- Stores recycling center accounts
- Fields: name, email, password (hashed), phoneNumber, location, licenseNumber, serviceAreas, verified, capacity, rating
- Current count: 1 e-centre

### 3. **disposalrequests** Collection
- Stores pickup requests from users
- Fields: userId, items, address, pincode, status, groupingProgress, estimatedIncentive
- Current count: 3 requests

### 4. **pickups** Collection
- Stores scheduled pickups
- Fields: eCentreId, requests, scheduledDate, route, status
- Current count: 0 pickups

## 🔐 Test Accounts in Database

### User Account
- **Email:** test@example.com
- **Password:** test1234
- **Role:** USER
- **Name:** Test User

### E-Centre Account
- **Email:** ecentre@example.com
- **Password:** ecentre123
- **Role:** ECENTRE
- **Name:** Green Tech Recyclers

## 🚀 How Signup Works

### User Registration Flow:
1. User visits: http://localhost:4000/auth/register
2. Fills form: name, email, password
3. Frontend sends POST to: `http://localhost:5000/api/auth/register`
4. Backend validates data and checks for duplicates
5. Password is hashed with bcrypt (12 salt rounds)
6. User document is created in `users` collection
7. JWT token is generated and returned
8. User is auto-logged in and redirected to dashboard

### E-Centre Registration Flow:
1. E-Centre visits: http://localhost:3000/auth/register
2. Selects "E-Centre" role
3. Fills additional fields: license number, service areas
4. Frontend sends POST to: `http://localhost:5000/api/auth/register/ecentre`
5. Backend validates and creates document in `ecentres` collection
6. JWT token is generated and returned

## 🛠️ Useful Commands

### Check Database Status
```bash
cd backend
node check-database.js
```

### Create Test E-Centre Account
```bash
cd backend
node create-ecentre.js
```

### View Backend Logs
Check the terminal where backend is running for MongoDB connection status

## 📝 Database Schema

### User Schema
```javascript
{
  name: String (required, min 2 chars),
  email: String (required, unique, indexed),
  password: String (required, min 8 chars, hashed),
  role: String (default: "USER"),
  phoneNumber: String (optional),
  location: {
    address: String,
    pincode: String,
    coordinates: { lat: Number, lng: Number }
  },
  points: Number (default: 0),
  pickupHistory: Array,
  createdAt: Date,
  updatedAt: Date
}
```

### E-Centre Schema
```javascript
{
  name: String (required),
  email: String (required, unique, indexed),
  password: String (required, min 8 chars, hashed),
  phoneNumber: String (required),
  location: {
    address: String (required),
    coordinates: { lat: Number, lng: Number }
  },
  licenseNumber: String (required),
  serviceAreas: [String],
  verified: Boolean (default: false),
  capacity: Number (default: 100),
  completedPickups: Number (default: 0),
  rating: Number (default: 5.0),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔍 Verification

To verify your database is working:

1. **Check Connection:**
   - Backend should show: "✅ MongoDB Connected Successfully"
   - Run: `node backend/check-database.js`

2. **Test Registration:**
   - Go to: http://localhost:3000/auth/register
   - Create a new account
   - Check if it appears in database: `node backend/check-database.js`

3. **Test Login:**
   - Use test@example.com / test1234
   - Should successfully login and redirect to dashboard

## ⚠️ Troubleshooting

### "Database connection unavailable"
- Ensure MongoDB service is running
- Check if port 27017 is available
- Verify MONGO_URI in backend/.env

### "Email already exists"
- This email is already registered
- Use a different email or login with existing account

### Can't see data in database
- Run: `node backend/check-database.js`
- Check backend terminal for connection errors
- Verify MongoDB is running on localhost:27017

## 🎯 Next Steps

Your database is fully configured! You can:

1. ✅ Register new users via the signup page
2. ✅ Login with existing test accounts
3. ✅ Create pickup requests (saved to database)
4. ✅ View user dashboard with data from database
5. ✅ Login as E-Centre to manage pickups

All data is automatically saved to your local MongoDB instance at `mongodb://localhost:27017/eclear`.
