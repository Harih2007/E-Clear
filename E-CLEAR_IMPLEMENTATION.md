# E-Clear - Complete Implementation Guide

## 🎯 Project Overview

E-Clear is a full-stack web application for household e-waste pickup that connects users with authorized E-Centres using shared micro-pickup logic and location intelligence.

## 🚀 Application Status

✅ **Backend**: Running on http://localhost:5000
✅ **Frontend**: Running on http://localhost:4000
✅ **Database**: In-memory mock database (MongoDB ready)

## 🔐 Authentication & Roles

### Two-User System Implemented:

1. **USER (Household)** - Submit pickup requests, track status, earn incentives
2. **ECENTRE (Recycling Center)** - Manage pickups, confirm collections, release incentives

### Security Features:
- JWT-based authentication with 7-day expiry
- Role-Based Access Control (RBAC)
- Password hashing with bcrypt
- Secure route protection
- Privacy-first data access

## 📡 API Endpoints

### Public Routes (No Auth Required)
```
POST /api/auth/register/user       - Register household user
POST /api/auth/register/ecentre    - Register E-Centre
POST /api/auth/login                - Universal login
```

### USER Routes (Household)
```
POST   /api/disposal/request           - Create pickup request
GET    /api/disposal/my-requests       - View my requests
GET    /api/disposal/grouping/:zipCode - Check grouping status
GET    /api/ecentres/nearby            - View nearby E-Centres
GET    /api/disposal/:id               - View specific request
```

### E-CENTRE Routes (Recycling Centers)
```
POST   /api/pickup/create                  - Create pickup from grouped requests
GET    /api/pickup/my-pickups              - View assigned pickups
GET    /api/pickup/:id/details             - Get full pickup details with addresses
PATCH  /api/pickup/:id/status              - Update pickup status
POST   /api/pickup/:id/confirm             - Confirm pickup & release incentives
GET    /api/pickup/clusters/available      - View available pickup clusters
PATCH  /api/disposal/:id/status            - Update request status
```

## 👤 USER Dashboard Features

### What Users CAN See:
✅ Secure signup and login
✅ Enter and manage pickup address
✅ Submit e-waste pickup requests (Phone, Laptop, Battery, Charger, Tablet, Monitor)
✅ View pickup status lifecycle:
   - PENDING → GROUPING → SCHEDULED → COLLECTED
✅ View grouping progress (e.g., "3/5 households in your area")
✅ View estimated incentive range (min-max)
✅ View scheduled pickup day/time window
✅ See past pickup history
✅ View nearby E-Centres on map (approximate distance only)

### What Users CANNOT See:
❌ Other users' addresses
❌ Internal E-Centre data
❌ Other users' incentives
❌ Pickup routes

## 🏭 E-CENTRE Dashboard Features

### What E-Centres CAN See:
✅ Secure login as verified recycling center
✅ View grouped pickup requests in service area
✅ See pickup clusters by area/zone
✅ View:
   - Number of households in each pickup
   - Item types summary
   - Scheduled pickup date
✅ Access full user addresses ONLY after pickup is scheduled
✅ Confirm pickup completion
✅ Confirm items collected
✅ Trigger incentive release after confirmation

### What E-Centres CANNOT See:
❌ Other centers' pickups
❌ User account details (except during active pickup)
❌ Unscheduled request addresses

## 🚚 Transportation Logic (Core Feature)

### Shared Micro-Pickup System:
- **Pickup-only service** (no drop-offs)
- Focus on small e-waste items
- Individual pickups are avoided
- When ≥5 users in same area submit requests:
  - System schedules shared micro-pickup
  - Uses two-wheeler or small vehicle
  - Example: 10 households in society → 1 pickup day per week

### Grouping Algorithm:
1. User submits request with zip code
2. System checks for pending requests in same zip code
3. Status updates:
   - 1 request: PENDING
   - 2-4 requests: GROUPING (shows progress 2/5, 3/5, 4/5)
   - 5+ requests: SCHEDULED (ready for pickup)
