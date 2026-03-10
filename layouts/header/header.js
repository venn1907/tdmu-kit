export function initHeaderLayout() {
  setActiveNav();
  initHeaderCollapse();
}

function setActiveNav() {
  const page = document.body?.dataset?.page;
  if (!page) return;

  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.nav === page);
  });
}

function initHeaderCollapse() {
  const header = document.getElementById("mainHeader");
  if (!header) return;

  const headerTop = header.querySelector(".header-top");
  const safeGap = 8;

  const getCollapseThreshold = () => {
    if (!headerTop) return 16;
    return Math.max(24, headerTop.offsetHeight - 8);
  };

  const apply = () => {
    const scrolled = window.scrollY > getCollapseThreshold();
    header.classList.toggle("is-scrolled", scrolled);
    document.body.style.setProperty("--header-offset", `${header.offsetHeight + safeGap}px`);
  };

  window.addEventListener("scroll", apply, { passive: true });
  window.addEventListener("resize", apply);
  window.addEventListener("load", apply);

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(() => apply());
    observer.observe(header);
  }

  apply();
}
