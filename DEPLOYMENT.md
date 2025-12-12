# Deployment Guide - Vercel & Render

This guide will help you deploy the Sports Facility Booking Platform to production.

## 📦 Deployment Overview

- **Frontend**: Vercel (React SPA)
- **Backend**: Render (Node.js API)
- **Database**: MongoDB Atlas (already configured)

---

## 🚀 Part 1: Deploy Backend to Render

### Step 1: Prepare Backend for Deployment

The backend is already configured for deployment. Make sure you have:
- ✅ `.env` file with MongoDB connection string
- ✅ All dependencies in `package.json`
- ✅ `server.js` as the entry point

### Step 2: Create Render Account

1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub (recommended) or email
3. Verify your email

### Step 3: Deploy Backend

1. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository (or use "Public Git repository")
   - If using public repo, paste: `https://github.com/YOUR_USERNAME/YOUR_REPO`

2. **Configure Service**
   - **Name**: `sports-facility-backend` (or any name)
   - **Region**: Choose closest to you
   - **Branch**: `main` or `master`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

3. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable":
   
   ```
   MONGODB_URI = your_mongodb_connection_string
   PORT = 5000
   NODE_ENV = production
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait 2-5 minutes for deployment
   - Copy your backend URL: `https://your-app-name.onrender.com`

### Step 4: Test Backend

Visit: `https://your-app-name.onrender.com/`

You should see:
```json
{
  "message": "Sports Facility Booking API",
  "status": "Running",
  "version": "1.0.0"
}
```

---

## 🌐 Part 2: Deploy Frontend to Vercel

### Step 1: Update Frontend API URL

1. Open `frontend/.env.production`
2. Update with your Render backend URL:
   ```
   REACT_APP_API_URL=https://your-backend-app.onrender.com/api
   ```

### Step 2: Create Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended)
3. Authorize Vercel to access your repositories

### Step 3: Deploy Frontend

**Option A: Using Vercel Dashboard (Recommended)**

1. Click "Add New..." → "Project"
2. Import your Git repository
3. Configure project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)
   
4. **Add Environment Variable**:
   - Key: `REACT_APP_API_URL`
   - Value: `https://your-backend-app.onrender.com/api`

5. Click "Deploy"
6. Wait 2-3 minutes
7. Your app will be live at: `https://your-app-name.vercel.app`

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? sports-facility-frontend
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

### Step 4: Configure Custom Domain (Optional)

1. Go to your project in Vercel
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

---

## 🔧 Post-Deployment Configuration

### Update CORS in Backend

After deploying frontend, update `backend/server.js`:

```javascript
// Update CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app-name.vercel.app'
  ],
  credentials: true
}));
```

Redeploy backend on Render (it will auto-deploy if connected to Git).

### Seed Database (One-time)

If you haven't seeded the database yet:

1. In Render dashboard, go to your web service
2. Click "Shell" tab
3. Run: `node seedData.js`

Or run locally with production MongoDB:
```bash
cd backend
node seedData.js
```

---

## ✅ Verification Checklist

- [ ] Backend deployed to Render
- [ ] Backend health check returns JSON
- [ ] MongoDB connection working
- [ ] Database seeded with sample data
- [ ] Frontend deployed to Vercel
- [ ] Frontend can connect to backend API
- [ ] CORS configured correctly
- [ ] Environment variables set in both platforms
- [ ] Test booking flow end-to-end

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: "Application failed to respond"
- Check Render logs: Dashboard → Logs
- Verify MongoDB connection string
- Ensure PORT is set to 5000

**Problem**: "CORS error"
- Add frontend URL to CORS whitelist
- Redeploy backend

### Frontend Issues

**Problem**: "Failed to fetch"
- Check `REACT_APP_API_URL` in Vercel environment variables
- Verify backend is running
- Check browser console for exact error

**Problem**: "404 on refresh"
- Vercel should handle this automatically with `vercel.json`
- Verify `vercel.json` is in frontend root

### Database Issues

**Problem**: "Authentication failed"
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)
- Verify database user credentials
- Check connection string format

---

## 📊 Monitoring

### Render
- View logs: Dashboard → Your Service → Logs
- Monitor metrics: Dashboard → Metrics
- Set up alerts: Dashboard → Settings → Alerts

### Vercel
- View deployments: Dashboard → Your Project → Deployments
- Check analytics: Dashboard → Analytics
- Monitor performance: Dashboard → Speed Insights

---

## 🔄 Continuous Deployment

Both Render and Vercel support automatic deployments:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Auto-Deploy**
   - Render: Watches `backend/` folder
   - Vercel: Watches `frontend/` folder
   - Both deploy automatically on push

---

## 💰 Cost Considerations

### Free Tier Limits

**Render Free Tier**:
- ✅ 750 hours/month
- ⚠️ Spins down after 15 min inactivity (cold starts)
- ✅ Unlimited bandwidth

**Vercel Free Tier**:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Always on (no cold starts)

**MongoDB Atlas Free Tier**:
- ✅ 512 MB storage
- ✅ Shared cluster
- ✅ Sufficient for demo/testing

### Upgrade Options

If you need better performance:
- **Render**: $7/month (no cold starts)
- **Vercel**: $20/month (team features)
- **MongoDB**: $9/month (dedicated cluster)

---

## 🎉 Success!

Your application is now live:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-api.onrender.com`

Share the frontend URL with anyone to use your booking platform! 🚀
