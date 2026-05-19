/* ══════════════════════════════════════════════
   admin.js — Core admin logic, sidebar, toast,
   mock data, API helpers
   ══════════════════════════════════════════════ */

/* ── Auth Guard ── */
(function checkAuth() {
  // Skip guard on login page
  if (window.location.pathname.endsWith('login.html')) return;

  const authRaw = localStorage.getItem('pharma_admin_auth');
  if (!authRaw) {
    window.location.replace('login.html');
    return;
  }
  try {
    const auth = JSON.parse(authRaw);
    // Session expires after 24 hours
    const SESSION_TTL = 24 * 60 * 60 * 1000;
    if (Date.now() - auth.timestamp > SESSION_TTL) {
      localStorage.removeItem('pharma_admin_auth');
      window.location.replace('login.html');
      return;
    }
  } catch (e) {
    localStorage.removeItem('pharma_admin_auth');
    window.location.replace('login.html');
  }
})();

function getAdminAuth() {
  try { return JSON.parse(localStorage.getItem('pharma_admin_auth')); }
  catch { return null; }
}

function adminLogout() {
  localStorage.removeItem('pharma_admin_auth');
  window.location.replace('login.html');
}

const API_BASE = 'http://localhost:8080/api';

/* ── Mock Data (все 30 товаров из каталога) ── */
const mockProducts = [
  // Витамины
  { id: 1, name: 'Витамин С 1000мг (Шипучие таблетки)', category: 'vitamins', categoryLabel: 'Витамины', price: 320, oldPrice: 420, rating: 4.8, reviews: 124, image: '../img/vitamin_c.png', description: 'Мощная поддержка иммунитета в период простуд. Улучшает сопротивляемость организма и дарит заряд энергии на весь день.', inStock: true },
  { id: 2, name: 'Омега-3 Премиум Концентрат 1000мг', category: 'vitamins', categoryLabel: 'Витамины', price: 890, oldPrice: 1100, rating: 4.9, reviews: 256, image: '../img/omega_3.png', description: 'Источник незаменимых жирных кислот для здоровья сердца, мозга и зрения.', inStock: true },
  { id: 3, name: 'Магний B6 Форте (Антистресс)', category: 'vitamins', categoryLabel: 'Витамины', price: 450, oldPrice: null, rating: 4.7, reviews: 89, image: '../img/magniy.png', description: 'Эффективный комплекс для поддержки нервной системы.', inStock: true },
  { id: 21, name: 'Витамин D3 2000 ME (Natural Source)', category: 'vitamins', categoryLabel: 'Витамины', price: 560, oldPrice: 650, rating: 4.9, reviews: 150, image: '../img/vitamin_d3.png', description: 'Незаменим для укрепления костей и зубов.', inStock: true },
  { id: 22, name: 'Мультивитаминный Комплекс (A-Z)', category: 'vitamins', categoryLabel: 'Витамины', price: 1200, oldPrice: null, rating: 4.6, reviews: 45, image: '../img/multi_vitamin.png', description: 'Сбалансированный состав из 25 витаминов и минералов.', inStock: true },
  { id: 23, name: 'Кальций + D3 (Усиленная формула)', category: 'vitamins', categoryLabel: 'Витамины', price: 480, oldPrice: 550, rating: 4.8, reviews: 67, image: '../img/kaltsiy_d3.png', description: 'Оптимальное сочетание кальция и витамина D3.', inStock: true },

  // Обезболивающие
  { id: 4, name: 'Нурофен Экспресс (Капсулы 200мг)', category: 'pain', categoryLabel: 'Обезболивающие', price: 210, oldPrice: null, rating: 4.9, reviews: 412, image: '../img/nurofen_express.png', description: 'Быстро направленное действие против боли.', inStock: true },
  { id: 5, name: 'Парацетамол Суспензия (Детская)', category: 'pain', categoryLabel: 'Обезболивающие', price: 150, oldPrice: null, rating: 4.7, reviews: 98, image: '../img/paratsetamol_suspenziya.png', description: 'Бережное жаропонижающее средство с приятным вкусом.', inStock: true },
  { id: 6, name: 'Кетопрофен Гель 5% (Ультра-сила)', category: 'pain', categoryLabel: 'Обезболивающие', price: 340, oldPrice: 450, rating: 4.6, reviews: 54, image: '../img/ketoprofen_gel.png', description: 'Глубокое проникновение и быстрое купирование воспалений.', inStock: true },
  { id: 24, name: 'Анальгин Ультра (Таблетки)', category: 'pain', categoryLabel: 'Обезболивающие', price: 80, oldPrice: null, rating: 4.5, reviews: 230, image: '../img/analgin_ultra.png', description: 'Классическое средство от умеренной боли.', inStock: true },
  { id: 25, name: 'Миг 400 (Быстрое действие)', category: 'pain', categoryLabel: 'Обезболивающие', price: 180, oldPrice: 220, rating: 4.9, reviews: 189, image: '../img/mig.png', description: 'Современный препарат на основе ибупрофена 400мг.', inStock: true },
  { id: 26, name: 'Спазмалгон Форте (Комби-препарат)', category: 'pain', categoryLabel: 'Обезболивающие', price: 290, oldPrice: null, rating: 4.8, reviews: 112, image: '../img/spezmalgon.png', description: 'Двойное действие против боли и спазмов.', inStock: true },

  // Простуда и грипп
  { id: 7, name: 'Терафлю Лимон (Порошок)', category: 'cold', categoryLabel: 'Простуда и грипп', price: 420, oldPrice: 480, rating: 4.8, reviews: 345, image: '../img/teraflu.png', description: 'Горячее питье для снятия 7 симптомов гриппа.', inStock: true },
  { id: 8, name: 'Арбидол Максимум (200мг)', category: 'cold', categoryLabel: 'Простуда и грипп', price: 580, oldPrice: null, rating: 4.5, reviews: 120, image: '../img/arbidol-maksimum.png', description: 'Противовирусное средство широкого спектра.', inStock: true },
  { id: 9, name: 'АЦЦ Лонг (Шипучие таблетки)', category: 'cold', categoryLabel: 'Простуда и грипп', price: 620, oldPrice: 700, rating: 4.9, reviews: 210, image: '../img/atsts_long.png', description: 'Эффективное муколитическое средство.', inStock: true },
  { id: 27, name: 'Граммидин Нео с анестетиком', category: 'cold', categoryLabel: 'Простуда и грипп', price: 390, oldPrice: null, rating: 4.9, reviews: 450, image: '../img/gramidin.png', description: 'Антибактериальные таблетки для рассасывания.', inStock: true },
  { id: 28, name: 'Оциллококцинум (Гомеопатия)', category: 'cold', categoryLabel: 'Простуда и грипп', price: 740, oldPrice: 850, rating: 4.4, reviews: 320, image: '../img/otsilokom.png', description: 'Профилактика и лечение первых симптомов гриппа.', inStock: true },
  { id: 29, name: 'Називин Спрей (Дозированный)', category: 'cold', categoryLabel: 'Простуда и грипп', price: 210, oldPrice: null, rating: 4.8, reviews: 560, image: '../img/nazivin.png', description: 'Облегчение носового дыхания на 12 часов.', inStock: true },

  // Уход за кожей
  { id: 10, name: 'La Roche-Posay Effaclar Duo+', category: 'skincare', categoryLabel: 'Уход за кожей', price: 1450, oldPrice: 1600, rating: 4.8, reviews: 890, image: '../img/laroshe_posay.png', description: 'Дерматокосметика для проблемной кожи.', inStock: true },
  { id: 11, name: 'CeraVe (Увлажняющий лосьон)', category: 'skincare', categoryLabel: 'Уход за кожей', price: 980, oldPrice: null, rating: 4.9, reviews: 1200, image: '../img/ceraVE.png', description: 'Интенсивное увлажнение на 24 часа.', inStock: true },
  { id: 12, name: 'Бепантен Мазь (Original)', category: 'skincare', categoryLabel: 'Уход за кожей', price: 540, oldPrice: 620, rating: 4.9, reviews: 430, image: '../img/bipanten.png', description: 'Универсальное средство для восстановления кожи.', inStock: true },
  { id: 30, name: 'Vichy Liftactiv Vitamin C', category: 'skincare', categoryLabel: 'Уход за кожей', price: 2800, oldPrice: 3200, rating: 4.7, reviews: 156, image: '../img/Vichy_vitamin.png', description: 'Сыворотка-антиоксидант против старения.', inStock: true },
  { id: 31, name: 'Крем Пантенол 5% (SOS)', category: 'skincare', categoryLabel: 'Уход за кожей', price: 120, oldPrice: null, rating: 4.8, reviews: 210, image: '../img/pantenol.png', description: 'Скорая помощь для поврежденной кожи.', inStock: true },
  { id: 32, name: 'Nivea Soft (Увлажнение)', category: 'skincare', categoryLabel: 'Уход за кожей', price: 340, oldPrice: null, rating: 4.6, reviews: 890, image: '../img/nivea_soft.png', description: 'Легкий крем с маслом жожоба и витамином Е.', inStock: true },

  // Пищеварение
  { id: 13, name: 'Мезим Форте (Ферменты)', category: 'digestion', categoryLabel: 'Пищеварение', price: 290, oldPrice: 350, rating: 4.9, reviews: 670, image: '../img/mezim.png', description: 'Помогает переваривать тяжелую пищу.', inStock: true },
  { id: 14, name: 'Линекс (Пробиотики)', category: 'digestion', categoryLabel: 'Пищеварение', price: 740, oldPrice: null, rating: 4.8, reviews: 290, image: '../img/lineks.png', description: 'Восстановление микрофлоры кишечника.', inStock: true },
  { id: 15, name: 'Энтеросгель (Сорбент)', category: 'digestion', categoryLabel: 'Пищеварение', price: 580, oldPrice: 650, rating: 4.7, reviews: 540, image: '../img/enterogel.png', description: 'Очистка организма от токсинов и аллергенов.', inStock: true },
  { id: 33, name: 'Хилак Форте (Капли)', category: 'digestion', categoryLabel: 'Пищеварение', price: 460, oldPrice: null, rating: 4.6, reviews: 180, image: '../img/hilack_forte.png', description: 'Восстанавливает естественную среду в кишечнике.', inStock: true },
  { id: 34, name: 'Фосфалюгель (Стики)', category: 'digestion', categoryLabel: 'Пищеварение', price: 380, oldPrice: 420, rating: 4.9, reviews: 310, image: '../img/fosfalugel.png', description: 'Антацид. Обволакивает и защищает слизистую желудка.', inStock: true },
  { id: 35, name: 'Маалокс (Анти-изжога)', category: 'digestion', categoryLabel: 'Пищеварение', price: 410, oldPrice: null, rating: 4.8, reviews: 156, image: '../img/maalocks.png', description: 'Быстрая нейтрализация избыточной кислоты.', inStock: true },
];

