"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Globally respect the user's reduced-motion preference for all motion components. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
