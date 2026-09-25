"use client";

import { ArrowClockwise, CaretLeft, Clock, MapPin, Ruler, Truck } from "@phosphor-icons/react";
import { memo, useEffect, useId, useRef, useState } from "react";
import { PICKUP, formatDistance } from "./data";
import { tr, type Lang, type StrKey } from "./i18n";
import styles from "./vendor-app.module.css";

/* ---------------------------------------------------------------------------
   Map geometry, in map units (the map viewport is 390 x 734 design px). The
   street grid is drawn unrotated and the whole layer is turned 9 degrees so it
   reads like a real city, not a spreadsheet.
--------------------------------------------------------------------------- */

const ROT = { deg: -9, cx: 195, cy: 360 };
const VX = [-80, 40, 130, 216, 302, 392, 486];
const HY = [-60, 58, 150, 238, 330, 420, 508, 598, 690, 780, 870];
const MAJOR_X = new Set([216]);
const MAJOR_Y = new Set([330, 598]);
const PARK = { i: 1, j: 2 };

const ROUTE: [number, number][] = [
  [302, 120],
  [302, 330],
  [130, 330],
  [130, 470],
];
const YOU: [number, number] = [150, 488];
const SEGMENTS = ROUTE.slice(1).map((p, i) => Math.hypot(p[0] - ROUTE[i][0], p[1] - ROUTE[i][1]));
const ROUTE_LEN = SEGMENTS.reduce((a, b) => a + b, 0);
const ROUTE_D = ROUTE.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");

const r2 = (n: number) => Math.round(n * 100) / 100;

function pointAt(f: number): [number, number] {
  let d = Math.max(0, Math.min(1, f)) * ROUTE_LEN;
  for (let i = 0; i < SEGMENTS.length; i++) {
    if (d <= SEGMENTS[i] || i === SEGMENTS.length - 1) {
      const k = Math.min(1, d / SEGMENTS[i]);
      const [ax, ay] = ROUTE[i];
      const [bx, by] = ROUTE[i + 1];
      return [ax + (bx - ax) * k, ay + (by - ay) * k];
    }
    d -= SEGMENTS[i];
  }
  return ROUTE[ROUTE.length - 1];
}

function rotate([x, y]: [number, number]): [number, number] {
  const a = (ROT.deg * Math.PI) / 180;
  const dx = x - ROT.cx;
  const dy = y - ROT.cy;
  return [r2(ROT.cx + dx * Math.cos(a) - dy * Math.sin(a)), r2(ROT.cy + dx * Math.sin(a) + dy * Math.cos(a))];
}

