import { escapeHtml, formatDate } from "../../js/core/dom.js";
import { getArticleTemplateHref, bindArticleSelectionLinks } from "../../js/components/article-navigation.js";

const NOTICE_TAB_ITEMS = [
  { key: "all", label: "Tổng hợp" },
  { key: "admissions", label: "Thông báo tuyển sinh" },
  { key: "students", label: "Thông báo sinh viên" },
  { key: "jobs", label: "Tuyển dụng" },
];

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function detectNoticeBucket(item) {
  const combined = `${normalizeText(item.category)} ${normalizeText(item.title)}`;
  if (combined.includes("tuyen dung") || combined.includes("viec lam")) return "jobs";
  if (combined.includes("sinh vien")) return "students";
  if (combined.includes("tuyen sinh")) return "admissions";
  if (combined.includes("thong bao")) return "all";
  return null;
}

function buildNoticeIndex(newsData) {
  const buckets = { all: [], admissions: [], students: [], jobs: [] };

  [...newsData]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach((item) => {
      const bucket = detectNoticeBucket(item);
      if (!bucket) return;
      buckets.all.push(item);
      if (bucket !== "all") buckets[bucket].push(item);
    });

  if (!buckets.admissions.length) {
    buckets.admissions = buckets.all.filter((item) => normalizeText(item.title).includes("tuyen sinh")).slice(0, 6);
  }

  if (!buckets.students.length) {
    buckets.students = buckets.all.filter((item) => normalizeText(item.title).includes("sinh vien")).slice(0, 6);
  }

  if (!buckets.jobs.length) {
    buckets.jobs = buckets.all.filter((item) => normalizeText(item.title).includes("tuyen dung")).slice(0, 6);
  }

  return buckets;
}

function renderNoticeList(items) {
  const mount = document.getElementById("notice-list");
  if (!mount) return;

  if (!items.length) {
    mount.innerHTML = `<p class="text-sm text-muted mb-0">Chưa có dữ liệu cho nhóm thông báo này.</p>`;
    return;
  }

  mount.innerHTML = items
    .slice(0, 6)
    .map(
      (item) => `
      <article class="tdmu-notice-item">
        <a class="tdmu-notice-item-title" href="${getArticleTemplateHref(item.id)}" data-article-id="${escapeHtml(item.id)}">${escapeHtml(item.title)}</a>
        <span class="tdmu-notice-item-date">${escapeHtml(formatDate(item.date))}</span>
      </article>
    `,
    )
    .join("");

  bindArticleSelectionLinks(mount);
}

export function initNoticeBoard(newsData) {
  const mount = document.getElementById("notice-tabs");
  if (!mount) return;

  const index = buildNoticeIndex(newsData);

  mount.innerHTML = NOTICE_TAB_ITEMS.map(
    (tab, indexPosition) => `
    <button class="tdmu-notice-tab${indexPosition === 0 ? " is-active" : ""}" type="button" data-tab="${tab.key}">
      ${tab.label}
    </button>
  `,
  ).join("");

  const apply = (key) => {
    mount.querySelectorAll("[data-tab]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tab === key);
    });
    renderNoticeList(index[key] || []);
  };

  mount.addEventListener("click", (event) => {
    const button = event.target.closest("[data-tab]");
    if (!button) return;
    apply(button.dataset.tab);
  });

  apply("all");
}

