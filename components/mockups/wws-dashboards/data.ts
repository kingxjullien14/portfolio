/**
 * Synthetic data for the WWS Dashboards mock.
 *
 * Everything here is invented: depot codes, outlets, volumes and targets. The
 * only real inputs are geography (city and town coordinates, and the Natural
 * Earth coastline used to keep outlets on land).
 *
 * Determinism matters because the KPIs render on the server and hydrate on
 * the client. Generation therefore uses a seeded PRNG and only arithmetic
 * that IEEE 754 defines exactly (+, -, *, /, sqrt, imul): no Math.random, no
 * clock, no trig or log whose last bit may differ between engines.
 */

import { KX, LAT1, LON0, MYS, SX } from "./peninsula";

/* ------------------------------------------------------------------ */
/* Palette (the app's dark-mode viz tokens)                            */
/* ------------------------------------------------------------------ */

export const SERIES = [
  "#3987e5",
  "#d95926",
  "#199e70",
  "#c98500",
  "#d55181",
  "#008300",
  "#9085e9",
  "#e66767",
] as const;

/** Depots past the eighth slot go neutral rather than inventing a ninth hue. */
export const NEUTRAL = "#7890b4";
export const MAX_COLOURED_DEPOTS = SERIES.length;

/* ------------------------------------------------------------------ */
/* PRNG and helpers                                                    */
/* ------------------------------------------------------------------ */

export function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Roughly N(0, 1) from four uniforms (Irwin-Hall), no log or trig needed. */
function gauss(r: () => number): number {
  return (r() + r() + r() + r() - 2) * 1.7320508075688772;
}

/** Longitude/latitude into the coastline's projected units. */
export function toGeo(lat: number, lon: number): [number, number] {
  return [(lon - LON0) * KX * SX, (LAT1 - lat) * SX];
}

