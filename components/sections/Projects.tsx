"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { projects, type Project } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { CheckIcon, ArrowUpRight } from "@/components/icons";

function ProjectCard({ p }: { p: Project }) {
  return (
    <article className="glass-card flex h-full flex-col p-7 sm:p-9">
      <div className="flex items-center justify-between gap-4">
        <span className="eyebrow">{p.category}</span>
        <span className="font-mono text-xs text-ink-faint">{p.period}</span>
      </div>
      <h3 className="mt-5 text-2xl font-semibold text-ink sm:text-3xl">{p.name}</h3>
      <p className="mt-2 text-sm font-medium text-accent-bright">{p.tagline}</p>
      <p className="mt-4 text-sm leading-relaxed text-ink-dim">{p.description}</p>
      <ul className="mt-6 grid gap-2.5">
        {p.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2.5 text-sm text-ink-dim">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span>{h}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap gap-2 pt-6">
        {p.stack.map((s) => (
          <span
            key={s}
            className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-ink-dim"
          >
            {s}
          </span>
        ))}
      </div>
    </article>
  );
}

export function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [sectionH, setSectionH] = useState<number>();
  const x = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const vp = viewportRef.current;
      if (!track || !vp) return;
      const distance = Math.max(0, track.scrollWidth - vp.clientWidth);
      setSectionH(window.innerHeight + distance);
    };
    const id = window.setTimeout(measure, 80);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("resize", measure);
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const track = trackRef.current;
    const vp = viewportRef.current;
    if (!track || !vp) return;
    const distance = Math.max(0, track.scrollWidth - vp.clientWidth);
    x.set(-p * distance);
  });

  return (
    <section id="work">
      {/* mobile: vertical stack */}
      <div className="container-x py-24 md:hidden">
        <SectionHeading
          eyebrow="Selected Work"
          title="Things I've"
          accent="shipped"
          intro="Production platforms behind FatHopes Energy's UCO collection and energy-feedstock trading."
        />
        <div className="mt-12 grid gap-5">
          {projects.map((p) => (
            <Reveal key={p.name}>
              <ProjectCard p={p} />
            </Reveal>
          ))}
        </div>
      </div>

      {/* desktop: horizontal scroll */}
      <div
        ref={sectionRef}
        className="relative hidden min-h-screen md:block"
        style={{ height: sectionH ? `${sectionH}px` : undefined }}
      >
        <div
          ref={viewportRef}
          className="sticky top-0 flex h-screen flex-col overflow-hidden"
        >
          <div className="px-6 pb-8 pt-28 lg:px-10">
            <SectionHeading
              eyebrow="Selected Work"
              title="Things I've"
              accent="shipped"
            />
          </div>
          <div className="flex flex-1 items-center overflow-hidden">
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="flex items-stretch gap-6 px-6 lg:px-10"
            >
              {projects.map((p) => (
                <div key={p.name} className="w-[46vw] shrink-0 lg:w-[34vw]">
                  <ProjectCard p={p} />
                </div>
              ))}
              <div className="flex w-[34vw] shrink-0 items-center lg:w-[24vw]">
                <div>
                  <p className="eyebrow">What&apos;s next</p>
                  <p className="mt-4 text-3xl font-semibold text-ink">
                    Let&apos;s build the{" "}
                    <span className="aurora-text">next one.</span>
                  </p>
                  <a
                    href="#contact"
                    data-cursor="hover"
                    className="mt-6 inline-flex items-center gap-2 text-accent-bright transition-colors hover:text-white"
                  >
                    Get in touch <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
