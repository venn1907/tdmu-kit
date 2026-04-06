import { escapeHtml } from "../core/dom.js";

export function createListingController(config) {
  const {
    items,
    getCategory,
    filterRoot,
    filterMenu,
    filterToggle,
    filterLabel,
    paginationRoot,
    pageSize,
    onRender,
    onCountChange,
    allLabel = "Tất cả",
    paginationLabel = "Phân trang",
    initialCategory,
  } = config;

  const categories = [allLabel, ...new Set(items.map(getCategory))];
  let activeCategory = categories.includes(initialCategory)
    ? initialCategory
    : allLabel;
  let currentPage = 1;

  function renderButtons(className) {
    return categories
      .map(
        (category) => `
          <button
            class="${className}${category === activeCategory ? " is-active" : ""}"
            type="button"
            data-category="${escapeHtml(category)}"
          >
            ${escapeHtml(category)}
          </button>
        `,
      )
      .join("");
  }

  function renderFilters() {
    filterRoot.innerHTML = renderButtons("tdmu-listing-filter");
    filterMenu.innerHTML = renderButtons("tdmu-listing-filter-option");
    filterLabel.textContent = activeCategory;
  }

  function getVisibleItems() {
    if (activeCategory === allLabel) return items;
    return items.filter((item) => getCategory(item) === activeCategory);
  }

  function renderPagination(totalItems) {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    currentPage = Math.min(currentPage, totalPages);

    if (totalPages <= 1) {
      paginationRoot.innerHTML = "";
      return;
    }

    const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
      .map(
        (pageNumber) => `
          <li class="page-item ${pageNumber === currentPage ? "active" : ""}">
            <a class="page-link" href="#" data-page="${pageNumber}">${pageNumber}</a>
          </li>
        `,
      )
      .join("");

    paginationRoot.innerHTML = `
      <nav aria-label="${escapeHtml(paginationLabel)}">
        <ul class="pagination pagination-dark justify-content-center mb-0">
          <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <a class="page-link" href="#" data-prev="1" aria-label="Trang trước">
              <span class="material-symbols-rounded">chevron_left</span>
            </a>
          </li>
          ${pages}
          <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <a class="page-link" href="#" data-next="1" aria-label="Trang sau">
              <span class="material-symbols-rounded">chevron_right</span>
            </a>
          </li>
        </ul>
      </nav>
    `;

    paginationRoot.querySelectorAll(".page-link").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();

        if (link.dataset.page) currentPage = Number(link.dataset.page);
        if (link.dataset.prev) currentPage = Math.max(1, currentPage - 1);
        if (link.dataset.next)
          currentPage = Math.min(totalPages, currentPage + 1);

        render();
      });
    });
  }

  function closeMenu() {
    filterMenu.hidden = true;
    filterToggle.setAttribute("aria-expanded", "false");
  }

  function render() {
    const visibleItems = getVisibleItems();
    const startIndex = (currentPage - 1) * pageSize;
    const pagedItems = visibleItems.slice(startIndex, startIndex + pageSize);

    onRender(pagedItems, visibleItems);
    onCountChange?.(visibleItems.length);
    renderPagination(visibleItems.length);
  }

  function applyCategory(nextCategory) {
    activeCategory = nextCategory || allLabel;
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
