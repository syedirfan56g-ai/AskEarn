# AskEarn Features Documentation

## 🎨 UI & Design

### Color Scheme
- **Primary**: Yellow (#FFD600) - Used for buttons, highlights, and branding
- **Secondary**: White (#FFFFFF) - Clean backgrounds
- **Accent**: Gray tones for text and borders

### Design Principles
- ✅ Clean, modern card-based layout
- ✅ Smooth rounded corners (rounded-lg, rounded-xl)
- ✅ Minimal and responsive design
- ✅ Mobile-friendly navigation
- ✅ Consistent spacing and typography

### Components
- **Navbar**: Sticky top navigation with logo, links, and coin balance
- **Cards**: Rounded white cards with subtle shadows
- **Buttons**: Primary (yellow) and secondary (white) styles
- **Forms**: Clean inputs with focus states
- **Toasts**: Animated notifications for user feedback

---

## 🔐 Authentication System

### Features
- ✅ Email + password authentication
- ✅ Secure password hashing with bcrypt (10 rounds)
- ✅ JWT-based sessions (7-day expiry)
- ✅ httpOnly cookies for security
- ✅ Protected routes (redirect to login if not authenticated)
- ✅ Auto-logout functionality

### User Flow
1. **Sign Up**: Create account → Get 100 coins → Redirect to dashboard
2. **Login**: Authenticate → Set JWT cookie → Redirect to dashboard
3. **Logout**: Clear cookie → Redirect to login page

### Security
- Passwords hashed with bcryptjs
- JWT tokens stored in httpOnly cookies (XSS protection)
- CORS configured for specific origin
- Session validation on protected routes

---

## 🧠 Core Features

### 1. Post Question
**Route**: `/ask`

**Features**:
- Title field (required)
- Description field with multi-line support (required)
- Auto-save to database with timestamp
- Links to user ID
- Redirects to question detail page after posting

**Validation**:
- Both fields required
- Trimmed whitespace
- Error handling with user feedback

### 2. Answer Question
**Route**: `/question/[id]`

**Features**:
- Answer body field (required)
- "Explain your reasoning" field (required)
- Paste detection with warning
- Tab switching detection
- Session heartbeat monitoring
- Real-time form validation

**Anti-AI Detection**:
- ✅ **Paste Detection**: Warns if >50 characters pasted
- ✅ **Tab Switching**: Resets form if tab hidden >5 seconds
- ✅ **Session Heartbeat**: Pings server every 4 seconds
- ✅ **Activity Monitoring**: Tracks user engagement

**Reward Logic**:
- Answer starts as "pending"
- After 5+ upvotes → coins awarded
- Normal answer: 10 coins
- Paste-detected answer: 5 coins (50% reduction)

### 3. Upvote System
**Features**:
- Users can upvote any answer (except their own)
- Costs 1 coin per upvote
- Deducts from upvoter's balance
- Increments answer's upvote count
- Triggers reward if answer reaches 5+ upvotes

**Validation**:
- Can't upvote own answers
- Requires sufficient coins
- Prevents duplicate upvotes (database constraint)

### 4. Coin/Reward System
**Features**:
- Starting balance: 100 coins
- Earn coins by getting upvotes on answers
- Spend coins to upvote others
- Real-time balance updates in navbar
- Wallet page shows transaction history

**Reward Triggers**:
- 5+ upvotes on answer
- 24-hour delay (can be implemented with cron job)
- Paste detection reduces reward by 50%

### 5. Leaderboard
**Route**: `/leaderboard`

**Features**:
- Top 10 users by coin count
- Medal icons for top 3 (🥇🥈🥉)
- Real-time rankings
- Shows user name, email, and coin balance

### 6. Wallet
**Route**: `/wallet`

**Features**:
- Large coin balance display
- Transaction history
- Earnings breakdown
- Tips for earning more coins

---

## 🤖 Anti-AI / Anti-Cheating System

### 1. Tab Switching Detection
**Implementation**: `document.visibilitychange` event

**Logic**:
- Tracks when user leaves tab
- If tab hidden for >5 seconds → reset answer form
- Shows toast: "Session expired. Please stay active while answering."
- Prevents users from switching to ChatGPT/other tools

**Code Location**: `components/AnswerForm.js`

### 2. Paste Detection
**Implementation**: `onPaste` event handler

**Logic**:
- Detects when user pastes text
- If pasted text >50 characters → flag as paste-detected
- Shows warning: "Copied text detected — reduced rewards possible"
- Reduces reward by 50% (5 coins instead of 10)
- Stores `paste_detected` flag in database

**Code Location**: `components/AnswerForm.js`

### 3. Session Heartbeat
**Implementation**: Interval-based ping system

**Logic**:
- Client sends ping to `/api/session/ping` every 4 seconds
- Server updates `last_ping` timestamp
- If heartbeat lost for >10 seconds → session marked inactive
- On return, shows popup: "Session reset due to inactivity"

**Code Location**: 
- Client: `components/AnswerForm.js`
- Server: `server/index.js`

### 4. Activity Monitoring
**Features**:
- Tracks user engagement while answering
- Monitors focus state
- Detects suspicious patterns
- Can be extended with keystroke analysis

---

## 📊 Database Schema

### Tables

#### `users`
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | TEXT | User's full name |
| email | TEXT | Unique email |
| password_hash | TEXT | Bcrypt hashed password |
| coins | INTEGER | Coin balance (default: 100) |
| created_at | DATETIME | Account creation timestamp |

#### `questions`
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| user_id | INTEGER | Foreign key to users |
| title | TEXT | Question title |
| description | TEXT | Question details |
| created_at | DATETIME | Post timestamp |

#### `answers`
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| question_id | INTEGER | Foreign key to questions |
| user_id | INTEGER | Foreign key to users |
| body | TEXT | Answer content |
| reasoning | TEXT | Explanation/reasoning |
| upvotes | INTEGER | Upvote count (default: 0) |
| reward_status | TEXT | 'pending' or 'rewarded' |
| paste_detected | INTEGER | 1 if paste detected, 0 otherwise |
| created_at | DATETIME | Answer timestamp |

#### `upvotes`
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| user_id | INTEGER | Foreign key to users |
| answer_id | INTEGER | Foreign key to answers |
| created_at | DATETIME | Upvote timestamp |
| UNIQUE(user_id, answer_id) | | Prevents duplicate upvotes |

#### `sessions`
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| user_id | INTEGER | Foreign key to users |
| last_ping | DATETIME | Last heartbeat timestamp |
| active | INTEGER | 1 if active, 0 if inactive |

---

## 🎯 Pages & Routes

### Public Routes
- `/login` - Login page
- `/signup` - Sign up page

### Protected Routes (Require Authentication)
- `/` - Homepage (question feed)
- `/ask` - Ask a question
- `/question/[id]` - Question detail with answers
- `/leaderboard` - Top users by coins
- `/wallet` - User's coin balance and history

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - Clear session
- `GET /api/auth/me` - Get current user info

### Questions
- `GET /api/questions` - List all questions
- `GET /api/questions/:id` - Get question with answers
- `POST /api/questions` - Create new question

### Answers
- `POST /api/questions/:id/answers` - Submit answer
- `POST /api/answers/:id/upvote` - Upvote answer

### Session
- `POST /api/session/ping` - Heartbeat ping
- `POST /api/session/reset` - Reset session

### Leaderboard
- `GET /api/leaderboard` - Get top 10 users

### Wallet
- `GET /api/wallet/history` - Get transaction history

---

## 🎁 Bonus Features

### Ad Slots (Mock)
- Banner ad on homepage (gradient placeholder)
- Sidebar ad on homepage (300x250 placeholder)
- Ready for real ad integration

### Responsive Design
- Mobile-friendly navigation
- Adaptive layouts
- Touch-friendly buttons

### User Experience
- Loading states with spinners
- Toast notifications
- Error handling
- Form validation
- Auto-redirect after actions

### Performance
- Optimized re-renders
- Efficient database queries
- Minimal API calls
- Client-side caching

---

## 🚀 Future Enhancements

### Potential Features
1. **Email Verification**: Verify email on signup
2. **Password Reset**: Forgot password flow
3. **Profile Pages**: User profiles with stats
4. **Question Categories**: Tag and filter questions
5. **Search**: Full-text search for questions
6. **Notifications**: Real-time notifications for upvotes
7. **Comments**: Comment on answers
8. **Best Answer**: Mark accepted answer
9. **Badges**: Achievement system
10. **Referral System**: Earn coins for referrals

### Advanced Anti-AI
1. **Keystroke Analysis**: Detect typing patterns
2. **Time Tracking**: Monitor time spent on answer
3. **Browser Fingerprinting**: Detect multiple accounts
4. **AI Content Detection**: Use AI to detect AI-generated content
5. **Plagiarism Check**: Compare against existing answers

---

## 📈 Analytics & Metrics

### Trackable Metrics
- Total users
- Questions posted per day
- Answers submitted per day
- Average upvotes per answer
- Coin distribution
- User retention
- Session duration
- Paste detection rate
- Tab switching frequency

---

## 🎓 Learning Resources

This project demonstrates:
- ✅ Full-stack JavaScript development
- ✅ RESTful API design
- ✅ JWT authentication
- ✅ Database design and relationships
- ✅ React hooks and state management
- ✅ Next.js app router
- ✅ Tailwind CSS styling
- ✅ Client-side security
- ✅ User experience design
- ✅ Anti-cheating mechanisms

---

## 📞 Support

For issues or questions:
1. Check README.md for setup instructions
2. Review DEPLOYMENT.md for deployment help
3. Check browser console for errors
4. Review server logs for API issues
5. Verify database schema is correct

---

**Built with ❤️ for the AskEarn community!** 🪙
