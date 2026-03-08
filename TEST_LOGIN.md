# E-Clear Test Login Credentials

## 🏠 USER Account (Household)
- **Email:** test@example.com
- **Password:** test1234
- **Login URL:** http://localhost:3000/auth/login-user
- **Register URL:** http://localhost:3000/auth/register
- **Dashboard:** http://localhost:3000/dashboard/user

## 🏭 E-CENTRE Account (Recycling Center)
- **Email:** ecentre@example.com
- **Password:** ecentre123
- **Login URL:** http://localhost:3000/auth/login-ecentre
- **Register URL:** http://localhost:3000/auth/register-ecentre
- **Dashboard:** http://localhost:3000/dashboard/recycler
- **Name:** Green Tech Recyclers
- **Location:** Koramangala, Bangalore
- **License:** ECO-BLR-2024-001

## 🔐 Authentication System

### Password Requirements
- Minimum 8 characters
- No special character requirements

### JWT Token
- Expires in 7 days
- Stored in localStorage

### Role-Based Access
- **USER**: Can request pickups, view history, track points
- **ECENTRE**: Can manage pickups, view collections, schedule routes

## 📝 Registration Flow

### User Registration
1. Go to http://localhost:3000/auth/register
2. Fill in: Name, Email, Password
3. Auto-redirects to User Dashboard

### E-Centre Registration
1. Go to http://localhost:3000/auth/register-ecentre
2. Fill in: Name, Email, Password, Phone, Address, License Number
3. Auto-redirects to E-Centre Dashboard (Recycler)

## 🚀 Backend Status
- Backend running on: http://localhost:5000
- Frontend running on: http://localhost:4000
- MongoDB: Connected

## 📍 Test Locations
- User location: Can be set via dashboard
- E-Centre location: Koramangala, Bangalore (12.9352, 77.6245)
- Service areas: 560034, 560001, 560038, 560066
