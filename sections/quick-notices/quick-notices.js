export function initQuickNotices() {
  const tabs = document.querySelector("[data-notice-tabs]");
  if (!tabs) return;

  const items = Array.from(
    document.querySelectorAll("[data-notice-category]"),
  );

  tabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-notice-filter]");
    if (!button) return;

    const category = button.dataset.noticeFilter;

    tabs.querySelectorAll("[data-notice-filter]").forEach((tab) => {
      tab.classList.toggle("is-active", tab === button);
    });

    items.forEach((item) => {
      item.hidden =
        category !== "all" && item.dataset.noticeCategory !== category;
    });
  });
}
