# 🎉 AskEarn Complete Application Guide

Your complete Q&A platform with payment system and admin panel is ready!

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Database
```bash
npm run seed
```

You'll see:
```
✅ Database seeded successfully!
📧 Test accounts:
   alice@test.com / password123
   bob@test.com / password123

👑 Admin account:
   admin@askearn.com / admin123
```

### 3. Start Development Server
```bash
npm run dev
```

Access:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **Admin Panel:** http://localhost:3000/admin

---

## 👥 User Accounts

### Regular Users
| Email | Password | Coins | Role |
|-------|----------|-------|------|
| alice@test.com | password123 | 150 | User |
| bob@test.com | password123 | 200 | User |

### Admin Account
| Email | Password | Coins | Role |
|-------|----------|-------|------|
| admin@askearn.com | admin123 | 10000 | Admin |

---

## 🎯 Complete Feature List

### ✅ User Features
1. **Authentication**
   - Sign up with email/password
   - Login/logout
   - Secure JWT sessions

2. **Q&A System**
   - Post questions with title and description
   - Answer questions with reasoning
   - View all questions on homepage
   - Browse question details with answers

3. **Coin System**
   - Start with 100 coins
   - Earn 10 coins per answer (5 if paste detected)
   - Spend 1 coin to upvote answers
   - View coin balance in navbar

4. **Upvoting**
   - Upvote helpful answers
   - Costs 1 coin per upvote
   - Answer gets rewarded after 5+ upvotes

5. **Leaderboard**
   - See top 10 users by coins
   - Medal icons for top 3
   - Real-time rankings

6. **Wallet**
   - View coin balance
   - See transaction history
   - Track earnings

7. **Buy Coins** 💳
   - Choose from 4 coin packages
   - Pay via EasyPaisa or JazzCash
   - Submit payment for admin approval
   - Get coins after verification

8. **Anti-AI Detection** 🤖
   - Tab switching detection (>5s resets form)
   - Paste detection (reduces rewards 50%)
   - Session heartbeat (ping every 4s)
   - Activity monitoring

### ✅ Admin Features
1. **Dashboard**
   - Total users count
   - Total questions count
   - Total answers count
   - Pending payments count
   - Total coins in circulation

2. **User Management**
   - View all users
   - Ban/unban users
   - Delete users
   - See user details and coins

3. **Question Management**
   - View all questions
   - Delete inappropriate questions
   - See answer counts

4. **Answer Management**
   - View all answers
   - Delete spam/inappropriate answers
   - See upvotes and reward status
   - Identify paste-detected answers

5. **Payment Management** 💰
   - View all payments (pending/approved/rejected)
   - Approve payments → coins added automatically
   - Reject invalid payments
   - Filter by status
   - See user details and transaction info

---

## 📱 Pages & Routes

### Public Pages
- `/login` - Login page
- `/signup` - Sign up page

### User Pages (Require Login)
- `/` - Homepage (question feed)
- `/ask` - Ask a question
- `/question/[id]` - Question detail with answers
- `/leaderboard` - Top users
- `/wallet` - Coin balance and history
- `/buy-coins` - Purchase coins

### Admin Pages (Require Admin Login)
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/questions` - Question management
- `/admin/answers` - Answer management
- `/admin/payments` - Payment management

---

## 💳 Payment System Setup

### Step 1: Get Payment Account
1. Create **EasyPaisa** merchant account
2. Create **JazzCash** merchant account
3. Note your account phone numbers

### Step 2: Update Payment Number
Edit `app/buy-coins/page.js` around line 165:

```javascript
// Change this:
<li>Send PKR {selectedPackage.price} to: <strong>03XX-XXXXXXX</strong></li>

