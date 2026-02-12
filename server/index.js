const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// استيراد المسارات
const authRoutes = require('./routes/auth');
const articlesRoutes = require('./routes/articles');
const uploadRoutes = require('./routes/upload');
const categoriesRoutes = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// تقديم الملفات الثابتة
app.use(express.static(path.join(__dirname, '../public')));

// التأكد من وجود مجلد الرفع
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// المسارات (Routes)
app.use('/api/auth', authRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/categories', categoriesRoutes);

// معالج الأخطاء
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'حدث خطأ في الخادم' });
});

// بدء الخادم
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🚀 نظام إدارة المحتوى العربي - Arabic CMS          ║
║                                                        ║
║   الخادم يعمل على: http://localhost:${PORT}             ║
║                                                        ║
║   📝 الصفحة الرئيسية: http://localhost:${PORT}          ║
║   🔐 تسجيل الدخول: http://localhost:${PORT}/login.html  ║
║   ⚙️  لوحة التحكم: http://localhost:${PORT}/admin/      ║
║                                                        ║
║   بيانات الدخول الافتراضية:                           ║
║   اسم المستخدم: admin                                  ║
║   كلمة المرور: admin123                                ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});
