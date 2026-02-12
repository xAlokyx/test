const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// إنشاء مجلد data إذا لم يكن موجوداً
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, 'cms.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // جدول المستخدمين (Admins)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // جدول المقالات (Articles)
  db.run(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT,
      image TEXT,
      category TEXT,
      tags TEXT,
      status TEXT DEFAULT 'draft',
      views INTEGER DEFAULT 0,
      author_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      published_at DATETIME,
      FOREIGN KEY (author_id) REFERENCES users(id)
    )
  `);

  // جدول التصنيفات (Categories)
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // إضافة مستخدم افتراضي (admin/admin123)
  const defaultPassword = bcrypt.hashSync('admin123', 10);
  db.run(
    `INSERT OR IGNORE INTO users (username, password, email) VALUES (?, ?, ?)`,
    ['admin', defaultPassword, 'admin@example.com'],
    (err) => {
      if (err) {
        console.error('خطأ في إنشاء المستخدم:', err.message);
      } else {
        console.log('✓ تم إنشاء المستخدم الافتراضي (admin/admin123)');
      }
    }
  );

  // إضافة بعض المقالات التجريبية
  const sampleArticles = [
    {
      title: 'مرحباً بك في نظام إدارة المحتوى',
      slug: 'welcome-to-cms',
      content: `<h2>مرحباً بك في نظام إدارة المحتوى العربي</h2>
<p>هذا مثال على مقال في نظام إدارة المحتوى. يمكنك إضافة وتعديل وحذف المقالات من لوحة التحكم.</p>
<p>النظام يدعم:</p>
<ul>
<li>التحرير بصيغة HTML</li>
<li>رفع الصور</li>
<li>التصنيفات والوسوم</li>
<li>الحالة (منشور/مسودة)</li>
<li>البحث والترقيم</li>
</ul>`,
      excerpt: 'مرحباً بك في نظام إدارة المحتوى العربي الاحترافي',
      category: 'عام',
      tags: 'ترحيب,بداية,cms',
      status: 'published',
      published_at: new Date().toISOString()
    },
    {
      title: 'دليل استخدام النظام',
      slug: 'user-guide',
      content: `<h2>كيفية استخدام النظام</h2>
<p>للبدء في استخدام نظام إدارة المحتوى:</p>
<ol>
<li>سجل الدخول بحساب المدير</li>
<li>اذهب إلى لوحة التحكم</li>
<li>اضغط على "إضافة مقال جديد"</li>
<li>املأ البيانات ثم احفظ</li>
</ol>`,
      excerpt: 'دليل شامل لاستخدام نظام إدارة المحتوى',
      category: 'تعليمي',
      tags: 'دليل,شرح,استخدام',
      status: 'published',
      published_at: new Date().toISOString()
    }
  ];

  sampleArticles.forEach((article, index) => {
    db.run(
      `INSERT OR IGNORE INTO articles (title, slug, content, excerpt, category, tags, status, author_id, published_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      [article.title, article.slug, article.content, article.excerpt, article.category, article.tags, article.status, article.published_at],
      (err) => {
        if (!err && index === sampleArticles.length - 1) {
          console.log('✓ تم إنشاء المقالات التجريبية');
        }
      }
    );
  });

  // إضافة بعض التصنيفات
  const categories = ['عام', 'تقنية', 'تعليمي', 'أخبار'];
  categories.forEach((cat) => {
    const slug = cat.replace(/\s+/g, '-');
    db.run(
      `INSERT OR IGNORE INTO categories (name, slug) VALUES (?, ?)`,
      [cat, slug]
    );
  });
});

db.close(() => {
  console.log('✓ تم تهيئة قاعدة البيانات بنجاح');
  console.log('\nبيانات تسجيل الدخول:');
  console.log('اسم المستخدم: admin');
  console.log('كلمة المرور: admin123');
});
