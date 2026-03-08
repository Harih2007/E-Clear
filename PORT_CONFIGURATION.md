# Port Configuration

## Current Setup

### Frontend (Next.js)
- **Port**: 4000
- **URL**: http://localhost:4000
- **Start Command**: `npm run dev`

### Backend (Express + TypeScript)
- **Port**: 5000
- **URL**: http://localhost:5000
- **Start Command**: `cd backend && npm run dev`

### Database (MongoDB)
- **Port**: 27017 (default)
- **Connection**: mongodb://localhost:27017/eclear

## Configuration Files

### Frontend Port
- **File**: `package.json`
- **Script**: `"dev": "next dev -p 4000"`

### Backend Port
- **File**: `backend/.env`
- **Variable**: `PORT=5000`
- **Fallback**: `backend/src/server.ts` (line: `const PORT = process.env.PORT || 5000`)

### API Base URL
- **File**: `lib/api.ts`
- **URL**: `http://localhost:5000/api`

## Starting the Application

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   Output: `Server running on port 5000`

2. **Start Frontend** (Terminal 2):
   ```bash
   npm run dev
   ```
   Output: `Ready on http://localhost:4000`

3. **Access Application**:
   - Frontend: http://localhost:4000
   - Backend API: http://localhost:5000/api

## Testing the Setup

### Check Backend
```bash
curl http://localhost:5000/api/health
```

### Check Frontend
Open browser: http://localhost:4000

### Test API Connection
The frontend automatically connects to backend at `http://localhost:5000/api`

## Troubleshooting

### Port Already in Use
If you get "Port 4000 is already in use":
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Or change port in package.json
"dev": "next dev -p 4001"
```

### Backend Connection Error
If frontend can't connect to backend:
1. Verify backend is running on port 5000
2. Check `lib/api.ts` has correct baseURL
3. Check CORS settings in `backend/src/app.ts`

---

**Last Updated**: January 21, 2026
