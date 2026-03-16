import { injectFragment } from "../core/include.js";
import { newsData } from "../data/news.js";
import { eventsData } from "../data/events.js";
import { initFeaturedSlider } from "../../sections/featured-slider/featured-slider.js";
import { initMediaStream } from "../../sections/media-stream/media-stream.js";
import { initLatestEvents } from "../../sections/latest-events/latest-events.js";

const LANDING_SECTIONS = [
  {
    slot: "#featured-slider-slot",
    file: "sections/featured-slider/featured-slider.html",
    init: () => initFeaturedSlider(newsData),
  },
  {
    slot: "#tdmu-manifesto-slot",
    file: "sections/tdmu-manifesto/tdmu-manifesto.html",
  },
  {
    slot: "#media-stream-slot",
    file: "sections/media-stream/media-stream.html",
    init: () => initMediaStream(newsData),
  },
  {
    slot: "#latest-events-slot",
    file: "sections/latest-events/latest-events.html",
    init: () => initLatestEvents(eventsData),
  },
  {
    slot: "#training-programs-slot",
    file: "sections/training-programs/training-programs.html",
  },
  {
    slot: "#tdmu-impact-slot",
    file: "sections/tdmu-impact/tdmu-impact.html",
  },
  {
    slot: "#tdmu-network-slot",
    file: "sections/tdmu-network/tdmu-network.html",
  },
  {
    slot: "#student-utilities-slot",
    file: "sections/student-utilities/student-utilities.html",
  },
];

export async function initHome() {
  if (document.body.dataset.page !== "home") {
    return;
  }

  await Promise.all(
    LANDING_SECTIONS.map((section) => injectFragment(section.slot, section.file)),
  );

  LANDING_SECTIONS.forEach((section) => {
    section.init?.();
  });
}