/** Small seeded PRNG so the building footprints are identical on server and client. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rect = { x: number; y: number; w: number; h: number };

const BLOCKS: Rect[] = [];
const BUILDINGS: Rect[] = [];
let PARK_RECT: Rect = { x: 0, y: 0, w: 0, h: 0 };
{
  const rand = mulberry32(20260925);
  const half = (major: boolean) => (major ? 7 : 3.5);
  for (let i = 0; i < VX.length - 1; i++) {
    for (let j = 0; j < HY.length - 1; j++) {
      const x0 = VX[i] + half(MAJOR_X.has(VX[i])) + 2.5;
      const x1 = VX[i + 1] - half(MAJOR_X.has(VX[i + 1])) - 2.5;
      const y0 = HY[j] + half(MAJOR_Y.has(HY[j])) + 2.5;
      const y1 = HY[j + 1] - half(MAJOR_Y.has(HY[j + 1])) - 2.5;
      const block = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
      if (i === PARK.i && j === PARK.j) {
        PARK_RECT = block;
        continue;
      }
      BLOCKS.push(block);
      // Two rows of 2 to 3 footprints, with a little jitter.
      const cols = rand() > 0.45 ? 3 : 2;
      const inner = { x: x0 + 4, y: y0 + 4, w: block.w - 8, h: block.h - 8 };
      const rowSplit = 0.42 + rand() * 0.16;
      for (let row = 0; row < 2; row++) {
        const ry = row === 0 ? inner.y : inner.y + inner.h * rowSplit + 1.5;
        const rh = row === 0 ? inner.h * rowSplit - 1.5 : inner.h * (1 - rowSplit) - 1.5;
        let cx = inner.x;
        for (let c = 0; c < cols; c++) {
          const share = c === cols - 1 ? inner.x + inner.w - cx : (inner.w / cols) * (0.8 + rand() * 0.4);
          const shrink = rand() * 5;
          BUILDINGS.push({
            x: r2(cx),
            y: r2(ry + (row === 0 ? 0 : shrink)),
            w: r2(Math.max(4, share - 3)),
            h: r2(Math.max(4, rh - shrink)),
          });
          cx += share;
        }
      }
    }
  }
}

const RIVER_D = "M40 780 C140 670 210 590 300 522 S450 420 580 392";

/** Static street layer (CARTO Positron look). Memoised: it never changes. */
const MapBase = memo(function MapBase() {
  const minorX = VX.filter((x) => !MAJOR_X.has(x));
  const minorY = HY.filter((y) => !MAJOR_Y.has(y));
  const labelFont = { fontFamily: "var(--font-ui), system-ui, sans-serif" };
  return (
    <g>
      <rect x={-140} y={-120} width={680} height={1020} fill="#F4F3EF" />
      {BLOCKS.map((b, i) => (
        <rect key={`b${i}`} x={b.x} y={b.y} width={b.w} height={b.h} rx={2.5} fill="#EEEDE8" />
      ))}
      {BUILDINGS.map((b, i) => (
        <rect key={`h${i}`} x={b.x} y={b.y} width={b.w} height={b.h} rx={1} fill="#E6E5DF" />
      ))}
      <rect x={PARK_RECT.x} y={PARK_RECT.y} width={PARK_RECT.w} height={PARK_RECT.h} rx={3} fill="#DCEAD2" />
      <path d={RIVER_D} fill="none" stroke="#CCD9E1" strokeWidth={34} />

      {minorX.map((x) => (
        <line key={`vx${x}`} x1={x} y1={-120} x2={x} y2={900} stroke="#FFFFFF" strokeWidth={7} />
      ))}
      {minorY.map((y) => (
        <line key={`hy${y}`} x1={-140} y1={y} x2={540} y2={y} stroke="#FFFFFF" strokeWidth={7} />
      ))}
      {[...MAJOR_X].map((x) => (
        <line key={`cx${x}`} x1={x} y1={-120} x2={x} y2={900} stroke="#DEDBD2" strokeWidth={14} />
      ))}
      {[...MAJOR_Y].map((y) => (
        <line key={`cy${y}`} x1={-140} y1={y} x2={540} y2={y} stroke="#DEDBD2" strokeWidth={14} />
      ))}
      {[...MAJOR_X].map((x) => (
        <line key={`mx${x}`} x1={x} y1={-120} x2={x} y2={900} stroke="#FFFFFF" strokeWidth={11} />
      ))}
      {[...MAJOR_Y].map((y) => (
        <line key={`my${y}`} x1={-140} y1={y} x2={540} y2={y} stroke="#FFFFFF" strokeWidth={11} />
      ))}

      <g
        style={labelFont}
        fill="#A29F96"
        stroke="#F7F6F2"
        strokeWidth={2.4}
        paintOrder="stroke"
        strokeLinejoin="round"
        dominantBaseline="central"
        textAnchor="middle"
      >
        <text x={352} y={330} fontSize={7.2} fontWeight={600} letterSpacing={0.9}>
          JALAN SERI UTAMA
        </text>
        <text x={216} y={196} fontSize={7.2} fontWeight={600} letterSpacing={0.9} transform="rotate(90 216 196)">
          JALAN KENANGA
        </text>
        <text x={347} y={150} fontSize={6.6}>
          Jalan Melur 2
        </text>
        <text x={40} y={284} fontSize={6.6} transform="rotate(90 40 284)">
          Lorong Cempaka
        </text>
        <text x={259} y={508} fontSize={6.6}>
          Jalan Seri 5
        </text>
        <text x={85} y={189} fontSize={6.8} fontStyle="italic" fill="#6E8A62">
          Taman
        </text>
        <text x={85} y={199} fontSize={6.8} fontStyle="italic" fill="#6E8A62">
          Kenanga
        </text>
      </g>
    </g>
  );
});

/* ---------------------------------------------------------------------------
   Live loop: position fixes arrive every 3.5 s, the marker glides 2 s to each
   (like the app's 2 s glide between polls), the trip restarts every 14 s.
--------------------------------------------------------------------------- */

const LOOP = 14000;
const FIX_EVERY = 3500;
const GLIDE = 2000;
const FADE = 380;
const FIX_F = [0, 0.26, 0.52, 0.78];
const TRIP_M = 1200;

