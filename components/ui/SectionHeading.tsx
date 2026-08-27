"use client";

import { Reveal } from "@/components/Reveal";
import { SplitText } from "@/components/text/SplitText";

export function SectionHeading({
  eyebrow,
  title,
  accent,
  intro,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  accent?: string;
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
      <h2 className="mt-4 text-5xl font-bold text-ink sm:text-6xl">
        <SplitText text={title} by="word" />
        {accent ? (
          <>
            {" "}
            <SplitText
              text={accent}
              by="word"
              innerClassName="aurora-text"
              delay={0.08}
            />
          </>
        ) : null}
      </h2>
      {intro && (
        <Reveal delay={0.15}>
          <p className="mt-4 text-base leading-relaxed text-ink-dim sm:text-lg">
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
