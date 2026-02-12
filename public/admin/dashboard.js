// ═══════════════════════════════════════════════════════
// لوحة التحكم - Dashboard JavaScript
// ═══════════════════════════════════════════════════════

let token = localStorage.getItem('token');
let currentArticle = null;
let currentPage = 1;

// التحقق من تسجيل الدخول
function checkAuth() {
  if (!token) {
    window.location.href = '/login.html';
    return false;
  }

  fetch('/api/auth/verify', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => {
    if (!data.valid) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login.html';
    } else {
      const user = JSON.parse(localStorage.getItem('user'));
      document.getElementById('welcomeMessage').textContent = `مرحباً ${user.username}`;
    }
  })
  .catch(() => {
    window.location.href = '/login.html';
  });

  return true;
}

// تسجيل الخروج
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
  }
});

// تحميل الإحصائيات
async function loadStats() {
  try {
    const response = await fetch('/api/articles/admin/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const stats = await response.json();

    document.getElementById('totalArticles').textContent = stats.total || 0;
    document.getElementById('publishedArticles').textContent = stats.published || 0;
    document.getElementById('draftArticles').textContent = stats.draft || 0;
    document.getElementById('totalViews').textContent = stats.totalViews || 0;
  } catch (error) {
    console.error('خطأ في تحميل الإحصائيات:', error);
  }
}

// تحميل المقالات
async function loadArticles(page = 1) {
  try {
    currentPage = page;
    const response = await fetch(`/api/articles/admin/all?page=${page}&limit=20`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();

    const tbody = document.getElementById('articlesTableBody');
    const paginationContainer = document.getElementById('paginationContainer');
    
    tbody.innerHTML = '';
    paginationContainer.innerHTML = '';

    if (data.articles.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: var(--spacing-xl);">لا توجد مقالات</td></tr>';
      return;
    }

    data.articles.forEach(article => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${article.title}</strong></td>
        <td>${article.category || '-'}</td>
        <td>
          <span class="badge ${article.status === 'published' ? 'badge-success' : 'badge-warning'}">
            ${article.status === 'published' ? 'منشور' : 'مسودة'}
          </span>
        </td>
        <td>${article.views || 0}</td>
        <td style="font-size: 0.875rem;">${formatRelativeTime(article.created_at)}</td>
        <td>
          <div class="flex" style="gap: var(--spacing-xs);">
            <button class="btn btn-sm btn-primary" onclick="editArticle(${article.id})">✏️ تعديل</button>
            <button class="btn btn-sm btn-danger" onclick="deleteArticle(${article.id}, '${article.title}')">🗑️ حذف</button>
          </div>
        </td>
      `;
      tbody.appendChild(row);
    });

    // إضافة الترقيم
    if (data.pagination.totalPages > 1) {
      paginationContainer.appendChild(
        createPagination(data.pagination, loadArticles)
      );
    }
  } catch (error) {
    console.error('خطأ في تحميل المقالات:', error);
    showAlert('حدث خطأ في تحميل المقالات', 'error');
  }
}

// تحميل التصنيفات
async function loadCategories() {
  try {
    const categories = await api.get('/categories');
    const select = document.getElementById('category');
    
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.name;
      option.textContent = cat.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('خطأ في تحميل التصنيفات:', error);
  }
}

// فتح نافذة إضافة مقال
document.getElementById('addArticleBtn')?.addEventListener('click', () => {
  currentArticle = null;
  document.getElementById('modalTitle').textContent = 'إضافة مقال جديد';
  document.getElementById('articleForm').reset();
  document.getElementById('articleId').value = '';
  openModal();
});

// فتح/إغلاق النافذة المنبثقة
function openModal() {
  document.getElementById('articleModal').classList.add('active');
}

function closeModal() {
  document.getElementById('articleModal').classList.remove('active');
  document.getElementById('articleForm').reset();
  currentArticle = null;
}

// إنشاء slug من العنوان
document.getElementById('title')?.addEventListener('input', (e) => {
  if (!currentArticle) {
    const slug = e.target.value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u0600-\u06FF-]/g, '');
    document.getElementById('slug').value = slug;
  }
});

// تنسيق النص في المحرر
function formatText(format) {
  const editor = document.getElementById('contentEditor');
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const selectedText = editor.value.substring(start, end);
  let formattedText = '';

  switch(format) {
    case 'bold':
      formattedText = `<strong>${selectedText}</strong>`;
      break;
    case 'italic':
      formattedText = `<em>${selectedText}</em>`;
      break;
    case 'heading':
      formattedText = `<h2>${selectedText}</h2>`;
      break;
    case 'paragraph':
      formattedText = `<p>${selectedText}</p>`;
      break;
    case 'list':
      formattedText = `<ul>\n<li>${selectedText}</li>\n</ul>`;
      break;
  }

  editor.value = editor.value.substring(0, start) + formattedText + editor.value.substring(end);
  editor.focus();
}

// رفع صورة
document.getElementById('imageFile')?.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const statusSpan = document.getElementById('uploadStatus');
  statusSpan.textContent = 'جاري الرفع...';

  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    if (!response.ok) throw new Error('فشل رفع الصورة');

    const data = await response.json();
    document.getElementById('image').value = data.path;
    statusSpan.textContent = '✓ تم الرفع بنجاح';
    setTimeout(() => statusSpan.textContent = '', 3000);
  } catch (error) {
    console.error('خطأ في رفع الصورة:', error);
    statusSpan.textContent = '✗ فشل الرفع';
    setTimeout(() => statusSpan.textContent = '', 3000);
  }
});

// حفظ المقال
document.getElementById('articleForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const articleData = {
    title: document.getElementById('title').value,
    slug: document.getElementById('slug').value,
    content: document.getElementById('contentEditor').value,
    excerpt: document.getElementById('excerpt').value,
    image: document.getElementById('image').value,
    category: document.getElementById('category').value,
    tags: document.getElementById('tags').value,
    status: document.getElementById('status').value
  };

  const saveBtn = document.getElementById('saveBtn');
  saveBtn.disabled = true;
  saveBtn.textContent = 'جاري الحفظ...';

  try {
    const articleId = document.getElementById('articleId').value;
    
    if (articleId) {
      // تحديث مقال موجود
      await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(articleData)
      });
      showAlert('تم تحديث المقال بنجاح', 'success');
    } else {
      // إضافة مقال جديد
      await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(articleData)
      });
      showAlert('تم إضافة المقال بنجاح', 'success');
    }

    closeModal();
    loadArticles(currentPage);
    loadStats();
  } catch (error) {
    console.error('خطأ في حفظ المقال:', error);
    showAlert('حدث خطأ في حفظ المقال', 'error');
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = '💾 حفظ المقال';
  }
});

// تعديل مقال
async function editArticle(id) {
  try {
    const response = await fetch(`/api/articles/admin/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    const article = data.articles.find(a => a.id === id);

    if (!article) {
      showAlert('المقال غير موجود', 'error');
      return;
    }

    currentArticle = article;
    document.getElementById('modalTitle').textContent = 'تعديل المقال';
    document.getElementById('articleId').value = article.id;
    document.getElementById('title').value = article.title;
    document.getElementById('slug').value = article.slug;
    document.getElementById('contentEditor').value = article.content;
    document.getElementById('excerpt').value = article.excerpt || '';
    document.getElementById('image').value = article.image || '';
    document.getElementById('category').value = article.category || '';
    document.getElementById('tags').value = article.tags || '';
    document.getElementById('status').value = article.status;

    openModal();
  } catch (error) {
    console.error('خطأ في تحميل المقال:', error);
    showAlert('حدث خطأ في تحميل المقال', 'error');
  }
}

// حذف مقال
async function deleteArticle(id, title) {
  if (!confirm(`هل أنت متأكد من حذف المقال "${title}"؟`)) {
    return;
  }

  try {
    await fetch(`/api/articles/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    showAlert('تم حذف المقال بنجاح', 'success');
    loadArticles(currentPage);
    loadStats();
  } catch (error) {
    console.error('خطأ في حذف المقال:', error);
    showAlert('حدث خطأ في حذف المقال', 'error');
  }
}

// التهيئة
document.addEventListener('DOMContentLoaded', () => {
  if (checkAuth()) {
    loadStats();
    loadArticles();
    loadCategories();
  }
});

// إضافة إلى window للوصول العام
window.editArticle = editArticle;
window.deleteArticle = deleteArticle;
window.closeModal = closeModal;
window.formatText = formatText;
