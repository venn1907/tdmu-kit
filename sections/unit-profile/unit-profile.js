import { escapeHtml, resolveAppUrl } from "../../js/core/dom.js";

const unitProfileData = {
  kicker: "Hồ sơ đơn vị",
  name: "Viện Công nghệ số",
  title: "Không gian đào tạo, nghiên cứu và kết nối số mang dấu ấn TDMU",
  summary:
    "Section này phù hợp cho khoa, viện, trung tâm hoặc phòng ban muốn giới thiệu nhanh về đơn vị ngay trên trang chủ, với nhịp trình bày gọn và hiện đại.",
  cta: {
    label: "Xem giới thiệu đơn vị",
    href: "#",
  },
  image: {
    src: "assets/img/banner.jpg",
    alt: "Hoạt động học thuật của Viện Công nghệ số",
  },
  badge: {
    label: "Định hướng",
    value: "Học thuật số gắn với vận hành và thực tiễn",
  },
};

export function initUnitProfile() {
  const mount = document.getElementById("unit-profile-section-content");
  if (!mount) return;

  mount.innerHTML = `
    <section class="tdmu-panel tdmu-unit-profile-panel">
      <div class="tdmu-unit-profile-layout">
        <div class="tdmu-unit-profile-copy">
          <p class="tdmu-unit-profile-kicker">${escapeHtml(unitProfileData.kicker)}</p>
          <p class="tdmu-unit-profile-name">${escapeHtml(unitProfileData.name)}</p>
          <h2 class="tdmu-unit-profile-title">${escapeHtml(unitProfileData.title)}</h2>
          <p class="tdmu-unit-profile-summary">${escapeHtml(unitProfileData.summary)}</p>

          <div class="tdmu-unit-profile-actions">
            <a class="tdmu-unit-profile-cta" href="${escapeHtml(unitProfileData.cta.href)}">
              <span>${escapeHtml(unitProfileData.cta.label)}</span>
              <span class="material-symbols-rounded" aria-hidden="true">arrow_outward</span>
            </a>
          </div>
        </div>

        <div class="tdmu-unit-profile-media">
          <div class="tdmu-unit-profile-stage">
            <figure class="tdmu-unit-profile-photo tdmu-unit-profile-photo--main">
              <img
                src="${escapeHtml(resolveAppUrl(unitProfileData.image.src))}"
                alt="${escapeHtml(unitProfileData.image.alt)}"
                loading="lazy"
              />
            </figure>

            <div class="tdmu-unit-profile-cutout" aria-hidden="true"></div>

            <div class="tdmu-unit-profile-badge">
              <p class="tdmu-unit-profile-badge-label">${escapeHtml(unitProfileData.badge.label)}</p>
              <strong class="tdmu-unit-profile-badge-value">${escapeHtml(unitProfileData.badge.value)}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
