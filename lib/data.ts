/**
 * Single source of truth for all portfolio content.
 * Edit this file to update the site — components read from here.
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
  // hero
  heroLead:
    "I engineer web & mobile platforms that turn used cooking oil into clean-energy feedstock",
  heroSub:
    "Full-stack developer at FatHopes Energy — building the systems behind Southeast Asia's UCO collection and energy-feedstock trading, end-to-end from database schema to the interfaces vendors use every day.",
  status: "Building the future of energy @ FatHopes Energy",
  contactNote:
    "Not job-hunting — just always up for a good conversation about clean energy, logistics & fintech.",
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
  {
    label: "Email",
    handle: "jullienazreen@gmail.com",
    href: "mailto:jullienazreen@gmail.com",
    icon: "mail",
  },
] as const;

export const about = {
  lead: "I've grown from backend services into owning features end-to-end — from database schema and API design through to the interfaces vendors and internal teams rely on every day.",
  paragraphs: [
    "KPI-driven and comfortable in fast-moving environments where requirements shift quickly. I build across the stack: Next.js and React on the web, Flutter for mobile, and Node.js (Nitro) with GraphQL and Prisma on the backend.",
    "I care about shipping reliable, well-structured software — type-safe code, sensible architecture, and clean UX — and I'm always picking up the next tool that makes the team faster.",
  ],
  focus: ["Clean energy", "Logistics", "Fintech"],
} as const;

export type Stat = {
  value: number;
  suffix?: string;
  label: string;
  hint?: string;
};

export const stats: Stat[] = [
  { value: 5, suffix: "+", label: "Platforms & portals shipped" },
  { value: 9, label: "Languages localized", hint: "in production mobile app" },
  { value: 3, label: "Databases in production", hint: "Postgres · MySQL · Mongo" },
  { value: 3, label: "Targets, one codebase", hint: "iOS · Android · Web" },
];

export type SkillGroup = {
  title: string;
  icon: "web" | "mobile" | "server" | "database" | "cloud" | "spark";
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Web",
    icon: "web",
    items: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "TanStack Query",
      "TanStack Table",
    ],
  },
  {
    title: "Mobile",
    icon: "mobile",
    items: ["Flutter", "Dart", "iOS", "Android", "Cross-platform"],
  },
  {
    title: "Backend",
    icon: "server",
    items: [
      "Node.js",
      "Nitro",
      "GraphQL (Yoga)",
      "REST APIs",
      "Prisma ORM",
      "LoopBack 4",
    ],
  },
  {
    title: "Databases",
    icon: "database",
    items: ["PostgreSQL", "MySQL", "MongoDB"],
  },
  {
    title: "Cloud & DevOps",
    icon: "cloud",
    items: [
      "Azure",
      "Vercel",
      "Docker",
      "Blob Storage",
      "Container Registry",
      "CDN",
    ],
  },
  {
    title: "Platform & More",
    icon: "spark",
    items: [
      "JWT / OAuth (SSO)",
      "Real-time GPS",
      "Payments",
      "PDF / Excel reporting",
      "Dashboards",
      "Sentry · Winston",
    ],
  },
];

export type Project = {
  name: string;
  category: string;
  tagline: string;
  description: string;
  highlights: string[];
  stack: string[];
  period: string;
};

export const projects: Project[] = [
  {
    name: "FatHopes Vendor App",
    category: "Cross-platform Mobile",
    tagline: "One Flutter codebase for collectors & vendors, on every device.",
    description:
      "A cross-platform app (iOS / Android / Web) powering used-cooking-oil collection in the field — with the reliability logistics teams need in the real world.",
    highlights: [
      "Real-time collector GPS tracking",
      "In-app payments & withdrawals (Xendit / BillPlz)",
      "Face-recognition onboarding",
      "9-language localization",
      "Push notifications (FCM)",
    ],
    stack: ["Flutter", "Dart", "GraphQL", "FCM"],
    period: "2025 — Present",
  },
  {
    name: "Vendor & Energy-Trading Portals",
    category: "Web Platform",
    tagline: "Next.js portals for onboarding, purchasing & digital contracts.",
    description:
      "Two production portals that run vendor onboarding and energy-feedstock trading — from first KYC step to a legally-signed contract, with access scoped to each role.",
    highlights: [
      "Multi-step KYC workflows",
      "Negotiated purchase requests",
      "HMAC-sealed digital e-signatures",
      "Role-based access control (RBAC)",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind"],
    period: "2025 — Present",
  },
  {
    name: "Type-safe API Platform",
    category: "Backend / API",
    tagline: "Nitro + Prisma services the whole product is built on.",
    description:
      "The GraphQL & REST layer behind the apps and portals — designed type-safe end-to-end, hardened with request signing, structured logging and error tracking.",
    highlights: [
      "GraphQL (Yoga) & REST APIs",
      "Prisma ORM across 3 databases",
      "JWT / OAuth SSO + request signing",
      "Winston logging · Sentry tracking",
    ],
    stack: ["Node.js", "Nitro", "GraphQL", "Prisma", "PostgreSQL"],
    period: "2025 — Present",
  },
  {
    name: "WRMS Analytics",
    category: "Data & Dashboards",
    tagline: "Turning waste-resource operations into decisions.",
    description:
      "Analytics dashboards for a waste-resource management platform, plus a hand in modernizing a legacy LoopBack 4 / React stack toward Nitro + Next.js.",
    highlights: [
      "deck.gl geospatial visualization",
      "ECharts & Recharts dashboards",
      "LoopBack 4 → Nitro / Next.js migration",
      "PowerBI reporting",
    ],
    stack: ["React", "deck.gl", "ECharts", "LoopBack 4"],
    period: "2025 — Present",
  },
];

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  current?: boolean;
  summary: string;
  tags: string[];
};

export const experiences: Experience[] = [
  {
    company: "FatHopes Energy",
    role: "Full-Stack Developer",
    period: "Nov 2025 — Present",
    location: "Subang, Malaysia",
    current: true,
    summary:
      "Building and maintaining the web & mobile platforms behind FatHopes Energy's UCO collection and energy-feedstock trading across multiple countries — end-to-end, from schema and API design to the interfaces vendors and internal teams use daily.",
    tags: [
      "TypeScript",
      "Next.js",
      "React",
      "Flutter",
      "Nitro",
      "GraphQL",
      "Prisma",
      "Azure",
    ],
  },
  {
    company: "Juta Teknologi",
    role: "Back-End Developer",
    period: "Nov 2024 — Nov 2025",
    location: "Selangor, Malaysia",
    summary:
      "Owned backend development, database integration, server logic and API design. Optimized system performance, handled bug tracking & resolution, and supported the team through testing and technical guidance.",
    tags: ["Node.js", "APIs", "Databases", "System Integration"],
  },
  {
    company: "Juta Teknologi",
    role: "Chatbot Developer",
    period: "Feb 2024 — Jul 2024",
    location: "Shah Alam, Malaysia",
    summary:
      "Designed and implemented AI-driven chatbots for businesses — building conversational workflows, integrating AI with business processes, and deploying reliable experiences for clients.",
    tags: ["AI Chatbots", "NLP", "Integrations"],
  },
  {
    company: "Cabletronic Computers",
    role: "Computer Technician",
    period: "Jan 2021 — Jun 2021",
    location: "Seremban, Malaysia",
    summary:
      "Diagnosed hardware and software issues, carried out repairs on laptops and PCs, and ensured timely delivery of serviced devices to clients.",
    tags: ["Hardware", "Diagnostics", "Repair"],
  },
];

export type Education = {
  school: string;
  degree: string;
  field: string;
  period: string;
};

export const education: Education[] = [
  {
    school: "Universiti Teknologi MARA",
    degree: "Master of Science in Information Technology",
    field: "Information Technology",
    period: "Oct 2024 — Feb 2026",
  },
  {
    school: "Universiti Teknologi MARA",
    degree: "BSc (Hons) Information Systems",
    field: "Intelligent Systems Engineering",
    period: "Mar 2022 — Aug 2024",
  },
  {
    school: "Universiti Teknologi MARA",
    degree: "Diploma in Computer Science",
    field: "Computer & Information Sciences",
    period: "Oct 2018 — Sep 2021",
  },
];

export const navLinks = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;
