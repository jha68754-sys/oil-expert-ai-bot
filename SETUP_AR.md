# دليل التثبيت والتشغيل 🚀

## الخطوة الأولى: الحصول على مفتاح OpenAI

### 1. انتقل إلى موقع OpenAI
- اذهب إلى: https://platform.openai.com/api-keys
- سجل الدخول أو أنشئ حساباً جديداً

### 2. أنشئ مفتاح API جديد
- انقر على "Create new secret key"
- انسخ المفتاح وحفظه في مكان آمن
- **تحذير**: لا تشارك هذا المفتاح مع أحد!

### 3. تحقق من الرصيد
- تأكد من وجود رصيد في حسابك
- OpenAI توفر $5 رصيد مجاني للمستخدمين الجدد

---

## الطريقة الأولى: التشغيل على جهازك الشخصي 💻

### المتطلبات:
- Windows أو Mac أو Linux
- Node.js (الإصدار 14 أو أحدث)

### خطوات التثبيت:

**1. تحميل Node.js**
- اذهب إلى: https://nodejs.org/
- حمّل الإصدار LTS (الموصى به)
- ثبّت البرنامج

**2. فتح سطر الأوامر (Terminal)**

Windows:
- اضغط على `Windows + R`
- اكتب `cmd` واضغط Enter

Mac/Linux:
- ابحث عن "Terminal" في التطبيقات

**3. انتقل إلى مجلد البوت**

```bash
# على Windows
cd C:\Users\YourName\Downloads\petroleum-bot-standalone

# على Mac/Linux
cd ~/Downloads/petroleum-bot-standalone
```

**4. ثبّت المكتبات**

```bash
npm install
```

ستظهر رسائل التثبيت، انتظر حتى ينتهي.

**5. أنشئ ملف .env**

Windows (استخدم Notepad):
- افتح Notepad
- انسخ النص أدناه
- احفظ الملف باسم `.env` في مجلد البوت

Mac/Linux (استخدم Terminal):

```bash
cat > .env << EOF
TELEGRAM_BOT_TOKEN=8808282761:AAFnFOt-sMTjku2YRkArQ2HWfifcxcUbYXU
OPENAI_API_KEY=your_api_key_here
OPENAI_API_BASE=https://api.openai.com/v1
EOF
```

**محتوى ملف .env:**

```
TELEGRAM_BOT_TOKEN=8808282761:AAFnFOt-sMTjku2YRkArQ2HWfifcxcUbYXU
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_API_BASE=https://api.openai.com/v1
```

**استبدل `sk-your-actual-api-key-here` بمفتاح OpenAI الفعلي الخاص بك!**

**6. شغّل البوت**

```bash
npm start
```

ستظهر رسائل مثل:
```
✅ Bot initialized with:
   - Telegram Bot Token: 8808282761:...
   - OpenAI API Base: https://api.openai.com/v1
🚀 Starting Telegram bot polling...
```

**7. اختبر البوت**

- افتح تطبيق Telegram
- ابحث عن البوت أو استخدم الرابط
- أرسل رسالة مثل: "ما هو الفرق بين الحفر الرطب والجاف؟"
- البوت سيرد عليك!

**8. إيقاف البوت**

اضغط `Ctrl + C` في سطر الأوامر

---

## الطريقة الثانية: التشغيل على GitHub Actions (مجاني 24/7) 🌟

هذه الطريقة الأفضل لأن البوت سيعمل تلقائياً بدون الحاجة لتشغيل جهازك!

### الخطوات:

**1. أنشئ حساب GitHub (إذا لم يكن لديك)**
- اذهب إلى: https://github.com/signup
- أنشئ حساباً جديداً

**2. أنشئ مستودع جديد**
- اذهب إلى: https://github.com/new
- اكتب اسم المستودع: `petroleum-bot`
- اختر "Public" (عام)
- انقر "Create repository"

**3. أضف ملفات البوت**

الطريقة الأولى (عبر الويب):
- انقر على "Add file" → "Upload files"
- اختر جميع ملفات البوت
- اكتب رسالة commit: "Initial commit"
- انقر "Commit changes"

