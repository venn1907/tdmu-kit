export function initContactModal() {
  const root = document.getElementById("contactModalRoot");
  if (!root) return;

  const form = root.querySelector("#tdmuContactForm");
  const feedback = root.querySelector("#tdmuContactFeedback");
  const firstInput = root.querySelector("input, textarea");

  const closeModal = () => {
    root.hidden = true;
    document.body.classList.remove("tdmu-contact-open");
    feedback?.setAttribute("hidden", "");
  };

  const openModal = () => {
    root.hidden = false;
    document.body.classList.add("tdmu-contact-open");
    window.setTimeout(() => firstInput?.focus(), 50);
  };

  document.querySelectorAll("[data-contact-open]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openModal();
    });
  });

  root.querySelectorAll("[data-contact-close]").forEach((trigger) => {
    trigger.addEventListener("click", closeModal);
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    feedback?.removeAttribute("hidden");
    form.reset();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !root.hidden) {
      closeModal();
    }
  });
}
