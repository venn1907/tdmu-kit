const desktopQuery = window.matchMedia("(min-width: 1200px)");

export function initHeaderLayout() {
  const header = document.getElementById("mainHeader");
  if (!header) return;

  const shell = header.querySelector(".tdmu-header-shell");
  const searchPanel = header.querySelector("#headerSearchPanel");
  const searchToggle = header.querySelector("[data-search-toggle]");
  const drawer = header.querySelector("#mobileDrawer");
  const drawerToggle = header.querySelector("[data-drawer-toggle]");
  const heroRoot = detectHeroRoot();
  const state = {
    activePanel: null,
    searchOpen: false,
    drawerOpen: false,
    hasHero: Boolean(heroRoot),
  };

  setActiveNav(header);
  bindLanguageSwitch(header);
  bindDesktopPanels(header, state);
  bindSearchPanel(header, state, searchPanel, searchToggle);
  bindMobileDrawer(header, state, drawer, drawerToggle);
  bindDocumentClose(header, state);
  bindViewportState(header, shell, state);

  if (state.hasHero) {
    document.body.classList.add("tdmu-has-hero");
  }
}

function detectHeroRoot() {
  if (document.body?.dataset?.page !== "home") return null;
  return document.querySelector(".tdmu-hero-slider, [data-hero-root]");
}

function setActiveNav(header) {
  const page = document.body?.dataset?.page;
  if (!page) return;

  header.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.nav === page);
  });
}

function bindLanguageSwitch(header) {
  const chips = Array.from(header.querySelectorAll(".tdmu-lang-chip[data-lang]"));
  if (!chips.length) return;

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((otherChip) => {
        const isActive = otherChip === chip;
        otherChip.classList.toggle("is-active", isActive);
        otherChip.setAttribute("aria-pressed", String(isActive));
      });
    });
  });
}

function bindDesktopPanels(header, state) {
  const triggers = Array.from(header.querySelectorAll("[data-panel-trigger]"));

  const closePanels = () => {
    state.activePanel = null;

    triggers.forEach((trigger) => {
      trigger.setAttribute("aria-expanded", "false");
      const panel = header.querySelector(`#panel${capitalize(trigger.dataset.panelTrigger)}`);
      if (panel) panel.hidden = true;
      trigger.parentElement?.classList.remove("is-open");
    });
  };

  const openPanel = (name) => {
    if (!desktopQuery.matches) return;

    const trigger = header.querySelector(`[data-panel-trigger="${name}"]`);
    const panel = header.querySelector(`#panel${capitalize(name)}`);
    if (!trigger || !panel) return;

    closePanels();
    state.activePanel = name;
    trigger.setAttribute("aria-expanded", "true");
    trigger.parentElement?.classList.add("is-open");
    panel.hidden = false;
  };

  triggers.forEach((trigger) => {
    const name = trigger.dataset.panelTrigger;

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      if (!desktopQuery.matches) return;

      if (state.activePanel === name) {
        closePanels();
        return;
      }

      openPanel(name);
    });
  });

  desktopQuery.addEventListener("change", () => {
    closePanels();
  });

  state.closePanels = closePanels;
}

function bindSearchPanel(header, state, panel, toggle) {
  if (!panel || !toggle) return;

  const closeSearch = () => {
    state.searchOpen = false;
    header.classList.remove("is-search-open");
    toggle.setAttribute("aria-expanded", "false");
    panel.hidden = true;
  };

  toggle.addEventListener("click", () => {
    const willOpen = !state.searchOpen;
    if (willOpen && state.closePanels) state.closePanels();

    state.searchOpen = willOpen;
    header.classList.toggle("is-search-open", willOpen);
    toggle.setAttribute("aria-expanded", String(willOpen));
    panel.hidden = !willOpen;

    if (willOpen) {
      panel.querySelector("input")?.focus();
    }
  });

  state.closeSearch = closeSearch;
}

function bindMobileDrawer(header, state, drawer, toggle) {
  if (!drawer || !toggle) return;

  const closeDrawer = () => {
    state.drawerOpen = false;
    header.classList.remove("is-drawer-open");
    document.body.classList.remove("tdmu-no-scroll");
    toggle.setAttribute("aria-expanded", "false");
    drawer.hidden = true;
    header.querySelector(".tdmu-mobile-backdrop")?.setAttribute("hidden", "");
  };

  const openDrawer = () => {
    if (state.closePanels) state.closePanels();
    if (state.closeSearch) state.closeSearch();

    state.drawerOpen = true;
    header.classList.add("is-drawer-open");
    document.body.classList.add("tdmu-no-scroll");
    toggle.setAttribute("aria-expanded", "true");
    drawer.hidden = false;
    header.querySelector(".tdmu-mobile-backdrop")?.removeAttribute("hidden");
  };

  toggle.addEventListener("click", () => {
    if (state.drawerOpen) {
      closeDrawer();
      return;
    }

    openDrawer();
  });

  header.querySelectorAll("[data-drawer-close]").forEach((button) => {
    button.addEventListener("click", closeDrawer);
  });

  header.querySelectorAll("[data-drawer-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const panel = header.querySelector(`#${trigger.dataset.drawerTrigger}`);
      const willOpen = trigger.getAttribute("aria-expanded") !== "true";

      header.querySelectorAll("[data-drawer-trigger]").forEach((otherTrigger) => {
        if (otherTrigger === trigger) return;
        otherTrigger.setAttribute("aria-expanded", "false");
        const otherPanel = header.querySelector(`#${otherTrigger.dataset.drawerTrigger}`);
        if (otherPanel) otherPanel.hidden = true;
      });

      trigger.setAttribute("aria-expanded", String(willOpen));
      if (panel) panel.hidden = !willOpen;
    });
  });

  desktopQuery.addEventListener("change", () => {
    if (desktopQuery.matches) {
      closeDrawer();
    }
  });

  state.closeDrawer = closeDrawer;
}

function bindDocumentClose(header, state) {
  document.addEventListener("click", (event) => {
    if (header.contains(event.target)) return;

    if (state.closePanels) state.closePanels();
    if (state.closeSearch) state.closeSearch();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    if (state.closePanels) state.closePanels();
    if (state.closeSearch) state.closeSearch();
    if (state.closeDrawer) state.closeDrawer();
  });
}

function bindViewportState(header, shell, state) {
  const apply = () => {
    const shellHeight = Math.ceil(shell.getBoundingClientRect().height);
    const headerHeight = Math.ceil(header.getBoundingClientRect().height);
    const stickyThreshold = state.hasHero ? Math.max(28, shellHeight * 0.3) : 10;
    const isSticky = window.scrollY > stickyThreshold;
    const isOverHero = state.hasHero && !isSticky;

    header.classList.toggle("is-sticky", isSticky);
    header.classList.toggle("is-over-hero", isOverHero);
    document.body.style.setProperty("--header-total-height", `${headerHeight}px`);
    document.body.style.setProperty("--header-offset", state.hasHero ? "0px" : `${shellHeight + 14}px`);
  };

  window.addEventListener("scroll", apply, { passive: true });
  window.addEventListener("resize", apply);
  window.addEventListener("load", apply);

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(() => apply());
    observer.observe(header);
    observer.observe(shell);
  }

  apply();
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
