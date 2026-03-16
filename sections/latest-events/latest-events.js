import { escapeHtml, resolveAppUrl } from "../../js/core/dom.js";

const BREAKPOINT_TABLET = 1200;
const BREAKPOINT_MOBILE = 768;

function parseEventDate(datetime) {
  const [day = "", time = ""] = String(datetime).split(" ");
  const [year = "", month = "", date = ""] = day.split("-");
  return { year, month, date, time };
}

function getVisibleCount() {
  if (window.innerWidth < BREAKPOINT_MOBILE) return 1;
  if (window.innerWidth < BREAKPOINT_TABLET) return 2;
  return 4;
}

function renderEventCard(event) {
  const { year, month, date, time } = parseEventDate(event.datetime);
  const href = escapeHtml(event.url || "#");

  return `
    <a class="tdmu-event-card" href="${href}">
      <div class="tdmu-event-card-media">
        <img
          class="tdmu-event-card-thumb"
          src="${escapeHtml(resolveAppUrl(event.cover || "assets/img/bg-landing.jpg"))}"
          alt="${escapeHtml(event.title)}"
          loading="lazy"
          onerror="this.src='${resolveAppUrl("assets/img/bg-landing.jpg")}'"
        />
        <div class="tdmu-event-card-date">
          <span class="tdmu-event-card-month">${escapeHtml(month)}/${escapeHtml(year)}</span>
          <strong class="tdmu-event-card-day">${escapeHtml(date)}</strong>
          <span class="tdmu-event-card-time">${escapeHtml(time)}</span>
        </div>
      </div>
      <div class="tdmu-event-card-body">
        <h3 class="tdmu-event-card-title">${escapeHtml(event.title)}</h3>
        <p class="tdmu-event-card-meta mb-0">${escapeHtml(event.location)}</p>
      </div>
    </a>
  `;
}

function buildRail(items) {
  if (!items.length) return "";
  return items.map(renderEventCard).join("");
}

export function initLatestEvents(items) {
  const shell = document.getElementById("events-carousel");
  const rail = document.getElementById("events-list");
  const prevButton = shell.querySelector("[data-events-prev]");
  const nextButton = shell.querySelector("[data-events-next]");
  if (!shell || !rail || !items.length) return;

  let visibleCount = getVisibleCount();
  let currentIndex = 0;
  let maxIndex = Math.max(0, items.length - visibleCount);

  const getStepWidth = () => {
    const card = rail.querySelector(".tdmu-event-card");
    if (!card) return 0;

    const gap = parseFloat(getComputedStyle(rail).columnGap || getComputedStyle(rail).gap || "0");
    return card.getBoundingClientRect().width + gap;
  };

  const applyPosition = (withTransition = true) => {
    rail.classList.toggle("is-no-transition", !withTransition);
    const stepWidth = getStepWidth();
    rail.style.transform = `translateX(-${currentIndex * stepWidth}px)`;
  };

  const updateControls = () => {
    const isInteractive = items.length > visibleCount;
    prevButton?.toggleAttribute("disabled", !isInteractive || currentIndex <= 0);
    nextButton?.toggleAttribute("disabled", !isInteractive || currentIndex >= maxIndex);
  };

  const moveToNext = () => {
    if (currentIndex >= maxIndex) return;

    currentIndex += 1;
    applyPosition(true);
    updateControls();
  };

  const moveToPrev = () => {
    if (currentIndex <= 0) return;

    currentIndex -= 1;
    applyPosition(true);
    updateControls();
  };

  const render = () => {
    visibleCount = getVisibleCount();
    maxIndex = Math.max(0, items.length - visibleCount);
    shell.style.setProperty("--tdmu-events-visible", String(visibleCount));
    rail.innerHTML = buildRail(items);
    currentIndex = 0;
    applyPosition(false);

    requestAnimationFrame(() => {
      rail.classList.remove("is-no-transition");
    });

    updateControls();
  };

  prevButton?.addEventListener("click", () => {
    moveToPrev();
  });

  nextButton?.addEventListener("click", () => {
    moveToNext();
  });

  let lastVisibleCount = visibleCount;
  window.addEventListener("resize", () => {
    const nextVisibleCount = getVisibleCount();
    if (nextVisibleCount !== lastVisibleCount) {
      lastVisibleCount = nextVisibleCount;
      render();
      return;
    }

    applyPosition(false);
  });

  render();
}
