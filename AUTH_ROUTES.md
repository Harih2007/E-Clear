# E-Clear Authentication Routes

## 🔐 Complete Authentication Flow

### Main Entry Point
**URL:** http://localhost:3000/auth/login
- Shows two cards: "User Login" and "E-Centre Login"
- Links to both registration pages

---

## 👤 USER (Household) Routes

### User Registration
**URL:** http://localhost:3000/auth/register
**Fields Required:**
- Name
- Email
- Password
- Confirm Password

**Redirects to:** `/dashboard/user`

### User Login
**URL:** http://localhost:3000/auth/login-user
**Fields Required:**
- Email
- Password

**Redirects to:** `/dashboard/user`

---

## 🏭 E-CENTRE (Recycling Center) Routes

### E-Centre Registration
**URL:** http://localhost:3000/auth/register-ecentre
**Fields Required:**
- E-Centre Name
- Email
- Password
- Confirm Password
- Phone Number
- License Number
- Full Address

**Redirects to:** `/dashboard/recycler`

### E-Centre Login
**URL:** http://localhost:3000/auth/login-ecentre
**Fields Required:**
- Email
- Password

**Redirects to:** `/dashboard/recycler`

---

## 🔄 Navigation Between Pages

### From Main Login Page:
- Click "User Login" → `/auth/login-user`
- Click "E-Centre Login" → `/auth/login-ecentre`
- Click "Sign up as User" → `/auth/register`
- Click "E-Centre" → `/auth/register-ecentre`

### From User Login Page:
- "Login" link → `/auth/login-user`
- "Register as E-Centre" link → `/auth/register-ecentre`

### From User Registration Page:
- "Login" link → `/auth/login-user`
- "Register as E-Centre" link → `/auth/register-ecentre`

### From E-Centre Login Page:
- "Register here" link → `/auth/register-ecentre`
- "Login here" (user) link → `/auth/login-user`

### From E-Centre Registration Page:
- "Login here" link → `/auth/login-ecentre`
- "Register as User" link → `/auth/register`

---

## 🎯 Backend API Endpoints

### User Registration
**POST** `/api/auth/register`
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

### E-Centre Registration
**POST** `/api/auth/register/ecentre`
```json
{
  "name": "Green Tech Recyclers",
  "email": "centre@example.com",
  "password": "password123",
  "phoneNumber": "+91-9876543210",
  "address": "123 Industrial Area, Bangalore",
  "licenseNumber": "ECO-BLR-2024-001",
  "coordinates": { "lat": 0, "lng": 0 },
  "serviceAreas": []
}
```

### Universal Login
**POST** `/api/auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "USER" // or "ECENTRE"
}
```

---

## ✅ What's Fixed

1. ✅ **Separate Registration Pages**
   - User registration: `/auth/register`
   - E-Centre registration: `/auth/register-ecentre`

2. ✅ **Correct Redirects**
   - Users → `/dashboard/user`
   - E-Centres → `/dashboard/recycler`

3. ✅ **Cross-Links**
   - All pages link to each other appropriately
   - Easy navigation between user and e-centre flows

4. ✅ **Role-Based Routing**
   - Backend validates role on login
   - Frontend redirects based on user type

---

## 🧪 Testing

### Test User Registration:
1. Go to http://localhost:3000/auth/register
2. Fill form and submit
3. Should redirect to `/dashboard/user`

### Test E-Centre Registration:
1. Go to http://localhost:3000/auth/register-ecentre
2. Fill all fields and submit
3. Should redirect to `/dashboard/recycler`

### Test Login:
1. Go to http://localhost:3000/auth/login
2. Choose user type
3. Login with credentials
4. Should redirect to appropriate dashboard
