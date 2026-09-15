# 🚀 Deploy to Render RIGHT NOW - Step by Step

You have your GitHub repo ready! Let's deploy in the next 20 minutes.

---

## 📋 **Step 1: Sign Up for Render (2 minutes)**

1. Go to: **https://render.com**
2. Click **"Get Started for Free"** or **"Sign Up"**
3. Choose **"Sign in with GitHub"** (easiest option)
4. Authorize Render to access your repositories
5. You'll be redirected to Render Dashboard

✅ **Done? Continue to Step 2**

---

## 🗄️ **Step 2: Create PostgreSQL Database (3 minutes)**

1. In Render Dashboard, click **"New +"** button (top right)
2. Select **"PostgreSQL"**
3. Fill in the form:
   - **Name:** `learnwise-postgres`
   - **Database:** `learnwise_ai`
   - **User:** `learnwise_user`
   - **Region:** Choose closest to you (e.g., Oregon, Frankfurt, Singapore)
   - **PostgreSQL Version:** 15 (default)
   - **Plan:** Select **"Free"** ($0/month)
4. Click **"Create Database"**
5. Wait 2-3 minutes while it provisions

### **Important: Copy Database URLs**

Once created, you'll see two connection strings:

- **Internal Database URL** (starts with `postgresql://...`)
- **External Database URL** (starts with `postgresql://...`)

**COPY THE INTERNAL DATABASE URL** - You'll need it in Step 3!

It looks like:
```
postgresql://learnwise_user:password@dpg-xxxxx/learnwise_ai
```

✅ **Database created? Continue to Step 3**

---

## 🖥️ **Step 3: Deploy Backend (5 minutes)**

1. Click **"New +"** → **"Web Service"**
2. You'll see "Create a new Web Service"
3. Click **"Connect a repository"** or find your repo in the list
4. Select your GitHub repository: **`learnwise-ai`** (or whatever you named it)
5. Fill in the configuration:

### **Basic Settings:**
- **Name:** `learnwise-backend`
- **Region:** **Same as database** (important!)
- **Branch:** `main`
- **Root Directory:** Leave **EMPTY** (blank)
- **Runtime:** Select **"Node"**

### **Build & Start Commands:**

**Build Command:**
```bash
cd server && npm install && npx prisma generate && npx prisma migrate deploy
```

**Start Command:**
```bash
cd server && npm start
```

### **Instance Type:**
- Select **"Free"** ($0/month)

### **Environment Variables:**

