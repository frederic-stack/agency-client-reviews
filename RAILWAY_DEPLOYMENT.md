# 🚂 Railway Deployment Guide for ClientScore

This guide will help you deploy your ClientScore application to Railway with all necessary services.

## 📋 Prerequisites

1. ✅ Railway account (already set up)
2. ✅ GitHub repository (should be connected)
3. ✅ Project configured with Docker

## 🚀 Deployment Steps

### Step 1: Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `agency-client-reviews` repository

### Step 2: Set Up Database Services

#### Add PostgreSQL Database
1. In your Railway project, click "Add Service"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a PostgreSQL instance
4. Note the `DATABASE_URL` from the Variables tab

#### Add Redis Cache
1. Click "Add Service" again
2. Select "Database" → "Redis"
3. Railway will create a Redis instance
4. Note the `REDIS_URL` from the Variables tab

### Step 3: Deploy Backend API

1. Click "Add Service" → "GitHub Repo"
2. Select your repository
3. Set **Root Directory** to: `server`
4. Railway will automatically detect the Dockerfile

#### Configure Backend Environment Variables
Go to the Variables tab and add these:

```bash
# Database (automatically provided by Railway)
DATABASE_URL=<automatically_set_by_railway>
REDIS_URL=<automatically_set_by_railway>

# Application
NODE_ENV=production
PORT=5000

# Security (generate strong random values)
JWT_SECRET=<generate_64_char_random_string>
JWT_REFRESH_SECRET=<generate_64_char_random_string>
SESSION_SECRET=<generate_64_char_random_string>

# CORS (will update after frontend is deployed)
CORS_ORIGIN=https://your-frontend-domain.railway.app

# OAuth (get from providers)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@clientscore.com

# Spam Protection
AKISMET_API_KEY=your_akismet_api_key
AKISMET_BLOG_URL=https://your-frontend-domain.railway.app
```

### Step 4: Deploy Frontend Client

1. Click "Add Service" → "GitHub Repo"
2. Select your repository again
3. Set **Root Directory** to: `client`
4. Railway will detect the Dockerfile

#### Configure Frontend Environment Variables
```bash
# API Connection
NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app/api
NEXT_PUBLIC_CLIENT_URL=https://your-frontend-domain.railway.app

# Build
NODE_ENV=production
```

### Step 5: Update CORS Settings

1. After both services are deployed, copy the frontend domain
2. Go to backend service → Variables
3. Update `CORS_ORIGIN` with your frontend URL
4. Update `AKISMET_BLOG_URL` with your frontend URL

### Step 6: Custom Domains (Optional)

1. Go to each service → Settings → Domains
2. Add your custom domain
3. Update environment variables with custom domains

## 🔧 Important Configuration

### Service Dependencies
Make sure services start in this order:
1. PostgreSQL
2. Redis  
3. Backend API
4. Frontend Client

### Environment Variables Checklist

#### Backend Service ✅
- [ ] DATABASE_URL (auto-generated)
- [ ] REDIS_URL (auto-generated)
- [ ] JWT_SECRET (64+ characters)
- [ ] JWT_REFRESH_SECRET (64+ characters)
- [ ] SESSION_SECRET (64+ characters)
- [ ] CORS_ORIGIN (frontend URL)
- [ ] OAuth credentials (Google, LinkedIn)
- [ ] SMTP settings
- [ ] AKISMET_API_KEY

#### Frontend Service ✅
- [ ] NEXT_PUBLIC_API_URL (backend URL + /api)
- [ ] NEXT_PUBLIC_CLIENT_URL (frontend URL)

## 🔍 Verification Steps

### 1. Check Backend Health
```bash
curl https://your-backend-domain.railway.app/api/health
```
Should return: `{"status": "healthy", "timestamp": "..."}`

### 2. Check Frontend
Visit: `https://your-frontend-domain.railway.app`
Should load the ClientScore landing page

### 3. Check Database Connection
Backend logs should show: `✅ Database connected successfully`

### 4. Test API Endpoints
```bash
# Test CORS
curl -H "Origin: https://your-frontend-domain.railway.app" \
     https://your-backend-domain.railway.app/api/health

# Test authentication endpoint
curl https://your-backend-domain.railway.app/api/auth/me
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
- Check that Root Directory is set correctly (`server` or `client`)
- Verify Dockerfile syntax
- Check build logs for specific errors

#### 2. Database Connection Issues
- Verify DATABASE_URL is set
- Check if Prisma migrations ran successfully
- Look for connection errors in logs

#### 3. CORS Errors
- Ensure CORS_ORIGIN matches frontend domain exactly
- Include protocol (https://) in URLs
- Check for trailing slashes

#### 4. Environment Variables
- Use Railway's Variables tab (not .env files)
- Restart services after changing variables
- Verify variables are properly set

### Logs and Monitoring
- Use Railway's built-in log viewer
- Monitor service health with Railway metrics
- Set up alerts for downtime

## 🎯 Production Optimizations

1. **Enable Health Checks**: Railway will use Docker health checks
2. **Auto-scaling**: Configure based on usage
3. **Monitoring**: Set up alerts for errors
4. **Backups**: Regular database backups
5. **SSL**: Automatic with Railway domains

## 🔐 Security Checklist

- [ ] Strong JWT secrets (64+ characters)
- [ ] HTTPS only (automatic with Railway)
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation active

## 📞 Support

If you encounter issues:
1. Check Railway's [documentation](https://docs.railway.app/)
2. Review service logs in Railway dashboard
3. Verify environment variables
4. Test locally with production environment

---

**Your ClientScore application should now be live on Railway! 🎉**

Frontend: `https://your-frontend-domain.railway.app`
Backend: `https://your-backend-domain.railway.app/api` 