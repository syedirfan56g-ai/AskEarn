# 🔴 ERROR 404 FIX - Backend Server Issue

## ❌ Problem:
```
GET http://localhost:5000/api/auth/me 404 (Not Found)
```

Matlab: **Backend server nahi chal raha hai!**

---

## ✅ SOLUTION (Simple):

### **Step 1: Check Karo Server Chal Raha Hai Ya Nahi**

Terminal mein dekho, ye dikhna chahiye:
```
🚀 Server running on http://localhost:5000
✓ Ready on http://localhost:3000
```

**Agar nahi dikha raha, to server nahi chal raha!**

---

### **Step 2: Server Start Karo**

```bash
npm run dev
```

Ye command **dono servers** start karegi:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

---

### **Step 3: Verify Karo**

Browser mein ye URL kholo:
```
http://localhost:5000/api/questions
```

**Agar ye dikhe:**
```json
[]
```
Ya koi questions list, to **server chal raha hai!** ✅

**Agar "Cannot connect" dikhe, to server nahi chal raha!** ❌

---

## 🔍 Common Issues:

### Issue 1: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Stop all node processes
taskkill /F /IM node.exe

# Start again
npm run dev
```

---

### Issue 2: Module Not Found

**Error:**
```
Cannot find module 'express'
```

**Solution:**
```bash
npm install
npm run dev
```

---

### Issue 3: Database Error

**Error:**
```
SQLITE_ERROR: no such table
```

**Solution:**
```bash
Remove-Item server/askearn.db -Force
npm run seed
npm run dev
```

---

## 🎯 Complete Fix (Do Everything):

```bash
# Step 1: Stop everything
taskkill /F /IM node.exe

# Step 2: Clean install
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
npm install

# Step 3: Fresh database
Remove-Item server/askearn.db -Force
npm run seed

# Step 4: Start server
npm run dev
```

---

## ✅ Success Check:

### Test 1: Backend Running
```
http://localhost:5000/api/questions
```
Should show: `[]` or questions list

### Test 2: Frontend Running
```
http://localhost:3000
```
Should show: Login page

### Test 3: Both Working Together
1. Go to http://localhost:3000/login
2. Open F12 (Console)
3. Type: alice@test.com
4. Type: password123
5. Click Login
6. Check console - should NOT show 404 error

---

## 📋 Terminal Output Should Look Like:

```
> askearn@1.0.0 dev
> concurrently "npm run server" "npm run client"

[0] 
[0] > askearn@1.0.0 server
[0] > nodemon server/index.js
[0] 
[1] 
[1] > askearn@1.0.0 client
[1] > next dev
[1] 
[0] [nodemon] starting `node server/index.js`
[0] 🚀 Server running on http://localhost:5000
[1]   ▲ Next.js 14.0.0
[1]   - Local:        http://localhost:3000
[1] 
[1]  ✓ Ready in 2.3s
```

**Dono servers chal rahe hain!** ✅

---

## 🆘 Agar Phir Bhi 404 Aaye:

### Check 1: Terminal
Dekho kya error aa raha hai server terminal mein

### Check 2: Port
```bash
# Check if port 5000 is free
netstat -ano | findstr :5000
```

### Check 3: Firewall
Windows Firewall ne block to nahi kiya?

---

## 💡 Quick Test Command:

```bash
# Test if backend is responding
curl http://localhost:5000/api/questions
```

**Should return:** `[]` or questions

**If error:** Server not running!

---

## 🎯 Final Solution:

**SABSE PEHLE YE KARO:**

1. **Terminal band karo** (Ctrl+C)
2. **Naya terminal kholo**
3. **Ye command run karo:**
   ```bash
   npm run dev
   ```
4. **Wait karo** jab tak ye dikhe:
   ```
   🚀 Server running on http://localhost:5000
   ✓ Ready in 2.3s
   ```
5. **Ab login try karo**

---

**Agar server start nahi ho raha, to error message copy karke bhejo!** 📸
