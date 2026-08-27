"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { profile } from "@/lib/data";

export function Preloader() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const seen = sessionStorage.getItem("intro-seen");
    if (seen || reduce) {
      setDone(true);
      return;
    }
    window.scrollTo(0, 0);
    const duration = 1700;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem("intro-seen", "1");
        setTimeout(() => {
          window.scrollTo(0, 0);
          setDone(true);
        }, 450);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-void"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.h2
            initial={{ opacity: 0, filter: "blur(12px)", y: 16 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="aurora-text text-glow text-center text-4xl font-bold sm:text-6xl"
          >
            {profile.name}
          </motion.h2>

          <div className="container-x absolute bottom-8 flex items-end justify-between">
            <span className="eyebrow">Loading experience</span>
            <span className="font-mono text-4xl font-medium tabular-nums text-ink sm:text-6xl">
              {String(count).padStart(3, "0")}
              <span className="text-accent">%</span>
            </span>
          </div>

          <div
            className="absolute bottom-0 left-0 h-[2px]"
            style={{
              width: `${count}%`,
              background: "linear-gradient(90deg, var(--aurora-2), var(--aurora-1), var(--aurora-3))",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
