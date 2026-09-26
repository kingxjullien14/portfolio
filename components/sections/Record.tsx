import { education, experiences } from "@/lib/data";
import { Lamp } from "@/components/board/Lamp";
import { SectionHead } from "@/components/ui/SectionHead";

export function Record() {
  return (
    <section id="experience" className="seam section-pad" aria-labelledby="experience-title">
      <div className="frame">
        <SectionHead id="experience-title" title="Service record">
          Where I have worked, newest first, and where I trained.
        </SectionHead>

        <ol className="enamel mt-[calc(var(--cell)*2)] divide-y divide-line px-[calc(var(--cell)*0.7)]">
          {experiences.map((e, i) => (
            <li
              key={e.role + e.period}
              className="grid gap-x-[calc(var(--cell)*1)] gap-y-2 py-[calc(var(--cell)*0.8)] md:grid-cols-[calc(var(--cell)*6.2)_1fr] lg:grid-cols-[calc(var(--cell)*6.2)_minmax(0,1fr)_minmax(0,1.3fr)]"
              data-reveal="rise"
              style={{ "--d": `${i * 70}ms` } as React.CSSProperties}
            >
              <p className="flex items-center gap-2.5 text-[0.9375rem] text-ink-3 tnum">
                <Lamp lit={e.current} size="0.55rem" label={e.current ? "Current role" : undefined} />
                {e.period}
              </p>
              <div>
                <h3 className="text-[1.25rem] leading-tight font-semibold text-ink">{e.role}</h3>
                <p className="mt-1 text-ink-2">
                  {e.company}
                  <span className="text-ink-3">, {e.location}</span>
                </p>
              </div>
              <p className="text-[0.9375rem] text-ink-2 md:col-start-2 lg:col-start-auto">{e.note}</p>
            </li>
          ))}
        </ol>

        <div id="education" className="enamel mt-[calc(var(--cell)*0.6)] scroll-mt-24 px-[calc(var(--cell)*0.7)]">
          <h3 className="engraved border-b border-line py-[calc(var(--cell)*0.5)] text-ink-2">Training</h3>
          <ol className="divide-y divide-line">
            {education.map((ed, i) => (
              <li
                key={ed.degree}
                className="grid gap-x-[calc(var(--cell)*1)] gap-y-1 py-[calc(var(--cell)*0.6)] md:grid-cols-[calc(var(--cell)*6.2)_1fr] lg:grid-cols-[calc(var(--cell)*6.2)_minmax(0,1fr)_minmax(0,1.3fr)]"
                data-reveal="rise"
                style={{ "--d": `${i * 70}ms` } as React.CSSProperties}
              >
                <p className="text-[0.9375rem] text-ink-3 tnum md:pl-[calc(0.55rem+0.625rem)]">{ed.period}</p>
                <p className="text-[1.0625rem] leading-snug font-semibold text-ink">{ed.degree}</p>
                <p className="text-[0.9375rem] text-ink-2 md:col-start-2 lg:col-start-auto">
                  {ed.school}
                  {ed.field ? <span className="text-ink-3">, {ed.field}</span> : null}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
