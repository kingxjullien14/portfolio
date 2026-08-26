import { projects } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { CheckIcon } from "@/components/icons";

export function Projects() {
  return (
    <section id="work" className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Selected Work"
          title={
            <>
              Things I&apos;ve <span className="aurora-text">shipped</span>
            </>
          }
          intro="Production platforms behind FatHopes Energy's used-cooking-oil collection and energy-feedstock trading operations."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={(i % 2) * 0.08} className="h-full">
              <TiltCard className="h-full">
                <div className="flex h-full flex-col p-7 sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <span className="eyebrow">{p.category}</span>
                    <span className="font-mono text-xs text-ink-faint">
                      {p.period}
                    </span>
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-ink">{p.name}</h3>
                  <p className="mt-2 text-sm font-medium text-accent-bright">
                    {p.tagline}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-dim">
                    {p.description}
                  </p>
                  <ul className="mt-5 grid gap-2">
                    {p.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2.5 text-sm text-ink-dim"
                      >
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
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
