import { heroSlidesData } from "../data/hero-slides.js";
import { newsData } from "../data/news.js";
import { newsListingData } from "../data/news-listing.js";
import { eventsData } from "../data/events.js";
import { noticesData } from "../data/notices.js";
import { emitArticleSelection } from "../components/article-navigation.js";
import { getQueryParam } from "./dom.js";
import { injectFragment } from "./include.js";
import { initFeaturedSlider } from "../../sections/featured-slider/featured-slider.js";
import { initMediaStream } from "../../sections/media-stream/media-stream.js";
import { initLatestEvents } from "../../sections/latest-events/latest-events.js";
import { initTeamAdvisors } from "../../sections/team-advisors/team-advisors.js";
import { initArticleFeature } from "../../sections/article-feature/article-feature.js";
import { initRelatedArticles } from "../../sections/related-articles/related-articles.js";
import { initNewsListing } from "../../sections/news-listing/news-listing.js";
import { initNoticeListing } from "../../sections/notice-listing/notice-listing.js";

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
  "article-feature": {
    file: "sections/article-feature/article-feature.html",
    init: () => initArticleFeature(newsData),
  },
  "related-articles": {
    file: "sections/related-articles/related-articles.html",
    init: () => initRelatedArticles(newsData),
  },
  "news-listing": {
    file: "sections/news-listing/news-listing.html",
    init: () => initNewsListing(newsListingData),
  },
  "notice-listing": {
    file: "sections/notice-listing/notice-listing.html",
    init: () => initNoticeListing(noticesData),
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
