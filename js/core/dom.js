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
