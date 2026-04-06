import {
  getQueryParam,
  resolveAppUrl,
  escapeHtml,
  formatDate,
} from "../../js/core/dom.js";
import {
  getNewsDetailHref,
  getNoticeDetailHref,
} from "../../js/components/article-navigation.js";

const ALL_LABEL = "Tất cả";

function buildFallbackContent(item) {
  return `
    <p>${escapeHtml(item.excerpt || "")}</p>
    <h3>Điểm nhấn nội dung</h3>
    <ul>
      <li>Nội dung được trình bày theo cấu trúc rõ ràng, phù hợp cho website đơn vị.</li>
      <li>Thiết kế bám nhận diện TDMU và đảm bảo hiển thị tốt trên desktop, tablet, mobile.</li>
      <li>Phần nội dung này có thể thay trực tiếp bằng dữ liệu thật khi triển khai.</li>
    </ul>
  `;
}

function buildListingHref(path, category) {
  if (!category || category === ALL_LABEL) {
    return resolveAppUrl(path);
  }

  return resolveAppUrl(`${path}?category=${encodeURIComponent(category)}`);
}

function buildSidebarMarkup(items, activeCategory, listPath, sidebarLabel) {
  const categories = [
    ALL_LABEL,
    ...new Set(items.map((item) => item.category)),
  ];

  const links = categories
    .map((category) => {
      const isActive = category === activeCategory;
      return `
        <a
          class="tdmu-listing-filter${isActive ? " is-active" : ""}"
          href="${buildListingHref(listPath, category)}"
        >
          ${escapeHtml(category)}
        </a>
      `;
    })
    .join("");

  const optionLinks = categories
    .map((category) => {
      const isActive = category === activeCategory;
      return `
        <a
          class="tdmu-listing-filter-option${isActive ? " is-active" : ""}"
          href="${buildListingHref(listPath, category)}"
        >
          ${escapeHtml(category)}
        </a>
      `;
    })
    .join("");

  return `
    <aside class="tdmu-listing-sidebar tdmu-article-detail-sidebar" aria-label="${escapeHtml(sidebarLabel)}">
      <p class="tdmu-listing-sidebar-title">Danh mục</p>
      <div class="tdmu-listing-filter-dropdown">
        <button
          class="tdmu-listing-filter-toggle"
          type="button"
          aria-expanded="false"
          aria-controls="articleDetailFilterMenu"
        >
          <span>${escapeHtml(activeCategory)}</span>
          <span class="material-symbols-rounded">expand_more</span>
        </button>
        <div class="tdmu-listing-filter-menu" id="articleDetailFilterMenu" hidden>
          ${optionLinks}
        </div>
      </div>
      <div class="tdmu-listing-filter-list">
        ${links}
      </div>
    </aside>
  `;
}

function getLatestSameCategoryItems(items, activeItem, limit) {
  return [...items]
    .filter(
      (item) =>
        item.id !== activeItem.id && item.category === activeItem.category,
    )
    .sort((left, right) => new Date(right.date) - new Date(left.date))
    .slice(0, limit);
}

