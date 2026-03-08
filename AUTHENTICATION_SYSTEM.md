# E-Clear Authentication System

## Overview
Robust, secure authentication system using MongoDB, bcrypt, and JWT for the E-Clear e-waste pickup platform.

## Technology Stack
- **Database**: MongoDB + Mongoose
- **Password Hashing**: bcrypt (12 salt rounds)
- **Session Management**: JWT (JSON Web Tokens)
- **Token Expiry**: 7 days

## User Roles
1. **USER** - Household users who request e-waste pickups
2. **ECENTRE** - Recycling centers that manage pickups

## Database Schema

### User Collection
```typescript
{
  _id: ObjectId,
  name: string (required, min 2 chars),
  email: string (required, unique, lowercase, validated),
  password: string (required, hashed, min 8 chars),
  role: "USER" | "ECENTRE" | "ADMIN" (default: "USER"),
  points: number (default: 0),
  location: {
    address: string,
    pincode: string,
    coordinates: { lat: number, lng: number }
  },
  phoneNumber: string,
  pickupHistory: ObjectId[],
  createdAt: Date,
  updatedAt: Date
}
```

### E-Centre Collection
```typescript
{
  _id: ObjectId,
  name: string (required),
  email: string (required, unique, lowercase, validated),
  password: string (required, hashed, min 8 chars),
  phoneNumber: string (required),
  location: {
    address: string (required),
    coordinates: { lat: number, lng: number } (required)
  },
  serviceAreas: string[] (pincodes),
  verified: boolean (default: false),
  licenseNumber: string (required),
  capacity: number (default: 100),
  completedPickups: number (default: 0),
  rating: number (default: 5.0),
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### 1. User Registration
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "phoneNumber": "1234567890",
  "address": "123 Main St",
  "pincode": "110001"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "points": 0,
    "location": {
      "address": "123 Main St",
      "pincode": "110001"
    }
  }
}
```

**Error Responses:**
- `400` - Validation error (email exists, invalid format, password too short)
- `503` - Database unavailable

### 2. E-Centre Registration
**POST** `/api/auth/register-ecentre`

**Request Body:**
```json
{
  "name": "Green Recyclers",
  "email": "contact@greenrecyclers.com",
  "password": "securepass123",
  "phoneNumber": "9876543210",
  "address": "456 Industrial Area",
  "coordinates": { "lat": 28.6139, "lng": 77.2090 },
  "licenseNumber": "LIC123456",
  "serviceAreas": ["110001", "110002"]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Green Recyclers",
    "email": "contact@greenrecyclers.com",
    "role": "ECENTRE",
    "verified": false,
    "location": {
      "address": "456 Industrial Area",
      "coordinates": { "lat": 28.6139, "lng": 77.2090 }
    }
  }
}
```

