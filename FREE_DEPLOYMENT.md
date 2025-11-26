# Free Deployment Guide - Railway + Vercel

## ✅ Your code is already on GitHub!
Repository: https://github.com/kanagarajhub/chitapp

---

## Step 1: Deploy Backend to Railway (FREE)

### 1.1 Sign up for Railway
1. Go to: **https://railway.app**
2. Click **"Login with GitHub"**
3. Authorize Railway to access your GitHub

### 1.2 Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **"kanagarajhub/chitapp"**
4. Railway will detect the backend folder

### 1.3 Configure Backend
1. Click on your project
2. Go to **"Variables"** tab
3. Add these environment variables:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://kkanagaraj2253:2253@cluster0.dk8vo.mongodb.net/chitfund?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=chitfund_secret_key_2025_secure_token_change_in_production
JWT_EXPIRE=30d
PORT=5000
```

### 1.4 Configure Root Directory
1. Go to **"Settings"** tab
2. Find **"Root Directory"**
3. Set to: **`backend`**
4. Click **"Save"**

### 1.5 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for deployment
3. Copy your backend URL (e.g., `https://chitapp-production.up.railway.app`)

### 1.6 Enable Public Access
1. Go to **"Settings"**
2. Find **"Networking"**
3. Click **"Generate Domain"**
4. Copy the generated URL - this is your **Backend API URL**

---

## Step 2: Deploy Frontend to Vercel (FREE)

### 2.1 Sign up for Vercel
1. Go to: **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel

### 2.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Find **"kanagarajhub/chitapp"**
3. Click **"Import"**

### 2.3 Configure Project
1. **Framework Preset**: Select **"Vite"**
2. **Root Directory**: Click **"Edit"** → Select **"web"**
3. **Build Command**: `npm run build` (auto-detected)
4. **Output Directory**: `dist` (auto-detected)

### 2.4 Add Environment Variable
1. Click **"Environment Variables"**
2. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.railway.app/api`
   (Use the Railway URL from Step 1.6)
3. Click **"Add"**

### 2.5 Deploy
1. Click **"Deploy"**
2. Wait 1-2 minutes
3. Your app will be live at: `https://chitapp.vercel.app` (or custom URL)

---

## Step 3: Update Mobile App API URL

Edit `mobile/lib/config/api_config.dart`:

```dart
class ApiConfig {
  static const String baseUrl = 'https://your-backend-url.railway.app/api';
  static const int timeout = 30;
}
```

Then rebuild: `flutter build apk --release`

---

## Step 4: Create Admin User in Production

Once backend is deployed:

1. Go to Railway dashboard
2. Click on your backend service
3. Go to **"Deployments"**
4. Click **"View Logs"**
5. Look for MongoDB connection success
6. Run seed script via Railway CLI (or manually):

```bash
# Or access via Railway shell
railway run node seedAdmin.js
```

Or create admin manually via MongoDB Atlas:
1. Go to MongoDB Atlas
2. Browse Collections → chitfund → employees
3. Insert document with hashed password

---

## Your Deployed URLs:

✅ **Backend API**: `https://your-app.railway.app`
✅ **Web App**: `https://your-app.vercel.app`
✅ **Database**: MongoDB Atlas (already configured)

---

## Test Your Deployment

1. Open your Vercel URL
2. Login with:
   - Email: `admin@example.com`
   - Password: `admin123`
3. Create customers, chit plans, payments
4. All data saves to MongoDB Atlas

---

## Free Tier Limits:

**Railway FREE:**
- $5 credit/month
- ~500 hours runtime
- Perfect for testing/small apps

**Vercel FREE:**
- 100 GB bandwidth/month
- Unlimited deployments
- Perfect for frontend

**MongoDB Atlas FREE:**
- 512 MB storage
- Shared cluster
- Perfect for small apps

---

## Updating Your App

### Update Backend:
```bash
cd backend
# Make changes
git add .
git commit -m "Update backend"
git push origin main
# Railway auto-deploys!
```

### Update Frontend:
```bash
cd web
# Make changes
git add .
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys!
```

---

## Troubleshooting

**Backend not starting?**
- Check Railway logs
- Verify MongoDB URI is correct
- Check environment variables

**Frontend showing errors?**
- Verify VITE_API_URL is correct
- Check browser console (F12)
- Ensure backend is running

**Can't login?**
- Check backend logs for errors
- Verify MongoDB connection
- Create admin user via seedAdmin.js

**CORS errors?**
- Add your Vercel URL to backend CORS
- Update `backend/server.js`

---

## Next Steps

1. ✅ Custom domain (optional)
   - Railway: Add custom domain in Settings
   - Vercel: Add custom domain in Project Settings

2. ✅ Environment security
   - Never commit `.env` files
   - Use Railway/Vercel secrets

3. ✅ Monitoring
   - Railway has built-in metrics
   - Use Vercel Analytics (free)

4. ✅ Backups
   - MongoDB Atlas auto-backup
   - Export data regularly

---

## Cost to Upgrade (Optional)

If you need more:
- **Railway Pro**: $20/month (unlimited)
- **Vercel Pro**: $20/month (more bandwidth)
- **MongoDB Atlas**: $9/month (dedicated cluster)

---

## Support Links

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://www.mongodb.com/docs/atlas

---

**You're all set! Your app is ready to deploy for FREE! 🚀**

Just follow the steps above and you'll have a live production app in 15 minutes!
