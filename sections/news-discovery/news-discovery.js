import { escapeHtml } from "../../js/core/dom.js";
import { renderArticleCards } from "../../js/components/article-cards.js";
import { bindArticleSelectionLinks } from "../../js/components/article-navigation.js";

export function initNewsDiscovery(newsData) {
  const grid = document.getElementById("discoveryGrid");
  if (!grid) return;

  const selectNode = document.getElementById("discoveryCategorySelect");
  const trigger = document.getElementById("discoveryCategoryTrigger");
  const label = document.getElementById("discoveryCategoryLabel");
  const menu = document.getElementById("discoveryCategoryMenu");
  const searchInput = document.getElementById("discoverySearchInput");
  const pagination = document.getElementById("discoveryPagination");
  const countEl = document.getElementById("discoveryResultCount");
  const pageSize = 6;
  let currentPage = 1;
  let activeCategory = "Tất cả";

  const categories = ["Tất cả", ...Array.from(new Set(newsData.map((item) => item.category)))];

  function closeMenu() {
    selectNode.classList.remove("is-open");
  }

  function setCategory(category) {
    activeCategory = category;
    label.textContent = category;
    menu.querySelectorAll("[data-category]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.category === category);
    });
    currentPage = 1;
    closeMenu();
    render();
  }

  menu.innerHTML = categories
    .map(
      (category, index) => `
        <button
          class="tdmu-select-option${index === 0 ? " is-active" : ""}"
          type="button"
          data-category="${escapeHtml(category)}"
        >
          ${escapeHtml(category)}
        </button>
      `,
    )
    .join("");

  trigger.addEventListener("click", () => {
    selectNode.classList.toggle("is-open");
  });

  menu.addEventListener("click", (event) => {
    const option = event.target.closest("[data-category]");
    if (!option) return;
    setCategory(option.dataset.category);
  });

  document.addEventListener("click", (event) => {
    if (!selectNode.contains(event.target)) {
      closeMenu();
    }
  });

  function getFilteredItems() {
    const query = (searchInput.value || "").trim().toLowerCase();

    return newsData.filter((item) => {
      const matchesCategory = activeCategory === "Tất cả" || item.category === activeCategory;
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.excerpt.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }

  function renderPagination(totalItems) {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    currentPage = Math.min(currentPage, totalPages);

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
      <nav>
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

    pagination.querySelectorAll("a.page-link").forEach((link) => {
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
    const filteredItems = getFilteredItems();
    const startIndex = (currentPage - 1) * pageSize;

    renderArticleCards("discoveryGrid", filteredItems.slice(startIndex, startIndex + pageSize));
    bindArticleSelectionLinks(grid);
    renderPagination(filteredItems.length);

    if (countEl) {
      countEl.textContent = `${filteredItems.length} kết quả`;
    }
  }

  searchInput.addEventListener("input", () => {
    currentPage = 1;
    render();
  });

  render();
}
