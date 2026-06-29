function initScrollTop() {
  const button = document.getElementById("btnTop");
  if (!button) return;

  function update() {
    const visible = window.scrollY > 280;
    button.classList.toggle("is-visible", visible);
    button.tabIndex = visible ? 0 : -1;
  }

  button.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

initScrollTop();
