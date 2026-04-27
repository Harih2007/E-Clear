# Diagnostic Steps - Fix Login Issue

## The Problem
You're seeing a **401 error** when trying to log in with `testuser@eclear.com`.

The backend logs show: `❌ Supabase connection check failed: TypeError: fetch failed`

## Root Cause
**Your Supabase project is likely PAUSED or INACTIVE.**

---

## SOLUTION: Resume Your Supabase Project

### Step 1: Check Supabase Project Status

1. **Open Supabase Dashboard**: https://supabase.com/dashboard/projects
2. **Find your project**: `ofrugpnrfrgnlwdifamr`
3. **Check the status indicator**:
   - 🟢 **Green "Active"** = Good, project is running
   - 🟡 **Yellow "Paused"** = **THIS IS YOUR ISSUE**
   - 🔴 **Red "Inactive"** = Project needs to be resumed

### Step 2: Resume the Project

If your project shows **"Paused"** or **"Inactive"**:

1. **Click on your project**
2. **Look for a "Resume Project" or "Restore Project" button**
3. **Click it and wait 1-2 minutes** for the project to start
4. **You'll see a loading indicator** while it starts up

### Step 3: Verify Connection

Once the project shows **"Active"**:

1. **Test the connection** by opening this URL in your browser:
   ```
   https://ofrugpnrfrgnlwdifamr.supabase.co
   ```
   
2. **You should see**: A page that says "ok" or shows Supabase API info
   
3. **If you see an error**: The project is still starting, wait another minute

---

## After Resuming: Set Up Database

### Step 1: Create Database Tables

1. **In Supabase Dashboard**, go to **SQL Editor** (left sidebar)
2. **Click "New Query"**
3. **Open the file**: `backend/supabase-migration.sql` in your code editor
4. **Copy ALL the SQL code** from that file
5. **Paste it** into the Supabase SQL Editor
6. **Click "Run"** (or press Ctrl+Enter)
7. **Wait for**: "Success. No rows returned"

### Step 2: Create Test Accounts

1. **Still in SQL Editor**, click **"New Query"** again
2. **Open the file**: `backend/test-accounts.sql` in your code editor
3. **Copy ALL the SQL code** from that file
4. **Paste it** into the Supabase SQL Editor
5. **Click "Run"**
6. **You should see**: A table showing the created accounts

### Step 3: Verify Accounts Were Created

Run this query in SQL Editor:
```sql
SELECT email, name, role FROM users WHERE email = 'testuser@eclear.com';
```

**Expected result**: One row showing:
- email: testuser@eclear.com
- name: Test User
- role: USER

---

## After Setup: Test Login

### Step 1: Restart Backend

1. **Go to the terminal** running the backend
2. **Press Ctrl+C** to stop it
3. **Run**: `npm run dev` (or just wait, it should auto-restart)
4. **Wait for**: `🚀 Server running on port 5000`
5. **Check**: You should NOT see "Supabase connection check failed"

### Step 2: Try Logging In

1. **Go to**: http://localhost:4000/auth/login-user
2. **Enter**:
   - Email: `testuser@eclear.com`
   - Password: `TestUser123!`
3. **Click**: "Login as User"
4. **Expected**: Redirect to `/dashboard/user`

---

## If Still Not Working

### Check 1: Verify Supabase is Really Active

Open this URL in your browser:
```
https://ofrugpnrfrgnlwdifamr.supabase.co/rest/v1/
```

**If you see**:
- ✅ `{"message":"The server is running"}` or similar → Supabase is working
- ❌ Error page or timeout → Supabase is still down

### Check 2: Verify Tables Exist

In Supabase Dashboard → Table Editor (left sidebar):
- ✅ You should see tables: `users`, `ecentres`, `disposal_requests`, etc.
- ❌ If no tables → Run the migration script again

### Check 3: Verify Test Account Exists

In Supabase Dashboard → Table Editor → `users` table:
- ✅ You should see a row with email `testuser@eclear.com`
- ❌ If not found → Run the test-accounts script again

### Check 4: Check Backend Logs

Look at the backend terminal:
- ✅ Should say: `🚀 Server running on port 5000`
- ✅ Should NOT say: `❌ Supabase connection check failed`
- ❌ If still showing connection error → Supabase is not accessible

---

## Common Issues

### Issue: "Supabase project is paused"
**Solution**: Resume the project in Supabase Dashboard (see Step 1 above)

### Issue: "Tables don't exist"
**Solution**: Run `backend/supabase-migration.sql` in SQL Editor

### Issue: "User not found"
**Solution**: Run `backend/test-accounts.sql` in SQL Editor

### Issue: "Invalid password"
**Solution**: Make sure you're using `TestUser123!` (case-sensitive)

### Issue: "Network error"
**Solution**: Check your internet connection and firewall settings

---

## Visual Guide

### What You Should See in Supabase Dashboard

**Project Status (Top of page):**
```
┌─────────────────────────────────────┐
│ ofrugpnrfrgnlwdifamr                │
│ 🟢 Active                           │  ← Should be GREEN
└─────────────────────────────────────┘
```

**Table Editor (After running migration):**
```
Tables:
├── users
├── ecentres
├── disposal_requests
├── pickup_pools
└── pickups
```

**Users Table (After running test-accounts):**
```
┌──────────────────────┬───────────┬──────┐
│ email                │ name      │ role │
├──────────────────────┼───────────┼──────┤
│ testuser@eclear.com  │ Test User │ USER │
└──────────────────────┴───────────┴──────┘
```

---

## Quick Summary

1. ✅ **Resume Supabase project** (if paused)
2. ✅ **Run migration script** (creates tables)
3. ✅ **Run test-accounts script** (creates users)
4. ✅ **Restart backend** (reconnects to Supabase)
5. ✅ **Try login** (should work now!)

---

## Need More Help?

If you've followed all these steps and it's still not working:

1. **Take a screenshot** of:
   - Supabase project status page
   - Backend terminal showing the error
   - Browser console (F12) showing the error

2. **Check if**:
   - Supabase project shows "Active" (green)
   - Tables exist in Table Editor
   - Test user exists in users table
   - Backend shows "Server running" without errors

3. **Share the specific error message** you're seeing
