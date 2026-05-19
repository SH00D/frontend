/* ══════════════════════════════════════════════════════════
   products.js — API Module & Product Card Builder
   Центральный модуль для работы с Backend API.
   ══════════════════════════════════════════════════════════ */

const API_BASE = 'http://localhost:8080/api';

/* ── Category Meta (иконки, цвета для каждой категории) ── */
const CATEGORY_META = {
  'Витамины и БАДы':    { icon: '💊', color: '#00a651', bg: '#e6f7ef', description: 'Энергия и баланс вашего организма' },
  'Обезболивающие':     { icon: '🩹', color: '#ff6b6b', bg: '#fff0f0', description: 'Эффективная помощь в любой ситуации' },
  'Простуда и грипп':   { icon: '🤧', color: '#007bff', bg: '#e8f2ff', description: 'Защита и быстрое восстановление' },
  'Уход за кожей':      { icon: '🧴', color: '#ff9f43', bg: '#fff8ee', description: 'Профессиональный уход для красоты' },
  'Пищеварение':        { icon: '🌿', color: '#00c9a7', bg: '#e6faf7', description: 'Легкость и комфорт каждый день' },
};

const DEFAULT_CATEGORY_META = { icon: '📦', color: '#6b7c80', bg: '#f0f4f8', description: 'Товары для здоровья' };

/**
 * Получить мета-данные категории по имени
 */
function getCategoryMeta(categoryName) {
  return CATEGORY_META[categoryName] || DEFAULT_CATEGORY_META;
}

/* ═══════════════════════════════════════
   API Functions — async/await + обработка ошибок
   ═══════════════════════════════════════ */

/**
 * Загрузить все товары с бэкенда
 * @returns {Promise<Array>} массив товаров
 */
async function fetchProducts() {
  const response = await fetch(`${API_BASE}/products`);
  if (!response.ok) {
    throw new Error(`Ошибка загрузки товаров: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/**
 * Загрузить один товар по ID
 * @param {number} id
 * @returns {Promise<Object>} товар
 */
async function fetchProductById(id) {
  const response = await fetch(`${API_BASE}/products/${id}`);
  if (!response.ok) {
    throw new Error(`Товар с ID ${id} не найден`);
  }
  return response.json();
}

/**
 * Загрузить все категории с бэкенда
 * @returns {Promise<Array>} массив категорий
 */
async function fetchCategories() {
  const response = await fetch(`${API_BASE}/categories`);
  if (!response.ok) {
    throw new Error(`Ошибка загрузки категорий: ${response.status}`);
  }
  return response.json();
}

/* ═══════════════════════════════════════
   DOM Builders — createElement, без innerHTML +=
   ═══════════════════════════════════════ */

/**
 * Создать HTML-элемент карточки товара (через createElement)
 * @param {Object} product — объект товара из API
 * @param {Array} cartItems — текущая корзина
 * @returns {HTMLElement}
 */
function createProductCard(product, cartItems = []) {
  const inCart = cartItems.some(item => item.product.id === product.id);
  const meta = getCategoryMeta(product.categoryName);

  const article = document.createElement('article');
  article.className = 'product-card card animate-fadeInUp';

  // Image link
  const imageLink = document.createElement('a');
  imageLink.href = `product-page.html?id=${product.id}`;
  imageLink.className = 'product-card__image-wrap';

  if (!product.stock) {
    const outBadge = document.createElement('span');
    outBadge.className = 'product-card__out';
    outBadge.textContent = 'Нет в наличии';
    imageLink.appendChild(outBadge);
  }

  const img = document.createElement('img');
  img.src = product.imageUrl || 'img/placeholder.png';
  img.alt = product.name;
  img.className = 'product-card__image';
  img.loading = 'lazy';
  imageLink.appendChild(img);
  article.appendChild(imageLink);

  // Body
  const body = document.createElement('div');
  body.className = 'product-card__body';

  const categorySpan = document.createElement('span');
  categorySpan.className = 'product-card__category';
  categorySpan.textContent = product.categoryName || 'Без категории';
  body.appendChild(categorySpan);

  const nameLink = document.createElement('a');
  nameLink.href = `product-page.html?id=${product.id}`;
  nameLink.className = 'product-card__name';
  nameLink.textContent = product.name;
  body.appendChild(nameLink);

  // Description (truncated)
  if (product.description) {
    const desc = document.createElement('p');
    desc.className = 'product-card__desc';
    desc.textContent = product.description.length > 80
      ? product.description.substring(0, 80) + '…'
      : product.description;
    body.appendChild(desc);
  }

  // Footer (price + button)
  const footer = document.createElement('div');
  footer.className = 'product-card__footer';

  const prices = document.createElement('div');
  prices.className = 'product-card__prices';

  const price = document.createElement('span');
  price.className = 'product-card__price';
  price.textContent = `${Number(product.price).toLocaleString('ru-RU')} ₽`;
  prices.appendChild(price);

  footer.appendChild(prices);

  const btn = document.createElement('button');
  btn.className = `btn btn--sm ${inCart ? 'btn--outline' : 'btn--primary'} product-card__btn`;
  btn.id = `add-to-cart-${product.id}`;
  btn.textContent = inCart ? '✓ В корзине' : '+ В корзину';
  if (!product.stock) btn.disabled = true;
  btn.addEventListener('click', () => addToCart(product.id));
  footer.appendChild(btn);

  body.appendChild(footer);
  article.appendChild(body);

  return article;
}

/**
 * Показать loader
 */
function showLoader(container) {
  const loader = document.createElement('div');
  loader.className = 'catalog-loader';
  loader.id = 'catalog-loader';
  loader.innerHTML = `
    <div class="catalog-loader__spinner"></div>
    <p class="catalog-loader__text">Загрузка товаров...</p>
  `;
  container.appendChild(loader);
}

/**
 * Скрыть loader
 */
function hideLoader() {
  const loader = document.getElementById('catalog-loader');
  if (loader) loader.remove();
}

/**
 * Показать пустое состояние
 */
function showEmptyState(container, message = 'Товары не найдены') {
  const empty = document.createElement('div');
  empty.className = 'catalog-empty';
  empty.innerHTML = `
    <span style="font-size: 3rem;">😕</span>
    <h3>${message}</h3>
    <p>Попробуйте смягчить фильтры или изменить запрос</p>
  `;
  container.appendChild(empty);
}

/**
 * Показать ошибку
 */
function showErrorState(container, message = 'Не удалось загрузить данные') {
  const error = document.createElement('div');
  error.className = 'catalog-empty catalog-empty--error';
  error.innerHTML = `
    <span style="font-size: 3rem;">⚠️</span>
    <h3>${message}</h3>
    <p>Проверьте, запущен ли сервер, и попробуйте обновить страницу</p>
    <button class="btn btn--primary" onclick="location.reload()" style="margin-top: 16px;">🔄 Обновить</button>
  `;
  container.appendChild(error);
}
