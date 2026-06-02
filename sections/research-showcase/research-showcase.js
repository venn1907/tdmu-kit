function getWrappedIndex(index, length) {
  return (index + length) % length;
}

function getCardPosition(index, activeIndex, length) {
  let position = index - activeIndex;
  const half = length / 2;

  if (position > half) position -= length;
  if (position < -half) position += length;

  return position;
}

function renderCards(cards, activeIndex) {
  cards.forEach((card, index) => {
    const position = getCardPosition(index, activeIndex, cards.length);
    const distance = Math.abs(position);
    const direction = position < 0 ? 1 : -1;
    const moveX = position * 220;
    const scale = Math.max(0.68, 1 - distance * 0.14);
    const opacity = distance > 2 ? 0 : Math.max(0.32, 1 - distance * 0.25);
    const blur = Math.min(distance * 1.5, 3);

    card.style.transform =
      position === 0
        ? "translateX(0) scale(1)"
        : `translateX(${moveX}px) scale(${scale}) perspective(900px) rotateY(${direction * 14}deg)`;
    card.style.zIndex = String(10 - distance);
    card.style.opacity = String(opacity);
    card.style.filter = position === 0 ? "none" : `blur(${blur}px)`;
    card.classList.toggle("is-active", position === 0);
  });
}

export function initResearchShowcase() {
  const root = document.getElementById("research-showcase");
  if (!root) return;

  const cards = Array.from(root.querySelectorAll(".tdmu-research-card"));
  const prevButton = root.querySelector("[data-research-prev]");
  const nextButton = root.querySelector("[data-research-next]");

  if (!cards.length || !prevButton || !nextButton) return;

  let activeIndex = 0;

  const move = (step) => {
    activeIndex = getWrappedIndex(activeIndex + step, cards.length);
    renderCards(cards, activeIndex);
  };

  prevButton.addEventListener("click", () => move(-1));
  nextButton.addEventListener("click", () => move(1));

  renderCards(cards, activeIndex);
}
