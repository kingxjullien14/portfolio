"use client";

import { useEffect, useRef } from "react";
import type { UnitId } from "@/lib/data";
import { stampUnit } from "@/lib/shift-log";

/** Stamps the unit on the visitor's shift log once its screen has been in view. */
export function StampOnView({ id }: { id: UnitId }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const target = ref.current?.parentElement;
    if (!target) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        window.clearTimeout(timer);
        if (e.isIntersecting) {
          // a real look, not a fly-by
          timer = window.setTimeout(() => {
            stampUnit(id);
            io.disconnect();
          }, 900);
        }
      },
      { threshold: 0.45 },
    );
    io.observe(target);
    return () => {
      window.clearTimeout(timer);
      io.disconnect();
    };
  }, [id]);
  return <span ref={ref} hidden />;
}
