import { useId } from "react";

/**
 * A neutral stand-in for a technician's tank photo: wall, floor, a simple tank
 * silhouette, grain and a vignette, with the camera timestamp burned in.
 */
export function TankPhoto({
  stage,
  kind,
  closeUp,
  stamp,
  small,
}: {
  stage: "before" | "after";
  kind: "itank" | "drum";
  closeUp?: boolean;
  stamp: string;
  small?: boolean;
}) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const dirty = stage === "before";
  const wall = dirty ? ["#D9D3C5", "#BFB7A5"] : ["#DCE2DA", "#C4CCC2"];
  const floor = dirty ? ["#A0977F", "#7F7661"] : ["#A9B1A6", "#8B9489"];
  const body = kind === "drum" ? ["#3F6597", "#5D84B8", "#2F5282"] : ["#58788D", "#7B9AAE", "#46647A"];

  return (
    <div
      className={
        small
          ? "relative h-[calc(var(--mu)*48)] w-[calc(var(--mu)*64)] shrink-0 overflow-hidden rounded-md border border-[#E1EAE6] bg-[#D5DBD3]"
          : "relative h-[calc(var(--mu)*64)] w-[calc(var(--mu)*84)] shrink-0 overflow-hidden rounded-md border border-[#E1EAE6] bg-[#D5DBD3]"
      }
    >
      <svg viewBox="0 0 84 64" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-w`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={wall[0]} />
            <stop offset="1" stopColor={wall[1]} />
          </linearGradient>
          <linearGradient id={`${id}-f`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={floor[0]} />
            <stop offset="1" stopColor={floor[1]} />
          </linearGradient>
          <linearGradient id={`${id}-b`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={body[0]} />
            <stop offset="0.34" stopColor={body[1]} />
            <stop offset="1" stopColor={body[2]} />
          </linearGradient>
          <radialGradient id={`${id}-v`} cx="0.5" cy="0.45" r="0.75">
            <stop offset="0.55" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity={dirty ? 0.34 : 0.24} />
          </radialGradient>
          <filter id={`${id}-n`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed={closeUp ? 7 : 3} />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.16" />
            </feComponentTransfer>
          </filter>
        </defs>

        <rect width="84" height="45" fill={`url(#${id}-w)`} />
        <g stroke="#fff" strokeOpacity="0.2" strokeWidth="0.5">
          <path d="M0 11.5h84M0 23h84M0 34.5h84" />
          <path d="M14 0v11.5M42 0v11.5M70 0v11.5M28 11.5V23M56 11.5V23M14 23v11.5M42 23v11.5M70 23v11.5M28 34.5V45M56 34.5V45" />
        </g>
        <rect y="45" width="84" height="19" fill={`url(#${id}-f)`} />
        <path d="M0 45h84" stroke="#000" strokeOpacity="0.12" strokeWidth="0.6" />

        <g transform={closeUp ? "translate(-24 -15) scale(1.55)" : undefined}>
          <ellipse cx="42" cy="48.6" rx="17" ry="2.4" fill="#000" fillOpacity="0.28" />
          {dirty ? <ellipse cx="51" cy="51.5" rx="10" ry="2" fill="#3C2A10" fillOpacity="0.32" /> : null}
          {kind === "drum" ? (
            <>
              <rect x="31" y="14" width="22" height="34.5" rx="2.2" fill={`url(#${id}-b)`} />
              <ellipse cx="42" cy="14.2" rx="11" ry="2.1" fill="#2B4C79" />
              <g fill="#000" fillOpacity="0.16">
                <rect x="31" y="22.5" width="22" height="1.3" />
                <rect x="31" y="33" width="22" height="1.3" />
                <rect x="31" y="43" width="22" height="1.3" />
              </g>
            </>
          ) : (
            <>
              <rect x="29" y="15" width="26" height="33.5" rx="3.4" fill={`url(#${id}-b)`} />
              <rect x="27.5" y="12" width="29" height="4.6" rx="1.6" fill="#3B5567" />
              <g fill="#000" fillOpacity="0.13">
                <rect x="29" y="24.5" width="26" height="1.3" />
                <rect x="29" y="37" width="26" height="1.3" />
              </g>
              <rect x="36.5" y="28" width="11" height="6" rx="1" fill="#fff" fillOpacity="0.5" />
              <rect x="53.6" y="41" width="5" height="2.6" rx="1" fill="#2C3A44" />
            </>
          )}
          {dirty ? (
            <g fill="#4A3312" fillOpacity="0.4">
              <path d="M33 16.5c.6 3 .2 5.2.9 7.4.4 1.2 1.3 1.1 1.4-.2.2-2.2-.6-4.6-.4-7.2Z" />
              <path d="M45 16.8c.3 2.4.1 3.8.6 5.3.3.8 1 .7 1-.2 0-1.6-.5-3.2-.3-5.1Z" />
              <ellipse cx="38" cy="45.5" rx="7" ry="2.4" />
              <ellipse cx="49" cy="44" rx="4" ry="1.8" />
            </g>
          ) : (
            <rect x={kind === "drum" ? 32.6 : 30.6} y="16.5" width="2.6" height="30" rx="1.3" fill="#fff" fillOpacity="0.28" />
          )}
        </g>

        <rect width="84" height="64" filter={`url(#${id}-n)`} />
        <rect width="84" height="64" fill={`url(#${id}-v)`} />
      </svg>
      {small ? null : (
        <span className="absolute bottom-0.5 right-1 font-mono text-[length:calc(var(--mu)*6.5)] leading-none tracking-[0.02em] text-white/90 [text-shadow:0_0_calc(var(--mu)*2)_rgba(0,0,0,0.6)]">
          {stamp}
        </span>
      )}
    </div>
  );
}
