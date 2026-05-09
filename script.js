const revealElements = document.querySelectorAll("[data-reveal]");
const counters = document.querySelectorAll("[data-counter]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const body = document.body;
const themeToggle = document.querySelector(".theme-toggle");
const openModalButtons = document.querySelectorAll("[data-open-modal], #open-order-modal");
const orderModal = document.getElementById("order-modal");
const closeOrderModal = document.getElementById("close-order-modal");
const productModal = document.getElementById("product-modal");
const closeProductModal = document.getElementById("close-product-modal");

const tabButtons = document.querySelectorAll("[data-tab]");
const tabPanels = document.querySelectorAll("[data-panel]");
const filterButtons = document.querySelectorAll("[data-filter]");
const caseCards = document.querySelectorAll("[data-case]");

const screensInput = document.getElementById("screens");
const designLevelInput = document.getElementById("design-level");
const screenCount = document.getElementById("screen-count");
const designLevelLabel = document.getElementById("design-level-label");
const estimateTotal = document.getElementById("estimate-total");
const estimateTime = document.getElementById("estimate-time");
const applyEstimate = document.getElementById("apply-estimate");
const calculator = document.getElementById("project-calculator");

const runDemo = document.getElementById("run-demo");
const consoleLog = document.getElementById("console-log");

const slides = document.querySelectorAll("[data-slide]");
const slideDots = document.querySelectorAll("[data-slide-dot]");
const slideCounter = document.getElementById("slide-counter");
const prevSlide = document.getElementById("prev-slide");
const nextSlide = document.getElementById("next-slide");

const forms = document.querySelectorAll(".lead-form");
const budgetFields = document.querySelectorAll(".budget-field");
const checkoutForm = document.getElementById("checkout-form");
const checkoutTotal = document.getElementById("checkout-total");
const checkoutStatus = document.getElementById("checkout-status");

const productGrid = document.getElementById("product-grid");
const productCards = Array.from(document.querySelectorAll(".product-card"));
const productCategory = document.getElementById("product-category");
const productSort = document.getElementById("product-sort");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const productModalArtWrap = document.querySelector(".product-modal-art-wrap");
const productModalArtImage = document.getElementById("product-modal-art-image");
const productModalThumbs = document.getElementById("product-modal-thumbs");
const productModalTitle = document.getElementById("product-modal-title");
const productModalDescription = document.getElementById("product-modal-description");
const productModalPrice = document.getElementById("product-modal-price");
const productModalColor = document.getElementById("product-modal-color");
const productModalSize = document.getElementById("product-modal-size");
const productZoomToggle = document.getElementById("product-zoom-toggle");
const productModalAdd = document.getElementById("product-modal-add");

const chatLauncher = document.getElementById("chat-launcher");
const chatPanel = document.getElementById("chat-panel");
const chatClose = document.getElementById("chat-close");
const chatMessages = document.getElementById("chat-messages");
const chatChips = document.querySelectorAll("[data-chat-value]");
const chatCompose = document.getElementById("chat-compose");
const chatInput = document.getElementById("chat-input");

const cart = new Map();
let currentProductId = null;
let currentModalProduct = null;
let currentModalPhoto = 0;

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const designLabels = {
  1: { label: "Базовый", price: 0, days: 0 },
  2: { label: "Продвинутый", price: 320, days: 1 },
  3: { label: "Премиум", price: 780, days: 3 },
};

const chatReplies = {
  "Сколько занимает запуск?":
    "Обычно первый рабочий вариант можно собрать за 7-14 дней, в зависимости от объёма и количества блоков.",
  "Какой бюджет нужен для старта?":
    "Для посадочной страницы старт чаще всего начинается от базовой оценки в калькуляторе. Точная стоимость зависит от структуры, дизайна и интеграций.",
  "Что входит в работу?":
    "Обычно это структура, визуальная подача, адаптив, форма заявки, базовая анимация и подготовка к подключению нужных сервисов.",
};

const savedTheme = localStorage.getItem("landingTheme");
if (savedTheme === "dark" || savedTheme === "light") {
  body.dataset.theme = savedTheme;
}

productCards.forEach((card, index) => {
  card.dataset.order = String(index);
});

initializeProductCards();

if (reducedMotion) {
  revealElements.forEach((element) => element.classList.add("revealed"));
  counters.forEach((counter) => {
    counter.textContent = counter.dataset.counter;
  });
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.7 },
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

function animateCounter(element) {
  const target = Number(element.dataset.counter);
  const duration = 1100;
  const start = performance.now();

  const tick = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
}

themeToggle?.addEventListener("click", () => {
  const nextTheme = body.dataset.theme === "dark" ? "light" : "dark";
  body.dataset.theme = nextTheme;
  localStorage.setItem("landingTheme", nextTheme);
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.tab;

    tabButtons.forEach((tab) => {
      const active = tab === button;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    tabPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === target);
    });
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    caseCards.forEach((card) => {
      card.classList.toggle("is-hidden", filter !== "all" && card.dataset.case !== filter);
    });
  });
});

