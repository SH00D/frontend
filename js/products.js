const mockProducts = [
  // Витамины
  { id: 1, name: 'Витамин С 1000мг (Шипучие таблетки)', category: 'vitamins', categoryLabel: 'Витамины', price: 320, oldPrice: 420, rating: 4.8, reviews: 124, image: 'img/vitamin_c.png', description: 'Мощная поддержка иммунитета в период простуд. Улучшает сопротивляемость организма и дарит заряд энергии на весь день.', inStock: true },
  { id: 2, name: 'Омега-3 Премиум Концентрат 1000мг', category: 'vitamins', categoryLabel: 'Витамины', price: 890, oldPrice: 1100, rating: 4.9, reviews: 256, image: 'img/omega_3.png', description: 'Источник незаменимых жирных кислот для здоровья сердца, мозга и зрения. Изготовлено из высококачественного сырья.', inStock: true },
  { id: 3, name: 'Магний B6 Форте (Антистресс)', category: 'vitamins', categoryLabel: 'Витамины', price: 450, oldPrice: null, rating: 4.7, reviews: 89, image: 'img/magniy.png', description: 'Эффективный комплекс для поддержки нервной системы. Помогает бороться со стрессом, усталостью и мышечными спазмами.', inStock: true },
  { id: 21, name: 'Витамин D3 2000 ME (Natural Source)', category: 'vitamins', categoryLabel: 'Витамины', price: 560, oldPrice: 650, rating: 4.9, reviews: 150, image: 'img/vitamin_d3.png', description: 'Незаменим для укрепления костей и зубов, а также для поддержания высокого уровня защиты от вирусов и бактерий.', inStock: true },
  { id: 22, name: 'Мультивитаминный Комплекс (A-Z)', category: 'vitamins', categoryLabel: 'Витамины', price: 1200, oldPrice: null, rating: 4.6, reviews: 45, image: 'img/multi_vitamin.png', description: 'Сбалансированный состав из 25 витаминов и минералов для ежедневного поддержания тонуса и жизненных сил.', inStock: true },
  { id: 23, name: 'Кальций + D3 (Усиленная формула)', category: 'vitamins', categoryLabel: 'Витамины', price: 480, oldPrice: 550, rating: 4.8, reviews: 67, image: 'img/kaltsiy_d3.png', description: 'Оптимальное сочетание кальция и витамина D3 для максимального усвоения и здоровья опорно-двигательной системы.', inStock: true },

  // Обезболивающие
  { id: 4, name: 'Нурофен Экспресс (Капсулы 200мг)', category: 'pain', categoryLabel: 'Обезболивающие', price: 210, oldPrice: null, rating: 4.9, reviews: 412, image: 'img/nurofen_express.png', description: 'Быстро направленное действие против боли. Идеально подходит при головной, зубной и мышечной боли.', inStock: true },
  { id: 5, name: 'Парацетамол Суспензия (Детская)', category: 'pain', categoryLabel: 'Обезболивающие', price: 150, oldPrice: null, rating: 4.7, reviews: 98, image: 'img/paratsetamol_suspenziya.png', description: 'Бережное жаропонижающее и болеутоляющее средство с приятным вкусом. Безопасно для самых маленьких.', inStock: true },
  { id: 6, name: 'Кетопрофен Гель 5% (Ультра-сила)', category: 'pain', categoryLabel: 'Обезболивающие', price: 340, oldPrice: 450, rating: 4.6, reviews: 54, image: 'img/ketoprofen_gel.png', description: 'Глубокое проникновение и быстрое купирование воспалительных процессов в суставах и связках.', inStock: true },
  { id: 24, name: 'Анальгин Ультра (Таблетки)', category: 'pain', categoryLabel: 'Обезболивающие', price: 80, oldPrice: null, rating: 4.5, reviews: 230, image: 'img/analgin_ultra.png', description: 'Классическое средство для быстрого избавления от умеренной боли различного происхождения.', inStock: true },
  { id: 25, name: 'Миг 400 (Быстрое действие)', category: 'pain', categoryLabel: 'Обезболивающие', price: 180, oldPrice: 220, rating: 4.9, reviews: 189, image: 'img/mig.png', description: 'Современный препарат на основе ибупрофена в эффективной дозировке 400мг.', inStock: true },
  { id: 26, name: 'Спазмалгон Форте (Комби-препарат)', category: 'pain', categoryLabel: 'Обезболивающие', price: 290, oldPrice: null, rating: 4.8, reviews: 112, image: 'img/spezmalgon.png', description: 'Двойное действие против боли и спазмов. Помогает при спазмах гладкой мускулатуры и недомоганиях.', inStock: true },

  // Простуда и грипп
  { id: 7, name: 'Терафлю Лимон (Порошок)', category: 'cold', categoryLabel: 'Простуда и грипп', price: 420, oldPrice: 480, rating: 4.8, reviews: 345, image: 'img/teraflu.png', description: 'Горячее питье для быстрого снятия 7 симптомов гриппа и простуды. Возвращает к привычной жизни.', inStock: true },
  { id: 8, name: 'Арбидол Максимум (200мг)', category: 'cold', categoryLabel: 'Простуда и грипп', price: 580, oldPrice: null, rating: 4.5, reviews: 120, image: 'img/arbidol-maksimum.png', description: 'Противовирусное средство широкого спектра. Ускоряет выздоровление и снижает риски осложнений.', inStock: true },
  { id: 9, name: 'АЦЦ Лонг (Шипучие таблетки)', category: 'cold', categoryLabel: 'Простуда и грипп', price: 620, oldPrice: 700, rating: 4.9, reviews: 210, image: 'img/atsts_long.png', description: 'Эффективное муколитическое средство. Всего один прием в день для свободного дыхания.', inStock: true },
  { id: 27, name: 'Граммидин Нео с анестетиком', category: 'cold', categoryLabel: 'Простуда и грипп', price: 390, oldPrice: null, rating: 4.9, reviews: 450, image: 'img/gramidin.png', description: 'Антибактериальные таблетки для рассасывания. Быстро снимают сильную боль в горле.', inStock: true },
  { id: 28, name: 'Оциллококцинум (Гомеопатия)', category: 'cold', categoryLabel: 'Простуда и грипп', price: 740, oldPrice: 850, rating: 4.4, reviews: 320, image: 'img/otsilokom.png', description: 'Популярное средство для профилактики и лечения первых симптомов гриппа и ОРВИ.', inStock: true },
  { id: 29, name: 'Називин Спрей (Дозированный)', category: 'cold', categoryLabel: 'Простуда и грипп', price: 210, oldPrice: null, rating: 4.8, reviews: 560, image: 'img/nazivin.png', description: 'Длительное облегчение носового дыхания на протяжении 12 часов. Бережная забота о слизистой.', inStock: true },

  // Уход за кожей
  { id: 10, name: 'La Roche-Posay Effaclar Duo+', category: 'skincare', categoryLabel: 'Уход за кожей', price: 1450, oldPrice: 1600, rating: 4.8, reviews: 890, image: 'img/laroshe_posay.png', description: 'Аптечная дерматокосметика для проблемной кожи. Уменьшает несовершенства и препятствует их появлению.', inStock: true },
  { id: 11, name: 'CeraVe (Увлажняющий лосьон)', category: 'skincare', categoryLabel: 'Уход за кожей', price: 980, oldPrice: null, rating: 4.9, reviews: 1200, image: 'img/ceraVE.png', description: 'Интенсивное увлажнение на протяжении 24 часов. Содержит 3 необходимых церамида для кожи.', inStock: true },
  { id: 12, name: 'Бепантен Мазь (Original)', category: 'skincare', categoryLabel: 'Уход за кожей', price: 540, oldPrice: 620, rating: 4.9, reviews: 430, image: 'img/bipanten.png', description: 'Универсальное средство для восстановления кожи. Подходит для лечения ожогов, ссадин и сухости.', inStock: true },
  { id: 30, name: 'Vichy Liftactiv Vitamin C', category: 'skincare', categoryLabel: 'Уход за кожей', price: 2800, oldPrice: 3200, rating: 4.7, reviews: 156, image: 'img/Vichy_vitamin.png', description: 'Концентрированная сыворотка-антиоксидант. Возвращает коже сияние и борется с первыми признаками старения.', inStock: true },
  { id: 31, name: 'Крем Пантенол 5% (SOS)', category: 'skincare', categoryLabel: 'Уход за кожей', price: 120, oldPrice: null, rating: 4.8, reviews: 210, image: 'img/pantenol.png', description: 'Скорая помощь для поврежденной кожи. Способствует быстрой регенерации и снятию раздражения.', inStock: true },
  { id: 32, name: 'Nivea Soft (Увлажнение)', category: 'skincare', categoryLabel: 'Уход за кожей', price: 340, oldPrice: null, rating: 4.6, reviews: 890, image: 'img/nivea_soft.png', description: 'Легкий крем с маслом жожоба и витамином Е. Быстро впитывается, делая кожу мягкой и нежной.', inStock: true },

  // Пищеварение
  { id: 13, name: 'Мезим Форте (Ферменты)', category: 'digestion', categoryLabel: 'Пищеварение', price: 290, oldPrice: 350, rating: 4.9, reviews: 670, image: 'img/mezim.png', description: 'Помогает переваривать тяжелую пищу. Устраняет дискомфорт и тяжесть после еды.', inStock: true },
  { id: 14, name: 'Линекс (Пробиотики)', category: 'digestion', categoryLabel: 'Пищеварение', price: 740, oldPrice: null, rating: 4.8, reviews: 290, image: 'img/lineks.png', description: 'Восстановление здорового баланса микрофлоры кишечника после приема антибиотиков и стрессов.', inStock: true },
  { id: 15, name: 'Энтеросгель (Сорбент)', category: 'digestion', categoryLabel: 'Пищеварение', price: 580, oldPrice: 650, rating: 4.7, reviews: 540, image: 'img/enterogel.png', description: 'Очистка организма от токсинов и аллергенов. Современный препарат с высокой сорбирующей силой.', inStock: true },
  { id: 33, name: 'Хилак Форте (Капли)', category: 'digestion', categoryLabel: 'Пищеварение', price: 460, oldPrice: null, rating: 4.6, reviews: 180, image: 'img/hilack_forte.png', description: 'Восстанавливает естественную среду в кишечнике. Подходит для всей семьи.', inStock: true },
  { id: 34, name: 'Фосфалюгель (Стики)', category: 'digestion', categoryLabel: 'Пищеварение', price: 380, oldPrice: 420, rating: 4.9, reviews: 310, image: 'img/fosfalugel.png', description: 'Антацид в удобной форме. Обволакивает и защищает слизистую желудка, устраняя изжогу.', inStock: true },
  { id: 35, name: 'Маалокс (Анти-изжога)', category: 'digestion', categoryLabel: 'Пищеварение', price: 410, oldPrice: null, rating: 4.8, reviews: 156, image: 'img/maalocks.png', description: 'Быстрая нейтрализация избыточной кислоты. Эффективное избавление от боли и жжения.', inStock: true }
];

