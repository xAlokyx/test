# 📖 دليل التنصيب والتشغيل - Installation Guide

## نظام إدارة المحتوى العربي

---

## 📋 المتطلبات الأساسية

- **Node.js** (الإصدار 14 أو أحدث)
- **npm** (يأتي مع Node.js)

### التحقق من التثبيت

```bash
node --version    # يجب أن يكون v14.0.0 أو أحدث
npm --version     # يجب أن يكون 6.0.0 أو أحدث
```

---

## 🚀 خطوات التنصيب

### 1️⃣ تثبيت الحزم

```bash
npm install
```

هذا الأمر سيقوم بتثبيت جميع الحزم المطلوبة:
- express (إطار عمل الويب)
- sqlite3 (قاعدة البيانات)
- jsonwebtoken (نظام المصادقة)
- bcryptjs (تشفير كلمات المرور)
- multer (رفع الملفات)
- cors (السماح بالطلبات)

### 2️⃣ إعداد متغيرات البيئة (اختياري لكن منصوح به)

```bash
# نسخ ملف المثال
cp .env.example .env

# توليد مفتاح JWT عشوائي قوي
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# افتح ملف .env وأضف المفتاح المُولّد
# JWT_SECRET=your-generated-secret-key-here
```

### 3️⃣ تهيئة قاعدة البيانات

```bash
npm run init-db
```

هذا الأمر سيقوم بـ:
- إنشاء قاعدة البيانات SQLite
- إنشاء الجداول (users, articles, categories)
- إضافة مستخدم افتراضي (admin/admin123)
- إضافة بعض المقالات التجريبية
- إضافة التصنيفات الافتراضية

### 4️⃣ تشغيل الخادم

```bash
npm start
```

سيعمل الخادم على: `http://localhost:3000`

---

## 🔐 بيانات الدخول الافتراضية

```
اسم المستخدم: admin
كلمة المرور: admin123
```

**⚠️ تحذير مهم:** قم بتغيير كلمة المرور الافتراضية فوراً بعد أول تسجيل دخول!

---

## 📱 الوصول إلى النظام

بعد التشغيل، يمكنك الوصول إلى:

- **الصفحة الرئيسية**: http://localhost:3000
- **صفحة المقالات**: http://localhost:3000/articles.html
- **تسجيل الدخول**: http://localhost:3000/login.html
- **لوحة التحكم**: http://localhost:3000/admin/

---

## 🔧 استكشاف الأخطاء

### المشكلة: خطأ في تثبيت الحزم

```bash
# حذف node_modules وإعادة التثبيت
rm -rf node_modules package-lock.json
npm install
```

### المشكلة: قاعدة البيانات موجودة مسبقاً

```bash
# حذف قاعدة البيانات القديمة
rm -rf data/
npm run init-db
```

### المشكلة: المنفذ 3000 مستخدم

```bash
# استخدام منفذ آخر
PORT=3001 npm start
```

أو عدّل ملف `.env`:
```
PORT=3001
```

### المشكلة: خطأ في الأذونات

```bash
# في Linux/Mac
chmod +x server/index.js
```

---

## 🌐 النشر على الخادم (VPS)

### 1. نقل الملفات إلى الخادم

```bash
# باستخدام Git
git clone <repository-url>
cd arabic-cms

# أو باستخدام scp
scp -r * user@server:/path/to/app
```

### 2. تثبيت الحزم للإنتاج

```bash
npm install --production
```

### 3. إعداد متغيرات البيئة

```bash
cp .env.example .env
nano .env  # عدّل القيم
```

### 4. تهيئة قاعدة البيانات

```bash
npm run init-db
```

### 5. استخدام PM2 للتشغيل المستمر

```bash
# تثبيت PM2 عالمياً
npm install -g pm2

# تشغيل التطبيق
pm2 start server/index.js --name "arabic-cms"

# حفظ قائمة العمليات
pm2 save

# تشغيل PM2 عند إعادة تشغيل الخادم
pm2 startup
```

### 6. إعداد Nginx كـ Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 7. إعداد SSL باستخدام Let's Encrypt

```bash
sudo certbot --nginx -d yourdomain.com
```

---

## 📊 أوامر مفيدة

```bash
# تشغيل الخادم
npm start

# إعادة تهيئة قاعدة البيانات (⚠️ يحذف جميع البيانات)
npm run init-db

# إيقاف الخادم (Ctrl+C)

# عرض سجلات PM2
pm2 logs arabic-cms

# إعادة تشغيل التطبيق
pm2 restart arabic-cms

# إيقاف التطبيق
pm2 stop arabic-cms
```

---

## 🔄 التحديثات

```bash
# سحب التحديثات من Git
git pull

# تثبيت الحزم الجديدة
npm install

# إعادة تشغيل التطبيق
pm2 restart arabic-cms
```

---

## 💾 النسخ الاحتياطي

### نسخ احتياطي لقاعدة البيانات

```bash
# إنشاء نسخة احتياطية
cp data/cms.db data/cms.db.backup-$(date +%Y%m%d)

# أو استخدام tar
tar -czf backup-$(date +%Y%m%d).tar.gz data/ public/uploads/
```

### استعادة من نسخة احتياطية

```bash
# استعادة قاعدة البيانات
cp data/cms.db.backup-20240101 data/cms.db

# أو استخدام tar
tar -xzf backup-20240101.tar.gz
```

---

## 📞 الدعم

في حالة وجود مشاكل:
1. تحقق من ملف README.md
2. راجع رسائل الخطأ في الـ console
3. افتح Issue في المستودع

---

صُنع بـ ❤️ للمجتمع العربي
