"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __bootT?: number;
  }
}

/**
 * Hydration arrived: cancel the boot script's safety timer, then reveal
 * `[data-reveal]` and `.split` elements once as they enter the viewport.
 */
export function Boot() {
  useEffect(() => {
    if (window.__bootT) window.clearTimeout(window.__bootT);
    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal], .split"));
    if (!root.classList.contains("motion-ok")) {
      targets.forEach((el) => el.setAttribute("data-in", ""));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-in", "");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    // whatever is already on screen at load enters now, staggered by its own delay
    const fold = window.innerHeight;
    targets.forEach((el) => {
      if (el.getBoundingClientRect().top < fold) el.setAttribute("data-in", "");
      else io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
