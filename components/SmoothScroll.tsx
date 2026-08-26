"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import type { ReactNode } from "react";

/** Smoothly scroll to in-page targets when any <a href="#..."> is clicked. */
function AnchorScroll() {
  const lenis = useLenis();
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const el = document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -90 });
      else el.scrollIntoView({ behavior: "smooth" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);
  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{ lerp: 0.09, duration: 1.2, smoothWheel: true, wheelMultiplier: 1 }}
    >
      <AnchorScroll />
      {children}
    </ReactLenis>
  );
}
