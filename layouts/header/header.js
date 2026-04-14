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
    activeFlyoutTrigger: null,
    searchOpen: false,
    drawerOpen: false,
    hasHero: Boolean(heroRoot),
    desktopFlyout: ensureDesktopFlyoutLayer(header),
    lastScrollY: window.scrollY,
    utilityVisible: true,
  };

  setActiveNav(header);
  bindLanguageSwitch(header);
  bindDesktopPanels(header, state);
  bindMenuTrees(header, state);
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
  const chips = Array.from(
    header.querySelectorAll(".tdmu-lang-chip[data-lang]"),
  );
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
  const navBlock = header.querySelector(".tdmu-nav-block");

  const closePanels = () => {
    state.activePanel = null;

    triggers.forEach((trigger) => {
      const panel = getControlledElement(trigger);
      trigger.setAttribute("aria-expanded", "false");
      trigger.parentElement?.classList.remove("is-open");

      if (panel) {
        panel.hidden = true;
        panel.style.removeProperty("--tdmu-panel-left");
        resetMenuTree(panel);
      }
    });

    hideDesktopFlyout(state);
  };

  const openPanel = (name) => {
    if (!desktopQuery.matches) return;

    const trigger = header.querySelector(`[data-panel-trigger="${name}"]`);
    const panel = getControlledElement(trigger);
    if (!trigger || !panel || !navBlock) return;

    closePanels();
    state.activePanel = name;
    trigger.setAttribute("aria-expanded", "true");
    trigger.parentElement?.classList.add("is-open");
    panel.hidden = false;
    syncDesktopPanelPosition(panel, trigger, navBlock);
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

  const handleDesktopChange = () => {
    closePanels();
  };

  desktopQuery.addEventListener("change", handleDesktopChange);
  window.addEventListener("resize", () => {
    if (!desktopQuery.matches || !state.activePanel) return;
    const trigger = header.querySelector(
      `[data-panel-trigger="${state.activePanel}"]`,
    );
    const panel = getControlledElement(trigger);
    if (!trigger || !panel || panel.hidden || !navBlock) return;
    syncDesktopPanelPosition(panel, trigger, navBlock);
    if (state.activeFlyoutTrigger) {
      showDesktopFlyout(
        state,
        getControlledElement(state.activeFlyoutTrigger),
        state.activeFlyoutTrigger,
      );
    }
  });

  state.closePanels = closePanels;
}

function bindMenuTrees(header, state) {
  header.querySelectorAll("[data-submenu-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const panel = getControlledElement(trigger);
      if (!panel) return;

      const willOpen = trigger.getAttribute("aria-expanded") !== "true";
      closeSiblingSubmenus(trigger, state);
      trigger.setAttribute("aria-expanded", String(willOpen));

      if (shouldUseDesktopFlyout(trigger, panel)) {
        panel.hidden = true;
        if (willOpen) {
          showDesktopFlyout(state, panel, trigger);
        } else {
          hideDesktopFlyout(state);
        }
      } else {
        panel.hidden = !willOpen;
        hideDesktopFlyout(state, trigger);
      }

      if (!willOpen) {
        resetDescendantSubmenus(panel);
      }

      const desktopPanel = trigger.closest(".tdmu-menu-panel");
      if (desktopPanel && !desktopPanel.hidden) {
        requestAnimationFrame(() => {
          const navBlock = header.querySelector(".tdmu-nav-block");
          const topTrigger = header.querySelector(
            `[data-panel-trigger="${desktopPanel.id.replace(/^panel/, "").toLowerCase()}"]`,
          );

          if (navBlock && topTrigger) {
            syncDesktopPanelPosition(desktopPanel, topTrigger, navBlock);
          }
        });
      }
    });
  });
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
    resetMenuTree(drawer);
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
    const currentScrollY = window.scrollY;
    const shellHeight = Math.ceil(shell.getBoundingClientRect().height);
    const headerHeight = Math.ceil(header.getBoundingClientRect().height);
    const stickyThreshold = state.hasHero
      ? Math.max(28, shellHeight * 0.3)
      : 10;
    const isSticky = currentScrollY > stickyThreshold;
    const isOverHero = state.hasHero && !isSticky;
    const scrollDelta = currentScrollY - state.lastScrollY;
    const isAtTop = currentScrollY <= stickyThreshold;
    const isScrollingUp = scrollDelta < -4;
    const isScrollingDown = scrollDelta > 4;

    if (isAtTop || !isSticky) {
      state.utilityVisible = true;
    } else if (isScrollingUp) {
      state.utilityVisible = true;
    } else if (isScrollingDown) {
      state.utilityVisible = false;
    }

    header.classList.toggle("is-sticky", isSticky);
    header.classList.toggle("is-over-hero", isOverHero);
    header.classList.toggle("is-utility-visible", state.utilityVisible);
    document.body.style.setProperty(
      "--header-total-height",
      `${headerHeight}px`,
    );
    document.body.style.setProperty(
      "--header-offset",
      state.hasHero ? "0px" : `${shellHeight + 14}px`,
    );

    state.lastScrollY = currentScrollY;
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

