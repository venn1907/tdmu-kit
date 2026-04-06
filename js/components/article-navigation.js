import { resolveAppUrl } from "../core/dom.js";

function buildDetailHref(path, itemId, queryKey) {
  const id = encodeURIComponent(String(itemId || ""));
  return resolveAppUrl(`${path}?${queryKey}=${id}`);
}

export function getNewsDetailHref(articleId) {
  return buildDetailHref("pages/news-detail/index.html", articleId, "article");
}

export function getNoticeDetailHref(noticeId) {
  return buildDetailHref("pages/notice-detail/index.html", noticeId, "notice");
}
