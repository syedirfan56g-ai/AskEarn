# 🔧 FIX LOGIN ISSUE - DO THIS NOW!

## ⚡ FASTEST FIX (3 Steps)

### Step 1: Double-click this file
```
RESET-DATABASE.bat
```
Just double-click it and press any key when asked.

### Step 2: Start the server
```bash
npm run dev
```

### Step 3: Login
- Go to: http://localhost:3000/login
- Email: `alice@test.com`
- Password: `password123`

---

## 🛠️ OR Manual Fix

If the batch file doesn't work, run these commands one by one:

### 1. Delete old database
```bash
Remove-Item server/askearn.db
```

### 2. Create new database
```bash
npm run seed
```

### 3. Start server
```bash
npm run dev
```

### 4. Login
- Email: `alice@test.com`
- Password: `password123`

---

## ❓ What Was Wrong?

The database was missing the `is_admin` column that was added for the admin panel. 

The fix: Delete old database and create a fresh one with all the new columns.

---

## ✅ After Fix

You'll be able to:
- ✅ Login with alice@test.com / password123
- ✅ Login with bob@test.com / password123
- ✅ Login as admin with admin@askearn.com / admin123
- ✅ Sign up new accounts
- ✅ Use all features

---

## 🎯 Test It

1. Run `RESET-DATABASE.bat`
2. Run `npm run dev`
3. Go to http://localhost:3000/login
4. Type: alice@test.com
5. Type: password123
6. Click Login
7. ✅ You're in!

---

**Just run RESET-DATABASE.bat and you're good to go!** 🚀
