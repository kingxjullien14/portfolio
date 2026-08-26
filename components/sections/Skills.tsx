import { skillGroups } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { skillIcons } from "@/components/icons";

const marquee = [
  "Next.js",
  "React",
  "TypeScript",
  "Flutter",
  "Node.js",
  "Nitro",
  "GraphQL",
  "Prisma",
  "PostgreSQL",
  "Tailwind CSS",
  "Azure",
  "Docker",
];

export function Skills() {
  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Toolkit"
          title="What I build with"
          intro="A full-stack toolkit spanning web, mobile, backend, data and cloud — chosen for shipping reliable software fast."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g, i) => {
            const Icon = skillIcons[g.icon];
            return (
              <Reveal key={g.title} delay={(i % 3) * 0.06} className="h-full">
                <div className="glass-card h-full p-6">
                  <div className="flex items-center gap-3">
                    <span
                      className="grid h-11 w-11 place-items-center rounded-xl"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(122,92,255,0.25), rgba(180,91,207,0.25))",
                        border: "1px solid rgba(180,91,207,0.3)",
                      }}
                    >
                      <Icon className="h-5 w-5 text-accent-bright" />
                    </span>
                    <h3 className="text-lg font-semibold text-ink">{g.title}</h3>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {g.items.map((it) => (
                      <li
                        key={it}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-ink-dim"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* core tech ticker */}
        <div
          className="relative mt-12 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
          }}
        >
          <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
            {[...marquee, ...marquee].map((t, i) => (
              <span
                key={i}
                className="font-display text-lg font-medium text-ink-faint"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
