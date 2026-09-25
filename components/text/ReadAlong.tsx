"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

/**
 * Revelo-style read-along: each word brightens from dim to full as the
 * paragraph travels up the viewport. Motion values only, no re-renders.
 */
export function ReadAlong({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.88", "end 0.42"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={`readalong ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 2.2) / words.length)]}>
            {w}
          </Word>
        ))}
      </span>
    </p>
  );
}

function Word({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: string;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <>
      <motion.span className="rw" style={{ opacity }}>
        {children}
      </motion.span>{" "}
    </>
  );
}
