


let cart = JSON.parse(localStorage.getItem('cart')) || [];


let _productsCache = null;


function updateCartBadge() {
  const badges = document.querySelectorAll('.header__cart-badge');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  badges.forEach(badge => {
    if (totalItems > 0) {
      badge.textContent = totalItems;
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }
  });
}



async function getProductsCache() {
  if (_productsCache) return _productsCache;
  try {
    _productsCache = await fetchProducts();
    return _productsCache;
  } catch (e) {
    console.error('Не удалось загрузить товары для корзины:', e);
    return [];
  }
}


async function addToCart(productId) {
  const products = await getProductsCache();
  const product = products.find(p => p.id === productId);
  if (!product || !product.stock) return;

  const existing = cart.find(item => item.product.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ product, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();


  const btn = document.getElementById(`add-to-cart-${productId}`);
  if (btn) {
    btn.classList.remove('btn--primary');
    btn.classList.add('btn--outline');
    btn.textContent = '✓ В корзине';
  }
}

document.addEventListener('DOMContentLoaded', () => {

  const burgerBtn = document.getElementById('burger-btn');
  const nav = document.querySelector('.header__nav');
  const overlay = document.querySelector('.header__overlay');

  if (burgerBtn && nav) {
    burgerBtn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('header__nav--open');
      burgerBtn.classList.toggle('header__burger--open');
      if (overlay) overlay.style.display = isOpen ? 'block' : 'none';
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      nav.classList.remove('header__nav--open');
      burgerBtn.classList.remove('header__burger--open');
      overlay.style.display = 'none';
    });
  }


  updateCartBadge();
});
