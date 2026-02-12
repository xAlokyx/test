# 📝 نظام إدارة المحتوى العربي - Arabic CMS

نظام إدارة محتوى احترافي بواجهة عربية كاملة (RTL) مبني بتقنيات حديثة وخفيفة.

## ✨ المميزات

### 🎨 التصميم
- واجهة عربية كاملة بنظام RTL
- تصميم عصري وجذاب
- Responsive + Mobile First
- دعم الوضع الداكن (Dark Mode)
- CSS احترافي (Flexbox + Grid + Animations)
- سرعة تحميل عالية وخفيف

### 📄 الصفحات
- الصفحة الرئيسية
- صفحة المقالات (مع بحث وتصفية)
- صفحة عرض المقال المفرد
- صفحة تسجيل الدخول
- لوحة التحكم (Dashboard)

### 📝 نظام CMS
- ✅ إضافة مقالات جديدة
- ✅ تعديل المقالات
- ✅ حذف المقالات
- ✅ رفع صور للمقالات
- ✅ التصنيفات (Categories)
- ✅ الوسوم (Tags)
- ✅ محرر نصوص (Rich Text Editor)
- ✅ حالة النشر (Draft / Published)
- ✅ تاريخ النشر التلقائي
- ✅ عداد المشاهدات

### 🔐 الأمان
- نظام مصادقة JWT
- تشفير كلمات المرور (bcrypt)
- حماية المسارات الإدارية
- Token verification

### 🚀 مميزات إضافية
- 🔍 بحث في المقالات
- 📄 Pagination (ترقيم الصفحات)
- 🏷️ SEO Meta Tags
- 🖼️ Lazy Loading للصور
- 📊 إحصائيات شاملة
- ⚡ أداء عالي

## 🛠️ التقنيات المستخدمة

### Backend
- **Node.js** - بيئة تشغيل JavaScript
- **Express.js** - إطار عمل الويب
- **SQLite** - قاعدة البيانات
- **JWT** - نظام المصادقة
- **bcryptjs** - تشفير كلمات المرور
- **Multer** - رفع الملفات

### Frontend
- **HTML5** - هيكل الصفحات
- **CSS3** - التصميم والتنسيق
- **JavaScript (Vanilla)** - بدون مكتبات ثقيلة
- **Google Fonts (Cairo)** - خط عربي احترافي

## 📁 هيكل المشروع

```
arabic-cms/
├── server/
│   ├── config/
│   │   └── database.js        # إعدادات قاعدة البيانات
│   ├── middleware/
│   │   └── auth.js            # Middleware المصادقة
│   ├── routes/
│   │   ├── auth.js            # مسارات المصادقة
│   │   ├── articles.js        # مسارات المقالات
│   │   ├── upload.js          # مسارات رفع الصور
│   │   └── categories.js      # مسارات التصنيفات
│   ├── init-db.js             # تهيئة قاعدة البيانات
│   └── index.js               # نقطة بداية الخادم
├── public/
│   ├── css/
│   │   └── style.css          # ملف التنسيق الرئيسي
│   ├── js/
│   │   └── main.js            # JavaScript الرئيسي
│   ├── admin/
│   │   ├── index.html         # لوحة التحكم
│   │   └── dashboard.js       # JavaScript لوحة التحكم
│   ├── uploads/               # مجلد الصور المرفوعة
│   ├── index.html             # الصفحة الرئيسية
│   ├── articles.html          # صفحة المقالات
│   ├── article.html           # صفحة المقال الفردي
│   └── login.html             # صفحة تسجيل الدخول
├── data/                      # قاعدة البيانات (يتم إنشاؤها تلقائياً)
├── package.json
├── .gitignore
└── README.md
```

## 🚀 التنصيب والتشغيل

### المتطلبات
- Node.js (الإصدار 14 أو أحدث)
- npm أو yarn

### خطوات التشغيل

#### 1. تثبيت الحزم
```bash
npm install
```

#### 2. إعداد متغيرات البيئة (اختياري لكن مُنصح به)
```bash
cp .env.example .env
# عدّل ملف .env وأضف JWT_SECRET قوي
```

#### 3. تهيئة قاعدة البيانات
```bash
npm run init-db
```

#### 4. تشغيل الخادم
```bash
npm start
```

أو للتطوير:
```bash
npm run dev
```

#### 4. فتح الموقع
افتح المتصفح على:
```
http://localhost:3000
```

## 🔑 بيانات الدخول الافتراضية

```
اسم المستخدم: admin
كلمة المرور: admin123
```

**⚠️ تحذير:** يُنصح بتغيير كلمة المرور الافتراضية في بيئة الإنتاج!

