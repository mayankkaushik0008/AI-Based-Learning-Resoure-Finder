# 🚀 Deploy LearnWise AI to Render - Complete Guide

## 📋 Prerequisites

1. **GitHub Account** - To push your code
2. **Render Account** - Sign up at https://render.com (free)
3. **Your code working locally** - Make sure `npm run dev` works

---

## 🎯 Deployment Steps

### **Step 1: Push Your Code to GitHub**

#### A. Create a GitHub Repository

1. Go to https://github.com/new
2. Name: `learnwise-ai` or any name you like
3. Keep it **Public** (easier for Render free tier)
4. Don't initialize with README (we already have code)
5. Click **Create repository**

#### B. Initialize Git and Push

Open Command Prompt in your project folder and run:

```cmd
git init
git add .
git commit -m "Initial commit - LearnWise AI"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/learnwise-ai.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

**If you get errors about GitHub authentication:**
- Use GitHub Desktop app instead, OR
- Generate a personal access token at https://github.com/settings/tokens

---

### **Step 2: Sign Up for Render**

1. Go to https://render.com
2. Click **Get Started**
3. Sign up with GitHub (easiest option)
4. Authorize Render to access your repositories

---

### **Step 3: Create PostgreSQL Database**

1. In Render Dashboard, click **New +**
2. Select **PostgreSQL**
3. Configure:
   - **Name:** `learnwise-postgres`
   - **Database:** `learnwise_ai`
   - **User:** `learnwise_user`
   - **Region:** Choose closest to you (e.g., Oregon)
   - **Plan:** **Free** (0.1 GB, good for demo)
4. Click **Create Database**
5. Wait 2-3 minutes for it to provision
6. **Copy the Internal Database URL** (you'll need this)

---

### **Step 4: Deploy Backend (Node.js API)**

1. Click **New +** → **Web Service**
2. Connect your GitHub repository: `learnwise-ai`
3. Configure:

**Basic Settings:**
- **Name:** `learnwise-backend`
- **Region:** Same as database (e.g., Oregon)
- **Branch:** `main`
- **Root Directory:** Leave empty
- **Environment:** `Node`
- **Build Command:**
  ```bash
  cd server && npm install && npx prisma generate && npx prisma migrate deploy
  ```
- **Start Command:**
  ```bash
  cd server && npm start
  ```
- **Plan:** **Free**

**Environment Variables:** Click **Add Environment Variable** for each:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Paste the Internal Database URL from Step 3 |
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `JWT_SECRET` | Generate random string: `your-super-secret-jwt-key-change-this-12345` |
| `JWT_EXPIRES_IN` | `7d` |
| `DEMO_MODE` | `true` |
| `CLIENT_URL` | Leave blank for now (we'll add after frontend) |
| `OPENAI_API_KEY` | `demo-key` (optional, demo mode works without) |
| `YOUTUBE_API_KEY` | `demo-key` (optional) |
| `GITHUB_TOKEN` | `demo-token` (optional) |

4. Click **Create Web Service**
5. Wait 5-10 minutes for build and deployment
6. Once deployed, **copy the backend URL** (e.g., `https://learnwise-backend.onrender.com`)

---

### **Step 5: Deploy Frontend (React App)**

1. Click **New +** → **Static Site**
2. Connect your GitHub repository: `learnwise-ai`
3. Configure:

**Basic Settings:**
- **Name:** `learnwise-frontend`
- **Branch:** `main`
- **Root Directory:** Leave empty
- **Build Command:**
  ```bash
  cd client && npm install && npm run build
  ```
- **Publish Directory:**
  ```bash
  client/dist
  ```

**Environment Variables:**

| Key | Value |
|-----|-------|
| `VITE_API_URL` | Your backend URL from Step 4 (e.g., `https://learnwise-backend.onrender.com`) |

4. Click **Create Static Site**
5. Wait 5-10 minutes for build and deployment

---

### **Step 6: Update Backend with Frontend URL**

1. Go back to your **Backend service** in Render
2. Click **Environment** in left sidebar
3. Find `CLIENT_URL` variable
4. Update value to your frontend URL (e.g., `https://learnwise-frontend.onrender.com`)
5. Click **Save Changes**
6. Backend will automatically redeploy

---

### **Step 7: Seed Database with Demo Data**

Since the database is empty, you need to seed it:

**Option A: Using Render Shell (Recommended)**

1. Go to your **Backend service** in Render
2. Click **Shell** tab at the top
3. Run these commands:
   ```bash
   cd server
   npx prisma migrate deploy
   npx tsx prisma/seed.ts
   ```

**Option B: From Your Local Machine**

1. Copy the **External Database URL** from your PostgreSQL service
2. In your local `.env` file, temporarily update `DATABASE_URL`
3. Run locally:
   ```cmd
   cd server
   npm run prisma:seed
   ```
4. Revert the `.env` change

---

### **Step 8: Test Your Deployed App!**

1. Open your frontend URL: `https://learnwise-frontend.onrender.com`
2. You should see the LearnWise AI landing page
3. Click **Login**
4. Use credentials: **demo@learnwise.ai** / **demo123**
5. Test features:
   - Create a project
   - Search for resources (demo mode)
   - Generate learning path
   - Try AI assistant

