"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import { navLinks, profile } from "@/lib/data";
import { EASE } from "@/lib/motion";

export function Nav() {
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    navLinks.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  function go(id: string) {
    setOpen(false);
    const target = document.getElementById(id);
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: -90 });
    else target.scrollIntoView({ behavior: "smooth" });
  }
  function goTop() {
    setOpen(false);
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div className="container-x">
          <nav
            className={`mt-3 flex items-center justify-between gap-3 rounded-full px-3 py-2.5 transition-all duration-500 ${
              scrolled ? "glass" : ""
            }`}
          >
            <button
              onClick={goTop}
              className="group flex items-center gap-2.5"
              aria-label="Back to top"
              data-cursor="hover"
            >
              <span
                className="grid h-9 w-9 place-items-center rounded-full text-sm font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, var(--aurora-2), var(--aurora-1))",
                  boxShadow: "0 4px 16px -4px rgba(180,91,207,0.7)",
                }}
              >
                JN
              </span>
              <span className="hidden text-sm font-medium text-ink sm:block">
                {profile.name}
              </span>
            </button>

            <ul className="hidden items-center gap-1 md:flex">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => go(l.id)}
                    data-cursor="hover"
                    className={`relative rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                      active === l.id ? "text-white" : "text-ink-dim hover:text-ink"
                    }`}
                  >
                    {active === l.id && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full"
                        style={{
                          background: "rgba(180,91,207,0.16)",
                          border: "1px solid rgba(180,91,207,0.35)",
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <button
                onClick={() => go("contact")}
                data-cursor="hover"
                className="hidden rounded-full px-4 py-2 text-sm font-medium text-white sm:inline-flex"
                style={{
                  background:
                    "linear-gradient(120deg, var(--aurora-2), var(--aurora-1) 60%, var(--aurora-3))",
                  boxShadow: "0 8px 24px -10px rgba(180,91,207,0.7)",
                }}
              >
                Let&apos;s talk
              </button>
              <button
                onClick={() => setOpen((v) => !v)}
                className="grid h-9 w-9 place-items-center rounded-full glass md:hidden"
                aria-label="Toggle menu"
                aria-expanded={open}
              >
                <span className="relative block h-3 w-4">
                  <span
                    className={`absolute left-0 block h-0.5 w-4 rounded bg-ink transition-all duration-300 ${
                      open ? "top-1.5 rotate-45" : "top-0"
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-1.5 block h-0.5 w-4 rounded bg-ink transition-all duration-300 ${
                      open ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <span
                    className={`absolute left-0 block h-0.5 w-4 rounded bg-ink transition-all duration-300 ${
                      open ? "top-1.5 -rotate-45" : "top-3"
                    }`}
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-void/80 backdrop-blur-xl"
              onClick={() => setOpen(false)}
            />
            <motion.ul
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              className="glass absolute inset-x-4 top-20 space-y-1 rounded-3xl p-3"
            >
              {navLinks.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => go(l.id)}
                    className={`block w-full rounded-2xl px-4 py-3 text-left text-lg ${
                      active === l.id ? "text-white" : "text-ink-dim"
                    }`}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => go("contact")}
                  className="mt-1 block w-full rounded-2xl px-4 py-3 text-left text-lg font-medium text-white"
                  style={{
                    background: "linear-gradient(120deg, var(--aurora-2), var(--aurora-1))",
                  }}
                >
                  Let&apos;s talk
                </button>
              </li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