function getEstimate() {
  const screens = Number(screensInput?.value || 6);
  const designLevel = Number(designLevelInput?.value || 2);
  const designSettings = designLabels[designLevel];
  const featureInputs = calculator?.querySelectorAll('input[name="features"]:checked') || [];
  const featuresTotal = [...featureInputs].reduce((sum, input) => sum + Number(input.value), 0);

  const total = 520 + screens * 180 + featuresTotal + designSettings.price;
  const daysMin = Math.max(5, Math.round(screens * 1.05 + featureInputs.length + designSettings.days));
  const daysMax = daysMin + 3;

  return {
    screens,
    designLabel: designSettings.label,
    total,
    time: `${daysMin}-${daysMax} рабочих дней`,
  };
}

function updateEstimate() {
  const estimate = getEstimate();

  if (screenCount) {
    screenCount.textContent = estimate.screens;
  }

  if (designLevelLabel) {
    designLevelLabel.textContent = estimate.designLabel;
  }

  if (estimateTotal) {
    estimateTotal.textContent = money.format(estimate.total);
  }

  if (estimateTime) {
    estimateTime.textContent = estimate.time;
  }
}

calculator?.addEventListener("input", updateEstimate);
updateEstimate();
syncBudgetFields();

applyEstimate?.addEventListener("click", () => {
  syncBudgetFields();
  openModal();
});

function syncBudgetFields() {
  const value = estimateTotal?.textContent || "$1 200";
  budgetFields.forEach((field) => {
    field.value = value;
  });
}

runDemo?.addEventListener("click", () => {
  const lines = [
    ["этап", "собираем структуру и акценты страницы"],
    ["этап", "создаём визуальную систему и адаптив"],
    ["этап", "подключаем форму, чат и нужные сценарии"],
    ["этап", "готовим финальный запуск и передачу"],
  ];

  if (!consoleLog) {
    return;
  }

  consoleLog.innerHTML = "";
  runDemo.setAttribute("disabled", "true");

  lines.forEach(([label, text], index) => {
    window.setTimeout(() => {
      const line = document.createElement("p");
      line.innerHTML = `<span>${label}</span> ${text}`;
      consoleLog.append(line);

      if (index === lines.length - 1) {
        runDemo.removeAttribute("disabled");
      }
    }, reducedMotion ? 0 : index * 360);
  });
});

let currentSlide = 0;

