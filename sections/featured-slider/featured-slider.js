import { resolveAppUrl, escapeHtml } from "../../js/core/dom.js";

export function initFeaturedSlider(slidesData) {
  const mount = document.getElementById("featured-slider");
  if (!mount) return;

  const slides = Array.isArray(slidesData) ? slidesData.filter((item) => item?.image) : [];

  if (!slides.length) return;

  mount.innerHTML = `
    <div class="tdmu-slider-track" id="featured-slider-track">
      ${slides
        .map(
          (item, index) => `
            <figure class="tdmu-slide">
              <img
                class="tdmu-slide-media"
                src="${escapeHtml(resolveAppUrl(item.image))}"
                alt="${escapeHtml(item.alt || "Hero image")}"
                loading="${index === 0 ? "eager" : "lazy"}"
                decoding="async"
                onerror="this.src='${resolveAppUrl("assets/img/bg-landing.jpg")}'"
              />
            </figure>
          `,
        )
        .join("")}
    </div>
    <div class="tdmu-slider-controls">
      <button class="tdmu-slider-control prev" type="button" aria-label="Ảnh trước">
        <span class="material-symbols-rounded">chevron_left</span>
      </button>
      <button class="tdmu-slider-control next" type="button" aria-label="Ảnh tiếp theo">
        <span class="material-symbols-rounded">chevron_right</span>
      </button>
    </div>
    <div class="tdmu-slider-dots">
      ${slides
        .map(
          (_, index) =>
            `<button class="tdmu-slider-dot" type="button" data-slide="${index}" aria-label="Đi đến ảnh ${index + 1}"></button>`,
        )
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

  apply(0);
  start();
}
