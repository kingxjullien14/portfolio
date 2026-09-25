import { useMemo, type ReactNode } from "react";
import { ArrowRightIcon, ClockIcon } from "@phosphor-icons/react";
import type { Awaiting, Status, Tone } from "./data";
import { STATUS_TONE } from "./data";
import { qrPath } from "./seal";

/* ─── Design tokens (hex from the shipped HSL theme) ────────────────────
   bg #F6F7F9 · ink #0F121A · muted #EDEFF3 · muted-fg #555D6D
   border #DEE1E7 · primary #174CB5 · success #22774F · warning #BF7918
   info #1474A3 · teal #17827D · danger #CF3830                          */

export const T11 = "text-[length:calc(var(--mu)*11)]";
export const T13 = "text-[length:calc(var(--mu)*13)]";
export const T15 = "text-[length:calc(var(--mu)*15)]";

/** Blue-ink tinted elevation, as in the real theme. */
export const E1 = "shadow-[0_1px_2px_rgba(13,18,28,0.05),0_4px_12px_rgba(13,18,28,0.05)]";
export const E2 = "shadow-[0_2px_6px_rgba(13,18,28,0.06),0_12px_26px_rgba(13,18,28,0.09)]";
export const E3 = "shadow-[0_20px_44px_rgba(13,18,28,0.18)]";

export const BRAND_GRADIENT =
  "linear-gradient(135deg, hsl(210 70% 46%) 0%, hsl(225 75% 44%) 52%, hsl(240 65% 48%) 100%)";
export const BRAND_SHADOW =
  "0 1px 2px rgba(28,70,196,0.28), 0 6px 16px -6px rgba(28,70,196,0.6), inset 0 1px 0 rgba(255,255,255,0.22)";

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

export const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-[#EDEFF3] text-[#555D6D] border-[#DEE1E7]",
  success: "bg-[#22774F]/10 text-[#22774F] border-[#22774F]/25",
  info: "bg-[#1474A3]/10 text-[#1474A3] border-[#1474A3]/25",
  warning: "bg-[#BF7918]/10 text-[#BF7918] border-[#BF7918]/25",
  danger: "bg-[#CF3830]/10 text-[#CF3830] border-[#CF3830]/25",
  teal: "bg-[#17827D]/10 text-[#17827D] border-[#17827D]/25",
};

/** Status pill: tonal dot + label (the shipped TradeStatusBadge). */
export function StatusPill({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.25 whitespace-nowrap rounded-full border px-1.75 py-0.5 leading-4 font-medium",
        T11,
        TONE_CLASS[STATUS_TONE[status]],
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current opacity-90" />
      {status}
    </span>
  );
}

const AWAIT_LABEL: Record<Awaiting, string> = {
  you: "Your action",
  supplier: "Awaiting Supplier",
  director: "Awaiting Director",
};

/** Whose-turn chip. Tinted only when the move is the viewer's. */
export function AwaitingChip({ awaiting }: { awaiting: Awaiting }) {
  const mine = awaiting === "you";
  const Icon = mine ? ArrowRightIcon : ClockIcon;
  return (
    <span
      className={cx(
        "inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-full border px-1.5 py-px text-2xs leading-3.5 font-medium",
        mine ? TONE_CLASS.warning : TONE_CLASS.neutral,
      )}
    >
      <Icon aria-hidden="true" weight={mine ? "bold" : "regular"} className="size-2.5" />
      {AWAIT_LABEL[awaiting]}
    </span>
  );
}

export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        "text-2xs leading-3.5 font-semibold uppercase tracking-[0.14em] text-[#555D6D]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** A 68 design-px QR-like block drawn from the seal bytes. */
export function QrBlock({ hex, className }: { hex: string; className?: string }) {
  const d = useMemo(() => qrPath(hex), [hex]);
  return (
    <svg
      viewBox="-1 -1 23 23"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={cx(
        "size-[calc(var(--mu)*68)] shrink-0 rounded-sm border border-[#DEE1E7] bg-white",
        className,
      )}
    >
      <path d={d} fill="#0F121A" />
    </svg>
  );
}

/** Neutral geometric mark for the invented "Trading Panel": a feedstock droplet. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx("relative block size-8 shrink-0 overflow-hidden rounded-lg", className)}
      style={{ background: BRAND_GRADIENT, boxShadow: BRAND_SHADOW }}
    >
      <span className="absolute top-[calc(var(--mu)*10.5)] left-[calc(var(--mu)*9)] size-[calc(var(--mu)*14)] rotate-45 rounded-[0_50%_50%_50%] bg-white" />
      <span className="absolute top-[calc(var(--mu)*16)] left-[calc(var(--mu)*12)] size-[calc(var(--mu)*4)] rounded-full bg-[#1C46C4]/30" />
    </span>
  );
}
