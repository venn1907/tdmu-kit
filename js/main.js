import { injectFragment } from "./core/include.js";
import { initSectionsFromDom } from "./core/section-registry.js";
import { initHeaderLayout } from "../layouts/header/header.js";
import { initFooterLayout } from "../layouts/footer/footer.js";

function initScrollToTop() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "tdmu-scroll-top";
  button.id = "scrollTopButton";
  button.title = "Lên đầu trang";
  button.innerHTML =
    '<span class="material-symbols-rounded">arrow_upward</span>';

  const updateVisibility = () => {
    const visible = window.scrollY > 280;
    button.classList.toggle("is-visible", visible);
    button.tabIndex = visible ? 0 : -1;
  };

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", updateVisibility, { passive: true });
  window.addEventListener("resize", updateVisibility);
  document.body.appendChild(button);
  updateVisibility();
}

async function initCurrentPage() {
  await initSectionsFromDom();
}

(async function boot() {
  await injectFragment("#site-header", "layouts/header/header.html");
  await injectFragment("#site-footer", "layouts/footer/footer.html");

  initHeaderLayout();
  initScrollToTop();
  initFooterLayout();
  await initCurrentPage();
})();
