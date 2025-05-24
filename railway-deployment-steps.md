# 🚂 Railway Deployment Steps (Clear Guide)

## Current Status: You're at Step 2 ✅

## Step 1: ✅ Create Railway Project (DONE)
- Railway Dashboard → "New Project"
- "Deploy from GitHub repo"
- Selected: `agency-client-reviews`

## Step 2: ✅ Set Up Database Services (YOU'RE HERE)
This step creates the databases but NOT the app services yet.

### Add PostgreSQL Database:
1. In your Railway project → "Add Service"
2. Select "Database" → "PostgreSQL" 
3. Railway creates the database
4. ✅ You already have: `DATABASE_URL=postgresql://postgres:NSVBPcGlatDAnuGvXcIxdChJBnbdyLhp@postgres.railway.internal:5432/railway`

### Add Redis Cache:
1. "Add Service" → "Database" → "Redis"
2. Railway creates Redis
3. ✅ You already have: `REDIS_URL=redis://default:gQrHciyHhDpzozLHYYKLTcybXaMWqTXr@redis.railway.internal:6379`

## Step 3: 🎯 Deploy Backend API (NEXT STEP)
**THIS is where you set the Root Directory!**

1. **"Add Service"** → **"GitHub Repo"**
2. Select your repository: `agency-client-reviews`
3. **🔥 IMPORTANT: Set Root Directory to `server`** ← THIS IS REQUIRED!
4. Railway will auto-detect the Dockerfile ✅
5. Set Environment Variables (see below)

### Backend Environment Variables:
```bash
DATABASE_URL=postgresql://postgres:NSVBPcGlatDAnuGvXcIxdChJBnbdyLhp@postgres.railway.internal:5432/railway
REDIS_URL=redis://default:gQrHciyHhDpzozLHYYKLTcybXaMWqTXr@redis.railway.internal:6379
NODE_ENV=production
PORT=5000
JWT_SECRET=05c1a74f4e47f6806334a8e49a7c9669178ecf178804b3a03c515f37e16fcf2b0194c0228e27dc6d197f689b3f8352c93e8e877ebe66b363103333456343bfc2
JWT_REFRESH_SECRET=e698eccc6600deeaaef2b296f1528d3351a1c7a8c39e7a1b258c6ae9b3f509bd9426d043f82592b09a47499fd241bad8447b1a7a1076354975569060c2fb1b76
SESSION_SECRET=e2f8d9f40a9e3686a33d7856a78255470a5adcebe6c323401a86c88a23a9a7abacddc5a8e5233c5d90349fd837bd5422763ef6bc5d71ad8900b66aa0eeb7c1fd
CORS_ORIGIN=https://your-frontend-url.railway.app
```

## Step 4: 🎯 Deploy Frontend Client (AFTER BACKEND)

1. **"Add Service"** → **"GitHub Repo"**
2. Select your repository: `agency-client-reviews` (same repo)
3. **🔥 IMPORTANT: Set Root Directory to `client`** ← THIS IS REQUIRED!
4. Railway will auto-detect the Dockerfile ✅
5. Set Environment Variables (see below)

### Frontend Environment Variables:
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
NEXT_PUBLIC_CLIENT_URL=https://your-frontend-url.railway.app
NODE_ENV=production
```

## 🔧 Fixed Configuration Issues:

✅ **Removed problematic `railway.toml` files** (causing "build.builder invalid input")
✅ **Kept `nixpacks.toml` files** (prevents Nixpacks from interfering)
✅ **Railway will auto-detect Dockerfiles** when Root Directory is set correctly

## 🎯 Answer to Your Question:

> "do i need to add root directory server or is it already good?"

**YES, you MUST set Root Directory:**
- **Step 3 (Backend):** Root Directory = `server`
- **Step 4 (Frontend):** Root Directory = `client`

**You can't deploy both from the same service.** You need TWO separate services:
1. One service for backend (Root Directory: `server`)
2. One service for frontend (Root Directory: `client`)

## 🚀 Next Action:

Since you're at Step 2, proceed to **Step 3**:
1. "Add Service" → "GitHub Repo"
2. **Root Directory: `server`** ← Critical!
3. Railway should now detect Dockerfile without errors

---

**The "build.builder invalid input" error is now fixed!** 🎉 