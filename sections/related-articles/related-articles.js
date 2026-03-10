import { renderArticleCards } from "../../js/components/article-cards.js";
import { bindArticleSelectionLinks, ARTICLE_SELECT_EVENT } from "../../js/components/article-navigation.js";

export function initRelatedArticles(newsData) {
  const grid = document.getElementById("relatedArticlesGrid");
  if (!grid || !newsData.length) return;

  const articleMap = new Map(newsData.map((item) => [item.id, item]));

  function renderRelated(articleId) {
    const activeId = articleMap.has(articleId) ? articleId : newsData[0].id;
    const relatedItems = newsData.filter((item) => item.id !== activeId).slice(0, 3);

    renderArticleCards("relatedArticlesGrid", relatedItems, {
      showExcerpt: false,
      titleClass: "mb-0 clamp-2",
    });

    bindArticleSelectionLinks(grid);
  }

  window.addEventListener(ARTICLE_SELECT_EVENT, (event) => {
    renderRelated(event.detail?.articleId);
  });

  renderRelated(newsData[0].id);
}
