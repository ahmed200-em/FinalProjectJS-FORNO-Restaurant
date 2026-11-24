let burgerMenu = document.querySelector("#burgerMenu");
let burgerLinks = document.querySelector("#burgerLinks");
let linkList = document.querySelector(".nav-list").cloneNode(true);

linkList.className = "burger-links-list";
burgerLinks.appendChild(linkList);

function setBurgerMenu(open) {
  burgerLinks.hidden = !open;
  burgerMenu.setAttribute("aria-expanded", open);
}

burgerMenu.addEventListener("click", function () {
  setBurgerMenu(burgerLinks.hidden);
});

burgerLinks.addEventListener("click", function (event) {
  if (event.target.closest("a")) setBurgerMenu(false);
});

document.addEventListener("click", function (event) {
  if (!burgerMenu.contains(event.target) && !burgerLinks.contains(event.target)) {
    setBurgerMenu(false);
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !burgerLinks.hidden) {
    setBurgerMenu(false);
    burgerMenu.focus();
  }
});

window.matchMedia("(max-width: 768px)").addEventListener("change", function () {
  setBurgerMenu(false);
});
