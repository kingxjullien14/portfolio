"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const LINES = [
  "From used cooking oil",
  "to clean-energy feedstock —",
  "I build the platforms",
  "that make it flow.",
];

export function Statement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // flatten to a global word index for staggered progress mapping
  let counter = 0;
  const lines = LINES.map((line) =>
    line.split(" ").map((w) => ({ w, i: counter++ })),
  );
  const total = counter;

  return (
    <section ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden py-24">
        <div className="container-x">
          <p className="eyebrow mb-8">The mission</p>
          <h2 className="max-w-5xl text-3xl font-semibold leading-[1.18] tracking-tight sm:text-5xl lg:text-[4.25rem]">
            {lines.map((line, li) => (
              <span key={li} className="block">
                {line.map(({ w, i }) => (
                  <StatementWord
                    key={i}
                    progress={scrollYProgress}
                    index={i}
                    total={total}
                  >
                    {w}
                  </StatementWord>
                ))}
              </span>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
}

function StatementWord({
  progress,
  index,
  total,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  children: string;
}) {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const span = 1 / total;
  const start = index * span * 0.6;
  const end = Math.min(1, start + span * 2.4);
  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  const y = useTransform(progress, [start, end], [14, 0]);

  return (
    <span className="mr-[0.22em] inline-block">
      <motion.span
        className="inline-block"
        style={reduce ? { opacity: 1 } : { opacity, y }}
      >
        {children}
      </motion.span>
    </span>
  );
}
