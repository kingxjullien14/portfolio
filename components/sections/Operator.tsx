import Image from "next/image";
import { about, profile } from "@/lib/data";
import { Lamp } from "@/components/board/Lamp";
import { ReadAlong } from "@/components/text/ReadAlong";
import { SplitText } from "@/components/text/SplitText";

export function Operator() {
  return (
    <section id="about" className="seam section-pad" aria-labelledby="about-title">
      <div className="frame grid gap-[calc(var(--cell)*1.6)] lg:grid-cols-[calc(var(--cell)*12)_1fr] lg:gap-[calc(var(--cell)*2.2)]">
        {/* the operator's badge */}
        <div className="lg:sticky lg:top-[calc(56px+var(--cell)*1.5)] lg:self-start" data-reveal="rise">
          <div className="enamel badge overflow-hidden">
            <div className="flex items-center justify-between px-[calc(var(--cell)*0.6)] py-[calc(var(--cell)*0.45)]">
              <span className="engraved text-ink-2">Operator on duty</span>
              <Lamp lit label="On shift" size="0.6rem" />
            </div>
            <div className="relative mx-[calc(var(--cell)*0.6)] aspect-[4/4.6] overflow-hidden rounded-[4px] bg-sunk">
              <Image
                src={profile.photo}
                alt={`Portrait of ${profile.name}`}
                fill
                sizes="(max-width: 1024px) 90vw, 380px"
                className="badge-photo object-cover object-[50%_18%]"
              />
            </div>
            <dl className="grid gap-[calc(var(--cell)*0.35)] px-[calc(var(--cell)*0.6)] pb-[calc(var(--cell)*0.6)] pt-[calc(var(--cell)*0.55)]">
              <div>
                <dt className="sr-only">Name</dt>
                <dd className="display text-[2.1rem] text-ink">{profile.name}</dd>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[0.875rem]">
                <div>
                  <dt className="engraved text-ink-3">Role</dt>
                  <dd className="mt-1 text-ink">{profile.role}</dd>
                </div>
                <div>
                  <dt className="engraved text-ink-3">Company</dt>
                  <dd className="mt-1 text-ink">{profile.company}</dd>
                </div>
                <div>
                  <dt className="engraved text-ink-3">On shift since</dt>
                  <dd className="mt-1 text-ink tnum">{profile.onShiftSince}</dd>
                </div>
                <div>
                  <dt className="engraved text-ink-3">Based in</dt>
                  <dd className="mt-1 text-ink">Greater Kuala Lumpur</dd>
                </div>
              </div>
            </dl>
          </div>
        </div>

        <div className="grid content-start gap-[calc(var(--cell)*1.2)]">
          <SplitText as="h2" id="about-title" text="Who runs the board" className="display text-[clamp(2.75rem,6.4vw,5.6rem)] text-ink" />
          <ReadAlong text={about.lead} className="max-w-[30ch] text-[clamp(1.55rem,2.7vw,2.35rem)] leading-[1.22] font-medium text-ink" />
          <div className="grid max-w-[60ch] gap-4 text-ink-2" data-reveal="rise">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="grid gap-[calc(var(--cell)*0.6)] md:grid-cols-2" data-reveal="rise">
            <div className="enamel-sunk p-[calc(var(--cell)*0.6)]">
              <p className="engraved text-ink-3">Drawn to</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {about.focus.map((f) => (
                  <li key={f} className="tag">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="enamel-sunk p-[calc(var(--cell)*0.6)]">
              <p className="engraved text-ink-3">On the record</p>
              <ul className="mt-3 grid gap-1.5 text-[0.9375rem] text-ink-2">
                {about.facts.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <span className="mt-[0.55em] size-1.5 shrink-0 rounded-[1px] bg-ink-3" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
