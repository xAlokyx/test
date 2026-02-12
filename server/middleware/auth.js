const jwt = require('jsonwebtoken');

// مفتاح سري لتوقيع JWT - يُنصح باستخدام متغير بيئي في الإنتاج
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production-12345';

// تحذير إذا لم يتم تعيين JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  تحذير: لم يتم تعيين JWT_SECRET في متغيرات البيئة. يُستخدم المفتاح الافتراضي.');
  console.warn('⚠️  في بيئة الإنتاج، يُنصح بشدة بتعيين JWT_SECRET في ملف .env');
}

// Middleware للتحقق من JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'غير مصرح - يجب تسجيل الدخول' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'رمز غير صالح' });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken, JWT_SECRET };
