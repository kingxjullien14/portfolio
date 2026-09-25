import type { Icon, IconWeight } from "@phosphor-icons/react";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/** A decorative Phosphor icon, sized by Tailwind so it scales with the screen. */
export function Ico({ icon: C, className, weight = "regular" }: { icon: Icon; className?: string; weight?: IconWeight }) {
  return <C aria-hidden focusable="false" weight={weight} className={className} />;
}

/** Type sizes (design px) that sit between the shared --mu scale steps. */
export const f = {
  s9: "text-3xs",
  s95: "text-[length:calc(var(--mu)*9.5)]",
  s10: "text-2xs",
  s105: "text-[length:calc(var(--mu)*10.5)]",
  s11: "text-[length:calc(var(--mu)*11)]",
  s115: "text-[length:calc(var(--mu)*11.5)]",
  s12: "text-xs",
  s125: "text-[length:calc(var(--mu)*12.5)]",
  s13: "text-[length:calc(var(--mu)*13)]",
  s135: "text-[length:calc(var(--mu)*13.5)]",
  s145: "text-[length:calc(var(--mu)*14.5)]",
  s15: "text-[length:calc(var(--mu)*15)]",
} as const;

/** "0:07" style run clock. */
export function clock(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
