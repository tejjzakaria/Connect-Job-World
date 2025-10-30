# 🚀 Vercel Deployment Guide

Complete guide to deploy Connect Job World on Vercel.

---

## 📋 Prerequisites

1. **GitHub Repository**: Push your code to GitHub
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **MongoDB Atlas**: Database connection string ready

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Push to GitHub
```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/connect-job-world.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Click "Import"

### Step 3: Configure Project

**Framework Preset**: Vite
**Build Command**: `npm run build`
**Output Directory**: `dist`
**Install Command**: `npm install`

Click **"Deploy"** - Don't worry about environment variables yet!

### Step 4: Add Environment Variables

After first deployment (will fail, that's OK):

1. Go to **Project Settings** → **Environment Variables**
2. Add these variables (one by one):

```bash
# CRITICAL - Must Add
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-generated-secret-key

# RECOMMENDED
NODE_ENV=production
JWT_EXPIRE=7d
MAX_FILE_SIZE=10485760
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Redeploy

1. Go to **Deployments** tab
2. Click **"Redeploy"** on latest deployment
3. Check **"Use existing Build Cache"** (optional)
4. Click **"Redeploy"**

✅ **Done!** Your app will be live at `https://your-app.vercel.app`

---

## 📁 Files Created for Vercel

- ✅ `vercel.json` - Vercel configuration
- ✅ `api/index.js` - Serverless function entry point
- ✅ `.env.vercel.example` - Environment variables template
- ✅ Updated `package.json` with `vercel-build` script
- ✅ Updated `server/server.js` to work in serverless mode

---

## 🔧 How It Works

### Vercel Deployment Structure
```
Your App on Vercel
├── Frontend (Static Site)
│   ├── / (Home)
│   ├── /admin/login (Admin Login)
│   └── /* (All React routes)
│
└── Backend (Serverless Functions)
    └── /api/* (All API routes)
```

### Request Flow
```
User visits: https://your-app.vercel.app/admin/login
  ↓
Vercel: Serves index.html (from dist/)
  ↓
React Router: Loads AdminLogin component
  ↓
✅ Page displays

User makes API call: /api/auth/login
  ↓
Vercel: Routes to serverless function (api/index.js)
  ↓
Express: Handles request
  ↓
✅ Returns JSON response
```

---

## 🌍 Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | 32+ char random string |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `JWT_EXPIRE` | `7d` | Token expiration time |
| `MAX_FILE_SIZE` | `10485760` | Max upload size (10MB) |
| `ALLOWED_ORIGINS` | Auto | Additional CORS origins |

### Auto-Set by Vercel

| Variable | Description |
|----------|-------------|
| `VERCEL` | Always `1` on Vercel |
| `VERCEL_URL` | Deployment URL |
| `VERCEL_ENV` | `production`, `preview`, or `development` |

---

## 🔒 MongoDB Atlas Setup

### 1. Create Cluster
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Choose region close to your users

### 2. Whitelist Vercel IPs
**Important**: Vercel uses dynamic IPs, so whitelist **all IPs**:
1. Go to **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (`0.0.0.0/0`)
4. Confirm

### 3. Create Database User
1. Go to **Database Access**
2. Click **"Add New Database User"**
3. Set username and password
4. Grant **"Read and write to any database"** role
5. Save

### 4. Get Connection String
1. Click **"Connect"**
2. Choose **"Connect your application"**
3. Copy connection string
4. Replace `<password>` with your user password
5. Add to Vercel environment variables

---

## 🎨 Custom Domain (Optional)

### Add Your Domain

1. Go to **Project Settings** → **Domains**
2. Enter your domain: `yourdomain.com`
3. Follow DNS configuration instructions

### DNS Configuration

Add these DNS records at your domain registrar:

**For root domain (yourdomain.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Update CORS

Add your custom domain to environment variables:
```bash
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

Redeploy after adding.

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot find module" error

**Cause**: Missing dependencies

**Solution**:
```bash
# Ensure all dependencies are in package.json
npm install

# Commit and push
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Issue 2: API routes return 404

**Check `vercel.json`**:
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    }
  ]
}
```

**Solution**: Ensure `api/index.js` exists and exports the Express app.

### Issue 3: Database connection timeout

**Check**:
1. MongoDB Atlas IP whitelist includes `0.0.0.0/0`
2. Database user has correct permissions
3. Connection string is correct in Vercel env vars

**Test Connection**:
```bash
# Locally test the connection string
mongosh "your-connection-string"
```

### Issue 4: Environment variables not working

**Check**:
1. Variables added in Vercel dashboard
2. No quotes around values in Vercel
3. Redeployed after adding variables

**Debug**:
Add this to `api/index.js` temporarily:
```javascript
console.log('ENV:', {
  hasMongoUri: !!process.env.MONGODB_URI,
  hasJwtSecret: !!process.env.JWT_SECRET,
});
```

Check function logs in Vercel dashboard.

### Issue 5: Build fails

**Check Build Logs**:
1. Go to **Deployments**
2. Click on failed deployment
3. Check **"Building"** logs

**Common fixes**:
```bash
# Ensure build script exists
# package.json should have:
"scripts": {
  "vercel-build": "vite build"
}

