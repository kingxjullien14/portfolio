"use client";

import { units } from "@/lib/data";
import { clearShiftLog, useShiftLog } from "@/lib/shift-log";

/** Closes the loop on the shift log the board keeps. */
export function ShiftSummary() {
  const log = useShiftLog();
  if (log.length === 0) {
    return <p className="text-[0.9375rem] text-housing-ink opacity-75">Email works best. LinkedIn and GitHub are just below.</p>;
  }
  const all = log.length === units.length;
  return (
    <p className="text-[0.9375rem] text-housing-ink opacity-80">
      {all
        ? "You inspected every unit on the board. Tell me which one you would rebuild."
        : `You inspected ${log.length} of ${units.length} units. Ask me about any of them.`}{" "}
      <button type="button" onClick={clearShiftLog} className="underline decoration-white/25 underline-offset-2 hover:decoration-white/70">
        Clear log
      </button>
    </p>
  );
}