// To your actual number:
<li>Send PKR {selectedPackage.price} to: <strong>0300-1234567</strong></li>
```

### Step 3: Test Payment Flow
1. Login as regular user (alice@test.com)
2. Click "Buy Coins" in navbar
3. Select a package
4. Fill payment form
5. Submit

### Step 4: Approve as Admin
1. Logout
2. Login as admin (admin@askearn.com)
3. Click Shield icon → Admin Panel
4. Go to "Manage Payments"
5. See pending payment
6. Click green check to approve
7. Coins added to user automatically!

---

## 🎨 Coin Packages

| Package | Coins | Price (PKR) | Discount | Value |
|---------|-------|-------------|----------|-------|
| Starter | 100 | 100 | - | 1 PKR/coin |
| Popular | 500 | 450 | 10% | 0.9 PKR/coin |
| Premium | 1000 | 850 | 15% | 0.85 PKR/coin |
| Ultimate | 5000 | 4000 | 20% | 0.8 PKR/coin |

**To modify packages:** Edit `server/index.js` line ~313

---

## 🧪 Testing the Complete App

### Test 1: User Registration & Q&A
1. Go to `/signup`
2. Create new account
3. Post a question at `/ask`
4. Answer someone else's question
5. Check your coins increase

### Test 2: Upvoting System
1. Login as Alice
2. Find Bob's answer
3. Upvote it (costs 1 coin)
4. Alice loses 1 coin
5. After 5 upvotes, Bob gets 10 coins

### Test 3: Anti-AI Detection
1. Start answering a question
2. Switch to another tab
3. Wait 6 seconds
4. Return to AskEarn
5. ✅ Form should be reset with warning

### Test 4: Paste Detection
1. Copy a large text (>50 chars)
2. Paste into answer field
3. ✅ Orange warning appears
4. Submit answer
5. Reward will be 5 coins instead of 10

### Test 5: Payment Flow
1. Login as user
2. Go to "Buy Coins"
3. Select package
4. Fill payment details
5. Submit
6. Login as admin
7. Approve payment
8. ✅ User gets coins!

### Test 6: Admin Management
1. Login as admin
2. Go to admin dashboard
3. View statistics
4. Ban a user
5. Delete a question
6. Approve a payment

---

## 🔐 Security Features

### Authentication
- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens in httpOnly cookies
- ✅ 7-day token expiry
- ✅ Protected routes

### Admin Security
- ✅ Separate admin middleware
- ✅ Admin flag in JWT token
- ✅ Admin-only routes
- ✅ Cannot access without admin status

### Payment Security
- ✅ Manual admin approval required
- ✅ Phone number verification
- ✅ Transaction ID tracking
- ✅ Payment history maintained

---

## 📊 Database Tables

### users
- id, name, email, password_hash
- coins, is_admin, is_banned
- created_at

### questions
- id, user_id, title, description
- created_at

### answers
- id, question_id, user_id
- body, reasoning, upvotes
- reward_status, paste_detected
- created_at

### upvotes
- id, user_id, answer_id
- created_at
- UNIQUE(user_id, answer_id)

### payments
- id, user_id, amount, coins
- payment_method, phone_number
- transaction_id, status
- created_at

### sessions
- id, user_id, last_ping, active

---

## 🎯 Common Admin Tasks

### Daily Tasks
- [ ] Check pending payments
- [ ] Approve/reject payments
- [ ] Review new questions
- [ ] Check for spam

### Weekly Tasks
- [ ] Review user statistics
- [ ] Check top earners
- [ ] Monitor payment trends
- [ ] Backup database

### Monthly Tasks
- [ ] Analyze platform growth
- [ ] Update coin packages
- [ ] Plan promotions
- [ ] Review policies

---

## 🚨 Troubleshooting

### "Module not found" error
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### "Database locked" error
```bash
# Stop server
# Delete askearn.db
npm run seed
npm run dev
```

### "Payment not appearing"
1. Check server logs
2. Verify database has payments table
3. Check user is authenticated
4. Refresh admin panel

### "Admin panel not accessible"
1. Verify admin login credentials
2. Check is_admin flag in database
3. Clear cookies and re-login
4. Check JWT token includes isAdmin

---

## 📚 Documentation Files

- **README.md** - Main project documentation
- **FEATURES.md** - Complete feature documentation
- **DEPLOYMENT.md** - Production deployment guide
- **ADMIN-GUIDE.md** - Admin panel user guide
- **COMPLETE-GUIDE.md** - This file!

---

## 🎓 What You've Built

### Technical Stack
- ✅ Full-stack Next.js 14 application
- ✅ Express REST API
- ✅ SQLite database with relationships
- ✅ JWT authentication system
- ✅ Admin panel with RBAC
- ✅ Payment processing system
- ✅ Anti-AI detection mechanisms
- ✅ Responsive Tailwind UI

### Business Features
- ✅ User registration and profiles
- ✅ Content creation (Q&A)
- ✅ Gamification (coins, leaderboard)
- ✅ Monetization (coin purchases)
- ✅ Moderation tools
- ✅ Analytics dashboard

---

## 🚀 Next Steps

### Immediate
1. Update payment phone number
2. Test all features
3. Customize branding
4. Add your logo

### Short Term
1. Deploy to production
2. Set up real payment accounts
3. Create terms of service
4. Add privacy policy

### Long Term
1. Add email notifications
2. Implement real-time updates
3. Add mobile app
4. Scale infrastructure

---

## 🎉 Congratulations!

You now have a complete, production-ready Q&A platform with:
- ✅ User authentication
- ✅ Q&A functionality
- ✅ Coin reward system
- ✅ Payment integration (EasyPaisa/JazzCash)
- ✅ Admin panel
- ✅ Anti-AI detection
- ✅ Modern UI

**Ready to launch!** 🚀

---

## 📞 Support

For questions or issues:
1. Check documentation files
2. Review server logs
3. Check database structure
4. Test with sample accounts

**Built with ❤️ - Happy coding!** 🎯
