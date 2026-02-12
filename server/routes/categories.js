const express = require('express');
const db = require('../config/database');

const router = express.Router();

// الحصول على جميع التصنيفات
router.get('/', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY name', (err, categories) => {
    if (err) {
      return res.status(500).json({ error: 'خطأ في الخادم' });
    }
    res.json(categories);
  });
});

module.exports = router;