const mockCategories = [
  { id: 'vitamins', label: 'Витамины и БАДы', icon: '💊', color: '#00a651', bg: '#e6f7ef', count: 6 },
  { id: 'pain', label: 'Обезболивающие', icon: '🩹', color: '#ff6b6b', bg: '#fff0f0', count: 6 },
  { id: 'cold', label: 'Простуда и грипп', icon: '🤧', color: '#007bff', bg: '#e8f2ff', count: 6 },
  { id: 'skincare', label: 'Уход за кожей', icon: '🧴', color: '#ff9f43', bg: '#fff8ee', count: 6 },
  { id: 'digestion', label: 'Пищеварение', icon: '🌿', color: '#00c9a7', bg: '#e6faf7', count: 6 },
];

const mockOrders = [
  { id: 'ORD-2847', customer: 'Елена Смирнова', email: 'elena@mail.ru', phone: '+7 (999) 123-45-67', date: '2026-05-18', total: 1210, status: 'delivered', items: [{ name: 'Витамин D3', qty: 1, price: 560 }, { name: 'Омега-3', qty: 1, price: 650 }], address: 'г. Владимир, ул. Ленина, 15' },
  { id: 'ORD-2846', customer: 'Алексей Козлов', email: 'alex@mail.ru', phone: '+7 (999) 765-43-21', date: '2026-05-18', total: 810, status: 'processing', items: [{ name: 'Терафлю Лимон', qty: 1, price: 420 }, { name: 'Граммидин Нео', qty: 1, price: 390 }], address: 'г. Владимир, ул. Мира, 42' },
  { id: 'ORD-2845', customer: 'Мария Петрова', email: 'maria@mail.ru', phone: '+7 (999) 111-22-33', date: '2026-05-17', total: 1450, status: 'shipped', items: [{ name: 'La Roche-Posay', qty: 1, price: 1450 }], address: 'г. Владимир, пр. Строителей, 8' },
  { id: 'ORD-2844', customer: 'Дмитрий Иванов', email: 'dima@mail.ru', phone: '+7 (999) 444-55-66', date: '2026-05-17', total: 1030, status: 'delivered', items: [{ name: 'Мезим Форте', qty: 1, price: 290 }, { name: 'Линекс', qty: 1, price: 740 }], address: 'г. Владимир, ул. Горького, 22' },
  { id: 'ORD-2843', customer: 'Ольга Волкова', email: 'olga@mail.ru', phone: '+7 (999) 777-88-99', date: '2026-05-16', total: 690, status: 'cancelled', items: [{ name: 'Бепантен', qty: 1, price: 540 }, { name: 'Парацетамол', qty: 1, price: 150 }], address: 'г. Владимир, ул. Суздальская, 3' },
  { id: 'ORD-2842', customer: 'Николай Григорьев', email: 'nik@mail.ru', phone: '+7 (999) 222-33-44', date: '2026-05-16', total: 530, status: 'processing', items: [{ name: 'Нурофен Экспресс', qty: 1, price: 210 }, { name: 'Витамин С', qty: 1, price: 320 }], address: 'г. Владимир, ул. Добросельская, 17' },
  { id: 'ORD-2841', customer: 'Анна Соколова', email: 'anna@mail.ru', phone: '+7 (999) 555-66-77', date: '2026-05-15', total: 980, status: 'delivered', items: [{ name: 'CeraVe Лосьон', qty: 1, price: 980 }], address: 'г. Владимир, ул. Лакина, 5' },
];

