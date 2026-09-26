import { ArrowDown, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { profile } from "@/lib/data";
import { DepartureBoard } from "@/components/board/DepartureBoard";

export function Hero() {
  return (
    <section id="top" aria-label="Board" className="pt-[calc(56px+var(--cell)*0.85)] pb-[calc(var(--cell)*2.2)]">
      <div className="frame">
        <DepartureBoard />
        <div className="mt-[calc(var(--cell)*1)] grid gap-[calc(var(--cell)*0.9)] md:grid-cols-[1fr_auto] md:items-end">
          <p className="max-w-[46ch] text-[clamp(1.2rem,1.9vw,1.55rem)] leading-[1.35] font-medium text-balance text-ink" data-reveal="rise">
            {profile.thesis}
          </p>
          <div className="flex flex-wrap items-center gap-3" data-reveal="rise" style={{ "--d": "120ms" } as React.CSSProperties}>
            <a href="#work" className="keycap">
              View the work
              <ArrowDown weight="bold" className="size-3.5" aria-hidden />
            </a>
            <a href={`mailto:${profile.email}`} className="callbtn">
              <EnvelopeSimple weight="bold" className="size-4" aria-hidden />
              Email me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
