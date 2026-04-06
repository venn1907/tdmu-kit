function getVisibleCount() {
  if (window.innerWidth <= 767.98) return 1;
  if (window.innerWidth <= 1199.98) return 2;
  return 3;
}

export function initTeamAdvisors() {
  const shell = document.getElementById("team-advisors-carousel");
  if (!shell) return;

  const rail = shell.querySelector(".tdmu-team-rail");
  const items = Array.from(shell.querySelectorAll(".tdmu-team-profile"));
  const prevButton = shell.querySelector(".tdmu-team-nav--prev");
  const nextButton = shell.querySelector(".tdmu-team-nav--next");
  const pagination = shell.querySelector(".tdmu-team-pagination");

  if (!rail || !items.length || !prevButton || !nextButton || !pagination)
    return;

  let visibleCount = getVisibleCount();
  let currentIndex = 0;
  let autoTimer = null;

  const getMaxIndex = () => Math.max(0, items.length - visibleCount);
  const getTotalPages = () => Math.max(1, getMaxIndex() + 1);

  const renderPagination = () => {
    const totalPages = getTotalPages();
    pagination.innerHTML = Array.from(
      { length: totalPages },
      (_, index) =>
        `<button class="tdmu-team-dot${index === currentIndex ? " is-active" : ""}" type="button" data-page="${index}" aria-label="Đi đến nhóm ${index + 1}"></button>`,
    ).join("");

    pagination.querySelectorAll(".tdmu-team-dot").forEach((dot) => {
      dot.addEventListener("click", () => {
        currentIndex = Number(dot.dataset.page || 0);
        update();
        restartAuto();
      });
    });
  };

  const update = () => {
    const itemWidth = items[0].getBoundingClientRect().width;
    const gap = parseFloat(
      window.getComputedStyle(rail).columnGap ||
        window.getComputedStyle(rail).gap ||
        "0",
    );
    rail.style.transform = `translateX(-${currentIndex * (itemWidth + gap)}px)`;

    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex >= getMaxIndex();
    renderPagination();
  };

  const syncLayout = () => {
    visibleCount = getVisibleCount();
    currentIndex = Math.min(currentIndex, getMaxIndex());
    update();
  };

  const stopAuto = () => {
    if (!autoTimer) return;
    window.clearInterval(autoTimer);
    autoTimer = null;
  };

  const startAuto = () => {
    stopAuto();
    if (items.length <= visibleCount) return;

    autoTimer = window.setInterval(() => {
      currentIndex = currentIndex >= getMaxIndex() ? 0 : currentIndex + 1;
      update();
    }, 3000);
  };

  const restartAuto = () => {
    startAuto();
  };

  prevButton.addEventListener("click", () => {
    currentIndex = Math.max(0, currentIndex - 1);
    update();
    restartAuto();
  });

  nextButton.addEventListener("click", () => {
    currentIndex = Math.min(getMaxIndex(), currentIndex + 1);
    update();
    restartAuto();
  });

  window.addEventListener("resize", syncLayout);
  shell.addEventListener("mouseenter", stopAuto);
  shell.addEventListener("mouseleave", startAuto);
  shell.addEventListener("focusin", stopAuto);
  shell.addEventListener("focusout", startAuto);
  update();
  startAuto();
}
