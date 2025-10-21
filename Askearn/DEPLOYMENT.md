# AskEarn Deployment Guide

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Setup Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Seed the database**
   ```bash
   npm run seed
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

5. **Login with demo accounts**
   - alice@test.com / password123
   - bob@test.com / password123

---

## 🌐 Production Deployment

### Option 1: Vercel (Recommended for Full-Stack)

Vercel can host both the Next.js frontend and the Express backend as serverless functions.

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Create `vercel.json`** (already configured)
   ```json
   {
     "version": 2,
     "builds": [
       { "src": "server/index.js", "use": "@vercel/node" },
       { "src": "package.json", "use": "@vercel/next" }
     ],
     "routes": [
       { "src": "/api/(.*)", "dest": "server/index.js" },
       { "src": "/(.*)", "dest": "/$1" }
     ]
   }
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set environment variables** in Vercel dashboard:
   - `JWT_SECRET`: your-secret-key-here
   - `NODE_ENV`: production

### Option 2: Render (Separate Services)

#### Backend Deployment

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Environment Variables**:
     - `JWT_SECRET`: your-secret-key
     - `PORT`: 5000

#### Frontend Deployment

1. Create a new **Static Site** on Render
2. Configure:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `.next`
   - **Environment Variables**:
     - `NEXT_PUBLIC_API_URL`: your-backend-url

3. Update `lib/api.js` to use environment variable:
   ```javascript
   const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
   ```

### Option 3: Railway

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login and initialize**
   ```bash
   railway login
   railway init
   ```

3. **Deploy**
   ```bash
   railway up
   ```

4. **Set environment variables**
   ```bash
   railway variables set JWT_SECRET=your-secret-key
   ```

### Option 4: Heroku

1. **Install Heroku CLI**
   ```bash
   npm i -g heroku
   ```

2. **Login and create app**
   ```bash
   heroku login
   heroku create askearn-app
   ```

3. **Add Procfile**
   ```
   web: npm start
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **Set environment variables**
   ```bash
   heroku config:set JWT_SECRET=your-secret-key
   ```

---

## 📦 Database Considerations

### Development
- Uses SQLite (file-based database)
- Database file: `server/askearn.db`
- Perfect for prototyping

### Production Options

#### Option 1: Keep SQLite
- Simple and works for small-scale apps
- Make sure `server/askearn.db` persists between deployments
- Use volume mounting on platforms like Railway/Render

#### Option 2: Migrate to PostgreSQL
1. Install `pg` package:
   ```bash
   npm install pg
   ```

2. Update `server/db.js` to use PostgreSQL:
   ```javascript
   const { Pool } = require('pg');
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: { rejectUnauthorized: false }
   });
   ```

3. Platforms with free PostgreSQL:
   - Render (PostgreSQL)
   - Railway (PostgreSQL)
   - Supabase (PostgreSQL)
   - ElephantSQL (PostgreSQL)

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Enable HTTPS (automatic on Vercel/Render)
- [ ] Update CORS settings in `server/index.js` to match your domain
- [ ] Add rate limiting to prevent abuse
- [ ] Validate all user inputs
- [ ] Use environment variables for sensitive data
- [ ] Enable httpOnly cookies (already configured)

---

## 🧪 Testing Deployment

1. **Test authentication**
   - Sign up new user
   - Login/logout
   - Protected routes

2. **Test Q&A flow**
   - Post question
   - Submit answer
   - Upvote answer

3. **Test anti-AI features**
   - Tab switching (leave tab for >5s)
   - Paste detection
   - Session heartbeat

4. **Test coin system**
   - Answer gets 5+ upvotes
   - Coins awarded
   - Wallet updates

---

## 📊 Monitoring

### Logs
- Vercel: Check deployment logs in dashboard
- Render: Real-time logs in service dashboard
- Railway: `railway logs`

### Database
- Check database file size
- Monitor query performance
- Backup regularly

---

## 🔄 Updates & Maintenance

### Updating the app
```bash
git add .
git commit -m "Update message"
git push
```

Most platforms auto-deploy on push to main branch.

### Database migrations
When changing schema:
1. Update `server/db.js`
2. Create migration script
3. Run on production database

---

## 🆘 Troubleshooting

### "Cannot connect to database"
- Check database file exists
- Verify file permissions
- Check DATABASE_URL env variable

### "CORS error"
- Update CORS origin in `server/index.js`
- Match your frontend domain

### "Session expired immediately"
- Check JWT_SECRET is set
- Verify cookie settings
- Check HTTPS is enabled

### "Build failed"
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Review build logs

---

## 📝 Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `JWT_SECRET` | Secret key for JWT tokens | Yes | `my-super-secret-key-123` |
| `PORT` | Server port | No | `5000` |
| `NODE_ENV` | Environment | No | `production` |
| `DATABASE_URL` | PostgreSQL connection string | No | `postgres://user:pass@host/db` |
| `NEXT_PUBLIC_API_URL` | Backend API URL | No | `https://api.askearn.com` |

---

## 🎉 Success!

Your AskEarn app is now deployed! Share the URL with users and start earning coins! 🪙
