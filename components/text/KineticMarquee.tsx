"use client";

import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
} from "framer-motion";

/** Auto-scrolling type band that skews with scroll velocity. */
export function KineticMarquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 300 });
  const skew = useTransform(smooth, [-2000, 0, 2000], [-5, 0, 5], {
    clamp: true,
  });

  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{
        maskImage:
          "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
      }}
    >
      <motion.div style={{ skewX: skew }}>
        <div className="marquee-track flex w-max gap-8 whitespace-nowrap">
          {[...items, ...items].map((t, i) => (
            <span
              key={i}
              className="flex items-center gap-8 font-display text-2xl font-medium text-ink-faint sm:text-3xl"
            >
              {t}
              <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
