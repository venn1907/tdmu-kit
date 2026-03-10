import { resolveAppUrl, escapeHtml, formatDate } from "../core/dom.js";
import { getArticleTemplateHref } from "./article-navigation.js";

export function renderArticleCards(targetId, items, options = {}) {
  const el = document.getElementById(targetId);
  if (!el) return;

  const {
    showExcerpt = true,
    showFooter = false,
    titleClass = "mb-2 clamp-2",
  } = options;

  el.innerHTML = items
    .map((item) => {
      const href = getArticleTemplateHref(item.id);
      const title = escapeHtml(item.title);
      const date = escapeHtml(formatDate(item.date));
      const articleId = escapeHtml(item.id);

      return `
    <div class="col-12 col-md-6 col-lg-4">
      <article class="card card-hover h-100">
        <div class="card-header p-0 mx-3 mt-3 position-relative">
          <a class="d-block" href="${href}" data-article-id="${articleId}">
            <img class="thumb" src="${escapeHtml(resolveAppUrl(item.cover))}" alt="${title}" loading="lazy"
              onerror="this.src='${resolveAppUrl("assets/img/bg-landing.jpg")}'">
          </a>
        </div>
        <div class="card-body pt-3">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="badge bg-gradient-info">${escapeHtml(item.category)}</span>
            <span class="text-xs text-muted">${date}</span>
          </div>
          <h5 class="${titleClass}">
            <a class="text-dark" href="${href}" data-article-id="${articleId}">${title}</a>
          </h5>
          ${showExcerpt ? `<p class="text-sm text-muted mb-0 clamp-2">${escapeHtml(item.excerpt)}</p>` : ""}
        </div>
        ${showFooter ? `<div class="card-footer pt-0 pb-3 d-flex align-items-center justify-content-between">
          <span class="text-xs text-muted d-flex align-items-center gap-1">
            <span class="material-symbols-rounded opacity-6">visibility</span>
            ${escapeHtml(String(item.views))}
          </span>
          <a class="btn btn-sm bg-gradient-dark mb-0" href="${href}" data-article-id="${articleId}">Xem chi tiết</a>
        </div>` : ""}
      </article>
    </div>
  `;
    })
    .join("");
}
