# Jullien Nazreen · Portfolio

A portfolio built as a **dispatch room**: enamel control panels, a split-flap
board that flips the name in and lists every system in service, amber lamps
for anything live, and working recreations of the apps themselves.

Live at [jullienazreen.com](https://www.jullienazreen.com).

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19.2** + **TypeScript**
- **Tailwind CSS v4** with CSS-first tokens in [`app/globals.css`](app/globals.css)
- **Lenis** for smooth scrolling, **Framer Motion** for scroll-linked motion
- **Web Animations API** for the split-flap engine ([`lib/flap.ts`](lib/flap.ts))
- **Phosphor** icons; **Archivo** (width axis 62 to 125) as the house face

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
pnpm start      # serve the production build
pnpm lint       # eslint
```

## Editing content

**All copy lives in [`lib/data.ts`](lib/data.ts).** It holds the profile, the
seven units (board labels, summaries, handover notes, what was built, stack),
the kitchen-to-refinery stations, the patch-bay wiring, about, experience and
education. House style: plain and specific, first person in the handover
notes, and no em or en dashes.

- **Photo:** `public/jullien.png` (square, subject centred near the top).
- **CV:** `public/Jullien-Nazreen-CV.pdf` ("Download CV" links here).
- **Board labels** are 14 characters max; the stack column is 7, status 5.

## How it is put together

```
app/                    layout (fonts, boot script), page, tokens, OG image, icons
components/board/       FlapDisplay (split-flap cells), DepartureBoard, Lamp
components/console/     ConsoleStrip (nav keys, now-showing display), NightShift
components/sections/    Hero, Flow (mimic panel), Units, Toolkit (patch bay),
                        Operator, Record, Contact, Footer
components/units/       Bay (one console bay per unit), StampOnView
components/mockups/     MockScreen (scaling system), frames, registry, and one
                        folder per recreated app
lib/                    data.ts, flap.ts, shift-log.ts, use-reduced-motion.ts
```

### The recreated apps

Every FatHopes Energy screen on the site is a **recreation with synthetic
data**: invented outlets, people, prices and volumes, no real screenshots,
no company logos. Each lives in its own folder under `components/mockups/`
and is written at a fixed design size inside `MockScreen`, which re-points
Tailwind spacing, type and radii at one design pixel (`--mu`), so a screen
scales to any width with no JavaScript. The registry decides which screen
sits in which bay.

### Motion rules

- The board flips in once on load; bay headers flip in when they scroll into view.
- Amber is rationed to lit state: live units, the section in view, flowing oil,
  the call button.
- Everything honours `prefers-reduced-motion`: flaps settle instantly, the
  Flow panel stops pinning, reveals are skipped. Without JavaScript all
  content is visible.

### Night shift

The toggle in the console strip swaps the enamel to graphite. The choice is
stored in `localStorage` (`shift`) and restored before first paint; the first
visit follows the system colour scheme.

## Deploying

Vercel, zero config. Update `metadataBase` in [`app/layout.tsx`](app/layout.tsx)
if the domain changes.
