"use client";

import { useEffect, useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { navLinks, profile } from "@/lib/data";
import { FlapDisplay } from "@/components/board/FlapDisplay";
import { Lamp } from "@/components/board/Lamp";
import { NightShift } from "./NightShift";

/**
 * The console strip: keycaps for each section, an amber LED on the one in
 * view, and a small flap display that flips to name it.
 */
export function ConsoleStrip() {
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const els = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
        const current = navLinks.find((l) => visible.get(l.id));
        setActive(current ? current.id : "");
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const now = navLinks.find((l) => l.id === active)?.board ?? "BOARD";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="console-strip">
        <div className="frame flex h-14 items-center gap-3">
          <a href="#top" className="flex items-center gap-2.5 rounded-md py-1 pr-1 text-housing-ink" aria-label={`${profile.name}, back to the board`}>
            <FlapDisplay text="JN" size="xs" decorative />
            <span className="hidden text-sm font-semibold tracking-tight text-flap-ink xl:inline">{profile.name}</span>
          </a>

          <nav aria-label="Sections" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-1.5">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="navkey" aria-current={active === l.id ? "location" : undefined}>
                    <Lamp lit={active === l.id} size="0.4rem" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-3">
            <div className="hidden items-center gap-2 text-housing-ink lg:flex" aria-hidden>
              <span className="engraved">Now</span>
              <FlapDisplay text={now} length={7} size="xs" decorative />
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md px-1 py-1 text-housing-ink lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="console-menu"
              aria-label={`Sections menu, now showing ${now.toLowerCase()}`}
            >
              <span className="engraved hidden sm:inline">Now</span>
              <FlapDisplay text={now} length={7} size="xs" decorative />
              <CaretDown weight="bold" className={`size-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden />
            </button>
            <span className="mx-1 hidden h-6 w-px bg-white/10 sm:block" aria-hidden />
            <NightShift />
          </div>
        </div>
      </div>

      <div
        id="console-menu"
        className={`console-menu lg:hidden ${open ? "is-open" : ""}`}
        hidden={!open}
      >
        <ul className="frame grid grid-cols-2 gap-2 py-3">
          {navLinks.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} className="navkey w-full justify-start" onClick={() => setOpen(false)} aria-current={active === l.id ? "location" : undefined}>
                <Lamp lit={active === l.id} size="0.4rem" />
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
