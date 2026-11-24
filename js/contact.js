(function () {
  const contactForm = document.querySelector("#contactForm");
  const nameInput = document.querySelector("#name");
  const emailInput = document.querySelector("#email");
  const citySelect = document.querySelector("#citySelect");
  const messageInput = document.querySelector("#message");
  const review = document.querySelector("#contactReview");
  const reviewTitle = document.querySelector("#contactReviewTitle");

  function checkRequiredText(input, message) {
    input.setCustomValidity(input.value && !input.value.trim() ? message : "");
  }

  function showForm() {
    review.hidden = true;
    contactForm.hidden = false;
    nameInput.focus();
  }

  nameInput.addEventListener("input", function () {
    checkRequiredText(nameInput, "Saisissez votre nom.");
  });

  messageInput.addEventListener("input", function () {
    checkRequiredText(messageInput, "Saisissez votre message.");
  });

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    checkRequiredText(nameInput, "Saisissez votre nom.");
    checkRequiredText(messageInput, "Saisissez votre message.");

    if (!contactForm.reportValidity()) return;

    document.querySelector("#reviewName").textContent = nameInput.value.trim();
    document.querySelector("#reviewEmail").textContent = emailInput.value;
    document.querySelector("#reviewCity").textContent = citySelect.selectedOptions[0].textContent;
    document.querySelector("#reviewSubject").textContent = contactForm.elements.subject.value;
    document.querySelector("#reviewMessage").textContent = messageInput.value.trim();

    contactForm.hidden = true;
    review.hidden = false;
    reviewTitle.focus();
  });

  document.querySelector("#editMessageBtn").addEventListener("click", showForm);
  document.querySelector("#resetFormBtn").addEventListener("click", function () {
    const selectedCity = citySelect.value;
    contactForm.reset();
    citySelect.value = selectedCity;
    showForm();
  });

  contactForm.querySelector('button[type="submit"]').disabled = false;
})();
