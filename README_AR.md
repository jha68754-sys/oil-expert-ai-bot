# بوت تليجرام متخصص في الهندسة النفطية 🤖

## نظرة عامة

بوت تليجرام ثنائي اللغة (عربي/إنجليزي) متخصص في الهندسة النفطية. يستخدم تقنية OpenAI API لتقديم إجابات ذكية وموثوقة عن جميع جوانب الهندسة النفطية.

### المميزات الرئيسية ✨

- **ثنائي اللغة**: يتحدث العربية والإنجليزية بطلاقة
- **متخصص في الهندسة النفطية**: يغطي جميع المجالات:
  - هندسة الحفر (Drilling Engineering)
  - هندسة الإنتاج (Production Engineering)
  - هندسة المكامن (Reservoir Engineering)
  - إكمال الآبار (Well Completion)
  - استرجاع النفط المحسّن (Enhanced Oil Recovery)
  - الجيولوجيا النفطية (Petroleum Geology)
  - اختبار الآبار (Well Testing)
  - هندسة خطوط الأنابيب (Pipeline Engineering)
  - الصحة والسلامة والبيئة (HSE)
  - الحسابات والصيغ النفطية

- **ذاكرة محادثة**: يحتفظ بسجل المحادثات لكل مستخدم
- **مجاني تماماً**: لا توجد تكاليف تشغيل (إذا استخدمت الخطة المجانية من OpenAI)
- **يعمل 24/7**: يمكن تشغيله على GitHub Actions أو على جهازك الشخصي

---

## المتطلبات 📋

### قبل البدء، ستحتاج إلى:

1. **حساب Telegram Bot**
   - تم توفيره بالفعل: `8808282761:AAFnFOt-sMTjku2YRkArQ2HWfifcxcUbYXU`

2. **مفتاح OpenAI API**
   - انتقل إلى https://platform.openai.com/api-keys
   - أنشئ مفتاح API جديد (أو استخدم مفتاح موجود)
   - احفظ المفتاح بأمان

3. **Node.js**
   - تحميل من https://nodejs.org/ (الإصدار 14 أو أحدث)

---

## التثبيت والتشغيل المحلي 🚀

### الخطوة 1: تثبيت المتطلبات

```bash
# انسخ ملفات البوت إلى مجلد على جهازك
cd petroleum-bot-standalone

# ثبت المكتبات المطلوبة
npm install
```

### الخطوة 2: إعداد متغيرات البيئة

أنشئ ملف `.env` في نفس المجلد:

```bash
# Linux / macOS
cat > .env << EOF
TELEGRAM_BOT_TOKEN=8808282761:AAFnFOt-sMTjku2YRkArQ2HWfifcxcUbYXU
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_API_BASE=https://api.openai.com/v1
EOF

# Windows (استخدم محرر نصوص)
# أنشئ ملف .env وأضف السطور أعلاه
```

**ملاحظة مهمة**: استبدل `your_openai_api_key_here` بمفتاح OpenAI الفعلي الخاص بك.

### الخطوة 3: تشغيل البوت

```bash
# تشغيل البوت
npm start

# أو مباشرة
node bot.js
```

ستظهر رسالة مثل:
```
✅ Bot initialized with:
   - Telegram Bot Token: 8808282761:...
   - OpenAI API Base: https://api.openai.com/v1
🚀 Starting Telegram bot polling...
```

### الخطوة 4: اختبر البوت

افتح تطبيق Telegram وابحث عن البوت أو استخدم الرابط:
- اسأل البوت عن موضوع في الهندسة النفطية
- البوت سيرد عليك بالعربية إذا كتبت بالعربية، وبالإنجليزية إذا كتبت بالإنجليزية

---

## التشغيل على GitHub Actions (مجاني 24/7) 🌟

هذا هو الخيار الأفضل للتشغيل المستمر بدون تكاليف!

### الخطوة 1: انسخ المستودع إلى GitHub

1. انتقل إلى https://github.com/new
2. أنشئ مستودع جديد باسم `petroleum-bot`
3. انسخ ملفات البوت إلى المستودع

### الخطوة 2: أضف أسرار GitHub

1. في صفحة المستودع، انتقل إلى **Settings** → **Secrets and variables** → **Actions**
2. أضف سرين جديدين:
   - **TELEGRAM_BOT_TOKEN**: `8808282761:AAFnFOt-sMTjku2YRkArQ2HWfifcxcUbYXU`
   - **OPENAI_API_KEY**: (مفتاح OpenAI الخاص بك)

### الخطوة 3: أنشئ GitHub Actions Workflow

