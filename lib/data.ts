/**
 * Single source of truth for all portfolio content.
 * Edit this file to update the site; components read from here.
 * House style: plain and specific, first person in the handover notes,
 * and no em or en dashes anywhere a visitor can read.
 */

export const profile = {
  name: "Jullien Nazreen",
  firstName: "Jullien",
  lastName: "Nazreen",
  role: "Full-Stack Developer",
  company: "FatHopes Energy",
  location: "Greater Kuala Lumpur, Malaysia",
  email: "jullienazreen@gmail.com",
  photo: "/jullien.png",
  resumeUrl: "/Jullien-Nazreen-CV.pdf",
  onShiftSince: "Nov 2025",
  thesis:
    "I build the software that moves used cooking oil from restaurant kitchens to clean-energy refineries.",
  metaDescription:
    "Jullien Nazreen is a full-stack developer at FatHopes Energy in Malaysia, building the mobile app, portals and dashboards behind used-cooking-oil collection and feedstock trading.",
  contactNote:
    "Not job-hunting. Always up for a good conversation about clean energy, logistics and fintech.",
} as const;

export const socials = [
  {
    label: "GitHub",
    handle: "kingxjullien14",
    href: "https://github.com/kingxjullien14",
    icon: "github",
  },
  {
    label: "LinkedIn",
    handle: "jullien-nazreen",
    href: "https://www.linkedin.com/in/jullien-nazreen/",
    icon: "linkedin",
  },
] as const;

export type UnitId =
  | "vendor-app"
  | "trading-portal"
  | "vendor-portal"
  | "wws-dashboards"
  | "api-platform"
  | "osai"
  | "stone-chisel";

export type Unit = {
  id: UnitId;
  /** split-flap board label, 14 characters max, caps */
  board: string;
  name: string;
  platform: "MOBILE" | "WEB" | "DATA" | "BACKEND" | "DESKTOP";
  /** board stack column, 7 characters max */
  stack: string;
  /** board status column, 5 characters max */
  status: string;
  owner: "fathopes" | "own";
  period: string;
  summary: string;
  /** first-person handover note */
  note: string;
  built: string[];
  tech: string[];
  links?: { label: string; href: string }[];
  credit?: { text: string; href: string };
};

