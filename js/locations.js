function initLocations() {
  let citySelect = document.querySelector("#citySelect");
  let locationButtons = document.querySelectorAll(".contact-location-item");
  if (!citySelect) return;

  let selectedCity = new URLSearchParams(window.location.search).get("city");
  let validCity = Array.from(citySelect.options).some(function (option) {
    return option.value === selectedCity;
  });
  if (validCity) {
    citySelect.value = selectedCity;
  }

  function updateLocations() {
    locationButtons.forEach(function (button) {
      let isSelected = button.dataset.city === citySelect.value;
      button.classList.toggle("active", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });
  }

  citySelect.addEventListener("change", updateLocations);
  locationButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      citySelect.value = button.dataset.city;
      updateLocations();
    });
  });
  updateLocations();
}

initLocations();
