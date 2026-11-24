let cartDrawer = document.querySelector("#cartDrawer");
let cartItemsContainer = document.querySelector("#cartItemsContainer");
let cartTitle = document.querySelector("#cartTitle");
let closeCartBtn = document.querySelector("#closeCartBtn");
let cartTotal = document.querySelector(".cart-drawer-total");
let cartTotalPrice = document.querySelector("#cartTotalPrice");
let cartTriggers = document.querySelectorAll('[aria-controls="cartDrawer"]');
let cartCounts = document.querySelectorAll("[data-cart-count]");
let cartStatus = document.querySelector("#cartStatus");
let browseMenuBtn = document.querySelector("#browseMenuBtn");
let checkoutBtn = document.querySelector("#checkoutBtn");
let confirmOrderBtn = document.querySelector("#confirmOrderBtn");
let backToCartBtn = document.querySelector("#backToCartBtn");
let cartDemoNote = document.querySelector("#cartDemoNote");
let cartStorageKey = "forno-cart";
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
  itemDiv.querySelector("p").textContent = `${item.price} MAD`;
  itemDiv.querySelector(".cart-item-qty span").textContent =
    cartStep === "review" ? `Quantité ${item.quantity}` : item.quantity;

  let actions = itemDiv.querySelectorAll("[data-cart-action]");
  actions[0].setAttribute("aria-label", `Diminuer la quantité de ${item.name}`);
  actions[1].setAttribute("aria-label", `Augmenter la quantité de ${item.name}`);
  actions[2].setAttribute("aria-label", `Retirer ${item.name} du panier`);
  actions.forEach(function (button) {
    button.hidden = cartStep === "review";
  });
  return itemDiv;
}

function renderCart() {
  let totalItems = 0;
  let totalPrice = 0;
  cart.forEach(function (item) {
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;
  });

  cartCounts.forEach(function (count) {
    count.textContent = totalItems;
  });
  cartTriggers.forEach(function (trigger) {
    trigger.setAttribute("aria-label", `Mon panier, ${totalItems} pizza${totalItems === 1 ? "" : "s"}`);
  });

  cartTotalPrice.textContent = totalPrice;
  cartTotal.hidden = cartStep === "complete";
  browseMenuBtn.hidden = cart.length > 0;
  checkoutBtn.hidden = cart.length === 0 || cartStep !== "items";
  checkoutBtn.textContent = `Vérifier la commande (${totalItems})`;
  confirmOrderBtn.hidden = backToCartBtn.hidden = cartDemoNote.hidden = cartStep !== "review";
  cartItemsContainer.classList.toggle("active", cart.length > 0);

  if (cartStep === "complete") {
    cartTitle.textContent = "Simulation terminée";
    cartItemsContainer.innerHTML = `
      <em>Merci !</em>
      <p class="empty-msg">Votre simulation est terminée. Aucune commande n’a été envoyée.</p>
    `;
  } else if (cart.length) {
    cartTitle.textContent = cartStep === "review" ? "Votre commande" : "Mon panier";
    cartItemsContainer.replaceChildren(...cart.map(createCartItem));
  } else {
    cartTitle.textContent = "Mon panier";
    cartItemsContainer.innerHTML = `
      <em>Une part ?</em>
      <h3>Votre panier attend sa pizza</h3>
      <p class="empty-msg">Choisissez votre recette et laissez la gourmandise faire le reste.</p>
    `;
  }

  return totalItems;
}

cartTriggers.forEach(function (trigger) {
  trigger.addEventListener("click", function () {
    cartStep = "items";
    renderCart();
    cartDrawer.showModal();
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

  let scrollPosition = cartItemsContainer.scrollTop;
  saveCart();
  renderCart();
  cartItemsContainer.scrollTop = scrollPosition;

  let nextRow = cartItemsContainer.children[Math.min(index, cart.length - 1)];
  if (nextRow) {
    nextRow.querySelector(`[data-cart-action="${action}"]`).focus();
  } else {
    browseMenuBtn.focus();
  }
});

checkoutBtn.addEventListener("click", function () {
  cartStep = "review";
  renderCart();
  cartTitle.focus();
});

backToCartBtn.addEventListener("click", function () {
  cartStep = "items";
  renderCart();
  checkoutBtn.focus();
});

confirmOrderBtn.addEventListener("click", function () {
  cart = [];
  saveCart();
  cartStep = "complete";
  renderCart();
  cartTitle.focus();
});

document.querySelectorAll("[data-pizza] .price button").forEach(function (button) {
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
  });
});

function refreshCart() {
  cart = loadCart();
  cartStep = "items";
  let focused = document.activeElement;
  renderCart();
  if (cartDrawer.open && (!focused.isConnected || focused.hidden)) {
    cartTitle.focus();
  }
}

window.addEventListener("storage", function (event) {
  if (event.key === cartStorageKey || event.key === null) refreshCart();
});

window.addEventListener("pageshow", function (event) {
  if (event.persisted) refreshCart();
});

renderCart();
