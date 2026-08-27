import { profile, socials } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { socialIcons, MailIcon } from "@/components/icons";
import { SplitText } from "@/components/text/SplitText";

export function Contact() {
  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="container-x">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center sm:px-16 sm:py-24">
            <div
              aria-hidden
              className="absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(60% 60% at 50% 0%, rgba(180,91,207,0.22), transparent 70%)",
              }}
            />
            <span className="eyebrow">Contact</span>
            <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold text-ink sm:text-6xl">
              <SplitText text="Let's build something" by="word" />{" "}
              <SplitText
                text="worth shipping."
                by="word"
                innerClassName="aurora-text"
                delay={0.1}
              />
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-ink-dim">
              {profile.availability}. Whether it&apos;s an idea, a role, or a
              collaboration — my inbox is open.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <MagneticButton href={`mailto:${profile.email}`} variant="primary">
                <MailIcon className="h-4 w-4" /> {profile.email}
              </MagneticButton>
              <MagneticButton href={profile.resumeUrl} download variant="ghost">
                Download CV
              </MagneticButton>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {socials.map((s) => {
                const Icon = socialIcons[s.icon];
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.icon !== "mail" ? "_blank" : undefined}
                    rel="noreferrer"
                    aria-label={s.label}
                    data-cursor="hover"
                    className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-ink-dim transition-colors hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{s.handle}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
