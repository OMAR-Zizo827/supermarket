/* ===========================================================
   STATE
   =========================================================== */
const state = {
  cart: {},        // { productId: qty }
  favorites: new Set(),
  activeCategory: "all",
};

const FREE_DELIVERY_THRESHOLD = 150;
const DELIVERY_FEE = 20;

function findProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

function cartCount() {
  return Object.values(state.cart).reduce((a, b) => a + b, 0);
}

function cartSubtotal() {
  return Object.entries(state.cart).reduce((sum, [id, qty]) => {
    const p = findProduct(id);
    return sum + (p ? p.price * qty : 0);
  }, 0);
}

function fmt(n) {
  return `E£${n.toFixed(2)}`;
}

/* ===========================================================
   CART OPERATIONS
   =========================================================== */
function addToCart(id, qty = 1) {
  state.cart[id] = (state.cart[id] || 0) + qty;
  onCartChanged();
  const p = findProduct(id);
  showToast(`✓ Added ${p.name} to basket`);
}

function setQty(id, qty) {
  if (qty <= 0) {
    delete state.cart[id];
  } else {
    state.cart[id] = qty;
  }
  onCartChanged();
}

function removeFromCart(id) {
  delete state.cart[id];
  onCartChanged();
}

function onCartChanged() {
  renderHeaderCart();
  renderReceipt();
  renderDrawer();
  renderProductGrids(); // to update stepper states on cards
}

/* ===========================================================
   FAVORITES
   =========================================================== */
function toggleFavorite(id) {
  if (state.favorites.has(id)) {
    state.favorites.delete(id);
  } else {
    state.favorites.add(id);
    const p = findProduct(id);
    showToast(`♥ Saved ${p.name} to favorites`);
  }
  renderFavBadge();
  renderProductGrids();
}

function renderFavBadge() {
  const badge = document.getElementById("favBadge");
  const n = state.favorites.size;
  badge.hidden = n === 0;
  badge.textContent = n;
  document.getElementById("favBtn").classList.toggle("liked", n > 0);
}

/* ===========================================================
   TOAST
   =========================================================== */
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ===========================================================
   RENDER: CATEGORY STRIP
   =========================================================== */
