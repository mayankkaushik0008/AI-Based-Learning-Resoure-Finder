# 📋 Render Deployment - Quick Checklist

Print this and check off as you go!

---

## ✅ Step 1: Render Account (2 min)
- [ ] Go to https://render.com
- [ ] Sign up with GitHub
- [ ] Authorize access

---

## ✅ Step 2: PostgreSQL Database (3 min)
- [ ] Click "New +" → PostgreSQL
- [ ] Name: `learnwise-postgres`
- [ ] Database: `learnwise_ai`
- [ ] Plan: Free
- [ ] Create Database
- [ ] **COPY Internal Database URL**

---

## ✅ Step 3: Backend Service (5 min)
- [ ] Click "New +" → Web Service
- [ ] Select your GitHub repo
- [ ] Name: `learnwise-backend`
- [ ] Build: `cd server && npm install && npx prisma generate && npx prisma migrate deploy`
- [ ] Start: `cd server && npm start`
- [ ] Plan: Free
- [ ] Add Environment Variables:
  - [ ] DATABASE_URL (paste Internal URL)
  - [ ] NODE_ENV = production
  - [ ] PORT = 10000
  - [ ] JWT_SECRET = learnwise-secret-jwt-key-12345
  - [ ] JWT_EXPIRES_IN = 7d
  - [ ] DEMO_MODE = true
  - [ ] CLIENT_URL = (leave blank for now)
  - [ ] Other keys = demo-key
- [ ] Create Web Service
- [ ] Wait for "Live" status
- [ ] **COPY Backend URL**

---

## ✅ Step 4: Frontend Site (5 min)
- [ ] Click "New +" → Static Site
- [ ] Select your GitHub repo
- [ ] Name: `learnwise-frontend`
- [ ] Build: `cd client && npm install && npm run build`
- [ ] Publish: `client/dist`
- [ ] Add Environment Variable:
  - [ ] VITE_API_URL = (paste Backend URL)
- [ ] Create Static Site
- [ ] Wait for "Live" status
- [ ] **COPY Frontend URL**

---

## ✅ Step 5: Update Backend (2 min)
- [ ] Go to Backend service
- [ ] Click "Environment"
- [ ] Edit CLIENT_URL
- [ ] Paste Frontend URL
- [ ] Save Changes
- [ ] Wait for redeploy

---

## ✅ Step 6: Seed Database (3 min)
- [ ] Go to Backend service
- [ ] Click "Shell" tab
- [ ] Run: `cd server`
- [ ] Run: `npx tsx prisma/seed.ts`
- [ ] See: "Database seed completed!"

---

## ✅ Step 7: Test (2 min)
- [ ] Open Frontend URL
- [ ] See landing page
- [ ] Click Login
- [ ] Email: demo@learnwise.ai
- [ ] Password: demo123
- [ ] See dashboard
- [ ] Test creating project
- [ ] Test search

---

## 🎉 SUCCESS!

**Your live URL:**
```
https://learnwise-frontend.onrender.com
```

**Share this URL with anyone!**

---

## ⚠️ Remember:
- Free tier spins down after 15 min
- First request takes 30-60 sec
- Access 2-3 min before panel demo

---

## 🐛 Quick Troubleshooting:

**White screen?**
- Check VITE_API_URL is set
- Check backend is running

**Can't login?**
- Database seeded? (Step 6)
- Check backend logs

**CORS error?**
- CLIENT_URL matches frontend URL?
- Includes https://?

---

**Full Guide:** RENDER_DEPLOY_NOW.md
