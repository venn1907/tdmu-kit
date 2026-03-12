import { resolveAppUrl, escapeHtml } from "../../js/core/dom.js";
import { getArticleTemplateHref } from "../../js/components/article-navigation.js";

export function initNewsList(newsData) {
  const mount = document.getElementById("article-list");
  if (!mount) return;

  const items = [...newsData].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const [featured, ...rest] = items;

  mount.innerHTML = `
    <div class="tdmu-article-layout">
      ${
        featured
          ? `
        <article class="tdmu-article-card tdmu-article-card--feature">
          <a class="tdmu-article-feature-media" href="${getArticleTemplateHref(featured.id)}">
            <img
              class="tdmu-article-thumb tdmu-article-thumb--feature"
              src="${escapeHtml(resolveAppUrl(featured.cover))}"
              alt="${escapeHtml(featured.title)}"
              loading="lazy"
              onerror="this.src='${resolveAppUrl("assets/img/bg-landing.jpg")}'"
            />
          </a>
          <div class="tdmu-article-feature-body">
            <p class="tdmu-article-meta">${escapeHtml(featured.category)}</p>
            <h3 class="tdmu-article-title tdmu-article-title--feature">
              <a href="${getArticleTemplateHref(featured.id)}">${escapeHtml(featured.title)}</a>
            </h3>
            <p class="tdmu-article-excerpt mb-0">${escapeHtml(featured.excerpt)}</p>
          </div>
        </article>
      `
          : ""
      }
      <div class="tdmu-article-rail">
        ${rest
          .map(
            (item) => `
          <article class="tdmu-article-card tdmu-article-card--compact">
            <a class="tdmu-article-compact-media" href="${getArticleTemplateHref(item.id)}">
              <img
                class="tdmu-article-thumb tdmu-article-thumb--compact"
                src="${escapeHtml(resolveAppUrl(item.cover))}"
                alt="${escapeHtml(item.title)}"
                loading="lazy"
                onerror="this.src='${resolveAppUrl("assets/img/bg-landing.jpg")}'"
              />
            </a>
            <div class="tdmu-article-compact-body">
              <p class="tdmu-article-meta">${escapeHtml(item.category)}</p>
              <h3 class="tdmu-article-title tdmu-article-title--compact clamp-2">
                <a href="${getArticleTemplateHref(item.id)}">${escapeHtml(item.title)}</a>
              </h3>
              <p class="tdmu-article-excerpt tdmu-article-excerpt--compact clamp-2 mb-0">${escapeHtml(item.excerpt)}</p>
            </div>
          </article>
        `,
          )
          .join("")}
      </div>
    </div>
  `;
}
