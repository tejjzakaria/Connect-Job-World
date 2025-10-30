# ⚡ Vercel Quick Start - 5 Minute Deployment

## ✅ Pre-Deployment Checklist

Files you need (already created):
- [x] `vercel.json` - Vercel configuration
- [x] `api/index.js` - Serverless function entry
- [x] Updated `server/server.js` - Serverless-ready
- [x] Updated `package.json` - Added `vercel-build` script

---

## 🚀 Deploy Now (Step by Step)

### 1️⃣ Push to GitHub (1 minute)
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

### 2️⃣ Import to Vercel (2 minutes)

1. Go to **[vercel.com/new](https://vercel.com/new)**
2. Click **"Import Git Repository"**
3. Select your repository
4. Configure:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"** (it will fail - that's OK!)

### 3️⃣ Add Environment Variables (2 minutes)

Go to **Settings** → **Environment Variables** and add:

**Required:**
```bash
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-generated-secret-key
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Optional:**
```bash
NODE_ENV=production
JWT_EXPIRE=7d
```

### 4️⃣ Redeploy
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Wait ~2 minutes

✅ **Done!** Your app is live at `https://your-app.vercel.app`

---

## 🧪 Test Your Deployment

Open these URLs:
- **Home**: https://your-app.vercel.app
- **Admin Login**: https://your-app.vercel.app/admin/login ← Should work!
- **API Health**: https://your-app.vercel.app/api/health

Expected result:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## 🔑 MongoDB Atlas Setup (If You Haven't Already)

### Quick Setup:
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a **free cluster**
3. **Database Access** → Create user (save password!)
4. **Network Access** → Allow access from **anywhere** (`0.0.0.0/0`)
5. **Connect** → Get connection string
6. Add to Vercel environment variables

---

## 🐛 If Deployment Fails

### Check Deployment Logs
1. Vercel Dashboard → **Deployments**
2. Click on failed deployment
3. Check **"Building"** and **"Functions"** logs

### Common Issues:

**1. Build fails**
```bash
# Make sure you can build locally
npm run build

# Fix any errors, then:
git add .
git commit -m "Fix build errors"
git push
```

**2. API returns 404**
- Ensure `api/index.js` exists
- Check `vercel.json` configuration
- Redeploy

**3. Database connection fails**
- Check MongoDB IP whitelist (should be 0.0.0.0/0)
- Verify connection string in Vercel env vars
- Test connection string locally

**4. Environment variables not working**
- Variables must be added in Vercel Dashboard
- No quotes around values
- Redeploy after adding variables

---

## 📱 Automatic Deployments

Every time you push to GitHub:
- **main/master** → Production deployment
- **other branches** → Preview deployment

To deploy:
```bash
git add .
git commit -m "Your changes"
git push
```

Vercel automatically builds and deploys! 🎉

---

## 🌐 Custom Domain (Optional)

### Add Domain:
1. Vercel Dashboard → **Settings** → **Domains**
2. Enter your domain
3. Follow DNS instructions

### DNS Records:
**Root domain:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**WWW subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 💡 Pro Tips

### View Logs in Real-time
```bash
npm i -g vercel
vercel login
vercel link
vercel logs --follow
```

### Test Environment Variables
Add to `api/index.js`:
```javascript
console.log('MongoDB connected:', !!process.env.MONGODB_URI);
```

Check logs in Vercel Dashboard → Functions.

### Rollback to Previous Version
1. Deployments → Find working version
2. Click **"..."** → **"Promote to Production"**

---

## ⚠️ Important Notes

### File Uploads
Vercel serverless functions store files in `/tmp` which is **temporary**.

**For production file uploads**, use:
- [Cloudinary](https://cloudinary.com) (recommended)
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- AWS S3

**Current setup** will work for testing but files will be lost on function restart.

### Function Limits
- **Timeout**: 10 seconds (Hobby), 60 seconds (Pro)
- **Size**: 50MB max
- **Cold starts**: ~2-5 seconds for first request

Most operations complete in < 3 seconds, so you're fine! ✅

---

## 📞 Need Help?

1. Read: `VERCEL-DEPLOYMENT.md` (detailed guide)
2. Check: [Vercel Documentation](https://vercel.com/docs)
3. Debug: Check function logs in Vercel Dashboard

---

## ✅ Success Checklist

After deployment, verify:
- [ ] Frontend loads at your Vercel URL
- [ ] `/admin/login` page loads
- [ ] You can log in successfully
- [ ] API health check returns "OK"
- [ ] No errors in function logs
- [ ] All pages/routes work

---

**You're all set!** 🎉

Your app is now live on Vercel with automatic deployments on every push!

Next: Add a custom domain or just share your Vercel URL!
