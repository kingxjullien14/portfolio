"use client";

import { ArrowRight, Check } from "@phosphor-icons/react";
import { profile, units, unitById } from "@/lib/data";
import { clock, useShiftLog } from "@/lib/shift-log";
import { FlapDisplay } from "./FlapDisplay";
import { Lamp } from "./Lamp";

/** The visitor's trail across the board, in the space right of the name. */
function ShiftLogPanel({ log, className = "" }: { log: ReturnType<typeof useShiftLog>; className?: string }) {
  const recent = log.slice(-4);
  return (
    <div className={`w-[calc(var(--cell)*9)] content-start gap-2 rounded-[calc(var(--cell)*0.18)] p-[calc(var(--cell)*0.45)] text-housing-ink shadow-[inset_0_0_0_1px_oklch(1_0_0/0.07)] ${className}`}>
      <div className="flex items-center justify-between">
        <span className="engraved opacity-70">Shift log</span>
        <span className="text-[0.75rem] tnum opacity-70">
          {log.length}/{units.length}
        </span>
      </div>
      {recent.length === 0 ? (
        <p className="text-[0.8125rem] leading-snug opacity-65">Nothing inspected yet. Pick a unit and it gets logged here.</p>
      ) : (
        <ol className="grid gap-1 text-[0.8125rem]">
          {recent.map((e) => (
            <li key={e.id} className="flex items-baseline justify-between gap-3 tnum">
              <span className="font-semibold text-flap-ink">{unitById[e.id]?.name ?? e.id}</span>
              <span className="opacity-60">{clock(e.at)}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/** The hero: a Solari-style board that flips the name in, then lists every unit in service. */
export function DepartureBoard() {
  const log = useShiftLog();
  const seen = new Set(log.map((e) => e.id));

  return (
    <div className="housing board p-[calc(var(--cell)*0.35)] md:p-[calc(var(--cell)*0.5)]">
      <div className="well px-[calc(var(--cell)*0.45)] pb-[calc(var(--cell)*0.5)] pt-[calc(var(--cell)*0.55)] md:px-[calc(var(--cell)*0.7)] md:pt-[calc(var(--cell)*0.65)]">
        <div className="flex items-start justify-between gap-[calc(var(--cell)*1)]">
          <div>
            <h1 className="flex flex-wrap gap-x-[calc(var(--cell)*0.62)] gap-y-[calc(var(--cell)*0.2)]">
              <span className="sr-only">{profile.name}</span>
              <FlapDisplay text={profile.firstName} cellClassName="cell-name" intro="mount" decorative />
              <FlapDisplay text={profile.lastName} cellClassName="cell-name" intro="mount" delay={140} decorative />
            </h1>
            <p className="mt-[calc(var(--cell)*0.28)]">
              <span className="sr-only">{profile.role}</span>
              <FlapDisplay text="FULL-STACK DEVELOPER" cellClassName="cell-role" intro="mount" row={2} delay={120} decorative />
            </p>
          </div>
          <ShiftLogPanel log={log} className="hidden xl:grid" />
        </div>

        <div className="brd-table mt-[calc(var(--cell)*0.8)] md:mt-[calc(var(--cell)*0.85)]">
          <div className="brd-head" aria-hidden>
            <span className="brd-lampcol" />
            <span className="brd-col-14">Unit</span>
            <span className="brd-col-7 max-lg:hidden">Platform</span>
            <span className="brd-col-7 max-md:hidden">Stack</span>
            <span className="brd-col-5">Status</span>
          </div>
          <ul className="grid gap-[calc(var(--cell)*0.1)]">
            {units.map((u, i) => (
              <li key={u.id}>
                <a
                  href={`#${u.id}`}
                  className="brd-row group"
                  aria-label={`${u.name}, ${u.platform.toLowerCase()}, ${u.stack.toLowerCase()}, ${u.status === "LIVE" ? "live" : u.status.toLowerCase()}${seen.has(u.id) ? ", inspected" : ""}`}
                >
                  <span className="brd-lampcol">
                    <Lamp lit className="brd-lamp" />
                  </span>
                  <FlapDisplay className="brd-col-14" text={u.board} length={14} cellClassName="cell-unit" intro="mount" row={3 + i} delay={200} decorative />
                  <FlapDisplay className="brd-col-7 max-lg:hidden" text={u.platform} length={7} cellClassName="cell-unit" intro="mount" row={3 + i} delay={300} decorative />
                  <FlapDisplay className="brd-col-7 max-md:hidden" text={u.stack} length={7} cellClassName="cell-unit" intro="mount" row={3 + i} delay={380} decorative />
                  <FlapDisplay className="brd-col-5" text={u.status} length={5} cellClassName="cell-unit" tone="amber" intro="mount" row={3 + i} delay={460} decorative />
                  <span className="brd-end">
                    {seen.has(u.id) ? <Check weight="bold" className="size-3.5 opacity-70" aria-hidden /> : null}
                    <ArrowRight weight="bold" className="brd-arrow size-4" aria-hidden />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex min-h-[calc(var(--cell)*1.1)] items-center justify-between gap-4 px-[calc(var(--cell)*0.3)] pt-[calc(var(--cell)*0.3)] text-housing-ink xl:hidden">
        <span className="engraved opacity-75">Shift log</span>
        <span className="text-[0.8125rem] tnum opacity-75">
          {log.length} of {units.length} inspected
        </span>
      </div>
    </div>
  );
}
