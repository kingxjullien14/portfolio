// Synthetic data for the Vendor Portal recreation. Every outlet, person, phone
// number, ID and weight here is invented. Dates are fixed strings so the
// server and client render the same markup.

export type Tone = "success" | "info" | "warning" | "danger" | "secondary" | "outline";

/* ---------- formatting (deterministic, no locale APIs) ---------- */

export function formatNumber(n: number): string {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Same rule as the real chart axis: 12000 -> "12.0k". */
export function formatTick(v: number): string {
  return v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v);
}

/** Smallest "nice" step that fits the max into four intervals with headroom. */
export function niceScale(max: number): { top: number; ticks: number[] } {
  const raw = (max * 1.04) / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const steps = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
  const unit = steps.find((s) => s * mag >= raw) ?? 10;
  const step = unit * mag;
  return { top: step * 4, ticks: [0, step, step * 2, step * 3, step * 4] };
}

/* ---------- calendar helpers for 2026 (1 Jan 2026 is a Thursday) ---------- */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LEN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function dayOfYear(month: number, day: number): number {
  let n = day;
  for (let i = 0; i < month; i++) n += MONTH_LEN[i];
  return n;
}

function fromDayOfYear(doy: number) {
  let m = 0;
  let d = doy;
  while (d > MONTH_LEN[m]) {
    d -= MONTH_LEN[m];
    m++;
  }
  return { m, d, wd: (4 + doy - 1) % 7 };
}

/* ---------- chart series ---------- */

export type Range = "3m" | "30d" | "7d";
export type Metric = "weight" | "count";

export interface ChartPoint {
  tick: string;
  label: string;
  weight: number;
  count: number;
}

export interface Series {
  points: ChartPoint[];
  tickEvery: number;
  caption: string;
}

// Rolling 7-day buckets ending today, labelled by their first day: 27 Jun to 19 Sep 2026.
// The last three match the daily series below.
const WEEKLY_KG = [9420, 10160, 9830, 10710, 11180, 10640, 11470, 11860, 12120, 12250, 13300, 13040, 14380];

// Daily totals, 27 Aug to 25 Sep 2026 (public holidays on 31 Aug and 16 Sep dip).
const DAILY_KG = [
  1880, 2040, 1610, 1290, 1170, 2110, 1960, 1930, 2180, 1690, 1340, 2070, 1990, 2120, 1830,
  2260, 1670, 1380, 2150, 2030, 1260, 2210, 2340, 1760, 1410, 2190, 2280, 2410, 2390, 1940,
];

const AVG_KG_PER_COLLECTION = 15.1;

function point(doy: number, weight: number, tickStyle: "date" | "weekday"): ChartPoint {
  const { m, d, wd } = fromDayOfYear(doy);
  return {
    tick: tickStyle === "date" ? `${MONTHS[m]} ${d}` : `${WEEKDAYS[wd]} ${d}`,
    label: `${WEEKDAYS[wd]}, ${MONTHS[m]} ${d}, 2026`,
    weight,
    count: Math.round(weight / AVG_KG_PER_COLLECTION),
  };
}

const weeklyStart = dayOfYear(5, 27);
const dailyStart = dayOfYear(7, 27);

const DAILY = DAILY_KG.map((w, i) => point(dailyStart + i, w, "date"));

export const SERIES: Record<Range, Series> = {
  "3m": {
    points: WEEKLY_KG.map((w, i) => point(weeklyStart + i * 7, w, "date")),
    tickEvery: 2,
    caption: "Last 3 months",
  },
  "30d": { points: DAILY, tickEvery: 3, caption: "Last 30 days" },
  "7d": {
    points: DAILY_KG.slice(-7).map((w, i) => point(dailyStart + 23 + i, w, "weekday")),
    tickEvery: 1,
    caption: "Last 7 days",
  },
};

export const RANGES: { id: Range; label: string }[] = [
  { id: "3m", label: "3 months" },
  { id: "30d", label: "30 days" },
  { id: "7d", label: "7 days" },
];

export const METRICS: { id: Metric; label: string }[] = [
  { id: "weight", label: "Weight (KG)" },
  { id: "count", label: "Count" },
];

/* ---------- dashboard ---------- */

export interface Stat {
  title: [string, string];
  value: string;
  detail: string;
  trend?: { dir: "up" | "down"; value: string };
  /** A soft warning pill shown in place of the comparison line. */
  flag?: string;
  sub?: string;
  icon: "day" | "week" | "month" | "pending";
}

