"use client";

import { useLenis } from "lenis/react";
import { navLinks, profile, socials } from "@/lib/data";
import { socialIcons, ArrowUpRight } from "@/components/icons";

export function Footer() {
  const lenis = useLenis();
  const year = new Date().getFullYear();

  function go(id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: -90 });
    else target.scrollIntoView({ behavior: "smooth" });
  }
  function goTop() {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="relative mt-10 border-t border-white/5">
      <div className="container-x py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <button
              onClick={goTop}
              className="aurora-text text-2xl font-semibold"
              data-cursor="hover"
            >
              {profile.name}
            </button>
            <p className="mt-3 text-sm leading-relaxed text-ink-dim">
              Full-Stack Developer building web &amp; mobile platforms for clean
              energy, logistics &amp; fintech.
            </p>
            <div className="mt-5 flex gap-3">
              {socials.map((s) => {
                const Icon = socialIcons[s.icon];
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.icon !== "mail" ? "_blank" : undefined}
                    rel="noreferrer"
                    aria-label={s.label}
                    data-cursor="hover"
                    className="grid h-10 w-10 place-items-center rounded-full glass text-ink-dim transition-colors hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <span className="eyebrow mb-2">Navigate</span>
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="w-max text-left text-sm text-ink-dim transition-colors hover:text-ink"
                data-cursor="hover"
              >
                {l.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-xs text-ink-faint sm:flex-row">
          <p>© {year} {profile.name}. All rights reserved.</p>
          <p>Built with Next.js, Tailwind CSS &amp; Framer Motion.</p>
          <button
            onClick={goTop}
            className="inline-flex items-center gap-1 transition-colors hover:text-ink"
            data-cursor="hover"
          >
            Back to top <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
