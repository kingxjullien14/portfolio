"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/** Custom energy cursor: a bright core + a lagging aurora ring that reacts to hover. */
export function Cursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 30, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 30, mass: 0.6 });

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.body.classList.add("custom-cursor-active");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null;
      setHovering(!!el?.closest("a, button, [data-cursor='hover']"));
    };
    const dn = () => setDown(true);
    const up = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", dn);
    window.addEventListener("pointerup", up);
    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", dn);
      window.removeEventListener("pointerup", up);
    };
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* core */}
      <motion.div
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[70]"
      >
        <div className="-translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ scale: down ? 0.6 : 1 }}
            transition={{ duration: 0.15 }}
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: "#c978e8",
              boxShadow: "0 0 12px rgba(201,120,232,0.9)",
            }}
          />
        </div>
      </motion.div>

      {/* ring */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="pointer-events-none fixed left-0 top-0 z-[69]"
      >
        <div className="-translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ scale: hovering ? 1.9 : 1, opacity: hovering ? 0.9 : 0.45 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="h-9 w-9 rounded-full border"
            style={{ borderColor: "rgba(180,91,207,0.85)" }}
          />
        </div>
      </motion.div>
    </>
  );
}
