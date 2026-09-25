"use client";

import { useMemo, useState } from "react";
import { alsoUsed, racks, units, type UnitId } from "@/lib/data";
import { Lamp } from "@/components/board/Lamp";
import { SectionHead } from "@/components/ui/SectionHead";

type Focus = { kind: "jack"; name: string } | { kind: "unit"; id: UnitId } | null;

const jackIndex = new Map(racks.flatMap((r) => r.jacks.map((j) => [j.name, j] as const)));

/**
 * A patch bay of the stack. Every jack is wired to the units that really use
 * it (taken from their dependency lists); touch one and those lamps light.
 */
export function Toolkit() {
  const [hover, setHover] = useState<Focus>(null);
  const [pinned, setPinned] = useState<Focus>(null);
  const focus = hover ?? pinned;

  const litUnits = useMemo(() => {
    if (!focus) return new Set<UnitId>();
    if (focus.kind === "unit") return new Set<UnitId>([focus.id]);
    return new Set<UnitId>(jackIndex.get(focus.name)?.units ?? []);
  }, [focus]);

  const litJacks = useMemo(() => {
    if (!focus) return new Set<string>();
    if (focus.kind === "jack") return new Set([focus.name]);
    return new Set(racks.flatMap((r) => r.jacks.filter((j) => j.units.includes(focus.id)).map((j) => j.name)));
  }, [focus]);

  const status = !focus
    ? "Touch a jack to see where it is used."
    : focus.kind === "jack"
      ? `${focus.name}: ${litUnits.size} ${litUnits.size === 1 ? "unit" : "units"}`
      : `${units.find((u) => u.id === focus.id)?.name}: ${litJacks.size} jacks`;

  const same = (a: Focus, b: Focus) =>
    !!a && !!b && a.kind === b.kind && (a.kind === "jack" ? a.name === (b as { name: string }).name : a.id === (b as { id: UnitId }).id);

  return (
    <section id="skills" className="seam section-pad" aria-labelledby="skills-title">
      <div className="frame">
        <SectionHead id="skills-title" title="What each system runs on">
          A patch bay of the stack. Every jack is wired to the units that genuinely use it, straight from their
          dependency lists.
        </SectionHead>

        <div className="mt-[calc(var(--cell)*2)] grid gap-[calc(var(--cell)*0.8)] lg:grid-cols-[1fr_calc(var(--cell)*9.5)]">
          <div className="housing p-[calc(var(--cell)*0.35)]" onMouseLeave={() => setHover(null)}>
            <div className="well grid divide-y divide-white/[0.06] px-[calc(var(--cell)*0.5)] py-[calc(var(--cell)*0.2)]">
              {racks.map((rack) => (
                <div key={rack.label} className="grid gap-3 py-[calc(var(--cell)*0.5)] md:grid-cols-[calc(var(--cell)*3.4)_1fr] md:items-center">
                  <span className="tag w-max">{rack.label}</span>
                  <ul className="flex flex-wrap gap-x-[calc(var(--cell)*0.35)] gap-y-2">
                    {rack.jacks.map((j) => {
                      const on = litJacks.has(j.name);
                      const isPinned = pinned?.kind === "jack" && pinned.name === j.name;
                      return (
                        <li key={j.name}>
                          <button
                            type="button"
                            className="jack"
                            data-on={on ? "" : undefined}
                            aria-pressed={isPinned}
                            onMouseEnter={() => setHover({ kind: "jack", name: j.name })}
                            onFocus={() => setHover({ kind: "jack", name: j.name })}
                            onBlur={() => setHover(null)}
                            onClick={() => setPinned((p) => (same(p, { kind: "jack", name: j.name }) ? null : { kind: "jack", name: j.name }))}
                          >
                            <span className="jack-socket" aria-hidden />
                            {j.name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <aside className="enamel grid content-start gap-3 p-[calc(var(--cell)*0.7)]" aria-label="Units lit by the selected jack">
            <p className="engraved text-ink-3">Units</p>
            <ul className="grid gap-1" onMouseLeave={() => setHover(null)}>
              {units.map((u) => (
                <li key={u.id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-[0.9375rem] text-ink-2 transition-colors hover:bg-sunk hover:text-ink"
                    aria-pressed={pinned?.kind === "unit" && pinned.id === u.id}
                    onMouseEnter={() => setHover({ kind: "unit", id: u.id })}
                    onFocus={() => setHover({ kind: "unit", id: u.id })}
                    onBlur={() => setHover(null)}
                    onClick={() => setPinned((p) => (same(p, { kind: "unit", id: u.id }) ? null : { kind: "unit", id: u.id }))}
                  >
                    <Lamp lit={litUnits.has(u.id)} size="0.6rem" />
                    <span className={litUnits.has(u.id) ? "font-semibold text-ink" : ""}>{u.name}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="min-h-[2.8em] border-t border-line pt-3 text-[0.875rem] text-ink-3" aria-live="polite">
              {status}
            </p>
          </aside>
        </div>

        <p className="mt-[calc(var(--cell)*0.9)] max-w-[70ch] text-[0.9375rem] text-ink-3" data-reveal="rise">
          Also in regular use: {alsoUsed.join(", ")}.
        </p>
      </div>
    </section>
  );
}