/* ── LocalStorage helpers (with version check) ── */
const ADMIN_DATA_VERSION = 'v2_30products';
(function checkDataVersion() {
  if (localStorage.getItem('admin_data_version') !== ADMIN_DATA_VERSION) {
    localStorage.removeItem('admin_products');
    localStorage.removeItem('admin_categories');
    localStorage.removeItem('admin_orders');
    localStorage.setItem('admin_data_version', ADMIN_DATA_VERSION);
  }
})();

function getStoredProducts() {
  const stored = localStorage.getItem('admin_products');
  return stored ? JSON.parse(stored) : [...mockProducts];
}
function saveProducts(products) {
  localStorage.setItem('admin_products', JSON.stringify(products));
}
function getStoredCategories() {
  const stored = localStorage.getItem('admin_categories');
  return stored ? JSON.parse(stored) : [...mockCategories];
}
function saveCategories(cats) {
  localStorage.setItem('admin_categories', JSON.stringify(cats));
}
function getStoredOrders() {
  const stored = localStorage.getItem('admin_orders');
  return stored ? JSON.parse(stored) : [...mockOrders];
}
function saveOrders(orders) {
  localStorage.setItem('admin_orders', JSON.stringify(orders));
}

/* ── API Wrapper (falls back to mock) ── */
async function apiRequest(method, endpoint, body = null) {
  try {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(API_BASE + endpoint, opts);
    if (!res.ok) throw new Error(res.statusText);
    return await res.json();
  } catch (e) {
    console.warn(`API недоступен (${endpoint}), используем локальные данные`);
    return null;
  }
}