export const units: Unit[] = [
  {
    id: "vendor-app",
    board: "VENDOR APP",
    name: "Vendor App",
    platform: "MOBILE",
    stack: "FLUTTER",
    status: "LIVE",
    owner: "fathopes",
    period: "2025 to now",
    summary:
      "The app restaurants use to sell their used cooking oil: book a pickup, watch the collector arrive, get paid.",
    note: "One Flutter codebase ships to iOS, Android and the web, and it has to work for a cook with oily hands and one bar of signal. I build it end to end, from these screens down to the Nitro and GraphQL service behind them.",
    built: [
      "Pickup booking with a photo check, weight limits and date rules",
      "Live collector tracking on a map",
      "Wallet, payout methods and withdrawals through Xendit and Billplz",
      "Face check before a payout",
      "Nine languages and push notifications",
    ],
    tech: ["Flutter", "Dart", "GraphQL", "Nitro", "Prisma", "PostgreSQL", "FCM"],
  },
  {
    id: "trading-portal",
    board: "TRADING PORTAL",
    name: "Trading Portal",
    platform: "WEB",
    stack: "NEXT.JS",
    status: "LIVE",
    owner: "fathopes",
    period: "2025 to now",
    summary:
      "Where feedstock is bought and sold: company KYC, negotiated purchase requests, and contracts signed under a tamper-evident seal.",
    note: "A contract here passes between a supplier, a director and a CEO, often over several rounds. I put every counter-offer into one readable thread and made every signature an HMAC seal that anyone can verify later. Sign the demo contract below, then change a number and verify it again.",
    built: [
      "A 15-step KYC and compliance review",
      "Purchase requests with counter-offers in one thread",
      "HMAC-SHA256 sealed e-signatures with a public verify page",
      "Permission nodes and role-based access",
      "Weekly, monthly and year-to-date reports",
    ],
    tech: ["Next.js 16", "React 19", "TypeScript", "shadcn/ui", "TanStack Table", "GraphQL Yoga", "Prisma"],
  },
  {
    id: "vendor-portal",
    board: "VENDOR PORTAL",
    name: "Vendor Portal",
    platform: "WEB",
    stack: "NEXT.JS",
    status: "LIVE",
    owner: "fathopes",
    period: "2025 to now",
    summary:
      "The web side for restaurant groups: register, manage outlets and tanks, and follow every collection.",
    note: "Groups with many outlets needed more than a phone app. The portal gives them a five-step registration, outlet and tank management and maintenance requests, with 31 permission keys deciding who can see and do what.",
    built: [
      "Five-step vendor registration with document upload",
      "Outlets, brands and persons in charge",
      "Tank maintenance requests with before and after photos",
      "Collection trends by weight and count",
      "31 permission keys across roles",
    ],
    tech: ["Next.js 16", "React 19", "shadcn/ui", "Recharts", "Nitro", "Prisma", "Azure Blob Storage"],
  },
  {
    id: "wws-dashboards",
    board: "WWS DASHBOARDS",
    name: "WWS Dashboards",
    platform: "DATA",
    stack: "DECK.GL",
    status: "LIVE",
    owner: "fathopes",
    period: "2025 to now",
    summary:
      "Operations dashboards for the collection network: a week of pickups replayed on a map, monthly pace against target, stock and service levels.",
    note: "The weekly view replays every collection as an arc from outlet to depot, so you see where the oil came from, not only how much. The monthly view answers one question before any chart: are we on pace for target?",
    built: [
      "Weekly collection replay on a deck.gl arc map",
      "Monthly collection pace against target",
      "Collection due triage, service level and stock reports",
      "Light and dark themes with Malaysian number formats",
      "Helping move the legacy LoopBack 4 stack to Nitro and Next.js",
    ],
    tech: ["Next.js 16", "deck.gl", "Recharts", "TanStack Table", "GraphQL Yoga", "Prisma", "MySQL"],
  },
  {
    id: "api-platform",
    board: "API PLATFORM",
    name: "API Platform",
    platform: "BACKEND",
    stack: "NITRO",
    status: "LIVE",
    owner: "fathopes",
    period: "2025 to now",
    summary: "The type-safe GraphQL and REST layer that every app and portal above talks to.",
    note: "Five products, one way of building services: Nitro, GraphQL Yoga, Prisma and Zod, with signed requests, structured logs and error tracking on every one. Whichever service misbehaves, you debug it the same way.",
    built: [
      "GraphQL (Yoga) and REST endpoints on Nitro",
      "Prisma across PostgreSQL, MySQL and MongoDB",
      "JWT and OAuth sign-in with request signing",
      "Zod validation at every boundary",
      "Winston logging and Sentry error tracking",
    ],
    tech: ["Node.js", "Nitro", "GraphQL Yoga", "Prisma", "Zod", "Winston", "Sentry"],
  },
  {
    id: "osai",
    board: "OSAI",
    name: "OSAI",
    platform: "DESKTOP",
    stack: "TAURI",
    status: "V2.10",
    owner: "own",
    period: "Open source, MIT",
    summary:
      "A desktop superapp for driving AI coding agents: chat, terminals, browser, files and editor as floating windows on one canvas.",
    note: "I wanted one window for the way I actually work with coding agents. OSAI drives the agent CLIs on your own subscriptions, keeps terminals alive after you close them, and ships signed builds for Windows and macOS. I rebuilt it Windows-first and keep carrying it forward.",
    built: [
      "Agent chat across several engines, with tool activity cards",
      "Terminals that survive closing, plus a roster of running agents",
      "Monaco editor, git-aware file tree and a native browser",
      "Command palette, scheduled agents and voice control",
      "Signed, auto-updating releases for Windows and macOS",
    ],
    tech: ["Tauri 2", "Rust", "React 19", "TypeScript", "Monaco", "xterm.js"],
    links: [
      { label: "Source on GitHub", href: "https://github.com/kingxjullien14/OSAI" },
      { label: "Latest release", href: "https://github.com/kingxjullien14/OSAI/releases/latest" },
    ],
    credit: {
      text: "Based on Firaz Fhansurie's AIOS",
      href: "https://github.com/ferazfhansurie/aios-superapp",
    },
  },
  {
    id: "stone-chisel",
    board: "STONE & CHISEL",
    name: "Stone & Chisel",
    platform: "WEB",
    stack: "NEXT.JS",
    status: "LIVE",
    owner: "own",
    period: "Live at stonenchisel.com",
    summary: "A calm place to carve markdown notes.",
    note: "My own notes app, built the way I like to write: split view with scroll sync, wiki links and backlinks, math, Mermaid and Excalidraw canvases, all autosaved with version history. The notes pane in OSAI is a Stone & Chisel client, so the two work as one setup. Type in the editor below.",
    built: [
      "Edit, split and preview with scroll sync",
      "Wiki links, backlinks and a note graph",
      "KaTeX math, Mermaid, DBML and Excalidraw canvases",
      "Journals, full-text search and version history",
      "Share links and API tokens",
    ],
    tech: ["Next.js 16", "Tailwind CSS", "shadcn/ui", "Drizzle", "Neon Postgres", "Auth.js"],
    links: [{ label: "Open stonenchisel.com", href: "https://www.stonenchisel.com" }],
  },
];

