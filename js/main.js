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
let checkoutBtn = document.querySelector(".checkout-btn");

let cart = [];

function updateFilterResultNumber() {
  let cards = document.querySelectorAll(".card");
  let visibleCards = Array.from(cards).filter(
    (card) => card.style.display !== "none",
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
    let title = card
      .querySelector(".card-text-title")
      .textContent.toLowerCase();
    let category = card
      .querySelector(".card-text-subtitle")
      .textContent.toLowerCase();

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
  if (cart.length > 0) {
    cartItemsContainer.classList.add("active");
  } else {
    cartItemsContainer.classList.remove("active");
  }

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <em>Une part?</em>
      <h4>Votre panier attend sa pizza</h4>
      <p class="empty-msg">
        Choisissez votre recette et laissez la <br />
        gourmande faire le reste.
      </p>
    `;
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
    checkoutBtn.textContent = `Commander (${totalItems})`;
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
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", function (e) {
    if (cart.length === 0) {
      if (cartDrawer) cartDrawer.classList.remove("active");
      if (cartOverlay) cartOverlay.classList.remove("active");
    } else {
      e.preventDefault();
      alert("Merci pour votre commande !");
    }
  });
}
if (addButtons) {
  addButtons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      let card = e.target.closest(".card");
      let name = card.querySelector(".card-text-title").textContent.trim();
      let price = parseFloat(
        card.querySelector(".price span").textContent.trim(),
      );
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
let citySelect = document.querySelector("#citySelect");
if (citySelect) {
  let urlParams = new URLSearchParams(window.location.search);
  let selectedCity = urlParams.get("city");

  if (selectedCity) {
    citySelect.value = selectedCity;
  }
}
let Name = document.querySelector("#name");
let Email = document.querySelector("#email");
let Message = document.querySelector("#message");
let contactForm = document.querySelector("#contactForm");
let submitedFormResult = document.querySelector(".submited-form-result");
let formCard = document.querySelector(".contact-form-card");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let Subject = document.querySelector('input[name="subject"]:checked');

    if (Name && Email && Message) {
      console.log("Name:", Name.value);
      console.log("Email:", Email.value);
      console.log("Message:", Message.value);
      console.log("Subject:", Subject ? Subject.value : "None selected");

      if (formCard && submitedFormResult) {
        formCard.style.display = "none";
        submitedFormResult.style.display = "block";
        submitedFormResult.innerHTML = `
          <h2 class="result-title">Merci, ${Name.value}<em> !</em> </h2>
          <p class="result-subtitle">Votre message a été transmis avec succès.</p>

          <div class="result-details">
            <div class="detail-item">
              <span class="detail-label">VILLE DE RÉSIDENCE</span>
              <p class="detail-value">${citySelect.value}</p>
            </div>

            <div class="detail-item">
              <span class="detail-label">SUJET</span>
              <p class="detail-value">${Subject ? Subject.value : "None selected"}</p>
            </div>

            <div class="detail-item">
              <span class="detail-label">E-MAIL</span>
              <p class="detail-value">${Email.value}</p>
            </div>

            <div class="detail-item">
              <span class="detail-label">MESSAGE</span>
              <p class="detail-value">${Message.value}</p>
            </div>
          </div>

          <p class="result-footer-text">
            Nous avons bien reçu votre message. Cette confirmation valide que le formulaire a été soumis.
          </p>

          <button id="resetFormBtn" class="btn-submit">Écrire un autre message</button>
        `;
      }
    }
  });
}
