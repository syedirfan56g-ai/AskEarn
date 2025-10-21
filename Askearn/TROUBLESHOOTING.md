# 🔧 AskEarn Troubleshooting Guide

## 🚨 Can't Login? Follow These Steps

### Step 1: Check if Database is Seeded

Run this diagnostic script:
```bash
node fix-login.js
```

This will tell you exactly what's wrong.

### Step 2: Re-seed the Database

If you see any errors, run:
```bash
npm run seed
```

You should see:
```
✅ Database seeded successfully!
📧 Test accounts:
   alice@test.com / password123
   bob@test.com / password123

👑 Admin account:
   admin@askearn.com / admin123
```

### Step 3: Restart the Server

Stop the server (Ctrl+C) and restart:
```bash
npm run dev
```

### Step 4: Try Logging In

Go to http://localhost:3000/login

Try these accounts:
- **alice@test.com** / password123
- **bob@test.com** / password123
- **admin@askearn.com** / admin123

---

## 🔍 Common Login Issues

### Issue 1: "Invalid email or password"

**Cause:** Database not seeded or wrong credentials

**Solution:**
```bash
npm run seed
```

Then use exact credentials:
- Email: `alice@test.com` (lowercase, no spaces)
- Password: `password123` (no spaces)

---

### Issue 2: Server Not Running

**Symptoms:** Page won't load or "Cannot connect"

**Solution:**
```bash
# Make sure server is running
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
✓ Ready on http://localhost:3000
```

---

### Issue 3: Database Locked

**Symptoms:** "Database is locked" error

**Solution:**
```bash
# Stop the server (Ctrl+C)
# Delete the database
Remove-Item server/askearn.db
# Re-seed
npm run seed
# Restart
npm run dev
```

---

### Issue 4: Module Not Found

**Symptoms:** "Cannot find module" errors

**Solution:**
```bash
# Clear everything and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
npm install
npm run seed
npm run dev
```

---

### Issue 5: CORS Error

**Symptoms:** "CORS policy" error in browser console

**Solution:**
Make sure both servers are running:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

Check `server/index.js` has:
```javascript
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
```

---

### Issue 6: Cookie Not Set

**Symptoms:** Login seems successful but redirects back to login

**Solution:**
1. Clear browser cookies
2. Make sure you're using http://localhost:3000 (not 127.0.0.1)
3. Check browser console for errors

---

## 🧪 Test Login Manually

### Test 1: Check Server is Running
Open http://localhost:5000/api/questions

You should see JSON response (might be empty array).

### Test 2: Check Frontend is Running
Open http://localhost:3000

You should see the login page.

### Test 3: Check Database
```bash
node fix-login.js
```

Should show all users.

### Test 4: Test API Directly

Using PowerShell:
```powershell
$body = @{
    email = "alice@test.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
```

Should return user data.

---

## 📋 Quick Checklist

Before asking for help, verify:

- [ ] Ran `npm install`
- [ ] Ran `npm run seed`
- [ ] Server is running (`npm run dev`)
- [ ] Using correct URL (http://localhost:3000)
- [ ] Using correct credentials (alice@test.com / password123)
- [ ] No typos in email/password
- [ ] Browser console shows no errors
- [ ] Both backend (5000) and frontend (3000) are running

---

## 🔄 Complete Reset

If nothing works, do a complete reset:

```bash
# 1. Stop server (Ctrl+C)

# 2. Clean everything
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
Remove-Item server/askearn.db

# 3. Reinstall
npm install

# 4. Seed database
npm run seed

# 5. Start fresh
npm run dev
```

Then try logging in with:
- Email: `alice@test.com`
- Password: `password123`

---

## 🐛 Still Not Working?

### Check Server Logs

Look at the terminal where `npm run dev` is running. You should see:
```
🚀 Server running on http://localhost:5000
✓ Ready on http://localhost:3000
```

If you see errors, read them carefully.

### Check Browser Console

1. Open browser (Chrome/Edge)
2. Press F12
3. Go to Console tab
4. Try logging in
5. Look for red error messages

### Check Network Tab

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try logging in
4. Look for the `/api/auth/login` request
5. Check if it's returning 401, 500, or other error

---

## 💡 Common Mistakes

### ❌ Wrong Email Format
```
alice@test.com ✅
Alice@test.com ❌ (capital A)
alice @test.com ❌ (space)
alice@test ❌ (incomplete)
```

### ❌ Wrong Password
```
password123 ✅
Password123 ❌ (capital P)
password 123 ❌ (space)
password ❌ (incomplete)
```

### ❌ Wrong URL
```
http://localhost:3000 ✅
http://127.0.0.1:3000 ❌ (use localhost)
localhost:3000 ❌ (missing http://)
http://localhost:5000 ❌ (that's the backend)
```

---

## 🎯 Expected Behavior

### Successful Login:
1. Enter email and password
2. Click "Login"
3. Button shows "Logging in..."
4. Redirects to homepage (/)
5. See question feed
6. See your name and coins in navbar

### Failed Login:
1. Enter wrong credentials
2. Click "Login"
3. Red error message appears
4. Stay on login page
5. Try again with correct credentials

---

## 🔐 Test Accounts Reference

| Email | Password | Coins | Role |
|-------|----------|-------|------|
| alice@test.com | password123 | 150 | User |
| bob@test.com | password123 | 200 | User |
| admin@askearn.com | admin123 | 10000 | Admin |

**Note:** Passwords are case-sensitive!

---

## 🆘 Emergency Fix

If absolutely nothing works:

1. **Download fresh copy** (if you have backup)
2. **Or run this:**

```bash
# Nuclear option - start completely fresh
cd ..
Remove-Item -Recurse -Force Askearn
# Re-extract or re-clone the project
cd Askearn
npm install
npm run seed
npm run dev
```

---

## 📞 Getting Help

If you still can't login after trying everything above:

1. Run `node fix-login.js` and share the output
2. Check server terminal for errors
3. Check browser console (F12) for errors
4. Share the exact error message you're seeing

---

## ✅ Success Indicators

You'll know login is working when:
- ✅ No errors in terminal
- ✅ No errors in browser console
- ✅ Redirects to homepage after login
- ✅ See your name in navbar
- ✅ See coin balance in navbar
- ✅ Can navigate to other pages

---

**Most Common Fix:** Just run `npm run seed` again! 🎯
