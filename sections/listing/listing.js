const PAGE_SIZE = 6;
const ALL_LABEL = "Tất cả";

function initListing(options) {
  const filterRoot = document.getElementById(options.filterRootId);
  const filterMenu = document.getElementById(options.filterMenuId);
  const filterToggle = document.getElementById(options.filterToggleId);
  const filterLabel = document.getElementById(options.filterLabelId);
  const list = document.getElementById(options.listId);
  const count = document.getElementById(options.countId);
  const pagination = document.getElementById(options.paginationId);

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

  const items = Array.from(list.querySelectorAll(options.itemSelector));
  const filterButtons = Array.from(
    document.querySelectorAll(
      `#${options.filterRootId} [data-category], #${options.filterMenuId} [data-category]`,
    ),
  );
  const pageLinks = Array.from(pagination.querySelectorAll("[data-page]"));
  const prevLink = pagination.querySelector("[data-prev]");
  const nextLink = pagination.querySelector("[data-next]");

  if (!items.length || !filterButtons.length || !prevLink || !nextLink) return;

  let activeCategory = ALL_LABEL;
  let currentPage = 1;

  function closeMenu() {
    filterMenu.hidden = true;
  }

  function getFilteredItems() {
    if (activeCategory === ALL_LABEL) return items;
    return items.filter((item) => item.dataset.category === activeCategory);
  }

  function updateFilters() {
    filterButtons.forEach((button) => {
      button.classList.toggle(
        "is-active",
        button.dataset.category === activeCategory,
      );
    });

    filterLabel.textContent = activeCategory;
  }

  function updatePagination(totalPages) {
    pagination.hidden = totalPages <= 1;

    prevLink.closest(".page-item")?.classList.toggle("disabled", currentPage === 1);
    nextLink
      .closest(".page-item")
      ?.classList.toggle("disabled", currentPage === totalPages);

    pageLinks.forEach((link) => {
      const page = Number(link.dataset.page);
      const item = link.closest(".page-item");
      if (!item) return;

      item.hidden = page > totalPages;
      item.classList.toggle("active", page === currentPage);
    });
  }

  function render() {
    const filteredItems = getFilteredItems();
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
    currentPage = Math.min(currentPage, totalPages);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    items.forEach((item) => {
      item.hidden = true;
    });

    filteredItems.forEach((item, index) => {
      item.hidden = index < startIndex || index >= endIndex;
    });

    count.textContent = `${filteredItems.length} ${options.countLabel}`;
    updatePagination(totalPages);
  }

  function applyCategory(category) {
    activeCategory = category || ALL_LABEL;
    currentPage = 1;
    updateFilters();
    render();
    closeMenu();
  }

  filterRoot.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (button) applyCategory(button.dataset.category);
  });

  filterMenu.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (button) applyCategory(button.dataset.category);
  });

  filterToggle.addEventListener("click", () => {
    filterMenu.hidden = !filterMenu.hidden;
  });

  pagination.addEventListener("click", (event) => {
    const link = event.target.closest(".page-link");
    if (!link) return;

    event.preventDefault();
    if (link.dataset.page) currentPage = Number(link.dataset.page);
    if (link.hasAttribute("data-prev")) currentPage = Math.max(1, currentPage - 1);
    if (link.hasAttribute("data-next")) currentPage += 1;
    render();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".tdmu-listing-filter-dropdown")) closeMenu();
  });

  updateFilters();
  render();
}

export function initNewsListing() {
  initListing({
    filterRootId: "newsListingFilters",
    filterMenuId: "newsListingFilterMenu",
    filterToggleId: "newsListingFilterToggle",
    filterLabelId: "newsListingFilterLabel",
    listId: "newsListingGrid",
    countId: "newsListingCount",
    paginationId: "newsListingPagination",
    itemSelector: ".tdmu-news-card",
    countLabel: "bài viết",
  });
}

export function initNoticeListing() {
  initListing({
    filterRootId: "noticeListingFilters",
    filterMenuId: "noticeListingFilterMenu",
    filterToggleId: "noticeListingFilterToggle",
    filterLabelId: "noticeListingFilterLabel",
    listId: "noticeListingList",
    countId: "noticeListingCount",
    paginationId: "noticeListingPagination",
    itemSelector: ".tdmu-notice-item",
    countLabel: "thông báo",
  });
}
