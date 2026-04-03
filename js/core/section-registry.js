import { heroSlidesData } from "../data/hero-slides.js";
import { newsData } from "../data/news.js";
import { eventsData } from "../data/events.js";
import { emitArticleSelection } from "../components/article-navigation.js";
import { getQueryParam } from "./dom.js";
import { injectFragment } from "./include.js";
import { initFeaturedSlider } from "../../sections/featured-slider/featured-slider.js";
import { initMediaStream } from "../../sections/media-stream/media-stream.js";
import { initLatestEvents } from "../../sections/latest-events/latest-events.js";
import { initTeamAdvisors } from "../../sections/team-advisors/team-advisors.js";
import { initNewsDiscovery } from "../../sections/news-discovery/news-discovery.js";
import { initArticleFeature } from "../../sections/article-feature/article-feature.js";
import { initRelatedArticles } from "../../sections/related-articles/related-articles.js";

export const SECTION_REGISTRY = {
  "featured-slider": {
    file: "sections/featured-slider/featured-slider.html",
    init: () => initFeaturedSlider(heroSlidesData),
  },
  "tdmu-manifesto": {
    file: "sections/tdmu-manifesto/tdmu-manifesto.html",
  },
  "media-stream": {
    file: "sections/media-stream/media-stream.html",
    init: () => initMediaStream(newsData),
  },
  "latest-events": {
    file: "sections/latest-events/latest-events.html",
    init: () => initLatestEvents(eventsData),
  },
  "training-programs": {
    file: "sections/training-programs/training-programs.html",
  },
  "tdmu-impact": {
    file: "sections/tdmu-impact/tdmu-impact.html",
  },
  "tdmu-network": {
    file: "sections/tdmu-network/tdmu-network.html",
  },
  "team-advisors": {
    file: "sections/team-advisors/team-advisors.html",
    init: () => initTeamAdvisors(),
  },
  "student-utilities": {
    file: "sections/student-utilities/student-utilities.html",
  },
  "news-discovery": {
    file: "sections/news-discovery/news-discovery.html",
    init: () => initNewsDiscovery(newsData),
  },
  "article-feature": {
    file: "sections/article-feature/article-feature.html",
    init: () => initArticleFeature(newsData),
  },
  "related-articles": {
    file: "sections/related-articles/related-articles.html",
    init: () => initRelatedArticles(newsData),
  },
};

export async function initSectionsFromDom(root = document) {
  const sectionSlots = Array.from(root.querySelectorAll("[data-section]"));

  await Promise.all(
    sectionSlots.map(async (slot) => {
      const sectionName = slot.dataset.section;
      const config = SECTION_REGISTRY[sectionName];
      if (!config) return;

      await injectFragment(`#${slot.id}`, config.file);
      config.init?.();
    }),
  );
}

export function runPageHook(page) {
  if (page !== "section-kit") return;

  const initialArticleId = getQueryParam("article");
  if (initialArticleId) {
    emitArticleSelection(initialArticleId);
  }
}
