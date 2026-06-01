

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;

const perPage = 8;



document.addEventListener(
  'DOMContentLoaded',
  initProducts
);

async function initProducts() {

  try {

    await loadProducts();

    await renderFilters();

    renderTable();

    bindEvents();

  } catch (error) {

    console.error(
      'Ошибка инициализации:',
      error
    );

  }
}



async function loadProducts() {

  const response = await fetch(
    'http://localhost:8080/api/products'
  );

  allProducts = await response.json();

  filteredProducts = [...allProducts];
}

async function loadCategories() {

  const response = await fetch(
    'http://localhost:8080/api/categories'
  );

  return await response.json();
}



function bindEvents() {

  const search =
    document.getElementById(
      'products-search'
    );

  if (search) {
    search.addEventListener(
      'input',
      applyFilters
    );
  }

  const catFilter =
    document.getElementById(
      'products-cat-filter'
    );

  if (catFilter) {
    catFilter.addEventListener(
      'change',
      applyFilters
    );
  }

  const stockFilter =
    document.getElementById(
      'products-stock-filter'
    );

  if (stockFilter) {
    stockFilter.addEventListener(
      'change',
      applyFilters
    );
  }
}



async function renderFilters() {

  const catFilter =
    document.getElementById(
      'products-cat-filter'
    );

  if (!catFilter) return;

  const categories =
    await loadCategories();

  catFilter.innerHTML =
    `
      <option value="">
        Все категории
      </option>
    ` +
    categories.map(c => `
      <option value="${c.id}">
        ${c.name}
      </option>
    `).join('');
}

function applyFilters() {

  const search =
    (
      document.getElementById(
        'products-search'
      )?.value || ''
    ).toLowerCase();

  const cat =
    document.getElementById(
      'products-cat-filter'
    )?.value || '';

  const stock =
    document.getElementById(
      'products-stock-filter'
    )?.value || '';

  filteredProducts =
    allProducts.filter(p => {



      if (
        search &&
        !p.name
          .toLowerCase()
          .includes(search)
      ) {
        return false;
      }



      if (
        cat &&
        p.categoryId.toString() !== cat
      ) {
        return false;
      }



      if (
        stock === 'in' &&
        !p.stock
      ) {
        return false;
      }

      if (
        stock === 'out' &&
        p.stock
      ) {
        return false;
      }

      return true;
    });

  currentPage = 1;

  renderTable();
}



function renderTable() {

  const tbody =
    document.getElementById(
      'products-tbody'
    );

  const countEl =
    document.getElementById(
      'products-count'
    );

  if (!tbody) return;

  const start =
    (currentPage - 1) * perPage;

  const page =
    filteredProducts.slice(
      start,
      start + perPage
    );

  if (countEl) {
    countEl.textContent =
      `${filteredProducts.length} товаров`;
  }



  if (page.length === 0) {

    tbody.innerHTML = `
      <tr>
        <td colspan="7">

          <div class="empty-state">

            <div class="empty-state__icon">
              📦
            </div>

            <div class="empty-state__title">
              Товары не найдены
            </div>

            <div class="empty-state__text">
              Попробуйте изменить фильтры
            </div>

          </div>

        </td>
      </tr>
    `;

    renderPagination();

    return;
  }



  tbody.innerHTML =
    page.map(p => `

      <tr>

        <td>
          <span
            style="
              color:var(--admin-text-muted);
              font-weight:600
            "
          >
            #${p.id}
          </span>
        </td>

        <td>

          <img
            src="../${p.imageUrl}"
            alt="${p.name}"
            class="admin-table__img"

            onerror="
              this.src=
              'data:image/svg+xml,
              <svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 44 44%22>
              <rect fill=%22%23f0f4f8%22 width=%2244%22 height=%2244%22/>
              <text x=%2222%22 y=%2226%22 text-anchor=%22middle%22 font-size=%2216%22>
              📷
              </text>
              </svg>'
            "
          >

        </td>

        <td>

          <span class="admin-table__name">
            ${p.name}
          </span>

        </td>

        <td>
          ${p.categoryName}
        </td>

        <td>

          <strong>
            ${formatPrice(p.price)}
          </strong>

        </td>

        <td>

          ${p.stock

        ? `
                <span class="badge badge--success">
                  В наличии
                </span>
              `

        : `
                <span class="badge badge--danger">
                  Нет
                </span>
              `
      }

        </td>

        <td>

          <div class="admin-table__actions">

            <button
              class="btn btn--sm btn--outline"
              onclick="editProduct(${p.id})"
              title="Редактировать"
            >
              ✏️
            </button>

            <button
              class="btn btn--sm btn--outline"
              onclick="confirmDeleteProduct(${p.id})"
              title="Удалить"
              style="color:var(--admin-danger)"
            >
              🗑️
            </button>

          </div>

        </td>

      </tr>

    `).join('');

  renderPagination();
}



function renderPagination() {

  const el =
    document.getElementById(
      'products-pagination'
    );

  if (!el) return;

  const totalPages =
    Math.ceil(
      filteredProducts.length /
      perPage
    );

  if (totalPages <= 1) {

    el.innerHTML = '';

    return;
  }

  let html = `
    <button
      class="pagination__btn"
      onclick="goToPage(${currentPage - 1})"
      ${currentPage === 1 ? 'disabled' : ''}
    >
      ‹
    </button>
  `;

  for (
    let i = 1;
    i <= totalPages;
    i++
  ) {

    html += `
      <button
        class="
          pagination__btn
          ${i === currentPage ? 'pagination__btn--active' : ''}
        "
        onclick="goToPage(${i})"
      >
        ${i}
      </button>
    `;
  }

  html += `
    <button
      class="pagination__btn"
      onclick="goToPage(${currentPage + 1})"
      ${currentPage === totalPages ? 'disabled' : ''}
    >
      ›
    </button>
  `;

  el.innerHTML = html;
}

function goToPage(page) {

  const totalPages =
    Math.ceil(
      filteredProducts.length /
      perPage
    );

  if (
    page < 1 ||
    page > totalPages
  ) {
    return;
  }

  currentPage = page;

  renderTable();
}



function editProduct(id) {

  window.location.href =
    `add-product.html?id=${id}`;
}



function confirmDeleteProduct(id) {

  const product =
    allProducts.find(
      p => p.id === id
    );

  if (!product) return;

  const modalBody =
    document.querySelector(
      '#delete-modal .modal__body'
    );

  if (modalBody) {

    modalBody.innerHTML = `
      <p>

        Вы уверены,
        что хотите удалить товар

        <strong>
          «${product.name}»
        </strong>

        ?

      </p>

      <p
        style="
          color:var(--admin-text-muted);
          font-size:.88rem;
          margin-top:8px
        "
      >
        Это действие нельзя отменить.
      </p>
    `;
  }

  document
    .getElementById(
      'confirm-delete-btn'
    )
    ?.setAttribute(
      'onclick',
      `deleteProduct(${id})`
    );

  openModal('delete-modal');
}

async function deleteProduct(id) {

  try {

    await fetch(
      `http://localhost:8080/api/products/${id}`,
      {
        method: 'DELETE'
      }
    );

    allProducts =
      allProducts.filter(
        p => p.id !== id
      );

    filteredProducts =
      filteredProducts.filter(
        p => p.id !== id
      );

    closeModal('delete-modal');

    renderTable();

    showToast('Товар удалён');

  } catch (error) {

    console.error(
      'Ошибка удаления:',
      error
    );
  }
}