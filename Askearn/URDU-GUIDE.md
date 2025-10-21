# AskEarn Task System - اردو گائیڈ

## خلاصہ (Overview)
AskEarn اب ایک Task-based earning platform ہے جہاں users سوالات کے جوابات دے کر coins کماتے ہیں۔

## اہم خصوصیات (Key Features)

### 1. Task System
- **5 Task Levels**: 5, 15, 25, 35, اور 50 سوالات
- **24 گھنٹے کی Deadline**: 24 گھنٹوں میں مکمل کریں
- **ایک وقت میں ایک Task**: صرف ایک active task
- **آپ کی مرضی**: جو چاہیں task منتخب کریں

### 2. Earning System
- **ہر سوال پر 20 Coins**: قدرتی جوابات کے لیے
- **500 Coins = $1 USD**: واضح conversion rate
- **فوری انعام**: جواب submit کرتے ہی coins ملیں گے
- **AI Detection**: صرف قدرتی جوابات پر coins ملیں گے

### 3. User Assessment (شروع میں)
- **5 سوالات**: آپ کی personality جاننے کے لیے
- **Personality Analysis**: آپ کی قسم معلوم کریں
- **Skill Level**: آپ کی صلاحیت کا تعین
- **دلچسپیاں**: آپ کی interests

## شروع کرنے کا طریقہ (Setup)

### 1. پہلی بار Setup
```bash
# Task questions database میں ڈالیں
npm run seed-tasks
```

### 2. Application شروع کریں
```bash
# دونوں server اور client شروع کریں
npm run dev
```

### 3. Application کھولیں
- **Home Page**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Signup**: http://localhost:3000/signup

## استعمال کا طریقہ (User Flow)

### نئے User کے لیے
1. **Home Page** → Earning potential دیکھیں
2. **Signup** → Account بنائیں (100 coins bonus)
3. **Assessment** → 5 سوالات کے جوابات دیں
4. **Task چنیں** → 5 levels میں سے کوئی ایک
5. **Task مکمل کریں** → 24 گھنٹوں میں جوابات دیں
6. **Coins کمائیں** → قدرتی جوابات پر payment
7. **Withdraw** → Coins کو پیسوں میں بدلیں

### پرانے User کے لیے
1. **Home Page** → Auto-redirect tasks page پر
2. **Tasks Page** → Active task دیکھیں یا نیا شروع کریں
3. **Task کریں** → سوالات کے جوابات دیں
4. **مکمل کریں** → Coins کمائیں

## Task Levels (تفصیل)

| Level | سوالات | Total Coins | Dollar Value | وقت |
|-------|---------|-------------|--------------|-----|
| 1 - Beginner | 5 | 100 | $0.20 | 10-15 منٹ |
| 2 - Intermediate | 15 | 300 | $0.60 | 30-45 منٹ |
| 3 - Advanced | 25 | 500 | $1.00 | 1-1.5 گھنٹے |
| 4 - Expert | 35 | 700 | $1.40 | 1.5-2 گھنٹے |
| 5 - Master | 50 | 1000 | $2.00 | 2-3 گھنٹے |

## قدرتی جوابات لکھنے کے Tips

### ✅ کریں:
- اپنے الفاظ میں لکھیں
- عام بول چال کی زبان استعمال کریں
- ذاتی تجربات شیئر کریں
- اپنی رائے دیں
- چھوٹے contractions استعمال کریں (I'm, don't)
- معمولی غلطیاں قدرتی ہیں

### ❌ نہ کریں:
- AI tools سے copy نہ کریں
- بہت formal language نہ لکھیں
- بالکل perfect essays نہ لکھیں
- "in conclusion" جیسے phrases نہ لکھیں
- بہت لمبے جوابات نہ دیں

## AI Detection کیسے کام کرتا ہے

### Score System
- **0-39**: قدرتی (انسانی) → مکمل coins ملیں گے
- **40-59**: شک والا → coins نہیں ملیں گے
- **60-100**: AI سے بنا → coins نہیں ملیں گے

### کیا Check کرتا ہے
1. AI جیسے phrases
2. بہت formal language
3. Perfect structure
4. قدرتی نشانیاں (typos, casual language)
5. Sentence consistency
6. ذاتی expressions

## عام مسائل (Troubleshooting)

### Task Questions نہیں دکھ رہے
```bash
npm run seed-tasks
```

### Assessment پر پھنس گئے
- "Skip for now" پر click کریں
- بعد میں مکمل کر سکتے ہیں

### Deadline ختم ہو گئی
- Task automatically expire ہو جاتا ہے
- نیا task شروع کریں
- Expired tasks پر coins نہیں ملتے

### Coins نہیں ملے
- جواب AI جیسا لگا
- زیادہ casual لکھیں
- ذاتی تجربات شامل کریں

## اہم نکات (Important Points)

### یاد رکھیں
1. ✅ ایک وقت میں صرف ایک task
2. ⏰ 24 گھنٹوں میں مکمل کریں
3. 💰 20 coins ہر قدرتی جواب پر
4. 🤖 AI جوابات پر coins نہیں
5. 💵 500 coins = $1 USD

### کامیابی کے لیے
- روزانہ tasks کریں
- قدرتی انداز میں لکھیں
- وقت پر مکمل کریں
- ذاتی تجربات شیئر کریں
- عام زبان استعمال کریں

## مثالیں (Examples)

### ❌ غلط جواب (AI جیسا)
```
"It is important to note that hobbies play a crucial role in our lives. 
Furthermore, they provide us with relaxation and personal growth. 
In conclusion, hobbies are essential for well-being."
```

### ✅ صحیح جواب (قدرتی)
```
"میری پسندیدہ hobby cricket کھیلنا ہے کیونکہ مجھے بہت مزہ آتا ہے۔ 
میں اپنے دوستوں کے ساتھ weekend پر کھیلتا ہوں اور یہ بہت relaxing ہے۔ 
Cricket سے مجھے stress کم ہوتا ہے اور میں fresh feel کرتا ہوں۔"
```

## کمائی کی مثالیں (Earning Examples)

### روزانہ کی کمائی
- **1 Beginner Task**: $0.20 (15 منٹ)
- **1 Intermediate Task**: $0.60 (45 منٹ)
- **1 Advanced Task**: $1.00 (1.5 گھنٹے)

### ہفتہ وار کمائی
- روزانہ 1 Advanced Task = $7/week
- روزانہ 1 Expert Task = $9.80/week
- روزانہ 1 Master Task = $14/week

### ماہانہ کمائی
- روزانہ 1 Advanced Task = $30/month
- روزانہ 1 Expert Task = $42/month
- روزانہ 1 Master Task = $60/month

## Support

### مدد کے لیے
1. TASK-SYSTEM-GUIDE.md دیکھیں (انگلش میں تفصیل)
2. Troubleshooting section چیک کریں
3. Admin سے رابطہ کریں

## آخری بات

یہ platform آپ کو گھر بیٹھے پیسے کمانے کا موقع دیتا ہے۔ بس قدرتی انداز میں جوابات لکھیں اور وقت پر tasks مکمل کریں۔

**یاد رکھیں**: صرف قدرتی، انسانی جوابات پر coins ملتے ہیں۔ AI استعمال نہ کریں!

---

**خوش آمدید اور کامیابی کی دعائیں! 🎉**
