# 🚀 LearnWise AI - Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **PostgreSQL** 14 or higher ([Download](https://www.postgresql.org/download/))

## Step-by-Step Installation

### 1. Clone or Extract the Project

```bash
cd "AI-Based Learning Resoure Finder"
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

# Return to root
cd ..
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database - Replace with your PostgreSQL credentials
DATABASE_URL="postgresql://username:password@localhost:5432/learnwise_ai?schema=public"

# JWT Secret - Generate a secure random string
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=5000
NODE_ENV="development"
CLIENT_URL="http://localhost:5173"

# AI Service (Optional - Demo mode works without this)
OPENAI_API_KEY="your-openai-api-key-here"
OPENAI_MODEL="gpt-4o-mini"

# YouTube API (Optional - Demo mode works without this)
YOUTUBE_API_KEY="your-youtube-api-key-here"

# GitHub Token (Optional - Demo mode works without this)
GITHUB_TOKEN="your-github-token-here"

# Academic Resources (Optional)
OPENALEX_EMAIL="your-email@example.com"

# Demo Mode - Set to true to use mock data
DEMO_MODE="true"
```

**Important:** For initial testing, set `DEMO_MODE="true"` to use mock data without API keys.

### 4. Set Up Database

#### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE learnwise_ai;

# Exit
\q
```

#### Run Prisma Migrations

```bash
cd server

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with demo data
npm run prisma:seed
```

This will create:
- Demo user: `demo@learnwise.ai` / `demo123`
- Admin user: `admin@learnwise.ai` / `demo123`
- Sample projects

### 5. Start the Application

#### Option A: Run Both Servers Together (Recommended)

From the root directory:

```bash
npm run dev
```

This starts:
- **Backend** on http://localhost:5000
- **Frontend** on http://localhost:5173

#### Option B: Run Servers Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 6. Access the Application

Open your browser and navigate to:

**http://localhost:5173**

## Demo Credentials

Use these credentials to log in:

**Regular User:**
- Email: `demo@learnwise.ai`
- Password: `demo123`

**Admin User:**
- Email: `admin@learnwise.ai`
- Password: `demo123`

## Troubleshooting

### Port Already in Use

If port 5000 or 5173 is already in use, change them in:
- Server: `.env` (`PORT=5000`)
- Client: `client/vite.config.ts` (default: 5173)

### Database Connection Error

1. Verify PostgreSQL is running:
   ```bash
   # Windows
   pg_ctl status

   # Mac/Linux
   sudo service postgresql status
   ```

2. Check your `DATABASE_URL` in `.env`
3. Ensure the database `learnwise_ai` exists

### Prisma Errors

Reset the database if needed:

```bash
cd server
npx prisma migrate reset
npm run prisma:seed
```

### Missing Dependencies

If you encounter module errors:

```bash
# Re-install all dependencies
cd server
rm -rf node_modules package-lock.json
npm install

cd ../client
rm -rf node_modules package-lock.json
npm install
```

## Optional: Configure External APIs

### OpenAI API (For Full AI Features)

1. Get an API key from [OpenAI Platform](https://platform.openai.com/)
2. Add to `.env`: `OPENAI_API_KEY="sk-..."`
3. Set `DEMO_MODE="false"`

### YouTube Data API

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable YouTube Data API v3
3. Create credentials (API Key)
4. Add to `.env`: `YOUTUBE_API_KEY="..."`

### GitHub API

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token (classic)
3. Add to `.env`: `GITHUB_TOKEN="ghp_..."`

## Development Tools

### Prisma Studio (Database GUI)

View and edit database records:

```bash
cd server
npm run prisma:studio
```

Access at: http://localhost:5555

### Build for Production

```bash
# Build both client and server
npm run build

# Start production server
npm start
```

## Need Help?

- Check the main [README.md](./README.md) for full documentation
- Review error logs in the terminal
- Ensure all prerequisites are correctly installed

---

**🎉 You're all set! Start exploring LearnWise AI!**
