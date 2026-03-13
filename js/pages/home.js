import { injectFragment } from "../core/include.js";
import { newsData } from "../data/news.js";
import { eventsData } from "../data/events.js";
import { initFeaturedSlider } from "../../sections/featured-slider/featured-slider.js";
import { initNewsList } from "../../sections/news-list/news-list.js";
import { initNoticeBoard } from "../../sections/notice-board/notice-board.js";
import { initLatestEvents } from "../../sections/latest-events/latest-events.js";
import { initTrainingPrograms } from "../../sections/training-programs/training-programs.js";
import { initStudentUtilities } from "../../sections/student-utilities/student-utilities.js";

const LANDING_SECTIONS = [
  {
    slot: "#featured-slider-slot",
    file: "sections/featured-slider/featured-slider.html",
    init: () => initFeaturedSlider(newsData),
  },
  {
    slot: "#article-list-slot",
    file: "sections/news-list/news-list.html",
    init: () => initNewsList(newsData),
  },
  {
    slot: "#notice-board-slot",
    file: "sections/notice-board/notice-board.html",
    init: () => initNoticeBoard(newsData),
  },
  {
    slot: "#latest-events-slot",
    file: "sections/latest-events/latest-events.html",
    init: () => initLatestEvents(eventsData),
  },
  {
    slot: "#training-programs-slot",
    file: "sections/training-programs/training-programs.html",
    init: () => initTrainingPrograms(),
  },
  {
    slot: "#student-utilities-slot",
    file: "sections/student-utilities/student-utilities.html",
    init: () => initStudentUtilities(),
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
    section.init();
  });
}
