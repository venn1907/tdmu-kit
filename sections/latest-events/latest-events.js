import { escapeHtml } from "../../js/core/dom.js";

export function initLatestEvents(items) {
  const mount = document.getElementById("events-list");
  if (!mount) return;

  mount.innerHTML = items
    .slice(0, 5)
    .map((event) => {
      const [day = "", time = ""] = String(event.datetime).split(" ");
      return `
        <article class="tdmu-event-item">
          <div class="tdmu-event-dot"></div>
          <p class="tdmu-event-time mb-0">${escapeHtml(day)}${time ? ` • ${escapeHtml(time)}` : ""}</p>
          <h3 class="tdmu-event-title">${escapeHtml(event.title)}</h3>
          <p class="tdmu-event-meta mb-0">${escapeHtml(event.location)}</p>
        </article>
      `;
    })
    .join("");
}