أنشئ ملف `.github/workflows/bot.yml`:

```yaml
name: Petroleum Bot

on:
  schedule:
    # تشغيل البوت كل 5 دقائق
    - cron: '*/5 * * * *'
  workflow_dispatch:  # السماح بالتشغيل اليدوي

jobs:
  run-bot:
    runs-on: ubuntu-latest
    timeout-minutes: 4
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run bot
        env:
          TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          OPENAI_API_BASE: https://api.openai.com/v1
        run: timeout 240 node bot.js || true
```

### الخطوة 4: تفعيل Workflow

1. ادفع الملفات إلى GitHub
2. انتقل إلى **Actions** في المستودع
3. يجب أن ترى `Petroleum Bot` في القائمة
4. يمكنك الضغط على **Run workflow** لاختباره يدوياً

**النتيجة**: البوت سيعمل تلقائياً كل 5 دقائق بدون أي تكلفة! 🎉

---

## الخيارات البديلة للتشغيل المستمر

### 1. استخدام Heroku (مجاني مع قيود)
- ملاحظة: Heroku ألغت خطتها المجانية، لكن يمكنك محاولة خدمات أخرى مثل Render أو Railway

### 2. استخدام جهاز Raspberry Pi
- شغّل البوت على جهاز صغير في منزلك
- يعمل 24/7 بتكلفة كهرباء منخفضة جداً

### 3. استخدام VPS رخيص
- خدمات مثل DigitalOcean أو Linode توفر أجهزة افتراضية برخص معقولة
- تكلفة تبدأ من 4-5 دولارات شهرياً

---

## استكشاف الأخطاء 🔧

### المشكلة: "TELEGRAM_BOT_TOKEN environment variable is not set"
**الحل**: تأكد من أن ملف `.env` موجود وفيه المتغيرات الصحيحة

### المشكلة: "OPENAI_API_KEY environment variable is not set"
**الحل**: أضف مفتاح OpenAI API إلى ملف `.env`

### المشكلة: البوت لا يرد على الرسائل
**الحل**: 
- تأكد من أن البوت يعمل (ستظهر رسائل في الـ console)
- تحقق من أن مفتاح OpenAI صحيح ولديه رصيد
- تأكد من اتصالك بالإنترنت

### المشكلة: رسائل الخطأ من OpenAI
**الحل**: 
- تحقق من أن لديك رصيد كافي في حسابك
- تأكد من أن المفتاح لم ينتهِ صلاحيته
- جرب مفتاح API جديد

---

## هيكل الملفات 📁

```
petroleum-bot-standalone/
├── bot.js                    # البوت الرئيسي
├── package.json              # متطلبات Node.js
├── .env                      # متغيرات البيئة (لا تشاركها!)
├── conversation_history.json # سجل المحادثات (ينشأ تلقائياً)
├── README_AR.md              # هذا الملف
├── README.md                 # النسخة الإنجليزية
└── .github/
    └── workflows/
        └── bot.yml           # GitHub Actions workflow
```

---

## الأسئلة الشائعة ❓

**س: هل البوت مجاني تماماً؟**
ج: البوت نفسه مجاني، لكن ستحتاج إلى مفتاح OpenAI. OpenAI توفر $5 رصيد مجاني للمستخدمين الجدد.

**س: كم عدد الرسائل التي يمكن للبوت معالجتها؟**
ج: يعتمد على حد الاستخدام في حسابك على OpenAI. الخطة المجانية كافية للاستخدام الشخصي.

**س: هل يمكن تشغيل البوت على أكثر من جهاز؟**
ج: نعم، لكن تأكد من عدم تشغيل نسختين في نفس الوقت (قد يسبب مشاكل).

**س: كيف أحفظ سجل المحادثات؟**
ج: البوت يحفظ تلقائياً في ملف `conversation_history.json`

**س: هل يمكن تخصيص البوت أكثر؟**
ج: نعم! يمكنك تعديل `getPetroleumSystemPrompt()` في `bot.js` لتغيير السلوك

---

## الدعم والمساعدة 💬

إذا واجهت مشاكل:

1. تحقق من رسائل الخطأ في console
2. تأكد من صحة متغيرات البيئة
3. جرب تشغيل البوت محلياً أولاً قبل GitHub Actions
4. تحقق من حسابك على OpenAI وتأكد من وجود رصيد

---

## الترخيص 📄

هذا المشروع مرخص تحت MIT License

---

**استمتع بالبوت! 🚀**

لأي أسئلة أو اقتراحات، يمكنك تعديل الكود حسب احتياجاتك!