function renderSlide(index) {
  const total = slides.length;
  currentSlide = (index + total) % total;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === currentSlide);
  });

  slideDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === currentSlide);
  });

  if (slideCounter) {
    slideCounter.textContent = `${String(currentSlide + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  }
}

prevSlide?.addEventListener("click", () => renderSlide(currentSlide - 1));
nextSlide?.addEventListener("click", () => renderSlide(currentSlide + 1));
slideDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    renderSlide(Number(dot.dataset.slideDot));
  });
});
renderSlide(0);

openModalButtons.forEach((button) => {
  button.addEventListener("click", openModal);
});

closeOrderModal?.addEventListener("click", closeModal);
orderModal?.addEventListener("click", (event) => {
  if (event.target === orderModal) {
    closeModal();
  }
});

closeProductModal?.addEventListener("click", closeProductModalWindow);
productModal?.addEventListener("click", (event) => {
  if (event.target === productModal) {
    closeProductModalWindow();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
    closeProductModalWindow();
    closeChat();
  }
});

function openModal() {
  syncBudgetFields();
  orderModal?.classList.add("is-open");
  orderModal?.setAttribute("aria-hidden", "false");
  refreshModalState();
}

function closeModal() {
  orderModal?.classList.remove("is-open");
  orderModal?.setAttribute("aria-hidden", "true");
  refreshModalState();
}

function openProductModal(productId, sourceCard) {
  const product = getProductById(productId);
  if (!product) {
    return;
  }

  currentModalProduct = product;
  currentProductId = product.id;
  currentModalPhoto = Number(sourceCard?.dataset.currentPhoto || 0);
  if (productModalArtImage) {
    productModalArtImage.src = product.photos[currentModalPhoto] || product.photos[0];
    productModalArtImage.alt = product.name;
  }
  if (productModalTitle) {
    productModalTitle.textContent = product.name;
  }
  if (productModalDescription) {
    productModalDescription.textContent = product.description;
  }
  if (productModalPrice) {
    productModalPrice.textContent = money.format(product.price);
  }
  fillSelect(productModalColor, product.colors, sourceCard?.querySelector(".product-color")?.value);
  fillSelect(productModalSize, product.sizes, sourceCard?.querySelector(".product-size")?.value);
  renderProductModalThumbs(product, currentModalPhoto);
  productModalArtWrap?.classList.remove("is-zoomed");

  productModal?.classList.add("is-open");
  productModal?.setAttribute("aria-hidden", "false");
  refreshModalState();
}

function closeProductModalWindow() {
  productModal?.classList.remove("is-open");
  productModal?.setAttribute("aria-hidden", "true");
  productModalArtWrap?.classList.remove("is-zoomed");
  refreshModalState();
}

function refreshModalState() {
  const anyModalOpen =
    orderModal?.classList.contains("is-open") || productModal?.classList.contains("is-open");
  body.classList.toggle("modal-open", Boolean(anyModalOpen));
}

forms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors(form);

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const errors = validateRequest(payload);
    const status = form.querySelector(".form-status");

    if (Object.keys(errors).length > 0) {
      showErrors(form, errors);
      if (status) {
        status.textContent = "Проверьте поля с подсказками, и заявка будет готова к отправке.";
      }
      return;
    }

    const submitButton = form.querySelector(".form-submit");
    submitButton?.classList.add("is-loading");
    submitButton?.setAttribute("disabled", "true");
    if (status) {
      status.textContent = "Отправляем заявку...";
    }

    window.setTimeout(() => {
      const requestId = `REQ-${Date.now().toString().slice(-6)}`;
      const request = {
        id: requestId,
        createdAt: new Date().toISOString(),
        ...payload,
      };

      localStorage.setItem("latestLandingRequest", JSON.stringify(request));
      submitButton?.classList.remove("is-loading");
      submitButton?.removeAttribute("disabled");
      form.reset();
      syncBudgetFields();

      if (status) {
        status.textContent = `Заявка ${requestId} сформирована. В реальном проекте следующий шаг — передача в CRM, чат или email.`;
      }

      if (form.id === "modal-request-form") {
        window.setTimeout(closeModal, reducedMotion ? 0 : 900);
      }
    }, reducedMotion ? 0 : 900);
  });
});

function validateRequest(payload) {
  const errors = {};

  if (!payload.name || payload.name.trim().length < 2) {
    errors.name = "Введите имя от 2 символов.";
  }

  if (!payload.contact || payload.contact.trim().length < 5) {
    errors.contact = "Оставьте телефон или Telegram.";
  }

  if (!payload.projectType) {
    errors.projectType = "Выберите тип проекта.";
  }

  if (!payload.message || payload.message.trim().length < 12) {
    errors.message = "Добавьте хотя бы короткое описание задачи.";
  }

  return errors;
}

function clearErrors(form) {
  form.querySelectorAll(".field-error").forEach((error) => {
    error.textContent = "";
  });
}

function showErrors(form, errors) {
  Object.entries(errors).forEach(([name, message]) => {
    const field = form.querySelector(`[name="${name}"]`);
    const error = field?.closest(".field")?.querySelector(".field-error");

    if (error) {
      error.textContent = message;
    }
  });
}

function getProductById(productId) {
  const card = productCards.find((item) => item.dataset.productId === productId);
  if (!card) {
    return null;
  }

  return {
    id: card.dataset.productId,
    name: card.dataset.name,
    price: Number(card.dataset.price),
    description: card.dataset.description,
    category: card.dataset.category,
    photos: splitValues(card.dataset.photos),
    colors: splitValues(card.dataset.colors),
    sizes: splitValues(card.dataset.sizes),
  };
}

function splitValues(value) {
  return (value || "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function initializeProductCards() {
  productCards.forEach((card) => {
    const photos = splitValues(card.dataset.photos);
    const colors = splitValues(card.dataset.colors);
    const sizes = splitValues(card.dataset.sizes);
    const colorSelect = card.querySelector(".product-color");
    const sizeSelect = card.querySelector(".product-size");
    const thumbs = card.querySelector(".product-thumbs");

    fillSelect(colorSelect, colors);
    fillSelect(sizeSelect, sizes);
    card.dataset.currentPhoto = "0";
    renderCardThumbs(card, photos, thumbs);
  });
}

function fillSelect(select, items, selectedValue) {
  if (!select) {
    return;
  }

  select.innerHTML = "";
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.append(option);
  });

  if (selectedValue && items.includes(selectedValue)) {
    select.value = selectedValue;
  }
}

function renderCardThumbs(card, photos, container) {
  if (!container || photos.length === 0) {
    return;
  }

  container.innerHTML = "";
  photos.forEach((src, index) => {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = `product-thumb ${index === 0 ? "is-active" : ""}`;
    thumb.dataset.photoIndex = String(index);
    thumb.innerHTML = `<img src="${src}" alt="Фото товара ${index + 1}">`;
    container.append(thumb);
  });
}

function setCardPhoto(card, index) {
  const photos = splitValues(card.dataset.photos);
  if (!photos.length) {
    return;
  }

  const safeIndex = Math.max(0, Math.min(index, photos.length - 1));
  const mainImage = card.querySelector(".product-photo-main");
  if (mainImage) {
    mainImage.src = photos[safeIndex];
  }

  card.dataset.currentPhoto = String(safeIndex);
  card.querySelectorAll(".product-thumb").forEach((thumb, thumbIndex) => {
    thumb.classList.toggle("is-active", thumbIndex === safeIndex);
  });
}

function applyProductFilters() {
  const category = productCategory?.value || "all";
  const sort = productSort?.value || "popular";
  const sorted = [...productCards].sort((a, b) => {
    const priceA = Number(a.dataset.price);
    const priceB = Number(b.dataset.price);
    const orderA = Number(a.dataset.order);
    const orderB = Number(b.dataset.order);

    if (sort === "cheap") {
      return priceA - priceB;
    }
    if (sort === "expensive") {
      return priceB - priceA;
    }
    return orderA - orderB;
  });

  sorted.forEach((card) => {
    const visible = category === "all" || card.dataset.category === category;
    card.classList.toggle("is-hidden", !visible);
    productGrid?.append(card);
  });
}

productCategory?.addEventListener("change", applyProductFilters);
productSort?.addEventListener("change", applyProductFilters);
applyProductFilters();

productGrid?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const card = target.closest(".product-card");
  if (!card) {
    return;
  }

  const productId = card.dataset.productId;
  if (!productId) {
    return;
  }

  const thumbButton = target.closest(".product-thumb");
  if (thumbButton) {
    setCardPhoto(card, Number(thumbButton.dataset.photoIndex || 0));
    return;
  }

  if (target.closest(".product-view")) {
    openProductModal(productId, card);
  }

  if (target.closest(".product-add")) {
    const color = card.querySelector(".product-color")?.value || "Стандарт";
    const size = card.querySelector(".product-size")?.value || "Стандарт";
    addToCart(productId, { color, size });
  }
});

productZoomToggle?.addEventListener("click", () => {
  productModalArtWrap?.classList.toggle("is-zoomed");
});

productModalArtWrap?.addEventListener("mousemove", (event) => {
  if (!productModalArtWrap.classList.contains("is-zoomed") || !productModalArtImage) {
    return;
  }

  const rect = productModalArtWrap.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  productModalArtImage.style.transformOrigin = `${x}% ${y}%`;
});

function renderProductModalThumbs(product, activeIndex) {
  if (!productModalThumbs) {
    return;
  }

  const safeIndex = Math.max(0, Math.min(activeIndex, product.photos.length - 1));
  productModalThumbs.innerHTML = "";
  product.photos.forEach((src, index) => {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = `product-modal-thumb ${index === safeIndex ? "is-active" : ""}`;
    thumb.dataset.modalPhotoIndex = String(index);
    thumb.innerHTML = `<img src="${src}" alt="Фото товара ${index + 1}">`;
    thumb.addEventListener("click", () => {
      if (!currentModalProduct || !productModalArtImage) {
        return;
      }

      currentModalPhoto = index;
      productModalArtImage.src = currentModalProduct.photos[index];
      productModalArtImage.alt = `${currentModalProduct.name} фото ${index + 1}`;
      productModalThumbs.querySelectorAll(".product-modal-thumb").forEach((item, itemIndex) => {
        item.classList.toggle("is-active", itemIndex === index);
      });
    });
    productModalThumbs.append(thumb);
  });
}

productModalAdd?.addEventListener("click", () => {
  if (!currentProductId) {
    return;
  }

  const color = productModalColor?.value || "Стандарт";
  const size = productModalSize?.value || "Стандарт";
  addToCart(currentProductId, { color, size });
  closeProductModalWindow();
});

function addToCart(productId, options = {}) {
  const product = getProductById(productId);
  if (!product) {
    return;
  }

  const color = options.color || product.colors[0] || "Стандарт";
  const size = options.size || product.sizes[0] || "Стандарт";
  const cartKey = `${productId}__${color}__${size}`;
  const current = cart.get(cartKey);
  if (current) {
    current.qty += 1;
  } else {
    cart.set(cartKey, { ...product, color, size, qty: 1, cartKey });
  }

  renderCart();
}

function removeFromCart(cartKey) {
  const current = cart.get(cartKey);
  if (!current) {
    return;
  }

  if (current.qty > 1) {
    current.qty -= 1;
  } else {
    cart.delete(cartKey);
  }

  renderCart();
}

cartItems?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const button = target.closest("[data-remove-item]");
  if (!button) {
    return;
  }

  removeFromCart(button.getAttribute("data-remove-item"));
});

function renderCart() {
  const entries = [...cart.values()];
  const totalCount = entries.reduce((sum, item) => sum + item.qty, 0);
  const totalAmount = entries.reduce((sum, item) => sum + item.qty * item.price, 0);

  if (cartCount) {
    cartCount.textContent = String(totalCount);
  }
  if (cartTotal) {
    cartTotal.textContent = money.format(totalAmount);
  }
  if (checkoutTotal) {
    checkoutTotal.textContent = money.format(totalAmount);
  }

  if (!cartItems) {
    return;
  }

  if (entries.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Корзина пока пустая.</p>';
    return;
  }

  cartItems.innerHTML = "";
  entries.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <span>${item.color} / ${item.size}</span>
        <span>${item.qty} × ${money.format(item.price)}</span>
      </div>
      <strong>${money.format(item.qty * item.price)}</strong>
      <button type="button" data-remove-item="${item.cartKey}" aria-label="Убрать товар">−</button>
    `;
    cartItems.append(row);
  });
}