function renderCatStrip() {
  const strip = document.getElementById("catStrip");
  const all = [{ id: "all", label: "All", emoji: "🛒" }, ...CATEGORIES];
  strip.innerHTML = all.map(c => `
    <button class="cat-chip ${state.activeCategory === c.id ? "active" : ""}" data-cat="${c.id}">
      <span>${c.emoji}</span><span>${c.label}</span>
    </button>
  `).join("");

  strip.querySelectorAll(".cat-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      state.activeCategory = btn.dataset.cat;
      renderCatStrip();
      renderShopSections();
      document.getElementById("shop").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/* ===========================================================
   RENDER: PROMO MARQUEE
   =========================================================== */
function renderPromoStrip() {
  const items = [
    "Free delivery on orders over E£150",
    "New: Fresh sourdough baked daily 🍞",
    "Cash on delivery available everywhere in Giza",
    "Download the app for exclusive deals",
    "20-minute delivery, every single day",
  ];
  const track = document.getElementById("promoTrack");
  const renderItems = () => items.map(t => `<span class="promo-item"><span class="dot">●</span>${t}</span>`).join("");
  track.innerHTML = renderItems() + renderItems(); // duplicate for seamless loop
}

/* ===========================================================
   RENDER: PRODUCT CARD
   =========================================================== */
function productCardHTML(p) {
  const qty = state.cart[p.id] || 0;
  const isFav = state.favorites.has(p.id);
  return `
    <div class="product-card" data-id="${p.id}">
      <div class="product-thumb" data-action="quickview">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        ${p.tag ? `<span class="product-tag ${p.tag}">${p.tag === "sale" ? "Sale" : "New"}</span>` : ""}
        <button class="product-fav ${isFav ? "liked" : ""}" data-action="fav" aria-label="Save to favorites">
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-7.5-4.6-10-9.3C.5 8 2 4 6 4c2.2 0 3.8 1.3 4.6 2.7C11.4 5.3 13 4 15.2 4c4 0 5.5 4 4 7.7C19.5 16.4 12 21 12 21z" stroke="currentColor" stroke-width="1.8"/></svg>
        </button>
      </div>
      <div class="product-body">
        <div class="product-name" data-action="quickview">${p.name}</div>
        <div class="product-unit">${p.unit}</div>
        <div class="product-price-row">
          <span class="product-price">${fmt(p.price)}</span>
          ${p.oldPrice ? `<span class="product-old-price">${fmt(p.oldPrice)}</span>` : ""}
        </div>
        <div class="product-actions">
          ${qty === 0
            ? `<button class="add-btn" data-action="add">Add to basket</button>`
            : `<div class="qty-stepper">
                <button data-action="dec">−</button>
                <span class="qty-val">${qty}</span>
                <button data-action="inc">+</button>
               </div>`
          }
        </div>
      </div>
    </div>
  `;
}

function attachProductCardEvents(container) {
  container.querySelectorAll(".product-card").forEach(card => {
    const id = card.dataset.id;
    card.querySelectorAll('[data-action="quickview"]').forEach(el =>
      el.addEventListener("click", () => openProductModal(id))
    );
    const favBtn = card.querySelector('[data-action="fav"]');
    if (favBtn) favBtn.addEventListener("click", (e) => { e.stopPropagation(); toggleFavorite(id); });
    const addBtn = card.querySelector('[data-action="add"]');
    if (addBtn) addBtn.addEventListener("click", (e) => { e.stopPropagation(); addToCart(id); });
    const incBtn = card.querySelector('[data-action="inc"]');
    if (incBtn) incBtn.addEventListener("click", (e) => { e.stopPropagation(); setQty(id, (state.cart[id]||0) + 1); });
    const decBtn = card.querySelector('[data-action="dec"]');
    if (decBtn) decBtn.addEventListener("click", (e) => { e.stopPropagation(); setQty(id, (state.cart[id]||0) - 1); });
  });
}

/* ===========================================================
   RENDER: SHOP SECTIONS
   =========================================================== */
function renderShopSections() {
  const root = document.getElementById("shopSections");
  let cats;
  if (state.activeCategory === "all") {
    cats = CATEGORIES.filter(c => c.id !== "deals");
  } else if (state.activeCategory === "deals") {
    cats = [{ id: "deals", label: "Today's deals", emoji: "🔥" }];
  } else {
    cats = CATEGORIES.filter(c => c.id === state.activeCategory);
  }

  root.innerHTML = cats.map(c => {
    const products = c.id === "deals" ? getDeals() : PRODUCTS.filter(p => p.cat === c.id);
    if (products.length === 0) return "";
    return `
      <section class="shop-section" id="sec-${c.id}">
        <div class="shop-section-head">
          <h2 class="shop-section-title"><span>${c.emoji}</span> ${c.label}</h2>
          <span class="shop-section-count">${products.length} items</span>
        </div>
        <div class="product-grid">
          ${products.map(productCardHTML).join("")}
        </div>
      </section>
    `;
  }).join("") || `<div class="empty-state"><h3>Nothing here yet</h3><p>Try a different category.</p></div>`;

  attachProductCardEvents(root);
}

function renderProductGrids() {
  // Re-render just to sync stepper states without losing scroll position too much
  const root = document.getElementById("shopSections");
  if (!root) return;
  root.querySelectorAll(".product-card").forEach(card => {
    const id = card.dataset.id;
    const p = findProduct(id);
    const qty = state.cart[id] || 0;
    const isFav = state.favorites.has(id);
    const actionsDiv = card.querySelector(".product-actions");
    actionsDiv.innerHTML = qty === 0
      ? `<button class="add-btn" data-action="add">Add to basket</button>`
      : `<div class="qty-stepper"><button data-action="dec">−</button><span class="qty-val">${qty}</span><button data-action="inc">+</button></div>`;
    const favBtn = card.querySelector(".product-fav");
    favBtn.classList.toggle("liked", isFav);

    const addBtn = actionsDiv.querySelector('[data-action="add"]');
    if (addBtn) addBtn.addEventListener("click", (e) => { e.stopPropagation(); addToCart(id); });
    const incBtn = actionsDiv.querySelector('[data-action="inc"]');
    if (incBtn) incBtn.addEventListener("click", (e) => { e.stopPropagation(); setQty(id, (state.cart[id]||0) + 1); });
    const decBtn = actionsDiv.querySelector('[data-action="dec"]');
    if (decBtn) decBtn.addEventListener("click", (e) => { e.stopPropagation(); setQty(id, (state.cart[id]||0) - 1); });
  });
}

/* ===========================================================
   RENDER: HEADER CART BUTTON
   =========================================================== */
function renderHeaderCart() {
  document.getElementById("headerCartTotal").textContent = fmt(cartSubtotal());
  const badge = document.getElementById("cartBadge");
  const n = cartCount();
  badge.hidden = n === 0;
  badge.textContent = n;
}

/* ===========================================================
   RENDER: LIVE RECEIPT (hero signature element)
   =========================================================== */
function renderReceipt() {
  const linesEl = document.getElementById("receiptLines");
  const totalEl = document.getElementById("receiptTotal");
  const entries = Object.entries(state.cart);

  if (entries.length === 0) {
    linesEl.innerHTML = `<div class="receipt-empty">Your basket is empty.<br>Add something fresh →</div>`;
  } else {
    linesEl.innerHTML = entries.map(([id, qty]) => {
      const p = findProduct(id);
      const lineTotal = p.price * qty;
      return `<div class="receipt-line">
        <span class="rl-name">${p.name}</span>
        <span class="rl-qty">x${qty}</span>
        <span class="rl-price">${fmt(lineTotal)}</span>
      </div>`;
    }).join("");
    linesEl.scrollTop = linesEl.scrollHeight;
  }
  totalEl.textContent = fmt(cartSubtotal());
  renderBarcode();
}

function renderBarcode() {
  const g = document.getElementById("barcodeBars");
  if (!g) return;
  const count = Math.max(1, cartCount());
  // Seed bar widths off cart contents so it visually "changes" with the basket
  let seed = count * 7 + cartSubtotal();
  let bars = "";
  let x = 0;
  for (let i = 0; i < 40; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    const w = 1 + (seed % 4);
    if (i % 2 === 0) {
      bars += `<rect x="${x}" y="0" width="${w}" height="36" fill="#23211D"/>`;
    }
    x += w;
  }
  g.innerHTML = bars;
  g.closest("svg").setAttribute("viewBox", `0 0 ${x} 36`);
}

/* ===========================================================
   RENDER: CART DRAWER
   =========================================================== */
function renderDrawer() {
  const itemsEl = document.getElementById("drawerItems");
  const entries = Object.entries(state.cart);

  if (entries.length === 0) {
    itemsEl.innerHTML = `<div class="drawer-empty"><div class="e-icon">🧺</div><p>Your basket is empty.<br>Time to fill it up!</p></div>`;
  } else {
    itemsEl.innerHTML = entries.map(([id, qty]) => {
      const p = findProduct(id);
      return `
        <div class="drawer-item" data-id="${id}">
          <img src="${p.img}" alt="${p.name}">
          <div class="drawer-item-info">
            <div class="drawer-item-name">${p.name}</div>
            <div class="drawer-item-unit">${p.unit}</div>
            <div class="drawer-item-row">
              <div class="mini-stepper">
                <button data-action="dec">−</button>
                <span class="mini-qty">${qty}</span>
                <button data-action="inc">+</button>
              </div>
              <span class="drawer-item-price">${fmt(p.price * qty)}</span>
            </div>
          </div>
        </div>
      `;
    }).join("");

    itemsEl.querySelectorAll(".drawer-item").forEach(item => {
      const id = item.dataset.id;
      item.querySelector('[data-action="inc"]').addEventListener("click", () => setQty(id, (state.cart[id]||0)+1));
      item.querySelector('[data-action="dec"]').addEventListener("click", () => setQty(id, (state.cart[id]||0)-1));
    });
  }

  const subtotal = cartSubtotal();
  const delivery = subtotal === 0 ? 0 : (subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE);
  const total = subtotal + delivery;

  document.getElementById("drawerSubtotal").textContent = fmt(subtotal);
  document.getElementById("drawerDelivery").textContent = delivery === 0 ? "Free" : fmt(delivery);
  document.getElementById("drawerTotal").textContent = fmt(total);

  const hint = document.getElementById("drawerHint");
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (subtotal === 0) {
    hint.textContent = "Add items to see your total";
    hint.classList.remove("free");
    checkoutBtn.disabled = false;
  } else if (subtotal >= FREE_DELIVERY_THRESHOLD) {
    hint.textContent = "🎉 You unlocked free delivery!";
    hint.classList.add("free");
  } else {
    hint.textContent = `Add ${fmt(FREE_DELIVERY_THRESHOLD - subtotal)} more for free delivery`;
    hint.classList.remove("free");
  }
}

function openDrawer() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("drawerOverlay").classList.add("open");
}
function closeDrawer() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("drawerOverlay").classList.remove("open");
}