الطريقة الثانية (عبر Git - للمتقدمين):
```bash
git clone https://github.com/your-username/petroleum-bot.git
cd petroleum-bot
# انسخ ملفات البوت هنا
git add .
git commit -m "Initial commit"
git push origin main
```

**4. أضف الأسرار (Secrets)**

- في صفحة المستودع، انقر على "Settings"
- اختر "Secrets and variables" → "Actions"
- انقر "New repository secret"

أضف السرين التاليين:

**السر الأول:**
- Name: `TELEGRAM_BOT_TOKEN`
- Value: `8808282761:AAFnFOt-sMTjku2YRkArQ2HWfifcxcUbYXU`
- انقر "Add secret"

**السر الثاني:**
- Name: `OPENAI_API_KEY`
- Value: (مفتاح OpenAI الخاص بك)
- انقر "Add secret"

**5. تفعيل Workflow**

- انقر على تبويب "Actions"
- يجب أن ترى "Petroleum Engineering Bot"
- انقر عليه
- انقر "Run workflow" → "Run workflow"

**6. مراقبة التشغيل**

- انقر على الـ workflow الذي يعمل
- ستظهر سجلات التشغيل
- يجب أن ترى "✅ Bot initialized"

**7. التشغيل التلقائي**

الآن البوت سيعمل تلقائياً كل 5 دقائق! 🎉

يمكنك التحقق من السجلات في:
- "Actions" → "Petroleum Engineering Bot" → آخر تشغيل

---

## التحقق من أن البوت يعمل ✅

### اختبر البوت على Telegram:

1. افتح تطبيق Telegram
2. ابحث عن البوت أو استخدم الرابط
3. أرسل رسالة اختبار:

**بالعربية:**
```
السلام عليكم، ما هو الفرق بين هندسة الحفر وهندسة الإنتاج؟
```

**بالإنجليزية:**
```
What is the difference between drilling engineering and production engineering?
```

4. انتظر الرد (قد يستغرق 10-30 ثانية)
5. البوت سيرد عليك بإجابة مفصلة!

---

## حل المشاكل الشائعة 🔧

### المشكلة 1: "TELEGRAM_BOT_TOKEN not set"

**السبب**: ملف `.env` غير موجود أو غير صحيح

**الحل**:
1. تأكد من وجود ملف `.env` في نفس مجلد `bot.js`
2. تأكد من أن المحتوى صحيح (انسخ من الأعلى)
3. أعد تشغيل البوت

### المشكلة 2: "OPENAI_API_KEY not set"

**السبب**: مفتاح OpenAI غير موجود

**الحل**:
1. اذهب إلى https://platform.openai.com/api-keys
2. أنشئ مفتاح جديد
3. انسخه إلى ملف `.env`
4. أعد تشغيل البوت

### المشكلة 3: البوت لا يرد على الرسائل

**السبب**: قد يكون البوت لا يعمل أو هناك خطأ

**الحل**:
1. تحقق من رسائل الخطأ في Terminal
2. تأكد من أن البوت يعمل (يجب أن ترى "🚀 Starting Telegram bot polling...")
3. تأكد من اتصالك بالإنترنت
4. جرب إرسال رسالة أخرى

### المشكلة 4: خطأ من OpenAI

**الحل**:
1. تأكد من أن لديك رصيد في حسابك
2. تحقق من أن مفتاح API صحيح
3. جرب مفتاح API جديد
4. تأكد من عدم انتهاء صلاحية المفتاح

---

## نصائح مهمة ⚠️

1. **لا تشارك ملف `.env`**: يحتوي على مفاتيح سرية!
2. **أضف `.env` إلى `.gitignore`**: حتى لا تنشره على GitHub
3. **راقب استخدام OpenAI**: قد تتكبد رسوماً إذا تجاوزت الحد المجاني
4. **احفظ سجل المحادثات**: يتم حفظه تلقائياً في `conversation_history.json`

---

## الدعم والمساعدة 💬

إذا واجهت مشاكل:

1. اقرأ رسائل الخطأ بعناية
2. تحقق من أن جميع المتطلبات مثبتة
3. جرب إعادة تشغيل البوت
4. تأكد من الاتصال بالإنترنت

---

**تهانينا! 🎉 البوت جاهز للعمل!**

استمتع بالبوت وأرسل أسئلتك في الهندسة النفطية!
