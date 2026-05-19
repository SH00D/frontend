/* ══════════════════════════════════════
   categories.js — Categories management
   ══════════════════════════════════════ */

let allCategories = [];

function initCategories() {
  allCategories = getStoredCategories();
  renderCategories();
}

function renderCategories() {
  const list = document.getElementById('categories-list');
  const countEl = document.getElementById('categories-count');
  if (!list) return;
  if (countEl) countEl.textContent = `${allCategories.length} категорий`;

  if (allCategories.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="empty-state__icon">📁</div><div class="empty-state__title">Категорий нет</div><div class="empty-state__text">Добавьте первую категорию</div></div>`;
    return;
  }
  const products = getStoredProducts();
  list.innerHTML = allCategories.map(c => {
    const count = products.filter(p => p.category === c.id).length;
    return `
    <div class="category-card">
      <div class="category-card__left">
        <div class="category-card__icon" style="background:${c.bg}">${c.icon}</div>
        <div class="category-card__info">
          <span class="category-card__name">${c.label}</span>
          <span class="category-card__count">${count} товаров</span>
        </div>
      </div>
      <div class="category-card__actions">
        <button class="btn btn--sm btn--outline" onclick="editCategory('${c.id}')" title="Редактировать">✏️</button>
        <button class="btn btn--sm btn--outline" onclick="confirmDeleteCategory('${c.id}')" title="Удалить" style="color:var(--admin-danger)">🗑️</button>
      </div>
    </div>`;
  }).join('');
}

function openAddCategory() {
  document.getElementById('cat-modal-title').textContent = 'Новая категория';
  document.getElementById('cat-id').value = '';
  document.getElementById('cat-label').value = '';
  document.getElementById('cat-icon').value = '';
  document.getElementById('cat-color').value = '#00a651';
  document.getElementById('cat-editing-id').value = '';
  openModal('category-modal');
}

function editCategory(id) {
  const cat = allCategories.find(c => c.id === id);
  if (!cat) return;
  document.getElementById('cat-modal-title').textContent = 'Редактировать категорию';
  document.getElementById('cat-id').value = cat.id;
  document.getElementById('cat-id').disabled = true;
  document.getElementById('cat-label').value = cat.label;
  document.getElementById('cat-icon').value = cat.icon;
  document.getElementById('cat-color').value = cat.color;
  document.getElementById('cat-editing-id').value = id;
  openModal('category-modal');
}

function saveCategory() {
  const editingId = document.getElementById('cat-editing-id').value;
  const id = document.getElementById('cat-id').value.trim();
  const label = document.getElementById('cat-label').value.trim();
  const icon = document.getElementById('cat-icon').value.trim();
  const color = document.getElementById('cat-color').value;

  if (!id || !label) {
    showToast('Заполните ID и название', 'error');
    return;
  }

  if (editingId) {
    const cat = allCategories.find(c => c.id === editingId);
    if (cat) {
      cat.label = label;
      cat.icon = icon || '📦';
      cat.color = color;
      cat.bg = color + '1a';
    }
  } else {
    if (allCategories.some(c => c.id === id)) {
      showToast('Категория с таким ID уже существует', 'error');
      return;
    }
    allCategories.push({ id, label, icon: icon || '📦', color, bg: color + '1a', count: 0 });
  }

  saveCategories(allCategories);
  closeModal('category-modal');
  document.getElementById('cat-id').disabled = false;
  renderCategories();
  showToast(editingId ? 'Категория обновлена' : 'Категория добавлена');
}

function confirmDeleteCategory(id) {
  const cat = allCategories.find(c => c.id === id);
  if (!cat) return;
  const body = document.querySelector('#delete-cat-modal .modal__body');
  if (body) body.innerHTML = `<p>Удалить категорию <strong>«${cat.label}»</strong>?</p><p style="color:var(--admin-text-muted);font-size:.88rem;margin-top:8px">Товары этой категории не будут удалены.</p>`;
  document.getElementById('confirm-delete-cat-btn')?.setAttribute('onclick', `deleteCategory('${id}')`);
  openModal('delete-cat-modal');
}

function deleteCategory(id) {
  allCategories = allCategories.filter(c => c.id !== id);
  saveCategories(allCategories);
  closeModal('delete-cat-modal');
  renderCategories();
  showToast('Категория удалена');
}

document.addEventListener('DOMContentLoaded', initCategories);
