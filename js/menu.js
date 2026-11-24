let menuSection = document.querySelector("#cartSection");

if (menuSection) {
  let searchInput = menuSection.querySelector("#searchInput");
  let categoryFilter = menuSection.querySelector("#menuCategory");
  let results = menuSection.querySelector("#menuResults");
  let clearFilters = menuSection.querySelector("#clearMenuFilters");
  let cards = menuSection.querySelectorAll(".card");

  function normalizeMenuSearch(value) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/œ/g, "oe")
      .trim();
  }

  function applyMenuFilters() {
    let search = normalizeMenuSearch(searchInput.value);
    let searchTerms = search.split(/\s+/).filter(Boolean);
    let category = categoryFilter.value;
    let visibleCount = 0;

    cards.forEach(function (card) {
      let title = card.querySelector(".card-text-title").textContent;
      let ingredients = card.querySelector(".card-ingredients").textContent;
      let searchableText = normalizeMenuSearch(`${title} ${ingredients}`);
      let matchesSearch = searchTerms.every((term) =>
        searchableText.includes(term),
      );
      let matchesCategory = !category || card.dataset.category === category;

      card.hidden = !matchesSearch || !matchesCategory;
      if (!card.hidden) visibleCount += 1;
    });

    let message = `${visibleCount} pizzas à découvrir`;
    if (visibleCount === 0) {
      message =
        "Aucune pizza trouvée. Essayez un autre mot-clé ou une autre catégorie.";
    } else if (visibleCount === 1) {
      message = "1 pizza à découvrir";
    }
    if (results.textContent.trim() !== message) results.textContent = message;
    clearFilters.hidden = visibleCount !== 0;
  }

  searchInput.addEventListener("input", applyMenuFilters);
  categoryFilter.addEventListener("change", applyMenuFilters);
  clearFilters.addEventListener("click", function () {
    searchInput.value = "";
    categoryFilter.value = "";
    applyMenuFilters();
    searchInput.focus();
  });

  applyMenuFilters();
}