type Sim = { t: number; key: number; fromF: number; toF: number; fixT: number; bonus: number; shownF: number; age: number };

export function TrackScreen({
  lang,
  live,
  reduce,
  onBack,
}: {
  lang: Lang;
  live: boolean;
  reduce: boolean;
  onBack: () => void;
}) {
  const t = (key: StrKey, arg?: string | number) => tr(key, lang, arg);
  const uid = useId().replace(/:/g, "");
  const backRef = useRef<HTMLButtonElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGGElement>(null);
  const sim = useRef<Sim>({ t: 0, key: 0, fromF: 0, toF: 0, fixT: 0, bonus: 12, shownF: 0, age: 12 });
  const [metres, setMetres] = useState(TRIP_M);
  const [age, setAge] = useState(12);
  const [spin, setSpin] = useState(0);
  const running = live && !reduce;

  useEffect(() => {
    backRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const s = sim.current;
      s.t += Math.min(100, now - last);
      last = now;
      const loop = Math.floor(s.t / LOOP);
      const tau = s.t - loop * LOOP;
      const k = Math.floor(tau / FIX_EVERY);
      const key = loop * FIX_F.length + k;
      if (key !== s.key) {
        s.key = key;
        s.fromF = k === 0 ? 0 : s.shownF;
        s.toF = FIX_F[k];
        s.fixT = s.t;
        s.bonus = 0;
        setMetres(TRIP_M * (1 - s.toF));
      }
      const g = Math.min(1, (s.t - s.fixT) / GLIDE);
      const eased = g < 0.5 ? 2 * g * g : 1 - (-2 * g + 2) ** 2 / 2;
      s.shownF = s.fromF + (s.toF - s.fromF) * eased;
      let opacity = 1;
      if (tau > LOOP - FADE) opacity = Math.max(0, (LOOP - tau) / FADE);
      else if (loop > 0 && tau < FADE) opacity = tau / FADE;
      const [x, y] = pointAt(s.shownF);
      markerRef.current?.setAttribute("transform", `translate(${r2(x)} ${r2(y)})`);
      markerRef.current?.setAttribute("opacity", String(r2(opacity)));
      routeRef.current?.setAttribute("stroke-dashoffset", (-s.shownF).toFixed(4));
      routeRef.current?.setAttribute("opacity", String(r2(opacity)));
      const nextAge = Math.floor((s.t - s.fixT) / 1000) + s.bonus;
      if (nextAge !== s.age) {
        s.age = nextAge;
        setAge(nextAge);
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const refresh = () => {
    const s = sim.current;
    if (running) {
      const tau = s.t % LOOP;
      const trueF = Math.min(0.9, (FIX_F[1] * tau) / FIX_EVERY);
      s.fromF = s.shownF;
      s.toF = Math.max(trueF, s.shownF);
      s.fixT = s.t;
      s.bonus = 0;
      setMetres(TRIP_M * (1 - s.toF));
    }
    s.age = 0;
    setAge(0);
    setSpin((n) => n + 1);
  };

  const start = pointAt(0);
  const outlet = rotate(ROUTE[ROUTE.length - 1]);

  return (
    <div className="absolute inset-0 bg-white">
      {/* Map */}
      <div className="absolute inset-x-0 top-27.5 bottom-0 overflow-hidden bg-[#F4F3EF]">
        <svg
          viewBox="0 0 390 734"
          preserveAspectRatio="xMidYMid slice"
          className={`absolute inset-0 size-full ${running ? "" : styles.paused}`}
          aria-hidden
        >
          <defs>
            <filter id={`${uid}-pin`} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="1.2" stdDeviation="1.3" floodColor="#000000" floodOpacity="0.3" />
            </filter>
          </defs>
          <g transform={`rotate(${ROT.deg} ${ROT.cx} ${ROT.cy})`}>
            <MapBase />
            <path
              ref={routeRef}
              d={ROUTE_D}
              pathLength={1}
              fill="none"
              stroke="#059669"
              strokeWidth={4.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1 1"
              strokeDashoffset={0}
            />
            <circle cx={YOU[0]} cy={YOU[1]} r={8} fill="#2563EB" stroke="#FFFFFF" strokeWidth={2.5} />
            <g ref={markerRef} transform={`translate(${start[0]} ${start[1]})`}>
              <circle r={8} fill="#10B981" className={styles.pulse} />
              <circle r={8} fill="#10B981" stroke="#FFFFFF" strokeWidth={2.5} />
            </g>
          </g>
          <MapPin
            weight="fill"
            size={30}
            x={r2(outlet[0] - 15)}
            y={r2(outlet[1] - 28)}
            color="#B45309"
            filter={`url(#${uid}-pin)`}
          />
        </svg>
      </div>

      {/* App bar (white, like the themed AppBar the tracking route pushes) */}
      <div className="absolute inset-x-0 top-0 z-10 h-27.5 bg-white shadow-[0_1px_0_rgba(17,24,39,0.06)]">
        <div className="absolute inset-x-0 top-13.5 flex h-14 items-center">
          <button
            ref={backRef}
            type="button"
            aria-label="Back"
            onClick={onBack}
            className={`ml-1 grid size-12 place-items-center rounded-full`}
          >
            <CaretLeft weight="bold" className="size-5.5 text-[#111827]" />
          </button>
          <div className="pointer-events-none absolute inset-x-16 truncate text-center text-[length:calc(var(--mu)*18)] font-semibold text-[#111827]">
            {t("trackTitle")}
          </div>
        </div>
      </div>

      {/* Status banner */}
      <div className="absolute inset-x-3 top-30.5 z-10 flex items-center gap-3 rounded-2xl bg-[#10B981] px-3.5 py-3 shadow-[0_calc(var(--mu)*1)_calc(var(--mu)*3)_rgba(0,0,0,0.18),0_calc(var(--mu)*2)_calc(var(--mu)*6)_rgba(0,0,0,0.1)]">
        <span className="grid shrink-0 place-items-center rounded-full bg-white/20 p-1.5">
          <Truck weight="fill" className="size-4.5 text-white" />
        </span>
        <div className="text-[length:calc(var(--mu)*14)] leading-[1.3] font-bold text-white">{t("heading")}</div>
      </div>

      {/* Refresh */}
      <button
        type="button"
        aria-label={t("refresh")}
        onClick={refresh}
        className={`absolute right-4 bottom-[calc(var(--mu)*151)] z-10 grid size-10 place-items-center rounded-xl bg-[#10B981] shadow-[0_calc(var(--mu)*3)_calc(var(--mu)*8)_rgba(0,0,0,0.22),0_calc(var(--mu)*1)_calc(var(--mu)*2)_rgba(0,0,0,0.12)] transition-transform duration-150 active:scale-95`}
      >
        <ArrowClockwise key={spin} weight="bold" className={`size-5.5 text-white ${spin ? styles.spin : ""}`} />
      </button>

      {/* Info card */}
      <div className="absolute inset-x-3 bottom-7 z-10 rounded-2xl bg-white p-3.5 shadow-[0_calc(var(--mu)*1)_calc(var(--mu)*3)_rgba(0,0,0,0.16),0_calc(var(--mu)*4)_calc(var(--mu)*14)_rgba(0,0,0,0.08)]">
        <div className="flex flex-wrap gap-x-3.5 gap-y-2">
          <LegendDot color="#2563EB" label={t("yourLocation")} />
          <LegendDot color="#10B981" label={t("collectorLegend")} />
          <LegendDot color="#B45309" label={t("outletLegend")} />
        </div>
        <div className="my-2.5 h-px bg-[#E5E7EB]" />
        <div className="flex items-center">
          <span className="size-2.5 shrink-0 rounded-full bg-[#10B981]" />
          <div className="ml-2 truncate text-[length:calc(var(--mu)*15)] font-bold text-[#111827]">{PICKUP.collector}</div>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          <span className="flex items-center">
            <Ruler className="size-[calc(var(--mu)*15)] text-[#6B7280]" />
            <span className="ml-1 text-[length:calc(var(--mu)*13)] text-[#374151] tabular-nums">
              {t("distanceToOutlet", formatDistance(metres))}
            </span>
          </span>
          <span className="flex items-center">
            <Clock className="size-[calc(var(--mu)*15)] text-[#6B7280]" />
            <span className="ml-1 text-[length:calc(var(--mu)*13)] text-[#374151] tabular-nums">
              {t("updatedAgo", age)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center">
      <span className="size-[calc(var(--mu)*11)] shrink-0 rounded-full" style={{ backgroundColor: color }} />
      <span className="ml-1.5 text-[length:calc(var(--mu)*12)] text-[#374151]">{label}</span>
    </span>
  );
}
