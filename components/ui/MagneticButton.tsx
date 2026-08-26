"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";

type Variant = "primary" | "ghost";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  download?: boolean | string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
};

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-tight will-change-transform";

export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  download,
  target,
  rel,
  ariaLabel,
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 200, damping: 15, mass: 0.5 });
  const y = useSpring(my, { stiffness: 200, damping: 15, mass: 0.5 });

  function handleMove(e: ReactPointerEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  }
  function reset() {
    mx.set(0);
    my.set(0);
  }

  const cls = `${base} ${
    variant === "primary" ? "text-white" : "glass text-ink hover:text-white"
  } ${className}`;

  const styleExtra =
    variant === "primary"
      ? {
          background:
            "linear-gradient(120deg, var(--aurora-2), var(--aurora-1) 55%, var(--aurora-3))",
          boxShadow: "0 10px 34px -10px rgba(180,91,207,0.75)",
        }
      : undefined;

  const common = {
    ref: ref as never,
    onPointerMove: handleMove,
    onPointerLeave: reset,
    onClick,
    className: cls,
    style: { x, y, ...styleExtra },
    whileHover: { scale: 1.035 },
    whileTap: { scale: 0.97 },
    "aria-label": ariaLabel,
  } as const;

  if (href) {
    return (
      <motion.a href={href} download={download} target={target} rel={rel} {...common}>
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button type="button" {...common}>
      {children}
    </motion.button>
  );
}
