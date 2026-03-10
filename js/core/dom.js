export function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

const APP_BASE_URL = new URL("../..", import.meta.url);

export function getAppBasePath() {
  const base = APP_BASE_URL.pathname || "/";
  return base.endsWith("/") ? base : `${base}/`;
}

export function resolveAppUrl(path) {
  const raw = String(path || "");
  if (!raw) return getAppBasePath();

  if (
    /^(?:[a-z]+:)?\/\//i.test(raw) ||
    raw.startsWith("#") ||
    raw.startsWith("mailto:") ||
    raw.startsWith("tel:") ||
    raw.startsWith("javascript:") ||
    raw.startsWith("data:")
  ) {
    return raw;
  }

  const next = new URL(raw.replace(/^\/+/, ""), APP_BASE_URL);
  return `${next.pathname}${next.search}${next.hash}`;
}

export function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
