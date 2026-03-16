import { resolveAppUrl, escapeHtml, formatDate } from "../../js/core/dom.js";
import { getArticleTemplateHref, bindArticleSelectionLinks } from "../../js/components/article-navigation.js";

export function initFeaturedSlider(newsData) {
  const mount = document.getElementById("featured-slider");
  if (!mount) return;

  const slides = [...newsData].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
  if (!slides.length) return;

  mount.innerHTML = `
    <div class="tdmu-slider-track" id="featured-slider-track">
      ${slides
        .map(
          (item, index) => `
        <article class="tdmu-slide">
          <img
            class="tdmu-slide-media"
            src="${escapeHtml(resolveAppUrl(item.cover))}"
            alt="${escapeHtml(item.title)}"
            loading="${index === 0 ? "eager" : "lazy"}"
            decoding="async"
            onerror="this.src='${resolveAppUrl("assets/img/bg-landing.jpg")}'"
          />
          <div class="tdmu-slide-overlay"></div>
          <div class="tdmu-slide-content">
            <div class="tdmu-slide-meta">
              <span>${escapeHtml(formatDate(item.date))}</span>
              <span className="tdmu-dot-sep">•</span>
              <span>${escapeHtml(item.category)}</span>
            </div>
            <h1 class="tdmu-slide-title">
              ${escapeHtml(item.title)}
            </h1>
            <a href="${getArticleTemplateHref(item.id)}" data-article-id="${escapeHtml(item.id)}" class="tdmu-slide-link">Đọc thêm</a>
          </div>
        </article>
      `,
        )
        .join("")}
    </div>
    <div class="tdmu-slider-controls">
      <button class="tdmu-slider-control prev" type="button" aria-label="Slide trước">
        <span class="material-symbols-rounded">chevron_left</span>
      </button>
      <button class="tdmu-slider-control next" type="button" aria-label="Slide tiếp">
        <span class="material-symbols-rounded">chevron_right</span>
      </button>
    </div>
    <div class="tdmu-slider-dots">
      ${slides
        .map((_, index) => `<button class="tdmu-slider-dot" type="button" data-slide="${index}" aria-label="Đi đến slide ${index + 1}"></button>`)
        .join("")}
    </div>
  `;

  const track = mount.querySelector("#featured-slider-track");
  const dots = Array.from(mount.querySelectorAll(".tdmu-slider-dot"));
  const prev = mount.querySelector(".tdmu-slider-control.prev");
  const next = mount.querySelector(".tdmu-slider-control.next");

  let activeIndex = 0;
  let timer = null;

  const apply = (nextIndex) => {
    activeIndex = (nextIndex + slides.length) % slides.length;
    track.style.transform = `translateX(-${activeIndex * 100}%)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
    });
  };

  const start = () => {
    stop();
    timer = window.setInterval(() => apply(activeIndex + 1), 5000);
  };

  const stop = () => {
    if (!timer) return;
    window.clearInterval(timer);
    timer = null;
  };

  prev.addEventListener("click", () => {
    apply(activeIndex - 1);
    start();
  });

  next.addEventListener("click", () => {
    apply(activeIndex + 1);
    start();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      apply(Number(dot.dataset.slide || 0));
      start();
    });
  });

  mount.addEventListener("mouseenter", stop);
  mount.addEventListener("mouseleave", start);

  bindArticleSelectionLinks(mount);
  apply(0);
  start();
}
