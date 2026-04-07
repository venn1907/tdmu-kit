import { escapeHtml, formatDate, resolveAppUrl } from "../../js/core/dom.js";
import {
  getNewsDetailHref,
  getNoticeDetailHref,
} from "../../js/components/article-navigation.js";

const NOTICE_TAB_ITEMS = [
  { key: "all", label: "Tổng hợp" },
  { key: "admissions", label: "Tuyển sinh" },
  { key: "students", label: "Sinh viên" },
  { key: "jobs", label: "Tuyển dụng" },
];

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function detectNoticeBucket(item) {
  const combined = `${normalizeText(item.category)} ${normalizeText(item.title)}`;
  if (combined.includes("tuyen dung") || combined.includes("viec lam"))
    return "jobs";
  if (combined.includes("sinh vien")) return "students";
  if (combined.includes("tuyen sinh")) return "admissions";
  if (combined.includes("thong bao")) return "all";
  return null;
}

function buildNoticeIndex(noticeItems) {
  const buckets = { all: [], admissions: [], students: [], jobs: [] };

  [...noticeItems]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach((item) => {
      const bucket = detectNoticeBucket(item);
      if (!bucket) return;
      buckets.all.push(item);
      if (bucket !== "all") buckets[bucket].push(item);
    });

  return buckets;
}

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
  )
    return;

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

function setupCarouselNav(railElement) {
  if (!railElement) return;
  const prevBtn = document.getElementById("media-news-prev");
  const nextBtn = document.getElementById("media-news-next");
  if (!prevBtn || !nextBtn) return;

  let currentIndex = 0;

  const getVisibleItems = () => {
    if (window.innerWidth <= 767.98) return 1;
    return 2;
  };

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

function renderNews(newsItems) {
  const mount = document.getElementById("media-news-list");
  if (!mount) return;

  const items = [...newsItems].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
  const [featured, ...rest] = items;

  mount.innerHTML = `
    ${
      featured
        ? `
      <article class="tdmu-media-news-feature">
        <a class="tdmu-media-news-feature-media" href="${getNewsDetailHref(featured.id)}">
          <img
            class="tdmu-media-news-feature-image"
            src="${escapeHtml(resolveAppUrl(featured.cover))}"
            alt="${escapeHtml(featured.title)}"
            loading="lazy"
            onerror="this.src='${resolveAppUrl("assets/img/bg-landing.jpg")}'"
          />
        </a>
        <div class="tdmu-media-news-feature-body">
          <p class="tdmu-media-news-meta">${escapeHtml(featured.category)} - ${escapeHtml(formatDate(featured.date))}</p>
          <h3 class="tdmu-media-news-feature-title">
            <a href="${getNewsDetailHref(featured.id)}">${escapeHtml(featured.title)}</a>
          </h3>
          <p class="tdmu-media-news-feature-excerpt">${escapeHtml(featured.excerpt)}</p>
        </div>
      </article>
    `
        : ""
    }
    ${
      rest.length
        ? `
      <div class="tdmu-media-news-carousel">
        <div class="tdmu-media-news-carousel-head">
          <p class="tdmu-media-news-carousel-title">Tin liên quan</p>
          <div class="tdmu-media-news-controls">
            <button id="media-news-prev" class="tdmu-media-news-nav" type="button" aria-label="Xem bài trước">
              <span class="material-symbols-rounded">arrow_back</span>
            </button>
            <button id="media-news-next" class="tdmu-media-news-nav" type="button" aria-label="Xem bài tiếp theo">
              <span class="material-symbols-rounded">arrow_forward</span>
            </button>
          </div>
        </div>
        <div class="tdmu-media-news-viewport">
          <div class="tdmu-media-news-rail">
            ${rest
              .map(
                (item) => `
              <article class="tdmu-media-news-item">
                <a class="tdmu-media-news-item-media" href="${getNewsDetailHref(item.id)}">
                  <img
                    class="tdmu-media-news-item-image"
                    src="${escapeHtml(resolveAppUrl(item.cover))}"
                    alt="${escapeHtml(item.title)}"
                    loading="lazy"
                    onerror="this.src='${resolveAppUrl("assets/img/bg-landing.jpg")}'"
                  />
                </a>
                <div class="tdmu-media-news-item-body">
                  <p class="tdmu-media-news-meta">
                    <span class="tdmu-media-news-item-category">${escapeHtml(item.category)}</span>
                    <span>${escapeHtml(formatDate(item.date))}</span>
                  </p>
                  <h3 class="tdmu-media-news-item-title">
                    <a href="${getNewsDetailHref(item.id)}">${escapeHtml(item.title)}</a>
                  </h3>
                  <p class="tdmu-media-news-item-excerpt">${escapeHtml(item.excerpt)}</p>
                </div>
              </article>
            `,
              )
              .join("")}
          </div>
        </div>
      </div>
    `
        : ""
    }
  `;

  if (rest.length) {
    setupCarouselNav(mount.querySelector(".tdmu-media-news-rail"));
  }

  requestAnimationFrame(syncNoticePanelHeight);
}

function renderNotices(items) {
  const mount = document.getElementById("media-notice-list");
  if (!mount) return;

  mount.innerHTML = items
    .map(
      (item) => `
      <article class="tdmu-media-notice-item">
        <div class="tdmu-media-notice-item-meta">
          <span class="tdmu-media-notice-item-time">${escapeHtml(formatDate(item.date))}</span>
          <span class="tdmu-media-notice-item-category">${escapeHtml(item.category || "Thông báo")}</span>
        </div>
        <a class="tdmu-media-notice-item-title" href="${getNoticeDetailHref(item.id)}">${escapeHtml(item.title)}</a>
      </article>
    `,
    )
    .join("");

  requestAnimationFrame(syncNoticePanelHeight);
}

export function initMediaStream(newsItems, noticeItems) {
  const tabs = document.getElementById("media-notice-tabs");
  const filterButton = document.getElementById("media-notice-filter-button");
  const filterLabel = document.getElementById("media-notice-filter-label");
  const filterMenu = document.getElementById("media-notice-filter-menu");
  if (!tabs || !filterButton || !filterLabel || !filterMenu) return;

  renderNews(newsItems);

  const noticeIndex = buildNoticeIndex(noticeItems);

  tabs.innerHTML = NOTICE_TAB_ITEMS.map(
    (tab, indexPosition) => `
    <button class="tdmu-media-notice-tab${indexPosition === 0 ? " is-active" : ""}" type="button" data-tab="${tab.key}">
      ${tab.label}
    </button>
  `,
  ).join("");

  filterMenu.innerHTML = NOTICE_TAB_ITEMS.map(
    (tab) => `
      <button class="tdmu-media-notice-filter-option" type="button" data-filter-option="${tab.key}">
        ${tab.label}
      </button>
    `,
  ).join("");

  const apply = (key) => {
    const activeTab =
      NOTICE_TAB_ITEMS.find((tab) => tab.key === key) || NOTICE_TAB_ITEMS[0];

    tabs.querySelectorAll("[data-tab]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tab === key);
    });

    filterMenu.querySelectorAll("[data-filter-option]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.filterOption === key);
    });

    filterLabel.textContent = activeTab.label;
    filterButton.classList.remove("is-open");
    filterMenu.hidden = true;
    renderNotices(noticeIndex[key] || []);
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

  window.addEventListener("resize", syncNoticePanelHeight);
  apply("all");
}