renderCart();

checkoutForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors(checkoutForm);

  const formData = new FormData(checkoutForm);
  const payload = Object.fromEntries(formData.entries());
  const errors = {};

  if (cart.size === 0) {
    checkoutStatus.textContent = "Добавьте хотя бы один товар в корзину.";
    return;
  }

  if (!payload.buyerName || payload.buyerName.trim().length < 2) {
    errors.buyerName = "Введите имя от 2 символов.";
  }
  if (!payload.buyerPhone || payload.buyerPhone.trim().length < 6) {
    errors.buyerPhone = "Укажите корректный номер телефона.";
  }
  if (!payload.deliveryType) {
    errors.deliveryType = "Выберите способ доставки.";
  }
  if (!payload.paymentType) {
    errors.paymentType = "Выберите способ оплаты.";
  }

  if (Object.keys(errors).length > 0) {
    showErrors(checkoutForm, errors);
    checkoutStatus.textContent = "Проверьте поля формы покупки.";
    return;
  }

  checkoutStatus.textContent = "Оформляем заказ...";
  const submitButton = document.getElementById("checkout-submit");
  submitButton?.setAttribute("disabled", "true");

  window.setTimeout(() => {
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      items: [...cart.values()],
      payload,
    };
    localStorage.setItem("latestDemoOrder", JSON.stringify(order));

    cart.clear();
    renderCart();
    checkoutForm.reset();
    checkoutStatus.textContent = `Заказ ${orderId} оформлен. В рабочем проекте данные отправляются в CRM и платёжный модуль.`;
    submitButton?.removeAttribute("disabled");
  }, reducedMotion ? 0 : 800);
});