/* ===========================================================
   PRODUCT QUICK VIEW MODAL
   =========================================================== */
function openProductModal(id) {
  const p = findProduct(id);
  const modal = document.getElementById("productModal");
  const qty = state.cart[id] || 0;

  modal.innerHTML = `
    <button class="modal-close" id="pmClose" aria-label="Close">✕</button>
    <div class="pm-grid">
      <div class="pm-image"><img src="${p.img}" alt="${p.name}"></div>
      <div class="pm-info">
        ${p.tag ? `<span class="product-tag ${p.tag} pm-tag" style="position:static;display:inline-block;">${p.tag === "sale" ? "Sale" : "New"}</span>` : ""}
        <h2 class="pm-name">${p.name}</h2>
        <div class="pm-unit">${p.unit}</div>
        <p class="pm-desc">${p.desc}</p>
        <div class="pm-price-row">
          <span class="pm-price">${fmt(p.price)}</span>
          ${p.oldPrice ? `<span class="pm-old-price">${fmt(p.oldPrice)}</span>` : ""}
        </div>
        <div class="pm-stock">✓ ${p.stock} in stock — ready for delivery today</div>
        <div class="pm-actions" id="pmActions"></div>
      </div>
    </div>
  `;

  function renderPmActions() {
    const qty = state.cart[id] || 0;
    const actions = document.getElementById("pmActions");
    actions.innerHTML = qty === 0
      ? `<button class="btn btn-primary btn-block" id="pmAdd">Add to basket</button>`
      : `<div class="qty-stepper" style="padding:4px;"><button data-action="dec" style="width:46px;height:46px;font-size:20px;">−</button><span class="qty-val" style="font-size:16px;">${qty}</span><button data-action="inc" style="width:46px;height:46px;font-size:20px;">+</button></div>`;
    if (qty === 0) {
      document.getElementById("pmAdd").addEventListener("click", () => { addToCart(id); renderPmActions(); });
    } else {
      actions.querySelector('[data-action="inc"]').addEventListener("click", () => { setQty(id, (state.cart[id]||0)+1); renderPmActions(); });
      actions.querySelector('[data-action="dec"]').addEventListener("click", () => { setQty(id, (state.cart[id]||0)-1); renderPmActions(); });
    }
  }
  renderPmActions();

  document.getElementById("pmClose").addEventListener("click", closeProductModal);
  document.getElementById("modalOverlay").classList.add("open");
}
function closeProductModal() {
  document.getElementById("modalOverlay").classList.remove("open");
}

