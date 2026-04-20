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

export function initNoticeListing() {
  const filterRoot = document.getElementById("noticeListingFilters");
  const filterMenu = document.getElementById("noticeListingFilterMenu");
  const filterToggle = document.getElementById("noticeListingFilterToggle");
  const filterLabel = document.getElementById("noticeListingFilterLabel");
  const list = document.getElementById("noticeListingList");
  const count = document.getElementById("noticeListingCount");
  const pagination = document.getElementById("noticeListingPagination");

  if (
    !filterRoot ||
    !filterMenu ||
    !filterToggle ||
    !filterLabel ||
    !list ||
    !count ||
    !pagination
  ) {
    return;
  }

  const items = Array.from(list.querySelectorAll(".tdmu-notice-item"));
  if (!items.length) return;

  const categories = [
    ALL_LABEL,
    ...new Set(items.map((item) => item.dataset.category || "")),
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

  function getVisibleItems() {
    if (activeCategory === ALL_LABEL) return items;
    return items.filter((item) => item.dataset.category === activeCategory);
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
      <nav aria-label="Phân trang thông báo">
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
    const visibleItems = getVisibleItems();
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    items.forEach((item) => {
      item.hidden = true;
    });

    visibleItems.forEach((item, index) => {
      item.hidden = index < startIndex || index >= endIndex;
    });

    count.textContent = `${visibleItems.length} thông báo`;
    renderPagination(visibleItems.length);
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