chatLauncher?.addEventListener("click", () => {
  const open = chatPanel?.classList.contains("is-open");
  if (open) {
    closeChat();
  } else {
    chatPanel?.classList.add("is-open");
    chatPanel?.setAttribute("aria-hidden", "false");
  }
});

chatClose?.addEventListener("click", closeChat);

function closeChat() {
  chatPanel?.classList.remove("is-open");
  chatPanel?.setAttribute("aria-hidden", "true");
}

chatChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const value = chip.dataset.chatValue;
    appendChatMessage(value, "user");
    window.setTimeout(() => {
      appendChatMessage(chatReplies[value] || "Можно обсудить это подробнее в короткой заявке.", "bot");
    }, reducedMotion ? 0 : 320);
  });
});

function appendChatMessage(text, author) {
  if (!chatMessages) {
    return;
  }

  const message = document.createElement("div");
  message.className = `chat-message chat-message-${author}`;
  message.textContent = text;
  chatMessages.append(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  if (author === "user") {
    chatPanel?.classList.add("is-open");
    chatPanel?.setAttribute("aria-hidden", "false");
  }
}

chatCompose?.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = chatInput?.value.trim();
  if (!text) {
    return;
  }

  appendChatMessage(text, "user");
  if (chatInput) {
    chatInput.value = "";
  }

  const lower = text.toLowerCase();
  let reply = "Спасибо за запрос. Подскажу по срокам, бюджету и оптимальному формату проекта.";
  if (lower.includes("срок")) {
    reply = "Обычно первый рабочий результат можно показать через 7-14 дней, в зависимости от объёма.";
  } else if (lower.includes("бюдж")) {
    reply = "Стартовый бюджет зависит от структуры и интерактива. В калькуляторе выше можно сразу получить ориентир.";
  } else if (lower.includes("интеграц") || lower.includes("crm") || lower.includes("api")) {
    reply = "Можно подключить CRM, формы, Telegram, аналитику и другие сервисы под вашу задачу.";
  }

  window.setTimeout(() => {
    appendChatMessage(reply, "bot");
  }, reducedMotion ? 0 : 280);
});
