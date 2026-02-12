// ═══════════════════════════════════════════════════════
// نظام إدارة المحتوى العربي - Main JavaScript
// ═══════════════════════════════════════════════════════

const API_URL = '/api';

// مساعدات API - API Helpers
const api = {
  async get(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) throw new Error('فشل في جلب البيانات');
    return response.json();
  },

  async post(endpoint, data) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'فشل في إرسال البيانات');
    }
    return response.json();
  },

  async put(endpoint, data, token) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'فشل في تحديث البيانات');
    }
    return response.json();
  },

  async delete(endpoint, token) {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'فشل في حذف البيانات');
    }
    return response.json();
  }
};

// إدارة الوضع الداكن - Dark Mode Management
const themeManager = {
  init() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
    this.setupToggle();
  },

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.updateToggleIcon(theme);
  },

  toggle() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  },

  updateToggleIcon(theme) {
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
      toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  },

  setupToggle() {
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggle());
    }
  }
};

// تحميل كسول للصور - Lazy Loading Images
const lazyLoadImages = () => {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
};

// تنسيق التاريخ - Format Date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// تنسيق الوقت النسبي - Relative Time Format
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'الآن';
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays < 30) return `منذ ${diffDays} يوم`;
  return formatDate(dateString);
};

// إنشاء عنصر HTML - Create HTML Element
const createElement = (tag, className, content) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content) element.innerHTML = content;
  return element;
};

// عرض رسالة - Show Alert
const showAlert = (message, type = 'info') => {
  const alertDiv = createElement('div', `alert alert-${type}`, message);
  const container = document.querySelector('.container') || document.body;
  container.insertBefore(alertDiv, container.firstChild);
  
  setTimeout(() => alertDiv.remove(), 5000);
};

// إنشاء بطاقة مقال - Create Article Card
const createArticleCard = (article) => {
  const card = document.createElement('div');
  card.className = 'article-card fade-in';
  
  const imageUrl = article.image || '/images/placeholder.jpg';
  
  card.innerHTML = `
    ${imageUrl ? `<img src="${imageUrl}" alt="${article.title}" class="article-image" loading="lazy">` : ''}
    <div class="article-content">
      <div class="article-meta">
        ${article.category ? `<span class="article-category">${article.category}</span>` : ''}
        <span>📅 ${formatRelativeTime(article.published_at || article.created_at)}</span>
        ${article.views ? `<span>👁️ ${article.views}</span>` : ''}
      </div>
      <h3 class="article-title">
        <a href="/article.html?slug=${article.slug}">${article.title}</a>
      </h3>
      <p class="article-excerpt">${article.excerpt || ''}</p>
      <div class="article-footer">
        <a href="/article.html?slug=${article.slug}" class="btn btn-sm btn-primary">قراءة المزيد</a>
        ${article.tags ? `<div class="tags">${article.tags.split(',').map(tag => `<span class="badge badge-primary">${tag.trim()}</span>`).join(' ')}</div>` : ''}
      </div>
    </div>
  `;
  
  return card;
};

// إنشاء الترقيم - Create Pagination
const createPagination = (pagination, onPageChange) => {
  const { page, totalPages } = pagination;
  const container = createElement('div', 'pagination');
  
  // زر السابق
  if (page > 1) {
    const prevBtn = createElement('a', 'page-link', '← السابق');
    prevBtn.href = '#';
    prevBtn.onclick = (e) => {
      e.preventDefault();
      onPageChange(page - 1);
    };
    container.appendChild(prevBtn);
  }
  
  // أرقام الصفحات
  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, page + 2);
  
  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = createElement('a', `page-link ${i === page ? 'active' : ''}`, i.toString());
    pageBtn.href = '#';
    pageBtn.onclick = (e) => {
      e.preventDefault();
      if (i !== page) onPageChange(i);
    };
    container.appendChild(pageBtn);
  }
  
  // زر التالي
  if (page < totalPages) {
    const nextBtn = createElement('a', 'page-link', 'التالي →');
    nextBtn.href = '#';
    nextBtn.onclick = (e) => {
      e.preventDefault();
      onPageChange(page + 1);
    };
    container.appendChild(nextBtn);
  }
  
  return container;
};

// البحث مع تأخير - Debounced Search
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// التهيئة عند تحميل الصفحة - Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
  themeManager.init();
  lazyLoadImages();
});

// تصدير للاستخدام العام - Export for Global Use
window.api = api;
window.themeManager = themeManager;
window.formatDate = formatDate;
window.formatRelativeTime = formatRelativeTime;
window.showAlert = showAlert;
window.createArticleCard = createArticleCard;
window.createPagination = createPagination;
window.debounce = debounce;
window.createElement = createElement;