function inRing(x: number, y: number, ring: readonly number[]): boolean {
  let inside = false;
  const n = ring.length;
  for (let i = 0, j = n - 2; i < n; j = i, i += 2) {
    const xi = ring[i];
    const yi = ring[i + 1];
    const xj = ring[j];
    const yj = ring[j + 1];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** On Malaysian land (the peninsula or one of its islands). */
export function onLand(x: number, y: number): boolean {
  for (const ring of MYS) if (inRing(x, y, ring)) return true;
  return false;
}

/* ------------------------------------------------------------------ */
/* The network: depots and the towns their outlets sit in              */
/* ------------------------------------------------------------------ */

/** [lat, lon, weight, spread in km] */
type Town = readonly [number, number, number, number];

interface DepotSeed {
  code: string;
  lat: number;
  lon: number;
  outlets: number;
  itankShare: number;
  towns: readonly Town[];
}

const DEPOT_SEEDS: readonly DepotSeed[] = [
  {
    code: "AS-1", lat: 6.12, lon: 100.37, outlets: 24, itankShare: 0.1,
    towns: [
      [6.124, 100.368, 2.4, 5], [6.268, 100.422, 0.9, 4], [6.441, 100.199, 0.8, 4], [5.994, 100.477, 0.5, 4],
      [5.82, 100.47, 0.5, 4], [5.68, 100.92, 0.3, 5], [6.35, 99.8, 0.25, 3],
    ],
  },
  {
    code: "BW-1", lat: 5.4, lon: 100.42, outlets: 44, itankShare: 0.14,
    towns: [
      [5.399, 100.38, 1.8, 4], [5.414, 100.329, 2.2, 2.6], [5.295, 100.259, 1.2, 2.6], [5.363, 100.467, 1.2, 4],
      [5.647, 100.488, 1.0, 4.5], [5.365, 100.562, 0.6, 4], [5.13, 100.49, 0.5, 4], [5.53, 100.43, 0.4, 4],
    ],
  },
  {
    code: "IP-1", lat: 4.6, lon: 101.09, outlets: 36, itankShare: 0.12,
    towns: [
      [4.598, 101.09, 2.6, 5], [4.85, 100.733, 1.0, 4], [4.026, 101.021, 0.8, 4], [4.3, 101.15, 0.6, 4],
      [4.217, 100.7, 0.7, 4.5], [4.47, 101.04, 0.5, 4], [4.77, 100.94, 0.5, 4], [4.11, 101.29, 0.4, 4],
      [5.43, 101.13, 0.2, 4],
    ],
  },
  {
    code: "JB-1", lat: 1.49, lon: 103.74, outlets: 52, itankShare: 0.16,
    towns: [
      [1.475, 103.757, 2.6, 4.5], [1.537, 103.657, 1.4, 4], [1.47, 103.9, 1.0, 4], [1.662, 103.6, 1.0, 4],
      [1.43, 103.635, 1.0, 3.5], [1.738, 103.899, 0.5, 5], [1.85, 102.933, 0.7, 5], [2.03, 103.318, 0.6, 5],
      [1.487, 103.389, 0.4, 5], [2.43, 103.836, 0.4, 4], [2.51, 102.82, 0.4, 5],
    ],
  },
  {
    code: "KB-1", lat: 6.13, lon: 102.24, outlets: 22, itankShare: 0.08,
    towns: [
      [6.125, 102.238, 2.6, 5], [6.049, 102.14, 0.8, 4], [6.198, 102.171, 0.6, 3], [6.05, 102.4, 0.5, 4],
      [5.808, 102.147, 0.5, 5], [5.833, 102.4, 0.4, 4], [5.53, 102.2, 0.4, 4], [4.88, 101.97, 0.3, 4],
    ],
  },
  {
    code: "KL-1", lat: 3.14, lon: 101.69, outlets: 54, itankShare: 0.15,
    towns: [
      [3.148, 101.695, 2.6, 3.5], [3.085, 101.745, 1.8, 3.5], [3.15, 101.767, 1.4, 3], [3.2, 101.73, 1.4, 3],
      [3.21, 101.635, 1.1, 3], [3.255, 101.65, 0.9, 3], [2.993, 101.791, 1.1, 4], [2.95, 101.84, 0.6, 4],
      [3.52, 101.91, 0.4, 4], [3.46, 102.06, 0.2, 4],
    ],
  },
  {
    code: "KL-2", lat: 3.07, lon: 101.52, outlets: 68, itankShare: 0.18,
    towns: [
      [3.073, 101.518, 2.4, 4], [3.107, 101.607, 2.2, 3.5], [3.05, 101.585, 1.8, 3], [3.02, 101.617, 1.4, 3],
      [3.16, 101.585, 1.3, 3], [3.205, 101.58, 1.0, 4], [2.93, 101.66, 0.8, 5], [3.32, 101.58, 0.6, 4],
      [2.69, 101.75, 0.5, 4], [3.57, 101.66, 0.3, 4],
    ],
  },
  {
    code: "KL-3", lat: 3.04, lon: 101.45, outlets: 40, itankShare: 0.14,
    towns: [
      [3.045, 101.446, 2.4, 4], [3.0, 101.41, 1.0, 3], [3.14, 101.39, 0.8, 4], [2.817, 101.5, 0.8, 4],
      [3.34, 101.27, 0.6, 5], [3.42, 101.18, 0.4, 4], [3.77, 101.0, 0.35, 4],
    ],
  },
  {
    code: "MK-1", lat: 2.21, lon: 102.26, outlets: 28, itankShare: 0.12,
    towns: [
      [2.2, 102.255, 2.6, 4], [2.27, 102.285, 1.0, 3], [2.38, 102.209, 0.6, 4], [2.31, 102.43, 0.5, 4],
      [2.044, 102.569, 0.8, 4], [2.47, 102.23, 0.4, 4], [2.35, 102.11, 0.4, 4],
    ],
  },
  {
    code: "NS-1", lat: 2.73, lon: 101.94, outlets: 28, itankShare: 0.11,
    towns: [
      [2.726, 101.938, 2.4, 4], [2.815, 101.8, 1.4, 3.5], [2.54, 101.81, 0.8, 4], [2.69, 101.97, 1.0, 3],
      [2.739, 102.249, 0.4, 4], [2.81, 102.4, 0.4, 4], [2.58, 102.61, 0.3, 4],
    ],
  },
  {
    code: "PH-1", lat: 3.81, lon: 103.33, outlets: 28, itankShare: 0.13,
    towns: [
      [3.808, 103.31, 2.6, 5], [3.97, 103.37, 0.6, 4], [3.492, 103.38, 0.6, 4], [4.233, 103.41, 0.6, 4],
      [3.45, 102.417, 0.6, 5], [3.585, 102.775, 0.3, 5], [3.94, 102.36, 0.4, 4], [2.8, 103.49, 0.35, 4],
    ],
  },
  {
    code: "TR-1", lat: 5.33, lon: 103.14, outlets: 20, itankShare: 0.1,
    towns: [
      [5.325, 103.13, 2.6, 5], [5.206, 103.2, 0.6, 4], [4.757, 103.41, 0.6, 5], [5.737, 102.493, 0.4, 5],
      [5.07, 103.01, 0.3, 5], [5.65, 102.73, 0.3, 4], [4.4, 103.45, 0.3, 4],
    ],
  },
];

export interface Depot {
  index: number;
  code: string;
  lat: number;
  lon: number;
  /** Projected coastline units. */
  x: number;
  y: number;
  /** Colour slot by code order, or -1 past the eighth. */
  slot: number;
  color: string;
}

export interface Outlet {
  depot: number;
  x: number;
  y: number;
  itank: boolean;
  /** 0.3 to 1.3, how much oil the outlet tends to produce. */
  size: number;
}

export interface Network {
  depots: Depot[];
  outlets: Outlet[];
}

function buildNetwork(): Network {
  const r = mulberry32(20260914);
  // Colour slots follow code order, so a quiet week never repaints the map.
  const ordered = [...DEPOT_SEEDS].sort((a, b) => (a.code < b.code ? -1 : a.code > b.code ? 1 : 0));
  const depots: Depot[] = ordered.map((d, i) => {
    const [x, y] = toGeo(d.lat, d.lon);
    const slot = i < MAX_COLOURED_DEPOTS ? i : -1;
    return { index: i, code: d.code, lat: d.lat, lon: d.lon, x, y, slot, color: slot < 0 ? NEUTRAL : SERIES[slot] };
  });

  const kmLat = 1 / 110.574;
  const kmLon = 1 / (111.32 * 0.9976842788356053);
  const outlets: Outlet[] = [];
  ordered.forEach((d, di) => {
    const total = d.towns.reduce((s, t) => s + t[2], 0);
    let made = 0;
    let guard = 0;
    while (made < d.outlets && guard < d.outlets * 60) {
      guard++;
      let pick = r() * total;
      let town = d.towns[0];
      for (const t of d.towns) {
        pick -= t[2];
        if (pick <= 0) {
          town = t;
          break;
        }
      }
      const lat = town[0] + gauss(r) * town[3] * kmLat;
      const lon = town[1] + gauss(r) * town[3] * kmLon;
      const [x, y] = toGeo(lat, lon);
      if (!onLand(x, y)) continue;
      outlets.push({ depot: di, x, y, itank: r() < d.itankShare, size: 0.3 + r() });
      made++;
    }
  });
  return { depots, outlets };
}

export const NETWORK: Network = buildNetwork();

/* ------------------------------------------------------------------ */
/* Calendar (no Date objects: plain civil-day arithmetic)              */
/* ------------------------------------------------------------------ */

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

function daysFromCivil(y: number, m: number, d: number): number {
  const yy = m <= 2 ? y - 1 : y;
  const era = Math.floor(yy / 400);
  const yoe = yy - era * 400;
  const doy = Math.floor((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + d - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
}

function civilFromDays(z: number): [number, number, number] {
  const zz = z + 719468;
  const era = Math.floor(zz / 146097);
  const doe = zz - era * 146097;
  const yoe = Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365);
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  const mp = Math.floor((5 * doy + 2) / 153);
  const d = doy - Math.floor((153 * mp + 2) / 5) + 1;
  const m = mp + (mp < 10 ? 3 : -9);
  return [yoe + era * 400 + (m <= 2 ? 1 : 0), m, d];
}

/** Monday 14 Sep 2026: the latest complete week in this story. */
const LATEST_MONDAY = daysFromCivil(2026, 9, 14);

const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));

/** "14-20 Sep 2026", or "31 Aug-6 Sep 2026" across a month. */
export function weekLabel(offset: number): string {
  const [y1, m1, d1] = civilFromDays(LATEST_MONDAY - offset * 7);
  const [y2, m2, d2] = civilFromDays(LATEST_MONDAY - offset * 7 + 6);
  const end = `${d2} ${MONTHS[m2 - 1]} ${y2}`;
  if (y1 !== y2) return `${d1} ${MONTHS[m1 - 1]} ${y1}-${end}`;
  if (m1 !== m2) return `${d1} ${MONTHS[m1 - 1]}-${end}`;
  return `${d1}-${end}`;
}

export const WEEK_MINUTES = 7 * 24 * 60;

/** A minute of the week as a MYT wall clock: "Mon 14 Sep 15:06". */
export function formatMinute(offset: number, minute: number): string {
  const m = Math.max(0, Math.min(WEEK_MINUTES - 1, Math.floor(minute)));
  const day = Math.floor(m / 1440);
  const [, mo, d] = civilFromDays(LATEST_MONDAY - offset * 7 + day);
  const hh = Math.floor((m % 1440) / 60);
  const mm = m % 60;
  return `${DAYS[day]} ${pad2(d)} ${MONTHS[mo - 1]} ${pad2(hh)}:${pad2(mm)}`;
}

/* ------------------------------------------------------------------ */
/* A week of collections                                               */
/* ------------------------------------------------------------------ */

export interface Collection {
  outlet: number;
  depot: number;
  /** Minutes after Monday 00:00 MYT. */
  minute: number;
  /** Position in the week, 0..1, as the playhead reads it. */
  t: number;
  kg: number;
}

export interface DepotWeek {
  arcs: number;
  kg: number;
}

export interface Week {
  offset: number;
  label: string;
  /** Sorted by time. */
  collections: Collection[];
  /** Running kg total, cumKg[i] = kg of collections[0..i-1]. */
  cumKg: Float64Array;
  depotWeek: DepotWeek[];
  totalKg: number;
  outletsCollected: number;
  busiest: number;
}

/** Relative volume by day, Monday first. Sunday is a rest day. */
const DAY_WEIGHT = [1, 1.06, 1, 1.05, 0.86, 0.72, 0];

function pickDay(r: () => number): number {
  const total = DAY_WEIGHT.reduce((s, w) => s + w, 0);
  let x = r() * total;
  for (let i = 0; i < 7; i++) {
    x -= DAY_WEIGHT[i];
    if (x <= 0) return i;
  }
  return 0;
}

/** A trip's departure, minutes after midnight, weighted to the working day. */
function tripStart(r: () => number, day: number): number {
  const u = r();
  const tri = (a: number, b: number) => a + ((r() + r()) / 2) * (b - a);
  if (day === 5) return u < 0.65 ? tri(400, 610) : tri(600, 820);
  if (u < 0.48) return tri(380, 590);
  if (u < 0.84) return tri(570, 760);
  return tri(800, 940);
}

/** A cheap monotone stand-in for atan2, so a depot's stops sort into sectors. */
function pseudoAngle(dx: number, dy: number): number {
  const p = dx / (Math.abs(dx) + Math.abs(dy) || 1);
  return dy < 0 ? 3 + p : 1 - p;
}

function buildWeek(offset: number): Week {
  const { depots, outlets } = NETWORK;
  const r = mulberry32(0x5eed + offset * 7919);
  const pace = 0.94 + r() * 0.12;

  // How often each outlet is due this week, spread across the days.
  const byDay: number[][][] = depots.map(() => [[], [], [], [], [], [], []]);
  outlets.forEach((o, oi) => {
    if (r() < 0.06) return;
    const lambda = (o.itank ? 0.9 + r() * 0.4 : 1.2 + o.size * 1.3) * pace;
    const count = Math.max(1, Math.floor(lambda + r()));
    const first = pickDay(r);
    for (let k = 0; k < count; k++) {
      byDay[o.depot][(first + Math.round((k * 6) / count)) % 6].push(oi);
    }
  });

  const raw: Collection[] = [];
  const baseKg = outlets.map((o) => (o.itank ? 250 + o.size * 430 : 15 + o.size * 42));

  depots.forEach((d, di) => {
    for (let day = 0; day < 6; day++) {
      const stops = byDay[di][day];
      if (stops.length === 0) continue;
      // Sectors around the depot, then out-and-back runs of a few stops each.
      const sorted = [...stops].sort((a, b) => {
        const pa = pseudoAngle(outlets[a].x - d.x, d.y - outlets[a].y);
        const pb = pseudoAngle(outlets[b].x - d.x, d.y - outlets[b].y);
        return pa - pb;
      });
      let i = 0;
      while (i < sorted.length) {
        const size = 3 + Math.floor(r() * 6);
        const trip = sorted.slice(i, i + size);
        i += size;
        trip.sort((a, b) => {
          const ax = outlets[a].x - d.x;
          const ay = outlets[a].y - d.y;
          const bx = outlets[b].x - d.x;
          const by = outlets[b].y - d.y;
          return ax * ax + ay * ay - (bx * bx + by * by);
        });
        let clock = tripStart(r, day) + 14 + r() * 26;
        const close = day === 5 ? 17 * 60 : 19 * 60;
        for (const oi of trip) {
          // Friday prayers: the crew stops between 12:15 and 14:30.
          if (day === 4 && clock > 735 && clock < 870) clock = 870 + r() * 20;
          if (clock > close) break;
          const o = outlets[oi];
          let kg = baseKg[oi] * (o.itank ? 0.72 + r() * 0.56 : 0.62 + r() * 0.76);
          if (!o.itank && r() < 0.04) kg *= 2.2;
          kg = Math.round(kg * 10) / 10;
          const minute = day * 1440 + Math.floor(clock);
          raw.push({ outlet: oi, depot: di, minute, t: minute / WEEK_MINUTES, kg });
          clock += 12 + r() * 24;
        }
      }
    }
  });

  raw.sort((a, b) => a.minute - b.minute || a.outlet - b.outlet);
  const cumKg = new Float64Array(raw.length + 1);
  const depotWeek: DepotWeek[] = depots.map(() => ({ arcs: 0, kg: 0 }));
  const seen = new Set<number>();
  raw.forEach((c, i) => {
    cumKg[i + 1] = cumKg[i] + c.kg;
    depotWeek[c.depot].arcs++;
    depotWeek[c.depot].kg += c.kg;
    seen.add(c.outlet);
  });
  let busiest = 0;
  depotWeek.forEach((w, i) => {
    if (w.kg > depotWeek[busiest].kg) busiest = i;
  });

  return {
    offset,
    label: weekLabel(offset),
    collections: raw,
    cumKg,
    depotWeek,
    totalKg: cumKg[raw.length],
    outletsCollected: seen.size,
    busiest,
  };
}

const weekCache = new Map<number, Week>();

export function getWeek(offset: number): Week {
  let w = weekCache.get(offset);
  if (!w) {
    w = buildWeek(offset);
    weekCache.set(offset, w);
  }
  return w;
}

/** Collections at or before `t`, by binary search over the sorted week. */
export function countUpTo(week: Week, t: number): number {
  const c = week.collections;
  let lo = 0;
  let hi = c.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (c[mid].t <= t) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/* ------------------------------------------------------------------ */
/* Number formatting, en-MY style, without the runtime's locale        */
/* ------------------------------------------------------------------ */

function group(intPart: string): string {
  let out = "";
  for (let i = 0; i < intPart.length; i++) {
    const fromEnd = intPart.length - i;
    out += intPart[i];
    if (fromEnd > 1 && fromEnd % 3 === 1) out += ",";
  }
  return out;
}

/** Fixed decimals with thousands separators: 1284.6 -> "1,284.60". */
export function fixed(n: number, places: number): string {
  const neg = n < 0;
  const s = Math.abs(n).toFixed(places);
  const [i, f] = s.split(".");
  return `${neg ? "-" : ""}${group(i)}${f ? `.${f}` : ""}`;
}

/** Up to two decimals, trailing zeros dropped: 1396.40 -> "1,396.4". */
export function kg(n: number): string {
  const s = fixed(n, 2);
  return s.includes(".") ? s.replace(/\.?0+$/, "") : s;
}

export function count(n: number): string {
  return group(String(Math.round(n)));
}
