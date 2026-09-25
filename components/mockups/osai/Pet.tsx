"use client";

import s from "./osai.module.css";
import { cx } from "./ui";

const BODY = "M16 58 C16 32 31 19 50 19 C69 19 84 32 84 58 C84 78 69 89 50 89 C31 89 16 78 16 58 Z";
const INK = "#170f33";

/**
 * The glass spirit: a translucent violet-to-cyan blob made of the app's own
 * material, with cyan eyes that blink now and then. It floats on a CSS loop;
 * poking it plays a small hop and a happy face.
 */
export function Pet({
  uid,
  happy,
  hop,
  onPoke,
  className,
}: {
  uid: string;
  happy: boolean;
  hop: number;
  onPoke: () => void;
  className?: string;
}) {
  const id = (n: string) => `${uid}-pet-${n}`;
  return (
    <button
      type="button"
      onClick={onPoke}
      aria-label="Poke the glass spirit"
      className={cx("group size-15 rounded-full", className)}
    >
      <svg
        viewBox="0 0 100 100"
        className="size-full overflow-visible drop-shadow-[0_0_calc(var(--mu)*9)_rgba(160,130,255,0.55)]"
        aria-hidden
        focusable="false"
      >
        <defs>
          <linearGradient id={id("body")} x1="0.15" y1="0.02" x2="0.8" y2="1">
            <stop offset="0" stopColor="#cdb4ff" />
            <stop offset="0.48" stopColor="#9a7cff" />
            <stop offset="1" stopColor="#3de8ff" />
          </linearGradient>
          <radialGradient id={id("gloss")} cx="34%" cy="24%" r="62%">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="0.6" stopColor="#ffffff" stopOpacity="0.04" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={id("core")} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#eafcff" stopOpacity="0.95" />
            <stop offset="0.42" stopColor="#3de8ff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#3de8ff" stopOpacity="0" />
          </radialGradient>
          <clipPath id={id("clip")}>
            <path d={BODY} />
          </clipPath>
        </defs>

        {/* ground shadow stays put while the body floats */}
        <ellipse className={s.petShadow} cx="50" cy="97" rx="19" ry="3.4" fill="#000" />

        <g className={s.petFloat}>
          <g key={hop} className={cx("transition-transform duration-200 group-hover:scale-[1.04]", hop > 0 && s.petHop)} style={{ transformOrigin: "50% 90%", transformBox: "fill-box" }}>
            {/* antenna with a blinking terminal cursor */}
            <path d="M50 20 V12.5" stroke="#8b72e8" strokeWidth="2.6" strokeLinecap="round" />
            <rect className={s.petCursor} x="44.5" y="2" width="11" height="10.5" rx="2.6" fill="#3de8ff" />

            {/* the glass body */}
            <path d={BODY} fill={`url(#${id("body")})`} fillOpacity="0.9" />
            <g clipPath={`url(#${id("clip")})`}>
              <ellipse className={s.petCore} cx="50" cy="70" rx="19" ry="15" fill={`url(#${id("core")})`} />
              <ellipse cx="50" cy="93" rx="40" ry="14" fill={INK} fillOpacity="0.16" />
            </g>
            <path d={BODY} fill={`url(#${id("gloss")})`} />
            <path d={BODY} fill="none" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="1.2" />
            <path d="M24 46 C26 33 36 25 50 24" fill="none" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" />

            {/* cheeks */}
            <ellipse cx="27.5" cy="60" rx="4.6" ry="2.6" fill="#3de8ff" fillOpacity={happy ? 0.6 : 0.3} />
            <ellipse cx="72.5" cy="60" rx="4.6" ry="2.6" fill="#3de8ff" fillOpacity={happy ? 0.6 : 0.3} />

            {/* eyes: cyan light in dark glass */}
            {happy ? (
              <g fill="none" stroke={INK} strokeWidth="3.4" strokeLinecap="round">
                <path d="M31.5 52 Q38 44.5 44.5 52" />
                <path d="M55.5 52 Q62 44.5 68.5 52" />
              </g>
            ) : (
              <g className={s.petEyes}>
                <ellipse cx="38" cy="50" rx="6.6" ry="7.8" fill={INK} fillOpacity="0.92" />
                <ellipse cx="62" cy="50" rx="6.6" ry="7.8" fill={INK} fillOpacity="0.92" />
                <ellipse cx="38.6" cy="51" rx="4.8" ry="5.6" fill="#3de8ff" fillOpacity="0.28" />
                <ellipse cx="62.6" cy="51" rx="4.8" ry="5.6" fill="#3de8ff" fillOpacity="0.28" />
                <ellipse cx="38.6" cy="51.2" rx="3.3" ry="4.1" fill="#3de8ff" />
                <ellipse cx="62.6" cy="51.2" rx="3.3" ry="4.1" fill="#3de8ff" />
                <circle cx="40.2" cy="48.4" r="1.45" fill="#ffffff" />
                <circle cx="64.2" cy="48.4" r="1.45" fill="#ffffff" />
              </g>
            )}

            {/* mouth */}
            <path
              d={happy ? "M44 62 Q50 69 56 62" : "M45.5 63 Q50 66.2 54.5 63"}
              fill={happy ? INK : "none"}
              fillOpacity={happy ? 0.85 : undefined}
              stroke={INK}
              strokeOpacity="0.85"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      </svg>
    </button>
  );
}
