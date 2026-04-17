import { injectFragment } from "./core/include.js";
import { resolveAppUrl } from "./core/dom.js";
import { initSectionsFromDom } from "./core/section-registry.js";
import { initHeaderLayout } from "../layouts/header/header.js";
import { initFooterLayout } from "../layouts/footer/footer.js";
import { initContactModal } from "../sections/contact-modal/contact-modal.js";

function ensureStylesheet(id, href) {
  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = resolveAppUrl(href);
  document.head.appendChild(link);
}

function ensureMountPoint(id) {
  let node = document.getElementById(id);
  if (node) return node;

  node = document.createElement("div");
  node.id = id;
  document.body.appendChild(node);
  return node;
}

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
  ensureStylesheet(
    "tdmu-contact-modal-style",
    "sections/contact-modal/contact-modal.css",
  );
  ensureMountPoint("site-contact-modal");
  await injectFragment(
    "#site-contact-modal",
    "sections/contact-modal/contact-modal.html",
  );

  initHeaderLayout();
  initScrollToTop();
  initFooterLayout();
  initContactModal();
  await initCurrentPage();
})();
