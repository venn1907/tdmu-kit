import { escapeHtml, formatDate } from "../../js/core/dom.js";

const PAGE_SIZE = 6;

export function initNoticeListing(items) {
  const filterRoot = document.getElementById("noticeListingFilters");
  const filterMenu = document.getElementById("noticeListingFilterMenu");
  const filterToggle = document.getElementById("noticeListingFilterToggle");
  const filterLabel = document.getElementById("noticeListingFilterLabel");
  const list = document.getElementById("noticeListingList");
  const count = document.getElementById("noticeListingCount");
  const pagination = document.getElementById("noticeListingPagination");

  if (!filterRoot || !filterMenu || !filterToggle || !filterLabel || !list || !count || !pagination) return;

  const categories = ["Tất cả", ...new Set(items.map((item) => item.category))];
  let activeCategory = "Tất cả";
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
    if (activeCategory === "Tất cả") return items;
    return items.filter((item) => item.category === activeCategory);
  }

  function renderPagination(totalItems) {
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    currentPage = Math.min(currentPage, totalPages);

    if (totalPages <= 1) {
      pagination.innerHTML = "";
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

    pagination.innerHTML = `
      <nav aria-label="Phân trang thông báo">
        <ul class="pagination pagination-dark justify-content-center mb-0">
          <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <a class="page-link" href="#" data-prev="1">‹</a>
          </li>
          ${pages}
          <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <a class="page-link" href="#" data-next="1">›</a>
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

        renderList();
      });
    });
  }

  function renderList() {
    const visibleItems = getVisibleItems();
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const pagedItems = visibleItems.slice(startIndex, startIndex + PAGE_SIZE);

    list.innerHTML = pagedItems
      .map(
        (item) => `
          <article class="tdmu-notice-item">
            <a class="tdmu-notice-item-title" href="${escapeHtml(item.href || "#")}">${escapeHtml(item.title)}</a>
            <div class="tdmu-notice-item-meta">
              <span>${escapeHtml(formatDate(item.date))}</span>
              <span>·</span>
              <span>${escapeHtml(String(item.views))} lượt xem</span>
            </div>
          </article>
        `,
      )
      .join("");

    count.textContent = `${visibleItems.length} thông báo`;
    renderPagination(visibleItems.length);
  }

  function closeMenu() {
    filterMenu.hidden = true;
    filterToggle.setAttribute("aria-expanded", "false");
  }

  function applyCategory(nextCategory) {
    activeCategory = nextCategory || "Tất cả";
    currentPage = 1;
    renderFilters();
    renderList();
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
  renderList();
}
