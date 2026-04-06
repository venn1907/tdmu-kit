import { escapeHtml, formatDate, getQueryParam } from "../../js/core/dom.js";
import { getNoticeDetailHref } from "../../js/components/article-navigation.js";
import { createListingController } from "../../js/components/listing-controller.js";

const PAGE_SIZE = 6;

export function initNoticeListing(items) {
  const filterRoot = document.getElementById("noticeListingFilters");
  const filterMenu = document.getElementById("noticeListingFilterMenu");
  const filterToggle = document.getElementById("noticeListingFilterToggle");
  const filterLabel = document.getElementById("noticeListingFilterLabel");
  const list = document.getElementById("noticeListingList");
  const count = document.getElementById("noticeListingCount");
  const pagination = document.getElementById("noticeListingPagination");

  if (!filterRoot || !filterMenu || !filterToggle || !filterLabel || !list || !count || !pagination) return;

  createListingController({
    items,
    pageSize: PAGE_SIZE,
    getCategory: (item) => item.category,
    filterRoot,
    filterMenu,
    filterToggle,
    filterLabel,
    paginationRoot: pagination,
    paginationLabel: "Phân trang thông báo",
    initialCategory: getQueryParam("category"),
    onCountChange: (total) => {
      count.textContent = `${total} thông báo`;
    },
    onRender: (pagedItems) => {
      list.innerHTML = pagedItems
        .map(
          (item) => `
            <article class="tdmu-notice-item">
              <a class="tdmu-notice-item-title" href="${getNoticeDetailHref(item.id)}">${escapeHtml(item.title)}</a>
              <div class="tdmu-notice-item-meta">
                <span>${escapeHtml(formatDate(item.date))}</span>
                <span>·</span>
                <span>${escapeHtml(String(item.views || 0))} lượt xem</span>
              </div>
            </article>
          `,
        )
        .join("");
    },
  });
}
