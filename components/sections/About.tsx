import Image from "next/image";
import { about, profile } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { MapPinIcon } from "@/components/icons";
import { ScrollReveal } from "@/components/text/ScrollReveal";

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="container-x">
        <div className="grid items-center gap-14 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16">
          <Reveal className="relative mx-auto w-full max-w-sm md:mx-0">
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-4 rounded-[2rem] opacity-70 blur-2xl"
                style={{
                  background:
                    "radial-gradient(circle at 50% 30%, rgba(180,91,207,0.5), transparent 70%)",
                }}
              />
              <div className="glass relative rounded-[2rem] p-2">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem]">
                  <Image
                    src={profile.photo}
                    alt={profile.name}
                    fill
                    sizes="(max-width: 768px) 90vw, 380px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0">
                <div className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm text-ink">
                  <MapPinIcon className="h-4 w-4 text-accent" /> Kuala Lumpur, MY
                </div>
              </div>
            </div>
          </Reveal>

          <div>
            <SectionHeading eyebrow="About" title="Full-stack," accent="end to end." />
            <ScrollReveal
              text={about.lead}
              className="mt-6 text-lg leading-relaxed text-ink"
            />
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.15 + i * 0.05}>
                <p className="mt-4 leading-relaxed text-ink-dim">{p}</p>
              </Reveal>
            ))}
            <Reveal delay={0.3}>
              <div className="mt-7 flex flex-wrap items-center gap-2">
                <span className="eyebrow mr-1">Focus</span>
                {about.focus.map((f) => (
                  <span
                    key={f}
                    className="glass rounded-full px-3.5 py-1.5 text-sm text-ink-dim"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
