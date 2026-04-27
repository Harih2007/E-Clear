# Troubleshooting Guide - E-Clear

## Current Issue: 401 Login Error

### Symptoms
- Login page shows "An error occurred"
- Console shows "Request failed with status code 401"
- Backend logs show: `❌ Supabase connection check failed: TypeError: fetch failed`

### Root Cause
The backend cannot connect to Supabase, which means it cannot verify user credentials.

---

## Solutions

### Solution 1: Check Supabase Project Status

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Check if your project is active**:
   - Project URL: `https://ofrugpnrfrgnlwdifamr.supabase.co`
   - If the project is paused, click "Resume Project"
3. **Wait for the project to fully start** (can take 1-2 minutes)
4. **Refresh the login page** and try again

### Solution 2: Verify Network Connection

1. **Test Supabase connection manually**:
   ```bash
   curl https://ofrugpnrfrgnlwdifamr.supabase.co/rest/v1/
   ```
   
2. **Check if you're behind a firewall or VPN**:
   - Some corporate networks block Supabase
   - Try disabling VPN temporarily
   - Try using a different network (mobile hotspot)

3. **Check your internet connection**:
   - Make sure you have stable internet
   - Try accessing https://supabase.com in your browser

### Solution 3: Verify Supabase Credentials

1. **Go to Supabase Dashboard** → Your Project → Settings → API
2. **Verify these values match your `backend/.env` file**:
   - **Project URL**: Should match `SUPABASE_URL`
   - **anon/public key**: Should match `SUPABASE_ANON_KEY`
   - **service_role key**: Should match `SUPABASE_SERVICE_ROLE_KEY`

3. **If they don't match, update your `backend/.env` file**

### Solution 4: Create Test Accounts in Supabase

Even if Supabase connects, you need to create the test accounts:

1. **Open Supabase Dashboard** → SQL Editor
2. **Copy the contents of** `backend/test-accounts.sql`
3. **Paste and run the SQL script**
4. **Verify accounts were created**:
   ```sql
   SELECT email, name, role FROM users WHERE email = 'testuser@eclear.com';
   SELECT email, name FROM ecentres WHERE email = 'greenrecycle@eclear.com';
   ```

### Solution 5: Restart Backend Server

Sometimes the backend needs a fresh restart:

1. **Stop the backend process** (Ctrl+C in the terminal)
2. **Restart it**:
   ```bash
   cd backend
   npm run dev
   ```
3. **Wait for**: `🚀 Server running on port 5000`
4. **Try logging in again**

---

## Quick Test: Is Supabase Working?

### Test 1: Check Supabase Project
```bash
# Open in browser
https://ofrugpnrfrgnlwdifamr.supabase.co
```
**Expected**: Should show a Supabase API page or redirect
**If fails**: Project is paused or deleted

### Test 2: Test Backend API
```bash
# In a new terminal
curl http://localhost:5000/api/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@eclear.com","password":"TestUser123!","role":"USER"}'
```
**Expected**: JSON response with token or error message
**If fails**: Backend not running or Supabase connection issue

---

## Alternative: Use Mock Data (Temporary)

If Supabase is down and you need to test the UI, I can help you set up a mock authentication system that doesn't require Supabase.

---

## Common Error Messages

### "Supabase connection check failed"
- **Cause**: Cannot reach Supabase servers
- **Fix**: Check project status, network, firewall

### "Request failed with status code 401"
- **Cause**: Invalid credentials or user doesn't exist
- **Fix**: Run test-accounts.sql script in Supabase

### "Invalid token"
- **Cause**: JWT_SECRET mismatch or expired token
- **Fix**: Clear browser localStorage and login again

### "Email already exists"
- **Cause**: Trying to create duplicate account
- **Fix**: Use different email or login with existing account

---

## Step-by-Step: Complete Setup

### 1. Verify Supabase is Running
```
✅ Go to https://supabase.com/dashboard
✅ Find project: ofrugpnrfrgnlwdifamr
✅ Check status: Should be "Active" (green)
✅ If paused: Click "Resume Project"
```

### 2. Create Database Tables
```
✅ Go to SQL Editor in Supabase
✅ Run the migration: backend/supabase-migration.sql
✅ Verify tables exist: users, ecentres, disposal_requests, etc.
```

### 3. Create Test Accounts
```
✅ Go to SQL Editor in Supabase
✅ Run the script: backend/test-accounts.sql
✅ Verify accounts created (see query above)
```

### 4. Restart Backend
```
✅ Stop backend (Ctrl+C)
✅ Start backend: npm run dev
✅ Wait for: "🚀 Server running on port 5000"
✅ Check: Should NOT show Supabase connection error
```

### 5. Test Login
```
✅ Go to: http://localhost:4000/auth/login-user
✅ Email: testuser@eclear.com
✅ Password: TestUser123!
✅ Click: Login as User
✅ Should redirect to: /dashboard/user
```

---

## Still Not Working?

### Check Backend Logs
Look for these specific errors in the backend terminal:
- `❌ Supabase connection check failed` → Supabase issue
- `Invalid credentials` → Wrong email/password
- `Email already exists` → Account already created
- `ECONNREFUSED` → Backend not running
- `CORS error` → Frontend/backend port mismatch

### Check Browser Console
Look for these errors in browser DevTools (F12):
- `401 Unauthorized` → Invalid credentials or Supabase down
- `Network Error` → Backend not running
- `CORS policy` → CORS configuration issue

### Get More Details
Enable debug logging in backend:

1. **Edit `backend/.env`**:
   ```env
   NODE_ENV=development
   DEBUG=true
   ```

2. **Restart backend**

3. **Try login again** and check detailed logs

---

## Contact Information

If you're still stuck:
1. Check the backend terminal for specific error messages
2. Check the browser console (F12) for frontend errors
3. Verify Supabase project is active and accessible
4. Make sure you ran both SQL scripts (migration + test accounts)

---

## Quick Checklist

Before asking for help, verify:
- [ ] Supabase project is active (not paused)
- [ ] Backend is running on port 5000
- [ ] Frontend is running on port 4000
- [ ] Database tables exist (ran migration script)
- [ ] Test accounts exist (ran test-accounts script)
- [ ] No firewall/VPN blocking Supabase
- [ ] Internet connection is stable
- [ ] Browser console shows no CORS errors
- [ ] Backend logs show "Server running on port 5000"
