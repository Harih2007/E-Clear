# E-Clear Pooling System Implementation

## ✅ Completed: Database Schema Updates

### New Schema: PickupPool
```typescript
{
  eCentreId: ObjectId,
  area: string (pincode),
  requestIds: [ObjectId],
  maxCapacity: number (default: 5),
  currentCount: number,
  status: "OPEN" | "ACCEPTED" | "SCHEDULED" | "COLLECTED",
  itemsSummary: [{ type: string, quantity: number }],
  createdAt: Date,
  updatedAt: Date
}
```

### Updated: DisposalRequest
Added fields:
- `eCentreId`: Assigned E-Centre
- `poolId`: Assigned Pool
- `status`: Added "ACCEPTED" state

## 🔄 Core Flow Implementation

### 1. User Requests Pickup

**Endpoint**: `POST /api/disposal/request`

**Logic**:
1. Validate user input (items, address, pincode)
2. Calculate estimated incentive
3. Find nearest E-Centre based on:
   - Service areas (pincode match)
   - Distance (if coordinates available)
   - Capacity
4. Check for existing OPEN pool in same area
5. If pool exists and not full:
   - Add request to pool
   - Update pool count
   - Set status to "GROUPING"
6. If no pool or pool full:
   - Create new pool
   - Add request as first item
   - Set status to "PENDING"
7. Update grouping progress (e.g., 2/5, 3/5)
8. Return success with pool status

**Response**:
```json
{
  "success": true,
  "message": "Request sent to nearest E-Centre",
  "data": {
    "requestId": "...",
    "eCentreName": "Green Tech Recyclers",
    "poolStatus": {
      "current": 2,
      "target": 5
    },
    "status": "GROUPING"
  }
}
```

### 2. E-Centre Views Pools

**Endpoint**: `GET /api/pools/my-pools`

**Logic**:
1. Authenticate E-Centre
2. Fetch all pools assigned to this E-Centre
3. Populate request details (count, items)
4. Group by status (OPEN, ACCEPTED, SCHEDULED)
5. Return pools with summary

**Response**:
```json
{
  "success": true,
  "data": {
    "openPools": [
      {
        "poolId": "...",
        "area": "560034",
        "currentCount": 3,
        "maxCapacity": 5,
        "itemsSummary": [
          { "type": "LAPTOP", "quantity": 2 },
          { "type": "PHONE", "quantity": 4 }
        ],
        "status": "OPEN"
      }
    ],
    "acceptedPools": [...],
    "scheduledPools": [...]
  }
}
```

### 3. E-Centre Accepts Pool

**Endpoint**: `POST /api/pools/:poolId/accept`

**Logic**:
1. Authenticate E-Centre
2. Verify pool belongs to this E-Centre
3. Verify pool status is "OPEN"
4. Update pool status to "ACCEPTED"
5. Update all requests in pool to "ACCEPTED"
6. Lock pool (no new requests can join)
7. Return success

**Response**:
```json
{
  "success": true,
  "message": "Pool accepted successfully",
  "data": {
    "poolId": "...",
    "requestCount": 5,
    "status": "ACCEPTED"
  }
}
```

### 4. E-Centre Schedules Dispatch

**Endpoint**: `POST /api/pools/:poolId/schedule`

**Body**:
```json
{
  "scheduledDate": "2024-01-25",
  "timeWindow": {
    "start": "10:00 AM",
    "end": "12:00 PM"
  }
}
```

**Logic**:
1. Authenticate E-Centre
2. Verify pool status is "ACCEPTED"
3. Create Pickup document
4. Update pool status to "SCHEDULED"
5. Update all requests to "SCHEDULED"
6. Assign pickup ID to all requests
7. Return success

### 5. E-Centre Confirms Collection

**Endpoint**: `POST /api/pools/:poolId/complete`

**Logic**:
1. Authenticate E-Centre
2. Verify pool status is "SCHEDULED"
3. Update pool status to "COLLECTED"
4. Update all requests to "COLLECTED"
5. Calculate and award points to users
6. Increment E-Centre completed pickups
7. Return success

## 🔒 Security Rules

1. **E-Centre Assignment**: Only backend assigns E-Centre (not user choice)
2. **Pool Access**: E-Centres only see their own pools
3. **User Privacy**: Users cannot see other users in pool
4. **One Active Request**: User can only have one PENDING/GROUPING request
5. **Pool Locking**: Once ACCEPTED, no new requests can join

## 📊 Status Flow

### User Request Status:
```
PENDING → GROUPING → ACCEPTED → SCHEDULED → COLLECTED
```

### Pool Status:
```
OPEN → ACCEPTED → SCHEDULED → COLLECTED
```

## 🎨 Frontend UI Updates

### User Dashboard
- Show pool progress badge (2/5, 3/5, etc.)
- Status indicators:
  - PENDING: "Finding nearby users..."
  - GROUPING: "2/5 users joined"
  - ACCEPTED: "E-Centre accepted your request"
  - SCHEDULED: "Pickup scheduled for [date]"
  - COLLECTED: "Completed ✓"

### E-Centre Dashboard
- Pool cards showing:
  - Area (pincode)
  - Request count (3/5)
  - Items summary
  - Action buttons:
    - "Accept Pool" (for OPEN pools)
    - "Schedule Dispatch" (for ACCEPTED pools)
    - "Mark Collected" (for SCHEDULED pools)

## 🔄 Real-Time Updates

**Polling Strategy** (Simple & Reliable):
- User dashboard polls every 10 seconds
- E-Centre dashboard polls every 15 seconds
- Updates pool count and status automatically

**Alternative**: WebSocket for instant updates (future enhancement)

## 📡 API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/disposal/request` | USER | Create disposal request |
| GET | `/api/disposal/my-requests` | USER | Get user's requests |
| GET | `/api/pools/my-pools` | ECENTRE | Get E-Centre's pools |
| POST | `/api/pools/:id/accept` | ECENTRE | Accept a pool |
| POST | `/api/pools/:id/schedule` | ECENTRE | Schedule pickup |
| POST | `/api/pools/:id/complete` | ECENTRE | Mark as collected |
| GET | `/api/disposal/requests` | ECENTRE | Get all requests |

## 🧪 Testing Flow

1. **User A** requests pickup in area 560034
   - Creates pool #1 (1/5)
   - Status: PENDING

2. **User B** requests pickup in area 560034
   - Joins pool #1 (2/5)
   - Both users see "GROUPING" status

3. **User C, D, E** join
   - Pool reaches 5/5
   - All users see "GROUPING (5/5)"

4. **E-Centre** views pools
   - Sees pool #1 with 5 requests
   - Clicks "Accept Pool"
   - All users see "ACCEPTED"

5. **E-Centre** schedules dispatch
   - Sets date and time
   - All users see "SCHEDULED for Jan 25, 10 AM"

6. **E-Centre** completes pickup
   - Marks as collected
   - Users receive points
   - Status: "COLLECTED"

## ✅ Implementation Status

- [x] Database schemas updated
- [ ] Backend pooling logic
- [ ] API endpoints
- [ ] User dashboard UI updates
- [ ] E-Centre dashboard UI updates
- [ ] Polling mechanism
- [ ] Testing & validation
