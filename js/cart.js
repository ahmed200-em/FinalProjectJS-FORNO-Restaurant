let cartDrawer = document.querySelector("#cartDrawer");
let cartDrawerBody = document.querySelector(".cart-drawer-body");
let cartItemsContainer = document.querySelector("#cartItemsContainer");
let cartTitle = document.querySelector("#cartTitle");
let closeCartBtn = document.querySelector("#closeCartBtn");
let cartSummary = document.querySelector("#cartSummary");
let cartSubtotalRow = document.querySelector("#cartSubtotalRow");
let cartSubtotal = document.querySelector("#cartSubtotal");
let cartDeliveryRow = document.querySelector("#cartDeliveryRow");
let cartDeliveryFee = document.querySelector("#cartDeliveryFee");
let cartTotalPrice = document.querySelector("#cartTotalPrice");
let cartTriggers = document.querySelectorAll('[aria-controls="cartDrawer"]');
let cartCounts = document.querySelectorAll("[data-cart-count]");
let cartStatus = document.querySelector("#cartStatus");
let browseMenuBtn = document.querySelector("#browseMenuBtn");
let checkoutBtn = document.querySelector("#checkoutBtn");
let confirmOrderBtn = document.querySelector("#confirmOrderBtn");
let backToCartBtn = document.querySelector("#backToCartBtn");
let cartDemoNote = document.querySelector("#cartDemoNote");
let orderForm = document.querySelector("#orderForm");
let orderName = document.querySelector("#orderName");
let orderPhone = document.querySelector("#orderPhone");
let orderPhoneField = document.querySelector("#orderPhoneField");
let orderAddress = document.querySelector("#orderAddress");
let deliveryFields = document.querySelector("#deliveryFields");
let deliveryZone = document.querySelector("#deliveryZone");
let pickupNote = document.querySelector("#pickupNote");
let dineInNote = document.querySelector("#dineInNote");
let orderReceipt = document.querySelector("#orderReceipt");
let cartStorageKey = "forno-cart";
let tableStorageKey = "forno-demo-table";
let lastTableNumber = 0;
let tableCount = 12;
let deliveryFees = { center: 15, outskirts: 25 };
let priceFormat = new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 2 });
let cartStep = "items";
let cart = loadCart();

function loadCart() {
  try {
    let savedCart = JSON.parse(localStorage.getItem(cartStorageKey));
    if (!Array.isArray(savedCart)) return [];

    return savedCart.filter(function (item) {
      return item &&
        typeof item.name === "string" && item.name.trim() &&
        Number.isFinite(item.price) && item.price > 0 &&
        Number.isSafeInteger(item.quantity) && item.quantity > 0 &&
        typeof item.id === "string" && /^[a-z-]+$/.test(item.id);
    });
  } catch {
    return [];
  }
}

function saveCart() {
  try {
    if (cart.length) {
      localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    } else {
      localStorage.removeItem(cartStorageKey);
    }
  } catch {
    // Keep the cart usable for this page when browser storage is unavailable.
  }
}

function formatPrice(amount) {
  return `${priceFormat.format(amount)} MAD`;
}

function getSubtotal() {
  return cart.reduce(function (total, item) {
    return total + item.price * item.quantity;
  }, 0);
}

function getDeliveryFee() {
  return Object.hasOwn(deliveryFees, deliveryZone.value) ? deliveryFees[deliveryZone.value] : undefined;
}

function updateOrderFields() {
  let method = orderForm.elements.orderMethod.value;
  let isDelivery = method === "delivery";
  let isDineIn = method === "dine-in";

  deliveryFields.hidden = deliveryFields.disabled = !isDelivery;
  orderPhoneField.hidden = orderPhone.disabled = isDineIn;
  dineInNote.hidden = !isDineIn;
  pickupNote.hidden = method !== "pickup";

  let subtotal = getSubtotal();
  let includesDelivery = cartStep === "order" && isDelivery;
  let fee = includesDelivery ? getDeliveryFee() : 0;
  cartSubtotalRow.hidden = !includesDelivery;
  cartSubtotal.textContent = formatPrice(subtotal);
  cartDeliveryRow.hidden = !includesDelivery;
  cartDeliveryFee.textContent = fee === undefined ? "Zone à choisir" : formatPrice(fee);
  cartTotalPrice.textContent = fee === undefined ? "—" : formatPrice(subtotal + fee);
}

function validateOrderFields() {
  let phone = orderPhone.value.trim();
  let digitCount = phone.replace(/\D/g, "").length;
  let validPhone = /^\+?[0-9(). -]+$/.test(phone) && digitCount >= 7 && digitCount <= 15;

  orderName.setCustomValidity(orderName.value && !orderName.value.trim() ? "Saisissez votre nom." : "");
  orderPhone.setCustomValidity(orderPhone.value && !validPhone ? "Saisissez un numéro de téléphone valide." : "");
  orderAddress.setCustomValidity(orderAddress.value && !orderAddress.value.trim() ? "Saisissez votre adresse de livraison." : "");
}

