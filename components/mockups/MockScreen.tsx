import type { CSSProperties, ReactNode } from "react";

/**
 * A recreated app screen at a fixed design size (w x h, in design pixels) that
 * scales to whatever width its host gives it. Inside, Tailwind spacing, type
 * and radii are re-pointed at `--mu` (one design pixel), so write the screen
 * as if it were exactly w px wide. Use `calc(var(--mu)*N)` for one-off sizes.
 */
export function MockScreen({
  w,
  h,
  label,
  className,
  screenClassName,
  children,
}: {
  w: number;
  h: number;
  label: string;
  className?: string;
  screenClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mock-host ${className ?? ""}`}>
      <div
        role="group"
        aria-label={label}
        className={`mock ${screenClassName ?? ""}`}
        style={{ "--mock-w": w, "--mock-h": h } as CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}
