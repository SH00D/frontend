/* ══════════════════════════════════════
   orders.js — FULL BACKEND VERSION
   ══════════════════════════════════════ */

let allOrders = [];
let filteredOrders = [];

/* =========================================
   INIT
========================================= */

document.addEventListener(
  'DOMContentLoaded',
  initOrders
);

async function initOrders() {

  try {

    await loadOrders();

    bindOrderEvents();

    renderOrders();

  } catch (error) {

    console.error(
      'Ошибка загрузки заказов:',
      error
    );
  }
}

/* =========================================
   API
========================================= */

async function loadOrders() {

  const response = await fetch(
    'http://localhost:8080/api/orders'
  );

  allOrders =
    await response.json();

  filteredOrders =
    [...allOrders];
}

/* =========================================
   EVENTS
========================================= */

function bindOrderEvents() {

  const search =
    document.getElementById(
      'orders-search'
    );

  if (search) {

    search.addEventListener(
      'input',
      applyOrderFilters
    );
  }

  const statusFilter =
    document.getElementById(
      'orders-status-filter'
    );

  if (statusFilter) {

    statusFilter.addEventListener(
      'change',
      applyOrderFilters
    );
  }
}

/* =========================================
   FILTERS
========================================= */

function applyOrderFilters() {

  const search =
    (
      document.getElementById(
        'orders-search'
      )?.value || ''
    ).toLowerCase();

  const status =
    document.getElementById(
      'orders-status-filter'
    )?.value || '';

  filteredOrders =
    allOrders.filter(o => {

      if (
        search &&
        !o.id.toString().includes(search) &&
        !o.customerName
          .toLowerCase()
          .includes(search)
      ) {
        return false;
      }

      if (
        status &&
        o.status !== status
      ) {
        return false;
      }

      return true;
    });

  renderOrders();
}

/* =========================================
   RENDER
========================================= */

function renderOrders() {

  const tbody =
    document.getElementById(
      'orders-tbody'
    );

  const countEl =
    document.getElementById(
      'orders-count'
    );

  if (!tbody) return;

  if (countEl) {

    countEl.textContent =
      `${filteredOrders.length} заказов`;
  }

  /* EMPTY */

  if (filteredOrders.length === 0) {

    tbody.innerHTML = `
      <tr>

        <td colspan="6">

          <div class="empty-state">

            <div class="empty-state__icon">
              📋
            </div>

            <div class="empty-state__title">
              Заказы не найдены
            </div>

          </div>

        </td>

      </tr>
    `;

    return;
  }

  /* TABLE */

  tbody.innerHTML =
    filteredOrders.map(o => `

      <tr>

        <td>

          <strong
            style="
              color:var(--admin-accent)
            "
          >
            #${o.id}
          </strong>

        </td>

        <td>

          <div>

            <strong>
              ${o.customerName}
            </strong>

          </div>

          <div
            style="
              font-size:.78rem;
              color:var(--admin-text-muted)
            "
          >
            ${o.phone || ''}
          </div>

        </td>

        <td>
          ${formatDate(o.createdAt)}
        </td>

        <td>

          <strong>
            ${formatPrice(o.totalPrice)}
          </strong>

        </td>

        <td>
          ${getStatusBadge(o.status)}
        </td>

        <td>

          <div class="admin-table__actions">

            <button
              class="btn btn--sm btn--outline"
              onclick="viewOrder(${o.id})"
              title="Подробнее"
            >
              👁️
            </button>

            <button
              class="btn btn--sm btn--outline"
              onclick="openStatusModal(${o.id})"
              title="Статус"
            >
              📝
            </button>

          </div>

        </td>

      </tr>

    `).join('');
}

/* =========================================
   VIEW ORDER
========================================= */

function viewOrder(id) {

  const order =
    allOrders.find(
      o => o.id === id
    );

  if (!order) return;

  const body =
    document.querySelector(
      '#order-detail-modal .modal__body'
    );

  if (!body) return;

  body.innerHTML = `

    <div class="order-detail">

      <div class="order-detail__section">

        <span class="order-detail__label">
          Номер заказа
        </span>

        <span class="order-detail__value">
          #${order.id}
        </span>

      </div>

      <div class="order-detail__section">

        <span class="order-detail__label">
          Статус
        </span>

        <span class="order-detail__value">
          ${getStatusBadge(order.status)}
        </span>

      </div>

      <div class="order-detail__section">

        <span class="order-detail__label">
          Покупатель
        </span>

        <span class="order-detail__value">
          ${order.customerName}
        </span>

      </div>

      <div class="order-detail__section">

        <span class="order-detail__label">
          Телефон
        </span>

        <span class="order-detail__value">
          ${order.phone || '-'}
        </span>

      </div>

      <div class="order-detail__section">

        <span class="order-detail__label">
          Адрес
        </span>

        <span class="order-detail__value">
          ${order.address || '-'}
        </span>

      </div>

      <div class="order-detail__section">

        <span class="order-detail__label">
          Сумма
        </span>

        <span class="order-detail__value">
          ${formatPrice(order.totalPrice)}
        </span>

      </div>

      <div class="order-detail__section">

        <span class="order-detail__label">
          Дата
        </span>

        <span class="order-detail__value">
          ${formatDate(order.createdAt)}
        </span>

      </div>

    </div>
  `;

  openModal(
    'order-detail-modal'
  );
}

/* =========================================
   STATUS MODAL
========================================= */

function openStatusModal(id) {

  const order =
    allOrders.find(
      o => o.id === id
    );

  if (!order) return;

  document.getElementById(
    'status-order-id'
  ).textContent =
    `#${id}`;

  const select =
    document.getElementById(
      'status-select'
    );

  if (select) {

    select.value =
      order.status;
  }

  document
    .getElementById(
      'save-status-btn'
    )
    ?.setAttribute(
      'onclick',
      `changeStatus(${id})`
    );

  openModal(
    'status-modal'
  );
}

/* =========================================
   CHANGE STATUS
========================================= */

async function changeStatus(id) {

  const newStatus =
    document.getElementById(
      'status-select'
    )?.value;

  if (!newStatus) return;

  const order =
    allOrders.find(
      o => o.id === id
    );

  if (!order) return;

  try {

    const updatedOrder = {

      customerName:
        order.customerName,

      phone:
        order.phone,

      address:
        order.address,

      totalPrice:
        order.totalPrice,

      status:
        newStatus
    };

    await fetch(
      `http://localhost:8080/api/orders/${id}`,
      {

        method: 'PUT',

        headers: {
          'Content-Type':
            'application/json'
        },

        body: JSON.stringify(
          updatedOrder
        )
      }
    );

    order.status =
      newStatus;

    filteredOrders =
      filteredOrders.map(o =>

        o.id === id

          ? {
            ...o,
            status: newStatus
          }

          : o
      );

    renderOrders();

    closeModal(
      'status-modal'
    );

    showToast(
      'Статус заказа обновлён'
    );

  } catch (error) {

    console.error(
      'Ошибка обновления статуса:',
      error
    );
  }
}