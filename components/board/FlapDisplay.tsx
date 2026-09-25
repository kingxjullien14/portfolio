"use client";

import { useEffect, useRef, useState } from "react";
import { FlapCell, padTo, prefersReducedMotion, seeded } from "@/lib/flap";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

type Props = {
  text: string;
  /** number of cells; defaults to the text length */
  length?: number;
  size?: Size;
  /** per-breakpoint sizing hook: extra class on every cell */
  cellClassName?: string;
  tone?: "ink" | "amber";
  align?: "left" | "right";
  /** "mount": flips in from blank on load. "view": flips in when scrolled into view. "none": static until text changes. */
  intro?: "mount" | "view" | "none";
  /** ms before this display starts its intro */
  delay?: number;
  /** row index, used to offset the cascade on multi-row boards */
  row?: number;
  stepMs?: number;
  className?: string;
  /** hide the screen-reader copy when a parent already labels this */
  decorative?: boolean;
};

export function FlapDisplay({
  text,
  length,
  size = "md",
  cellClassName = "",
  tone = "ink",
  align = "left",
  intro = "none",
  delay = 0,
  row = 0,
  stepMs = 58,
  className = "",
  decorative = false,
}: Props) {
  const len = length ?? text.length;
  // cells are rendered once from the first text; later changes are flipped in
  const [initial] = useState(() => padTo(text, len, align));
  const rootRef = useRef<HTMLSpanElement>(null);
  const cellsRef = useRef<FlapCell[]>([]);
  const seed = useRef(hash(text + row));
  const shown = useRef(text);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>(":scope > .flap-cells > .flap"));
    const reduce = prefersReducedMotion();
    const armed = document.documentElement.classList.contains("motion-ok");
    cellsRef.current = els.map((el, i) => new FlapCell(el, initial[i] ?? " "));
    const cells = cellsRef.current;

    if (intro === "none" || reduce || !armed) {
      cells.forEach((c, i) => c.set(initial[i] ?? " "));
      els.forEach((el) => el.removeAttribute("data-intro"));
      return () => cells.forEach((c) => c.destroy());
    }

    // take the cells over: blank them, then flip in on cue
    cells.forEach((c) => c.set(" "));
    els.forEach((el) => el.removeAttribute("data-intro"));

    const timers: number[] = [];
    const run = () => {
      const rand = seeded(seed.current);
      const target = padTo(text, len, align);
      cells.forEach((c, i) => {
        const jitter = rand() * 60;
        const steps = 3 + Math.floor(rand() * 4);
        timers.push(
          window.setTimeout(() => c.flipTo(target[i] ?? " ", stepMs, steps), delay + row * 70 + i * 20 + jitter),
        );
      });
    };

    let io: IntersectionObserver | null = null;
    if (intro === "mount") {
      run();
    } else {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io?.disconnect();
            run();
          }
        },
        { threshold: 0.6 },
      );
      io.observe(root);
    }

    return () => {
      io?.disconnect();
      timers.forEach(clearTimeout);
      cells.forEach((c) => c.destroy());
    };
    // run once per mount; text changes are handled below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // later text changes flip the board to the new message
  useEffect(() => {
    // the first text is the intro's job; only real changes flip from here
    if (text === shown.current) return;
    shown.current = text;
    const cells = cellsRef.current;
    if (!cells.length) return;
    const target = padTo(text, len, align);
    if (prefersReducedMotion()) {
      cells.forEach((c, i) => c.set(target[i] ?? " "));
      return;
    }
    const rand = seeded(hash(text));
    const timers = cells.map((c, i) =>
      window.setTimeout(() => c.flipTo(target[i] ?? " ", stepMs, 4 + Math.floor(rand() * 6)), i * 26 + rand() * 40),
    );
    return () => timers.forEach(clearTimeout);
  }, [text, len, align, stepMs]);

  return (
    <span ref={rootRef} className={`inline-flex ${className}`}>
      {!decorative && <span className="sr-only">{text}</span>}
      <span aria-hidden className="flap-cells flex" style={{ gap: `calc(var(--cell) * ${gapFor(size)})` }}>
        {Array.from(initial).map((ch, i) => (
          <span
            key={i}
            className={`flap ${cellClassName}`}
            data-size={size === "md" ? undefined : size}
            data-tone={tone === "amber" ? "amber" : undefined}
            data-intro={intro === "none" ? undefined : ""}
          >
            <span className="flap-half flap-top">
              <span className="flap-glyph">{ch}</span>
            </span>
            <span className="flap-half flap-bot">
              <span className="flap-glyph">{ch}</span>
            </span>
            <span className="flap-half flap-top flap-leaf">
              <span className="flap-glyph">{ch}</span>
            </span>
            <span className="flap-half flap-bot flap-leaf">
              <span className="flap-glyph">{ch}</span>
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}

function gapFor(size: Size) {
  return size === "xl" ? 0.16 : size === "lg" ? 0.12 : size === "xs" ? 0.07 : 0.1;
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
