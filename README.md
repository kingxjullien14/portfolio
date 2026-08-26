# Jullien Nazreen — Portfolio

A modern, futuristic personal portfolio with a deep-space **aurora** aesthetic,
glassmorphism, and rich motion. Built to feel premium and load fast.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-first design tokens)
- **Framer Motion** — scroll reveals, magnetic buttons, 3D tilt, custom cursor
- **Lenis** — smooth scrolling
- Deployed on **Vercel**

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Other scripts:

```bash
pnpm build      # production build
pnpm start      # run the production build
pnpm lint       # eslint
```

## Editing your content

**All copy lives in one file: [`lib/data.ts`](lib/data.ts).** Edit it and the whole
site updates — no need to touch components. It holds:

- `profile` — name, role, hero copy, email, availability
- `socials` — GitHub / LinkedIn / email links
- `about`, `stats`, `skillGroups`, `projects`, `experiences`, `education`
- `navLinks` — nav order

### Replace the photo & CV

- **Photo:** replace `public/jullien.png` (portrait, ~4:5 works best).
- **CV:** replace `public/Jullien-Nazreen-CV.pdf` (the "Download CV" button links here).

### Change the accent color

The purple accent (`#B45BCF`) and the aurora palette are defined as tokens at the
top of [`app/globals.css`](app/globals.css) under `@theme` (`--color-accent`,
`--color-aurora-1/2/3`). Change them there.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) — zero config needed.
3. After you know your final URL, update `metadataBase` in
   [`app/layout.tsx`](app/layout.tsx) so social/SEO tags use the right domain.

## Nice-to-have next steps

- Add a custom **favicon** and a social **OG image** (`app/opengraph-image.png`).
- Wire the contact section to a real form (e.g. Resend / Formspree).

## Project structure

```
app/            layout, page, global styles
components/     Nav, Footer, Cursor, AuroraBackground, SmoothScroll, Reveal
  sections/    Hero, About, Stats, Skills, Projects, Experience, Education, Contact
  ui/          MagneticButton, TiltCard, Counter, SectionHeading
lib/           data.ts (content), motion.ts (shared animation variants)
public/        photo, CV
```
