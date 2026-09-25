# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: peers in the tech community, founders, and potential collaborators, mostly people working in or near clean energy, logistics and fintech. They arrive from a GitHub or LinkedIn link or a shared URL, on a laptop or a phone, and decide within about a minute whether Jullien is someone worth talking to. (Confirmed by Jullien on 2026-09-25 via the decision page: "Show the work, start conversations".)

Secondary: recruiters who land on the site anyway. They are not the target. Jullien is not job-hunting, and the site should not read like a job application.

## Product Purpose

Personal portfolio of Jullien Nazreen, a full-stack developer at FatHopes Energy in Malaysia. It shows the production systems Jullien has shipped (FatHopes' used-cooking-oil collection and energy-feedstock trading platforms) alongside Jullien's own products (OSAI, Stone and Chisel), as confidential-safe recreations of the real interfaces.

Success: a visitor is convinced by the work itself, not by adjectives, and starts a conversation by email, LinkedIn or GitHub.

## Positioning

The work is shown, not described. Instead of stock project cards, the site recreates the interfaces Jullien actually built as live mockups with synthetic data: a field-logistics mobile app used by collectors and restaurants, trading and vendor portals with sealed digital contracts, geospatial operations dashboards, and the personal desktop and editor products. Few developer portfolios can show one person's work spanning a physical supply chain (kitchen oil to clean-energy feedstock) across mobile, web, backend and data.

## Operating Context

- Visitors skim first, then dig into one or two pieces of work that catch them.
- Linked from LinkedIn (jullien-nazreen) and GitHub (kingxjullien14); lives at jullienazreen.com on Vercel.
- The ask is a conversation. The CV download exists for people who want it.

## Capabilities and Constraints

- Stack already in place: Next.js 16 App Router, React 19.2, Tailwind CSS v4, Framer Motion 13, Lenis. Content lives in `lib/data.ts` as the single source of truth.
- Confidentiality is a hard constraint: no real screenshots of FatHopes apps, no real customer, vendor, outlet, company or person names, no real prices, volumes, contract terms, internal URLs or keys. Every mockup uses synthetic data and is labeled as a recreation.
- Personal projects (OSAI, Stone and Chisel) may be shown in full; they are Jullien's own.

## Brand Commitments

- Name: Jullien Nazreen. Domain jullienazreen.com. Email jullienazreen@gmail.com. GitHub kingxjullien14. LinkedIn jullien-nazreen.
- Voice: plain, specific and confident. Current line kept in spirit: not job-hunting, always up for a good conversation about clean energy, logistics and fintech.
- Motion commitments from Jullien (2026-09-25): keep Lenis smooth scrolling and Revelo-style text motion (split-text reveals, scroll read-along), and add something more on top.
- The previous purple aurora and glass look is rejected by Jullien as blunt and "AI slop". It is evidence of content only, not a style to preserve.

## Evidence on Hand

- `lib/data.ts`: profile, experience, education, skills, stats and project summaries.
- Experience: FatHopes Energy, Full-Stack Developer (Nov 2025 to present); Juta Teknologi, Back-End Developer (Nov 2024 to Nov 2025) and Chatbot Developer (Feb to Jul 2024); Cabletronic Computers, Computer Technician (Jan to Jun 2021).
- Education: Universiti Teknologi MARA. MSc Information Technology (Oct 2024 to Feb 2026), BSc (Hons) Information Systems, Intelligent Systems Engineering (2022 to 2024), Diploma in Computer Science (2018 to 2021).
- Stats already claimed on the site: 5+ platforms and portals shipped, 9 languages localized in the production mobile app, 3 databases in production (Postgres, MySQL, Mongo), 3 targets from one codebase (iOS, Android, Web).
- FatHopes work: Vendor App (Flutter; collector GPS tracking, in-app payments and withdrawals, face-recognition onboarding, 9-language localization, push notifications), Vendor Portal and Energy-Trading Portal (Next.js; multi-step KYC, negotiated purchase requests, HMAC-sealed e-signatures, RBAC), the type-safe API platform (Nitro, GraphQL Yoga, Prisma), WRMS analytics dashboards (deck.gl, ECharts, Recharts).
- Personal products: OSAI and Stone and Chisel (see their repos under `C:\FHE-Work`).
- Assets: portrait `public/jullien.png` (1024 square), CV `public/Jullien-Nazreen-CV.pdf`.
- Absent, never to be fabricated: testimonials, client logos, usage numbers, revenue, awards, or any metric beyond the stats above.

## Product Principles

1. Show the work, do not describe it. A recreated interface beats a paragraph about it.
2. Confidential by construction. Synthetic data everywhere, clearly labeled.
3. Specific over impressive. Real stack names, real problems, real scope; no inflated claims.
4. Motion serves reading. Text motion and smooth scrolling guide attention; nothing moves just to move.

## Accessibility & Inclusion

Honor `prefers-reduced-motion` for every animation, keep full keyboard navigation, and hold WCAG AA contrast for all text.
