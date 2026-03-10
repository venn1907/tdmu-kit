export function initFooterLayout() {
  const yearNode = document.getElementById("year");
  if (!yearNode) return;

  yearNode.textContent = String(new Date().getFullYear());
}
