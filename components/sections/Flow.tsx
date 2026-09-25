"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { stations, unitById } from "@/lib/data";
import { Lamp } from "@/components/board/Lamp";
import { SectionHead } from "@/components/ui/SectionHead";

const LAST = stations.length - 1;

/**
 * A mimic panel of the chain the FatHopes systems serve. On desktop the panel
 * pins and oil (amber, the lit state) flows station to station as you scroll.
 */
export function Flow() {
  const track = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const [reached, setReached] = useState(0);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start 64px", "end end"] });
  const eased = useSpring(scrollYProgress, { stiffness: 160, damping: 32, mass: 0.4 });
  // leave a short dwell at both ends of the pin
  const fill = useTransform(eased, [0.06, 0.9], [0, 1], { clamp: true });

  useMotionValueEvent(fill, "change", (v) => {
    const idx = Math.min(LAST, Math.floor(v * LAST + 0.02));
    setReached((r) => (r === idx ? r : idx));
  });

  const allLit = reduce;
  const active = allLit ? LAST : reached;

  return (
    <section id="flow" aria-labelledby="flow-title" className="seam relative">
      <div ref={track} className="flow-track">
        <div className="flow-sticky">
          <div className="frame grid gap-[calc(var(--cell)*1.6)]">
            <SectionHead id="flow-title" title="From kitchen to refinery">
              Used cooking oil passes through five stops on its way to becoming feedstock. I build software for four of
              them, and one API platform runs underneath all four.
            </SectionHead>

            {/* desktop: horizontal mimic panel */}
            <div className="mimic-tiles enamel relative hidden overflow-hidden px-[calc(var(--cell)*1.4)] pb-[calc(var(--cell)*1.2)] pt-[calc(var(--cell)*1.6)] lg:block">
              <div className="relative" style={{ "--n": stations.length } as CSSProperties}>
                {/* main line */}
                <div className="mimic-line" aria-hidden>
                  <motion.div className="mimic-fill" style={{ scaleX: allLit ? 1 : fill }} />
                </div>
                <ol className="relative grid grid-cols-5">
                  {stations.map((s, i) => (
                    <li key={s.id} className="grid justify-items-center gap-[calc(var(--cell)*0.5)] text-center">
                      <span className="mimic-node">
                        <Lamp lit={i <= active} size="calc(var(--cell) * 0.62)" />
                      </span>
                      <span className={`tag transition-opacity duration-300 ${i <= active ? "" : "opacity-60"}`}>{s.label}</span>
                    </li>
                  ))}
                </ol>
                {/* the API bus underneath, with drops to the four stops it serves */}
                <div className="mimic-bus" aria-hidden>
                  {stations.slice(0, 4).map((s, i) => (
                    <span key={s.id} className="mimic-drop" style={{ left: `${10 + i * 20}%` }} data-on={i <= active ? "" : undefined} />
                  ))}
                  <span className="mimic-bus-line" />
                  <span className="engraved absolute -bottom-7 left-[10%] text-ink-3">API platform · Nitro, GraphQL, Prisma</span>
                </div>
              </div>
            </div>

            {/* captions, aligned under each station on desktop */}
            <ol className="flow-captions grid gap-[calc(var(--cell)*0.9)] lg:grid-cols-5 lg:gap-[calc(var(--cell)*0.7)]">
              {stations.map((s, i) => (
                <FlowCaption key={s.id} index={i} active={i === active} reached={i <= active} allLit={allLit} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function FlowCaption({
  index,
  active,
  reached,
  allLit,
}: {
  index: number;
  active: boolean;
  reached: boolean;
  allLit: boolean;
}) {
  const s = stations[index];
  const ref = useRef<HTMLLIElement>(null);
  const [seen, setSeen] = useState(false);

  // phones: each stop lights as it scrolls into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { rootMargin: "0px 0px -35% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const lit = allLit || reached;
  return (
    <li
      ref={ref}
      className={`flow-caption relative grid content-start gap-2 pl-[calc(var(--cell)*1.3)] lg:pl-0 ${active || allLit ? "is-active" : ""}`}
      data-seen={seen || allLit ? "" : undefined}
    >
      <span className="absolute left-0 top-[0.35em] lg:hidden" aria-hidden>
        <Lamp lit={seen || allLit} size="0.7rem" />
      </span>
      <span className="font-semibold text-ink lg:hidden">{s.label}</span>
      <p className={`text-[0.9375rem] leading-relaxed transition-colors duration-300 ${lit ? "text-ink-2" : "text-ink-3"}`}>{s.line}</p>
      {s.units.length ? (
        <p className="flex flex-wrap gap-1.5">
          {s.units.map((id) => (
            <a key={id} href={`#${id}`} className="tag tag-light hover:text-ink">
              {unitById[id].name}
            </a>
          ))}
        </p>
      ) : null}
    </li>
  );
}
