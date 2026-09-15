# 🎓 LearnWise AI - AI-Based Learning Resource Finder

**Intelligent platform that uses artificial intelligence to help students discover, rank, and organize high-quality learning resources tailored to their project needs.**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://learnwise-frontend.onrender.com)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Flearnwise-frontend.onrender.com)](https://learnwise-frontend.onrender.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📌 Overview

LearnWise AI is a full-stack web application that revolutionizes how students find learning resources. Instead of wasting hours searching through millions of irrelevant results, students get curated, AI-ranked resources matched to their skill level, project stage, and learning goals.

🌐 **[Try it live!](https://learnwise-frontend.onrender.com)**

### 🎯 Problem Solved

- **40%** of project time wasted searching for materials
- Information overload with millions of generic results
- Difficulty judging resource quality and credibility
- No personalization by skill level or project stage
- Disconnected learning experience

### 💡 Solution

LearnWise AI analyzes your project, searches multiple sources simultaneously (YouTube, GitHub, Academic papers), ranks resources using a sophisticated 6-factor algorithm, and provides personalized learning paths with AI assistance.

---

## ✨ Key Features

### 🤖 AI-Powered Features
- **Intelligent Project Analysis** - NLP-based understanding of project requirements
- **Multi-Source Search** - YouTube videos, GitHub repos, academic papers
- **Smart Ranking Algorithm** - 6-factor weighted scoring (relevance, credibility, difficulty, etc.)
- **AI-Generated Learning Paths** - Personalized step-by-step guides
- **AI Assistant Chatbot** - Context-aware learning guidance

### 📊 Core Functionality
- **User Authentication** - Secure JWT-based auth with bcrypt
- **Project Management** - Create and track multiple projects
- **Resource Discovery** - Search, filter, and sort by type/difficulty/date
- **Save & Organize** - Collections, notes, and ratings
- **Progress Tracking** - Learning path completion monitoring
- **Admin Dashboard** - Analytics, user management, system stats

---

## 🏗️ Technical Architecture

### Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- Zustand (state management)
- Axios (HTTP client)

**Backend:**
- Node.js 18+
- Express 4
- TypeScript
- Prisma ORM
- JWT Authentication
- Bcrypt password hashing

**Database:**
- PostgreSQL 15
- Prisma migrations
- Normalized schema

**External APIs:**
- OpenAI (AI analysis, chat)
- YouTube Data API v3
- GitHub API
- OpenAlex (academic papers)

### Architecture Diagram

```
┌─────────────────────────────────────────┐
│         React Frontend                  │
│   TypeScript + Tailwind + Zustand      │
└──────────────┬──────────────────────────┘
               │ REST API
┌──────────────▼──────────────────────────┐
│         Express Backend                 │
│   Controllers → Services → Database     │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
┌───────▼─────┐  ┌───▼─────────┐
│ PostgreSQL  │  │ External    │
│  Database   │  │ AI APIs     │
└─────────────┘  └─────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher (or Docker)
- npm or yarn

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/mayankkaushik0008/AI-Based-Learning-Resoure-Finder.git
cd AI-Based-Learning-Resoure-Finder
```

2. **Setup with Docker (Recommended)**
```bash
# Start PostgreSQL
docker compose up -d

# Install dependencies
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

3. **Configure Environment**
```bash
# Create .env file in server directory
cp .env.example server/.env

# Edit server/.env with your database credentials
```

4. **Setup Database**
```bash
cd server
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
cd ..
```

5. **Start Application**
```bash
npm run dev
```

6. **Access Application**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

**Demo Credentials:**
- Email: `demo@learnwise.ai`
- Password: `demo123`

---

## 📖 Documentation

- **[INSTALLATION.md](INSTALLATION.md)** - Detailed setup instructions
- **[FEATURES.md](FEATURES.md)** - Complete feature list
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide

---

## 🎯 Usage

### Creating a Project

1. Login to your account
2. Navigate to Projects page
3. Click "Create Project"
4. Fill in project details (title, description, tech stack, skill level)
5. Submit

### Finding Resources

1. Open a project
2. Click "Find Resources"
3. AI analyzes your project automatically
4. View ranked results with match scores and explanations
5. Filter by type, difficulty, or date
6. Save relevant resources

### Generating Learning Path

1. Open a project
2. Click "Generate Learning Path"
3. AI creates personalized step-by-step guide
4. Check off completed items
5. Track your progress

### Using AI Assistant

1. Navigate to AI Assistant page
2. Select a project for context
3. Ask questions about resources or concepts
4. Get context-aware guidance

---

## 🔒 Security Features

- JWT-based authentication
- Bcrypt password hashing (12 rounds)
- Protected API routes
- SQL injection prevention (Prisma ORM)
- XSS protection (React)
- CORS configuration
- Input validation
- Environment variable security

---

## 📊 Project Statistics

- **67+ files** created
- **15,000+ lines** of code
- **100+ features** implemented
- **30+ API endpoints**
- **10+ database models**
- **29 React components**
- **15+ pages**

---

## 🌐 Deployment

### Deployed on Render

- **Frontend:** Static site hosting
- **Backend:** Web service
- **Database:** PostgreSQL instance

**Live Demo:** [https://learnwise-frontend.onrender.com](https://learnwise-frontend.onrender.com)

> **Note:** Free tier services may take 30-60 seconds to wake up on first request after inactivity.

### Deploy Your Own

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to:
- Render
- Vercel
- Railway
- Heroku

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Mayank Kaushik**

- GitHub: [@mayankkaushik0008](https://github.com/mayankkaushik0008)
- Project: [AI-Based Learning Resource Finder](https://github.com/mayankkaushik0008/AI-Based-Learning-Resoure-Finder)

---

## 🙏 Acknowledgments

- OpenAI for GPT API
- YouTube Data API
- GitHub API
- OpenAlex for academic papers
- Render for hosting
- All open-source libraries used

---

## 📧 Contact & Support

For questions, issues, or suggestions:
- Open an issue on GitHub
- Contact: mayankkaushik0008@gmail.com

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ for students struggling with resource discovery

</div>
