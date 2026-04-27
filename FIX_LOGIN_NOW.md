# 🚨 FIX LOGIN ERROR - Quick Guide

## Your Error
```
❌ Request failed with status code 401
❌ Supabase connection check failed
```

## The Fix (5 minutes)

### 1️⃣ Resume Supabase Project
```
1. Go to: https://supabase.com/dashboard
2. Find project: ofrugpnrfrgnlwdifamr
3. If it says "Paused" → Click "Resume Project"
4. Wait 1-2 minutes for it to start
```

### 2️⃣ Create Database Tables
```
1. In Supabase → Click "SQL Editor"
2. Open file: backend/supabase-migration.sql
3. Copy ALL the code
4. Paste in SQL Editor
5. Click "Run"
```

### 3️⃣ Create Test Accounts
```
1. In Supabase → SQL Editor → "New Query"
2. Open file: backend/test-accounts.sql
3. Copy ALL the code
4. Paste in SQL Editor
5. Click "Run"
```

### 4️⃣ Restart Backend
```
1. In backend terminal → Press Ctrl+C
2. Run: npm run dev
3. Wait for: "🚀 Server running on port 5000"
4. Should NOT see "Supabase connection failed"
```

### 5️⃣ Try Login Again
```
1. Go to: http://localhost:4000/auth/login-user
2. Email: testuser@eclear.com
3. Password: TestUser123!
4. Click "Login as User"
5. ✅ Should work now!
```

---

## Still Not Working?

### Check This URL:
```
https://ofrugpnrfrgnlwdifamr.supabase.co
```
- ✅ If it loads → Supabase is working
- ❌ If it errors → Supabase is still paused/down

### Check Backend Terminal:
```
✅ Should say: "🚀 Server running on port 5000"
❌ Should NOT say: "Supabase connection check failed"
```

### Check Supabase Tables:
```
1. Supabase Dashboard → Table Editor
2. Should see: users, ecentres, disposal_requests
3. Click "users" → Should see testuser@eclear.com
```

---

## Test Accounts

### User Account
```
Email: testuser@eclear.com
Password: TestUser123!
URL: http://localhost:4000/auth/login-user
```

### E-Centre Account
```
Email: greenrecycle@eclear.com
Password: EcentreTest123!
URL: http://localhost:4000/auth/login-ecentre
```

---

## Files You Need

1. **backend/supabase-migration.sql** → Creates database tables
2. **backend/test-accounts.sql** → Creates test users
3. **DIAGNOSTIC_STEPS.md** → Detailed troubleshooting
4. **TROUBLESHOOTING.md** → Complete guide

---

## Quick Checklist

Before trying to login:
- [ ] Supabase project shows "Active" (green)
- [ ] Ran supabase-migration.sql
- [ ] Ran test-accounts.sql
- [ ] Backend restarted successfully
- [ ] Backend shows NO Supabase errors

---

**Most Common Issue**: Supabase project is paused. Just resume it!
