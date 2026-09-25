import { ArrowUp } from "@phosphor-icons/react/dist/ssr";
import { profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="pb-[calc(var(--cell)*1.2)]">
      <div className="frame">
        <div className="flex flex-col gap-4 border-t border-line pt-[calc(var(--cell)*0.9)] text-[0.875rem] text-ink-3 md:flex-row md:items-center md:justify-between">
          <p>
            <span className="font-semibold text-ink-2">{profile.name}</span>, {profile.role.toLowerCase()} in {profile.location}.
          </p>
          <p>Built with Next.js, Lenis and Motion. © {new Date().getFullYear()}</p>
          <a href="#top" className="inline-flex items-center gap-1.5 font-semibold text-ink-2 hover:text-ink">
            Back to the board
            <ArrowUp weight="bold" className="size-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
