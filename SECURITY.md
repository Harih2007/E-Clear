# Security Guidelines for E-Clear

## 🔒 Environment Variables

### Protected Files
The following files contain sensitive information and are **NOT** committed to Git:

- `backend/.env` - Backend environment variables (JWT secret, database URI)
- `.env.local` - Frontend local environment variables
- Any `.env.*` files

### Example Files (Safe to Commit)
- `backend/.env.example` - Template for backend environment variables
- `.env.example` - Template for frontend environment variables

## 🔑 Secrets Management

### Current Secrets in Use

1. **JWT_SECRET** (Backend)
   - Location: `backend/.env`
   - Purpose: Signing and verifying JWT tokens
   - **IMPORTANT**: Change the default value in production!

2. **MONGO_URI** (Backend)
   - Location: `backend/.env`
   - Purpose: MongoDB connection string
   - Contains database credentials if using remote database

### Setting Up Environment Variables

#### Backend Setup
1. Copy the example file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `.env` and update the values:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/eclear
   JWT_SECRET=your_secure_random_string_here
   ```

#### Frontend Setup
1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` if needed (currently no secrets required)

## 🚫 What NOT to Commit

- ❌ `.env` files
- ❌ API keys
- ❌ Database credentials
- ❌ JWT secrets
- ❌ Private keys (`.pem`, `.key` files)
- ❌ Test scripts with hardcoded credentials
- ❌ `node_modules/`
- ❌ Build artifacts (`dist/`, `build/`, `.next/`)

## ✅ What IS Safe to Commit

- ✅ `.env.example` files (templates without real values)
- ✅ Source code
- ✅ Documentation
- ✅ Configuration files (without secrets)
- ✅ `.gitignore` files

## 🛡️ Production Security Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random value
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS/SSL
- [ ] Set secure CORS origins
- [ ] Use strong database passwords
- [ ] Enable MongoDB authentication
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Review and update dependencies
- [ ] Set NODE_ENV=production

## 📝 Generating Secure Secrets

### JWT Secret
Generate a secure random string:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### MongoDB Password
Use a password generator or:
```bash
openssl rand -base64 32
```

## 🔍 Checking for Exposed Secrets

Before committing, check for accidentally exposed secrets:
```bash
git status
git diff
```

If you accidentally committed secrets:
1. Immediately rotate/change the exposed secrets
2. Remove them from Git history (use `git filter-branch` or BFG Repo-Cleaner)
3. Force push the cleaned history

## 📞 Reporting Security Issues

If you discover a security vulnerability, please email: [your-email@example.com]

Do NOT create a public GitHub issue for security vulnerabilities.

---

**Last Updated**: January 21, 2026