const categories = [
  { id: 'vitamins', label: 'Витамины и БАДы', description: 'Энергия и баланс вашего организма', icon: '💊', color: '#00a651', bg: '#e6f7ef' },
  { id: 'pain', label: 'Обезболивающие', description: 'Эффективная помощь в любой ситуации', icon: '🩹', color: '#ff6b6b', bg: '#fff0f0' },
  { id: 'cold', label: 'Простуда и грипп', description: 'Защита и быстрое восстановление', icon: '🤧', color: '#007bff', bg: '#e8f2ff' },
  { id: 'skincare', label: 'Уход за кожей', description: 'Профессиональный уход для красоты', icon: '🧴', color: '#ff9f43', bg: '#fff8ee' },
  { id: 'digestion', label: 'Пищеварение', description: 'Легкость и комфорт каждый день', icon: '🌿', color: '#00c9a7', bg: '#e6faf7' }
];

// Helper to create product HTML card
function createProductCardHTML(product, cartItems = []) {
  const inCart = cartItems.some(item => item.product.id === product.id);
  const ratingStars = '⭐'.repeat(Math.round(product.rating));
  const discountBadge = product.oldPrice ? '<span class="product-card__discount">Скидка</span>' : '';
  const outOfStockBadge = !product.inStock ? '<span class="product-card__out">Нет в наличии</span>' : '';

  return `
    <article class="product-card card animate-fadeInUp">
      <a href="product-page.html?id=${product.id}" class="product-card__image-wrap">
        ${discountBadge}
        ${outOfStockBadge}
        <img
          src="${product.image}"
          alt="${product.name}"
          class="product-card__image"
          loading="lazy"
        />
      </a>

      <div class="product-card__body">
        <span class="product-card__category">${product.categoryLabel}</span>
        <a href="product-page.html?id=${product.id}" class="product-card__name">
          ${product.name}
        </a>

        <div class="product-card__rating">
          ${ratingStars}
          <span class="product-card__rating-score">${product.rating}</span>
          <span class="product-card__reviews">(${product.reviews})</span>
        </div>

        <div class="product-card__footer">
          <div class="product-card__prices">
            <span class="product-card__price">${product.price} ₽</span>
            ${product.oldPrice ? `<span class="product-card__old-price">${product.oldPrice} ₽</span>` : ''}
          </div>
          <button
            class="btn btn--sm ${inCart ? 'btn--outline' : 'btn--primary'} product-card__btn"
            onclick="addToCart(${product.id})"
            ${!product.inStock ? 'disabled' : ''}
            id="add-to-cart-${product.id}"
          >
            ${inCart ? '✓ В корзине' : '+ В корзину'}
          </button>
        </div>
      </div>
    </article>
  `;
}