### 3. Login (Universal)
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepass123",
  "role": "USER"  // Optional: "USER" or "ECENTRE"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "points": 0,
    "location": { ... }
  }
}
```

**Error Responses:**
- `400` - Missing email/password, invalid email format
- `401` - Invalid credentials
- `403` - Invalid credentials for specified role
- `503` - Database unavailable

## Authentication Flow

### Sign-Up Flow
1. User submits registration form
2. Frontend validates:
   - Name length (≥ 2 characters)
   - Email format
   - Password length (≥ 8 characters)
   - Passwords match (if confirm password field)
3. Backend validates:
   - Required fields present
   - Email format valid
   - Email not already registered
   - Password length ≥ 8 characters
4. Backend hashes password (bcrypt, 12 rounds)
5. Backend creates user in MongoDB
6. Backend generates JWT token
7. Frontend stores token in localStorage
8. Frontend redirects based on role:
   - USER → `/dashboard/user`
   - ECENTRE → `/dashboard/recycler`

### Login Flow
1. User submits login form
2. Frontend validates:
   - Email format
   - Password not empty
3. Backend validates:
   - Email format
   - User exists in database
4. Backend compares password with bcrypt
5. Backend checks role match (if specified)
6. Backend generates JWT token
7. Frontend stores token in localStorage
8. Frontend redirects to appropriate dashboard

## Security Features

### Password Security
- Minimum 8 characters required
- Hashed using bcrypt with 12 salt rounds
- Never stored in plain text
- Never returned in API responses

### Email Security
- Validated with regex pattern
- Converted to lowercase
- Trimmed of whitespace
- Unique constraint enforced at database level

### Token Security
- JWT signed with secret key (from environment variable)
- Contains: user ID, role, email
- Expires after 7 days
- Stored in localStorage (frontend)
- Sent in Authorization header for protected routes

### Database Security
- MongoDB connection string in environment variable
- Unique indexes on email fields
- Schema validation for all fields
- Graceful error handling

## Error Handling

### Clear Error Messages
- "Email already exists"
- "Invalid credentials"
- "Password must be at least 8 characters long"
- "Please enter a valid email address"
- "Database connection unavailable. Please try again later."

### Error Response Format
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Frontend Integration

### Auth Context
Located in `lib/auth-context.tsx`:
- Manages authentication state
- Stores user data and token
- Provides login/logout functions
- Persists auth state in localStorage

### API Client
Located in `lib/api.ts`:
- Axios instance with base URL
- Automatically includes JWT token in headers
- Handles API errors consistently

### Protected Routes
- Check `isAuthenticated` before rendering
- Redirect to login if not authenticated
- Redirect based on user role

## Environment Variables

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/eclear
JWT_SECRET=supersecretkey_change_me_in_prod
```

## Database Indexes

### User Collection
- `email` (unique)
- `role`

### E-Centre Collection
- `email` (unique)
- `verified`

### Disposal Request Collection
- `userId`
- `status`
- `location.pincode`

### Pickup Collection
- `eCentreId`
- `status`
- `area.pincode`

## Testing

### Test User Account
```
Email: test@example.com
Password: test1234
Role: USER
```

### Manual Testing Steps
1. Start MongoDB: `mongod`
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `npm run dev`
4. Test registration at `/auth/register`
5. Test login at `/auth/login-user` or `/auth/login-ecentre`
6. Verify redirect to dashboard
7. Verify token in localStorage
8. Test logout functionality

## Performance Optimizations

1. **Database Indexes**: Fast queries on email, role, status
2. **Connection Pooling**: MongoDB connection reused
3. **Password Hashing**: Async operations don't block
4. **Token Validation**: Fast JWT verification
5. **Error Handling**: Early returns prevent unnecessary processing

## Production Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Use HTTPS for all API calls
- [ ] Enable MongoDB authentication
- [ ] Add rate limiting to auth endpoints
- [ ] Implement refresh tokens
- [ ] Add email verification
- [ ] Add password reset functionality
- [ ] Enable CORS with specific origins
- [ ] Add request logging
- [ ] Set up monitoring and alerts
- [ ] Use environment-specific configs
- [ ] Enable MongoDB replica set for high availability

## Common Issues & Solutions

### Issue: "Email already exists"
**Solution**: User already registered. Use login instead or try password reset.

### Issue: "Database connection unavailable"
**Solution**: 
1. Check if MongoDB is running: `mongod`
2. Verify MONGO_URI in .env file
3. Check network connectivity

### Issue: "Invalid credentials"
**Solution**: 
1. Verify email and password are correct
2. Check if user is registered
3. Ensure role matches (USER vs ECENTRE)

### Issue: Token expired
**Solution**: Login again to get new token (tokens expire after 7 days)

## Future Enhancements

1. **Email Verification**: Send verification email on registration
2. **Password Reset**: Forgot password functionality
3. **Refresh Tokens**: Long-lived sessions with refresh tokens
4. **OAuth Integration**: Google/Facebook login
5. **Two-Factor Authentication**: SMS or authenticator app
6. **Rate Limiting**: Prevent brute force attacks
7. **Account Lockout**: Lock account after failed attempts
8. **Password Strength Meter**: Visual feedback on password strength
9. **Session Management**: View and revoke active sessions
10. **Audit Logging**: Track all authentication events
