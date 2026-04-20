import { resolveAppUrl } from "../../js/core/dom.js";

function getWrappedIndex(index, length) {
  return (index + length) % length;
}

function readItems(root) {
  return Array.from(root.querySelectorAll(".tdmu-research-source-item")).map(
    (item) => ({
      title: item.dataset.title || "",
      date: item.dataset.date || "",
      image: item.dataset.image || "",
      href: item.dataset.href || "#",
      label: item.dataset.label || "",
    }),
  );
}

function updateSideCard(card, item) {
  const image = card.querySelector("img");
  const label = card.querySelector(".tdmu-research-card-label");
  const title = card.querySelector(".tdmu-research-card-title");
  if (!image || !label || !title) return;

  image.src = resolveAppUrl(item.image);
  image.alt = item.title;
  label.textContent = item.label;
  title.textContent = item.title;
}

function updateMainCard(card, item) {
  const image = card.querySelector("img");
  const metaText = card.querySelector(".tdmu-research-meta span:last-child");
  const title = card.querySelector(".tdmu-research-card-title--main");
  const link = card.querySelector(".tdmu-research-link");
  if (!image || !metaText || !title || !link) return;

  image.src = resolveAppUrl(item.image);
  image.alt = item.title;
  metaText.textContent = item.date;
  title.textContent = item.title;
  link.href = item.href;
}

function renderCards(root, items, activeIndex) {
  const leftCard = root.querySelector(".tdmu-research-card--left");
  const mainCard = root.querySelector(".tdmu-research-card--main");
  const rightCard = root.querySelector(".tdmu-research-card--right");

  if (!leftCard || !mainCard || !rightCard) return;

  updateSideCard(leftCard, items[getWrappedIndex(activeIndex - 1, items.length)]);
  updateMainCard(mainCard, items[activeIndex]);
  updateSideCard(rightCard, items[getWrappedIndex(activeIndex + 1, items.length)]);
}

export function initResearchShowcase() {
  const root = document.getElementById("research-showcase");
  if (!root) return;

  const stage = root.querySelector(".tdmu-research-stage");
  const prevButtons = Array.from(root.querySelectorAll("[data-research-prev]"));
  const nextButtons = Array.from(root.querySelectorAll("[data-research-next]"));
  const items = readItems(root);

  if (!stage || items.length < 3 || !prevButtons.length || !nextButtons.length) {
    return;
  }

  let activeIndex = 0;
  let isAnimating = false;
  let pendingDirection = "";

  const finishMove = () => {
    if (!pendingDirection) return;

    activeIndex =
      pendingDirection === "next"
        ? getWrappedIndex(activeIndex + 1, items.length)
        : getWrappedIndex(activeIndex - 1, items.length);

    renderCards(root, items, activeIndex);
    root.classList.remove("is-sliding-next", "is-sliding-prev");
    pendingDirection = "";
    isAnimating = false;
  };

  const move = (direction) => {
    if (isAnimating) return;

    isAnimating = true;
    pendingDirection = direction;
    root.classList.add(
      direction === "next" ? "is-sliding-next" : "is-sliding-prev",
    );

    window.setTimeout(finishMove, 340);
  };

  prevButtons.forEach((button) => {
    button.addEventListener("click", () => move("prev"));
  });

  nextButtons.forEach((button) => {
    button.addEventListener("click", () => move("next"));
  });

  renderCards(root, items, activeIndex);
}
