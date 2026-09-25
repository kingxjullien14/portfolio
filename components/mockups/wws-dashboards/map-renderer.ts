/**
 * Canvas renderer for the Weekly Collection arc map.
 *
 * A pitched camera in the spirit of deck.gl's (camera distance 1.5 viewport
 * heights, looking down at 45 degrees) over a flat Natural Earth basemap. All
 * geometry is worked out in design pixels, so the drawing is identical at any
 * host width: the canvas transform maps design pixels to device pixels.
 *
 * Three layers, as in the real app:
 *   TRAIL   everything collected so far, dim and thin (thicker for more kg)
 *   RECENT  the last few percent of the week redrawn bright
 *   PULSE   a ring expanding from the outlet that was just collected
 *
 * The trail only ever grows while the week plays, so it is drawn
 * incrementally into its own offscreen canvas and each frame only paints what
 * changed on top of it.
 */

import { IDN, MYS, SGP, SX, THA } from "./peninsula";
import { NETWORK, countUpTo, toGeo, type Week } from "./data";

/** Map viewport height in design pixels. The width follows the layout. */
export const MAP_H = 312;

/** How much of the week burns bright behind the playhead (the real app's value). */
export const RECENT = 0.035;
/** How long a pulse ring takes to expand and fade, as a share of the week. */
const PULSE = 0.011;

// TEMP camera override for tuning (removed before shipping).
const CAM = (typeof window !== "undefined" && (window as unknown as { __WWS_CAM?: number[] }).__WWS_CAM) || [45, 102.42, 3.02, 89];
const PITCH = (CAM[0] * Math.PI) / 180;
const SIN = Math.sin(PITCH);
const COS = Math.cos(PITCH);
const DIST = 1.5 * MAP_H;

/** Camera target and scale: the whole peninsula, sitting a little left of centre. */
const LON_C = CAM[1];
const LAT_C = CAM[2];
const SCALE = CAM[3]; // design px per degree of latitude at the target
const [XC, YC] = toGeo(LAT_C, LON_C);
const K = SCALE / SX;

const COLORS = {
  sea: "#0a0d0d",
  neighbour: "#1b1f1f",
  neighbourEdge: "#2c3232",
  land: "#282e2e",
  landEdge: "#465050",
  label: "rgba(150, 162, 158, 0.46)",
  water: "rgba(110, 138, 150, 0.5)",
};

interface ArcGeom {
  /** Projected offsets from the viewport centre, x0 y0 x1 y1 ... */
  trail: Float32Array;
  recent: Float32Array;
  w: number;
  rgb: string;
  /** Outlet position (projected) and the perspective factor there. */
  ox: number;
  oy: number;
  of: number;
}

interface DepotGeom {
  x: number;
  y: number;
  f: number;
  rgb: string;
  r: number;
}

