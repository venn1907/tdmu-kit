export function initFaqSection() {
  const mount = document.getElementById("faq-section-content");
  if (!mount) return;

  mount.querySelectorAll(".tdmu-faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".tdmu-faq-item");
      if (!item) return;

      const willOpen = button.getAttribute("aria-expanded") !== "true";

      mount.querySelectorAll(".tdmu-faq-item").forEach((otherItem) => {
        if (otherItem === item) return;
        closeFaqItem(otherItem);
      });

      if (willOpen) {
        openFaqItem(item);
      } else {
        closeFaqItem(item);
      }
    });
  });

  mount.querySelectorAll(".tdmu-faq-item").forEach((item) => {
    const panel = item.querySelector(".tdmu-faq-answer-wrap");
    if (!panel) return;

    if (item.classList.contains("is-open")) {
      panel.style.height = "auto";
      panel.style.opacity = "1";
      return;
    }

    panel.style.height = "0px";
    panel.style.opacity = "0";
  });
}

function openFaqItem(item) {
  const button = item.querySelector(".tdmu-faq-question");
  const panel = item.querySelector(".tdmu-faq-answer-wrap");
  if (!button || !panel) return;

  item.classList.add("is-open");
  button.setAttribute("aria-expanded", "true");

  panel.style.height = "0px";
  panel.style.opacity = "0";

  requestAnimationFrame(() => {
    panel.style.height = `${panel.scrollHeight}px`;
    panel.style.opacity = "1";
  });

  const handleExpandEnd = (event) => {
    if (event.propertyName !== "height") return;
    panel.style.height = "auto";
    panel.removeEventListener("transitionend", handleExpandEnd);
  };

  panel.addEventListener("transitionend", handleExpandEnd);
}

function closeFaqItem(item) {
  const button = item.querySelector(".tdmu-faq-question");
  const panel = item.querySelector(".tdmu-faq-answer-wrap");
  if (!button || !panel) return;

  item.classList.remove("is-open");
  button.setAttribute("aria-expanded", "false");

  panel.style.height = `${panel.scrollHeight}px`;
  panel.style.opacity = "1";

  requestAnimationFrame(() => {
    panel.style.height = "0px";
    panel.style.opacity = "0";
  });
}
