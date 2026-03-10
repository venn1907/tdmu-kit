import { injectFragment } from "../core/include.js";
import { getQueryParam } from "../core/dom.js";
import { newsData } from "../data/news.js";
import { emitArticleSelection } from "../components/article-navigation.js";
import { initNewsDiscovery } from "../../sections/news-discovery/news-discovery.js";
import { initArticleFeature } from "../../sections/article-feature/article-feature.js";
import { initRelatedArticles } from "../../sections/related-articles/related-articles.js";

const KIT_SECTIONS = [
  {
    slot: "#news-discovery-slot",
    file: "sections/news-discovery/news-discovery.html",
    init: () => initNewsDiscovery(newsData),
  },
  {
    slot: "#article-feature-slot",
    file: "sections/article-feature/article-feature.html",
    init: () => initArticleFeature(newsData),
  },
  {
    slot: "#related-articles-slot",
    file: "sections/related-articles/related-articles.html",
    init: () => initRelatedArticles(newsData),
  },
];

export async function initSectionKit() {
  if (document.body.dataset.page !== "section-kit") {
    return;
  }

  await Promise.all(
    KIT_SECTIONS.map((section) => injectFragment(section.slot, section.file)),
  );

  KIT_SECTIONS.forEach((section) => {
    section.init();
  });

  const initialArticleId = getQueryParam("article");
  if (initialArticleId) {
    emitArticleSelection(initialArticleId);
  }
}
