import {
  escapeHtml,
  formatDate,
  resolveAppUrl,
  getQueryParam,
} from "../../js/core/dom.js";
import { getNewsDetailHref } from "../../js/components/article-navigation.js";
import { createListingController } from "../../js/components/listing-controller.js";

const PAGE_SIZE = 6;

export function initNewsListing(items) {
  const filterRoot = document.getElementById("newsListingFilters");
  const filterMenu = document.getElementById("newsListingFilterMenu");
  const filterToggle = document.getElementById("newsListingFilterToggle");
  const filterLabel = document.getElementById("newsListingFilterLabel");
  const grid = document.getElementById("newsListingGrid");
  const count = document.getElementById("newsListingCount");
  const pagination = document.getElementById("newsListingPagination");

  if (
    !filterRoot ||
    !filterMenu ||
    !filterToggle ||
    !filterLabel ||
    !grid ||
    !count ||
    !pagination
  )
    return;

  createListingController({
    items,
    pageSize: PAGE_SIZE,
    getCategory: (item) => item.category,
    filterRoot,
    filterMenu,
    filterToggle,
    filterLabel,
    paginationRoot: pagination,
    paginationLabel: "Phân trang tin tức",
    initialCategory: getQueryParam("category"),
    onCountChange: (total) => {
      count.textContent = `${total} bài viết`;
    },
    onRender: (pagedItems) => {
      grid.innerHTML = pagedItems
        .map(
          (item) => `
            <article class="tdmu-news-card">
              <a class="tdmu-news-card-media" href="${getNewsDetailHref(item.id)}">
                <img
                  class="tdmu-news-card-image"
                  src="${escapeHtml(resolveAppUrl(item.cover))}"
                  alt="${escapeHtml(item.title)}"
                  loading="lazy"
                />
              </a>
              <div class="tdmu-news-card-body">
                <p class="tdmu-news-card-meta">${escapeHtml(item.category)} · ${escapeHtml(formatDate(item.date))}</p>
                <h2 class="tdmu-news-card-title clamp-2">
                  <a href="${getNewsDetailHref(item.id)}">${escapeHtml(item.title)}</a>
                </h2>
                <p class="tdmu-news-card-excerpt clamp-3">${escapeHtml(item.excerpt)}</p>
              </div>
            </article>
          `,
        )
        .join("");
    },
  });
}