function syncDesktopPanelPosition(panel, trigger, navBlock) {
  const viewportPadding = 12;
  const itemRect =
    trigger.parentElement?.getBoundingClientRect() ||
    trigger.getBoundingClientRect();
  const panelWidth = panel.offsetWidth;
  const overflowRight =
    itemRect.left + panelWidth - (window.innerWidth - viewportPadding);
  const overflowLeft =
    viewportPadding - (itemRect.left - Math.max(0, overflowRight));
  let offset = 0;

  if (overflowRight > 0) {
    offset -= overflowRight;
  }

  if (overflowLeft > 0) {
    offset += overflowLeft;
  }

  panel.style.setProperty("--tdmu-panel-left", `${offset}px`);

  const panelRect = panel.getBoundingClientRect();
  const availableHeight = Math.max(
    220,
    window.innerHeight - panelRect.top - viewportPadding,
  );
  panel.style.maxHeight = `${availableHeight}px`;
}

function closeSiblingSubmenus(trigger, state) {
  const branch = trigger.parentElement;
  const container = branch?.parentElement;
  if (!container) return;

  Array.from(container.children).forEach((sibling) => {
    if (sibling === branch) return;

    const otherTrigger = sibling.querySelector(
      ":scope > [data-submenu-trigger]",
    );
    if (!otherTrigger) return;

    const otherPanel = getControlledElement(otherTrigger);
    otherTrigger.setAttribute("aria-expanded", "false");
    if (otherPanel) {
      otherPanel.hidden = true;
      resetDescendantSubmenus(otherPanel);
    }
  });

  hideDesktopFlyout(state);
}

function resetMenuTree(root) {
  root.querySelectorAll("[data-submenu-trigger]").forEach((trigger) => {
    const panel = getControlledElement(trigger);
    trigger.setAttribute("aria-expanded", "false");
    if (panel) panel.hidden = true;
  });
}

function resetDescendantSubmenus(root) {
  root.querySelectorAll("[data-submenu-trigger]").forEach((trigger) => {
    const panel = getControlledElement(trigger);
    trigger.setAttribute("aria-expanded", "false");
    if (panel) panel.hidden = true;
  });
}

function getControlledElement(trigger) {
  if (!trigger) return null;
  const id =
    trigger.getAttribute("aria-controls") || trigger.dataset.submenuTrigger;
  const panel = id ? document.getElementById(id) : null;
  return panel && document.getElementById("mainHeader")?.contains(panel)
    ? panel
    : null;
}

function shouldUseDesktopFlyout(trigger, panel) {
  return (
    desktopQuery.matches &&
    panel.classList.contains("tdmu-submenu-panel") &&
    panel.parentElement?.parentElement?.classList.contains("tdmu-menu-tree") &&
    trigger.closest(".tdmu-menu-panel")
  );
}

function ensureDesktopFlyoutLayer(header) {
  const existing = header.querySelector("#desktopSubmenuFlyout");
  if (existing) return existing;

  const layer = document.createElement("div");
  layer.id = "desktopSubmenuFlyout";
  layer.className = "tdmu-desktop-flyout";
  layer.hidden = true;
  header.appendChild(layer);
  return layer;
}

function showDesktopFlyout(state, panel, trigger) {
  const layer = state.desktopFlyout;
  const branchRect = trigger.parentElement?.getBoundingClientRect();
  if (!layer || !panel || !branchRect) return;

  layer.innerHTML = panel.innerHTML;
  layer.hidden = false;
  layer.classList.remove("is-left");

  const width = layer.offsetWidth || 360;
  const spaceRight = window.innerWidth - branchRect.right - 16;
  const spaceLeft = branchRect.left - 16;
  const openLeft =
    spaceRight < Math.min(width, 300) && spaceLeft >= Math.min(width, 300);
  const top = Math.max(12, Math.min(branchRect.top, window.innerHeight - 220));
  const left = openLeft
    ? Math.max(16, branchRect.left - width - 12)
    : Math.min(window.innerWidth - width - 16, branchRect.right + 12);

  layer.classList.toggle("is-left", openLeft);
  layer.style.top = `${top}px`;
  layer.style.left = `${left}px`;
  layer.style.maxHeight = `${Math.max(180, window.innerHeight - branchRect.top - 16)}px`;
  state.activeFlyoutTrigger = trigger;
}

function hideDesktopFlyout(state, trigger = null) {
  const layer = state.desktopFlyout;
  if (!layer) return;
  if (
    trigger &&
    state.activeFlyoutTrigger &&
    state.activeFlyoutTrigger !== trigger
  )
    return;

  layer.hidden = true;
  layer.innerHTML = "";
  layer.classList.remove("is-left");
  layer.style.removeProperty("top");
  layer.style.removeProperty("left");
  layer.style.removeProperty("max-height");
  state.activeFlyoutTrigger = null;
}