/* ===========================================================
   CHECKOUT MODAL
   =========================================================== */
function openCheckout() {
  if (cartCount() === 0) {
    showToast("Your basket is empty — add something first");
    return;
  }
  const modal = document.getElementById("checkoutModal");
  const subtotal = cartSubtotal();
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  modal.innerHTML = `
    <button class="modal-close" id="coClose" aria-label="Close">✕</button>
    <h2>Checkout</h2>
    <p class="co-sub">${cartCount()} item${cartCount() > 1 ? "s" : ""} · Delivering within 20 minutes</p>

    <form id="checkoutForm">
      <div class="co-field">
        <label for="coName">Full name</label>
        <input type="text" id="coName" placeholder="e.g. Omar Hassan" required>
      </div>
      <div class="co-row">
        <div class="co-field">
          <label for="coPhone">Phone number</label>
          <input type="tel" id="coPhone" placeholder="01x xxxx xxxx" required>
        </div>
        <div class="co-field">
          <label for="coArea">Area</label>
          <select id="coArea">
            <option>Dokki, Giza</option>
            <option>Mohandessin, Giza</option>
            <option>Maadi, Cairo</option>
            <option>Zamalek, Cairo</option>
            <option>6th of October City</option>
          </select>
        </div>
      </div>
      <div class="co-field">
        <label for="coAddress">Street address</label>
        <input type="text" id="coAddress" placeholder="Building, street, floor, apt." required>
      </div>
      <div class="co-field">
        <label for="coPayment">Payment method</label>
        <select id="coPayment">
          <option value="cod">Cash on delivery</option>
          <option value="card">Credit / debit card</option>
        </select>
      </div>
      <p class="co-error" id="coError">Please fill in your name, phone and address to continue.</p>

      <div class="co-summary">
        <div class="co-summary-row"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
        <div class="co-summary-row"><span>Delivery</span><span>${delivery === 0 ? "Free" : fmt(delivery)}</span></div>
        <div class="co-summary-row total"><span>Total</span><span>${fmt(total)}</span></div>
      </div>

      <button type="submit" class="btn btn-primary btn-block">Place order — ${fmt(total)}</button>
    </form>
  `;

  document.getElementById("coClose").addEventListener("click", closeCheckout);
  document.getElementById("checkoutForm").addEventListener("submit", handleCheckoutSubmit);
  document.getElementById("checkoutOverlay").classList.add("open");
}

function handleCheckoutSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("coName").value.trim();
  const phone = document.getElementById("coPhone").value.trim();
  const address = document.getElementById("coAddress").value.trim();
  const errorEl = document.getElementById("coError");

  if (!name || !phone || !address) {
    errorEl.classList.add("show");
    return;
  }
  errorEl.classList.remove("show");

  const orderId = "SG" + Math.floor(100000 + Math.random() * 899999);
  const modal = document.getElementById("checkoutModal");
  modal.innerHTML = `
    <button class="modal-close" id="coClose2" aria-label="Close">✕</button>
    <div class="success-screen">
      <div class="success-icon">✅</div>
      <h2>Order placed!</h2>
      <p>Thanks, ${name.split(" ")[0]} — your basket is on its way.</p>
      <p>Order ID: <span class="success-order-id">${orderId}</span></p>
      <div class="success-eta">🛵 Arriving in approximately 18–22 minutes</div>
      <button class="btn btn-primary btn-block" id="coDone">Done</button>
    </div>
  `;
  document.getElementById("coClose2").addEventListener("click", finishCheckout);
  document.getElementById("coDone").addEventListener("click", finishCheckout);

  // Clear cart after successful order
  state.cart = {};
  onCartChanged();
}

function finishCheckout() {
  document.getElementById("checkoutOverlay").classList.remove("open");
  closeDrawer();
}
function closeCheckout() {
  document.getElementById("checkoutOverlay").classList.remove("open");
}

