# 🚀 LearnWise AI - Deployment Guide

This guide covers deploying LearnWise AI to various platforms.

## Prerequisites

Before deploying, ensure you have:
- ✅ All code committed to a Git repository
- ✅ PostgreSQL database ready (local or cloud)
- ✅ Environment variables configured
- ✅ API keys obtained (optional, demo mode works without them)

## Quick Deploy Options

### Option 1: Vercel (Frontend) + Railway (Backend) ⭐ Recommended

**Best for**: Quick deployment with minimal configuration

#### Deploy Backend to Railway

1. **Create Railway Account**: https://railway.app/
2. **Create New Project** → Deploy from GitHub
3. **Add PostgreSQL**: Click "New" → "Database" → "PostgreSQL"
4. **Configure Environment Variables**:
   ```
   DATABASE_URL (auto-configured by Railway)
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-url.vercel.app
   OPENAI_API_KEY=your-key (optional)
   YOUTUBE_API_KEY=your-key (optional)
   GITHUB_TOKEN=your-token (optional)
   DEMO_MODE=true
   ```
5. **Set Build Settings**:
   - Root Directory: `/server`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`
6. **Deploy**: Railway auto-deploys on git push

#### Deploy Frontend to Vercel

1. **Create Vercel Account**: https://vercel.com/
2. **Import Project** from GitHub
3. **Configure Settings**:
   - Framework: Vite
   - Root Directory: `/client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
5. **Deploy**: Vercel auto-deploys on git push

---

### Option 2: Render (Full Stack)

**Best for**: Single-platform deployment

1. **Create Account**: https://render.com/
2. **Create PostgreSQL Database**
3. **Create Web Service** for backend:
   - Environment: Node
   - Build Command: `cd server && npm install && npx prisma generate && npm run build`
   - Start Command: `cd server && npm start`
4. **Create Static Site** for frontend:
   - Build Command: `cd client && npm install && npm run build`
   - Publish Directory: `client/dist`

---

### Option 3: Heroku (Full Stack)

**Best for**: Traditional PaaS experience

#### Backend on Heroku

```bash
# Install Heroku CLI
heroku login

# Create app
heroku create learnwise-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set NODE_ENV=production
heroku config:set CLIENT_URL=https://your-frontend.herokuapp.com

# Deploy
git subtree push --prefix server heroku main
```

#### Frontend on Heroku

```bash
heroku create learnwise-client
# Configure buildpack for static sites
# Deploy client folder
```

---

## Database Setup on Cloud Platforms

### Railway PostgreSQL
- Automatically provisioned with database service
- Connection string auto-injected as `DATABASE_URL`

### Heroku Postgres
```bash
heroku addons:create heroku-postgresql:mini
heroku pg:psql # Access database
```

### Supabase
1. Create project at https://supabase.com/
2. Get connection string from Settings → Database
3. Use in `DATABASE_URL`

### AWS RDS
1. Create PostgreSQL instance in RDS
2. Configure security groups
3. Use connection string in `DATABASE_URL`

## Environment Variables by Platform

### Required Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com

# Optional APIs (Demo mode works without these)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
YOUTUBE_API_KEY=...
GITHUB_TOKEN=ghp_...
OPENALEX_EMAIL=your@email.com

# Demo Mode
DEMO_MODE=true
```

## Post-Deployment Steps

### 1. Run Database Migrations

**Railway/Render**:
```bash
# SSH into service or use web terminal
npx prisma migrate deploy
npx prisma db seed
```

**Heroku**:
```bash
heroku run npx prisma migrate deploy
heroku run npx prisma db seed
```

### 2. Verify Deployment

- ✅ Visit frontend URL
- ✅ Check health endpoint: `https://your-api/api/health`
- ✅ Test login with demo credentials
- ✅ Try creating a project
- ✅ Test AI resource search

### 3. Configure Custom Domain (Optional)

**Vercel**:
- Project Settings → Domains → Add Domain

**Railway**:
- Settings → Networking → Custom Domain

**Heroku**:
```bash
heroku domains:add www.your-domain.com
```

## Performance Optimization

### Frontend
- Enable compression in hosting platform
- Configure CDN (Vercel/Netlify do this automatically)
- Set proper caching headers
- Enable HTTP/2

### Backend
- Enable connection pooling in Prisma
- Add Redis caching layer (optional)
- Configure load balancing for multiple instances
- Monitor response times

## Monitoring & Logging

### Railway
- Built-in logging in dashboard
- Metrics for CPU/Memory usage

### Heroku
```bash
heroku logs --tail
heroku addons:create papertrail # Logging service
```

### Vercel
- Analytics built-in
- Function logs in dashboard

### Recommended Tools
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **DataDog**: Full observability
- **New Relic**: Application monitoring

## CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: echo "Railway auto-deploys"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: echo "Vercel auto-deploys"
```

## Backup Strategy

### Database Backups

**Heroku**:
```bash
heroku pg:backups:capture
heroku pg:backups:download
```

**Railway**:
- Use Railway's backup feature
- Or setup pg_dump cron job

**Supabase**:
- Daily automated backups included

### Recommended Schedule
- **Daily**: Automated backups
- **Weekly**: Manual verification
- **Monthly**: Long-term archive

## Security Checklist

Before going live:

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Set secure cookie flags
- [ ] Add rate limiting
- [ ] Enable CSP headers
- [ ] Review database permissions
- [ ] Audit environment variables
- [ ] Set up error monitoring

## Scaling Considerations

### Vertical Scaling
- Upgrade server instances
- Increase database resources
- Add more memory/CPU

### Horizontal Scaling
- Multiple backend instances
- Load balancer configuration
- Stateless session management
- Database read replicas

### Caching Layer
```bash
# Add Redis
heroku addons:create heroku-redis:mini
# Or Railway Redis service
```

## Troubleshooting

### Build Fails

**Issue**: Dependencies not installing
```bash
# Solution: Clear cache and rebuild
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Prisma errors
```bash
# Solution: Generate Prisma client
npx prisma generate
npx prisma migrate deploy
```

### Runtime Errors

**Issue**: Database connection fails
- Check `DATABASE_URL` is correctly set
- Verify database is accessible
- Check SSL settings (add `?sslmode=require` if needed)

**Issue**: CORS errors
- Ensure `CLIENT_URL` matches frontend domain
- Check CORS configuration in `server.ts`

**Issue**: API key errors
- Set `DEMO_MODE=true` to bypass
- Verify API keys are valid
- Check API quotas

## Cost Estimates

### Free Tier Deployment
- **Vercel**: Free (Hobby tier)
- **Railway**: $5/month credit (free)
- **Supabase**: Free (2 projects)
- **Total**: $0-5/month for testing

### Production Deployment
- **Vercel Pro**: $20/month
- **Railway**: $20-50/month (depends on usage)
- **Database**: $7-25/month
- **APIs**: $20-50/month (OpenAI, YouTube)
- **Total**: $67-145/month

## Support & Resources

### Platform Documentation
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app/
- Render: https://render.com/docs
- Heroku: https://devcenter.heroku.com/

### Community Support
- Railway Discord
- Vercel Community
- Stack Overflow
- GitHub Discussions

---

## Quick Reference

### Railway Commands
```bash
railway login
railway init
railway up
railway logs
railway open
```

### Heroku Commands
```bash
heroku login
heroku create
heroku logs --tail
heroku restart
heroku ps
```

### Vercel Commands
```bash
vercel login
vercel
vercel --prod
vercel logs
```

---

**🎉 Your LearnWise AI is now live!**

Share your deployment: `https://your-app-url.com`
