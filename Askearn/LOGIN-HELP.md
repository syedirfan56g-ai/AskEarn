# 🔐 Can't Login? Quick Fix!

## ⚡ Fastest Solution (90% of cases)

Just run this command:

```bash
npm run seed
```

Then try logging in with:
- **Email:** `alice@test.com`
- **Password:** `password123`

---

## 🛠️ Automatic Fix

Run this script to diagnose and fix:

```bash
fix-login.bat
```

Or manually:

```bash
node fix-login.js
```

---

## 📧 Login Credentials

### Regular Users
| Email | Password |
|-------|----------|
| alice@test.com | password123 |
| bob@test.com | password123 |

### Admin
| Email | Password |
|-------|----------|
| admin@askearn.com | admin123 |

**⚠️ Important:**
- Use **lowercase** email
- No spaces before/after
- Password is case-sensitive
- Make sure server is running (`npm run dev`)

---

## 🔍 Step-by-Step Fix

### 1. Make Sure Server is Running
```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
✓ Ready on http://localhost:3000
```

### 2. Seed the Database
```bash
npm run seed
```

### 3. Go to Login Page
Open: http://localhost:3000/login

### 4. Enter Credentials
- Email: `alice@test.com`
- Password: `password123`

### 5. Click Login
You should be redirected to the homepage!

---

## ❌ Common Mistakes

### Wrong Email
```
✅ alice@test.com
❌ Alice@test.com (capital A)
❌ alice @test.com (space)
❌ alice@test (incomplete)
```

### Wrong Password
```
✅ password123
❌ Password123 (capital P)
❌ password 123 (space)
```

### Wrong URL
```
✅ http://localhost:3000
❌ http://localhost:5000 (that's the backend)
```

---

## 🚨 Still Not Working?

### Option 1: Complete Reset
```bash
# Stop server (Ctrl+C)
Remove-Item server/askearn.db
npm run seed
npm run dev
```

### Option 2: Full Clean Install
```bash
# Stop server (Ctrl+C)
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
Remove-Item server/askearn.db
npm install
npm run seed
npm run dev
```

---

## 🎯 What Should Happen

### ✅ Successful Login:
1. Enter credentials
2. Click "Login"
3. Button shows "Logging in..."
4. **Redirects to homepage**
5. See your name in navbar
6. See coin balance

### ❌ Failed Login:
1. Red error message appears
2. Stays on login page
3. Check credentials and try again

---

## 🔧 Troubleshooting Checklist

- [ ] Server is running (`npm run dev`)
- [ ] Database is seeded (`npm run seed`)
- [ ] Using correct URL (http://localhost:3000)
- [ ] Email is exactly: `alice@test.com`
- [ ] Password is exactly: `password123`
- [ ] No browser errors (press F12 to check)

---

## 💡 Quick Test

Open browser console (F12) and run:

```javascript
fetch('http://localhost:5000/api/questions')
  .then(r => r.json())
  .then(d => console.log('Server is working!', d))
  .catch(e => console.error('Server error:', e))
```

If you see "Server is working!", the backend is fine.

---

## 📞 Need More Help?

See **TROUBLESHOOTING.md** for detailed solutions to all common issues.

---

**TL;DR: Run `npm run seed` and use `alice@test.com` / `password123`** 🎯
