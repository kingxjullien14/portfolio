import { education } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { CapIcon } from "@/components/icons";

export function Education() {
  return (
    <section id="education" className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Education"
          title={
            <>
              Studied at <span className="aurora-text">UiTM</span>
            </>
          }
          intro="Universiti Teknologi MARA — from a diploma through to a Master's in Information Technology."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {education.map((ed, i) => (
            <Reveal key={i} delay={i * 0.08} className="h-full">
              <div className="glass-card flex h-full flex-col p-6">
                <div className="flex items-center justify-between">
                  <span
                    className="grid h-11 w-11 place-items-center rounded-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(122,92,255,0.25), rgba(180,91,207,0.25))",
                      border: "1px solid rgba(180,91,207,0.3)",
                    }}
                  >
                    <CapIcon className="h-5 w-5 text-accent-bright" />
                  </span>
                  <span className="font-mono text-xs text-ink-faint">
                    {ed.period}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-semibold leading-snug text-ink">
                  {ed.degree}
                </h3>
                <p className="mt-1.5 text-sm text-ink-dim">{ed.field}</p>
                <p className="mt-auto pt-4 text-sm text-accent-bright">
                  {ed.school}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
