import { resolveAppUrl, escapeHtml, formatDate } from "../../js/core/dom.js";
import { getArticleTemplateHref } from "../../js/components/article-navigation.js";

export function initNewsList(newsData) {
  const mount = document.getElementById("article-list");
  if (!mount) return;

  const items = [...newsData].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
  const [featured, ...rest] = items;

  mount.innerHTML = `
    ${
      featured
        ? `
      <article class="tdmu-article-card tdmu-article-card--feature">
        <img
          class="tdmu-article-thumb"
          src="${escapeHtml(resolveAppUrl(featured.cover))}"
          alt="${escapeHtml(featured.title)}"
          loading="lazy"
          onerror="this.src='${resolveAppUrl("assets/img/bg-landing.jpg")}'"
        />
        <div>
          <p class="tdmu-article-meta">${escapeHtml(formatDate(featured.date))} • ${escapeHtml(featured.category)}</p>
          <h3 class="tdmu-article-title"><a href="${getArticleTemplateHref(featured.id)}">${escapeHtml(featured.title)}</a></h3>
          <p class="tdmu-article-excerpt mb-0">${escapeHtml(featured.excerpt)}</p>
        </div>
      </article>
    `
        : ""
    }
    ${rest
      .map(
        (item) => `
      <article class="tdmu-article-card tdmu-article-card--compact">
        <p class="tdmu-article-meta">${escapeHtml(formatDate(item.date))} • ${escapeHtml(item.category)}</p>
        <h3 class="tdmu-article-title clamp-2"><a href="${getArticleTemplateHref(item.id)}">${escapeHtml(item.title)}</a></h3>
        <p class="tdmu-article-excerpt clamp-2 mb-0">${escapeHtml(item.excerpt)}</p>
      </article>
    `,
      )
      .join("")}
  `;
}

