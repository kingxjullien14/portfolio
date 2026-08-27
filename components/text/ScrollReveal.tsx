"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * "Read-along" paragraph — each word brightens from dim to full as it scrolls
 * through the viewport (Revelo-style scroll-progress mode).
 */
export function ScrollReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.5"],
  });

  const words = text.split(" ");
  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => {
        const start = i / words.length;
        const end = Math.min(1, start + 1.6 / words.length);
        return (
          <ScrollWord
            key={i}
            progress={scrollYProgress}
            range={[start, end]}
            reduce={reduce}
          >
            {w}
          </ScrollWord>
        );
      })}
    </p>
  );
}

function ScrollWord({
  progress,
  range,
  reduce,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  reduce: boolean;
  children: string;
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <span aria-hidden className="mr-[0.25em] inline-block">
      <motion.span
        className="inline-block"
        style={reduce ? { opacity: 1 } : { opacity }}
      >
        {children}
      </motion.span>
    </span>
  );
}
