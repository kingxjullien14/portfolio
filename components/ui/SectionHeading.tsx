"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  align?: "left" | "center";
}) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Reveal>
        <div className={`flex items-center gap-3 ${center ? "justify-center" : ""}`}>
          <span className="h-px w-8 bg-accent/60" />
          <span className="eyebrow">{eyebrow}</span>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-4 text-4xl font-semibold text-ink sm:text-5xl">{title}</h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.1}>
          <p className="mt-4 text-base leading-relaxed text-ink-dim sm:text-lg">
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