function assignTable() {
  try {
    let savedTable = Number(localStorage.getItem(tableStorageKey));
    if (Number.isInteger(savedTable) && savedTable >= 1 && savedTable <= tableCount) {
      lastTableNumber = savedTable;
    }
  } catch {
    // The in-memory number is available when storage is disabled.
  }

  lastTableNumber = (lastTableNumber % tableCount) + 1;
  try {
    localStorage.setItem(tableStorageKey, String(lastTableNumber));
  } catch {
    // Table numbers can still advance on this page.
  }
  return `Table ${String(lastTableNumber).padStart(2, "0")}`;
}

function renderReceipt(method, fee) {
  let receiptName = orderReceipt.querySelector("#receiptName");
  let receiptMethod = orderReceipt.querySelector("#receiptMethod");
  let receiptDetailLabel = orderReceipt.querySelector("#receiptDetailLabel");
  let receiptDetail = orderReceipt.querySelector("#receiptDetail");
  let receiptItems = orderReceipt.querySelector("#receiptItems");

  orderReceipt.dataset.method = method;
  receiptName.textContent = orderName.value.trim();
  if (method === "dine-in") {
    receiptMethod.textContent = "Sur place";
    receiptDetailLabel.textContent = "Table attribuée";
    receiptDetail.textContent = assignTable();
  } else if (method === "delivery") {
    receiptMethod.textContent = "Livraison";
    receiptDetailLabel.textContent = "Adresse de livraison";
    receiptDetail.textContent = orderAddress.value.trim();
  } else {
    receiptMethod.textContent = "À emporter";
    receiptDetailLabel.textContent = "Retrait";
    receiptDetail.textContent = "Au comptoir";
  }

  receiptItems.replaceChildren(...cart.map(function (item) {
    let row = document.createElement("li");
    let label = document.createElement("span");
    let amount = document.createElement("strong");
    label.textContent = `${item.quantity} × ${item.name}`;
    amount.textContent = formatPrice(item.price * item.quantity);
    row.append(label, amount);
    return row;
  }));

  orderReceipt.querySelector("#receiptDeliveryRow").hidden = method !== "delivery";
  orderReceipt.querySelector("#receiptDeliveryFee").textContent = formatPrice(fee);
  orderReceipt.querySelector("#receiptTotal").textContent = formatPrice(getSubtotal() + fee);
}

function createCartItem(item) {
  let itemDiv = document.createElement("div");
  itemDiv.className = "cart-item";
  itemDiv.innerHTML = `
    <img alt="" />
    <div class="cart-item-info">
      <h3></h3>
      <p></p>
      <div class="cart-item-qty">
        <button type="button" data-cart-action="minus">−</button>
        <span></span>
        <button type="button" data-cart-action="plus">+</button>
      </div>
    </div>
    <button type="button" class="remove-item-btn" data-cart-action="remove">&times;</button>
  `;
  itemDiv.querySelector("img").src = `assets/images/${item.id}.png`;
  itemDiv.querySelector("h3").textContent = item.name;
  itemDiv.querySelector("p").textContent = formatPrice(item.price);
  itemDiv.querySelector(".cart-item-qty span").textContent = item.quantity;

  let actions = itemDiv.querySelectorAll("[data-cart-action]");
  actions[0].setAttribute("aria-label", `Diminuer la quantité de ${item.name}`);
  actions[1].setAttribute("aria-label", `Augmenter la quantité de ${item.name}`);
  actions[2].setAttribute("aria-label", `Retirer ${item.name} du panier`);
  return itemDiv;
}

function renderCart() {
  let totalItems = cart.reduce(function (total, item) { return total + item.quantity; }, 0);
  let ordering = cartStep === "order";
  let showingReceipt = cartStep === "receipt";

  cartCounts.forEach(function (count) {
    count.textContent = totalItems;
  });
  cartTriggers.forEach(function (trigger) {
    trigger.setAttribute("aria-label", `Mon panier, ${totalItems} pizza${totalItems === 1 ? "" : "s"}`);
  });

  updateOrderFields();
  cartSummary.hidden = cart.length === 0;
  browseMenuBtn.hidden = cart.length > 0;
  checkoutBtn.hidden = cart.length === 0 || cartStep !== "items";
  confirmOrderBtn.hidden = backToCartBtn.hidden = cartDemoNote.hidden = !ordering;
  cartItemsContainer.hidden = cartStep !== "items";
  orderForm.hidden = !ordering;
  orderReceipt.hidden = !showingReceipt;
  cartItemsContainer.classList.toggle("active", cart.length > 0);

  if (showingReceipt) {
    cartTitle.textContent = "Récapitulatif";
  } else if (ordering) {
    cartTitle.textContent = "Votre commande";
  } else if (cart.length) {
    cartTitle.textContent = "Mon panier";
    cartItemsContainer.replaceChildren(...cart.map(createCartItem));
  } else {
    cartTitle.textContent = "Mon panier";
    cartItemsContainer.innerHTML = `
      <em>Une part ?</em>
      <h3>Votre panier attend sa pizza</h3>
      <p class="empty-msg">Ajoutez une pizza depuis la carte.</p>
    `;
  }

  return totalItems;
}

