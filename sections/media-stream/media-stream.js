function syncNoticePanelHeight() {
  const newsColumn = document.getElementById("media-news-column");
  const noticeColumn = document.getElementById("media-notice-column");
  const noticeList = document.getElementById("media-notice-list");
  const noticeHead = noticeColumn?.querySelector(".tdmu-media-column-head");
  const noticeTabsWrap = noticeColumn?.querySelector(
    ".tdmu-media-notice-tabs-wrap",
  );

  if (
    !newsColumn ||
    !noticeColumn ||
    !noticeList ||
    !noticeHead ||
    !noticeTabsWrap
  ) {
    return;
  }

  if (window.innerWidth <= 1199.98) {
    noticeColumn.style.height = "";
    noticeList.style.maxHeight = "";
    return;
  }

  const newsHeight = newsColumn.offsetHeight;
  const headHeight = noticeHead.offsetHeight;
  const tabsHeight = noticeTabsWrap.offsetHeight;
  const noticeStyles = window.getComputedStyle(noticeColumn);
  const listStyles = window.getComputedStyle(noticeList);
  const panelPaddingBottom = parseFloat(noticeStyles.paddingBottom) || 0;
  const listPaddingTop = parseFloat(listStyles.paddingTop) || 0;
  const listPaddingBottom = parseFloat(listStyles.paddingBottom) || 0;
  const listHeight = Math.max(
    180,
    newsHeight -
      headHeight -
      tabsHeight -
      panelPaddingBottom -
      listPaddingTop -
      listPaddingBottom,
  );

  noticeColumn.style.height = `${newsHeight}px`;
  noticeList.style.maxHeight = `${listHeight}px`;
}

function setupCarouselNav() {
  const railElement = document.querySelector(".tdmu-media-news-rail");
  const prevBtn = document.getElementById("media-news-prev");
  const nextBtn = document.getElementById("media-news-next");
  if (!railElement || !prevBtn || !nextBtn) return;

  let currentIndex = 0;

  const getVisibleItems = () => (window.innerWidth <= 767.98 ? 1 : 2);
  const getItems = () =>
    Array.from(railElement.querySelectorAll(".tdmu-media-news-item"));

  const updateTrack = () => {
    const items = getItems();
    if (!items.length) return;

    const visibleItems = getVisibleItems();
    const maxIndex = Math.max(0, items.length - visibleItems);

    currentIndex = Math.min(currentIndex, maxIndex);
    railElement.style.transform = `translateX(-${items[currentIndex].offsetLeft}px)`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
  };

  prevBtn.addEventListener("click", () => {
    currentIndex = Math.max(0, currentIndex - 1);
    updateTrack();
  });

  nextBtn.addEventListener("click", () => {
    const maxStep = Math.max(0, getItems().length - getVisibleItems());
    currentIndex = Math.min(maxStep, currentIndex + 1);
    updateTrack();
  });

  window.addEventListener("resize", updateTrack);
  updateTrack();
}

function initNoticeTabs() {
  const tabs = document.getElementById("media-notice-tabs");
  const filterButton = document.getElementById("media-notice-filter-button");
  const filterLabel = document.getElementById("media-notice-filter-label");
  const filterMenu = document.getElementById("media-notice-filter-menu");
  const noticeItems = Array.from(
    document.querySelectorAll(".tdmu-media-notice-item"),
  );

  if (!tabs || !filterButton || !filterLabel || !filterMenu || !noticeItems.length) {
    return;
  }

  const apply = (key) => {
    const activeKey = key || "all";

    tabs.querySelectorAll("[data-tab]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tab === activeKey);
    });

    filterMenu.querySelectorAll("[data-filter-option]").forEach((button) => {
      button.classList.toggle(
        "is-active",
        button.dataset.filterOption === activeKey,
      );
    });

    const activeButton =
      tabs.querySelector(`[data-tab="${activeKey}"]`) ||
      tabs.querySelector("[data-tab='all']");
    filterLabel.textContent = activeButton?.textContent?.trim() || "Tổng hợp";

    noticeItems.forEach((item) => {
      const buckets = String(item.dataset.noticeBucket || "").split(/\s+/);
      item.hidden = activeKey !== "all" && !buckets.includes(activeKey);
    });

    filterMenu.hidden = true;
    filterButton.classList.remove("is-open");
    requestAnimationFrame(syncNoticePanelHeight);
  };

  tabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-tab]");
    if (!button) return;
    apply(button.dataset.tab);
  });

  filterButton.addEventListener("click", () => {
    const isOpen = !filterMenu.hidden;
    filterMenu.hidden = isOpen;
    filterButton.classList.toggle("is-open", !isOpen);
  });

  filterMenu.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter-option]");
    if (!button) return;
    apply(button.dataset.filterOption);
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".tdmu-media-notice-filter-wrap")) {
      filterMenu.hidden = true;
      filterButton.classList.remove("is-open");
    }
  });

  apply("all");
}

export function initMediaStream() {
  if (!document.getElementById("media-stream-section")) return;
  setupCarouselNav();
  initNoticeTabs();
  requestAnimationFrame(syncNoticePanelHeight);
  window.addEventListener("resize", syncNoticePanelHeight);
}
