import { useId, type ReactNode } from "react";
import type { Tone } from "./data";

export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * Focus ring in the app's own green. The portfolio sets an unlayered
 * :focus-visible outline and radius, so these are marked important; every
 * focusable control also carries an important radius so focus never squares it.
 */
export const FOCUS =
  "focus-visible:outline-2! focus-visible:outline-offset-2! focus-visible:outline-solid! focus-visible:outline-[#2EB860]!";

export const BRAND_GRADIENT = "bg-[linear-gradient(135deg,#a8d65b_0%,#40b47f_48%,#2cb7c2_100%)]";

const BADGE: Record<Tone, string> = {
  success: "border-[#23954D]/25 bg-[#23954D]/12 text-[#23954D]",
  warning: "border-[#D78109]/25 bg-[#D78109]/15 text-[#C47508]",
  info: "border-[#107AC6]/25 bg-[#107AC6]/12 text-[#107AC6]",
  danger: "border-[#EF4343]/25 bg-[#EF4343]/12 text-[#DE3434]",
  secondary: "border-transparent bg-[#EDF2EF] text-[#1A2822]",
  outline: "border-[#E1EAE6] bg-transparent text-[#1A2822]",
};

export function Badge({ tone, children, className }: { tone: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold leading-4",
        BADGE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Invented monogram: a folded "V" on the brand gradient tile. */
export function LogoMark({ className }: { className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a8d65b" />
          <stop offset="0.48" stopColor="#40b47f" />
          <stop offset="1" stopColor="#2cb7c2" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#${id}-g)`} />
      <path d="M9 10.5 16 23l7-12.5" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.2 10.5h5.6" stroke="#fff" strokeOpacity="0.55" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}
