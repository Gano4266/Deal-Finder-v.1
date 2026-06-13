"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const hiddenClassName = "filterDockHidden";
const mobileQuery = "(max-width: 760px) and (hover: none) and (pointer: coarse)";

function dockShouldStayVisible() {
  const activeElement = document.activeElement;

  return Boolean(
    (activeElement instanceof Element && activeElement.closest(".filterDock")) ||
      document.querySelector(".filterDock .filterDisclosure[open]")
  );
}

export function FilterDockScrollController() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    const media = window.matchMedia(mobileQuery);
    let lastScrollY = window.scrollY;
    let ticking = false;

    const showDock = () => {
      document.documentElement.classList.remove(hiddenClassName);
    };

    const updateDock = () => {
      ticking = false;

      if (!media.matches) {
        showDock();
        lastScrollY = window.scrollY;
        return;
      }

      const currentScrollY = Math.max(window.scrollY, 0);
      const delta = currentScrollY - lastScrollY;

      if (currentScrollY < 140 || dockShouldStayVisible()) {
        showDock();
      } else if (delta > 8) {
        document.documentElement.classList.add(hiddenClassName);
      } else if (delta < -4) {
        showDock();
      }

      lastScrollY = currentScrollY;
    };

    const requestUpdate = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateDock);
        ticking = true;
      }
    };

    const handleFocus = (event: FocusEvent) => {
      if (event.target instanceof Element && event.target.closest(".filterDock")) {
        showDock();
      }
    };

    const handleToggle = (event: Event) => {
      if (event.target instanceof Element && event.target.closest(".filterDock")) {
        showDock();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab" || event.key === "Escape" || event.key === "ArrowUp") {
        showDock();
      }
    };

    showDock();
    lastScrollY = window.scrollY;

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    media.addEventListener("change", showDock);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocus);
    document.addEventListener("toggle", handleToggle, true);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      media.removeEventListener("change", showDock);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("toggle", handleToggle, true);
      showDock();
    };
  }, [pathname, search]);

  return null;
}
