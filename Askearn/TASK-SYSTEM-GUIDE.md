# AskEarn Task System - Complete Guide

## Overview
AskEarn has been transformed into a task-based earning platform where users complete question tasks within 24 hours to earn coins. The system includes AI detection to ensure natural, human-written answers.

## Key Features

### 1. **Task System**
- **5 Task Levels**: 5, 15, 25, 35, and 50 questions
- **24-Hour Deadline**: Complete tasks within 24 hours or they expire
- **One Active Task**: Users can only have one active task at a time
- **Flexible Choice**: Users choose which task level to complete

### 2. **Earning System**
- **20 Coins per Question**: For natural, human-written answers
- **500 Coins = $1 USD**: Clear conversion rate
- **Instant Rewards**: Coins awarded immediately upon answer submission
- **AI Detection**: Only natural answers earn coins

### 3. **User Assessment**
- **Signup Questionnaire**: 5 questions to understand user type
- **Personality Analysis**: Determines user's personality type
- **Skill Level Detection**: Based on time commitment
- **Interest Mapping**: Identifies user interests

### 4. **AI Detection Algorithm**
The system analyzes answers for:
- AI-specific phrases and patterns
- Overly formal language
- Perfect structure indicators
- Natural imperfections (typos, casual language)
- Sentence consistency
- Personal expressions

## Setup Instructions

### 1. Initial Setup
```bash
# Install dependencies (if not already done)
npm install

# Seed task questions into database
npm run seed-tasks
```

### 2. Start the Application
```bash
# Start both server and client
npm run dev

# Or start separately:
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
```

### 3. Access the Application
- **Home Page**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Signup**: http://localhost:3000/signup

## User Flow

### New User Journey
1. **Landing Page** → User sees earning potential and features
2. **Signup** → Create account (gets 100 coins bonus)
3. **Assessment** → Answer 5 personality questions
4. **Task Selection** → Choose from 5 task levels
5. **Complete Task** → Answer questions within 24 hours
6. **Earn Coins** → Get paid for natural answers
7. **Withdraw** → Convert coins to real money

### Returning User Journey
1. **Home Page** → Auto-redirect to tasks page
2. **Tasks Page** → View active task or select new one
3. **Continue/Start Task** → Work on questions
4. **Complete** → Finish and earn coins

## Task Levels

| Level | Questions | Total Coins | Dollar Value | Time Estimate |
|-------|-----------|-------------|--------------|---------------|
| 1 - Beginner | 5 | 100 | $0.20 | 10-15 min |
| 2 - Intermediate | 15 | 300 | $0.60 | 30-45 min |
| 3 - Advanced | 25 | 500 | $1.00 | 1-1.5 hours |
| 4 - Expert | 35 | 700 | $1.40 | 1.5-2 hours |
| 5 - Master | 50 | 1000 | $2.00 | 2-3 hours |

## Database Schema

### New Tables

#### `user_profiles`
- Stores user personality type, interests, and skill level
- Created during signup assessment

#### `tasks`
- Predefined task levels (5 rows: levels 1-5)
- Contains question count and coin rewards

#### `task_questions`
- Questions for each task level
- Seeded via `npm run seed-tasks`

#### `user_tasks`
- User's task assignments
- Tracks progress, deadline, and status

#### `task_answers`
- User's answers to task questions
- Includes AI detection score and coins awarded

## API Endpoints

### Task Routes
```
GET  /api/tasks                    - Get all available tasks
GET  /api/tasks/active             - Get user's active task
POST /api/tasks/:taskId/start      - Start a new task
GET  /api/tasks/:userTaskId/questions - Get questions for task
POST /api/tasks/:userTaskId/answer - Submit answer
GET  /api/tasks/history            - Get user's task history
```

### Profile Routes
```
POST /api/profile/assessment       - Save user profile
GET  /api/profile                  - Get user profile
```

## AI Detection System

### How It Works
The `aiDetection.js` module analyzes text using multiple factors:

1. **AI Phrase Detection** (30 points)
   - Checks for AI-specific phrases
   - "As an AI", "I apologize", etc.

2. **Formal Language** (20 points)
   - Overly formal phrases
   - "It is important to note", "Furthermore", etc.

3. **Perfect Structure** (15 points)
   - Numbered lists
   - Introduction/Body/Conclusion format

4. **Natural Indicators** (reduces score)
   - Casual language: "um", "like", "you know"
   - Internet slang: "lol", "omg", "btw"
   - Typos and informal patterns

### Score Interpretation
- **0-39**: Natural (human-written) → Full coins awarded
- **40-59**: Uncertain → No coins (to be safe)
- **60-100**: AI-generated → No coins awarded

## Tips for Users

### Writing Natural Answers
✅ **DO:**
- Write in your own words
- Use casual, conversational language
- Share personal experiences
- Include opinions and feelings
- Use contractions (I'm, don't, can't)
- Make minor typos (natural)

❌ **DON'T:**
- Copy from AI tools
- Use overly formal language
- Write perfect, structured essays
- Use phrases like "in conclusion"
- Make answers too long or detailed

## Admin Features
Admins can:
- View all user tasks and progress
- Monitor AI detection scores
- Review flagged answers
- Manage task questions
- Track earning statistics

## Troubleshooting

### Task Questions Not Showing
```bash
# Run the seed script
npm run seed-tasks
```

### User Stuck on Assessment
- Assessment can be skipped
- Click "Skip for now" at bottom

### Deadline Expired
- Task automatically marked as expired
- User must start a new task
- No coins earned for expired tasks

### AI Detection False Positive
- Encourage more casual writing
- Add personal touches
- Use informal language
- Share experiences

## Future Enhancements

### Planned Features
1. **Question Categories**: Filter by topic
2. **Difficulty Levels**: Vary question complexity
3. **Bonus Rewards**: Extra coins for speed/quality
4. **Referral System**: Earn by inviting friends
5. **Daily Challenges**: Special high-reward tasks
6. **Leaderboards**: Top earners by week/month
7. **Achievement Badges**: Milestone rewards

## Support

### Common Issues
1. **Can't start task**: Complete or cancel active task first
2. **Coins not awarded**: Answer detected as AI-generated
3. **Deadline passed**: Task expired, start new one
4. **Assessment stuck**: Skip and complete later

### Contact
For issues or questions, check the troubleshooting section or contact support.

## Technical Details

### File Structure
```
server/
  ├── db.js              - Database schema with new tables
  ├── index.js           - API routes including task endpoints
  ├── aiDetection.js     - AI detection algorithm
  └── seedTasks.js       - Seed task questions

app/
  ├── page.js            - Landing page with redirect
  ├── assessment/        - User personality assessment
  ├── tasks/             - Task selection and management
  │   ├── page.js        - Task list
  │   ├── [id]/page.js   - Task detail/answer page
  │   └── complete/      - Task completion page
  └── signup/page.js     - Updated to redirect to assessment

lib/
  └── api.js             - API client with task functions
```

### Environment
- **Node.js**: Backend server
- **Next.js**: Frontend framework
- **SQLite**: Database
- **Express**: API framework

## Success Metrics

### User Engagement
- Task completion rate
- Average time per task
- Return user rate
- Daily active users

### Quality Metrics
- AI detection accuracy
- Natural answer percentage
- User satisfaction score
- Earning conversion rate

---

**Version**: 2.0.0  
**Last Updated**: 2024  
**Status**: Production Ready
