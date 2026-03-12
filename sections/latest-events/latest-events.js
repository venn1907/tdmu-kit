import { escapeHtml, resolveAppUrl } from "../../js/core/dom.js";

export function initLatestEvents(items) {
  const mount = document.getElementById("events-list");
  if (!mount) return;

  mount.innerHTML = items
    .slice(0, 4)
    .map((event) => {
      const [day = "", time = ""] = String(event.datetime).split(" ");
      const [year = "", month = "", date = ""] = day.split("-");

      return `
        <a class="tdmu-event-card" href="#">
          <div class="tdmu-event-card-top">
            <img
              class="tdmu-event-thumb"
              src="${escapeHtml(resolveAppUrl(event.cover || "assets/img/bg-landing.jpg"))}"
              alt="${escapeHtml(event.title)}"
              loading="lazy"
              onerror="this.src='${resolveAppUrl("assets/img/bg-landing.jpg")}'"
            />
            <div class="tdmu-event-date-badge">
              <span class="tdmu-event-date-month">${escapeHtml(month)}/${escapeHtml(year)}</span>
              <strong class="tdmu-event-date-day">${escapeHtml(date)}</strong>
            </div>
          </div>
          <div class="tdmu-event-card-body">
            <p class="tdmu-event-time mb-0">${escapeHtml(time)}</p>
            <h3 class="tdmu-event-title">${escapeHtml(event.title)}</h3>
            <p class="tdmu-event-meta mb-0">${escapeHtml(event.location)}</p>
          </div>
        </a>
      `;
    })
    .join("");
}