Click **"Add Environment Variable"** button and add these ONE BY ONE:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | **Paste the Internal Database URL you copied in Step 2** |
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `JWT_SECRET` | `learnwise-secret-jwt-key-production-12345-change-this` |
| `JWT_EXPIRES_IN` | `7d` |
| `DEMO_MODE` | `true` |
| `CLIENT_URL` | `https://YOUR-FRONTEND-URL.onrender.com` *(we'll update this in Step 5)* |
| `OPENAI_API_KEY` | `demo-key` |
| `OPENAI_MODEL` | `gpt-4o-mini` |
| `YOUTUBE_API_KEY` | `demo-key` |
| `GITHUB_TOKEN` | `demo-token` |
| `OPENALEX_EMAIL` | `demo@example.com` |

6. Click **"Create Web Service"**
7. Render will start building (takes 5-10 minutes)
8. Watch the logs - you'll see npm install, Prisma generate, etc.
9. Once deployed, you'll see **"Your service is live"**

### **Copy Your Backend URL:**

At the top of the page, you'll see your backend URL:
```
https://learnwise-backend.onrender.com
```

**COPY THIS URL** - You need it for Step 4!

✅ **Backend deployed? Continue to Step 4**

---

## 🎨 **Step 4: Deploy Frontend (5 minutes)**

1. Click **"New +"** → **"Static Site"**
2. Select your repository: **`learnwise-ai`**
3. Fill in the configuration:

### **Basic Settings:**
- **Name:** `learnwise-frontend`
- **Branch:** `main`
- **Root Directory:** Leave **EMPTY**

### **Build Settings:**

**Build Command:**
```bash
cd client && npm install && npm run build
```

**Publish Directory:**
```bash
client/dist
```

### **Environment Variables:**

Click **"Add Environment Variable"**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | **Paste your backend URL from Step 3** (e.g., `https://learnwise-backend.onrender.com`) |

4. Click **"Create Static Site"**
5. Wait 5-10 minutes for build and deployment
6. Once deployed, you'll see **"Your site is live"**

### **Copy Your Frontend URL:**

You'll see your frontend URL:
```
https://learnwise-frontend.onrender.com
```

**THIS IS YOUR LIVE APP URL!** 🎉

✅ **Frontend deployed? Continue to Step 5**

---

## 🔄 **Step 5: Update Backend with Frontend URL (2 minutes)**

Now that you have the frontend URL, update the backend:

1. Go to your **Backend service** (`learnwise-backend`)
2. Click **"Environment"** in the left sidebar
3. Find the `CLIENT_URL` variable
4. Click **"Edit"** (pencil icon)
5. Update value to your frontend URL: `https://learnwise-frontend.onrender.com`
6. Click **"Save Changes"**
7. Backend will automatically redeploy (takes 2-3 minutes)

✅ **Backend updated? Continue to Step 6**

---

## 🌱 **Step 6: Seed Database (3 minutes)**

Your database is empty! Let's add demo data.

### **Option A: Using Render Shell (Easiest)**

1. Go to your **Backend service** (`learnwise-backend`)
2. At the top menu, click **"Shell"** tab
3. Wait for shell to connect
4. Type these commands one by one:

```bash
cd server
```

```bash
npx tsx prisma/seed.ts
```

5. You should see:
```
✓ Users created: { demo: 'demo@learnwise.ai', admin: 'admin@learnwise.ai' }
✓ Projects created: AI Chatbot, E-commerce Platform
✓ Database seed completed!
```

### **Option B: From Local Machine**

If shell doesn't work, do this from your computer:

1. Open your **PostgreSQL service** in Render
2. Copy the **External Database URL**
3. On your computer, open Command Prompt
4. Navigate to your project:
```cmd
cd "C:\Users\mayan\OneDrive\Desktop\AI-Based Learning Resoure Finder\server"
```
5. Create temporary `.env` file with the external URL:
```cmd
echo DATABASE_URL="paste-external-url-here" > .env.temp
```
6. Run seed:
```cmd
npx dotenv -e .env.temp tsx prisma/seed.ts
```
7. Delete temp file:
```cmd
del .env.temp
```

✅ **Database seeded? Continue to Step 7**

---

## 🎉 **Step 7: Test Your Live App!**

1. Open your frontend URL in browser: `https://learnwise-frontend.onrender.com`
2. You should see the **LearnWise AI landing page**
3. Click **"Login"** or **"Get Started"**
4. Enter credentials:
   - **Email:** `demo@learnwise.ai`
   - **Password:** `demo123`
5. You should be logged in and see the dashboard! 🎉

### **Test These Features:**
- ✅ Dashboard loads
- ✅ Create a new project
- ✅ Search for resources (demo mode results)
- ✅ Generate learning path
- ✅ Try AI assistant
- ✅ Save resources

---

## 📊 **Your Live URLs:**

🌐 **Frontend (Share this!):** `https://learnwise-frontend.onrender.com`  
🔧 **Backend API:** `https://learnwise-backend.onrender.com`  
🗄️ **Database:** Internal (not public)

---

## ⚠️ **Important Notes**

### **Free Tier Limitations:**
- Services **spin down** after 15 minutes of inactivity
- First request after spin-down takes **30-60 seconds** to wake up
- Database limited to **0.1 GB** (enough for demo)
- Database **deleted after 90 days** on free tier

### **For Panel Demo:**
- Access your site **2-3 minutes before** presenting
- Keep the browser tab open to prevent spin-down
- Alternatively, use local version for demo (more reliable)

### **If Site is Slow:**
- This is normal for free tier!
- Services need to "wake up" on first request
- Consider upgrading to paid tier ($7/month per service) for instant response

---

## 🐛 **Troubleshooting**

### **Issue: Build Fails**

**Check logs:**
1. Go to your service in Render
2. Click **"Logs"** or **"Events"** tab
3. Look for red error messages

**Common fixes:**
- Check build commands are correct
- Verify `package.json` exists in server/client folders
- Ensure all dependencies are listed

### **Issue: Frontend Shows White Screen**

1. Open browser console (F12)
2. Check for errors
3. Verify `VITE_API_URL` is set in frontend environment
4. Check backend is running (visit backend URL + `/api/health`)

### **Issue: "Cannot connect to database"**

1. Verify `DATABASE_URL` is set in backend
2. Check you used **Internal** Database URL (not External)
3. Ensure backend and database are in same region

### **Issue: Login doesn't work**

1. Make sure you seeded the database (Step 6)
2. Check backend logs for errors
3. Verify CORS settings (CLIENT_URL should match frontend)

### **Issue: CORS Errors**

1. Check `CLIENT_URL` in backend matches frontend URL exactly
2. Include `https://` in the URL
3. No trailing slash at the end
4. Save and wait for backend to redeploy

---

## 🎓 **For Your Panel Presentation**

### **What to Say:**

> "I've deployed this application to Render, a modern cloud platform. The architecture consists of three services: a PostgreSQL database, a Node.js backend API, and a React frontend, all running in production. The live application is accessible at [your-frontend-url] and demonstrates full-stack deployment capabilities including database migrations, environment configuration, and cloud hosting."

### **Show This:**
1. Open live URL during presentation (as backup)
2. Mention automatic deployments on git push
3. Discuss architecture (database → backend → frontend)
4. Explain free tier vs. paid tier trade-offs

### **Impresses Panel:**
✅ Cloud deployment skills  
✅ DevOps knowledge  
✅ Production thinking  
✅ Full-stack capabilities  
✅ Modern tech stack  

---

## 🔄 **Future Updates**

### **How to Update Your Deployed App:**

1. Make changes to your code locally
2. Commit and push to GitHub:
```bash
git add .
git commit -m "Update: description of changes"
git push
```
3. Render **automatically redeploys** both frontend and backend!
4. Wait 5-10 minutes for new version to be live

---

## 💰 **Cost Breakdown**

**Current Setup (Free Tier):**
- PostgreSQL: $0/month (0.1 GB, 90 days)
- Backend: $0/month (750 hours, spins down after 15 min)
- Frontend: $0/month (100 GB bandwidth)
- **Total: $0/month** ✅

**If You Upgrade Later:**
- PostgreSQL Starter: $7/month (1 GB, persistent)
- Backend Starter: $7/month (0.5 GB RAM, always on)
- Frontend: Still free
- **Total: $14/month** (for always-on, production use)

---

## ✅ **Deployment Checklist**

Mark these as you complete:

**Step 1: Prepare**
- [ ] GitHub repo created and pushed
- [ ] Render account created
- [ ] Logged in to Render Dashboard

**Step 2: Database**
- [ ] PostgreSQL created
- [ ] Internal Database URL copied

**Step 3: Backend**
- [ ] Backend service created
- [ ] All environment variables added
- [ ] Build successful (check logs)
- [ ] Service is "Live"
- [ ] Backend URL copied

**Step 4: Frontend**
- [ ] Static site created
- [ ] VITE_API_URL set to backend URL
- [ ] Build successful
- [ ] Site is "Live"
- [ ] Frontend URL copied

**Step 5: Update**
- [ ] Backend CLIENT_URL updated with frontend URL
- [ ] Backend redeployed successfully

**Step 6: Seed**
- [ ] Database seeded with demo data
- [ ] Demo users created

**Step 7: Test**
- [ ] Frontend loads correctly
- [ ] Can login with demo@learnwise.ai / demo123
- [ ] Dashboard displays
- [ ] Can create projects
- [ ] Search works
- [ ] All features functional

---

<div align="center">

## 🎉 **CONGRATULATIONS!**

**Your app is now LIVE on the internet!**

### Share your URL:
`https://learnwise-frontend.onrender.com`

**Anyone can access it from anywhere in the world!** 🌍

### You've successfully deployed a full-stack AI application! 🚀

</div>

---

**Need more help?** Check:
- **DEPLOY_TO_RENDER.md** - Detailed guide with explanations
- **RENDER_DEPLOYMENT_SUMMARY.md** - Overview and tips
- Render Docs: https://render.com/docs
