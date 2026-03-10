import { resolveAppUrl } from "./dom.js";

function rewriteFragmentPaths(root) {
  root.querySelectorAll("[href], [src]").forEach((node) => {
    ["href", "src"].forEach((attr) => {
      const value = node.getAttribute(attr);
      if (!value) return;
      node.setAttribute(attr, resolveAppUrl(value));
    });
  });
}

export async function injectFragment(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;

  const res = await fetch(resolveAppUrl(url));
  if (!res.ok) {
    el.innerHTML = `<div class="container py-3 text-danger">
      Failed to load ${url}. Run with a local server.
    </div>`;
    return;
  }

  el.innerHTML = await res.text();
  rewriteFragmentPaths(el);
}