export const unitById = Object.fromEntries(units.map((u) => [u.id, u])) as Record<UnitId, Unit>;

/** The kitchen-to-refinery chain the FatHopes systems serve. */
export type Station = {
  id: string;
  label: string;
  line: string;
  units: UnitId[];
};

export const stations: Station[] = [
  {
    id: "kitchen",
    label: "Kitchen",
    line: "Restaurants store used oil in drums and tanks, then book a pickup from their phone or the portal.",
    units: ["vendor-app", "vendor-portal"],
  },
  {
    id: "collector",
    label: "Collector",
    line: "A collector drives the route while the restaurant watches them arrive, live, on a map.",
    units: ["vendor-app"],
  },
  {
    id: "depot",
    label: "Depot",
    line: "The oil is weighed in, stored, and counted against the month's collection target.",
    units: ["wws-dashboards"],
  },
  {
    id: "trading",
    label: "Trading desk",
    line: "Feedstock is bought and sold under negotiated contracts with sealed signatures.",
    units: ["trading-portal"],
  },
  {
    id: "refinery",
    label: "Refinery",
    line: "It leaves as clean-energy feedstock. My part of the line ends one stop earlier.",
    units: [],
  },
];

/** Patch bay: every jack lights the units that genuinely use it. */
export type Jack = { name: string; units: UnitId[] };
export type Rack = { label: string; jacks: Jack[] };

const fatBack: UnitId[] = ["api-platform", "vendor-app", "trading-portal", "vendor-portal", "wws-dashboards"];

export const racks: Rack[] = [
  {
    label: "Web",
    jacks: [
      { name: "Next.js", units: ["trading-portal", "vendor-portal", "wws-dashboards", "stone-chisel"] },
      { name: "React", units: ["trading-portal", "vendor-portal", "wws-dashboards", "osai", "stone-chisel"] },
      { name: "TypeScript", units: ["trading-portal", "vendor-portal", "wws-dashboards", "api-platform", "osai", "stone-chisel"] },
      { name: "Tailwind CSS", units: ["trading-portal", "vendor-portal", "wws-dashboards", "osai", "stone-chisel"] },
      { name: "shadcn/ui", units: ["trading-portal", "vendor-portal", "wws-dashboards", "stone-chisel"] },
      { name: "TanStack Table", units: ["trading-portal", "vendor-portal", "wws-dashboards"] },
      { name: "Recharts", units: ["trading-portal", "vendor-portal", "wws-dashboards"] },
      { name: "deck.gl", units: ["wws-dashboards"] },
    ],
  },
  {
    label: "Mobile",
    jacks: [
      { name: "Flutter", units: ["vendor-app"] },
      { name: "Dart", units: ["vendor-app"] },
      { name: "Maps and GPS", units: ["vendor-app"] },
      { name: "Face detection", units: ["vendor-app"] },
      { name: "Push (FCM)", units: ["vendor-app"] },
    ],
  },
  {
    label: "Backend",
    jacks: [
      { name: "Node.js", units: fatBack },
      { name: "Nitro", units: fatBack },
      { name: "GraphQL Yoga", units: fatBack },
      { name: "Prisma", units: fatBack },
      { name: "Zod", units: [...fatBack, "stone-chisel"] },
      { name: "JWT and OAuth", units: fatBack },
    ],
  },
  {
    label: "Data",
    jacks: [
      { name: "PostgreSQL", units: ["api-platform", "vendor-app", "stone-chisel"] },
      { name: "MySQL", units: ["api-platform", "wws-dashboards"] },
      { name: "MongoDB", units: ["api-platform"] },
      { name: "Drizzle", units: ["stone-chisel"] },
    ],
  },
  {
    label: "Cloud",
    jacks: [
      { name: "Azure Blob", units: ["api-platform", "vendor-app", "vendor-portal"] },
      { name: "Vercel", units: ["trading-portal", "vendor-portal"] },
      { name: "Sentry", units: fatBack },
      { name: "Winston", units: fatBack },
    ],
  },
  {
    label: "Desktop",
    jacks: [
      { name: "Tauri", units: ["osai"] },
      { name: "Rust", units: ["osai"] },
      { name: "Monaco", units: ["osai"] },
      { name: "xterm.js", units: ["osai"] },
    ],
  },
];

