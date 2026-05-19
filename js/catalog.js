/* ══════════════════════════════════════════════════════════
   catalog.js — Каталог товаров с API, фильтрацией,
   поиском, сортировкой и пагинацией
   ══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {
  const catalogGrid = document.getElementById('catalog-grid');
  const resultsCount = document.getElementById('results-count');
  const filterCatContainer = document.getElementById('filter-categories');
  const searchInput = document.getElementById('filter-search');
  const priceRange = document.getElementById('price-range');
  const priceLabel = document.getElementById('price-label');
  const sortSelect = document.getElementById('sort-select');
  const paginationContainer = document.getElementById('pagination');

  // State
  const urlParams = new URLSearchParams(window.location.search);
  let currentSearch = (urlParams.get('search') || '').toLowerCase();
  let currentCategory = urlParams.get('category') || '';
  let currentSort = 'default';
  let currentMaxPrice = 3000;
  let currentPage = 1;
  const PER_PAGE = 9;

  // Data from API
  let allProducts = [];
  let allCategories = [];

  if (searchInput) searchInput.value = currentSearch;

  // ── Load Data from Backend ──
  showLoader(catalogGrid);

  try {
    const [products, categories] = await Promise.all([
      fetchProducts(),
      fetchCategories()
    ]);

    allProducts = products;
    allCategories = categories;
    hideLoader();

    // Set max price from data
    if (allProducts.length > 0) {
      const maxProductPrice = Math.max(...allProducts.map(p => Number(p.price)));
      const roundedMax = Math.ceil(maxProductPrice / 100) * 100;
      if (priceRange) {
        priceRange.max = roundedMax;
        priceRange.value = roundedMax;
        currentMaxPrice = roundedMax;
      }
      if (priceLabel) {
        priceLabel.textContent = `Цена до: ${roundedMax} ₽`;
      }
    }

    // If URL has category name (from categories page), match it
    if (currentCategory) {
      const matchedCat = allCategories.find(c =>
        c.name.toLowerCase() === currentCategory.toLowerCase() ||
        c.id.toString() === currentCategory
      );
      if (matchedCat) {
        currentCategory = matchedCat.name;
      }
    }

    renderCategoryFilters();
    renderCatalog();

  } catch (error) {
    hideLoader();
    showErrorState(catalogGrid, 'Не удалось загрузить каталог');
    console.error('Catalog load error:', error);
    return;
  }

  // ── Render Category Filter Buttons ──
  function renderCategoryFilters() {
    if (!filterCatContainer) return;

    filterCatContainer.innerHTML = '';

    // "All" button
    const allBtn = document.createElement('button');
    allBtn.className = `catalog-sidebar__cat-btn ${!currentCategory ? 'catalog-sidebar__cat-btn--active' : ''}`;
    allBtn.textContent = '📂 Все товары';
    allBtn.addEventListener('click', () => updateCategory(''));
    filterCatContainer.appendChild(allBtn);

    // Category buttons from API
    allCategories.forEach(cat => {
      const meta = getCategoryMeta(cat.name);
      const active = currentCategory === cat.name ? 'catalog-sidebar__cat-btn--active' : '';
      const btn = document.createElement('button');
      btn.className = `catalog-sidebar__cat-btn ${active}`;
      btn.textContent = `${meta.icon} ${cat.name}`;
      btn.addEventListener('click', () => updateCategory(cat.name));
      filterCatContainer.appendChild(btn);
    });
  }

  function updateCategory(name) {
    currentCategory = name;
    currentPage = 1;
    renderCategoryFilters();
    renderCatalog();
  }

  // ── Events ──
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase();
      currentPage = 1;
      renderCatalog();
    });
  }

  if (priceRange) {
    priceRange.addEventListener('input', (e) => {
      currentMaxPrice = parseInt(e.target.value);
      priceLabel.textContent = `Цена до: ${currentMaxPrice.toLocaleString('ru-RU')} ₽`;
      currentPage = 1;
      renderCatalog();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      currentPage = 1;
      renderCatalog();
    });
  }

  // ── Main Render Function ──
  function renderCatalog() {
    // Filter
    let filtered = allProducts.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(currentSearch) ||
        (p.description && p.description.toLowerCase().includes(currentSearch));
      const matchCat = currentCategory
        ? p.categoryName === currentCategory
        : true;
      const matchPrice = Number(p.price) <= currentMaxPrice;
      return matchSearch && matchCat && matchPrice;
    });

    // Sort
    switch (currentSort) {
      case 'price_asc':
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price_desc':
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
        break;
    }

    if (resultsCount) {
      resultsCount.textContent = `${filtered.length} товаров`;
    }

    // Pagination
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    // Clear grid (using while loop — fastest way)
    while (catalogGrid.firstChild) {
      catalogGrid.removeChild(catalogGrid.firstChild);
    }

    if (paginated.length === 0) {
      showEmptyState(catalogGrid);
      if (paginationContainer) paginationContainer.innerHTML = '';
      return;
    }

    // Build cards using DocumentFragment (no innerHTML += in loop)
    const fragment = document.createDocumentFragment();
    paginated.forEach(product => {
      fragment.appendChild(createProductCard(product, cart));
    });
    catalogGrid.appendChild(fragment);

    renderPagination(totalPages);
  }

  // ── Pagination ──
  function renderPagination(totalPages) {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = '';
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = `catalog-pagination__btn ${i === currentPage ? 'catalog-pagination__btn--active' : ''}`;
      btn.textContent = i;
      btn.addEventListener('click', () => {
        currentPage = i;
        renderCatalog();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      paginationContainer.appendChild(btn);
    }
  }
});
