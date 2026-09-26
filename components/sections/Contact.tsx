import { ArrowUpRight, DownloadSimple, EnvelopeSimple, GithubLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import { profile, socials } from "@/lib/data";
import { SectionHead } from "@/components/ui/SectionHead";
import { CopyEmail } from "@/components/contact/CopyEmail";
import { ShiftSummary } from "@/components/contact/ShiftSummary";

const icons = { github: GithubLogo, linkedin: LinkedinLogo } as const;

export function Contact() {
  return (
    <section id="contact" className="seam section-pad" aria-labelledby="contact-title">
      <div className="frame">
        <SectionHead id="contact-title" title="Open a channel">
          {profile.contactNote}
        </SectionHead>

        <div className="housing mt-[calc(var(--cell)*2)] p-[calc(var(--cell)*0.35)]" data-reveal="rise">
          <div className="well grid gap-[calc(var(--cell)*1)] p-[calc(var(--cell)*0.9)] md:grid-cols-[1fr_auto] md:items-center md:p-[calc(var(--cell)*1.3)]">
            <div className="grid gap-2">
              <a
                href={`mailto:${profile.email}`}
                className="w-max max-w-full break-all text-[clamp(1.35rem,3.4vw,2.6rem)] leading-tight font-semibold tracking-tight text-flap-ink underline decoration-white/20 decoration-1 underline-offset-[0.2em] hover:decoration-white/60"
              >
                {profile.email}
              </a>
              <ShiftSummary />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a href={`mailto:${profile.email}`} className="callbtn">
                <EnvelopeSimple weight="bold" className="size-4" aria-hidden />
                Email me
              </a>
              <CopyEmail email={profile.email} />
            </div>
          </div>
        </div>

        <ul className="mt-[calc(var(--cell)*0.9)] flex flex-wrap gap-3" data-reveal="rise" style={{ "--d": "120ms" } as React.CSSProperties}>
          {socials.map((s) => {
            const Icon = icons[s.icon];
            return (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="keycap">
                  <Icon weight="bold" className="size-4" aria-hidden />
                  {s.label}
                  <span className="text-ink-3">{s.handle}</span>
                  <ArrowUpRight weight="bold" className="size-3.5" aria-hidden />
                </a>
              </li>
            );
          })}
          <li>
            <a href={profile.resumeUrl} download className="keycap">
              <DownloadSimple weight="bold" className="size-4" aria-hidden />
              Download CV
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