export const STATS: Stat[] = [
  {
    title: ["Today's", "Collections"],
    value: "128",
    detail: "1,940 KG collected",
    trend: { dir: "up", value: "+6%" },
    sub: "vs yesterday",
    icon: "day",
  },
  {
    title: ["This Week's", "Collections"],
    value: "742",
    detail: "11,210 KG total",
    trend: { dir: "up", value: "+12%" },
    sub: "vs previous week",
    icon: "week",
  },
  {
    title: ["This Month's", "Collections"],
    value: "3,184",
    detail: "48,900 KG total",
    trend: { dir: "down", value: "-3%" },
    sub: "vs previous month",
    icon: "month",
  },
  {
    title: ["Pending", "Requests"],
    value: "17",
    detail: "Awaiting collection",
    flag: "Needs attention",
    icon: "pending",
  },
];

export interface Activity {
  kind: "completed" | "request" | "pending" | "scheduled" | "cancelled";
  before: string;
  strong: string;
  after: string;
  time: string;
  ref: string;
}

export const ACTIVITY: Activity[] = [
  { kind: "completed", before: "Collection ", strong: "completed", after: " at Restoran Seri Kenanga, 84 KG", time: "2m ago", ref: "COL-10432" },
  { kind: "request", before: "New collection ", strong: "request", after: " from Kopitiam Lorong Tujuh", time: "18m ago", ref: "COL-10431" },
  { kind: "pending", before: "Collection ", strong: "pending", after: " verification at Warung Mak Teh", time: "1h ago", ref: "COL-10428" },
  { kind: "scheduled", before: "Maintenance ", strong: "scheduled", after: " for Seri Kenanga Bangsar", time: "2h ago", ref: "MTN-KUL0093-5" },
  { kind: "completed", before: "Collection ", strong: "completed", after: " at Lorong Tujuh Gurney, 126 KG", time: "3h ago", ref: "COL-10425" },
  { kind: "cancelled", before: "Collection ", strong: "cancelled", after: " at Mak Teh Taman Molek", time: "5h ago", ref: "COL-10419" },
];

/* ---------- maintenance ---------- */

export type MaintenanceStatus = "request" | "scheduled" | "pending" | "verified" | "rejected";

