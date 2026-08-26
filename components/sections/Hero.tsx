"use client";

import { motion, type Variants } from "framer-motion";
import { profile, socials } from "@/lib/data";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowDown, DownloadIcon, socialIcons } from "@/components/icons";
import { EASE } from "@/lib/motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};
const nameLine: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center pb-24 pt-28"
    >
      <div className="container-x">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl"
        >
          <motion.div
            variants={item}
            className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-ink-dim"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {profile.availability}
          </motion.div>

          <motion.p variants={item} className="eyebrow mt-6">
            {profile.role} · {profile.location}
          </motion.p>

          <h1 className="text-glow mt-4 text-[clamp(3rem,11vw,8.5rem)] font-semibold leading-[0.95] tracking-tight">
            <motion.span variants={nameLine} className="aurora-text shimmer block">
              {profile.firstName}
            </motion.span>
            <motion.span variants={nameLine} className="aurora-text shimmer block">
              {profile.lastName}
            </motion.span>
          </h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-2xl text-xl font-medium leading-snug text-ink sm:text-2xl"
          >
            {profile.heroLead}.
          </motion.p>
          <motion.p
            variants={item}
            className="mt-4 max-w-xl text-base leading-relaxed text-ink-dim"
          >
            {profile.heroSub}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <MagneticButton href="#work" variant="primary">
              View my work <ArrowDown className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton href={profile.resumeUrl} download variant="ghost">
              Download CV <DownloadIcon className="h-4 w-4" />
            </MagneticButton>
          </motion.div>

          <motion.div variants={item} className="mt-8 flex items-center gap-4">
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
                  className="text-ink-faint transition-colors hover:text-ink"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center"
      >
        <a
          href="#about"
          aria-label="Scroll to about"
          data-cursor="hover"
          className="pointer-events-auto flex h-9 w-5 justify-center rounded-full border border-white/20 pt-1.5"
        >
          <span
            className="h-1.5 w-1 rounded-full bg-accent"
            style={{ animation: "scroll-dot 1.8s ease-in-out infinite" }}
          />
        </a>
      </motion.div>
    </section>
  );
}
