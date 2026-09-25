/**
 * Shared class strings for the WWS Dashboards mock.
 *
 * Written out in full so Tailwind can see them. One-off type sizes are in
 * design pixels through --mu so they scale with the mock.
 */

export const T10_5 = "text-[length:calc(var(--mu)*10.5)]";
export const T11 = "text-[length:calc(var(--mu)*11)]";
export const T11_5 = "text-[length:calc(var(--mu)*11.5)]";
export const T13 = "text-[length:calc(var(--mu)*13)]";
export const T27 = "text-[length:calc(var(--mu)*27)]";
export const T54 = "text-[length:calc(var(--mu)*54)]";

/** Section labels: 10px, semibold, uppercase, widely tracked, muted. */
export const LABEL = "text-2xs font-semibold uppercase tracking-wider text-[#949e97]";

/**
 * The app's green focus ring. The host page styles :focus-visible outside any
 * cascade layer, so these carry `!` to win it back inside the mock; any
 * focusable element also pins its own radius the same way.
 */
export const FOCUS =
  "outline-none focus-visible:outline-2! focus-visible:outline-solid! focus-visible:outline-offset-2! focus-visible:outline-[#2eb860]!";
