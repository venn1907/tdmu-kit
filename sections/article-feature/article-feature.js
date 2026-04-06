import { getQueryParam, resolveAppUrl, escapeHtml, formatDate } from "../../js/core/dom.js";
import { ARTICLE_SELECT_EVENT } from "../../js/components/article-navigation.js";

export function initArticleFeature(newsData) {
  const mount = document.getElementById("article-feature");
  if (!mount || !newsData.length) return;

  const articleMap = new Map(newsData.map((item) => [item.id, item]));

  function renderArticle(item) {
    mount.innerHTML = `
      <article class="tdmu-article-feature-panel">
        <header class="tdmu-article-feature-header">
          <nav class="tdmu-article-feature-breadcrumb mb-3">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><a href="${resolveAppUrl("index.html")}">Trang chủ</a></li>
              <li class="breadcrumb-item"><a href="${resolveAppUrl("pages/news/index.html")}">Tin tức</a></li>
              <li class="breadcrumb-item active">Chi tiết</li>
            </ol>
          </nav>

          <h2 class="tdmu-article-feature-title">${escapeHtml(item.title)}</h2>

          <div class="tdmu-article-feature-meta">
            <span class="tdmu-article-feature-chip tdmu-article-feature-chip--category">${escapeHtml(item.category)}</span>
            <span class="tdmu-article-feature-chip">
              <span class="material-symbols-rounded opacity-6">calendar_month</span>
              ${escapeHtml(formatDate(item.date))}
            </span>
            <span class="tdmu-article-feature-chip">
              <span class="material-symbols-rounded opacity-6">visibility</span>
              ${escapeHtml(String(item.views))} lượt xem
            </span>
          </div>
        </header>

        <img
          class="tdmu-article-feature-cover mb-4"
          src="${escapeHtml(resolveAppUrl(item.cover))}"
          alt="${escapeHtml(item.title)}"
          loading="lazy"
          onerror="this.src='${resolveAppUrl("assets/img/bg-landing.jpg")}'"
        />

        <div class="tdmu-article-feature-body">
          <div class="tdmu-article-feature-content">
            <p class="text-dark">${escapeHtml(item.excerpt)}</p>

            <h3>Điểm nổi bật</h3>
            <ul>
              <li>Nội dung được trình bày theo cấu trúc đọc nhanh, dễ tích hợp cho website đơn vị.</li>
              <li>Thiết kế thống nhất với bộ nhận diện TDMU và tương thích tốt trên desktop lẫn mobile.</li>
              <li>Phần này đang là nội dung demo để nhóm có thể thay bằng nội dung thật khi triển khai.</li>
            </ul>

            <blockquote class="text-dark">
              Ưu tiên trải nghiệm người dùng: nhanh, rõ và dễ thao tác.
            </blockquote>

            <p class="mb-0">
              Khi triển khai thực tế, chỉ cần thay đoạn nội dung này bằng bài viết chính thức, giữ nguyên cấu trúc heading, đoạn văn và media nếu cần.
            </p>
          </div>
        </div>
      </article>
    `;
  }

  window.addEventListener(ARTICLE_SELECT_EVENT, (event) => {
    const articleId = event.detail?.articleId;
    const item = articleMap.get(articleId) || newsData[0];
    renderArticle(item);
  });

  const initialArticleId = getQueryParam("article");
  renderArticle(articleMap.get(initialArticleId) || newsData[0]);
}
