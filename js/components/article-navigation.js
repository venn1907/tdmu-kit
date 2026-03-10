import { resolveAppUrl } from "../core/dom.js";

export const ARTICLE_SELECT_EVENT = "tdmu:article-select";

export function getArticleTemplateHref(articleId, anchor = "article-feature-section") {
  const id = encodeURIComponent(String(articleId || ""));
  return resolveAppUrl(`pages/section-kit/index.html?article=${id}#${anchor}`);
}

export function emitArticleSelection(articleId) {
  if (!articleId) return;

  window.dispatchEvent(
    new CustomEvent(ARTICLE_SELECT_EVENT, {
      detail: { articleId },
    }),
  );
}

export function bindArticleSelectionLinks(root, targetId = "article-feature-section") {
  if (!root || document.body.dataset.page !== "section-kit") return;

  root.querySelectorAll("[data-article-id]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const articleId = link.dataset.articleId;
      emitArticleSelection(articleId);

      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set("article", articleId);
      nextUrl.hash = targetId;
      window.history.replaceState({}, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
    });
  });
}