## 📖 استخدام النظام

### للزوار
1. تصفح الصفحة الرئيسية
2. اقرأ المقالات المنشورة
3. استخدم البحث للعثور على مقالات
4. تصفح حسب التصنيفات

### للمدير
1. سجل الدخول من `/login.html`
2. اذهب إلى لوحة التحكم `/admin/`
3. أضف مقالات جديدة
4. عدّل أو احذف المقالات الموجودة
5. راقب الإحصائيات

## 🎨 المحرر النصي

يدعم النظام تنسيق HTML البسيط:
- **Bold** - `<strong>نص</strong>`
- **Italic** - `<em>نص</em>`
- **Heading** - `<h2>عنوان</h2>`
- **Paragraph** - `<p>فقرة</p>`
- **List** - `<ul><li>عنصر</li></ul>`

## 📊 API Endpoints

### مصادقة (Auth)
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/verify` - التحقق من الـ Token

### مقالات (Articles)
- `GET /api/articles` - جلب المقالات المنشورة
- `GET /api/articles/:slug` - جلب مقال واحد
- `GET /api/articles/admin/all` - جلب كل المقالات (مدير)
- `POST /api/articles` - إضافة مقال (مدير)
- `PUT /api/articles/:id` - تحديث مقال (مدير)
- `DELETE /api/articles/:id` - حذف مقال (مدير)
- `GET /api/articles/admin/stats` - الإحصائيات (مدير)

### تصنيفات (Categories)
- `GET /api/categories` - جلب جميع التصنيفات

### رفع ملفات (Upload)
- `POST /api/upload` - رفع صورة (مدير)

## 🔧 التخصيص

### تغيير الألوان
عدّل ملف `/public/css/style.css` في قسم `:root`:
```css
:root {
  --primary: #2563eb;
  --primary-dark: #1e40af;
  /* ... */
}
```

### تغيير JWT Secret
في بيئة الإنتاج، استخدم متغير بيئي:
```bash
# إنشاء ملف .env
cp .env.example .env

# توليد مفتاح عشوائي قوي
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# أضف المفتاح في ملف .env
JWT_SECRET=your-generated-secret-key
```

أو عدّل ملف `/server/middleware/auth.js` مباشرة (غير منصوح به):
```javascript
const JWT_SECRET = 'your-secret-key-here';
```

### إضافة تصنيفات جديدة
عدّل ملف `/server/init-db.js` في قسم التصنيفات.

## 🚀 النشر على VPS

### 1. رفع الملفات
```bash
git clone <repository-url>
cd arabic-cms
```

### 2. تثبيت الحزم
```bash
npm install --production
```

### 3. تهيئة قاعدة البيانات
```bash
npm run init-db
```

### 4. استخدام PM2 للتشغيل المستمر
```bash
npm install -g pm2
pm2 start server/index.js --name "arabic-cms"
pm2 save
pm2 startup
```

### 5. إعداد Nginx (اختياري)
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
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔒 الأمان

- تشفير كلمات المرور باستخدام bcrypt
- JWT للمصادقة
- حماية المسارات الإدارية
- التحقق من نوع الملفات المرفوعة
- حد أقصى لحجم الصورة (5MB)

### ملاحظات أمنية للإنتاج
- **استخدم JWT_SECRET قوي**: قم بتعيين متغير بيئة JWT_SECRET بمفتاح عشوائي قوي
- **Multer 2.x**: تم استخدام multer@2.0.2 (خالٍ من ثغرات DoS)
- **Rate Limiting**: يُنصح بإضافة rate limiting للـ API endpoints باستخدام `express-rate-limit`
- **HTTPS**: استخدم HTTPS في بيئة الإنتاج
- **تحديث الحزم**: تأكد من تحديث الحزم بانتظام (`npm update`)
- **قاعدة بيانات**: للمشاريع الكبيرة، استخدم PostgreSQL أو MySQL بدلاً من SQLite

## 📝 ملاحظات

- قاعدة البيانات SQLite مناسبة للمشاريع الصغيرة والمتوسطة
- لمشاريع كبيرة، يُنصح بالترقية إلى MySQL/PostgreSQL
- تأكد من تغيير JWT Secret في الإنتاج
- استخدم HTTPS في الإنتاج

## 🤝 المساهمة

المساهمات مرحب بها! يرجى فتح Issue أو Pull Request.

## 📄 الترخيص

MIT License - استخدم المشروع بحرية

## 📧 الدعم

للأسئلة والدعم، افتح Issue في المستودع.

---

صُنع بـ ❤️ للمجتمع العربي