/* ===========================================================
   SEARCH
   =========================================================== */
function setupSearch() {
  const input = document.getElementById("searchInput");
  const box = document.getElementById("searchSuggestions");

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (q.length === 0) {
      box.classList.remove("open");
      box.innerHTML = "";
      return;
    }
    const matches = PRODUCTS.filter(p => p.name.toLowerCase().includes(q)).slice(0, 6);
    box.innerHTML = matches.length
      ? matches.map(p => `
          <div class="suggestion-item" data-id="${p.id}">
            <img src="${p.img}" alt="">
            <div>
              <div style="font-weight:600;">${p.name}</div>
              <div style="font-size:11.5px;color:#8A8773;">${p.unit} · ${fmt(p.price)}</div>
            </div>
          </div>
        `).join("")
      : `<div class="suggestion-empty">No items found for "${q}"</div>`;
    box.classList.add("open");

    box.querySelectorAll(".suggestion-item").forEach(item => {
      item.addEventListener("click", () => {
        openProductModal(item.dataset.id);
        box.classList.remove("open");
        input.value = "";
      });
    });
  });

  document.addEventListener("click", (e) => {
    if (!box.contains(e.target) && e.target !== input) box.classList.remove("open");
  });
}

/* ===========================================================
   INIT
   =========================================================== */
function init() {
  renderCatStrip();
  renderPromoStrip();
  renderShopSections();
  renderHeaderCart();
  renderReceipt();
  renderDrawer();
  renderFavBadge();
  setupSearch();

  document.getElementById("cartBtn").addEventListener("click", openDrawer);
  document.getElementById("drawerClose").addEventListener("click", closeDrawer);
  document.getElementById("drawerOverlay").addEventListener("click", closeDrawer);
  document.getElementById("checkoutBtn").addEventListener("click", openCheckout);
  document.getElementById("shopNowBtn").addEventListener("click", () => {
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  });

  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target.id === "modalOverlay") closeProductModal();
  });
  document.getElementById("checkoutOverlay").addEventListener("click", (e) => {
    if (e.target.id === "checkoutOverlay") closeCheckout();
  });

  document.getElementById("favBtn").addEventListener("click", () => {
    if (state.favorites.size === 0) {
      showToast("No favorites yet — tap the heart on any item");
      return;
    }
    state.activeCategory = "all";
    renderCatStrip();
    const root = document.getElementById("shopSections");
    const favProducts = PRODUCTS.filter(p => state.favorites.has(p.id));
    root.innerHTML = `
      <section class="shop-section">
        <div class="shop-section-head">
          <h2 class="shop-section-title"><span>♥</span> Your favorites</h2>
          <span class="shop-section-count">${favProducts.length} items</span>
        </div>
        <div class="product-grid">${favProducts.map(productCardHTML).join("")}</div>
      </section>
    `;
    attachProductCardEvents(root);
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  });

  // Footer utility links — friendly placeholder behavior, no dead clicks
  document.getElementById("footerSupport").addEventListener("click", (e) => {
    e.preventDefault();
    showToast("💬 Support chat opens in-app — we reply within 2 minutes");
  });
  document.getElementById("footerTrack").addEventListener("click", (e) => {
    e.preventDefault();
    showToast("📦 Place an order first to track it here");
  });
  document.getElementById("footerReturns").addEventListener("click", (e) => {
    e.preventDefault();
    showToast("↩ Not happy with an item? We refund within 24h, no questions asked");
  });
  document.querySelectorAll(".app-badge").forEach(btn => {
    btn.addEventListener("click", () => showToast("📱 Scan the app to continue on mobile"));
  });

  // Escape key closes any open overlay
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeProductModal();
      closeCheckout();
      closeDrawer();
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
