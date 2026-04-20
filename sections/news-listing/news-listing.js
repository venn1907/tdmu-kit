const PAGE_SIZE = 6;
const ALL_LABEL = "Tất cả";

function buildButtonMarkup(category, activeCategory, className) {
  return `
    <button
      class="${className}${category === activeCategory ? " is-active" : ""}"
      type="button"
      data-category="${category}"
    >
      ${category}
    </button>
  `;
}

export function initNewsListing() {
  const filterRoot = document.getElementById("newsListingFilters");
  const filterMenu = document.getElementById("newsListingFilterMenu");
  const filterToggle = document.getElementById("newsListingFilterToggle");
  const filterLabel = document.getElementById("newsListingFilterLabel");
  const grid = document.getElementById("newsListingGrid");
  const count = document.getElementById("newsListingCount");
  const pagination = document.getElementById("newsListingPagination");

  if (
    !filterRoot ||
    !filterMenu ||
    !filterToggle ||
    !filterLabel ||
    !grid ||
    !count ||
    !pagination
  ) {
    return;
  }

  const cards = Array.from(grid.querySelectorAll(".tdmu-news-card"));
  if (!cards.length) return;

  const categories = [
    ALL_LABEL,
    ...new Set(cards.map((card) => card.dataset.category || "")),
  ];

  let activeCategory = categories[0];
  let currentPage = 1;

  function closeMenu() {
    filterMenu.hidden = true;
    filterToggle.setAttribute("aria-expanded", "false");
  }

  function renderFilters() {
    filterRoot.innerHTML = categories
      .map((category) =>
        buildButtonMarkup(category, activeCategory, "tdmu-listing-filter"),
      )
      .join("");

    filterMenu.innerHTML = categories
      .map((category) =>
        buildButtonMarkup(
          category,
          activeCategory,
          "tdmu-listing-filter-option",
        ),
      )
      .join("");

    filterLabel.textContent = activeCategory;
  }

  function getVisibleCards() {
    if (activeCategory === ALL_LABEL) return cards;
    return cards.filter((card) => card.dataset.category === activeCategory);
  }

  function renderPagination(totalItems) {
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    currentPage = Math.min(currentPage, totalPages);

    if (totalPages <= 1) {
      pagination.innerHTML = "";
      return;
    }

    const pageLinks = Array.from({ length: totalPages }, (_, index) => {
      const pageNumber = index + 1;
      return `
        <li class="page-item ${pageNumber === currentPage ? "active" : ""}">
          <a class="page-link" href="#" data-page="${pageNumber}">${pageNumber}</a>
        </li>
      `;
    }).join("");

    pagination.innerHTML = `
      <nav aria-label="Phân trang tin tức">
        <ul class="pagination pagination-dark justify-content-center mb-0">
          <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <a class="page-link" href="#" data-prev="1" aria-label="Trang trước">
              <span class="material-symbols-rounded">chevron_left</span>
            </a>
          </li>
          ${pageLinks}
          <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <a class="page-link" href="#" data-next="1" aria-label="Trang sau">
              <span class="material-symbols-rounded">chevron_right</span>
            </a>
          </li>
        </ul>
      </nav>
    `;

    pagination.querySelectorAll(".page-link").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();

        if (link.dataset.page) currentPage = Number(link.dataset.page);
        if (link.dataset.prev) currentPage = Math.max(1, currentPage - 1);
        if (link.dataset.next) currentPage = Math.min(totalPages, currentPage + 1);

        render();
      });
    });
  }

  function render() {
    const visibleCards = getVisibleCards();
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    cards.forEach((card) => {
      card.hidden = true;
    });

    visibleCards.forEach((card, index) => {
      card.hidden = index < startIndex || index >= endIndex;
    });

    count.textContent = `${visibleCards.length} bài viết`;
    renderPagination(visibleCards.length);
  }

  function applyCategory(category) {
    activeCategory = category || ALL_LABEL;
    currentPage = 1;
    renderFilters();
    render();
    closeMenu();
  }

  filterRoot.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    applyCategory(button.dataset.category);
  });

  filterMenu.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    applyCategory(button.dataset.category);
  });

  filterToggle.addEventListener("click", () => {
    const isOpen = !filterMenu.hidden;
    filterMenu.hidden = isOpen;
    filterToggle.setAttribute("aria-expanded", String(!isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".tdmu-listing-filter-dropdown")) {
      closeMenu();
    }
  });

  renderFilters();
  render();
}
