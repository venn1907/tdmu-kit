import { escapeHtml } from "../../js/core/dom.js";

const faqData = {
  kicker: "Câu hỏi thường gặp",
  items: [
    {
      question:
        "Làm thế nào để cập nhật tin tức hoặc thông báo lên website đơn vị?",
      answer:
        "Đơn vị có thể chuẩn bị nội dung theo mẫu biên tập chung, sau đó gửi đầu mối quản trị hoặc tích hợp trực tiếp vào luồng vận hành nội bộ khi triển khai thực tế.",
    },
    {
      question:
        "Section này có dùng được cho khoa, viện, phòng ban khác không?",
      answer:
        "Có. Cấu trúc FAQ được thiết kế theo hướng tái sử dụng, chỉ cần thay đổi câu hỏi, câu trả lời và nhóm nội dung mà không phải sửa lại layout.",
    },
    {
      question:
        "Có thể nhóm câu hỏi theo học vụ, tuyển sinh hoặc liên hệ không?",
      answer:
        "Có thể. Khi áp dụng thực tế, FAQ có thể chia theo nhóm chủ đề để người dùng tìm nhanh hơn trên desktop lẫn mobile.",
    },
    {
      question: "Nếu câu trả lời dài thì có ảnh hưởng đến giao diện không?",
      answer:
        "Accordion được tối ưu để mở theo từng mục, nên nội dung dài vẫn gọn trên trang và không làm section mất nhịp trình bày tổng thể.",
    },
  ],
};

function buildFaqItem(item, index) {
  const panelId = `tdmuFaqPanel${index + 1}`;
  const buttonId = `tdmuFaqButton${index + 1}`;
  const isOpen = index === 0;

  return `
    <article class="tdmu-faq-item${isOpen ? " is-open" : ""}">
      <button
        id="${buttonId}"
        class="tdmu-faq-question"
        type="button"
        aria-expanded="${isOpen ? "true" : "false"}"
        aria-controls="${panelId}"
      >
        <span>${escapeHtml(item.question)}</span>
        <span class="material-symbols-rounded" aria-hidden="true">add</span>
      </button>
      <div
        id="${panelId}"
        class="tdmu-faq-answer-wrap"
        role="region"
        aria-labelledby="${buttonId}"
      >
        <div class="tdmu-faq-answer">
          <p>${escapeHtml(item.answer)}</p>
        </div>
      </div>
    </article>
  `;
}

export function initFaqSection() {
  const mount = document.getElementById("faq-section-content");
  if (!mount) return;

  mount.innerHTML = `
    <section class="tdmu-panel tdmu-faq-panel">
      <div class="tdmu-faq-layout">
        <div class="tdmu-faq-copy">
          <p class="tdmu-faq-kicker">${escapeHtml(faqData.kicker)}</p>
        </div>

        <div class="tdmu-faq-list">
          ${faqData.items.map(buildFaqItem).join("")}
        </div>
      </div>
    </section>
  `;

  mount.querySelectorAll(".tdmu-faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".tdmu-faq-item");
      if (!item) return;

      const willOpen = button.getAttribute("aria-expanded") !== "true";

      mount.querySelectorAll(".tdmu-faq-item").forEach((otherItem) => {
        if (otherItem === item) return;
        closeFaqItem(otherItem);
      });

      if (willOpen) {
        openFaqItem(item);
      } else {
        closeFaqItem(item);
      }
    });
  });

  mount.querySelectorAll(".tdmu-faq-item").forEach((item) => {
    const panel = item.querySelector(".tdmu-faq-answer-wrap");
    if (!panel) return;

    if (item.classList.contains("is-open")) {
      panel.style.height = "auto";
      panel.style.opacity = "1";
      return;
    }

    panel.style.height = "0px";
    panel.style.opacity = "0";
  });
}

function openFaqItem(item) {
  const button = item.querySelector(".tdmu-faq-question");
  const panel = item.querySelector(".tdmu-faq-answer-wrap");
  if (!button || !panel) return;

  item.classList.add("is-open");
  button.setAttribute("aria-expanded", "true");

  panel.style.height = "0px";
  panel.style.opacity = "0";

  requestAnimationFrame(() => {
    panel.style.height = `${panel.scrollHeight}px`;
    panel.style.opacity = "1";
  });

  const handleExpandEnd = (event) => {
    if (event.propertyName !== "height") return;
    panel.style.height = "auto";
    panel.removeEventListener("transitionend", handleExpandEnd);
  };

  panel.addEventListener("transitionend", handleExpandEnd);
}

function closeFaqItem(item) {
  const button = item.querySelector(".tdmu-faq-question");
  const panel = item.querySelector(".tdmu-faq-answer-wrap");
  if (!button || !panel) return;

  item.classList.remove("is-open");
  button.setAttribute("aria-expanded", "false");

  panel.style.height = `${panel.scrollHeight}px`;
  panel.style.opacity = "1";

  requestAnimationFrame(() => {
    panel.style.height = "0px";
    panel.style.opacity = "0";
  });
}
