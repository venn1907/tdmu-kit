import { heroSlidesData } from "../data/hero-slides.js";
import { newsListingData } from "../data/news-listing.js";
import { eventsData } from "../data/events.js";
import { noticesData } from "../data/notices.js";
import { injectFragment } from "./include.js";
import { initFeaturedSlider } from "../../sections/featured-slider/featured-slider.js";
import { initMediaStream } from "../../sections/media-stream/media-stream.js";
import { initLatestEvents } from "../../sections/latest-events/latest-events.js";
import { initTeamAdvisors } from "../../sections/team-advisors/team-advisors.js";
import { initUnitProfile } from "../../sections/unit-profile/unit-profile.js";
import { initFaqSection } from "../../sections/faq/faq.js";
import {
  initNewsDetail,
  initNoticeDetail,
} from "../../sections/article-feature/article-feature.js";
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
  "unit-profile": {
    file: "sections/unit-profile/unit-profile.html",
    init: () => initUnitProfile(),
  },
  "media-stream": {
    file: "sections/media-stream/media-stream.html",
    init: () => initMediaStream(newsListingData, noticesData),
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
  faq: {
    file: "sections/faq/faq.html",
    init: () => initFaqSection(),
  },
  "not-found": {
    file: "sections/not-found/not-found.html",
  },
  "news-listing": {
    file: "sections/news-listing/news-listing.html",
    init: () => initNewsListing(newsListingData),
  },
  "notice-listing": {
    file: "sections/notice-listing/notice-listing.html",
    init: () => initNoticeListing(noticesData),
  },
  "news-detail": {
    file: "sections/article-feature/article-feature.html",
    init: () => initNewsDetail(newsListingData),
  },
  "notice-detail": {
    file: "sections/article-feature/article-feature.html",
    init: () => initNoticeDetail(noticesData),
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
