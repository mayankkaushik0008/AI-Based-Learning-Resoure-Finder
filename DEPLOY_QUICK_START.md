# ⚡ Deploy to Render - Quick Start (5 Steps)

## 🎯 Deploy Your App in 20 Minutes

### **Step 1: Push to GitHub (5 min)**

```cmd
git init
git add .
git commit -m "Deploy LearnWise AI"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/learnwise-ai.git
git push -u origin main
```

---

### **Step 2: Create Render Account (2 min)**

1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render

---

### **Step 3: Create Database (3 min)**

1. In Render: **New +** → **PostgreSQL**
2. Name: `learnwise-postgres`
3. Plan: **Free**
4. Click **Create Database**
5. **Copy the Internal Database URL**

---

### **Step 4: Deploy Backend (5 min)**

1. **New +** → **Web Service**
2. Select your repo: `learnwise-ai`
3. Configure:
   - Name: `learnwise-backend`
   - Build Command: `cd server && npm install && npx prisma generate && npx prisma migrate deploy`
   - Start Command: `cd server && npm start`
   - Add Environment Variables:
     - `DATABASE_URL`: Paste Internal URL from Step 3
     - `NODE_ENV`: `production`
     - `JWT_SECRET`: `your-secret-key-12345`
     - `DEMO_MODE`: `true`
4. Click **Create Web Service**
5. **Copy backend URL** (e.g., `https://learnwise-backend.onrender.com`)

---

### **Step 5: Deploy Frontend (5 min)**

1. **New +** → **Static Site**
2. Select your repo: `learnwise-ai`
3. Configure:
   - Name: `learnwise-frontend`
   - Build Command: `cd client && npm install && npm run build`
   - Publish Directory: `client/dist`
   - Add Environment Variable:
     - `VITE_API_URL`: Paste backend URL from Step 4
4. Click **Create Static Site**
5. **Your app is live!** 🎉

---

### **Step 6: Seed Database (2 min)**

1. Go to backend service → **Shell** tab
2. Run:
   ```bash
   cd server
   npx tsx prisma/seed.ts
   ```

---

## ✅ Done!

Your app is now live at: `https://learnwise-frontend.onrender.com`

Login: **demo@learnwise.ai** / **demo123**

---

## 🎓 For Panel Presentation

**Say this:**
> "I've deployed this application to Render cloud platform with PostgreSQL database, demonstrating full-stack deployment capabilities. The live version is accessible at [your-url]."

**Shows:**
- ✅ Cloud deployment skills
- ✅ DevOps knowledge
- ✅ Production-ready thinking

---

**Full Guide:** See DEPLOY_TO_RENDER.md for detailed instructions and troubleshooting.
