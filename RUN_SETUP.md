# 🚀 How to Run the Setup (You're Almost There!)

## You're in the right place! Just need the right command.

### **OPTION 1: In PowerShell (where you are now)**

Type this exact command:
```powershell
.\setup-complete.bat
```

Press **Enter**

---

### **OPTION 2: Switch to Command Prompt (Easier)**

In your PowerShell window, type:
```powershell
cmd
```

Press **Enter**

Then type:
```cmd
setup-complete.bat
```

Press **Enter**

---

### **OPTION 3: Manual Step-by-Step (Most Reliable)**

Since the automated script has issues, let's do it manually. Copy and paste each command:

#### Step 1: Start Docker PostgreSQL
```powershell
docker compose up -d
```

Wait 10 seconds for database to start.

#### Step 2: Install dependencies
```powershell
npm install
```

#### Step 3: Setup server
```powershell
cd server
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
cd ..
```

#### Step 4: Setup client
```powershell
cd client
npm install
cd ..
```

#### Step 5: Start the app
```powershell
npm run dev
```

---

## 🎯 What Each Command Does

| Command | What It Does |
|---------|--------------|
| `docker compose up -d` | Starts PostgreSQL database in Docker |
| `npm install` | Installs project dependencies |
| `npm run prisma:generate` | Creates database client code |
| `npm run prisma:migrate` | Sets up database tables |
| `npm run prisma:seed` | Adds demo data (users, projects) |
| `npm run dev` | Starts both frontend and backend |

---

## ✅ After Running Commands

You should see:
```
[server] Server running on http://localhost:5000
[client] Local: http://localhost:5173/
```

Then:
1. Open browser: **http://localhost:5173**
2. Login: **demo@learnwise.ai** / **demo123**

---

## 🆘 If Any Command Fails

### "docker compose: command not found"
→ Docker Desktop is not running. Open Docker Desktop app first.

### "npm: command not found"  
→ Close PowerShell, reopen it, try again.

### "Port already in use"
→ Run: `taskkill /F /IM node.exe`

### Database errors
→ Make sure Docker Desktop shows PostgreSQL running

---

**Choose Option 2 (cmd) or Option 3 (manual steps) - both work great!**
