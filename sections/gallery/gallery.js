import { resolveAppUrl } from "../../js/core/dom.js";

export function initGallery() {
  const section = document.querySelector("[data-media-library]");
  const viewer = document.querySelector("[data-media-viewer]");
  if (!section || !viewer) return;

  const items = Array.from(section.querySelectorAll("[data-media-item]"));
  const moreCount = section.querySelector("[data-media-more-count]");
  const frame = viewer.querySelector("[data-media-frame]");
  const closeButton = viewer.querySelector("[data-media-close]");
  const prevButton = viewer.querySelector("[data-media-prev]");
  const nextButton = viewer.querySelector("[data-media-next]");
  if (!items.length || !frame || !closeButton || !prevButton || !nextButton) {
    return;
  }

  let activeIndex = 0;

  if (moreCount) {
    const hiddenCount = Math.max(items.length - 5, 0);
    const moreTile = moreCount.closest("[data-media-item]");
    moreCount.textContent = hiddenCount ? `+${hiddenCount}` : "";
    if (moreTile) moreTile.hidden = hiddenCount === 0;
  }

  const getSource = (item) => {
    const src = item.dataset.src || "";
    return item.dataset.type === "image" ? resolveAppUrl(src) : src;
  };

  const render = () => {
    const item = items[activeIndex];
    const type = item.dataset.type;
    const src = getSource(item);
    const label = item.dataset.title || "";
    const media =
      type === "video"
        ? document.createElement("iframe")
        : document.createElement("img");

    frame.replaceChildren();
    media.src = src;

    if (type === "video") {
      media.title = label;
      media.loading = "lazy";
      media.allowFullscreen = true;
      media.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    } else {
      media.alt = label;
    }

    frame.appendChild(media);
  };

  const open = (index) => {
    activeIndex = index;
    render();
    viewer.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    viewer.hidden = true;
    frame.replaceChildren();
    document.body.style.overflow = "";
  };

  const move = (step) => {
    activeIndex = (activeIndex + step + items.length) % items.length;
    render();
  };

  items.forEach((item, index) => {
    item.addEventListener("click", () => open(index));
  });

  closeButton.addEventListener("click", close);
  prevButton.addEventListener("click", () => move(-1));
  nextButton.addEventListener("click", () => move(1));
  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) close();
  });

  document.addEventListener("keydown", (event) => {
    if (viewer.hidden) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  });
}