4. E-Centre can create pickup from grouped requests
5. Users see grouping progress in real-time

## 💰 Incentive System

### Estimated Incentive Ranges (per item):
- **Phone**: ₹50 - ₹200
- **Laptop**: ₹200 - ₹800
- **Tablet**: ₹100 - ₹400
- **Battery**: ₹5 - ₹20
- **Charger**: ₹10 - ₹30
- **Monitor**: ₹150 - ₹500
- **Other**: ₹20 - ₹100

### Incentive Flow:
1. User sees estimated range when submitting request
2. E-Centre confirms actual incentive after pickup
3. Points released to user account after E-Centre confirmation
4. Users can track total points earned

## 🗄️ Database Schema

### Collections:

#### Users
```typescript
{
  name: string
  email: string (unique)
  role: "USER" | "ECENTRE" | "ADMIN"
  points: number
  location: {
    address: string
    zipCode: string
    coordinates: { lat, lng }
  }
  password: string (hashed)
  phoneNumber: string
  pickupHistory: ObjectId[]
  createdAt: Date
}
```

#### ECentres
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  phoneNumber: string
  location: {
    address: string
    coordinates: { lat, lng }
  }
  serviceAreas: string[] // zip codes
  verified: boolean
  licenseNumber: string
  capacity: number
  completedPickups: number
  rating: number
  createdAt: Date
}
```

#### DisposalRequests
```typescript
{
  userId: ObjectId
  items: [{
    type: "PHONE" | "CHARGER" | "BATTERY" | "LAPTOP" | "TABLET" | "MONITOR" | "OTHER"
    quantity: number
    description: string
  }]
  location: {
    address: string
    zipCode: string
    coordinates: { lat, lng }
  }
  status: "PENDING" | "GROUPING" | "SCHEDULED" | "COLLECTED"
  estimatedIncentive: { min, max }
  actualIncentive: number
  scheduledPickupId: ObjectId
  groupingProgress: { current, target } // e.g., 3/5
  createdAt: Date
  updatedAt: Date
}
```

#### Pickups
```typescript
{
  eCentreId: ObjectId
  requestIds: ObjectId[]
  area: {
    zipCode: string
    coordinates: { lat, lng }
    radius: number // in km
  }
  status: "PENDING" | "SCHEDULED" | "IN_PROGRESS" | "COMPLETED"
  scheduledDate: Date
  scheduledTimeWindow: { start, end } // e.g., "10:00 AM - 12:00 PM"
  vehicleType: "TWO_WHEELER" | "SMALL_VEHICLE"
  itemsSummary: [{ type, quantity }]
  householdCount: number
  completedAt: Date
  createdAt: Date
}
```

## 🔒 Security Implementation

✅ **HTTPS Ready** (configure in production)
✅ **JWT Authentication** with 7-day expiry
✅ **Role-Based Access Control** (RBAC middleware)
✅ **Password Hashing** with bcrypt (10 salt rounds)
✅ **Privacy Protection**:
   - Full addresses hidden until pickup scheduled
   - Users can only see their own data
   - E-Centres can only see assigned pickups
✅ **Input Validation** on all endpoints
✅ **Rate Limiting Ready** (implement in production)
✅ **Incentives Released** only after E-Centre confirmation

## 🎨 Frontend Design

### Tech Stack:
- Next.js 16 (React 19)
- Tailwind CSS 4
- Framer Motion (animations)
- Lucide React (icons)

### Design System:
- **Primary Color**: #2DFF7A (Neon Eco-Green)
- **Background**: #0B0F0E (Deep Black)
- **Theme**: Dark-mode first, high contrast
- **Layout**: Visible grid system, card-based
- **Typography**: Inter/Space Grotesk

### Pages Implemented:
1. **Landing Page** (`/`) - Hero with shared pickup visualization
2. **Login** (`/auth/login`) - Universal login for both roles
3. **Register** (`/auth/register`) - User registration
4. **User Dashboard** (`/dashboard/user`) - Request management
5. **Schedule Pickup** (`/dashboard/schedule`) - 3-step wizard
6. **Recycler Dashboard** (`/dashboard/recycler`) - E-Centre view

## 🗺️ Maps Integration (Ready for Implementation)

### Planned Features:
- Google Maps or Mapbox API integration
- Geocoding for address to coordinates conversion
- Cluster nearby users for shared pickups
- Display nearest E-Centres based on distance
- Area-level clustering (not exact locations)

### Privacy Considerations:
- Show user location on map (own location only)
- Display E-Centres with approximate distance
- Do NOT show other users' locations
- Do NOT show pickup routes to users
- E-Centres see pickup clusters, not individual addresses initially

## 📦 Installation & Setup

### Prerequisites:
```bash
Node.js 18+
MongoDB (optional - using in-memory DB for now)
```

### Backend Setup:
```bash
cd backend
npm install
npm run dev  # or: npx ts-node src/server.ts
```

### Frontend Setup:
```bash
npm install
npm run dev
```

### Environment Variables (.env):
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/eclear
JWT_SECRET=your_secret_key_here
```

