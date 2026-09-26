"use client";

import { ArrowRight, Check } from "@phosphor-icons/react";
import { profile, units } from "@/lib/data";
import { clock, useShiftLog } from "@/lib/shift-log";
import { FlapDisplay } from "./FlapDisplay";
import { Lamp } from "./Lamp";

/** Header of the shift log: how much of the board the visitor has inspected. */
function ShiftLogPanel({ count, className = "" }: { count: number; className?: string }) {
  return (
    <div className={`w-[calc(var(--cell)*8.5)] content-start gap-1.5 rounded-[calc(var(--cell)*0.18)] p-[calc(var(--cell)*0.45)] text-housing-ink shadow-[inset_0_0_0_1px_oklch(1_0_0/0.07)] ${className}`}>
      <div className="flex items-center justify-between">
        <span className="engraved">Shift log</span>
        <span className="text-[0.75rem] tnum">
          {count} of {units.length} logged
        </span>
      </div>
      <p className="text-[0.8125rem] leading-snug">
        Each unit you look at is stamped in the logged column with the time you saw it.
      </p>
    </div>
  );
}

/** The hero: a Solari-style board that flips the name in, then lists every unit in service. */
export function DepartureBoard() {
  const log = useShiftLog();
  const stamp = new Map(log.map((e) => [e.id, clock(e.at)] as const));

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
          <ShiftLogPanel count={log.length} className="hidden xl:grid" />
        </div>

        <div className="brd-table mt-[calc(var(--cell)*0.8)] md:mt-[calc(var(--cell)*0.85)]">
          <div className="brd-head" aria-hidden>
            <span className="brd-lampcol" />
            <span className="brd-col-14">Unit</span>
            <span className="brd-col-7 max-lg:hidden">Platform</span>
            <span className="brd-col-7 max-md:hidden">Stack</span>
            <span className="brd-col-5">Status</span>
            <span className="brd-col-5 max-lg:hidden">Logged</span>
          </div>
          <ul className="grid gap-[calc(var(--cell)*0.1)]">
            {units.map((u, i) => (
              <li key={u.id}>
                <a
                  href={`#${u.id}`}
                  className="brd-row group"
                  aria-label={`${u.name}, ${u.platform.toLowerCase()}, ${u.stack.toLowerCase()}, ${u.status === "LIVE" ? "live" : u.status.toLowerCase()}${stamp.has(u.id) ? `, inspected at ${stamp.get(u.id)}` : ""}`}
                >
                  <span className="brd-lampcol">
                    <span className="brd-lamp-wrap" style={{ "--i": i } as React.CSSProperties}>
                      <Lamp lit className="brd-lamp" />
                    </span>
                  </span>
                  <FlapDisplay className="brd-col-14" text={u.board} length={14} cellClassName="cell-unit" intro="mount" row={3 + i} delay={200} decorative />
                  <FlapDisplay className="brd-col-7 max-lg:hidden" text={u.platform} length={7} cellClassName="cell-unit" intro="mount" row={3 + i} delay={300} decorative />
                  <FlapDisplay className="brd-col-7 max-md:hidden" text={u.stack} length={7} cellClassName="cell-unit" intro="mount" row={3 + i} delay={380} decorative />
                  <FlapDisplay className="brd-col-5" text={u.status} length={5} cellClassName="cell-unit" tone="amber" intro="mount" row={3 + i} delay={460} decorative />
                  <FlapDisplay className="brd-col-5 max-lg:hidden" text={stamp.get(u.id) ?? "--:--"} length={5} cellClassName="cell-unit" intro="mount" row={3 + i} delay={540} decorative />
                  <span className="brd-end">
                    {stamp.has(u.id) ? <Check weight="bold" className="size-3.5 lg:hidden" aria-hidden /> : null}
                    <ArrowRight weight="bold" className="brd-arrow size-4 max-md:hidden" aria-hidden />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex min-h-[calc(var(--cell)*1.1)] items-center justify-between gap-4 px-[calc(var(--cell)*0.3)] pt-[calc(var(--cell)*0.3)] text-housing-ink xl:hidden">
        <span className="engraved">Shift log</span>
        <span className="text-[0.8125rem] tnum">
          {log.length} of {units.length} logged
        </span>
      </div>
    </div>
  );
}
