import { experiences } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/Reveal";

export function Experience() {
  return (
    <section id="experience" className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading eyebrow="Journey" title="Where I've" accent="worked" />

        <div className="relative mt-14">
          <div
            aria-hidden
            className="absolute bottom-2 left-[7px] top-2 w-px"
            style={{
              background:
                "linear-gradient(180deg, var(--aurora-1), rgba(180,91,207,0.08))",
            }}
          />
          <ul className="space-y-8">
            {experiences.map((e, i) => (
              <li key={i} className="relative pl-8">
                <span className="absolute left-0 top-2 flex h-4 w-4 items-center justify-center">
                  {e.current && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/40" />
                  )}
                  <span
                    className="relative h-2.5 w-2.5 rounded-full"
                    style={{
                      background: e.current
                        ? "var(--aurora-1)"
                        : "rgba(180,91,207,0.5)",
                      boxShadow: e.current
                        ? "0 0 0 4px rgba(180,91,207,0.16)"
                        : "none",
                    }}
                  />
                </span>

                <Reveal delay={i * 0.05}>
                  <div className="glass-card p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="text-lg font-semibold text-ink">
                        {e.role}{" "}
                        <span className="font-normal text-ink-dim">
                          · {e.company}
                        </span>
                      </h3>
                      <span className="font-mono text-xs text-ink-faint">
                        {e.period}
                      </span>
                    </div>
                    <p className="mt-1 flex items-center gap-2 text-xs text-ink-faint">
                      {e.location}
                      {e.current && (
                        <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-emerald-300">
                          Current
                        </span>
                      )}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-dim">
                      {e.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {e.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-ink-dim"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