## 🧪 Testing

### Test Accounts:
```
User: test@example.com / test123
```

### API Testing with cURL:

#### Register User:
```bash
curl -X POST http://localhost:5000/api/auth/register/user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phoneNumber": "1234567890",
    "address": "123 Main St",
    "zipCode": "12345"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Create Disposal Request:
```bash
curl -X POST http://localhost:5000/api/disposal/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "items": [
      { "type": "LAPTOP", "quantity": 1 },
      { "type": "PHONE", "quantity": 2 }
    ],
    "address": "123 Main St, Mumbai",
    "zipCode": "12345"
  }'
```

## 🚀 Deployment Checklist

### Backend:
- [ ] Set up MongoDB Atlas or production database
- [ ] Configure environment variables
- [ ] Enable HTTPS
- [ ] Implement rate limiting
- [ ] Set up logging (Winston/Morgan)
- [ ] Configure CORS for production domain
- [ ] Set up error monitoring (Sentry)

### Frontend:
- [ ] Build for production (`npm run build`)
- [ ] Configure environment variables
- [ ] Set up CDN for static assets
- [ ] Enable analytics
- [ ] Configure SEO metadata
- [ ] Set up error boundaries

### Security:
- [ ] Enable HTTPS everywhere
- [ ] Implement rate limiting
- [ ] Set up API key rotation
- [ ] Configure CSP headers
- [ ] Enable security headers (Helmet.js)
- [ ] Set up backup strategy

## 📈 Future Enhancements

1. **Maps Integration**: Google Maps/Mapbox for real-time tracking
2. **Push Notifications**: Notify users of pickup status changes
3. **Payment Integration**: Redeem points for vouchers
4. **Admin Dashboard**: Manage E-Centres, verify licenses
5. **Analytics**: Track environmental impact metrics
6. **Mobile App**: React Native version
7. **AI/ML**: Optimize pickup routes
8. **Blockchain**: Transparent incentive tracking

## 🎯 Hackathon-Ready Features

✅ Complete authentication system
✅ Role-based access control
✅ Shared pickup grouping logic
✅ Privacy-first architecture
✅ Modern, responsive UI
✅ Real-time status updates
✅ Incentive calculation system
✅ Scalable database schema
✅ RESTful API design
✅ Security best practices
✅ Clean code structure
✅ Documentation

## 📞 Support

For issues or questions:
- Check API documentation above
- Review error messages in browser console
- Check backend logs in terminal
- Verify JWT token is included in requests

## 🏆 Key Differentiators

1. **Shared Micro-Pickup Logic** - Reduces costs & emissions
2. **Privacy-First Design** - Addresses hidden until scheduled
3. **Grouping Visualization** - Users see real-time progress
4. **Dual-Role System** - Separate dashboards for users & E-Centres
5. **Incentive Transparency** - Range shown upfront, actual after confirmation
6. **Scalable Architecture** - Ready for production deployment

---

**Built with ❤️ for sustainable e-waste management**
