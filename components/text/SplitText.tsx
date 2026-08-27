"use client";

import { motion } from "framer-motion";
import { Fragment, type ElementType } from "react";
import { EASE } from "@/lib/motion";

type SplitTextProps = {
  text: string;
  by?: "word" | "char";
  as?: ElementType;
  className?: string;
  /** applied to each animated chunk — e.g. "aurora-text" for gradient words */
  innerClassName?: string;
  stagger?: number;
  delay?: number;
  duration?: number;
  /** clip-mask reveal (chunks rise from behind a mask) — best for single-line text */
  mask?: boolean;
  /** initial blur in px (non-mask mode) */
  blur?: number;
  trigger?: "inView" | "load";
  once?: boolean;
};

/**
 * Revelo-style split-text reveal. Splits into words or characters; each chunk animates
 * independently with an index-based delay (robust through the mask wrappers). `mask` gives
 * a clip reveal; otherwise chunks rise + fade (+ optional blur). Real text stays in the DOM
 * for SEO and is exposed to assistive tech via aria-label.
 */
export function SplitText({
  text,
  by = "word",
  as: Tag = "span",
  className,
  innerClassName,
  stagger = 0.055,
  delay = 0,
  duration = 0.8,
  mask = false,
  blur = 0,
  trigger = "inView",
  once = true,
}: SplitTextProps) {
  const hidden = mask
    ? { y: "110%" }
    : { y: 20, opacity: 0, filter: blur ? `blur(${blur}px)` : "blur(0px)" };
  const show = mask ? { y: "0%" } : { y: 0, opacity: 1, filter: "blur(0px)" };

  const chunks = by === "char" ? Array.from(text) : text.split(" ");

  return (
    <Tag className={className} aria-label={text}>
      <span aria-hidden>
        {chunks.map((chunk, i) => {
          const d = delay + i * stagger;
          const motionProps =
            trigger === "load"
              ? { animate: show }
              : {
                  whileInView: show,
                  viewport: { once, margin: "0px 0px -12% 0px" },
                };
          return (
            <Fragment key={i}>
              <span
                className={
                  mask
                    ? "inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]"
                    : "inline-block"
                }
              >
                <motion.span
                  className={`inline-block will-change-transform ${innerClassName ?? ""}`}
                  initial={hidden}
                  {...motionProps}
                  transition={{ duration, ease: EASE, delay: d }}
                >
                  {chunk === " " ? " " : chunk}
                </motion.span>
              </span>
              {by === "word" && i < chunks.length - 1 ? " " : null}
            </Fragment>
          );
        })}
      </span>
    </Tag>
  );
}
