# 🚀 Quick Demo Start Guide

## For Panel Presentation - Start in 5 Minutes

### Step 1: Open PowerShell/Terminal

```powershell
# Navigate to project folder
cd "AI-Based Learning Resoure Finder"
```

### Step 2: First Time Setup (One-time only)

```powershell
# Install everything (this may take 3-5 minutes)
npm install

cd client
npm install

cd ../server
npm install

# Setup database
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

cd ..
```

### Step 3: Start Demo (Every time)

**Option A: One Command (Recommended)**
```powershell
# From project root
npm run dev
```

**Option B: Separate Terminals**

Terminal 1 (Backend):
```powershell
cd server
npm run dev
```

Terminal 2 (Frontend):
```powershell
cd client
npm run dev
```

### Step 4: Access Demo

🌐 **Open in browser:** http://localhost:5173

🔑 **Login credentials:**
- Email: `demo@learnwise.ai`
- Password: `demo123`

---

## ✅ Verify Demo is Ready

1. ✅ Frontend loads (pretty landing page)
2. ✅ Can login with demo credentials
3. ✅ Dashboard shows up
4. ✅ Can create a project
5. ✅ Can search resources
6. ✅ Everything looks good!

---

## 🎯 Quick Demo Flow (5 minutes)

1. **Show Landing Page** (30 sec)
   - Scroll through features

2. **Login** (10 sec)
   - Use: demo@learnwise.ai / demo123

3. **Dashboard** (20 sec)
   - Show statistics
   - Show existing projects

4. **Create New Project** (1 min)
   - Click "New Project"
   - Title: "AI Healthcare System"
   - Description: "ML system for disease diagnosis"
   - Add technologies: Python, TensorFlow, Flask
   - Skill: Intermediate
   - Save

5. **AI Resource Search** (2 min) ⭐
   - Go to "AI Resource Finder"
   - Select your project
   - Click "Find Resources with AI"
   - Show results with match scores
   - Click "Why AI recommends this"
   - Save a resource

6. **Learning Path** (1 min)
   - Go to "Learning Path"
   - Generate path
   - Show steps
   - Mark one complete

7. **AI Assistant** (30 sec)
   - Go to "AI Assistant"
   - Ask: "What should I learn first?"
   - Show response

---

## 🔥 Key Features to Highlight

1. **AI-Powered** - Real AI analysis
2. **Multi-Source** - YouTube + GitHub + Papers
3. **Smart Ranking** - 92% match scores
4. **Personalized** - Skill-level aware
5. **Complete** - 100+ features

---

## 🎤 What to Say

### Opening:
> "This is LearnWise AI - an intelligent platform that helps students find the perfect learning resources using artificial intelligence."

### During AI Search:
> "Watch as the AI analyzes my project, searches multiple sources, and ranks results by relevance, credibility, and how well they match my skill level and project stage."

### Closing:
> "This is a complete, production-ready full-stack application with real AI integration, demonstrating modern development practices and practical problem-solving."

---

## 🆘 If Something Goes Wrong

### Server won't start?
```powershell
# Kill any running processes
taskkill /F /IM node.exe
# Then restart
npm run dev
```

### Can't login?
- Try: admin@learnwise.ai / demo123
- Or check database is seeded

### No search results?
- This is normal in demo mode!
- Say: "With API keys, this fetches live data from YouTube, GitHub, and academic sources"

### Page won't load?
- Check both servers are running
- Try: http://localhost:5173
- Refresh browser (Ctrl+R)

---

## 💡 Pro Tips

1. **Test before panel** - Run through once completely
2. **Have two browsers** - One for user, one for admin
3. **Zoom browser** - Ctrl + Plus (+) for visibility
4. **Full screen** - F11 for clean view
5. **Close tabs** - Only demo tabs open
6. **Charge laptop** - 100% battery

---

## 📱 Backup Plan

If demo fails:
1. Show screenshots (from documentation)
2. Walk through code
3. Explain architecture
4. Show documentation quality

---

## ✨ You're Ready!

Everything is set up. Just:
1. Run `npm run dev`
2. Open http://localhost:5173
3. Login and show features
4. Be confident!

**Good luck! You've got this!** 🎉
