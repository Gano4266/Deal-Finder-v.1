"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const scrollStoragePrefix = "forkcast-scroll";

function storageKey(pathname: string, search: string) {
  return `${scrollStoragePrefix}:${pathname}?${search}`;
}

function saveScrollPosition(pathname: string, search: string) {
  try {
    window.sessionStorage.setItem(storageKey(pathname, search), String(Math.round(window.scrollY)));
  } catch {
    // Best-effort browser comfort; storage can be unavailable in private contexts.
  }
}

function restoreScrollPosition(pathname: string, search: string) {
  try {
    const savedPosition = window.sessionStorage.getItem(storageKey(pathname, search));

    if (savedPosition === null) {
      return false;
    }

    const top = Number(savedPosition);

    if (!Number.isFinite(top)) {
      return false;
    }

    window.scrollTo({ top, left: 0, behavior: "auto" });
    return true;
  } catch {
    return false;
  }
}

export function QueryScrollRestorer() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const previous = useRef<{ pathname: string; search: string } | undefined>(undefined);
  const isPopNavigation = useRef(false);
  const suppressScrollSave = useRef(false);

  useEffect(() => {
    const handlePopState = () => {
      isPopNavigation.current = true;
      suppressScrollSave.current = true;
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      const link = target instanceof Element ? target.closest("a[href]") : null;

      if (!(link instanceof HTMLAnchorElement)) {
        return;
      }

      const destination = new URL(link.href, window.location.href);

      if (destination.origin !== window.location.origin) {
        return;
      }

      if (destination.pathname !== pathname || destination.search.slice(1) !== search) {
        saveScrollPosition(pathname, search);
        suppressScrollSave.current = true;
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [pathname, search]);

  useEffect(() => {
    let ticking = false;

    const requestSave = () => {
      if (suppressScrollSave.current) {
        return;
      }

      if (!ticking) {
        window.requestAnimationFrame(() => {
          ticking = false;
          if (!suppressScrollSave.current) {
            saveScrollPosition(pathname, search);
          }
        });
        ticking = true;
      }
    };
    const handlePageHide = () => {
      saveScrollPosition(pathname, search);
    };

    window.addEventListener("scroll", requestSave, { passive: true });
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("scroll", requestSave);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [pathname, search]);

  useEffect(() => {
    const previousValue = previous.current;
    const shouldRestoreScroll = isPopNavigation.current;

    previous.current = { pathname, search };
    isPopNavigation.current = false;
    suppressScrollSave.current = false;

    if (shouldRestoreScroll) {
      window.requestAnimationFrame(() => {
        restoreScrollPosition(pathname, search);
      });
      return;
    }

    if (previousValue && previousValue.pathname === pathname && previousValue.search !== search) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      saveScrollPosition(pathname, search);
    }
  }, [pathname, search]);

  return null;
}