export const STATUS_META: Record<MaintenanceStatus, { label: string; tone: Tone }> = {
  request: { label: "Request", tone: "secondary" },
  scheduled: { label: "Scheduled", tone: "info" },
  pending: { label: "Pending Verify", tone: "warning" },
  verified: { label: "Verified", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" },
};

export interface MaintenanceDetail {
  address: string;
  email: string;
  longDescription: string;
  completed: string;
  technician: string;
  serviceBy: string;
  trip: string;
  tasks: string[];
  parts: string[];
  photoStamp: [string, string];
}

export interface MaintenanceRow {
  id: string;
  no: string;
  date: string;
  time: string;
  outlet: string;
  code: string;
  pic: string;
  phone: string;
  state: string;
  tankType: string;
  tankId: string;
  description: string;
  service: string;
  status: MaintenanceStatus;
  source: "Vendor Portal" | "Vendor App" | "Manual";
  detail?: MaintenanceDetail;
}

export const MAINTENANCE: MaintenanceRow[] = [
  {
    id: "m1",
    no: "MTN-SGR0142-3",
    date: "24 Sep 2026",
    time: "9:18 AM",
    outlet: "Restoran Seri Kenanga",
    code: "SGR-0142",
    pic: "Aina Rahman",
    phone: "012-000 0142",
    state: "Selangor",
    tankType: "iTank 400L",
    tankId: "ITK-04417",
    description: "Cracked lid hinge, leak",
    service: "Troubleshooting",
    status: "pending",
    source: "Vendor App",
    detail: {
      address: "18 Jalan Kenanga 3, 47500 Subang Jaya, Selangor",
      email: "aina@serikenanga.example",
      longDescription: "Lid hinge cracked and oil seeps at the seam when the tank is full. Please check before the weekend collection.",
      completed: "25 Sep 2026, 8:41 AM",
      technician: "Azlan Yusof",
      serviceBy: "technician",
      trip: "TRP-260925-014",
      tasks: ["Replaced lid hinge and resealed the gasket", "Leak test passed at full level"],
      parts: ["Lid hinge, stainless × 1", "Gasket seal 400L × 1"],
      photoStamp: ["25/09 08:12", "25/09 08:37"],
    },
  },
  {
    id: "m2",
    no: "MTN-KUL0087-1",
    date: "24 Sep 2026",
    time: "4:52 PM",
    outlet: "Kopitiam Lorong Tujuh",
    code: "KUL-0087",
    pic: "Hafiz Kamal",
    phone: "011-000 0087",
    state: "Kuala Lumpur",
    tankType: "Drum 200L",
    tankId: "DRM-10283",
    description: "Quarterly filter clean",
    service: "Preventive Maintenance",
    status: "scheduled",
    source: "Vendor Portal",
  },
  {
    id: "m3",
    no: "MTN-JHR0215-2",
    date: "24 Sep 2026",
    time: "11:05 AM",
    outlet: "Warung Mak Teh",
    code: "JHR-0215",
    pic: "Siti Hajar",
    phone: "017-000 0215",
    state: "Johor",
    tankType: "iTank 250L",
    tankId: "ITK-03952",
    description: "Sludge at outlet valve",
    service: "Desludging",
    status: "request",
    source: "Vendor Portal",
  },
  {
    id: "m4",
    no: "MTN-KUL0093-5",
    date: "23 Sep 2026",
    time: "3:40 PM",
    outlet: "Seri Kenanga Bangsar",
    code: "KUL-0093",
    pic: "Lim Wei Jie",
    phone: "016-000 0093",
    state: "Kuala Lumpur",
    tankType: "iTank 400L",
    tankId: "ITK-04102",
    description: "Swap after renovation",
    service: "Swapping Tanks",
    status: "verified",
    source: "Manual",
  },
  {
    id: "m5",
    no: "MTN-PNG0063-1",
    date: "23 Sep 2026",
    time: "10:12 AM",
    outlet: "Lorong Tujuh Gurney",
    code: "PNG-0063",
    pic: "Kavitha Nair",
    phone: "012-000 0063",
    state: "Pulau Pinang",
    tankType: "Drum 200L",
    tankId: "DRM-09876",
    description: "Outlet closing for refit",
    service: "Bring Back Tank",
    status: "pending",
    source: "Vendor Portal",
    detail: {
      address: "7 Lebuh Gurney Baru, 10250 George Town, Penang",
      email: "kavitha@lorongtujuh.example",
      longDescription: "Outlet closes for a three week refit from 28 Sep. Please collect the drum and hold it at the hub.",
      completed: "24 Sep 2026, 5:06 PM",
      technician: "Daniel Wong",
      serviceBy: "technician",
      trip: "TRP-260924-031",
      tasks: ["Drum emptied, rinsed and loaded for return", "Hub receipt HUB-PNG-2291"],
      parts: ["Drum lid clamp × 1"],
      photoStamp: ["24/09 16:40", "24/09 17:02"],
    },
  },
  {
    id: "m6",
    no: "MTN-JHR0229-4",
    date: "22 Sep 2026",
    time: "2:27 PM",
    outlet: "Mak Teh Taman Molek",
    code: "JHR-0229",
    pic: "Farid Osman",
    phone: "019-000 0229",
    state: "Johor",
    tankType: "iTank 250L",
    tankId: "ITK-03811",
    description: "New branch, first tank",
    service: "Handover New Tank",
    status: "verified",
    source: "Vendor App",
  },
  {
    id: "m7",
    no: "MTN-SGR0158-2",
    date: "21 Sep 2026",
    time: "5:03 PM",
    outlet: "Seri Kenanga Shah Alam",
    code: "SGR-0158",
    pic: "Nur Izzati",
    phone: "013-000 0158",
    state: "Selangor",
    tankType: "iTank 400L",
    tankId: "ITK-04230",
    description: "Tap leaking at the base",
    service: "Troubleshooting",
    status: "rejected",
    source: "Vendor App",
  },
  {
    id: "m8",
    no: "MTN-KUL0112-1",
    date: "20 Sep 2026",
    time: "9:46 AM",
    outlet: "Lorong Tujuh Cheras",
    code: "KUL-0112",
    pic: "Tan Mei Ling",
    phone: "012-000 0112",
    state: "Kuala Lumpur",
    tankType: "Drum 200L",
    tankId: "DRM-10417",
    description: "Pre-festive routine check",
    service: "Preventive Maintenance",
    status: "scheduled",
    source: "Vendor Portal",
  },
];

export const MAINTENANCE_TOTAL = 42;
