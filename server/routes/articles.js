const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// الحصول على جميع المقالات المنشورة (عام)
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';
  const category = req.query.category || '';

  let query = `SELECT * FROM articles WHERE status = 'published'`;
  let countQuery = `SELECT COUNT(*) as total FROM articles WHERE status = 'published'`;
  const params = [];
  const countParams = [];

  if (search) {
    query += ` AND (title LIKE ? OR content LIKE ? OR tags LIKE ?)`;
    countQuery += ` AND (title LIKE ? OR content LIKE ? OR tags LIKE ?)`;
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
    countParams.push(searchTerm, searchTerm, searchTerm);
  }

  if (category) {
    query += ` AND category = ?`;
    countQuery += ` AND category = ?`;
    params.push(category);
    countParams.push(category);
  }

  query += ` ORDER BY published_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  db.get(countQuery, countParams, (err, countResult) => {
    if (err) {
      return res.status(500).json({ error: 'خطأ في الخادم' });
    }

    db.all(query, params, (err, articles) => {
      if (err) {
        return res.status(500).json({ error: 'خطأ في الخادم' });
      }

      res.json({
        articles,
        pagination: {
          page,
          limit,
          total: countResult.total,
          totalPages: Math.ceil(countResult.total / limit)
        }
      });
    });
  });
});

// الحصول على مقال واحد بالـ slug
router.get('/:slug', (req, res) => {
  const { slug } = req.params;

  db.get(
    `SELECT * FROM articles WHERE slug = ? AND status = 'published'`,
    [slug],
    (err, article) => {
      if (err) {
        return res.status(500).json({ error: 'خطأ في الخادم' });
      }

      if (!article) {
        return res.status(404).json({ error: 'المقال غير موجود' });
      }

      // زيادة عدد المشاهدات
      db.run('UPDATE articles SET views = views + 1 WHERE id = ?', [article.id]);

      res.json(article);
    }
  );
});

// الحصول على جميع المقالات (للمدير فقط)
router.get('/admin/all', authenticateToken, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  const status = req.query.status || '';

  let query = 'SELECT * FROM articles';
  let countQuery = 'SELECT COUNT(*) as total FROM articles';
  const params = [];
  const countParams = [];

  if (status) {
    query += ' WHERE status = ?';
    countQuery += ' WHERE status = ?';
    params.push(status);
    countParams.push(status);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  db.get(countQuery, countParams, (err, countResult) => {
    if (err) {
      return res.status(500).json({ error: 'خطأ في الخادم' });
    }

    db.all(query, params, (err, articles) => {
      if (err) {
        return res.status(500).json({ error: 'خطأ في الخادم' });
      }

      res.json({
        articles,
        pagination: {
          page,
          limit,
          total: countResult.total,
          totalPages: Math.ceil(countResult.total / limit)
        }
      });
    });
  });
});

// إنشاء مقال جديد (للمدير فقط)
router.post('/', authenticateToken, (req, res) => {
  const { title, slug, content, excerpt, image, category, tags, status } = req.body;

  if (!title || !slug || !content) {
    return res.status(400).json({ error: 'يرجى إدخال العنوان والرابط والمحتوى' });
  }

  const published_at = status === 'published' ? new Date().toISOString() : null;

  db.run(
    `INSERT INTO articles (title, slug, content, excerpt, image, category, tags, status, author_id, published_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [title, slug, content, excerpt || '', image || '', category || '', tags || '', status || 'draft', req.user.id, published_at],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'الرابط (slug) مستخدم من قبل' });
        }
        return res.status(500).json({ error: 'خطأ في إنشاء المقال' });
      }

      res.status(201).json({ id: this.lastID, message: 'تم إنشاء المقال بنجاح' });
    }
  );
});

// تحديث مقال (للمدير فقط)
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, slug, content, excerpt, image, category, tags, status } = req.body;

  if (!title || !slug || !content) {
    return res.status(400).json({ error: 'يرجى إدخال العنوان والرابط والمحتوى' });
  }

  // إذا تم تغيير الحالة إلى منشور، نحدث تاريخ النشر
  db.get('SELECT status FROM articles WHERE id = ?', [id], (err, article) => {
    if (err || !article) {
      return res.status(404).json({ error: 'المقال غير موجود' });
    }

    const published_at = (status === 'published' && article.status !== 'published') 
      ? new Date().toISOString() 
      : undefined;

    const query = published_at
      ? `UPDATE articles SET title = ?, slug = ?, content = ?, excerpt = ?, image = ?, category = ?, tags = ?, status = ?, published_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      : `UPDATE articles SET title = ?, slug = ?, content = ?, excerpt = ?, image = ?, category = ?, tags = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

    const params = published_at
      ? [title, slug, content, excerpt || '', image || '', category || '', tags || '', status || 'draft', published_at, id]
      : [title, slug, content, excerpt || '', image || '', category || '', tags || '', status || 'draft', id];

    db.run(query, params, function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'الرابط (slug) مستخدم من قبل' });
        }
        return res.status(500).json({ error: 'خطأ في تحديث المقال' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'المقال غير موجود' });
      }

      res.json({ message: 'تم تحديث المقال بنجاح' });
    });
  });
});

// حذف مقال (للمدير فقط)
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM articles WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'خطأ في حذف المقال' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'المقال غير موجود' });
    }

    res.json({ message: 'تم حذف المقال بنجاح' });
  });
});

// إحصائيات (للمدير فقط)
router.get('/admin/stats', authenticateToken, (req, res) => {
  db.get(
    `SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
      SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
      SUM(views) as totalViews
    FROM articles`,
    (err, stats) => {
      if (err) {
        return res.status(500).json({ error: 'خطأ في الخادم' });
      }
      res.json(stats);
    }
  );
});

module.exports = router;