/* ── Sidebar Toggle ── */
function initSidebar() {
  const burger = document.getElementById('admin-burger');
  const sidebar = document.getElementById('admin-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!burger) return;
  burger.addEventListener('click', () => {
    sidebar.classList.toggle('sidebar--open');
    if (overlay) overlay.style.display = sidebar.classList.contains('sidebar--open') ? 'block' : 'none';
  });
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('sidebar--open');
      overlay.style.display = 'none';
    });
  }
}

/* ── Toast ── */
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span> ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => { toast.classList.add('toast--hiding'); }, 2500);
  setTimeout(() => { toast.remove(); }, 3000);
}

/* ── Modal ── */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('modal-overlay--active');
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('modal-overlay--active');
}

/* ── Status Labels ── */
function getStatusBadge(status) {
  const map = {
    processing: { label: 'В обработке', cls: 'badge--info' },
    shipped: { label: 'Отправлен', cls: 'badge--warning' },
    delivered: { label: 'Доставлен', cls: 'badge--success' },
    cancelled: { label: 'Отменён', cls: 'badge--danger' },
  };
  const s = map[status] || { label: status, cls: 'badge--neutral' };
  return `<span class="badge ${s.cls}">${s.label}</span>`;
}

/* ── Format helpers ── */
function formatPrice(p) { return p.toLocaleString('ru-RU') + ' ₽'; }
function formatDate(d) {
  const date = new Date(d);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();

  // Display admin login in header
  const auth = getAdminAuth();
  if (auth) {
    const userNameEl = document.querySelector('.admin-header__user-name');
    if (userNameEl) userNameEl.textContent = auth.login;
  }

  // Logout button
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      adminLogout();
    });
  }

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(ov => {
    ov.addEventListener('click', (e) => {
      if (e.target === ov) ov.classList.remove('modal-overlay--active');
    });
  });
});