cartTriggers.forEach(function (trigger) {
  trigger.addEventListener("click", function () {
    cartStep = "items";
    renderCart();
    cartDrawer.showModal();
    cartDrawerBody.scrollTop = 0;
    document.body.classList.add("cart-open");
  });
});

closeCartBtn.addEventListener("click", function () {
  cartDrawer.close();
});

cartDrawer.addEventListener("click", function (event) {
  if (event.target !== cartDrawer) return;
  let bounds = cartDrawer.getBoundingClientRect();
  if (event.clientX < bounds.left) cartDrawer.close();
});

cartDrawer.addEventListener("close", function () {
  document.body.classList.remove("cart-open");
  if (cartStep === "receipt") {
    orderReceipt.querySelector("#receiptName").textContent = "";
    orderReceipt.querySelector("#receiptDetail").textContent = "";
  }
});

browseMenuBtn.addEventListener("click", function () {
  cartDrawer.close();
});

cartItemsContainer.addEventListener("click", function (event) {
  let button = event.target.closest("[data-cart-action]");
  if (!button) return;

  let row = button.closest(".cart-item");
  let index = Array.from(cartItemsContainer.children).indexOf(row);
  let item = cart[index];
  let action = button.dataset.cartAction;

  if (action === "remove") {
    cart.splice(index, 1);
  } else {
    item.quantity += action === "plus" ? 1 : -1;
    if (item.quantity === 0) cart.splice(index, 1);
  }

  let scrollPosition = cartDrawerBody.scrollTop;
  saveCart();
  renderCart();
  cartDrawerBody.scrollTop = scrollPosition;

  let nextRow = cartItemsContainer.children[Math.min(index, cart.length - 1)];
  if (nextRow) {
    nextRow.querySelector(`[data-cart-action="${action}"]`).focus();
  } else {
    browseMenuBtn.focus();
  }
});

checkoutBtn.addEventListener("click", function () {
  if (!cart.length) return;
  cartStep = "order";
  renderCart();
  cartDrawerBody.scrollTop = 0;
  cartTitle.focus();
});

backToCartBtn.addEventListener("click", function () {
  cartStep = "items";
  renderCart();
  cartDrawerBody.scrollTop = 0;
  checkoutBtn.focus();
});

orderForm.addEventListener("input", validateOrderFields);
orderForm.addEventListener("change", function (event) {
  if (event.target.name === "orderMethod" || event.target === deliveryZone) {
    updateOrderFields();
  }
});

orderForm.addEventListener("submit", function (event) {
  event.preventDefault();
  if (!cart.length || cartStep !== "order") return;
  validateOrderFields();
  if (!orderForm.reportValidity()) return;

  let method = orderForm.elements.orderMethod.value;
  let fee = method === "delivery" ? getDeliveryFee() : 0;
  if (fee === undefined) return;

  renderReceipt(method, fee);
  orderForm.reset();
  validateOrderFields();
  cart = [];
  saveCart();
  cartStep = "receipt";
  renderCart();
  cartDrawerBody.scrollTop = 0;
  cartTitle.focus();
});

document.querySelectorAll("[data-pizza] .price button").forEach(function (button) {
  let buttonLabel = button.textContent;
  let feedbackTimer;

  button.addEventListener("click", function () {
    let card = button.closest("[data-pizza]");
    let id = card.dataset.pizza;
    let name = card.querySelector(".card-text-title").textContent.trim();
    let price = Number(card.querySelector(".price span").textContent);
    let item = cart.find(function (pizza) {
      return pizza.id === id;
    });

    if (item) {
      item.quantity += 1;
    } else {
      cart.push({ id: id, name: name, price: price, quantity: 1 });
    }

    saveCart();
    cartStep = "items";
    let totalItems = renderCart();
    cartStatus.textContent = `${name} ajoutée au panier. ${totalItems} pizza${totalItems === 1 ? "" : "s"} au total.`;

    clearTimeout(feedbackTimer);
    button.classList.add("added");
    button.textContent = "Ajoutée !";
    feedbackTimer = setTimeout(function () {
      button.classList.remove("added");
      button.textContent = buttonLabel;
    }, 1000);
  });
});

function refreshCart() {
  cart = loadCart();
  if (!cart.length || cartStep === "receipt") cartStep = "items";
  let focused = document.activeElement;
  renderCart();
  if (cartDrawer.open && (!focused.isConnected || focused.closest("[hidden]"))) {
    cartTitle.focus();
  }
}

window.addEventListener("storage", function (event) {
  if (event.key === cartStorageKey || event.key === null) refreshCart();
});

window.addEventListener("pageshow", function (event) {
  if (event.persisted) refreshCart();
});

Array.from(deliveryZone.options).forEach(function (option) {
  if (Object.hasOwn(deliveryFees, option.value)) {
    option.textContent += ` · ${formatPrice(deliveryFees[option.value])}`;
  }
});

renderCart();