function hexToRgb(hex: string): string {
  const n = Number.parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

/** Ground plane offsets (design px, north up) from projected coastline units. */
function ground(x: number, y: number): [number, number] {
  return [(x - XC) * K, (YC - y) * K];
}

/** Screen offsets from the viewport centre, and the perspective factor. */
function project(X: number, Y: number, Z: number): [number, number, number] {
  const f = DIST / (DIST + Y * SIN - Z * COS);
  return [X * f, -(Y * COS + Z * SIN) * f, f];
}

/**
 * An arc as deck.gl's ArcLayer draws it: a vertical half-ellipse over the
 * straight line from outlet to depot, peaking at `height` times its length.
 */
function arcPoints(sx: number, sy: number, tx: number, ty: number, height: number): Float32Array {
  const len = Math.hypot(tx - sx, ty - sy);
  const segs = Math.max(6, Math.min(26, Math.round(len / 2.4)));
  const out = new Float32Array((segs + 1) * 2);
  for (let i = 0; i <= segs; i++) {
    const r = i / segs;
    const z = Math.sqrt(r * (1 - r)) * len * height;
    const [px, py] = project(sx + (tx - sx) * r, sy + (ty - sy) * r, z);
    out[i * 2] = px;
    out[i * 2 + 1] = py;
  }
  return out;
}

/** Line width from kilograms: square-rooted, floored and capped like the real map. */
function arcWidth(kg: number): number {
  return 0.5 + Math.min(3.4, Math.sqrt(kg) / 7.8);
}

function strokeArc(ctx: CanvasRenderingContext2D, pts: Float32Array) {
  ctx.beginPath();
  ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.stroke();
}

export interface Renderer {
  resize(cssW: number, cssH: number, dpr: number): void;
  setWeek(week: Week): void;
  draw(t: number): void;
  rebuildBase(): void;
  dispose(): void;
}

export function createRenderer(canvas: HTMLCanvasElement): Renderer {
  const ctx = canvas.getContext("2d");
  const base = document.createElement("canvas");
  const trail = document.createElement("canvas");
  const bctx = base.getContext("2d");
  const tctx = trail.getContext("2d");

  let pxW = 0;
  let pxH = 0;
  let scale = 1;
  let designW = 0;
  let week: Week | null = null;
  let arcs: ArcGeom[] = [];
  let trailCount = 0;
  let family = "sans-serif";

  // Depots do not change week to week; their dots are sized per week.
  const depotGround = NETWORK.depots.map((d) => ground(d.x, d.y));
  const outletGround = NETWORK.outlets.map((o) => ground(o.x, o.y));
  let depots: DepotGeom[] = [];

  const toCentre = (c: CanvasRenderingContext2D) => {
    c.setTransform(scale, 0, 0, scale, (designW / 2) * scale, (MAP_H / 2) * scale);
  };

  function traceRing(c: CanvasRenderingContext2D, ring: readonly number[]) {
    for (let i = 0; i < ring.length; i += 2) {
      const [X, Y] = ground(ring[i], ring[i + 1]);
      const [px, py] = project(X, Y, 0);
      if (i === 0) c.moveTo(px, py);
      else c.lineTo(px, py);
    }
    c.closePath();
  }

  function label(c: CanvasRenderingContext2D, text: string, lat: number, lon: number, size: number, color: string, spacing: number, italic = false) {
    const [x, y] = toGeo(lat, lon);
    const [X, Y] = ground(x, y);
    const [px, py] = project(X, Y, 0);
    c.font = `${italic ? "italic " : ""}500 ${size}px ${family}`;
    c.fillStyle = color;
    c.textAlign = "center";
    c.textBaseline = "middle";
    if ("letterSpacing" in c) (c as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${spacing}px`;
    c.fillText(text, px, py);
    if ("letterSpacing" in c) (c as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px";
  }

  function paintBase() {
    if (!bctx || pxW === 0) return;
    bctx.setTransform(1, 0, 0, 1, 0, 0);
    bctx.fillStyle = COLORS.sea;
    bctx.fillRect(0, 0, pxW, pxH);
    toCentre(bctx);
    bctx.lineJoin = "round";

    bctx.beginPath();
    for (const ring of THA) traceRing(bctx, ring);
    for (const ring of IDN) traceRing(bctx, ring);
    bctx.fillStyle = COLORS.neighbour;
    bctx.fill();
    bctx.strokeStyle = COLORS.neighbourEdge;
    bctx.lineWidth = 0.6;
    bctx.stroke();

    bctx.beginPath();
    for (const ring of MYS) traceRing(bctx, ring);
    for (const ring of SGP) traceRing(bctx, ring);
    bctx.fillStyle = COLORS.land;
    bctx.fill();
    bctx.strokeStyle = COLORS.landEdge;
    bctx.lineWidth = 0.7;
    bctx.stroke();

    // The quiet reference labels a dark basemap carries.
    label(bctx, "THAILAND", 6.78, 101.55, 7.5, COLORS.label, 2.2);
    label(bctx, "MALAYSIA", 4.35, 102.28, 7.5, COLORS.label, 2.4);
    label(bctx, "INDONESIA", 0.95, 101.1, 7.5, COLORS.label, 2.2);
    label(bctx, "Strait of Malacca", 3.6, 100.25, 7.5, COLORS.water, 0.3, true);
    label(bctx, "South China Sea", 2.35, 105.35, 7.5, COLORS.water, 0.3, true);

    // Every outlet in the network, faintly: where the oil comes from.
    bctx.fillStyle = "rgba(210, 225, 218, 0.13)";
    for (const [X, Y] of outletGround) {
      const [px, py, f] = project(X, Y, 0);
      bctx.beginPath();
      bctx.ellipse(px, py, 0.75 * f, 0.75 * f * COS, 0, 0, Math.PI * 2);
      bctx.fill();
    }

    // Distance haze toward the horizon, and a soft edge vignette.
    bctx.setTransform(1, 0, 0, 1, 0, 0);
    const haze = bctx.createLinearGradient(0, 0, 0, pxH * 0.42);
    haze.addColorStop(0, "rgba(11, 14, 14, 0.55)");
    haze.addColorStop(1, "rgba(11, 14, 14, 0)");
    bctx.fillStyle = haze;
    bctx.fillRect(0, 0, pxW, pxH);
    const vig = bctx.createRadialGradient(pxW * 0.45, pxH * 0.55, pxH * 0.35, pxW * 0.45, pxH * 0.55, pxW * 0.62);
    vig.addColorStop(0, "rgba(6, 8, 8, 0)");
    vig.addColorStop(1, "rgba(6, 8, 8, 0.5)");
    bctx.fillStyle = vig;
    bctx.fillRect(0, 0, pxW, pxH);
  }

  function clearTrail() {
    if (!tctx) return;
    tctx.setTransform(1, 0, 0, 1, 0, 0);
    tctx.clearRect(0, 0, pxW, pxH);
    trailCount = 0;
  }

  function extendTrail(to: number) {
    if (!tctx || !week) return;
    toCentre(tctx);
    tctx.lineCap = "round";
    tctx.lineJoin = "round";
    for (let i = trailCount; i < to; i++) {
      const a = arcs[i];
      const p = a.trail;
      const n = p.length;
      const g = tctx.createLinearGradient(p[0], p[1], p[n - 2], p[n - 1]);
      g.addColorStop(0, `rgba(${a.rgb}, 0.16)`);
      g.addColorStop(1, `rgba(${a.rgb}, 0.46)`);
      tctx.strokeStyle = g;
      tctx.lineWidth = a.w;
      strokeArc(tctx, p);
    }
    trailCount = to;
  }

  function draw(t: number) {
    if (!ctx || pxW === 0) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, pxW, pxH);
    ctx.drawImage(base, 0, 0);
    if (!week) return;

    const n = countUpTo(week, t);
    if (n < trailCount) clearTrail();
    if (n > trailCount) extendTrail(n);
    ctx.drawImage(trail, 0, 0);

    toCentre(ctx);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // RECENT: bright, additive, with a soft halo so it reads as light.
    const from = countUpTo(week, t - RECENT);
    ctx.globalCompositeOperation = "lighter";
    for (let i = from; i < n; i++) {
      const a = arcs[i];
      const age = (t - week.collections[i].t) / RECENT;
      const fade = age < 0.7 ? 1 : 1 - (age - 0.7) / 0.3 * 0.55;
      const p = a.recent;
      const len = p.length;
      ctx.strokeStyle = `rgba(${a.rgb}, ${0.13 * fade})`;
      ctx.lineWidth = a.w + 3.2;
      strokeArc(ctx, p);
      const g = ctx.createLinearGradient(p[0], p[1], p[len - 2], p[len - 1]);
      g.addColorStop(0, `rgba(${a.rgb}, ${0.62 * fade})`);
      g.addColorStop(1, `rgba(${a.rgb}, ${0.98 * fade})`);
      ctx.strokeStyle = g;
      ctx.lineWidth = a.w + 0.9;
      strokeArc(ctx, p);
    }

    // PULSE: a ring on the ground at the outlet just collected, and a dot
    // that stays lit while its arc is recent.
    const pulseFrom = countUpTo(week, t - PULSE);
    for (let i = from; i < n; i++) {
      const a = arcs[i];
      const age = (t - week.collections[i].t) / RECENT;
      ctx.fillStyle = `rgba(${a.rgb}, ${0.9 - age * 0.55})`;
      ctx.beginPath();
      ctx.ellipse(a.ox, a.oy, 1.5 * a.of, 1.5 * a.of * COS, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.lineWidth = 1.1;
    for (let i = pulseFrom; i < n; i++) {
      const a = arcs[i];
      const p = (t - week.collections[i].t) / PULSE;
      const r = (1.8 + p * 9) * a.of;
      ctx.strokeStyle = `rgba(${a.rgb}, ${0.85 * (1 - p) * (1 - p)})`;
      ctx.beginPath();
      ctx.ellipse(a.ox, a.oy, r, r * COS, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Depots on top: the anchors every arc converges on.
    ctx.globalCompositeOperation = "source-over";
    for (const d of depots) {
      ctx.fillStyle = `rgba(${d.rgb}, 0.18)`;
      ctx.beginPath();
      ctx.ellipse(d.x, d.y, (d.r + 3.2) * d.f, (d.r + 3.2) * d.f * COS, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.lineWidth = 0.9;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.62)";
    for (const d of depots) {
      ctx.fillStyle = `rgba(${d.rgb}, 0.94)`;
      ctx.beginPath();
      ctx.ellipse(d.x, d.y, d.r * d.f, d.r * d.f * COS, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  return {
    resize(cssW, cssH, dpr) {
      if (cssW <= 0 || cssH <= 0) return;
      const mu = cssH / MAP_H;
      designW = cssW / mu;
      scale = mu * dpr;
      pxW = Math.max(1, Math.round(cssW * dpr));
      pxH = Math.max(1, Math.round(cssH * dpr));
      for (const c of [canvas, base, trail]) {
        c.width = pxW;
        c.height = pxH;
      }
      family = getComputedStyle(canvas).fontFamily || "sans-serif";
      paintBase();
      trailCount = 0;
    },
    setWeek(next) {
      week = next;
      const { depots: ds, outlets } = NETWORK;
      arcs = next.collections.map((c) => {
        const [sx, sy] = outletGround[c.outlet];
        const [tx, ty] = depotGround[c.depot];
        const [ox, oy, of] = project(sx, sy, 0);
        return {
          trail: arcPoints(sx, sy, tx, ty, 0.42),
          recent: arcPoints(sx, sy, tx, ty, 0.5),
          w: arcWidth(c.kg),
          rgb: hexToRgb(ds[c.depot].color),
          ox,
          oy,
          of,
        };
      });
      depots = ds.map((d, i) => {
        const [X, Y] = depotGround[i];
        const [x, y, f] = project(X, Y, 0);
        return { x, y, f, rgb: hexToRgb(d.color), r: 2.1 + Math.sqrt(next.depotWeek[i].arcs) * 0.4 };
      });
      void outlets;
      clearTrail();
    },
    draw,
    rebuildBase() {
      family = getComputedStyle(canvas).fontFamily || "sans-serif";
      paintBase();
    },
    dispose() {
      for (const c of [base, trail]) {
        c.width = 0;
        c.height = 0;
      }
    },
  };
}