# Check for TypeScript errors
npm run build

# Fix and commit
git add .
git commit -m "Fix build errors"
git push
```

---

## 📊 Monitoring & Logs

### View Function Logs

1. Go to **Deployments**
2. Click on deployment
3. Click **"Functions"** tab
4. Click on function to see logs

### Real-time Logs

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Stream logs
vercel logs --follow
```

### Performance Monitoring

1. Go to **Analytics** tab
2. View:
   - Response times
   - Error rates
   - Traffic patterns
   - Geographic distribution

---

## 🔄 Deployment Workflow

### Automatic Deployments

Every push to GitHub triggers:
- **main/master branch** → Production deployment
- **other branches** → Preview deployment

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Rollback

1. Go to **Deployments**
2. Find previous working deployment
3. Click **"..."** → **"Promote to Production"**

---

## 🚨 Important Vercel Limitations

### File Uploads
- ⚠️ **Serverless functions have 50MB max**
- ⚠️ **Files stored in `/tmp` are ephemeral**
- ✅ **Solution**: Use cloud storage (AWS S3, Cloudinary, etc.)

### Function Timeout
- ⚠️ **Hobby plan: 10 seconds max**
- ⚠️ **Pro plan: 60 seconds max**
- ✅ **Most operations complete in < 5s**

### Cold Starts
- ⚠️ **First request after inactivity may be slow (~2-5s)**
- ✅ **Subsequent requests are fast**
- ✅ **Pro plan has less cold starts**

### Database Connections
- ⚠️ **Each function invocation creates new connection**
- ✅ **Use connection pooling (already configured)**
- ✅ **MongoDB Atlas handles this well**

---

## 💡 Optimization Tips

### 1. Reduce Bundle Size
```javascript
// Use dynamic imports for large components
const Analytics = lazy(() => import('./pages/admin/Analytics'));

// Use route-based code splitting
const routes = [
  {
    path: '/admin/analytics',
    component: lazy(() => import('./pages/admin/Analytics'))
  }
];
```

### 2. Enable Caching
Already configured in `vercel.json` for static assets.

### 3. Optimize Images
```bash
# Install image optimization
npm install next/image

# Or use Vercel's built-in optimization
# Images from /public are auto-optimized
```

### 4. Monitor Performance
- Use Vercel Analytics (free on Pro plan)
- Check function execution times
- Optimize slow database queries

---

## 🎯 Deployment Checklist

### Before First Deploy
- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelist configured (0.0.0.0/0)
- [ ] Connection string tested locally

### Vercel Configuration
- [ ] Project imported from GitHub
- [ ] Build settings configured
- [ ] `MONGODB_URI` environment variable added
- [ ] `JWT_SECRET` environment variable added
- [ ] First deployment successful

### After Deployment
- [ ] Visit app URL - frontend loads
- [ ] Test `/admin/login` - page loads
- [ ] Test login - authentication works
- [ ] Test API calls - backend responds
- [ ] Check function logs - no errors
- [ ] Test file uploads (if applicable)
- [ ] Configure custom domain (optional)

---

## 🆘 Getting Help

### Vercel Support
- [Documentation](https://vercel.com/docs)
- [Community](https://github.com/vercel/vercel/discussions)
- [Support](https://vercel.com/support)

### Debug Checklist
1. Check deployment logs
2. Check function logs
3. Test environment variables
4. Verify MongoDB connection
5. Check CORS settings
6. Test API endpoints individually

---

## 🎉 Success!

Your app is now live on Vercel!

**Next Steps:**
1. Share your app URL
2. Set up custom domain
3. Monitor analytics
4. Enable Vercel Analytics (optional)
5. Set up error tracking (Sentry, optional)

**Your Live URLs:**
- Frontend: `https://your-app.vercel.app`
- Admin Login: `https://your-app.vercel.app/admin/login`
- API Health: `https://your-app.vercel.app/api/health`

---

**Note**: For file uploads in production, consider using:
- [Cloudinary](https://cloudinary.com) - Image/video hosting
- [AWS S3](https://aws.amazon.com/s3/) - File storage
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) - Vercel's storage solution

---

Last Updated: 2025-01-30
