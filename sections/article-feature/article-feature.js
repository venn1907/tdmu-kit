import { getQueryParam, resolveAppUrl, escapeHtml, formatDate } from "../../js/core/dom.js";

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

  const value = encodeURIComponent(category);
  return resolveAppUrl(`${path}?category=${value}`);
}

function buildSidebarMarkup(items, activeCategory, listPath, sidebarLabel) {
  const categories = [ALL_LABEL, ...new Set(items.map((item) => item.category))];

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

function buildDetailMarkup(item, items, options) {
  const {
    listPath,
    listLabel,
    detailLabel,
    sidebarLabel,
    viewsLabel = "lượt xem",
    showCover = false,
  } = options;

  const contentMarkup = item.content || buildFallbackContent(item);
  const hasCover = showCover && item.cover;
  const sidebarMarkup = buildSidebarMarkup(items, item.category || ALL_LABEL, listPath, sidebarLabel);
  const listHref = resolveAppUrl(listPath);

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
        </div>
      </div>
    </div>
  `;
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
    showCover,
  });

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

export function initNewsDetail(items) {
  initStaticDetailPage({
    items,
    queryKey: "article",
    listPath: "pages/news/index.html",
    listLabel: "Tin tức",
    detailLabel: "Chi tiết tin tức",
    sidebarLabel: "Danh mục tin tức",
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
    showCover: false,
  });
}
