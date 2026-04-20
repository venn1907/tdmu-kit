const BREAKPOINT_TABLET = 1200;
const BREAKPOINT_MOBILE = 768;

function getVisibleCount() {
  if (window.innerWidth < BREAKPOINT_MOBILE) return 1;
  if (window.innerWidth < BREAKPOINT_TABLET) return 2;
  return 4;
}

export function initLatestEvents() {
  const shell = document.getElementById("events-carousel");
  const rail = document.getElementById("events-list");
  const prevButton = shell?.querySelector("[data-events-prev]");
  const nextButton = shell?.querySelector("[data-events-next]");
  if (!shell || !rail || !prevButton || !nextButton) return;

  let visibleCount = getVisibleCount();
  let currentIndex = 0;

  const getItems = () => Array.from(rail.querySelectorAll(".tdmu-event-card"));
  const getMaxIndex = () => Math.max(0, getItems().length - visibleCount);

  const getStepWidth = () => {
    const card = rail.querySelector(".tdmu-event-card");
    if (!card) return 0;

    const gap = parseFloat(
      getComputedStyle(rail).columnGap || getComputedStyle(rail).gap || "0",
    );
    return card.getBoundingClientRect().width + gap;
  };

  const applyPosition = (withTransition = true) => {
    rail.classList.toggle("is-no-transition", !withTransition);
    rail.style.transform = `translateX(-${currentIndex * getStepWidth()}px)`;
  };

  const updateControls = () => {
    const isInteractive = getItems().length > visibleCount;
    prevButton.toggleAttribute("disabled", !isInteractive || currentIndex <= 0);
    nextButton.toggleAttribute(
      "disabled",
      !isInteractive || currentIndex >= getMaxIndex(),
    );
  };

  const syncLayout = () => {
    visibleCount = getVisibleCount();
    currentIndex = Math.min(currentIndex, getMaxIndex());
    shell.style.setProperty("--tdmu-events-visible", String(visibleCount));
    applyPosition(false);

    requestAnimationFrame(() => {
      rail.classList.remove("is-no-transition");
    });

    updateControls();
  };

  prevButton.addEventListener("click", () => {
    currentIndex = Math.max(0, currentIndex - 1);
    applyPosition(true);
    updateControls();
  });

  nextButton.addEventListener("click", () => {
    currentIndex = Math.min(getMaxIndex(), currentIndex + 1);
    applyPosition(true);
    updateControls();
  });

  let lastVisibleCount = visibleCount;
  window.addEventListener("resize", () => {
    const nextVisibleCount = getVisibleCount();
    if (nextVisibleCount !== lastVisibleCount) {
      lastVisibleCount = nextVisibleCount;
    }

    syncLayout();
  });

  syncLayout();
}
