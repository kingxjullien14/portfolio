"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentType } from "react";
import type { UnitId } from "@/lib/data";

type Spec = {
  w: number;
  h: number;
  /** the app's own ground colour, so the poster reads as its screen */
  bg: string;
  ink: string;
  load: () => Promise<ComponentType<{ className?: string }>>;
};

// Each recreation is its own chunk, fetched only when its bay comes near.
const specs: Record<UnitId, Spec> = {
  "vendor-app": { w: 390, h: 844, bg: "#1A3D5C", ink: "#9fb4c6", load: () => import("./vendor-app/VendorAppMock").then((m) => m.VendorAppMock) },
  "trading-portal": { w: 1180, h: 740, bg: "#f5f6f9", ink: "#8a93a6", load: () => import("./trading-portal/TradingPortalMock").then((m) => m.TradingPortalMock) },
  "vendor-portal": { w: 1180, h: 740, bg: "#f7fcf9", ink: "#86a293", load: () => import("./vendor-portal/VendorPortalMock").then((m) => m.VendorPortalMock) },
  "wws-dashboards": { w: 1180, h: 740, bg: "#101412", ink: "#6f7a73", load: () => import("./wws-dashboards/WwsDashboardsMock").then((m) => m.WwsDashboardsMock) },
  "api-platform": { w: 1000, h: 620, bg: "#f1f2f5", ink: "#9aa0ab", load: () => import("./api-platform/ApiPlatformMock").then((m) => m.ApiPlatformMock) },
  osai: { w: 1200, h: 780, bg: "#0a0d0f", ink: "#5f6368", load: () => import("./osai/OsaiMock").then((m) => m.OsaiMock) },
  "stone-chisel": { w: 1180, h: 740, bg: "#f6f1e7", ink: "#a08f78", load: () => import("./stone-chisel/StoneChiselMock").then((m) => m.StoneChiselMock) },
};

const lazy = Object.fromEntries(
  Object.entries(specs).map(([id, s]) => [id, dynamic(s.load, { ssr: false, loading: () => null })]),
) as Record<UnitId, ComponentType<{ className?: string }>>;

/**
 * Holds a same-sized poster in the app's own colours until the bay is near,
 * then mounts the interactive recreation during idle time. Keeps the hero's
 * hydration light and avoids any layout shift.
 */
export function LazyScreen({ id, name }: { id: UnitId; name: string }) {
  const spec = specs[id];
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    // watch the bay's figure, not the screen itself: the shutter reveal clips
    // the well until it opens, and a clipped target never reports as near
    const el = ref.current?.closest("figure") ?? ref.current;
    if (!el) return;
    const hasIdle = typeof window.requestIdleCallback === "function";
    let idle = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const go = () => setLive(true);
        idle = hasIdle ? window.requestIdleCallback(go, { timeout: 600 }) : window.setTimeout(go, 60);
      },
      { rootMargin: "1400px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, []);

  const Screen = lazy[id];
  return (
    <div ref={ref} className="relative">
      {live ? (
        <Screen />
      ) : (
        <div
          className="grid place-items-center"
          style={{ aspectRatio: `${spec.w} / ${spec.h}`, background: spec.bg, color: spec.ink }}
        >
          <span className="font-ui text-[0.8125rem]">{name}</span>
          <noscript>
            <span className="font-ui text-[0.8125rem]">This recreation is interactive and needs JavaScript.</span>
          </noscript>
        </div>
      )}
    </div>
  );
}