export const alsoUsed = ["Docker", "LoopBack 4", "PowerBI", "PDF and Excel reporting", "Payments", "Real-time GPS"];

export const about = {
  lead: "I started on backend services and grew into owning features end to end: database schema, API design, and the screens vendors and internal teams use every day.",
  paragraphs: [
    "Most of my work happens in fast-moving, KPI-driven teams where requirements shift week to week. I build across the stack: Next.js and React on the web, Flutter on mobile, and Nitro with GraphQL and Prisma behind them.",
    "I care about software that stays reliable after launch day: type-safe code, plain architecture where it matters, and interfaces that respect the person using them.",
  ],
  focus: ["Clean energy", "Logistics", "Fintech"],
  facts: [
    "9 languages localized in a production app",
    "iOS, Android and web from one Flutter codebase",
    "PostgreSQL, MySQL and MongoDB in production",
  ],
} as const;

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  current?: boolean;
  note: string;
};

export const experiences: Experience[] = [
  {
    company: "FatHopes Energy",
    role: "Full-Stack Developer",
    period: "Nov 2025 to now",
    location: "Subang",
    current: true,
    note: "The web and mobile platforms behind used-cooking-oil collection and feedstock trading across several countries, from schema and API design to the screens people use daily.",
  },
  {
    company: "Juta Teknologi",
    role: "Back-End Developer",
    period: "Nov 2024 to Nov 2025",
    location: "Selangor",
    note: "Backend services, database integration and API design, plus performance work, bug triage and testing support for the team.",
  },
  {
    company: "Juta Teknologi",
    role: "Chatbot Developer",
    period: "Feb 2024 to Jul 2024",
    location: "Shah Alam",
    note: "AI chatbots and conversational workflows, wired into the business processes of client companies.",
  },
  {
    company: "Cabletronic Computers",
    role: "Computer Technician",
    period: "Jan 2021 to Jun 2021",
    location: "Seremban",
    note: "Diagnosed and repaired laptops and PCs, hardware and software, and got them back to their owners on time.",
  },
];

export type Education = {
  school: string;
  degree: string;
  field?: string;
  period: string;
};

export const education: Education[] = [
  {
    school: "Universiti Teknologi MARA",
    degree: "MSc Information Technology",
    period: "Oct 2024 to Feb 2026",
  },
  {
    school: "Universiti Teknologi MARA",
    degree: "BSc (Hons) Information Systems",
    field: "Intelligent Systems Engineering",
    period: "Mar 2022 to Aug 2024",
  },
  {
    school: "Universiti Teknologi MARA",
    degree: "Diploma in Computer Science",
    period: "Oct 2018 to Sep 2021",
  },
];

export const navLinks = [
  { id: "flow", label: "Flow", board: "FLOW" },
  { id: "work", label: "Work", board: "WORK" },
  { id: "skills", label: "Toolkit", board: "TOOLKIT" },
  { id: "about", label: "About", board: "ABOUT" },
  { id: "experience", label: "Record", board: "RECORD" },
  { id: "contact", label: "Contact", board: "CONTACT" },
] as const;
