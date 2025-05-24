# 🚂 Your Railway Deployment Setup

## Your Database URLs (From Railway):
```bash
DATABASE_URL=postgresql://postgres:NSVBPcGlatDAnuGvXcIxdChJBnbdyLhp@postgres.railway.internal:5432/railway
REDIS_URL=redis://default:gQrHciyHhDpzozLHYYKLTcybXaMWqTXr@redis.railway.internal:6379
```

## 🎯 Step-by-Step Railway Deployment

### Step 1: Backend Service Setup

1. **Create Backend Service:**
   - Go to Railway Dashboard
   - Click "Add Service" → "GitHub Repo"
   - Select your `agency-client-reviews` repository
   - Set **Root Directory**: `server`
   - Railway will detect the Dockerfile automatically

2. **Set Backend Environment Variables:**
   Go to Variables tab and add these exactly:

```bash
# Database (Your Railway URLs)
DATABASE_URL=postgresql://postgres:NSVBPcGlatDAnuGvXcIxdChJBnbdyLhp@postgres.railway.internal:5432/railway
REDIS_URL=redis://default:gQrHciyHhDpzozLHYYKLTcybXaMWqTXr@redis.railway.internal:6379

# Application
NODE_ENV=production
PORT=5000

# Security (Generate with: node scripts/generate-secrets.js)
JWT_SECRET=your-64-character-secret-here
JWT_REFRESH_SECRET=your-64-character-refresh-secret-here
SESSION_SECRET=your-64-character-session-secret-here

# CORS (Update after frontend is deployed)
CORS_ORIGIN=https://your-frontend-service.railway.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### Step 2: Frontend Service Setup

1. **Create Frontend Service:**
   - Click "Add Service" → "GitHub Repo" 
   - Select your repository again
   - Set **Root Directory**: `client`
   - Railway will detect the Dockerfile

2. **Set Frontend Environment Variables:**
```bash
# API Connection (Update with your backend URL)
NEXT_PUBLIC_API_URL=https://your-backend-service.railway.app/api
NEXT_PUBLIC_CLIENT_URL=https://your-frontend-service.railway.app

# Build
NODE_ENV=production
```

### Step 3: Generate Security Secrets

Run this command to get secure secrets:
```bash
node scripts/generate-secrets.js
```

Copy the output and paste into your backend service variables.

### Step 4: Update CORS After Deployment

1. After both services are deployed, copy the frontend URL
2. Go to backend service → Variables
3. Update `CORS_ORIGIN` with the actual frontend URL

## ⚡ Quick Deployment Commands

```bash
# 1. Generate secrets
node scripts/generate-secrets.js

# 2. Test locally first
docker-compose up -d

# 3. Commit and push any changes
git add .
git commit -m "Fix Railway deployment configuration"
git push origin main
```

## 🔍 Verification Checklist

After deployment, verify:

- [ ] Backend health: `https://your-backend.railway.app/api/health`
- [ ] Frontend loads: `https://your-frontend.railway.app`
- [ ] Database connected (check backend logs)
- [ ] CORS working (frontend can call backend)

## 🚨 Common Issues & Solutions

### Build Errors:
- ✅ **Root Directory**: Make sure `server` and `client` are set correctly
- ✅ **Dockerfile Detection**: Railway auto-detects Dockerfiles when named correctly ("Dockerfile")
- ✅ **Case Sensitivity**: Ensure "Dockerfile" is capitalized exactly
- ✅ **Dependencies**: Check build logs for missing packages

### Runtime Errors:
- ✅ **Environment Variables**: Use Railway Variables tab, not .env files
- ✅ **Database**: Verify DATABASE_URL is exactly as provided
- ✅ **CORS**: Must match frontend domain exactly

### Port Issues:
- ✅ **Railway PORT**: Railway assigns port automatically via `$PORT` env var
- ✅ **Dockerfiles**: Already configured to use Railway's PORT

---

**Ready to deploy! Your configuration is now fixed for Railway.** 🚀 