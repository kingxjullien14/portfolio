"use client";

import { ScalesIcon, TrendUpIcon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { useId, useState, type PointerEvent } from "react";
import { METRICS, RANGES, SERIES, formatNumber, formatTick, niceScale, type Metric, type Range } from "./data";
import { FOCUS, cn } from "./ui";

// The plot is drawn in design pixels, so its SVG box is exactly W x H of them.
const W = 496;
const H = 344;
const PAD = { left: 42, right: 8, top: 12, bottom: 26 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;
const BASE = PAD.top + PLOT_H;
// Every dataset is resampled to the same number of points so paths can morph.
const SAMPLES = 180;
const COLOR: Record<Metric, string> = { weight: "#0b8a4d", count: "#1d4ed8" };
const EASE = [0.4, 0, 0.2, 1] as const;

const sign = (x: number) => (x < 0 ? -1 : 1);

/** Tangents of a monotone cubic (same rule as d3.curveMonotoneX, which the real chart uses). */
function tangents(xs: number[], ys: number[]): number[] {
  const n = xs.length;
  const d: number[] = [];
  const h: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    h[i] = xs[i + 1] - xs[i];
    d[i] = (ys[i + 1] - ys[i]) / h[i];
  }
  const m = new Array<number>(n).fill(0);
  for (let i = 1; i < n - 1; i++) {
    const p = (d[i - 1] * h[i] + d[i] * h[i - 1]) / (h[i - 1] + h[i]);
    m[i] = (sign(d[i - 1]) + sign(d[i])) * Math.min(Math.abs(d[i - 1]), Math.abs(d[i]), 0.5 * Math.abs(p)) || 0;
  }
  m[0] = n > 2 ? (3 * d[0] - m[1]) / 2 : d[0];
  m[n - 1] = n > 2 ? (3 * d[n - 2] - m[n - 2]) / 2 : d[0];
  return m;
}

type Geometry = ReturnType<typeof geometry>;

function geometry(values: number[], top: number) {
  const n = values.length;
  const xs = values.map((_, i) => PAD.left + (i / (n - 1)) * PLOT_W);
  const ys = values.map((v) => BASE - (v / top) * PLOT_H);
  const m = tangents(xs, ys);
  const sy: number[] = [];
  let line = "";
  for (let s = 0; s < SAMPLES; s++) {
    const x = PAD.left + (s / (SAMPLES - 1)) * PLOT_W;
    const i = Math.min(n - 2, Math.floor(((x - PAD.left) / PLOT_W) * (n - 1)));
    const h = xs[i + 1] - xs[i];
    const t = (x - xs[i]) / h;
    const u = 1 - t;
    const p0 = ys[i];
    const p3 = ys[i + 1];
    const p1 = p0 + (m[i] * h) / 3;
    const p2 = p3 - (m[i + 1] * h) / 3;
    const y = u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
    sy.push(y);
    line += `${s === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
  }
  const area = `${line}L${(PAD.left + PLOT_W).toFixed(2)},${BASE.toFixed(2)}L${PAD.left.toFixed(2)},${BASE.toFixed(2)}Z`;
  return { xs, ys, sy, line, area };
}

// Tooltip placement: keep the card off the line so it never hides the data it describes.
const TIP = { w: 150, h: 54, gx: 14, gy: 12 };
type Place = { left: boolean; below: boolean };
const PLACES: Place[] = [
  { left: false, below: false },
  { left: true, below: false },
  { left: false, below: true },
  { left: true, below: true },
];

function placeTip(geo: Geometry, i: number): Place | null {
  const ax = geo.xs[i];
  const ay = geo.ys[i];
  for (const p of PLACES) {
    const x0 = p.left ? ax - TIP.gx - TIP.w : ax + TIP.gx;
    const y0 = p.below ? ay + TIP.gy : ay - TIP.gy - TIP.h;
    if (x0 < 0 || x0 + TIP.w > W || y0 < -6 || y0 + TIP.h > BASE) continue;
    const s0 = Math.max(0, Math.floor(((x0 - 4 - PAD.left) / PLOT_W) * (SAMPLES - 1)));
    const s1 = Math.min(SAMPLES - 1, Math.ceil(((x0 + TIP.w + 4 - PAD.left) / PLOT_W) * (SAMPLES - 1)));
    let hi = Infinity;
    let lo = -Infinity;
    for (let s = s0; s <= s1; s++) {
      hi = Math.min(hi, geo.sy[s]);
      lo = Math.max(lo, geo.sy[s]);
    }
    if (p.below ? lo < y0 - 4 : hi > y0 + TIP.h + 4) return p;
  }
  return null;
}

/** The resting highlight: the highest point whose tooltip fits clear of the line. */
function restingPoint(geo: Geometry, values: number[]): number {
  const order = values.map((v, i) => [v, i] as const).sort((a, b) => b[0] - a[0]);
  for (const [, i] of order) if (placeTip(geo, i)) return i;
  return order[0][1];
}

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  small,
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  small?: boolean;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-lg border border-[#E1EAE6] bg-[#F3F7F5] p-0.5">
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.id)}
            className={cn(
              "cursor-pointer rounded-md! font-medium whitespace-nowrap transition-colors duration-150",
              small ? "h-6 px-2 text-[length:calc(var(--mu)*11)]" : "h-7 px-2.5 text-xs",
              on
                ? "bg-white text-[#1A2822] shadow-[0_1px_2px_rgba(20,40,30,0.1),0_0_0_1px_rgba(20,40,30,0.04)]"
                : "text-[#63746D] hover:text-[#1A2822]",
              FOCUS,
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function CollectionsChart() {
  const [range, setRange] = useState<Range>("3m");
  const [metric, setMetric] = useState<Metric>("weight");
  const [hover, setHover] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const gid = `${useId().replace(/[^a-zA-Z0-9_-]/g, "")}-fill`;

  const series = SERIES[range];
  const pts = series.points;
  const values = pts.map((p) => (metric === "weight" ? p.weight : p.count));
  const peakValue = Math.max(...values);
  const { top, ticks } = niceScale(peakValue);
  const geo = geometry(values, top);
  const color = COLOR[metric];
  const peak = values.indexOf(peakValue);
  const ai = Math.min(hover ?? restingPoint(geo, values), pts.length - 1);
  const ax = geo.xs[ai];
  const ay = geo.ys[ai];
  const place = placeTip(geo, ai) ?? { left: ax > W * 0.6, below: ay < PAD.top + TIP.h + TIP.gy };
  const totalKg = pts.reduce((s, p) => s + p.weight, 0);
  const totalCount = pts.reduce((s, p) => s + p.count, 0);
  const morph = { duration: reduce ? 0 : 0.3, ease: EASE };
  // Transitions live in classes (motion-reduce aware) so server and client markup match.
  const follow = cn(
    "transition-transform ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
    hover === null ? "duration-300" : "duration-[90ms]",
  );
  const r2 = (n: number) => Math.round(n * 100) / 100;
  const metricName = metric === "weight" ? "Collected weight" : "Collection count";

  const onMove = (e: PointerEvent<SVGRectElement>) => {
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((x - PAD.left) / PLOT_W) * (pts.length - 1));
    setHover(Math.max(0, Math.min(pts.length - 1, i)));
  };

  return (
    <div className="flex min-h-0 flex-col rounded-xl border border-[#E1EAE6] bg-white p-5 shadow-[0_1px_3px_rgba(20,40,30,0.07),0_1px_2px_rgba(20,40,30,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-base font-semibold leading-6 tracking-[-0.02em]">Total Collections</div>
          <div className="text-[length:calc(var(--mu)*13)] leading-5 text-[#63746D]">{series.caption}</div>
          <div className="flex items-center gap-4 pt-2 text-[length:calc(var(--mu)*13)] font-medium tabular-nums leading-5">
            <span className="flex items-center gap-1.5">
              <ScalesIcon aria-hidden className="size-3.5 text-[#0b8a4d]" />
              {formatNumber(totalKg)} KG
            </span>
            <span className="flex items-center gap-1.5">
              <TrendUpIcon aria-hidden className="size-3.5 text-[#1d4ed8]" />
              {formatNumber(totalCount)} collections
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Segmented
            label="Time range"
            options={RANGES}
            value={range}
            onChange={(v) => {
              setHover(null);
              setRange(v);
            }}
          />
          <Segmented
            label="Metric"
            small
            options={METRICS}
            value={metric}
            onChange={(v) => {
              setHover(null);
              setMetric(v);
            }}
          />
        </div>
      </div>

      <div className="relative mt-4 h-[calc(var(--mu)*344)] w-[calc(var(--mu)*496)]">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block size-full overflow-visible"
          role="img"
          aria-label={`${metricName}, ${series.caption.toLowerCase()}. Peak ${formatNumber(peakValue)}${metric === "weight" ? " KG" : ""} on ${pts[peak].label}.`}
        >
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <motion.stop offset="5%" stopOpacity={0.28} initial={false} animate={{ stopColor: color }} transition={morph} />
              <motion.stop offset="95%" stopOpacity={0} initial={false} animate={{ stopColor: color }} transition={morph} />
            </linearGradient>
          </defs>

          {ticks.map((t) => {
            const y = BASE - (t / top) * PLOT_H;
            return (
              <g key={t}>
                <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="#E3EBE7" strokeDasharray="3 3" />
                <text x={PAD.left - 10} y={y} textAnchor="end" dominantBaseline="central" fontSize="11" fill="#6B7C75" className="tabular-nums">
                  {formatTick(t)}
                </text>
              </g>
            );
          })}

          {pts.map((p, i) =>
            i % series.tickEvery === 0 ? (
              <text key={p.tick} x={geo.xs[i]} y={H - 6} textAnchor="middle" fontSize="11" fill="#6B7C75">
                {p.tick}
              </text>
            ) : null,
          )}

          <motion.path initial={false} animate={{ d: geo.area }} transition={morph} fill={`url(#${gid})`} />
          <motion.path
            initial={false}
            animate={{ d: geo.line, stroke: color }}
            transition={morph}
            fill="none"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {range === "7d"
            ? geo.xs.map((x, i) => (
                <motion.circle
                  key={pts[i].tick}
                  r={3.5}
                  fill="#fff"
                  strokeWidth={2}
                  initial={{ opacity: 0, cx: x, cy: geo.ys[i], stroke: color }}
                  animate={{ opacity: 1, cx: x, cy: geo.ys[i], stroke: color }}
                  transition={{ ...morph, opacity: { duration: reduce ? 0 : 0.18, delay: reduce ? 0 : 0.26 } }}
                />
              ))
            : null}

          <g className={follow} style={{ transform: `translate(${r2(ax)}px, 0px)` }}>
            <line x1={0} x2={0} y1={PAD.top} y2={BASE} stroke="#C4D3CB" strokeDasharray="3 3" />
          </g>
          <g className={follow} style={{ transform: `translate(${r2(ax)}px, ${r2(ay)}px)` }}>
            <circle r={5} fill={color} stroke="#fff" strokeWidth={2} />
          </g>

          <rect
            x={PAD.left}
            y={PAD.top}
            width={PLOT_W}
            height={PLOT_H}
            fill="transparent"
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
          />
        </svg>

        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute transition-[left,top] ease-out motion-reduce:transition-none",
            hover === null ? "duration-300" : "duration-150",
          )}
          style={{ left: `${r2((ax / W) * 100)}%`, top: `${r2((ay / H) * 100)}%` }}
        >
          <div
            className="whitespace-nowrap rounded-lg border border-[#E1EAE6] bg-white px-3 py-2 shadow-[0_calc(var(--mu)*6)_calc(var(--mu)*16)_rgba(20,40,30,0.1),0_1px_2px_rgba(20,40,30,0.06)]"
            style={{
              transform: `translate(${place.left ? "calc(-100% - var(--mu) * 14)" : "calc(var(--mu) * 14)"}, ${
                place.below ? "calc(var(--mu) * 12)" : "calc(-100% - var(--mu) * 12)"
              })`,
            }}
          >
            <div className="mb-1 text-xs font-semibold leading-4 text-[#1A2822]">{pts[ai].label}</div>
            <div className="text-xs leading-4 tabular-nums" style={{ color }}>
              {metric === "weight" ? `Weight : ${formatNumber(values[ai])} KG` : `Collections : ${formatNumber(values[ai])}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
