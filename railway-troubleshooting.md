# 🚨 Railway Deployment Troubleshooting Guide

## Issues We've Fixed & Solutions

### ❌ Problem 1: "build.builder: invalid input"
**Cause:** Invalid `railway.json` configuration file
**Solution:** ✅ **FIXED** - Removed invalid configuration files

### ❌ Problem 2: "nixpacks build fail"  
**Cause:** Railway using Nixpacks instead of Docker
**Solution:** ✅ **FIXED** - Railway now auto-detects Dockerfiles

### ❌ Problem 3: "dockerfile doesn't exist"
**Cause:** Railway configuration conflicts
**Solution:** ✅ **FIXED** - Removed `railway.toml` files, let Railway auto-detect

## 🎯 Current Deployment Strategy

### **Step 1: Backend Service**
1. **Create Service:** Add Service → GitHub Repo → `agency-client-reviews`
2. **Root Directory:** `server` (IMPORTANT!)
3. **Build:** Railway will auto-detect `Dockerfile` ✅
4. **Environment Variables:**
   ```bash
   DATABASE_URL=postgresql://postgres:NSVBPcGlatDAnuGvXcIxdChJBnbdyLhp@postgres.railway.internal:5432/railway
   REDIS_URL=redis://default:gQrHciyHhDpzozLHYYKLTcybXaMWqTXr@redis.railway.internal:6379
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=05c1a74f4e47f6806334a8e49a7c9669178ecf178804b3a03c515f37e16fcf2b0194c0228e27dc6d197f689b3f8352c93e8e877ebe66b363103333456343bfc2
   JWT_REFRESH_SECRET=e698eccc6600deeaaef2b296f1528d3351a1c7a8c39e7a1b258c6ae9b3f509bd9426d043f82592b09a47499fd241bad8447b1a7a1076354975569060c2fb1b76
   SESSION_SECRET=e2f8d9f40a9e3686a33d7856a78255470a5adcebe6c323401a86c88a23a9a7abacddc5a8e5233c5d90349fd837bd5422763ef6bc5d71ad8900b66aa0eeb7c1fd
   CORS_ORIGIN=https://your-frontend.railway.app
   ```

### **Step 2: Frontend Service**
1. **Create Service:** Add Service → GitHub Repo → `agency-client-reviews`
2. **Root Directory:** `client` (IMPORTANT!)
3. **Build:** Railway will auto-detect `Dockerfile` ✅
4. **Environment Variables:**
   ```bash
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   NEXT_PUBLIC_CLIENT_URL=https://your-frontend.railway.app
   NODE_ENV=production
   ```

## 🔍 Verification Steps

1. **Check Build Logs:**
   - Should show "Building with Docker"
   - Should detect Dockerfile automatically
   - No "nixpacks" or "builder error" messages

2. **Test Endpoints:**
   ```bash
   # Backend health check
   curl https://your-backend.railway.app/api/health
   
   # Frontend accessibility
   curl https://your-frontend.railway.app
   ```

3. **Database Connection:**
   - Backend logs should show "✅ Database connected successfully"
   - Prisma migrations should run automatically

## 🛠️ File Structure (Current)

```
├── server/
│   ├── Dockerfile ✅        # Auto-detected by Railway
│   ├── .dockerignore ✅     # Optimizes Docker build
│   ├── .railwayignore ✅    # Optimizes Railway deployment
│   └── ...
├── client/
│   ├── Dockerfile ✅        # Auto-detected by Railway
│   ├── .dockerignore ✅     # Optimizes Docker build
│   ├── .railwayignore ✅    # Optimizes Railway deployment
│   └── ...
```

## ⚠️ Common Mistakes to Avoid

1. **❌ Don't use `railway.json`** - Causes "invalid builder" errors
2. **❌ Don't use `railway.toml`** - Can interfere with auto-detection
3. **❌ Wrong Root Directory** - Must be exact: `server` and `client`
4. **❌ Case Sensitivity** - `Dockerfile` must be capitalized exactly
5. **❌ Environment Variables** - Use Railway Variables tab, not `.env` files

## 🎯 Expected Build Process

1. **Railway detects GitHub repo**
2. **Sets Root Directory** (`server` or `client`)
3. **Auto-detects Dockerfile** in that directory
4. **Builds Docker image** using detected Dockerfile
5. **Deploys container** with environment variables
6. **Health checks pass** (both services have health checks)

## 🚀 Final Deployment URLs

Once successful, you'll get:
- **Backend:** `https://server-production-xxxx.railway.app`
- **Frontend:** `https://client-production-xxxx.railway.app`

Update CORS_ORIGIN in backend to match your actual frontend URL.

## 📞 Still Having Issues?

1. **Check Railway logs** for specific error messages
2. **Verify Root Directory** settings in Railway dashboard
3. **Confirm Dockerfile exists** in the specified directory
4. **Test locally** with Docker if possible
5. **Environment variables** - ensure all required vars are set

---

**Your repository is now optimized for Railway deployment!** 🚂✅ 