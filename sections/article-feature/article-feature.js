function initDetailFilterToggle(root) {
  const toggle = root.querySelector(".tdmu-listing-filter-toggle");
  const menu = root.querySelector(".tdmu-listing-filter-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = !menu.hidden;
    menu.hidden = isOpen;
    toggle.setAttribute("aria-expanded", String(!isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".tdmu-listing-filter-dropdown")) {
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

function initNewsRelatedCarousel(root) {
  const rail = root.querySelector("[data-news-rail]");
  const prevButton = root.querySelector("[data-news-prev]");
  const nextButton = root.querySelector("[data-news-next]");
  if (!rail || !prevButton || !nextButton) return;

  let currentIndex = 0;

  const getCards = () => Array.from(rail.querySelectorAll(".tdmu-article-related-card"));
  const getVisibleCount = () => {
    if (window.innerWidth <= 767.98) return 1;
    if (window.innerWidth <= 1199.98) return 2;
    return 4;
  };

  const update = () => {
    const cards = getCards();
    if (!cards.length) return;

    const visibleCount = getVisibleCount();
    const maxIndex = Math.max(0, cards.length - visibleCount);
    currentIndex = Math.min(currentIndex, maxIndex);

    rail.style.transform = `translateX(-${cards[currentIndex].offsetLeft}px)`;
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex >= maxIndex;
  };

  prevButton.addEventListener("click", () => {
    currentIndex = Math.max(0, currentIndex - 1);
    update();
  });

  nextButton.addEventListener("click", () => {
    const maxIndex = Math.max(0, getCards().length - getVisibleCount());
    currentIndex = Math.min(maxIndex, currentIndex + 1);
    update();
  });

  window.addEventListener("resize", update);
  update();
}

export function initArticleFeature() {
  const root = document.getElementById("article-feature-section");
  if (!root) return;

  initDetailFilterToggle(root);
  initNewsRelatedCarousel(root);
}
