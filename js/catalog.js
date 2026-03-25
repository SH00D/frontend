document.addEventListener('DOMContentLoaded', () => {
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

  if (searchInput) searchInput.value = currentSearch;

  // Render Category Filter Buttons
  function renderCategoryFilters() {
    filterCatContainer.innerHTML = `
      <button class="catalog-sidebar__cat-btn ${!currentCategory ? 'catalog-sidebar__cat-btn--active' : ''}" onclick="updateCategory('')">
        📂 Все товары
      </button>
    `;
    categories.forEach(cat => {
      const active = currentCategory === cat.id ? 'catalog-sidebar__cat-btn--active' : '';
      filterCatContainer.innerHTML += `
        <button class="catalog-sidebar__cat-btn ${active}" onclick="updateCategory('${cat.id}')">
          ${cat.icon} ${cat.label}
        </button>
      `;
    });
  }

  window.updateCategory = function(id) {
    currentCategory = id;
    currentPage = 1;
    renderCategoryFilters();
    renderCatalog();
  };

  // Events
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
      priceLabel.textContent = `Цена до: ${currentMaxPrice} ₽`;
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

  function renderCatalog() {
    // Filter
    let filtered = mockProducts.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(currentSearch);
      const matchCat = currentCategory ? p.category === currentCategory : true;
      const matchPrice = p.price <= currentMaxPrice;
      return matchSearch && matchCat && matchPrice;
    });

    // Sort
    switch (currentSort) {
      case 'price_asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price_desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'name_asc': filtered.sort((a, b) => a.name.localeCompare(b.name, 'ru')); break;
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
    }

    resultsCount.textContent = `${filtered.length} товаров`;

    // Pagination
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    catalogGrid.innerHTML = '';
    
    if (paginated.length === 0) {
      catalogGrid.innerHTML = `
        <div class="catalog-empty">
          <span style="font-size: 3rem;">😕</span>
          <h3>Ничего не найдено</h3>
          <p>Попробуйте смягчить фильтры или изменить запрос</p>
        </div>
      `;
      paginationContainer.innerHTML = '';
      return;
    }

    paginated.forEach(prod => {
      catalogGrid.innerHTML += createProductCardHTML(prod, cart);
    });

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    paginationContainer.innerHTML = '';
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = `catalog-pagination__btn ${i === currentPage ? 'catalog-pagination__btn--active' : ''}`;
      btn.textContent = i;
      btn.onclick = () => {
        currentPage = i;
        renderCatalog();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
      paginationContainer.appendChild(btn);
    }
  }

  // Initial
  renderCategoryFilters();
  renderCatalog();
});
