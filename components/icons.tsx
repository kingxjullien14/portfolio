import type { ReactNode, SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

function Stroke({ children, ...p }: P & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      {children}
    </svg>
  );
}

/* ---- brand / contact ---- */
export const GitHubIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.021C22 6.484 17.523 2 12 2z" />
  </svg>
);

export const LinkedInIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
  </svg>
);

export const MailIcon = (p: P) => (
  <Stroke {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 7.5 8.5 6 8.5-6" />
  </Stroke>
);

/* ---- ui ---- */
export const ArrowUpRight = (p: P) => (
  <Stroke {...p}>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </Stroke>
);

export const ArrowDown = (p: P) => (
  <Stroke {...p}>
    <path d="M12 5v14" />
    <path d="m5 12 7 7 7-7" />
  </Stroke>
);

export const DownloadIcon = (p: P) => (
  <Stroke {...p}>
    <path d="M12 3v12" />
    <path d="m7 10 5 5 5-5" />
    <path d="M5 21h14" />
  </Stroke>
);

export const CheckIcon = (p: P) => (
  <Stroke {...p}>
    <path d="m4 12 5 5L20 6" />
  </Stroke>
);

export const MapPinIcon = (p: P) => (
  <Stroke {...p}>
    <path d="M20 10c0 5-8 12-8 12s-8-7-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="2.6" />
  </Stroke>
);

export const CapIcon = (p: P) => (
  <Stroke {...p}>
    <path d="M22 9 12 4 2 9l10 5 10-5z" />
    <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
  </Stroke>
);

/* ---- skill group glyphs ---- */
const GlobeIcon = (p: P) => (
  <Stroke {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c2.6 2.7 3.9 5.9 3.9 9s-1.3 6.3-3.9 9c-2.6-2.7-3.9-5.9-3.9-9s1.3-6.3 3.9-9z" />
  </Stroke>
);
const MobileIcon = (p: P) => (
  <Stroke {...p}>
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
    <path d="M11 18.5h2" />
  </Stroke>
);
const ServerIcon = (p: P) => (
  <Stroke {...p}>
    <rect x="3" y="4" width="18" height="7" rx="1.6" />
    <rect x="3" y="13" width="18" height="7" rx="1.6" />
    <path d="M7 7.5h.01M7 16.5h.01" />
  </Stroke>
);
const DatabaseIcon = (p: P) => (
  <Stroke {...p}>
    <ellipse cx="12" cy="5" rx="8" ry="3" />
    <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
    <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
  </Stroke>
);
const CloudIcon = (p: P) => (
  <Stroke {...p}>
    <path d="M17.5 18.5H7A4 4 0 0 1 6.5 10.55 6 6 0 0 1 18.16 9.5 4.25 4.25 0 0 1 17.5 18.5z" />
  </Stroke>
);
const SparkIcon = (p: P) => (
  <Stroke {...p}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
  </Stroke>
);

export const skillIcons = {
  web: GlobeIcon,
  mobile: MobileIcon,
  server: ServerIcon,
  database: DatabaseIcon,
  cloud: CloudIcon,
  spark: SparkIcon,
} as const;

export const socialIcons = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  mail: MailIcon,
} as const;
