const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../data/cms.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('خطأ في الاتصال بقاعدة البيانات:', err.message);
  } else {
    console.log('✓ تم الاتصال بقاعدة البيانات بنجاح');
  }
});

module.exports = db;
