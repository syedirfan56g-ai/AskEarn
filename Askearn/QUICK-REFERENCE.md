# ⚡ AskEarn Quick Reference

## 🚀 Setup Commands
```bash
npm install              # Install dependencies
npm run seed            # Create sample data
npm run dev             # Start development
npm run build           # Build for production
npm start               # Run production server
```

## 🔐 Login Credentials

### Users
- alice@test.com / password123 (150 coins)
- bob@test.com / password123 (200 coins)

### Admin
- admin@askearn.com / admin123 (10000 coins)

## 🌐 URLs
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Admin Panel: http://localhost:3000/admin

## 💰 Coin Packages
| Coins | Price (PKR) | Discount |
|-------|-------------|----------|
| 100   | 100         | -        |
| 500   | 450         | 10%      |
| 1000  | 850         | 15%      |
| 5000  | 4000        | 20%      |

## 🎯 Key Features
- ✅ Q&A System
- ✅ Coin Rewards (10 coins/answer)
- ✅ Upvoting (1 coin/upvote)
- ✅ Buy Coins (EasyPaisa/JazzCash)
- ✅ Admin Panel
- ✅ Anti-AI Detection
- ✅ Leaderboard

## 📱 User Pages
- `/` - Homepage
- `/login` - Login
- `/signup` - Sign up
- `/ask` - Ask question
- `/question/[id]` - Question detail
- `/leaderboard` - Top users
- `/wallet` - Coin balance
- `/buy-coins` - Purchase coins

## 👑 Admin Pages
- `/admin` - Dashboard
- `/admin/users` - Manage users
- `/admin/questions` - Manage questions
- `/admin/answers` - Manage answers
- `/admin/payments` - Manage payments

## 🔧 Important Files to Edit

### Payment Phone Number
`app/buy-coins/page.js` line ~165
```javascript
<strong>03XX-XXXXXXX</strong> // Change this!
```

### Coin Packages
`server/index.js` line ~313
```javascript
const packages = [
  { id: 1, coins: 100, price: 100, currency: 'PKR' },
  // Add more packages
];
```

### Admin User
`server/seed.js` line ~10
```javascript
[999, 'Admin User', 'admin@askearn.com', adminPassword, 10000, 1]
```

## 🎨 Color Theme
- Primary: #FFD600 (Yellow)
- Secondary: #FFFFFF (White)
- Text: Gray tones

## 🤖 Anti-AI Features
1. Tab switch >5s → Reset form
2. Paste >50 chars → Warning + 50% reward reduction
3. Heartbeat every 4s
4. Inactive >10s → Session reset

## 📊 Database Tables
- users (auth, coins, admin status)
- questions (Q&A content)
- answers (with reasoning, upvotes)
- upvotes (prevent duplicates)
- payments (EasyPaisa/JazzCash)
- sessions (activity tracking)

## 🔌 Key API Endpoints

### Auth
- POST `/api/auth/signup`
- POST `/api/auth/login`
- GET `/api/auth/me`

### Questions
- GET `/api/questions`
- POST `/api/questions`
- GET `/api/questions/:id`

### Payments
- GET `/api/payments/packages`
- POST `/api/payments/create`
- GET `/api/payments/my-payments`

### Admin
- GET `/api/admin/stats`
- GET `/api/admin/payments`
- POST `/api/admin/payments/:id/approve`
- POST `/api/admin/payments/:id/reject`

## ⚡ Quick Tests

### Test Q&A
1. Login → Ask question → Answer → Upvote

### Test Payment
1. Buy coins → Submit → Login as admin → Approve

### Test Anti-AI
1. Answer question → Switch tab 6s → Return → Form reset

### Test Admin
1. Login as admin → View dashboard → Manage content

## 🚨 Common Issues

### Module not found
```bash
rm -rf node_modules .next && npm install
```

### Database error
```bash
rm server/askearn.db && npm run seed
```

### Port in use
Change PORT in `server/index.js` or kill process

### Admin can't login
Check `is_admin = 1` in database

## 📚 Documentation
- README.md - Overview
- FEATURES.md - Feature details
- ADMIN-GUIDE.md - Admin manual
- COMPLETE-GUIDE.md - Full guide
- DEPLOYMENT.md - Deploy guide

## 🎯 Production Checklist
- [ ] Change admin password
- [ ] Update payment phone number
- [ ] Set JWT_SECRET env variable
- [ ] Enable HTTPS
- [ ] Update CORS origin
- [ ] Backup database
- [ ] Test all features
- [ ] Deploy!

---

**Need help?** Check COMPLETE-GUIDE.md for detailed instructions!
