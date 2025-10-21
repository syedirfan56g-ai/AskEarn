# AskEarn 🎯

A full-stack Q&A platform where users earn coins by answering questions with built-in anti-AI detection.

## Features

- 🔐 **Authentication**: Secure login/signup with JWT
- ❓ **Q&A System**: Post questions and provide detailed answers
- 💰 **Coin Rewards**: Earn coins for quality answers
- 👍 **Upvoting**: Upvote answers (costs 1 coin)
- 🏆 **Leaderboard**: Track top earners
- 🤖 **Anti-AI Detection**: Tab switching detection, paste detection, session heartbeat
- 💳 **Payment System**: Buy coins via EasyPaisa/JazzCash
- 👑 **Admin Panel**: Complete admin dashboard for platform management
- 🎨 **Modern UI**: Yellow (#FFD600) and white theme with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express
- **Database**: SQLite
- **Auth**: JWT with httpOnly cookies

## Quick Start

### Installation

```bash
npm install
```

### Seed Database

```bash
npm run seed
```

This creates sample data:
- 2 users (alice@test.com / bob@test.com, password: password123)
- 1 admin (admin@askearn.com, password: admin123)
- 2 questions
- 3 answers

### Development

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
askearn/
├── server/              # Backend (Express API)
│   ├── index.js        # Main server file
│   ├── db.js           # Database setup
│   ├── auth.js         # Auth middleware
│   └── seed.js         # Seed data
├── app/                # Next.js app directory
│   ├── layout.js       # Root layout
│   ├── page.js         # Homepage
│   ├── login/          # Login page
│   ├── signup/         # Signup page
│   ├── ask/            # Ask question page
│   ├── question/       # Question detail page
│   ├── leaderboard/    # Leaderboard page
│   ├── wallet/         # Wallet page
│   ├── buy-coins/      # Buy coins page
│   └── admin/          # Admin panel
│       ├── page.js     # Admin dashboard
│       ├── users/      # User management
│       ├── questions/  # Question management
│       ├── answers/    # Answer management
│       └── payments/   # Payment management
├── components/         # React components
│   ├── Navbar.js       # Navigation bar
│   ├── QuestionCard.js # Question display
│   └── AnswerForm.js   # Answer submission form
└── lib/               # Utilities
    └── api.js         # API client

```

## API Endpoints

### Auth
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Questions
- `GET /api/questions` - List all questions
- `POST /api/questions` - Create question
- `GET /api/questions/:id` - Get question details

### Answers
- `POST /api/questions/:id/answers` - Submit answer
- `POST /api/answers/:id/upvote` - Upvote answer

### Session
- `POST /api/session/ping` - Heartbeat
- `POST /api/session/reset` - Reset session

### Leaderboard
- `GET /api/leaderboard` - Top users

### Payments
- `GET /api/payments/packages` - Get coin packages
- `POST /api/payments/create` - Submit payment
- `GET /api/payments/my-payments` - User's payment history

### Admin (Requires Admin Auth)
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - All users
- `POST /api/admin/users/:id/ban` - Ban/unban user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/questions` - All questions
- `DELETE /api/admin/questions/:id` - Delete question
- `GET /api/admin/answers` - All answers
- `DELETE /api/admin/answers/:id` - Delete answer
- `GET /api/admin/payments` - All payments
- `POST /api/admin/payments/:id/approve` - Approve payment
- `POST /api/admin/payments/:id/reject` - Reject payment

## Anti-AI Features

1. **Tab Switching Detection**: If user leaves tab for >5s, answer form resets
2. **Paste Detection**: Warning shown, rewards reduced by 50%
3. **Session Heartbeat**: Ping every 4s, inactive after 10s
4. **Activity Monitoring**: Tracks user engagement

## Deployment

### Vercel (Frontend + Backend)
1. Push to GitHub
2. Import to Vercel
3. Set build command: `npm run build`
4. Set output directory: `.next`

### Render (Backend)
1. Create new Web Service
2. Build command: `npm install`
3. Start command: `npm start`

## 👑 Admin Panel

Access the admin panel at `/admin` with admin credentials.

**Admin Features:**
- View platform statistics
- Manage users (ban/unban/delete)
- Moderate questions and answers
- Approve/reject payments
- Monitor platform activity

See **ADMIN-GUIDE.md** for complete admin documentation.

## 💳 Payment Integration

**Supported Methods:**
- EasyPaisa
- JazzCash

**How it works:**
1. User selects coin package
2. Sends payment via EasyPaisa/JazzCash
3. Submits payment details
4. Admin verifies and approves
5. Coins added to user account

**Important:** Update payment phone number in `app/buy-coins/page.js`

## License

MIT
