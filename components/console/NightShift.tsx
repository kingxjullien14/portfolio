"use client";

import { useSyncExternalStore } from "react";

type Shift = "day" | "night";

function read(): Shift {
  return document.documentElement.getAttribute("data-theme") === "night" ? "night" : "day";
}

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

/** A real toggle switch: day shift or night shift, remembered per browser. */
export function NightShift({ className = "" }: { className?: string }) {
  const shift = useSyncExternalStore<Shift>(subscribe, read, () => "day");
  const night = shift === "night";

  function flip() {
    const next: Shift = night ? "day" : "night";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("shift", next);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={night}
      aria-label="Night shift"
      onClick={flip}
      className={`group inline-flex items-center gap-2.5 rounded-md px-1.5 py-1 text-housing-ink ${className}`}
    >
      <span className="engraved hidden sm:inline">Night</span>
      <span className="toggle-track">
        <span className="toggle-knob" />
      </span>
    </button>
  );
}
