import { escapeHtml, formatDate, resolveAppUrl } from "../../js/core/dom.js";
import { getArticleTemplateHref } from "../../js/components/article-navigation.js";

const PAGE_SIZE = 6;

export function initNewsListing(items) {
  const filterRoot = document.getElementById("newsListingFilters");
  const filterMenu = document.getElementById("newsListingFilterMenu");
  const filterToggle = document.getElementById("newsListingFilterToggle");
  const filterLabel = document.getElementById("newsListingFilterLabel");
  const grid = document.getElementById("newsListingGrid");
  const count = document.getElementById("newsListingCount");
  const pagination = document.getElementById("newsListingPagination");

  if (!filterRoot || !filterMenu || !filterToggle || !filterLabel || !grid || !count || !pagination) return;

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
      <nav aria-label="Phân trang tin tức">
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

        renderGrid();
      });
    });
  }

  function renderGrid() {
    const visibleItems = getVisibleItems();
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const pagedItems = visibleItems.slice(startIndex, startIndex + PAGE_SIZE);

    grid.innerHTML = pagedItems
      .map(
        (item) => `
          <article class="tdmu-news-card">
            <a class="tdmu-news-card-media" href="${getArticleTemplateHref(item.id)}">
              <img
                class="tdmu-news-card-image"
                src="${escapeHtml(resolveAppUrl(item.cover))}"
                alt="${escapeHtml(item.title)}"
                loading="lazy"
              />
            </a>
            <div class="tdmu-news-card-body">
              <p class="tdmu-news-card-meta">${escapeHtml(item.category)} · ${escapeHtml(formatDate(item.date))}</p>
              <h2 class="tdmu-news-card-title clamp-2">
                <a href="${getArticleTemplateHref(item.id)}">${escapeHtml(item.title)}</a>
              </h2>
              <p class="tdmu-news-card-excerpt clamp-3">${escapeHtml(item.excerpt)}</p>
            </div>
          </article>
        `,
      )
      .join("");

    count.textContent = `${visibleItems.length} bài viết`;
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
    renderGrid();
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
  renderGrid();
}
