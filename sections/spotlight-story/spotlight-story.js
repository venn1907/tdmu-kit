import { escapeHtml, formatDate } from "../../js/core/dom.js";
import { getArticleTemplateHref, bindArticleSelectionLinks } from "../../js/components/article-navigation.js";

export function initSpotlightStory(newsData) {
  const mount = document.getElementById("spotlight-story");
  if (!mount) return;

  const item = [...newsData].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  if (!item) return;

  mount.innerHTML = `
    <p class="tdmu-spotlight-meta">
      <span>${escapeHtml(formatDate(item.date))}</span>
      <span>${escapeHtml(item.category)}</span>
      <span>${escapeHtml(String(item.views))} lượt xem</span>
    </p>
    <h2 class="tdmu-spotlight-title">
      <a href="${getArticleTemplateHref(item.id)}" data-article-id="${escapeHtml(item.id)}">${escapeHtml(item.title)}</a>
    </h2>
    <p class="tdmu-spotlight-excerpt">${escapeHtml(item.excerpt)}</p>
    <a class="tdmu-spotlight-cta" href="${getArticleTemplateHref(item.id)}" data-article-id="${escapeHtml(item.id)}">Đọc tiếp</a>
  `;

  bindArticleSelectionLinks(mount);
}