function buildLatestNewsMarkup(items) {
  if (!items.length) return "";

  return `
    <section class="tdmu-article-related">
      <div class="tdmu-article-related-head">
        <div>
          <p class="tdmu-article-related-kicker">Tin tức cùng danh mục</p>
        </div>
        <div class="tdmu-article-related-controls">
          <button class="tdmu-article-related-nav" type="button" data-news-prev aria-label="Bài trước">
            <span class="material-symbols-rounded">arrow_back</span>
          </button>
          <button class="tdmu-article-related-nav" type="button" data-news-next aria-label="Bài tiếp theo">
            <span class="material-symbols-rounded">arrow_forward</span>
          </button>
        </div>
      </div>

      <div class="tdmu-article-related-viewport">
        <div class="tdmu-article-related-rail" data-news-rail>
          ${items
            .map(
              (item) => `
                <article class="tdmu-article-related-card">
                  <a class="tdmu-article-related-card-media" href="${getNewsDetailHref(item.id)}">
                    <img
                      class="tdmu-article-related-card-image"
                      src="${escapeHtml(resolveAppUrl(item.cover))}"
                      alt="${escapeHtml(item.title)}"
                      loading="lazy"
                      onerror="this.src='${resolveAppUrl("assets/img/bg-landing.jpg")}'"
                    />
                  </a>
                  <div class="tdmu-article-related-card-body">
                    <p class="tdmu-article-related-card-meta">${escapeHtml(item.category)} · ${escapeHtml(formatDate(item.date))}</p>
                    <h3 class="tdmu-article-related-card-title clamp-2">
                      <a href="${getNewsDetailHref(item.id)}">${escapeHtml(item.title)}</a>
                    </h3>
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function buildLatestNoticeMarkup(items) {
  if (!items.length) return "";

  return `
    <section class="tdmu-article-related tdmu-article-related--notice">
      <div class="tdmu-article-related-head tdmu-article-related-head--stack">
        <div>
          <p class="tdmu-article-related-kicker">Thông báo cùng danh mục</p>
        </div>
      </div>

      <div class="tdmu-article-related-list">
        ${items
          .map(
            (item) => `
              <article class="tdmu-article-related-list-item">
                <a class="tdmu-article-related-list-title" href="${getNoticeDetailHref(item.id)}">${escapeHtml(item.title)}</a>
                <div class="tdmu-article-related-list-meta">
                  <span>${escapeHtml(formatDate(item.date))}</span>
                  <span>·</span>
                  <span>${escapeHtml(String(item.views || 0))} lượt xem</span>
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function buildDetailMarkup(item, items, options) {
  const {
    listPath,
    listLabel,
    detailLabel,
    sidebarLabel,
    kind,
    viewsLabel = "lượt xem",
    showCover = false,
  } = options;

  const contentMarkup = item.content || buildFallbackContent(item);
  const hasCover = showCover && item.cover;
  const sidebarMarkup = buildSidebarMarkup(
    items,
    item.category || ALL_LABEL,
    listPath,
    sidebarLabel,
  );
  const listHref = resolveAppUrl(listPath);
  const latestItems = getLatestSameCategoryItems(
    items,
    item,
    kind === "news" ? 6 : 4,
  );
  const extraMarkup =
    kind === "news"
      ? buildLatestNewsMarkup(latestItems)
      : buildLatestNoticeMarkup(latestItems);

  return `
    <div class="tdmu-listing-shell tdmu-article-detail-shell">
      <div class="tdmu-listing-toolbar">
        <nav class="tdmu-listing-breadcrumb" aria-label="Breadcrumb">
          <a href="${resolveAppUrl("index.html")}">Trang chủ</a>
          <span>/</span>
          <a href="${listHref}">${escapeHtml(listLabel)}</a>
          <span>/</span>
          <span>${escapeHtml(detailLabel)}</span>
        </nav>
      </div>

      <div class="tdmu-listing-layout">
        ${sidebarMarkup}

        <div class="tdmu-listing-content">
          <article class="tdmu-article-feature-panel">
            <header class="tdmu-article-feature-header">
              <h1 class="tdmu-article-feature-title">${escapeHtml(item.title)}</h1>

              <div class="tdmu-article-feature-meta">
                <span class="tdmu-article-feature-chip tdmu-article-feature-chip--category">${escapeHtml(item.category || "")}</span>
                <span class="tdmu-article-feature-chip">
                  <span class="material-symbols-rounded opacity-6">calendar_month</span>
                  ${escapeHtml(formatDate(item.date))}
                </span>
                <span class="tdmu-article-feature-chip">
                  <span class="material-symbols-rounded opacity-6">visibility</span>
                  ${escapeHtml(String(item.views || 0))} ${escapeHtml(viewsLabel)}
                </span>
              </div>
            </header>

            ${
              hasCover
                ? `
                  <img
                    class="tdmu-article-feature-cover mb-4"
                    src="${escapeHtml(resolveAppUrl(item.cover))}"
                    alt="${escapeHtml(item.title)}"
                    loading="lazy"
                    onerror="this.src='${resolveAppUrl("assets/img/bg-landing.jpg")}'"
                  />
                `
                : ""
            }

            <div class="tdmu-article-feature-body">
              <div class="tdmu-article-feature-content">
                ${contentMarkup}
              </div>
            </div>
          </article>

          ${extraMarkup}
        </div>
      </div>
    </div>
  `;
}

function initDetailFilterToggle(mount) {
  const toggle = mount.querySelector(".tdmu-listing-filter-toggle");
  const menu = mount.querySelector(".tdmu-listing-filter-menu");
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

function initNewsRelatedCarousel(mount) {
  const rail = mount.querySelector("[data-news-rail]");
  const prevButton = mount.querySelector("[data-news-prev]");
  const nextButton = mount.querySelector("[data-news-next]");
  if (!rail || !prevButton || !nextButton) return;

  let currentIndex = 0;

  function getCards() {
    return Array.from(rail.querySelectorAll(".tdmu-article-related-card"));
  }

  function getVisibleCount() {
    if (window.innerWidth <= 767.98) return 1;
    if (window.innerWidth <= 1199.98) return 2;
    return 4;
  }

  function update() {
    const cards = getCards();
    if (!cards.length) return;

    const visibleCount = getVisibleCount();
    const maxIndex = Math.max(0, cards.length - visibleCount);
    currentIndex = Math.min(currentIndex, maxIndex);

    rail.style.transform = `translateX(-${cards[currentIndex].offsetLeft}px)`;
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex >= maxIndex;
  }

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

function initStaticDetailPage(config) {
  const {
    mountId = "article-feature",
    items,
    queryKey,
    listPath,
    listLabel,
    detailLabel,
    sidebarLabel,
    kind,
    showCover,
  } = config;

  const mount = document.getElementById(mountId);
  if (!mount || !items.length) return;

  const itemMap = new Map(items.map((item) => [item.id, item]));
  const initialItemId = getQueryParam(queryKey);
  const activeItem = itemMap.get(initialItemId) || items[0];

  mount.innerHTML = buildDetailMarkup(activeItem, items, {
    listPath,
    listLabel,
    detailLabel,
    sidebarLabel,
    kind,
    showCover,
  });

  initDetailFilterToggle(mount);

  if (kind === "news") {
    initNewsRelatedCarousel(mount);
  }
}

export function initNewsDetail(items) {
  initStaticDetailPage({
    items,
    queryKey: "article",
    listPath: "pages/news/index.html",
    listLabel: "Tin tức",
    detailLabel: "Chi tiết tin tức",
    sidebarLabel: "Danh mục tin tức",
    kind: "news",
    showCover: false,
  });
}

export function initNoticeDetail(items) {
  initStaticDetailPage({
    items,
    queryKey: "notice",
    listPath: "pages/notices/index.html",
    listLabel: "Thông báo",
    detailLabel: "Chi tiết thông báo",
    sidebarLabel: "Danh mục thông báo",
    kind: "notice",
    showCover: false,
  });
}
