# 🚀 Quick Start Guide - AskEarn Task System

## ⚡ 3-Step Setup

### Step 1: Seed Task Questions
```bash
npm run seed-tasks
```
**Wait for**: "✅ Task questions seeding completed!"

### Step 2: Start Application
```bash
npm run dev
```
**Wait for**: Both server (port 5000) and client (port 3000) to start

### Step 3: Open Browser
```
http://localhost:3000
```

## 🎯 Test Flow (5 Minutes)

### 1️⃣ Sign Up (1 min)
- Click "Get Started Free"
- Enter name, email, password
- Click "Sign Up"

### 2️⃣ Assessment (1 min)
- Answer 5 quick questions
- Or click "Skip for now"

### 3️⃣ Choose Task (30 sec)
- Select "Beginner Task" (5 questions)
- Click "Start Task"

### 4️⃣ Answer Questions (2 min)
- Write natural, casual answers
- Example: "My hobby is cricket because it's fun and relaxing"
- Submit each answer

### 5️⃣ See Results (30 sec)
- Watch coins being added
- See AI detection feedback
- Complete all 5 questions

## ✅ What You'll See

### Landing Page
```
┌─────────────────────────────────┐
│         AskEarn                 │
│  Answer Questions, Earn Money   │
│                                 │
│  [Get Started] [Login]          │
│                                 │
│  Features & Earning Potential   │
└─────────────────────────────────┘
```

### Task Selection
```
┌─────────────────────────────────┐
│  Available Tasks                │
├─────────────────────────────────┤
│  Beginner    - 5 Q  - 100 coins │
│  Intermediate - 15 Q - 300 coins│
│  Advanced    - 25 Q - 500 coins │
│  Expert      - 35 Q - 700 coins │
│  Master      - 50 Q - 1000 coins│
└─────────────────────────────────┘
```

### Task Progress
```
┌─────────────────────────────────┐
│  Beginner Task                  │
│  ⏰ 23h 45m remaining            │
│  Progress: 3/5 [████░] 60%      │
│  Coins Earned: 60               │
├─────────────────────────────────┤
│  Question 4 of 5                │
│  What motivates you?            │
│                                 │
│  [Your answer here...]          │
│                                 │
│  [Submit Answer]                │
└─────────────────────────────────┘
```

### Result Feedback
```
┌─────────────────────────────────┐
│  ✅ Great Answer!               │
│  Your answer appears natural    │
│  You earned 20 coins!           │
└─────────────────────────────────┘
```

## 💡 Tips for Testing

### Write Natural Answers
✅ **Good**: "I love playing cricket with friends on weekends. It helps me relax and forget about work stress."

❌ **Bad**: "It is important to note that hobbies play a crucial role in our lives. Furthermore, they provide relaxation."

### Test AI Detection
1. Write a natural answer → Should get coins
2. Copy from ChatGPT → Should NOT get coins
3. Write very formal → Should NOT get coins

## 🎨 Features to Try

### 1. Task Management
- Start a task
- Answer some questions
- Check progress
- See countdown timer

### 2. AI Detection
- Try different writing styles
- See which ones earn coins
- Check feedback messages

### 3. Assessment
- Complete personality questions
- See how it analyzes you
- Or skip it entirely

### 4. Coin Tracking
- Watch coins increase
- Check wallet
- See conversion to USD

## 🔧 Common Issues

### Issue: No questions showing
**Solution**: Run `npm run seed-tasks`

### Issue: Can't start task
**Solution**: Complete or cancel active task first

### Issue: No coins earned
**Solution**: Answer was detected as AI-generated, write more naturally

### Issue: Deadline passed
**Solution**: Task expired, start a new one

## 📊 Expected Results

After completing Beginner Task (5 questions):
- ✅ 5 questions answered
- ✅ 100 coins earned (if all natural)
- ✅ Task marked as completed
- ✅ Can start new task

## 🎯 Success Checklist

- [ ] Database seeded with questions
- [ ] Application running on ports 3000 & 5000
- [ ] Can sign up new user
- [ ] Assessment works (or can skip)
- [ ] Can select and start task
- [ ] Questions display correctly
- [ ] Can submit answers
- [ ] AI detection provides feedback
- [ ] Coins awarded for natural answers
- [ ] Progress tracked correctly
- [ ] Task completes successfully

## 📱 Pages to Test

1. **/** - Landing page (unauthenticated)
2. **/signup** - Registration with redirect to assessment
3. **/assessment** - 5-question personality test
4. **/tasks** - Task selection page
5. **/tasks/[id]** - Task detail and answer page
6. **/tasks/complete** - Completion celebration
7. **/wallet** - Coin balance and history

## 🚀 Ready to Launch?

Once everything works:
1. ✅ All features tested
2. ✅ AI detection working
3. ✅ Coins being awarded
4. ✅ Deadlines enforcing
5. ✅ UI looks good

**You're ready to go live!** 🎉

## 📞 Need Help?

Check these files:
- **TASK-SYSTEM-GUIDE.md** - Complete English documentation
- **URDU-GUIDE.md** - Urdu guide
- **IMPLEMENTATION-SUMMARY.md** - Technical details

## 🎊 That's It!

Your task-based earning platform is ready. Users can now:
- Sign up and get assessed
- Choose task levels
- Answer questions naturally
- Earn real money (coins → USD)
- Complete tasks within 24 hours

**Happy Earning! 💰**
