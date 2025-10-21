# ⚠️ Server Error Fix - Environment Variables

## Problem: Server Error

Agar "Server error" aa raha hai, to most likely **environment variables missing** hain Vercel mein.

---

## ✅ Fix: Environment Variables Add Karein

### Step 1: Vercel Dashboard Kholein

1. https://vercel.com/dashboard par jayein
2. Apna **askearn** project kholein
3. **Settings** tab par click karein
4. Left sidebar mein **Environment Variables** par click karein

### Step 2: Check Karein Ye Variables Hain Ya Nahi

Ye **3 variables** hone chahiye:

#### Variable 1: DATABASE_URL
```
Name: DATABASE_URL
Value: postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
Environment: Production, Preview, Development (teeno check karein)
```

#### Variable 2: JWT_SECRET
```
Name: JWT_SECRET
Value: any-random-secure-string-min-32-characters
Environment: Production, Preview, Development (teeno check karein)
```

#### Variable 3: NODE_ENV
```
Name: NODE_ENV
Value: production
Environment: Production, Preview, Development (teeno check karein)
```

---

## 🔑 Supabase Connection String Kaise Milega?

### Step 1: Supabase Dashboard
1. https://supabase.com/dashboard par jayein
2. Apna project select karein

### Step 2: Connection String Copy Karein
1. **Settings** (gear icon) par click karein
2. **Database** section mein jayein
3. Scroll down to **"Connection string"**
4. **URI** tab select karein
5. String copy karein:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```
6. **[YOUR-PASSWORD]** ko apne actual database password se replace karein

---

## 🚀 After Adding Variables

### Important: Redeploy Karna Zaroori Hai!

Environment variables add karne ke **baad** redeploy karein:

#### Method 1: Vercel Dashboard
1. **Deployments** tab par jayein
2. Latest deployment par **3 dots (⋯)** click karein
3. **Redeploy** click karein
4. Confirm karein

#### Method 2: CLI
```bash
vercel --prod
```

#### Method 3: Git Push
```bash
git add .
git commit -m "Fix environment variables"
git push origin main
```

---

## 🧪 Test Karein

Redeploy hone ke baad:

1. **App kholein**: https://askearn.vercel.app
2. **Sign up** try karein
3. Agar sign up successful hai = Environment variables sahi hain ✅
4. Agar phir bhi error = Logs check karein

---

## 📊 Logs Kaise Check Karein

### Vercel Dashboard Mein:
1. **Deployments** tab
2. Latest deployment par click karein
3. **Functions** tab
4. **Logs** dekhein

Common errors:
- `DATABASE_URL is not defined` = DATABASE_URL missing
- `Connection refused` = DATABASE_URL wrong hai
- `JWT_SECRET is not defined` = JWT_SECRET missing

---

## ✅ Checklist

- [ ] DATABASE_URL added in Vercel
- [ ] JWT_SECRET added in Vercel
- [ ] NODE_ENV added in Vercel
- [ ] All variables have "Production" environment selected
- [ ] Redeployed after adding variables
- [ ] Tested sign up/login

---

## 🆘 Still Getting Error?

### Check These:

1. **Supabase Project Active Hai?**
   - Supabase dashboard mein check karein
   - Free tier projects pause ho jate hain after inactivity

2. **Password Correct Hai?**
   - Connection string mein password sahi hai?
   - Special characters escape karne pade?

3. **Database Tables Bane Hain?**
   - Supabase → Table Editor
   - Check if tables exist

---

## 🔧 Quick Fix Commands

```bash
# Check current deployment
vercel ls

# Redeploy
vercel --prod

# Check if env vars are set (locally)
echo $DATABASE_URL
```

---

**Most common issue: Environment variables missing in Vercel!**

Add karein aur redeploy karein, sab theek ho jayega! 🚀