---

## 🎯 Your Live URLs

After deployment, you'll have:

- **Frontend (Public URL):** `https://learnwise-frontend.onrender.com`
- **Backend API:** `https://learnwise-backend.onrender.com`
- **Database:** Internal (not public)

**Share the frontend URL** - that's your live demo!

---

## ⚙️ Important Configuration Changes

### Update Client API Configuration

Before deploying, update the API URL in your frontend:

**File:** `client/src/services/api.ts`

Change:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

This reads from environment variable in production.

### Update Server CORS

Your server already has CORS configured, but verify:

**File:** `server/src/server.ts`

Should have:
```typescript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
```

---

## 🐛 Troubleshooting

### Build Fails on Render

**Check build logs:**
1. Go to your service in Render
2. Click **Logs** tab
3. Look for errors

**Common issues:**
- Missing dependencies → Make sure `package.json` is correct
- Prisma errors → Check DATABASE_URL is set
- Build timeout → Render free tier has 15min limit

### Frontend Shows White Screen

1. Check browser console for errors
2. Verify `VITE_API_URL` is set correctly
3. Check backend is running and accessible

### Database Connection Errors

1. Verify DATABASE_URL is correct
2. Check database is running in Render dashboard
3. Make sure you used **Internal Database URL** for backend

### "Cannot GET /api/..."

1. Check backend is deployed and running
2. Verify frontend's `VITE_API_URL` points to backend
3. Check CORS settings in backend

### Free Tier Limitations

**Render Free Tier:**
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Database limited to 0.1 GB (enough for demo)
- 750 hours/month (one service can run continuously)

**Solution for panel demo:**
- Access your site 2-3 minutes before presenting
- Keep the tab open to prevent spin-down

---

## 🔒 Security Notes

### For Production (After Panel):

1. **Change JWT_SECRET** to a strong random string
2. **Add real API keys** if you want live AI features:
   - OpenAI API key
   - YouTube Data API key
   - GitHub token
3. **Set DEMO_MODE=false** for real API calls
4. **Use PostgreSQL paid plan** for persistent data (free tier gets deleted after 90 days)

### Environment Variables Security:

✅ Never commit `.env` files to GitHub  
✅ Use Render's environment variables (encrypted)  
✅ Rotate secrets regularly in production  

---

## 💰 Cost Breakdown

**Render Free Tier (What you're using):**
- PostgreSQL: Free (0.1 GB, 90 day limit)
- Backend Web Service: Free (750 hours/month)
- Frontend Static Site: Free (100 GB bandwidth/month)

**Total Cost: $0/month** ✅

**Paid Tier (If you want to upgrade later):**
- PostgreSQL Starter: $7/month (1 GB, persistent)
- Web Service Starter: $7/month (0.5 GB RAM, no spin-down)

---

## 📊 Deployment Checklist

Before deploying:
- [ ] Code working locally (`npm run dev`)
- [ ] All files committed
- [ ] Pushed to GitHub
- [ ] `.gitignore` includes `.env`, `node_modules`, `dist`

During deployment:
- [ ] PostgreSQL database created
- [ ] Backend deployed with environment variables
- [ ] Frontend deployed with VITE_API_URL
- [ ] Backend updated with CLIENT_URL
- [ ] Database seeded with demo data

After deployment:
- [ ] Frontend loads correctly
- [ ] Can login with demo credentials
- [ ] Can create projects
- [ ] Search works (demo mode)
- [ ] All features functional

---

## 🎓 For Your Panel Presentation

**Option 1: Use Live Deployed Version**
- Share the Render URL: `https://learnwise-frontend.onrender.com`
- Panel members can access it directly
- No localhost setup needed
- Professional deployment shows extra skill

**Option 2: Use Local Version**
- More reliable (no internet dependency)
- Faster (no spin-down delay)
- Full control

**Best Approach: Have Both!**
- Demo the local version (primary)
- Mention the deployed version (backup/bonus)
- Share the live URL for panel to try later

**What to Say:**
> "I've deployed this application to Render using Docker and PostgreSQL. The live version is accessible at [your-url]. For this demo, I'll use the local version for better performance, but you can access the production deployment anytime."

**This shows:**
✅ Full-stack deployment skills  
✅ Cloud platform knowledge  
✅ Production-ready thinking  
✅ DevOps awareness  

---

## 🚀 Quick Commands Reference

```bash
# Push to GitHub
git add .
git commit -m "Prepare for Render deployment"
git push

# Seed database (in Render Shell)
cd server
npx prisma migrate deploy
npx tsx prisma/seed.ts

# Check backend health
curl https://your-backend-url.onrender.com/api/health

# View logs
# Go to Render Dashboard → Your Service → Logs tab
```

---

## 📞 Need Help?

**Render Documentation:** https://render.com/docs  
**Render Community:** https://community.render.com  
**PostgreSQL Docs:** https://render.com/docs/databases  

---

<div align="center">

## 🌟 Ready to Deploy!

**Follow the steps above and your app will be live in 20-30 minutes.**

**Your deployed app will be accessible worldwide at:**
`https://learnwise-frontend.onrender.com`

### Good luck with deployment and your panel presentation! 🎉

</div>
