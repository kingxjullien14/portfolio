"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { profile, socials } from "@/lib/data";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowDown, DownloadIcon, socialIcons } from "@/components/icons";
import { EASE } from "@/lib/motion";
import { SplitText } from "@/components/text/SplitText";
import { AuroraShader } from "@/components/AuroraShader";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};
const nameLine: Variants = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
};

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden pb-24 pt-28"
    >
      {/* live energy field */}
      <AuroraShader className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen opacity-80" />
      {/* legibility wash */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, var(--color-void) 0%, rgba(5,2,8,0.4) 40%, transparent 75%), linear-gradient(0deg, var(--color-void), transparent 55%)",
        }}
      />

      <motion.div
        style={reduce ? undefined : { y, opacity }}
        className="container-x relative z-10"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-5xl"
        >
          <motion.div
            variants={item}
            className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-xs text-ink-dim"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {profile.status}
          </motion.div>

          <motion.p variants={item} className="eyebrow mt-6">
            {profile.role} · {profile.location}
          </motion.p>

          <h1 className="text-glow mt-4 text-[clamp(3.25rem,13vw,11rem)] font-bold leading-[0.9] tracking-[-0.04em]">
            <motion.span variants={nameLine} className="aurora-text shimmer block">
              {profile.firstName}
            </motion.span>
            <motion.span variants={nameLine} className="aurora-text shimmer block">
              {profile.lastName}
            </motion.span>
          </h1>

          <SplitText
            as="p"
            text={`${profile.heroLead}.`}
            by="word"
            blur={6}
            trigger="load"
            delay={0.8}
            duration={0.9}
            stagger={0.03}
            className="mt-8 max-w-2xl text-xl font-medium leading-snug text-ink sm:text-2xl"
          />

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center gap-3"
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center"
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
