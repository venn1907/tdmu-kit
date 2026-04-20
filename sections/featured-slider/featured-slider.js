export function initFeaturedSlider() {
  const mount = document.getElementById("featured-slider");
  if (!mount) return;

  const track = mount.querySelector("#featured-slider-track");
  const slides = Array.from(mount.querySelectorAll(".tdmu-slide"));
  const dots = Array.from(mount.querySelectorAll(".tdmu-slider-dot"));
  const prev = mount.querySelector(".tdmu-slider-control.prev");
  const next = mount.querySelector(".tdmu-slider-control.next");

  if (!track || !slides.length || !dots.length || !prev || !next) return;

  let activeIndex = 0;
  let timer = null;

  const apply = (nextIndex) => {
    activeIndex = (nextIndex + slides.length) % slides.length;
    track.style.transform = `translateX(-${activeIndex * 100}%)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
    });
  };

  const stop = () => {
    if (!timer) return;
    window.clearInterval(timer);
    timer = null;
  };

  const start = () => {
    stop();
    timer = window.setInterval(() => apply(activeIndex + 1), 5000);
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
