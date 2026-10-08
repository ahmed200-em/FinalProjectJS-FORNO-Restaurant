let burgerMenu = document.querySelector("#burgerMenu");
let burgerLinks = document.querySelector(".burger-links");
let linkList = document.createElement("ul");
let searchInput = document.querySelector("#searchInput");
let filterBar = document.querySelector(".filter-bar");
let filterResultNumber = document.querySelector(".filter-result-number");
let panierBtn = document.querySelector(".panier");
let burgerBag = document.querySelector("#burgerBag");
let cartDrawer = document.querySelector("#cartDrawer");
let cartOverlay = document.querySelector("#cartOverlay");
let closeCartBtn = document.querySelector("#closeCartBtn");
let cartItemsContainer = document.querySelector("#cartItemsContainer");
let cartTotalPrice = document.querySelector("#cartTotalPrice");
let navCartCount = document.querySelector(".panier span");
let burgerCartCount = document.querySelector("#burgerBag-count");
let addButtons = document.querySelectorAll(".price button");

let cart = [];

function updateFilterResultNumber() {
  let cards = document.querySelectorAll(".card");
  let visibleCards = Array.from(cards).filter(
    (card) => card.style.display !== "none"
  );
  if (filterResultNumber) {
    filterResultNumber.textContent = visibleCards.length;
  }
}

function applyFilters() {
  let searchValue = searchInput ? searchInput.value.toLowerCase() : "";
  let filterValue = filterBar ? filterBar.value.toLowerCase() : "";
  let cards = document.querySelectorAll(".card");

  cards.forEach(function (card) {
    let title = card.querySelector(".card-text-title").textContent.toLowerCase();
    let category = card.querySelector(".card-text-subtitle").textContent.toLowerCase();

    let matchesSearch = title.includes(searchValue);
    let matchesCategory = filterValue === "" || category.includes(filterValue);

    if (matchesSearch && matchesCategory) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });

  updateFilterResultNumber();
}

if (searchInput) {
  searchInput.addEventListener("input", applyFilters);
}

if (filterBar) {
  filterBar.addEventListener("change", applyFilters);
}
if (burgerMenu) {
  linkList.className = "burger-links-list";
  linkList.innerHTML = `
      <li><a href="index.html">Accueil</a></li>
      <li><a href="index.html#cartSection">Menu</a></li>
      <li><a href="about.html">À propos</a></li>
      <li><a href="contact.html">Contact</a></li>
  `;

  burgerMenu.addEventListener("click", function () {
    if (burgerLinks.contains(linkList)) {
      burgerLinks.removeChild(linkList);
    } else {
      burgerLinks.appendChild(linkList);
    }
  });
}

if (panierBtn && cartDrawer) {
  panierBtn.addEventListener("click", function (e) {
    e.preventDefault();
    cartDrawer.classList.add("active");
  });
}

if (burgerBag && cartDrawer) {
  burgerBag.addEventListener("click", function () {
    cartDrawer.classList.add("active");
  });
}

if (closeCartBtn && cartDrawer) {
  closeCartBtn.addEventListener("click", function () {
    cartDrawer.classList.remove("active");
  });
}

if (cartOverlay && cartDrawer) {
  cartOverlay.addEventListener("click", function () {
    cartDrawer.classList.remove("active");
  });
}

function renderCart() {
  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-msg">Votre panier est vide pour le moment.</p>`;
    if (cartTotalPrice) cartTotalPrice.textContent = "0";
    if (navCartCount) navCartCount.textContent = "0";
    if (burgerCartCount) burgerCartCount.textContent = "0";
    return;
  }

  let totalMoney = 0;
  let totalItems = 0;

  cart.forEach(function (item, index) {
    totalMoney += item.price * item.quantity;
    totalItems += item.quantity;

    let itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <img src="${item.imgSrc}" alt="" />
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${item.price} MAD</p>
        <div class="cart-item-qty">
          <button class="minus-btn" data-index="${index}">-</button>
          <span>${item.quantity}</span>
          <button class="plus-btn" data-index="${index}">+</button>
        </div>
      </div>
      <button class="remove-btn" data-index="${index}">&times;</button>
    `;

    cartItemsContainer.appendChild(itemDiv);
  });

  if (cartTotalPrice) cartTotalPrice.textContent = totalMoney;
  if (navCartCount) navCartCount.textContent = totalItems;
  if (burgerCartCount) burgerCartCount.textContent = totalItems;

  let minusButtons = document.querySelectorAll(".minus-btn");
  let plusButtons = document.querySelectorAll(".plus-btn");
  let removeButtons = document.querySelectorAll(".remove-btn");

  minusButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      let idx = btn.getAttribute("data-index");
      cart[idx].quantity -= 1;
      if (cart[idx].quantity <= 0) {
        cart.splice(idx, 1);
      }
      renderCart();
    });
  });

  plusButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      let idx = btn.getAttribute("data-index");
      cart[idx].quantity += 1;
      renderCart();
    });
  });

  removeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      let idx = btn.getAttribute("data-index");
      cart.splice(idx, 1);
      renderCart();
    });
  });
}

if (addButtons) {
  addButtons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      let card = e.target.closest(".card");
      let name = card.querySelector(".card-text-title").textContent.trim();
      let price = parseFloat(card.querySelector(".price span").textContent.trim());
      let imgSrc = card.querySelector(".card-image img").getAttribute("src");

      let found = false;
      cart.forEach(function (item) {
        if (item.name === name) {
          item.quantity += 1;
          found = true;
        }
      });

      if (!found) {
        cart.push({
          name: name,
          price: price,
          imgSrc: imgSrc,
          quantity: 1,
        });
      }

      renderCart();

    });
  });
}